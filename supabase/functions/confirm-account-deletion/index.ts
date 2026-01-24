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
    const { token, email } = await req.json();

    if (!token || !email) {
      return new Response(
        JSON.stringify({ error: "Token and email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the deletion token
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from("otp_codes")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("code", token)
      .eq("type", "account_deletion")
      .single();

    if (otpError || !otpRecord) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired deletion token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if token has expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Clean up expired token
      await supabaseAdmin
        .from("otp_codes")
        .delete()
        .eq("id", otpRecord.id);

      return new Response(
        JSON.stringify({ error: "Deletion token has expired. Please request a new one." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find the user by email
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Error listing users:", usersError);
      return new Response(
        JSON.stringify({ error: "Failed to find user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Delete the OTP record first
    await supabaseAdmin
      .from("otp_codes")
      .delete()
      .eq("id", otpRecord.id);

    // Delete all user data in order (respecting foreign key constraints)
    // 1. Delete user's group todo completions
    await supabaseAdmin
      .from("group_todo_completions")
      .delete()
      .eq("user_id", userId);

    // 2. Delete user's group streaks
    await supabaseAdmin
      .from("group_streaks")
      .delete()
      .eq("user_id", userId);

    // 3. Delete user's group memberships
    await supabaseAdmin
      .from("group_members")
      .delete()
      .eq("user_id", userId);

    // 4. Delete groups created by user (will cascade to related tables)
    await supabaseAdmin
      .from("groups")
      .delete()
      .eq("created_by", userId);

    // 5. Delete user's todo completions
    await supabaseAdmin
      .from("user_todo_completions")
      .delete()
      .eq("user_id", userId);

    // 6. Delete user's personal todo completions
    await supabaseAdmin
      .from("user_personal_todo_completions")
      .delete()
      .eq("user_id", userId);

    // 7. Delete user's personal todos
    await supabaseAdmin
      .from("user_personal_todos")
      .delete()
      .eq("user_id", userId);

    // 8. Delete user's challenges
    await supabaseAdmin
      .from("user_challenges")
      .delete()
      .eq("user_id", userId);

    // 9. Delete user's favorite suras
    await supabaseAdmin
      .from("favorite_suras")
      .delete()
      .eq("user_id", userId);

    // 10. Delete user's FCM tokens
    await supabaseAdmin
      .from("fcm_tokens")
      .delete()
      .eq("user_id", userId);

    // 11. Delete user's reports
    await supabaseAdmin
      .from("reports")
      .delete()
      .eq("user_id", userId);

    // 12. Delete user's streaks
    await supabaseAdmin
      .from("user_streaks")
      .delete()
      .eq("user_id", userId);

    // 13. Delete user's roles
    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    // 14. Delete user's profile
    await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    // 15. Delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Account deleted successfully for ${email}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
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
