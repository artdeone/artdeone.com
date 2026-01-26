// netlify/functions/generate-image.js
const https = require("https");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt) return { statusCode: 400, body: "Prompt required" };

    const token = process.env.HF_TOKEN;
    if (!token) return { statusCode: 500, body: "HF_TOKEN missing on server" };

    return await new Promise((resolve) => {
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

            // HF က error ပြန်ပို့ရင် text/json ဖြစ်တတ်ပါတယ်
            if (res.statusCode !== 200) {
              resolve({
                statusCode: res.statusCode || 500,
                body: buf.toString("utf8"),
              });
              return;
            }

            resolve({
              statusCode: 200,
              headers: { "Content-Type": "image/jpeg" },
              body: buf.toString("base64"),
              isBase64Encoded: true,
            });
          });
        }
      );

      req.on("error", (e) => {
        resolve({ statusCode: 500, body: e.message });
      });

      req.write(JSON.stringify({ inputs: prompt }));
      req.end();
    });
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
