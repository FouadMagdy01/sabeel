import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lang = url.searchParams.get('lang') || 'en';
    const type = url.searchParams.get('type') || 'all'; // consistent, admin, all

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    let query = supabase
      .from('todos')
      .select(
        'id, title, title_ar, description, description_ar, custom_points, points_config_key, todo_type, is_active'
      )
      .eq('is_active', true);

    if (type !== 'all') {
      query = query.eq('todo_type', type);
    } else {
      query = query.in('todo_type', ['consistent', 'admin']);
    }

    const { data: todos, error } = await query;

    if (error) {
      console.error('Error fetching todos:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch points config to get points for each todo
    const { data: pointsConfig } = await supabase
      .from('points_config')
      .select('key, points, label, label_ar');

    const pointsMap = new Map((pointsConfig || []).map((p) => [p.key, p]));

    // Transform response based on language
    const transformedTodos = (todos || []).map((todo) => {
      const pointsConfigData = todo.points_config_key
        ? pointsMap.get(todo.points_config_key)
        : null;
      const points = todo.custom_points || pointsConfigData?.points || 0;

      return {
        id: todo.id,
        title: lang === 'ar' && todo.title_ar ? todo.title_ar : todo.title,
        description: lang === 'ar' && todo.description_ar ? todo.description_ar : todo.description,
        points,
        todo_type: todo.todo_type,
      };
    });

    console.log(`Fetched ${transformedTodos.length} todos for lang=${lang}, type=${type}`);

    return new Response(JSON.stringify({ todos: transformedTodos }), {
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
