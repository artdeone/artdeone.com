const https = require("https");

// ✅ 4 Working Free Models (Jan 2026)
const MODEL_PATHS = {
  "flux-schnell": "/hf-inference/models/black-forest-labs/FLUX.1-schnell",
  "sdxl": "/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  "sd3-medium": "stabilityai/stable-diffusion-3.5-medium",
  "openjourney": "/hf-inference/models/prompthero/openjourney"
};

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  try {
    const { prompt, model = "flux-schnell" } = JSON.parse(event.body || "{}");
    
    if (!prompt) return { statusCode: 400, headers, body: "Prompt required" };

    const modelPath = MODEL_PATHS[model];
    if (!modelPath) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ 
          error: `Model "${model}" is not supported.`
        })
      };
    }

    const token = process.env.HF_TOKEN;
    if (!token) return { statusCode: 500, headers, body: "HF_TOKEN missing" };

    console.log(`Generating with model: ${model}, path: ${modelPath}`);

    return await new Promise((resolve) => {
      const options = {
        hostname: "router.huggingface.co",
        path: modelPath,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const req = https.request(options, (res) => {
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          
          if (res.statusCode !== 200) {
            const errorMsg = buf.toString("utf8");
            console.error("HF API Error:", res.statusCode, errorMsg);
            resolve({
              statusCode: res.statusCode || 500,
              headers,
              body: JSON.stringify({ 
                error: errorMsg,
                statusCode: res.statusCode 
              }),
            });
            return;
          }

          resolve({
            statusCode: 200,
            headers: { 
              ...headers,
              "Content-Type": "image/jpeg" 
            },
            body: buf.toString("base64"),
            isBase64Encoded: true,
          });
        });
      });

      req.on("error", (e) => {
        console.error("Request Error:", e.message);
        resolve({ 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ error: e.message })
        });
      });

      req.write(JSON.stringify({ inputs: prompt }));
      req.end();
    });
  } catch (e) {
    console.error("Function Error:", e.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: e.message })
    };
  }
};
