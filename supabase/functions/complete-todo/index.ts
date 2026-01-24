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
    const { todoId, groupId } = await req.json();

    if (!todoId) {
      return new Response(JSON.stringify({ error: "todoId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Check if it's a group todo or regular todo
    if (groupId) {
      // Group todo completion
      const { data: todo, error: todoError } = await supabase
        .from("group_todos")
        .select("id, custom_points")
        .eq("id", todoId)
        .eq("group_id", groupId)
        .single();

      if (todoError || !todo) {
        return new Response(JSON.stringify({ error: "Todo not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already completed today
      const { data: existing } = await supabase
        .from("group_todo_completions")
        .select("id")
        .eq("todo_id", todoId)
        .eq("user_id", userId)
        .eq("completion_date", today)
        .single();

      if (existing) {
        return new Response(JSON.stringify({ error: "Already completed today" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Record completion
      const { error: insertError } = await supabase
        .from("group_todo_completions")
        .insert({
          group_id: groupId,
          user_id: userId,
          todo_id: todoId,
          points_earned: todo.custom_points,
          completion_date: today,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update group streak total points
      const { data: streak } = await supabase
        .from("group_streaks")
        .select("total_points")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

      if (streak) {
        await supabase
          .from("group_streaks")
          .update({
            total_points: streak.total_points + todo.custom_points,
            last_completion_date: today,
          })
          .eq("group_id", groupId)
          .eq("user_id", userId);
      }

      console.log(`User ${userId} completed group todo ${todoId}, earned ${todo.custom_points} points`);

      return new Response(
        JSON.stringify({
          success: true,
          points_earned: todo.custom_points,
          message: "Group todo completed successfully",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Regular todo completion (from Dashboard)
      const { data: todo, error: todoError } = await supabase
        .from("todos")
        .select("id, custom_points, points_config_key, todo_type")
        .eq("id", todoId)
        .single();

      if (todoError || !todo) {
        return new Response(JSON.stringify({ error: "Todo not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if already completed today
      const { data: existing } = await supabase
        .from("user_todo_completions")
        .select("id")
        .eq("todo_id", todoId)
        .eq("user_id", userId)
        .eq("completion_date", today)
        .single();

      if (existing) {
        return new Response(JSON.stringify({ error: "Already completed today" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get points from config if no custom points
      let pointsEarned = todo.custom_points || 0;
      if (!pointsEarned && todo.points_config_key) {
        const { data: config } = await supabase
          .from("points_config")
          .select("points")
          .eq("key", todo.points_config_key)
          .single();
        pointsEarned = config?.points || 0;
      }

      // Record completion for individual tracking
      const { error: insertError } = await supabase
        .from("user_todo_completions")
        .insert({
          user_id: userId,
          todo_id: todoId,
          points_earned: pointsEarned,
          completion_date: today,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update user streak total points
      const { data: streak } = await supabase
        .from("user_streaks")
        .select("total_points")
        .eq("user_id", userId)
        .single();

      if (streak) {
        await supabase
          .from("user_streaks")
          .update({
            total_points: streak.total_points + pointsEarned,
            last_completion_date: today,
          })
          .eq("user_id", userId);
      }

      // IMPORTANT: For consistent todos (prayers, azkar), also update ALL groups the user is in
      if (todo.todo_type === "consistent") {
        // Get all groups the user is a member of
        const { data: userGroups } = await supabase
          .from("group_members")
          .select("group_id")
          .eq("user_id", userId);

        if (userGroups && userGroups.length > 0) {
          console.log(`Updating ${userGroups.length} groups for consistent todo completion`);

          // Update points in each group's streak
          for (const membership of userGroups) {
            const { data: groupStreak } = await supabase
              .from("group_streaks")
              .select("total_points")
              .eq("group_id", membership.group_id)
              .eq("user_id", userId)
              .single();

            if (groupStreak) {
              await supabase
                .from("group_streaks")
                .update({
                  total_points: groupStreak.total_points + pointsEarned,
                  last_completion_date: today,
                })
                .eq("group_id", membership.group_id)
                .eq("user_id", userId);

              console.log(`Updated group ${membership.group_id} with +${pointsEarned} points`);
            }
          }
        }
      }

      console.log(`User ${userId} completed todo ${todoId}, earned ${pointsEarned} points`);

      return new Response(
        JSON.stringify({
          success: true,
          points_earned: pointsEarned,
          message: "Todo completed successfully",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
