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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get webhook payload
    const payload = await req.json();

    // Log the entire payload for debugging
    console.log('Full webhook payload:', JSON.stringify(payload, null, 2));

    // Extract user data from webhook (try multiple possible formats)
    const record = payload.record || payload.new || payload;
    const userId = record.id;
    const userEmail = record.email;
    const metadata = record.raw_user_meta_data || {};

    console.log('Extracted data:', { userId, userEmail, metadata });

    // Call the database function to create profile and role
    // CHANGED: Use new parameter names with p_ prefix
    console.log('Calling create_profile_for_user RPC with:', {
      p_user_id: userId,
      p_user_email: userEmail,
      p_metadata: metadata,
    });

    const { data, error } = await supabase.rpc('create_profile_for_user', {
      p_user_id: userId, // Changed from user_id
      p_user_email: userEmail, // Changed from user_email
      p_metadata: metadata, // Changed from metadata
    });

    if (error) {
      console.error('RPC Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw error;
    }

    console.log('RPC call successful, response:', data);
    console.log('Profile and role created successfully for user:', userId);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        message: 'Profile and role created',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
