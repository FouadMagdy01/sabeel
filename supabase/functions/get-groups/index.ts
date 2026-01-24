import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Client scoped to the user (auth validation)
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Admin client for database reads (bypasses RLS). We still scope queries by user.id.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);

    // Support includePublic via query param OR JSON body.
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const includePublic =
      url.searchParams.get("includePublic") === "true" || body?.includePublic === true;

    // Get user's group memberships
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("group_members")
      .select("group_id, role")
      .eq("user_id", user.id);

    if (membershipsError) {
      console.error("Failed to fetch memberships:", membershipsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch memberships" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const memberGroupIds = (memberships || []).map(m => m.group_id);
    const membershipMap = new Map((memberships || []).map(m => [m.group_id, m.role === "admin"]));

    // Get user's groups
    const { data: userGroups, error: userGroupsError } = await supabaseAdmin
      .from("groups")
      .select("id, name, description, invite_code, is_public, created_by")
      .in("id", memberGroupIds.length > 0 ? memberGroupIds : ["00000000-0000-0000-0000-000000000000"]);

    if (userGroupsError) {
      console.error("Failed to fetch user groups:", userGroupsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch groups" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get member counts
    const { data: memberCounts, error: memberCountsError } = await supabaseAdmin
      .from("group_members")
      .select("group_id")
      .in("group_id", memberGroupIds.length > 0 ? memberGroupIds : ["00000000-0000-0000-0000-000000000000"]);

    if (memberCountsError) {
      console.error("Failed to fetch member counts:", memberCountsError);
    }

    const countMap = new Map<string, number>();
    (memberCounts || []).forEach(m => {
      countMap.set(m.group_id, (countMap.get(m.group_id) || 0) + 1);
    });

    const enrichedGroups = (userGroups || []).map(g => ({
      ...g,
      is_admin: membershipMap.get(g.id) || false,
      member_count: countMap.get(g.id) || 0,
      is_member: true,
    }));

    let publicGroups: any[] = [];
    if (includePublic) {
      const { data: pubGroups, error: pubGroupsError } = await supabaseAdmin
        .from("groups")
        .select("id, name, description, is_public")
        .eq("is_public", true);

      if (pubGroupsError) {
        console.error("Failed to fetch public groups:", pubGroupsError);
      }

      const filtered = (pubGroups || []).filter((g) => !memberGroupIds.includes(g.id));

      publicGroups = filtered.map(g => ({
        ...g,
        is_admin: false,
        member_count: 0,
        is_member: false,
      }));
    }

    console.log(`Fetched ${enrichedGroups.length} groups for user ${user.id}`);

    return new Response(
      JSON.stringify({
        myGroups: enrichedGroups,
        publicGroups,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
