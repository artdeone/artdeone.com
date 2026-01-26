// netlify/functions/generate-image.js
const https = require('https');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        if (!prompt) return { statusCode: 400, body: "Prompt required" };

        const token = process.env.HF_TOKEN; 
        if (!token) return { statusCode: 500, body: "Server Error: Token missing" };

        return new Promise((resolve, reject) => {
            const req = https.request("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }, (res) => {
                const chunks = [];
                res.on('data', (d) => chunks.push(d));
                res.on('end', () => {
                    if (res.statusCode !== 200) {
                        resolve({ statusCode: res.statusCode, body: `HF Error: ${Buffer.concat(chunks).toString()}` });
                    } else {
                        const buffer = Buffer.concat(chunks);
                        resolve({
                            statusCode: 200,
                            headers: { "Content-Type": "image/jpeg" },
                            body: buffer.toString('base64'),
                            isBase64Encoded: true
                        });
                    }
                });
            });

            req.on('error', (e) => resolve({ statusCode: 500, body: e.message }));
            req.write(JSON.stringify({ inputs: prompt }));
            req.end();
        });

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
