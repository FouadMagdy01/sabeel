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
    const lang = url.searchParams.get("lang") || "en";
    const status = url.searchParams.get("status"); // active, completed, all

    // Get user's challenges
    let query = supabase
      .from("user_challenges")
      .select("challenge_id, is_completed, completed_at, created_at")
      .eq("user_id", user.id);

    if (status === "completed") {
      query = query.eq("is_completed", true);
    } else if (status === "active") {
      query = query.eq("is_completed", false);
    }

    const { data: userChallenges } = await query;

    if (!userChallenges || userChallenges.length === 0) {
      return new Response(
        JSON.stringify({ challenges: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const challengeIds = userChallenges.map(uc => uc.challenge_id);
    const userChallengeMap = new Map(userChallenges.map(uc => [uc.challenge_id, uc]));

    // Get challenge details
    const { data: challenges } = await supabase
      .from("challenges")
      .select("*")
      .in("id", challengeIds);

    const enrichedChallenges = (challenges || []).map(c => {
      const uc = userChallengeMap.get(c.id);
      return {
        id: c.id,
        title: lang === "ar" && c.title_ar ? c.title_ar : c.title,
        description: lang === "ar" && c.description_ar ? c.description_ar : c.description,
        points: c.points,
        start_date: c.start_date,
        end_date: c.end_date,
        completed: uc?.is_completed || false,
        completed_at: uc?.completed_at,
        joined_at: uc?.created_at,
      };
    });

    console.log(`Fetched ${enrichedChallenges.length} challenges for user ${user.id}`);

    return new Response(
      JSON.stringify({ challenges: enrichedChallenges }),
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
