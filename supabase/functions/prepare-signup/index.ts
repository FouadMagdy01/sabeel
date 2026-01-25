import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PrepareSignupRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PrepareSignupRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    let foundUser: any | null = null;
    const perPage = 200;

    for (let page = 1; page <= 20 && !foundUser; page++) {
      const { data: usersPage, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (listError) {
        console.error('prepare-signup: listUsers error', listError);
        return new Response(JSON.stringify({ error: 'Failed to check email' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const users = usersPage?.users ?? [];
      foundUser = users.find((u) => u.email === email) ?? null;

      if (users.length < perPage) break;
    }

    if (!foundUser) {
      return new Response(JSON.stringify({ ok: true, notFound: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    if (foundUser.email_confirmed_at) {
      return new Response(
        JSON.stringify({ ok: true, alreadyConfirmed: true, userId: foundUser.id }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(foundUser.id);

    if (deleteError) {
      console.error('prepare-signup: deleteUser error', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to reset pending signup' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('prepare-signup: deleted unconfirmed user', { email });

    return new Response(JSON.stringify({ ok: true, deletedUnconfirmed: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('prepare-signup: exception', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
