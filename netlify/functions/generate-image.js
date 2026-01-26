const https = require("https");

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
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) return { statusCode: 400, headers, body: "Prompt required" };

    const token = process.env.HF_TOKEN;
    if (!token) return { statusCode: 500, headers, body: "HF_TOKEN missing" };

    return await new Promise((resolve) => {
      // ✅ မှန်ကန်တဲ့ API endpoint
      const req = https.request(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
        (res) => {
          const chunks = [];
          res.on("data", (d) => chunks.push(d));
          res.on("end", () => {
            const buf = Buffer.concat(chunks);
            
            // ✅ Error ဖြစ်ရင် အသေးစိတ် ပြန်ပြမယ်
            if (res.statusCode !== 200) {
              const errorMsg = buf.toString("utf8");
              console.error("HF API Error:", errorMsg);
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

            // ✅ အောင်မြင်ရင် image ပြန်ပြမယ်
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
        }
      );

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
