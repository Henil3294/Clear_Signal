const { askGemini } = require('./geminiClient');
const { askGroq }   = require('./groqClient');

/**
 * Universal AI Entry Point: Multi-AI Logic
 * First, try Gemini. If it hits a quota limit (429), instantly switch to Groq.
 */
const askAI = async (prompt) => {
    try {
        console.log(`[${new Date().toLocaleTimeString()}] 🚀 AI Request: Primary (Gemini)...`);
        return await askGemini(prompt);
    } catch (e) {
        // 429 = Quota or Busy
        if (e.message.includes('429') || e.message.toLowerCase().includes('quota')) {
            console.warn(`⚠️  Gemini Busy. Switching to Fallback: Groq (Llama-3)...`);
            try {
                return await askGroq(prompt);
            } catch (groqErr) {
                console.error(`❌ Both AI providers failed: ${groqErr.message}`);
                throw new Error('All Neural Links Busy. Performance at 0%. Please wait.');
            }
        }
        
        // Any other non-429 error (e.g., safety filter block), we throw so the UI handles it
        throw e;
    }
};

module.exports = { askAI };
