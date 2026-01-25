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
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);

    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.user.id;
    const body = await req.json().catch(() => ({}));
    const groupId = body.groupId;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (groupId) {
      // Calculate group streak
      const { data: streak, error: streakError } = await supabase
        .from('group_streaks')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .single();

      if (streakError && streakError.code !== 'PGRST116') {
        console.error('Streak fetch error:', streakError);
        return new Response(JSON.stringify({ error: streakError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user completed any group todos today
      const { data: todayCompletions } = await supabase
        .from('group_todo_completions')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', userId)
        .eq('completion_date', todayStr);

      const completedToday = (todayCompletions?.length || 0) > 0;

      let newStreak = streak?.current_streak || 0;
      let longestStreak = streak?.longest_streak || 0;

      if (completedToday) {
        const lastCompletion = streak?.last_completion_date;

        if (!lastCompletion || lastCompletion === yesterdayStr) {
          // Continue streak
          newStreak += 1;
        } else if (lastCompletion !== todayStr) {
          // Streak broken, start fresh
          newStreak = 1;
        }

        if (newStreak > longestStreak) {
          longestStreak = newStreak;
        }

        // Update streak
        await supabase.from('group_streaks').upsert({
          group_id: groupId,
          user_id: userId,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_completion_date: todayStr,
          total_points: streak?.total_points || 0,
        });
      }

      // Check for milestone bonuses
      const { data: milestones } = await supabase
        .from('milestone_config')
        .select('days, bonus_points, label')
        .order('days', { ascending: true });

      const milestoneBonus = milestones?.find((m) => m.days === newStreak);

      console.log(
        `Group streak calculated for user ${userId} in group ${groupId}: ${newStreak} days`
      );

      return new Response(
        JSON.stringify({
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_points: streak?.total_points || 0,
          completed_today: completedToday,
          milestone_reached: milestoneBonus
            ? {
                days: milestoneBonus.days,
                bonus_points: milestoneBonus.bonus_points,
                label: milestoneBonus.label,
              }
            : null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      // Calculate user streak
      const { data: streak, error: streakError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (streakError && streakError.code !== 'PGRST116') {
        console.error('Streak fetch error:', streakError);
        return new Response(JSON.stringify({ error: streakError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check if user completed any todos today
      const { data: todayCompletions } = await supabase
        .from('user_todo_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('completion_date', todayStr);

      const completedToday = (todayCompletions?.length || 0) > 0;

      let newStreak = streak?.current_streak || 0;
      let longestStreak = streak?.longest_streak || 0;

      if (completedToday) {
        const lastCompletion = streak?.last_completion_date;

        if (!lastCompletion || lastCompletion === yesterdayStr) {
          newStreak += 1;
        } else if (lastCompletion !== todayStr) {
          newStreak = 1;
        }

        if (newStreak > longestStreak) {
          longestStreak = newStreak;
        }

        await supabase.from('user_streaks').upsert({
          user_id: userId,
          current_streak: newStreak,
          longest_streak: longestStreak,
          last_completion_date: todayStr,
          total_points: streak?.total_points || 0,
        });
      }

      // Check for milestone bonuses
      const { data: milestones } = await supabase
        .from('milestone_config')
        .select('days, bonus_points, label, label_ar')
        .order('days', { ascending: true });

      const milestoneBonus = milestones?.find((m) => m.days === newStreak);

      console.log(`User streak calculated for ${userId}: ${newStreak} days`);

      return new Response(
        JSON.stringify({
          current_streak: newStreak,
          longest_streak: longestStreak,
          total_points: streak?.total_points || 0,
          completed_today: completedToday,
          milestone_reached: milestoneBonus
            ? {
                days: milestoneBonus.days,
                bonus_points: milestoneBonus.bonus_points,
                label: milestoneBonus.label,
              }
            : null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
