import assert from "node:assert/strict";
import test from "node:test";
import { candidateKey, decideReview, hostPeriodIncludes, parseCandidate, parseEvidence, sourceUrl } from "../src/lib/host-review";
const base = {officialKey:"BIOGUIDE:A123456",officialName:"Alex Morgan",identitySourceUrl:"https://bioguide.congress.gov/official",
  showKey:"civic-hour",showTitle:"Civic Hour",proposedRole:"HOST",feedCandidateUrl:"",hostStartOn:"2024-05-01",hostEndOn:""};
const host = parseCandidate(base);
const hostProof = parseEvidence({kind:"HOST_CREDIT",sourceUrl:"https://publisher.example/show",
  excerpt:"The publisher explicitly names this officeholder as the presenter of the show.", observedOn:"2026-10-18"});
const reviewerNote = "The verified publisher page directly names the verified officeholder in the host role.";
test("only source-backed, role-matching, period-bounded candidates can be verified",()=>{
  assert.equal(decideReview(host,[hostProof],"VERIFY",reviewerNote,"2026-10-19"),"VERIFIED");
  assert.throws(()=>decideReview(host,[],"VERIFY",reviewerNote,"2026-10-19"),/NO_MATCHING_ROLE_EVIDENCE/);
  assert.throws(()=>decideReview(host,[{...hostProof,kind:"NETWORK_ONLY"}],"VERIFY",reviewerNote,"2026-10-19"),/NO_MATCHING_ROLE_EVIDENCE/);
  assert.throws(()=>decideReview(host,[{...hostProof,kind:"GUEST_APPEARANCE"}],"VERIFY",reviewerNote,"2026-10-19"),/NO_MATCHING_ROLE_EVIDENCE/);
  assert.throws(()=>decideReview(host,[{...hostProof,observedOn:"2099-01-01"}],"VERIFY",reviewerNote,"2026-10-19"),/NO_MATCHING_ROLE_EVIDENCE/);
  assert.throws(()=>decideReview({...host,hostStartOn:null},[hostProof],"VERIFY",reviewerNote,"2026-10-19"),/ROLE_OR_PERIOD_UNVERIFIED/);
  assert.throws(()=>decideReview({...host,proposedRole:"GUEST"},[hostProof],"VERIFY",reviewerNote,"2026-10-19"),/ROLE_OR_PERIOD_UNVERIFIED/);
});
test("guest exclusion needs evidence and is never automatically promoted",()=>{
  assert.equal(decideReview(host,[{...hostProof,kind:"GUEST_APPEARANCE"}],"EXCLUDE_GUEST",reviewerNote,"2026-10-19"),"EXCLUDED_GUEST");
  assert.throws(()=>decideReview(host,[],"EXCLUDE_GUEST",reviewerNote,"2026-10-19"),/NO_GUEST_EVIDENCE/);
  assert.throws(()=>decideReview(host,[hostProof],"VERIFY","yes","2026-10-19"),/INVALID_TEXT/);
});
test("same names, different official identifiers never merge; multi-host shows stay independent",()=>{
  const second = parseCandidate({...base,officialKey:"BIOGUIDE:B123456",proposedRole:"COHOST"});
  assert.notEqual(candidateKey(host),candidateKey(second));
  assert.equal(hostPeriodIncludes(host,"VERIFIED","2025-03-01"),true);
  assert.equal(hostPeriodIncludes(second,"VERIFIED","2025-03-01"),true);
  assert.equal(hostPeriodIncludes(host,"PENDING","2025-03-01"),false);
});
test("changed-host dates never attribute older episodes",()=>{
  const later=parseCandidate({...base,hostStartOn:"2025-02-01",hostEndOn:"2025-11-30"});
  assert.equal(hostPeriodIncludes(later,"VERIFIED","2024-12-01"),false);
  assert.equal(hostPeriodIncludes(later,"VERIFIED","2025-05-01"),true);
  assert.equal(hostPeriodIncludes(later,"VERIFIED","2025-12-01"),false);
});
test("untrusted and malformed URL, dates and identities reject",()=>{
  for(const url of ["http://publisher.example","https://u:p@publisher.example/","https://publisher.example/?token=x","javascript:alert(1)"])
    assert.throws(()=>sourceUrl(url),/INVALID_SOURCE_URL/);
  assert.throws(()=>parseCandidate({...base,officialKey:"Alex Morgan"}),/INVALID_OFFICIAL_IDENTITY/);
  assert.throws(()=>parseCandidate({...base,hostStartOn:"2026-02-30"}),/INVALID_DAY/);
  assert.throws(()=>parseCandidate({...base,hostEndOn:"2023-01-01"}),/INVALID_HOST_PERIOD/);
});
