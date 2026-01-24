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
    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const sortBy = url.searchParams.get("sortBy") || "points"; // points, streak

    // Use service role to read public profile data for leaderboard
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (groupId) {
      // Group leaderboard
      const { data: streaks, error } = await supabase
        .from("group_streaks")
        .select("user_id, current_streak, longest_streak, total_points")
        .eq("group_id", groupId)
        .order(sortBy === "streak" ? "current_streak" : "total_points", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching group leaderboard:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get public profile data for all users
      const userIds = (streaks || []).map(s => s.user_id);
      const { data: profiles } = await supabase
        .from("public_profiles")
        .select("user_id, display_name, avatar_url, country")
        .in("user_id", userIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      const leaderboard = (streaks || []).map((s, index) => {
        const profile = profilesMap.get(s.user_id);
        return {
          rank: index + 1,
          user_id: s.user_id,
          display_name: profile?.display_name || "Unknown",
          avatar_url: profile?.avatar_url,
          country: profile?.country,
          current_streak: s.current_streak,
          longest_streak: s.longest_streak,
          total_points: s.total_points,
        };
      });

      console.log(`Fetched group leaderboard for ${groupId}: ${leaderboard.length} entries`);

      return new Response(
        JSON.stringify({ leaderboard, group_id: groupId }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Global leaderboard
      const { data: streaks, error } = await supabase
        .from("user_streaks")
        .select("user_id, current_streak, longest_streak, total_points")
        .order(sortBy === "streak" ? "current_streak" : "total_points", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching global leaderboard:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get public profile data for all users
      const userIds = (streaks || []).map(s => s.user_id);
      const { data: profiles } = await supabase
        .from("public_profiles")
        .select("user_id, display_name, avatar_url, country")
        .in("user_id", userIds);

      const profilesMap = new Map(
        (profiles || []).map(p => [p.user_id, p])
      );

      const leaderboard = (streaks || []).map((s, index) => {
        const profile = profilesMap.get(s.user_id);
        return {
          rank: index + 1,
          user_id: s.user_id,
          display_name: profile?.display_name || "Unknown",
          avatar_url: profile?.avatar_url,
          country: profile?.country,
          current_streak: s.current_streak,
          longest_streak: s.longest_streak,
          total_points: s.total_points,
        };
      });

      console.log(`Fetched global leaderboard: ${leaderboard.length} entries`);

      return new Response(
        JSON.stringify({ leaderboard }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
