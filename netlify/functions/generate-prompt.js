exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Configuration
    const API_KEY = 'sk-viYHtf-2B2MjDau1OE6fyGNlpS-b8qCPkk9JZLD9kIRoaOrXPCrSRVS_y0b6gJM'; 
    const MODEL_NAME = 'gpt-oss-120b:free'; 
    const TARGET_URL = 'https://api.routeway.ai/v1/chat/completions';

    try {
        const { topic, style } = JSON.parse(event.body);

        if (!topic) {
            return { statusCode: 400, body: JSON.stringify({ error: "Topic is required" }) };
        }

        // 1. Generate Text Prompt
        const systemPrompt = `You are an expert AI prompt generator. Create detailed, creative prompts for AI art. ${style ? `Style: ${style}.` : ''} Respond with ONLY the prompt text.`;
        const userPrompt = `Create a detailed AI image generation prompt for: ${topic}`;

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
        const generatedPrompt = data.choices?.[0]?.message?.content || "An artistic illustration";

        // 2. Generate Image URL (Pollinations.ai)
        // Encode prompt safely for URL
        const encodedPrompt = encodeURIComponent(generatedPrompt.substring(0, 800)); 
        const randomSeed = Math.floor(Math.random() * 10000);
        
        // URL Construction: No Logo, Private, Random Seed for variety
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&private=true&seed=${randomSeed}&width=1024&height=1024`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                prompt: generatedPrompt,
                image: imageUrl
            })
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
