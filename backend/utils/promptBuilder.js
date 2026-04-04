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

CRITICAL GRADING RULES:
1. Leniency on Phrasing: Do not penalize for minor semantic differences or journalistic phrasing (e.g., using "begins" for confirmed planned future events or qualifying rounds). If the core substantive facts are accurate and confirmed, grade it highly (80-100) and treat the claim as Verified.
2. Partial Truths: If a claim mixes a true element (or a conceptually true historical element) with a false element (e.g. confusing a completed past mission with a future one, or getting a location right but the finding wrong), DO NOT score it 0. Score it between 30-60 to reflect the partial truth, and use the "Misleading" verdict, explaining what parts are true vs false.
3. Fake News: Only score 0-20 and output "Fake News" for claims that are entirely fabricated with absolutely no logical, historical, or factual basis.

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
