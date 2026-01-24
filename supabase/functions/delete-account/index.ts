import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create a client with the user's token to get their ID
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create admin client to delete user data and auth account
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const userId = user.id;

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
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in delete-account function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
