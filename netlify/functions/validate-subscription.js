const https = require('https');
const crypto = require('crypto');

// Decryption helper
function decrypt(text, key) {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Supabase helper
function supabaseRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: process.env.SUPABASE_URL.replace('https://', '').replace('http://', ''),
      path: `/rest/v1/${path}`,
      method: method,
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '[]'));
        } else {
          reject(new Error(`Supabase error: ${res.statusCode}`));
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

  try {
    const { email } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email required' })
      };
    }

    // Fetch subscription from Supabase
    const subscriptions = await supabaseRequest(
      `premium_subscriptions?email=eq.${email.toLowerCase()}&select=*`,
      'GET'
    );

    if (subscriptions.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Subscription not found' })
      };
    }

    const subscription = subscriptions[0];

    // Check if active
    if (!subscription.is_active) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Subscription is not active' })
      };
    }

    // Check expiry for time-based plans
    if (subscription.expiry_date) {
      const now = new Date();
      const expiry = new Date(subscription.expiry_date);
      if (now > expiry) {
        // Deactivate subscription
        await supabaseRequest(
          `premium_subscriptions?email=eq.${email.toLowerCase()}`,
          'PATCH',
          { is_active: false }
        );
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Subscription expired' })
        };
      }
    }

    // Check credits for credit-based plans
    if (subscription.credits_total > 0) {
      if (subscription.credits_used >= subscription.credits_total) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'No credits remaining' })
        };
      }
    }

    // Decrypt API key
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const apiKey = decrypt(subscription.api_key_encrypted, encryptionKey);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        valid: true,
        apiKey: apiKey,
        planType: subscription.plan_type,
        creditsRemaining: subscription.credits_total - subscription.credits_used,
        expiryDate: subscription.expiry_date
      })
    };

  } catch (error) {
    console.error('Validation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Validation failed' })
    };
  }
};
