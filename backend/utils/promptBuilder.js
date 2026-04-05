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
   - Start at 50 points.
   - Add/Subtract points for every verified or contradicted claim found in the Web Evidence.
   - Adjust for source reliability (e.g., a BBC confirm is +15, a random blog confirm is +5).
2. Explicit Granularity: DO NOT use rounded numbers like 0, 40, 50, 80, or 100 unless the evidence is mathematically absolute. Aim for specific, "non-snappy" numbers like 13, 37, 42, 68, or 91 to reflect a precise, non-hardcoded analysis. 
3. Logic Gap: If evidence is mixed, the score MUST reflect that exact ratio. Never "snap" to the nearest 10.
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
