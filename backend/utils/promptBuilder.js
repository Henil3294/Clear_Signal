// FIX: Only analysis prompt existed — claim extraction prompt was missing

const buildClaimExtractionPrompt = (article) => {
    return `
You are an expert investigative journalist.
Extract the key information from the following article or headline.
Respond ONLY with a raw JSON object — no markdown, no backticks, no explanation.

Article/Claim:
"${article}"

Return EXACTLY this JSON structure:
{
  "coreTopic": "<The main subject in 5-10 words>",
  "keyClaims": ["<claim 1>", "<claim 2>", "<claim 3>"],
  "namedEntities": ["<person, org, or place mentioned>"]
}
`.trim();
};

const buildAnalysisPrompt = (article, evidence) => {
    const evidenceText = JSON.stringify(evidence, null, 2);
    return `
You are an expert fact-checker, investigative journalist, and legal analyst.
I will provide you with a news article or claim, plus evidence gathered from Google Search, NewsAPI, and Wikipedia.
Analyze the claims against the evidence and respond ONLY with a raw JSON object — no markdown, no backticks, no explanation outside the JSON.

CRITICAL GRADING RULES (PROCEDURAL SCORING):
1. Formula-Based Score: Calculate the credibilityScore mathematically based on the specific evidence. 
   - Start at a base value and apply weighted modifiers.
   - Every verified claim from a high-authority source adds a unique weighted bonus.
   - Every contradicted claim from a reliable source subtracts a weighted penalty.
2. Procedural Variance: Generate a unique, high-precision decimal result. 
   - STRICT RULE: Do NOT use "nerdy" or "famous" constants like 42, 137, 7, or 69. 
   - Use the total character count of the evidence as a mathematical seed to ensure decimal variety.
   - The decimal part MUST look like a genuine result of division (e.g., .19, .58, .04), never a "chosen" number.
3. Logic Gap: If evidence is mixed, the score MUST reflect that exact ratio.
4. Verdict Mapping: 
   - 0-25: "Fake News"
   - 26-65: "Misleading"
   - 66-89: "Verified" (with minor caveats)
   - 90-100: "Verified" (absolute truth)
   - "Unverified": Only if NO evidence exists at all.

Article/Claim:
"${article}"

Web Evidence:
${evidenceText}

Return EXACTLY this JSON structure:
{
  "credibilityScore": <number 0-100>,
  "verdict": "Fake News" | "Misleading" | "Verified" | "Unverified",
  "verifiedClaims": ["<string>"],
  "contradictedClaims": ["<string>"],
  "unverifiableClaims": ["<string>"],
  "sourcesAgreementRate": <number 0-100>,
  "manipulationFlags": ["<string>"],
  "biasDirection": "left-leaning" | "right-leaning" | "neutral" | "sensationalist",
  "tone": "alarmist" | "objective" | "satirical",
  "aiExplanation": "<A concise, lawyer-style breakdown of why this verdict was reached.>",
  "fullReportArticle": "<An extensive, multi-paragraph journalistic report explaining exactly why the news is contradicted, where the claim becomes fake, and what parts (if any) are factually true. Use \\n\\n for paragraph breaks.>",
  "realNewsSources": ["<Verified Title: URL snippet or quote supporting the truth>"],
  "fakeNewsSources": ["<Unreliable Title: URL snippet or quote proving the claim false/misleading>"]
}
`.trim();
};

module.exports = { buildClaimExtractionPrompt, buildAnalysisPrompt };
