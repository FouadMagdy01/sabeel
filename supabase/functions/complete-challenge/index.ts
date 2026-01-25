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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { challengeId } = await req.json();

    if (!challengeId) {
      return new Response(JSON.stringify({ error: 'Challenge ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user challenge participation
    const { data: userChallenge } = await supabase
      .from('user_challenges')
      .select('id, is_completed')
      .eq('challenge_id', challengeId)
      .eq('user_id', user.id)
      .single();

    if (!userChallenge) {
      return new Response(JSON.stringify({ error: 'Not participating in this challenge' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (userChallenge.is_completed) {
      return new Response(JSON.stringify({ error: 'Challenge already completed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get challenge points
    const { data: challenge } = await supabase
      .from('challenges')
      .select('points')
      .eq('id', challengeId)
      .single();

    // Mark as completed
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', userChallenge.id);

    if (updateError) {
      console.error('Complete challenge error:', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Award points
    const pointsEarned = challenge?.points || 0;
    if (pointsEarned > 0) {
      const { data: streak } = await supabase
        .from('user_streaks')
        .select('total_points')
        .eq('user_id', user.id)
        .single();

      if (streak) {
        await supabase
          .from('user_streaks')
          .update({
            total_points: streak.total_points + pointsEarned,
          })
          .eq('user_id', user.id);
      }
    }

    console.log(
      `User ${user.id} completed challenge ${challengeId}, earned ${pointsEarned} points`
    );

    return new Response(
      JSON.stringify({
        success: true,
        points_earned: pointsEarned,
        message: 'Challenge completed successfully',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
