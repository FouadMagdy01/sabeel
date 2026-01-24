import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Password validation configuration
const MIN_PASSWORD_LENGTH = 8;

// Validate password strength
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return { 
      valid: false, 
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` 
    };
  }

  // Check for at least one letter and one number for basic complexity
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter || !hasNumber) {
    return { 
      valid: false, 
      error: "Password must contain at least one letter and one number" 
    };
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password', '12345678', '123456789', 'qwerty123', 'abcd1234',
    'password1', 'password123', 'admin123', 'letmein1', 'welcome1'
  ];
  
  if (weakPasswords.includes(password.toLowerCase())) {
    return { 
      valid: false, 
      error: "This password is too common. Please choose a stronger password" 
    };
  }

  return { valid: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, displayName, firstName, lastName, country, timezone } = await req.json();

    if (!email || !password || !displayName) {
      return new Response(
        JSON.stringify({ error: "Email, password, and display name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ error: passwordValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authData.user.id;

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: userId,
      display_name: displayName,
      first_name: firstName || null,
      last_name: lastName || null,
      email: email,
      country: country || null,
      timezone: timezone || "UTC",
    });

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    // Create user streak (trigger should handle this, but ensure it exists)
    await supabase.from("user_streaks").upsert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0,
      total_points: 0,
    }, { onConflict: "user_id" });

    // Assign default user role
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: "user",
    });

    console.log(`User registered successfully: ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        message: "User registered successfully",
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
