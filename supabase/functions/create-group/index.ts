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

    // Client scoped to the user (for auth validation)
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Admin client for database writes (bypasses RLS)
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

    const { name, description, isPublic, country } = await req.json();

    if (!name || name.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Group name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!country || country.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Country is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate a unique invite code for the group
    const inviteCode = crypto.randomUUID().slice(0, 8).toUpperCase();

    // Create the group (admin client bypasses RLS)
    const { data: group, error: groupError } = await supabaseAdmin
      .from('groups')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        is_public: isPublic ?? false,
        created_by: user.id,
        invite_code: inviteCode,
        country: country.trim(),
      })
      .select()
      .single();

    if (groupError) {
      console.error('Group creation error:', groupError);
      return new Response(JSON.stringify({ error: groupError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Add creator as admin member (using role column, not is_admin)
    const { error: memberError } = await supabaseAdmin.from('group_members').insert({
      group_id: group.id,
      user_id: user.id,
      role: 'admin',
    });

    if (memberError) {
      console.error('Member add error:', memberError);
    }

    // Initialize group streak for creator (avoid client-side race / RLS issues)
    const { error: streakError } = await supabaseAdmin.from('group_streaks').insert({
      group_id: group.id,
      user_id: user.id,
    });

    if (streakError) {
      console.error('Group streak init error:', streakError);
    }

    console.log(`Group created: ${group.id} by user: ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        group: {
          id: group.id,
          name: group.name,
          description: group.description,
          invite_code: group.invite_code,
          is_public: group.is_public,
          country: group.country,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
