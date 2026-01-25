import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get('lang') || 'en';
    const activeOnly = url.searchParams.get('active') !== 'false';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    let query = supabase
      .from('challenges')
      .select(
        'id, title, title_ar, description, description_ar, points, start_date, end_date, is_active'
      );

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: challenges, error } = await query.order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching challenges:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter to only include current challenges (between start and end date)
    const today = new Date().toISOString().split('T')[0];
    const currentChallenges = (challenges || []).filter((c) => {
      return c.start_date <= today && c.end_date >= today;
    });

    // Transform response based on language
    const transformedChallenges = currentChallenges.map((challenge) => ({
      id: challenge.id,
      title: lang === 'ar' && challenge.title_ar ? challenge.title_ar : challenge.title,
      description:
        lang === 'ar' && challenge.description_ar
          ? challenge.description_ar
          : challenge.description,
      points: challenge.points,
      start_date: challenge.start_date,
      end_date: challenge.end_date,
      is_active: challenge.is_active,
    }));

    console.log(`Fetched ${transformedChallenges.length} active challenges for lang=${lang}`);

    return new Response(JSON.stringify({ challenges: transformedChallenges }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
