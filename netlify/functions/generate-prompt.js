// netlify/functions/generate-prompt.js

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // API Configuration
    const API_KEY = process.env.ZAI_API_KEY || "sk-viYHtf-2B2MjDau1OE6fyGNlpS-b8qCPkk9JZLD9kIRoaOrXPCrSRVS_y0b6gJM";
    const MODEL_NAME = 'kimi-k2-0905:free';
    const TARGET_URL = 'https://api.routeway.ai/v1/chat/completions';

    try {
        const requestBody = JSON.parse(event.body);
        const { topic, style } = requestBody;

        if (!topic) {
            return { statusCode: 400, body: JSON.stringify({ error: "Topic is required" }) };
        }

        const systemPrompt = `You are an expert AI prompt generator. Create detailed, creative prompts for AI art based on the user's topic.
        Guidelines:
        1. Vivid, descriptive details (lighting, composition, mood, colors).
        2. Technical parameters (aspect ratio, camera settings).
        3. Specific to high-quality results ("high resolution", "8k").
        4. ${style ? `Focus heavily on this art style: ${style}.` : ''}
        Respond with ONLY the prompt text.`;

        const userPrompt = `Create a detailed AI image generation prompt for: ${topic}`;

        // Call the external API (Server-side fetch)
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.error || "API Error" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
