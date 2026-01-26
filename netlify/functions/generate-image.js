// netlify/functions/generate-image.js
export default async (req, context) => {
  // 1. Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // 2. Parse the body to get the prompt
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    // 3. Call Hugging Face API securely (Token is hidden here on the server)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: {
          Authorization: `Bearer ${Netlify.env.get("HF_TOKEN")}`, // Netlify will inject the secret here
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
        throw new Error(`HF API Error: ${response.statusText}`);
    }

    // 4. Return the image blob directly to the frontend
    const imageBlob = await response.blob();
    return new Response(imageBlob, {
      headers: { "Content-Type": "image/jpeg" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
