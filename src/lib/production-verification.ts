/** FC-P04: classify source-backed podcast relationship verification without guessing. */
export type VerificationCandidate = {
  personId: string; showId: string; relationship: "HOST" | "COHOST" | "OFFICIAL_PRODUCER" | "GUEST" | "UNKNOWN";
  sourceUrl?: string; observedAt?: string; reviewerConfirmed: boolean;
};
export type VerificationResult = { status: "VERIFIED" | "EXCLUDED_GUEST" | "NEEDS_REVIEW"; reason: string };
export function classifyProductionCandidate(input: VerificationCandidate): VerificationResult {
  if (!input.personId.trim() || !input.showId.trim()) return {status:"NEEDS_REVIEW",reason:"missing-subject"};
  if(input.relationship==="GUEST") return {status:"EXCLUDED_GUEST",reason:"guest-only"};
  if(input.relationship==="UNKNOWN" || !input.reviewerConfirmed) return {status:"NEEDS_REVIEW",reason:"unverified-role"};
  if(!input.sourceUrl || !/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(input.sourceUrl) ||
     !input.observedAt || !/^\d{4}-\d{2}-\d{2}$/.test(input.observedAt))
    return {status:"NEEDS_REVIEW",reason:"missing-source-evidence"};
  return {status:"VERIFIED",reason:"source-backed-host-role"};
}
