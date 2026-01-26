const https = require("https");

// ✅ Model paths mapping
const MODEL_PATHS = {
  "flux-schnell": "/hf-inference/models/black-forest-labs/FLUX.1-schnell",
  "flux-dev": "/hf-inference/models/black-forest-labs/FLUX.1-dev",
  "sdxl": "/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
  "playground": "/hf-inference/models/playgroundai/playground-v2.5-1024px-aesthetic"
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
    const { prompt, model = "flux-dev" } = JSON.parse(event.body || "{}"); // ✅ model ရယ်မယ်
    
    if (!prompt) return { statusCode: 400, headers, body: "Prompt required" };

    // ✅ Model path ရွေးမယ်
    const modelPath = MODEL_PATHS[model] || MODEL_PATHS["flux-dev"];

    const token = process.env.HF_TOKEN;
    if (!token) return { statusCode: 500, headers, body: "HF_TOKEN missing" };

    console.log(`Generating with model: ${model}, path: ${modelPath}`); // ✅ Debug log

    return await new Promise((resolve) => {
      const options = {
        hostname: "router.huggingface.co",
        path: modelPath, // ✅ Dynamic path
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
