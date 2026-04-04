// Uses native Node.js fetch (Node 18+). No axios needed.
const askGemini = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY.trim();

    if (!apiKey) throw new Error('GEMINI_API_KEY is missing from .env');

    // Using gemini-2.5-flash which does not have tight 429 limits on the free tier
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            // Force strict JSON mode to skip introductory text, making generation instant
            generationConfig: {
                responseMimeType: "application/json",
            }
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Gemini API Error: ${JSON.stringify(data.error)}`);
    }

    return data.candidates[0].content.parts[0].text;
};

module.exports = { askGemini };