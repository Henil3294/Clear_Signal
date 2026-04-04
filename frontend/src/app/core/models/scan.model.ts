export interface Scan {
  _id: string;
  originalText: string;
  credibilityScore: number;
  verdict: 'Fake News' | 'Misleading' | 'Verified' | 'Unverified';
  verifiedClaims: string[];
  contradictedClaims: string[];
  unverifiableClaims: string[];
  sourcesAgreementRate: number;
  manipulationFlags: string[];
  biasDirection: string;
  tone: string;
  aiExplanation: string;
  fullReportArticle?: string;
  realNewsSources?: string[];
  fakeNewsSources?: string[];
  createdAt: string;
}

export interface ScanHistoryItem {
  _id: string;
  originalText: string;
  credibilityScore: number;
  verdict: string;
  createdAt: string;
}
