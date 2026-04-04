// Safely parses Gemini's JSON response and validates required fields

const parseGeminiResponse = (rawText) => {
    try {
        const cleaned = rawText
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        // Validate required fields exist
        const required = ['credibilityScore', 'verdict', 'aiExplanation'];
        for (const field of required) {
            if (parsed[field] === undefined || parsed[field] === null) {
                throw new Error(`Gemini response missing required field: ${field}`);
            }
        }

        // Sanitize — ensure arrays are arrays
        const arrayFields = ['verifiedClaims', 'contradictedClaims', 'unverifiableClaims', 'manipulationFlags'];
        for (const field of arrayFields) {
            if (!Array.isArray(parsed[field])) {
                parsed[field] = [];
            }
        }

        // Clamp score between 0-100
        parsed.credibilityScore = Math.min(100, Math.max(0, Number(parsed.credibilityScore)));
        parsed.sourcesAgreementRate = Math.min(100, Math.max(0, Number(parsed.sourcesAgreementRate || 0)));

        return parsed;
    } catch (err) {
        throw new Error(`Failed to parse Gemini response: ${err.message}`);
    }
};

const parseClaimExtractionResponse = (rawText) => {
    try {
        const cleaned = rawText
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            coreTopic: parsed.coreTopic || '',
            keyClaims: Array.isArray(parsed.keyClaims) ? parsed.keyClaims : [],
            namedEntities: Array.isArray(parsed.namedEntities) ? parsed.namedEntities : []
        };
    } catch (err) {
        throw new Error(`Failed to parse claim extraction response: ${err.message}`);
    }
};

module.exports = { parseGeminiResponse, parseClaimExtractionResponse };
