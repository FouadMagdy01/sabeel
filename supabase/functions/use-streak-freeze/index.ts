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

    const { groupId } = await req.json();

    // Get streak data
    let streakTable = "user_streaks";
    let streakQuery: any = { user_id: user.id };
    
    if (groupId) {
      streakTable = "group_streaks";
      streakQuery = { user_id: user.id, group_id: groupId };
    }

    const { data: streak, error: streakError } = await supabase
      .from(streakTable)
      .select("*")
      .match(streakQuery)
      .single();

    if (streakError || !streak) {
      return new Response(
        JSON.stringify({ error: "Streak not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if streak freeze is available
    const requirements = streak.streak_requirements || {};
    const freezesUsed = requirements.freezes_used || 0;
    const freezesAvailable = requirements.freezes_available || 0;

    if (freezesUsed >= freezesAvailable) {
      return new Response(
        JSON.stringify({ 
          error: "No streak freezes available",
          freezes_available: freezesAvailable,
          freezes_used: freezesUsed,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use the freeze - update last_completion_date to today
    const today = new Date().toISOString().split("T")[0];
    const updatedRequirements = {
      ...requirements,
      freezes_used: freezesUsed + 1,
      last_freeze_date: today,
    };

    const { error: updateError } = await supabase
      .from(streakTable)
      .update({
        last_completion_date: today,
        streak_requirements: updatedRequirements,
      })
      .match(streakQuery);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User ${user.id} used streak freeze. Freezes remaining: ${freezesAvailable - freezesUsed - 1}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Streak freeze used successfully",
        freezes_remaining: freezesAvailable - freezesUsed - 1,
        current_streak: streak.current_streak,
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
