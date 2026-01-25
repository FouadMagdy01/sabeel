import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Verify caller is authenticated and is an admin/moderator
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseAuth.auth.getUser(token);

    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const callerId = userData.user.id;

    // Use service role to check roles and send notifications
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check if caller is admin or moderator
    const { data: callerRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId);

    const isAdmin = callerRoles?.some((r) => r.role === 'admin');
    const isModerator = callerRoles?.some((r) => r.role === 'moderator');

    if (!isAdmin && !isModerator) {
      console.log(`Unauthorized push notification attempt by user ${callerId}`);
      return new Response(
        JSON.stringify({ error: 'Only admins and moderators can send push notifications' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');
    if (!fcmServerKey) {
      console.error('FCM_SERVER_KEY not configured');
      return new Response(JSON.stringify({ error: 'Push notifications not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId, userIds, title, body, data }: PushPayload = await req.json();

    if (!title || !body) {
      return new Response(JSON.stringify({ error: 'title and body are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get target user IDs
    const targetUserIds = userIds || (userId ? [userId] : []);

    if (targetUserIds.length === 0) {
      return new Response(JSON.stringify({ error: 'userId or userIds required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the notification request for audit
    console.log(
      `Push notification sent by ${isAdmin ? 'admin' : 'moderator'} ${callerId} to ${targetUserIds.length} users`
    );

    // Fetch FCM tokens for the users
    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from('fcm_tokens')
      .select('token, user_id')
      .in('user_id', targetUserIds);

    if (tokensError) {
      console.error('Error fetching tokens:', tokensError);
      return new Response(JSON.stringify({ error: 'Failed to fetch tokens' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!tokens || tokens.length === 0) {
      console.log('No FCM tokens found for users:', targetUserIds);
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No tokens found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send notifications
    let successCount = 0;
    let failCount = 0;

    for (const tokenRecord of tokens) {
      try {
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${fcmServerKey}`,
          },
          body: JSON.stringify({
            to: tokenRecord.token,
            notification: {
              title,
              body,
            },
            data: data || {},
          }),
        });

        const result = await response.json();

        if (result.success === 1) {
          successCount++;
          console.log(`Notification sent to user ${tokenRecord.user_id}`);
        } else {
          failCount++;
          console.error(`Failed to send to user ${tokenRecord.user_id}:`, result);

          // Remove invalid tokens
          if (
            result.results?.[0]?.error === 'NotRegistered' ||
            result.results?.[0]?.error === 'InvalidRegistration'
          ) {
            await supabaseAdmin.from('fcm_tokens').delete().eq('token', tokenRecord.token);
            console.log(`Removed invalid token for user ${tokenRecord.user_id}`);
          }
        }
      } catch (error) {
        failCount++;
        console.error(`Error sending to user ${tokenRecord.user_id}:`, error);
      }
    }

    console.log(`Push notifications sent: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failCount,
        total: tokens.length,
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
