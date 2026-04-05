const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const askGemini = async (prompt, retries = 3) => {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing from .env');

    // Using gemini-2.0-flash as verified by the user's latest logs
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const safetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
    ];

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" },
                    safetySettings
                })
            });

            const data = await response.json();

            if (response.status === 429) {
                if (attempt === retries) {
                    throw new Error('Gemini Quota Fully Exhausted (429). Please wait and try again.');
                }
                const wait = Math.pow(2, attempt) * 1000;
                console.warn(`⚠️  Gemini Busy (429). Attempt ${attempt}/${retries}. Retrying in ${wait/1000}s...`);
                await sleep(wait);
                continue;
            }

            if (!response.ok) {
                console.error('❌ Gemini Error Payload:', JSON.stringify(data, null, 2));
                throw new Error(`Gemini API Error: ${data.error?.message || JSON.stringify(data.error)}`);
            }

            // CRITICAL: Handle safety blocks (where candidates is missing or empty)
            if (!data.candidates || data.candidates.length === 0) {
                const blockReason = data.promptFeedback?.blockReason || 'SAFETY';
                throw new Error(`Gemini blocked this topic: ${blockReason}`);
            }

            return data.candidates[0].content.parts[0].text;

        } catch (e) {
            if (attempt === retries) throw e;
            console.warn(`⚠️  Gemini Error (Attempt ${attempt}): ${e.message}. Retrying...`);
            await sleep(attempt * 1000);
        }
    }
};

module.exports = { askGemini };