exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { topic, style } = JSON.parse(event.body);
        
        // 1. OpenRouter API Key
        // Netlify Env Var ထဲမှာ ထည့်ထားရင် process.env.OPENROUTER_API_KEY
        // မထည့်ရသေးရင် "sk-or-v1-..." နေရာမှာ တိုက်ရိုက်ထည့်ပါ။
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "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"; 

        const systemPrompt = `You are an expert AI prompt generator. Create detailed, creative prompts for AI art based on the user's topic.
        Guidelines:
        1. Vivid details (lighting, composition, mood).
        2. Technical specs (aspect ratio, camera).
        3. ${style ? `Style Focus: ${style}` : ''}
        Respond with ONLY the prompt text.`;

        const userPrompt = `Create a detailed AI image generation prompt for: ${topic}`;

        // 2. Call OpenRouter API
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                // Optional headers for OpenRouter rankings
                "HTTP-Referer": "https://artdeone.com", 
                "X-Title": "ART de ONE Prompt Gen" 
            },
            body: JSON.stringify({
                // 3. Choose a Free or Cheap Text Model
                // 'google/gemini-2.0-flash-exp:free' is very fast and free
                // 'meta-llama/llama-3-8b-instruct:free' is also good
                "model": "google/gemini-2.0-flash-exp:free", 
                
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userPrompt }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`OpenRouter Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        
        // 4. Extract Content
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
             throw new Error("No content returned from AI");
        }

        // 5. Return Success Response
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                choices: [{ message: { content: content } }] 
            }) 
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
