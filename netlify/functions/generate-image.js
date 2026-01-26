const https = require("https");

exports.handler = async (event) => {
  // ✅ 1. CORS Headers (ဘယ်သူမဆို ခေါ်ခွင့်ပြုမည်)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // ✅ 2. Handle Preflight Request (Browser က အရင်စမ်းကြည့်တာကို လက်ခံမည်)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK"
    };
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
      const req = https.request(
        "https://router.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
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
            
            if (res.statusCode !== 200) {
              resolve({
                statusCode: res.statusCode || 500,
                headers, // Error တက်ရင်လည်း CORS header ပါရမယ်
                body: buf.toString("utf8"),
              });
              return;
            }

            resolve({
              statusCode: 200,
              headers: { 
                  ...headers, // CORS header + Content Type
                  "Content-Type": "image/jpeg" 
              },
              body: buf.toString("base64"),
              isBase64Encoded: true,
            });
          });
        }
      );

      req.on("error", (e) => {
        resolve({ statusCode: 500, headers, body: e.message });
      });

      req.write(JSON.stringify({ inputs: prompt }));
      req.end();
    });
  } catch (e) {
    return { statusCode: 500, headers, body: e.message };
  }
};