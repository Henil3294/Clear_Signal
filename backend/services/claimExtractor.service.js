// STAGE 1 — Extracts core topic, key claims, and named entities from raw input using Gemini

const { askAI } = require('../utils/aiClient');
const { buildClaimExtractionPrompt } = require('../utils/promptBuilder');
const { parseClaimExtractionResponse } = require('../utils/responseParser');

const extractClaims = async (text) => {
    console.log(`[${new Date().toLocaleTimeString()}] 🔍 Stage 1: Extracting claims...`);

    const prompt = buildClaimExtractionPrompt(text);
    const rawResponse = await askAI(prompt);
    const result = parseClaimExtractionResponse(rawResponse);

    console.log(`✅ Core topic: "${result.coreTopic}" | Claims found: ${result.keyClaims.length}`);
    return result;
};

module.exports = { extractClaims };
