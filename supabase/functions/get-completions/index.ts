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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date") || new Date().toISOString().split("T")[0];
    const groupId = url.searchParams.get("groupId");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // User todo completions
    let userCompletionsQuery = supabase
      .from("user_todo_completions")
      .select("id, todo_id, completion_date, points_earned, completed_at")
      .eq("user_id", user.id);

    if (startDate && endDate) {
      userCompletionsQuery = userCompletionsQuery
        .gte("completion_date", startDate)
        .lte("completion_date", endDate);
    } else {
      userCompletionsQuery = userCompletionsQuery.eq("completion_date", date);
    }

    const { data: userCompletions } = await userCompletionsQuery;

    // Group todo completions (if groupId provided)
    let groupCompletions: any[] = [];
    if (groupId) {
      let groupCompletionsQuery = supabase
        .from("group_todo_completions")
        .select("id, todo_id, group_id, completion_date, points_earned, completed_at")
        .eq("user_id", user.id)
        .eq("group_id", groupId);

      if (startDate && endDate) {
        groupCompletionsQuery = groupCompletionsQuery
          .gte("completion_date", startDate)
          .lte("completion_date", endDate);
      } else {
        groupCompletionsQuery = groupCompletionsQuery.eq("completion_date", date);
      }

      const { data } = await groupCompletionsQuery;
      groupCompletions = data || [];
    }

    // Calculate totals
    const totalUserPoints = (userCompletions || []).reduce((sum, c) => sum + c.points_earned, 0);
    const totalGroupPoints = groupCompletions.reduce((sum, c) => sum + c.points_earned, 0);

    console.log(`Fetched completions for user ${user.id}`);

    return new Response(
      JSON.stringify({
        user_completions: userCompletions || [],
        group_completions: groupCompletions,
        total_user_points: totalUserPoints,
        total_group_points: totalGroupPoints,
        total_points: totalUserPoints + totalGroupPoints,
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
