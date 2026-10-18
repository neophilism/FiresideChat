import assert from "node:assert/strict";
import test from "node:test";
import { classifyProductionCandidate } from "../src/lib/production-verification";
const candidate={personId:"P123",showId:"show-a",relationship:"HOST" as const,sourceUrl:"https://example.org/show",observedAt:"2026-10-18",reviewerConfirmed:true};
test("requires source and explicit reviewer verification for host claims",()=> {
 assert.equal(classifyProductionCandidate(candidate).status,"VERIFIED");
 assert.equal(classifyProductionCandidate({...candidate,reviewerConfirmed:false}).status,"NEEDS_REVIEW");
 assert.equal(classifyProductionCandidate({...candidate,sourceUrl:undefined}).status,"NEEDS_REVIEW");
});
test("guest appearance never qualifies as a hosted podcast",()=> {
 assert.equal(classifyProductionCandidate({...candidate,relationship:"GUEST"}).status,"EXCLUDED_GUEST");
});
test("unverified claims and missing identities remain queued",()=> {
 assert.equal(classifyProductionCandidate({...candidate,relationship:"UNKNOWN"}).status,"NEEDS_REVIEW");
 assert.equal(classifyProductionCandidate({...candidate,personId:""}).status,"NEEDS_REVIEW");
});
