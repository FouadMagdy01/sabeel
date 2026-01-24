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
    const { email, otpCode, newPassword } = await req.json();

    if (!email || !otpCode || !newPassword) {
      return new Response(
        JSON.stringify({ error: "Email, OTP code, and new password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ error: passwordValidation.error }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the OTP
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("otp_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("type", "password_reset")
      .eq("code", otpCode)
      .eq("verified", true)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (otpError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP. Please request a new code." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update password" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean up used OTP
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("id", otpRecord.id);

    console.log(`Password reset successfully for user: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password reset successfully"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
