// Groq is a high-speed, OpenAI-compatible AI client.
const askGroq = async (prompt) => {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) throw new Error('GROQ_API_KEY is missing from .env');

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type':  'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "You are a news fact-checking assistant. Always respond in valid JSON format." },
                    { role: "user", content: prompt }
                ],
                // Force JSON response
                response_format: { type: "json_object" },
                temperature: 0.2
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Groq API Error:', JSON.stringify(data, null, 2));
            throw new Error(`Groq API Error: ${data.error?.message || 'Unknown Groq failure'}`);
        }

        return data.choices[0].message.content;

    } catch (e) {
        console.error('⚠️  Groq Fetch Error:', e.message);
        throw e;
    }
};

module.exports = { askGroq };
