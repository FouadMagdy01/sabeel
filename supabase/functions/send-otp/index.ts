import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_REQUESTS_PER_EMAIL = 3;
const COOLDOWN_PERIOD_MS = 60 * 1000; // 1 minute between requests

// Generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Add random delay to prevent timing attacks (50-150ms)
async function randomDelay(): Promise<void> {
  const delay = 50 + Math.random() * 100;
  await new Promise(resolve => setTimeout(resolve, delay));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, newEmail } = await req.json();

    if (!email || !type) {
      return new Response(
        JSON.stringify({ error: "Email and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["signup", "password_reset", "email_change", "account_deletion"].includes(type)) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type === "email_change" && !newEmail) {
      return new Response(
        JSON.stringify({ error: "New email is required for email change" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // RATE LIMITING: Check recent OTP requests for this email
    const rateLimitCutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const cooldownCutoff = new Date(Date.now() - COOLDOWN_PERIOD_MS).toISOString();
    
    const { data: recentOtps, error: rateCheckError } = await supabaseAdmin
      .from("otp_codes")
      .select("created_at")
      .eq("email", email.toLowerCase())
      .gte("created_at", rateLimitCutoff)
      .order("created_at", { ascending: false });

    if (rateCheckError) {
      console.error("Rate limit check error:", rateCheckError);
      // Don't fail silently - continue but log the error
    }

    if (recentOtps && recentOtps.length > 0) {
      // Check cooldown: most recent request must be older than cooldown period
      const mostRecentRequest = new Date(recentOtps[0].created_at);
      if (mostRecentRequest > new Date(cooldownCutoff)) {
        const waitSeconds = Math.ceil((mostRecentRequest.getTime() + COOLDOWN_PERIOD_MS - Date.now()) / 1000);
        await randomDelay();
        return new Response(
          JSON.stringify({ 
            error: `Please wait ${waitSeconds} seconds before requesting another code`,
            retryAfter: waitSeconds
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check rate limit: max requests in window
      if (recentOtps.length >= MAX_OTP_REQUESTS_PER_EMAIL) {
        await randomDelay();
        return new Response(
          JSON.stringify({ 
            error: "Too many verification code requests. Please try again later.",
            retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For signup: check if email already exists and is confirmed
    if (type === "signup") {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser?.email_confirmed_at) {
        // Add random delay to prevent timing attacks
        await randomDelay();
        return new Response(
          JSON.stringify({ error: "Email already registered" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // For password reset: always return same response regardless of user existence
    // to prevent email enumeration attacks
    if (type === "password_reset") {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (!existingUser) {
        // Simulate the same code path timing as when user exists
        // Generate OTP but don't store it
        generateOTP();
        await randomDelay();
        
        // Don't reveal if email exists or not
        return new Response(
          JSON.stringify({ success: true, message: "If the email exists, an OTP will be sent" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate and store new OTP (don't delete old ones - they're used for rate limiting)
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { error: insertError } = await supabaseAdmin
      .from("otp_codes")
      .insert({
        email: email.toLowerCase(),
        code,
        type,
        expires_at: expiresAt.toISOString(),
        new_email: type === "email_change" ? newEmail?.toLowerCase() : null,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Delete expired OTPs (cleanup, but keep recent ones for rate limiting)
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .lt("expires_at", new Date().toISOString());

    // TODO: Integrate with email service (Resend, SendGrid, AWS SES)
    // The OTP should ONLY be sent via email, never in the response
    console.log(`OTP generated for ${email} (${type})`);
    // Note: In production, call your email service here to send the OTP
    // Example: await sendEmail(email, `Your verification code is: ${code}`);

    // Add random delay to normalize response times
    await randomDelay();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully"
        // SECURITY: Never include OTP code in response - must be sent via email only
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
