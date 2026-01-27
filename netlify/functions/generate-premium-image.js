const https = require('https');

// Premium Models Configuration (2026)
const PREMIUM_MODELS = {
  'flux-2-pro': {
    provider: 'together',
    path: '/v1/images/generations',
    hostname: 'api.together.xyz',
    credits: 2,
    params: { model: 'black-forest-labs/FLUX.2-pro' }
  },
  'flux-pro': {
    provider: 'together',
    path: '/v1/images/generations',
    hostname: 'api.together.xyz',
    credits: 1,
    params: { model: 'black-forest-labs/FLUX.1-pro' }
  },
  'dalle-3': {
    provider: 'openai',
    path: '/v1/images/generations',
    hostname: 'api.openai.com',
    credits: 1,
    params: { model: 'dall-e-3', size: '1024x1024', quality: 'standard' }
  },
  'sdxl-turbo': {
    provider: 'stability',
    path: '/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    hostname: 'api.stability.ai',
    credits: 1,
    params: {}
  }
};

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
      res.on('end', () => resolve({ statusCode: res.statusCode, body: body }));
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Generate image with specific provider
function generateImage(modelConfig, prompt, apiKey) {
  return new Promise((resolve, reject) => {
    let requestBody;
    let headers = { 'Content-Type': 'application/json' };

    if (modelConfig.provider === 'openai') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      requestBody = {
        ...modelConfig.params,
        prompt: prompt,
        n: 1
      };
    } else if (modelConfig.provider === 'together') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      requestBody = {
        ...modelConfig.params,
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 30,
        n: 1
      };
    } else if (modelConfig.provider === 'stability') {
      headers['Authorization'] = `Bearer ${apiKey}`;
      requestBody = {
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1
      };
    }

    const options = {
      hostname: modelConfig.hostname,
      path: modelConfig.path,
      method: 'POST',
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true, data: body });
        } else {
          reject(new Error(`API Error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
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
    const { email, prompt, model = 'flux-pro' } = JSON.parse(event.body || '{}');

    if (!email || !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email and prompt required' })
      };
    }

    const modelConfig = PREMIUM_MODELS[model];
    if (!modelConfig) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: `Model "${model}" not supported` })
      };
    }

    // Validate subscription
    const validateResponse = await fetch(`${process.env.URL}/.netlify/functions/validate-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!validateResponse.ok) {
      const error = await validateResponse.json();
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: error.error || 'Subscription invalid' })
      };
    }

    const validation = await validateResponse.json();

    // Check credits for credit-based plans
    if (validation.creditsRemaining !== null && validation.creditsRemaining < modelConfig.credits) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Insufficient credits' })
      };
    }

    // Generate image
    console.log(`Generating with model: ${model}`);
    const imageResult = await generateImage(modelConfig, prompt, validation.apiKey);

    // Update credits if credit-based plan
    if (validation.creditsRemaining !== null) {
      const subscriptions = await supabaseRequest(
        `premium_subscriptions?email=eq.${email.toLowerCase()}&select=*`,
        'GET'
      );
      const sub = JSON.parse(subscriptions.body)[0];

      await supabaseRequest(
        `premium_subscriptions?email=eq.${email.toLowerCase()}`,
        'PATCH',
        { credits_used: sub.credits_used + modelConfig.credits }
      );

      // Log generation
      await supabaseRequest(
        'generation_logs',
        'POST',
        {
          subscription_id: sub.id,
          model_name: model,
          prompt: prompt.substring(0, 500),
          credits_used: modelConfig.credits
        }
      );
    }

    return {
      statusCode: 200,
      headers,
      body: imageResult.data
    };

  } catch (error) {
    console.error('Generation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
