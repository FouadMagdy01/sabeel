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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.user.id;

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user streak
    const { data: streak } = await supabase
      .from("user_streaks")
      .select("current_streak, longest_streak, total_points, last_completion_date")
      .eq("user_id", userId)
      .single();

    // Get user roles
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    // Get today's completions count
    const today = new Date().toISOString().split("T")[0];
    const { count: todayCompletions } = await supabase
      .from("user_todo_completions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completion_date", today);

    // Get groups the user is a member of
    const { data: memberships } = await supabase
      .from("group_members")
      .select("group_id, is_admin, groups(name)")
      .eq("user_id", userId);

    console.log(`Fetched profile for user ${userId}`);

    return new Response(
      JSON.stringify({
        profile: {
          id: profile.id,
          user_id: profile.user_id,
          display_name: profile.display_name,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          country: profile.country,
          avatar_url: profile.avatar_url,
          timezone: profile.timezone,
          is_guest: profile.is_guest,
          date_of_birth: profile.date_of_birth,
          created_at: profile.created_at,
        },
        streak: streak || { current_streak: 0, longest_streak: 0, total_points: 0 },
        roles: (roles || []).map(r => r.role),
        today_completions: todayCompletions || 0,
        groups: (memberships || []).map(m => ({
          id: m.group_id,
          name: (m.groups as any)?.name,
          is_admin: m.is_admin,
        })),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
