const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const askGemini = async (prompt, retries = 3) => {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error('GEMINI_API_KEY is missing from .env');

    // Using gemini-1.5-flash (Beta) for higher free quotas (15 per min)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            const data = await response.json();

            if (response.status === 429) {
                const wait = Math.pow(2, attempt) * 1000;
                console.warn(`⚠️  Gemini Busy (429). Attempt ${attempt}/${retries}. Retrying in ${wait/1000}s...`);
                await sleep(wait);
                continue;
            }

            if (!response.ok) {
                throw new Error(`Gemini API Error: ${data.error?.message || JSON.stringify(data.error)}`);
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