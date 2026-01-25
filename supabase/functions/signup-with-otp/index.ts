import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Password validation configuration
const MIN_PASSWORD_LENGTH = 8;

// Validate password strength
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    };
  }

  // Check for at least one letter and one number for basic complexity
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      valid: false,
      error: 'Password must contain at least one letter and one number',
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password',
    '12345678',
    '123456789',
    'qwerty123',
    'abcd1234',
    'password1',
    'password123',
    'admin123',
    'letmein1',
    'welcome1',
  ];

  if (weakPasswords.includes(password.toLowerCase())) {
    return {
      valid: false,
      error: 'This password is too common. Please choose a stronger password',
    };
  }

  return { valid: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, profile, otpCode } = await req.json();

    if (!email || !password || !otpCode) {
      return new Response(JSON.stringify({ error: 'Email, password, and OTP code are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return new Response(JSON.stringify({ error: passwordValidation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the OTP first
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('otp_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('type', 'signup')
      .eq('code', otpCode)
      .eq('verified', true)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (otpError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired OTP. Please request a new code.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user with this email already exists (confirmed)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase() && u.email_confirmed_at
    );

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete any unconfirmed user with this email
    const unconfirmedUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase() && !u.email_confirmed_at
    );
    if (unconfirmedUser) {
      await supabaseAdmin.auth.admin.deleteUser(unconfirmedUser.id);
    }

    // Create the user with email already confirmed (OTP verified)
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true, // Mark as confirmed since OTP was verified
      user_metadata: {
        first_name: profile?.firstName || null,
        last_name: profile?.lastName || null,
        display_name:
          profile?.firstName && profile?.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : null,
        country: profile?.country || null,
        date_of_birth: profile?.dateOfBirth || null,
        timezone: profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError.message || 'Failed to create account' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create profile
    const displayName =
      profile?.firstName && profile?.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : email.split('@')[0];

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      user_id: authData.user.id,
      first_name: profile?.firstName || null,
      last_name: profile?.lastName || null,
      display_name: displayName,
      email: email.toLowerCase(),
      country: profile?.country || null,
      date_of_birth: profile?.dateOfBirth || null,
      timezone: profile?.timezone || 'UTC',
      is_guest: false,
    });

    if (profileError && !profileError.message.includes('duplicate')) {
      console.error('Error creating profile:', profileError);
    }

    // Initialize user streak
    const { error: streakError } = await supabaseAdmin.from('user_streaks').insert({
      user_id: authData.user.id,
      current_streak: 0,
      longest_streak: 0,
      total_points: 0,
    });

    if (streakError && !streakError.message.includes('duplicate')) {
      console.error('Error creating streak:', streakError);
    }

    // Initialize user role
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'user',
    });

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('Error creating role:', roleError);
    }

    // Clean up used OTP
    await supabaseAdmin.from('otp_codes').delete().eq('id', otpRecord.id);

    console.log(`User created successfully: ${authData.user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Account created successfully',
        userId: authData.user.id,
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
