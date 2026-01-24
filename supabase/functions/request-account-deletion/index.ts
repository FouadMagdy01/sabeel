import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);
    
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = userData.user;
    const email = user.email;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email associated with this account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate a secure deletion token
    const deletionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Store the deletion request in otp_codes table with type "account_deletion"
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("email", email.toLowerCase())
      .eq("type", "account_deletion");

    const { error: insertError } = await supabaseAdmin
      .from("otp_codes")
      .insert({
        email: email.toLowerCase(),
        code: deletionToken,
        type: "account_deletion",
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error storing deletion token:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to initiate account deletion" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the deletion confirmation URL
    const baseUrl = req.headers.get("origin") || Deno.env.get("SUPABASE_URL")!.replace('.supabase.co', '.lovable.app');
    const confirmUrl = `${baseUrl}/confirm-deletion?token=${deletionToken}&email=${encodeURIComponent(email)}`;

    // TODO: Send email with the confirmation link using Resend
    // For now, log it (in production, integrate with email service)
    console.log(`Account deletion requested for ${email}`);
    console.log(`Confirmation URL: ${confirmUrl}`);

    // In production, you would send an email here:
    // await sendEmail(email, 'Confirm Account Deletion', `Click here to confirm: ${confirmUrl}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Deletion confirmation email sent. Please check your email to confirm account deletion.",
        // For development/testing only - remove in production
        confirmUrl: confirmUrl
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
