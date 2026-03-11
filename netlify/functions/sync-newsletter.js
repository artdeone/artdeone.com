const https = require('https');

// Supabase REST helper
function supabaseRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: `/rest/v1/${path}`,
      method: method,
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '[]'));
        } else {
          reject(new Error(`Supabase error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Resend API helper
function resendRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.resend.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
        } else {
          reject(new Error(`Resend error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'OK' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId || !process.env.RESEND_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Missing RESEND_API_KEY or RESEND_AUDIENCE_ID' })
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const offset = parseInt(params.offset) || 0;
    const BATCH_SIZE = 12;

    // 1. Fetch subscribed customers from Supabase
    const subscribers = await supabaseRequest(
      'shop_customers?newsletter_subscribed=eq.true&is_active=eq.true&select=email,name',
      'GET'
    );

    // 2. Fetch current Resend Audience contacts
    const audienceData = await resendRequest(
      `/audiences/${audienceId}/contacts`,
      'GET'
    );
    const existingContacts = audienceData.data || [];
    const existingEmails = new Set(existingContacts.map(c => c.email.toLowerCase()));

    // 3. Find new subscribers not yet in Resend
    const toAdd = subscribers.filter(s => !existingEmails.has(s.email.toLowerCase()));

    // 4. Fetch unsubscribed customers
    const unsubscribed = await supabaseRequest(
      'shop_customers?newsletter_subscribed=eq.false&is_active=eq.true&select=email',
      'GET'
    );
    const unsubEmails = new Set((unsubscribed || []).map(u => u.email.toLowerCase()));
    const toRemove = existingContacts.filter(c => unsubEmails.has(c.email.toLowerCase()));

    // 5. Process batch
    const allTasks = [
      ...toAdd.map(s => ({ type: 'add', email: s.email, name: s.name })),
      ...toRemove.map(c => ({ type: 'remove', id: c.id, email: c.email }))
    ];

    const batch = allTasks.slice(offset, offset + BATCH_SIZE);
    let added = 0, removed = 0;
    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    for (const task of batch) {
      if (task.type === 'add') {
        await resendRequest(`/audiences/${audienceId}/contacts`, 'POST', {
          email: task.email.toLowerCase(),
          first_name: task.name || '',
          unsubscribed: false
        });
        added++;
      } else {
        await resendRequest(`/audiences/${audienceId}/contacts/${task.id}`, 'DELETE');
        removed++;
      }
      await delay(550);
    }

    const nextOffset = offset + BATCH_SIZE;
    const hasMore = nextOffset < allTasks.length;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        total: allTasks.length,
        processed: Math.min(nextOffset, allTasks.length),
        added,
        removed,
        has_more: hasMore,
        next_offset: hasMore ? nextOffset : null,
        message: hasMore
          ? `Batch done (${Math.min(nextOffset, allTasks.length)}/${allTasks.length}). Call again with ?offset=${nextOffset}`
          : `Sync complete! All ${allTasks.length} contacts processed.`
      })
    };

  } catch (error) {
    console.error('Sync error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
