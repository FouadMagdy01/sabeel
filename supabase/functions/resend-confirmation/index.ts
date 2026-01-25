import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResendConfirmationRequest {
  email: string;
  // Optional: new password to set if this is a re-registration attempt (only if email not confirmed yet)
  password?: string;
  // Optional: new user data to update if this is a re-registration attempt
  userData?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    country?: string;
    dateOfBirth?: string;
    timezone?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userData, password }: ResendConfirmationRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // If user exists and is not confirmed yet, we DELETE the pending user and let the client re-signup.
    // Why: updating password/metadata on an unconfirmed duplicate can be unreliable depending on auth behavior;
    // recreating guarantees the latest attempt is what gets confirmed.
    if (userData || password) {
      let foundUser: any | null = null;
      const perPage = 200;

      // listUsers() is paginated; page through until we find the email (or hit a reasonable limit)
      for (let page = 1; page <= 20 && !foundUser; page++) {
        const { data: usersPage, error: listError } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage,
        });

        if (listError) {
          console.error('Error listing users:', listError);
          break;
        }

        const candidates = usersPage?.users ?? [];
        foundUser = candidates.find((u) => u.email === email) ?? null;

        // If this page is not full, we reached the end.
        if (candidates.length < perPage) break;
      }

      if (foundUser) {
        if (foundUser.email_confirmed_at) {
          return new Response(
            JSON.stringify({
              success: true,
              alreadyConfirmed: true,
              message: 'Email is already confirmed',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(foundUser.id);

        if (deleteError) {
          console.error('Error deleting unconfirmed user:', deleteError);
        } else {
          console.log('Deleted unconfirmed user for re-signup:', email);
          return new Response(
            JSON.stringify({
              success: true,
              recreated: true,
              message: 'Unconfirmed user deleted; client should re-signup',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        }
      }
    }

    // Use the built-in resend method
    const { error } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${req.headers.get('origin') || 'https://a3458818-a8eb-4998-8bac-6535fded0906.lovableproject.com'}/`,
      },
    });

    if (error) {
      console.error('Error resending confirmation email:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log('Confirmation email resent to:', email);

    return new Response(JSON.stringify({ success: true, message: 'Confirmation email sent' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in resend-confirmation function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
