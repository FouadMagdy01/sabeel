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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Parse body for params
    let body: any = {};
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const limit = parseInt(body.limit || "50", 10);
    const country = body.country || null;

    // Fetch all groups with their country
    const { data: groups, error: groupsError } = await supabase
      .from("groups")
      .select("id, name, description, country, is_public, created_at");

    if (groupsError) {
      console.error("Error fetching groups:", groupsError);
      return new Response(
        JSON.stringify({ error: groupsError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all group_streaks to calculate combined points
    const { data: streaks, error: streaksError } = await supabase
      .from("group_streaks")
      .select("group_id, total_points");

    if (streaksError) {
      console.error("Error fetching group streaks:", streaksError);
      return new Response(
        JSON.stringify({ error: streaksError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch member counts
    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("group_id");

    if (membersError) {
      console.error("Error fetching group members:", membersError);
    }

    // Calculate combined points per group
    const groupPointsMap = new Map<string, number>();
    const groupMemberCountMap = new Map<string, number>();

    (streaks || []).forEach((s) => {
      const current = groupPointsMap.get(s.group_id) || 0;
      groupPointsMap.set(s.group_id, current + s.total_points);
    });

    (members || []).forEach((m) => {
      const current = groupMemberCountMap.get(m.group_id) || 0;
      groupMemberCountMap.set(m.group_id, current + 1);
    });

    // Build leaderboard entries
    let leaderboard = (groups || []).map((g) => ({
      group_id: g.id,
      name: g.name,
      description: g.description,
      country: g.country,
      is_public: g.is_public,
      total_points: groupPointsMap.get(g.id) || 0,
      member_count: groupMemberCountMap.get(g.id) || 0,
    }));

    // Filter by country if specified
    if (country) {
      leaderboard = leaderboard.filter((g) => g.country === country);
    }

    // Sort by total_points descending
    leaderboard.sort((a, b) => b.total_points - a.total_points);

    // Apply limit
    leaderboard = leaderboard.slice(0, limit);

    // Add rank
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    console.log(`Groups leaderboard fetched: ${rankedLeaderboard.length} entries`);

    return new Response(
      JSON.stringify({ leaderboard: rankedLeaderboard }),
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
