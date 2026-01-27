const https = require('https');
const crypto = require('crypto');

// Encryption helper
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
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
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body || '{}'));
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
    const { email, apiKey, planType } = JSON.parse(event.body || '{}');

    // Validation
    if (!email || !apiKey || !planType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Calculate expiry date and credits
    const startDate = new Date();
    let expiryDate = null;
    let creditsTotal = 0;

    const planConfig = {
      '1month': { months: 1, credits: 0 },
      '2month': { months: 2, credits: 0 },
      '6month': { months: 6, credits: 0 },
      '1year': { months: 12, credits: 0 },
      'credit_10': { months: null, credits: 100 },
      'credit_20': { months: null, credits: 250 }
    };

    const config = planConfig[planType];
    if (!config) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan type' })
      };
    }

    if (config.months) {
      expiryDate = new Date(startDate);
      expiryDate.setMonth(expiryDate.getMonth() + config.months);
    }
    creditsTotal = config.credits;

    // Encrypt API key
    const encryptionKey = process.env.ENCRYPTION_KEY; // 32-byte hex string
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY not configured');
    }
    const encryptedApiKey = encrypt(apiKey, encryptionKey);

    // Save to Supabase
    const subscriptionData = {
      email: email.toLowerCase(),
      api_key_encrypted: encryptedApiKey,
      plan_type: planType,
      credits_total: creditsTotal,
      credits_used: 0,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate ? expiryDate.toISOString() : null,
      is_active: true
    };

    // Check if email already exists
    const existing = await supabaseRequest(
      `premium_subscriptions?email=eq.${email.toLowerCase()}&select=*`,
      'GET'
    );

    let result;
    if (existing.length > 0) {
      // Update existing subscription
      result = await supabaseRequest(
        `premium_subscriptions?email=eq.${email.toLowerCase()}`,
        'PATCH',
        subscriptionData
      );
    } else {
      // Create new subscription
      result = await supabaseRequest(
        'premium_subscriptions',
        'POST',
        subscriptionData
      );
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Subscription activated successfully',
        expiryDate: expiryDate,
        credits: creditsTotal
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
