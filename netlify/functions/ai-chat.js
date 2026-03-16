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
            "mistral-saba-24b",
            "qwen/qwen3-32b"
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
            let errMsg = `AI service error: ${response.status}`;
            try {
                const errJson = JSON.parse(errText);
                errMsg = errJson.error?.message || errMsg;
            } catch(_) {}
            return {
                statusCode: response.status,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: errMsg })
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
