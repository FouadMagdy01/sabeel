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
    const lang = url.searchParams.get("lang") || "en";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: milestones, error } = await supabase
      .from("milestone_config")
      .select("*")
      .order("days", { ascending: true });

    if (error) {
      console.error("Error fetching milestones:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const transformedMilestones = (milestones || []).map(m => ({
      id: m.id,
      days: m.days,
      bonus_points: m.bonus_points,
      label: lang === "ar" && m.label_ar ? m.label_ar : m.label,
    }));

    console.log(`Fetched ${transformedMilestones.length} milestones`);

    return new Response(
      JSON.stringify({ milestones: transformedMilestones }),
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
