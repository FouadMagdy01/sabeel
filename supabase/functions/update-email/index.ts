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
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // User-scoped client for auth validation
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    // Admin client for operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token);

    if (userError) {
      console.error("Auth error:", userError.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: userError.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user) {
      console.error("No user found for token");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "No user found" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`User authenticated: ${user.id}, email: ${user.email}`);

    const { email, password } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!password) {
      return new Response(
        JSON.stringify({ error: "Password is required to update email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify password by attempting to sign in
    const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email!,
      password: password,
    });

    if (signInError) {
      console.error("Password verification failed:", signInError.message);
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if new email is already in use
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const emailInUse = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === email.toLowerCase() && u.id !== user.id
    );

    if (emailInUse) {
      return new Response(
        JSON.stringify({ error: "Email is already in use by another account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Password verified and email is available
    // Return success - the frontend will call supabase.auth.updateUser() to trigger the email change
    // This ensures the confirmation email is sent through the proper Supabase flow
    console.log(`Password verified for user: ${user.id}, email change to: ${email} approved`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        message: "Password verified. Proceeding with email change." 
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
