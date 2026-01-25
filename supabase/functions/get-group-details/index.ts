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

    // Client for auth validation
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Admin client for database reads (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);

    // Support groupId/lang via query params OR JSON body (supabase.functions.invoke uses POST body)
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const groupId = url.searchParams.get('groupId') || body?.groupId;
    const lang = url.searchParams.get('lang') || body?.lang || 'en';

    if (!groupId) {
      return new Response(JSON.stringify({ error: 'Group ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify membership using admin client (uses 'role' column, not 'is_admin')
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      console.error('Membership check failed:', membershipError);
      return new Response(JSON.stringify({ error: 'Not a member of this group' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isAdmin = membership.role === 'admin';

    // Get group details
    const { data: group, error: groupError } = await supabaseAdmin
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      console.error('Group fetch failed:', groupError);
      return new Response(JSON.stringify({ error: 'Group not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get members with role (not is_admin)
    const { data: members } = await supabaseAdmin
      .from('group_members')
      .select('user_id, role, joined_at')
      .eq('group_id', groupId);

    const userIds = (members || []).map((m) => m.user_id);

    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('user_id, display_name, avatar_url, country')
      .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000']);

    const { data: streaks } = await supabaseAdmin
      .from('group_streaks')
      .select('user_id, current_streak, longest_streak, total_points')
      .eq('group_id', groupId);

    const profilesMap = new Map((profiles || []).map((p) => [p.user_id, p]));
    const streaksMap = new Map((streaks || []).map((s) => [s.user_id, s]));

    const enrichedMembers = (members || []).map((m) => ({
      user_id: m.user_id,
      is_admin: m.role === 'admin',
      joined_at: m.joined_at,
      display_name: profilesMap.get(m.user_id)?.display_name || 'Unknown',
      avatar_url: profilesMap.get(m.user_id)?.avatar_url,
      country: profilesMap.get(m.user_id)?.country,
      current_streak: streaksMap.get(m.user_id)?.current_streak || 0,
      total_points: streaksMap.get(m.user_id)?.total_points || 0,
    }));

    // Get group todos with language support
    const { data: groupTodos } = await supabaseAdmin
      .from('group_todos')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true);

    // Get consistent todos
    const { data: consistentTodos } = await supabaseAdmin
      .from('todos')
      .select('*')
      .eq('todo_type', 'consistent')
      .eq('is_active', true);

    const { data: pointsConfig } = await supabaseAdmin.from('points_config').select('key, points');

    const pointsMap = new Map((pointsConfig || []).map((p) => [p.key, p.points]));

    const allTodos = [
      ...(consistentTodos || []).map((t) => ({
        id: t.id,
        title: lang === 'ar' && t.title_ar ? t.title_ar : t.title,
        description: lang === 'ar' && t.description_ar ? t.description_ar : t.description,
        points:
          t.custom_points || (t.points_config_key ? pointsMap.get(t.points_config_key) || 0 : 0),
        is_consistent: true,
      })),
      ...(groupTodos || []).map((t) => ({
        id: t.id,
        title: lang === 'ar' && t.title_ar ? t.title_ar : t.title,
        description: lang === 'ar' && t.description_ar ? t.description_ar : t.description,
        points: t.points,
        is_consistent: false,
      })),
    ];

    // Get my streak
    const myStreak = streaksMap.get(user.id);

    console.log(`Fetched group details for ${groupId}`);

    return new Response(
      JSON.stringify({
        group,
        is_admin: isAdmin,
        members: enrichedMembers,
        todos: allTodos,
        my_streak: myStreak || { current_streak: 0, longest_streak: 0, total_points: 0 },
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
