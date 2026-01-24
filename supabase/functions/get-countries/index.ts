import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Country {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  flag: string;
  created_at: string;
}

interface CountryResponse {
  id: string;
  code: string;
  name: string;
  flag: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get language from query params or header
    const url = new URL(req.url);
    const lang = url.searchParams.get("lang") || 
                 req.headers.get("Accept-Language")?.split(",")[0]?.split("-")[0] || 
                 "en";
    
    console.log(`Fetching countries with language: ${lang}`);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: countries, error } = await supabase
      .from("countries")
      .select("*")
      .order("name_en", { ascending: true });

    if (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }

    // Map countries to the response format based on language
    const mappedCountries: CountryResponse[] = (countries as Country[]).map((country) => ({
      id: country.id,
      code: country.code,
      name: lang === "ar" ? country.name_ar : country.name_en,
      flag: country.flag,
    }));

    console.log(`Successfully fetched ${mappedCountries.length} countries`);

    return new Response(JSON.stringify(mappedCountries), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch countries";
    console.error("Error in get-countries function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
