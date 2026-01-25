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

    const url = new URL(req.url);
    const groupId = url.searchParams.get('groupId');
    const lang = url.searchParams.get('lang') || 'en';

    if (!groupId) {
      return new Response(JSON.stringify({ error: 'Group ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify membership
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return new Response(JSON.stringify({ error: 'Not a member of this group' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get consistent todos (default for all groups)
    const { data: consistentTodos } = await supabase
      .from('todos')
      .select('*')
      .eq('todo_type', 'consistent')
      .eq('is_active', true);

    const { data: pointsConfig } = await supabase
      .from('points_config')
      .select('key, points, label, label_ar');

    const pointsMap = new Map((pointsConfig || []).map((p) => [p.key, p]));

    // Get group-specific todos
    const { data: groupTodos } = await supabase
      .from('group_todos')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true);

    // Get today's completions
    const today = new Date().toISOString().split('T')[0];

    const { data: groupCompletions } = await supabase
      .from('group_todo_completions')
      .select('todo_id')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .eq('completion_date', today);

    const { data: userCompletions } = await supabase
      .from('user_todo_completions')
      .select('todo_id')
      .eq('user_id', user.id)
      .eq('completion_date', today);

    const completedGroupTodos = new Set((groupCompletions || []).map((c) => c.todo_id));
    const completedUserTodos = new Set((userCompletions || []).map((c) => c.todo_id));

    // Build response
    const todos = [
      ...(consistentTodos || []).map((t) => {
        const config = t.points_config_key ? pointsMap.get(t.points_config_key) : null;
        return {
          id: t.id,
          title: lang === 'ar' && t.title_ar ? t.title_ar : t.title,
          description: lang === 'ar' && t.description_ar ? t.description_ar : t.description,
          points: t.custom_points || config?.points || 0,
          is_consistent: true,
          is_completed: completedUserTodos.has(t.id),
        };
      }),
      ...(groupTodos || []).map((t) => ({
        id: t.id,
        title: lang === 'ar' && t.title_ar ? t.title_ar : t.title,
        description: lang === 'ar' && t.description_ar ? t.description_ar : t.description,
        points: t.custom_points,
        is_consistent: false,
        is_completed: completedGroupTodos.has(t.id),
      })),
    ];

    console.log(`Fetched ${todos.length} todos for group ${groupId}`);

    return new Response(JSON.stringify({ todos }), {
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
