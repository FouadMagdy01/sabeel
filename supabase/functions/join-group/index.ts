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
    
    // User client for auth validation and member operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Service role client to bypass RLS for group lookup by invite code
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { inviteCode, groupId } = await req.json();

    // Normalize invite code to UPPERCASE (codes are stored uppercase)
    const normalizedInviteCode =
      typeof inviteCode === "string" ? inviteCode.trim().toUpperCase() : undefined;

    let targetGroupId = groupId;

    // If invite code provided, find the group using admin client (bypasses RLS)
    if (normalizedInviteCode && !groupId) {
      const { data: group, error: findError } = await supabaseAdmin
        .from("groups")
        .select("id")
        .eq("invite_code", normalizedInviteCode)
        .maybeSingle();

      if (findError) {
        console.error("Find group error:", findError);
        return new Response(
          JSON.stringify({ error: "Failed to lookup invite code" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (!group) {
        return new Response(
          JSON.stringify({ error: "No group found with that invite code" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      targetGroupId = group.id;
    }

    if (!targetGroupId) {
      return new Response(
        JSON.stringify({ error: "Group ID or invite code required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if already a member (using admin to ensure we can see the membership)
    const { data: existing } = await supabaseAdmin
      .from("group_members")
      .select("id")
      .eq("group_id", targetGroupId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "Already a member of this group" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Join the group using admin client to bypass RLS (use 'role' column, not 'is_admin')
    const { error: joinError } = await supabaseAdmin
      .from("group_members")
      .insert({
        group_id: targetGroupId,
        user_id: user.id,
        role: "member",
      });

    if (joinError) {
      console.error("Join error:", joinError);
      return new Response(
        JSON.stringify({ error: joinError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure group streak exists (some environments don't have the trigger enabled)
    const { data: existingStreak, error: streakFindError } = await supabaseAdmin
      .from("group_streaks")
      .select("id")
      .eq("group_id", targetGroupId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (streakFindError) {
      console.error("Find streak error:", streakFindError);
    }

    if (!existingStreak) {
      const { error: streakInsertError } = await supabaseAdmin
        .from("group_streaks")
        .insert({
          group_id: targetGroupId,
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          total_points: 0,
        });

      if (streakInsertError) {
        console.error("Create streak error:", streakInsertError);
      }
    }

    // Get group details
    const { data: group } = await supabaseAdmin
      .from("groups")
      .select("id, name, description")
      .eq("id", targetGroupId)
      .single();

    console.log(`User ${user.id} joined group ${targetGroupId}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully joined group",
        group,
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
