exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "GROQ_API_KEY not configured" })
        };
    }

    try {
        const { model, messages } = JSON.parse(event.body);

        if (!messages || !messages.length) {
            return { statusCode: 400, body: JSON.stringify({ error: "Messages required" }) };
        }

        const allowedModels = [
            "deepseek-r1-distill-llama-70b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "gemma2-9b-it",
            "mixtral-8x7b-32768",
            "qwen-qwq-32b"
        ];

        const selectedModel = allowedModels.includes(model) ? model : "llama-3.3-70b-versatile";

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: messages.slice(-20),
                temperature: 0.7,
                max_tokens: 4096,
                stream: false
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Groq API error:", response.status, errText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `AI service error: ${response.status}` })
            };
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply })
        };

    } catch (error) {
        console.error("ai-chat error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};
