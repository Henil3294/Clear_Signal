// STAGE 3 — Sends article + all evidence to Gemini for deep comparison-based analysis

const { askAI } = require('../utils/aiClient');
const { buildAnalysisPrompt } = require('../utils/promptBuilder');
const { parseGeminiResponse } = require('../utils/responseParser');

const analyzeWithEvidence = async (text, evidence) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🤖 Stage 3: Deep analysis with intelligence fallback...`);

    const prompt = buildAnalysisPrompt(text, evidence);
    const rawResponse = await askAI(prompt);
    const result = parseGeminiResponse(rawResponse);

    console.log(`✅ Analysis complete. Score: ${result.credibilityScore} | Verdict: ${result.verdict}`);
    return result;
};

module.exports = { analyzeWithEvidence };
