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

    // Auth client for user validation
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Admin client to bypass RLS for membership check and deletions
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

    const { groupId } = await req.json();

    if (!groupId) {
      return new Response(
        JSON.stringify({ error: "groupId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is admin of this group using 'role' column (not 'is_admin')
    const { data: membership, error: memberError } = await supabaseAdmin
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single();

    if (memberError || membership?.role !== "admin") {
      console.error("Admin check failed:", memberError, "membership:", membership);
      return new Response(
        JSON.stringify({ error: "Only group admins can delete the group" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete in order: completions -> todos -> streaks -> members -> group
    console.log(`Deleting group ${groupId} by admin ${user.id}`);

    // Delete group todo completions
    await supabaseAdmin
      .from("group_todo_completions")
      .delete()
      .eq("group_id", groupId);

    // Delete group todos
    await supabaseAdmin
      .from("group_todos")
      .delete()
      .eq("group_id", groupId);

    // Delete group streaks
    await supabaseAdmin
      .from("group_streaks")
      .delete()
      .eq("group_id", groupId);

    // Delete group points config
    await supabaseAdmin
      .from("group_points_config")
      .delete()
      .eq("group_id", groupId);

    // Delete group members
    await supabaseAdmin
      .from("group_members")
      .delete()
      .eq("group_id", groupId);

    // Finally delete the group
    const { error: deleteError } = await supabaseAdmin
      .from("groups")
      .delete()
      .eq("id", groupId);

    if (deleteError) {
      console.error("Delete group error:", deleteError);
      return new Response(
        JSON.stringify({ error: deleteError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Group ${groupId} deleted successfully`);

    return new Response(
      JSON.stringify({ success: true, message: "Group deleted successfully" }),
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
