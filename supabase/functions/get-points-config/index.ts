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
    const category = url.searchParams.get("category");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    let query = supabase.from("points_config").select("*");
    
    if (category) {
      query = query.eq("category", category);
    }

    const { data: configs, error } = await query.order("category");

    if (error) {
      console.error("Error fetching points config:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const transformedConfigs = (configs || []).map(c => ({
      id: c.id,
      key: c.key,
      category: c.category,
      points: c.points,
      label: lang === "ar" && c.label_ar ? c.label_ar : c.label,
    }));

    console.log(`Fetched ${transformedConfigs.length} points configs`);

    return new Response(
      JSON.stringify({ configs: transformedConfigs }),
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
