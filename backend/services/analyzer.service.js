// STAGE 3 — Sends article + all evidence to Gemini for deep comparison-based analysis

const { askGemini } = require('../utils/geminiClient');
const { buildAnalysisPrompt } = require('../utils/promptBuilder');
const { parseGeminiResponse } = require('../utils/responseParser');

const analyzeWithEvidence = async (text, evidence) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🤖 Stage 3: Deep analysis with Gemini...`);

    const prompt = buildAnalysisPrompt(text, evidence);
    const rawResponse = await askGemini(prompt);
    const result = parseGeminiResponse(rawResponse);

    console.log(`✅ Analysis complete. Score: ${result.credibilityScore} | Verdict: ${result.verdict}`);
    return result;
};

module.exports = { analyzeWithEvidence };
