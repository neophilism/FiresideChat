import test from "node:test";
import assert from "node:assert/strict";
import {assessFeedChange} from "../src/lib/feed-disambiguation";
const c={showId:"show",canonicalUrl:"https://publisher.example/feed",proposedUrl:"https://publisher.example/feed",incumbentHostIds:["bioguide-a"],proposedHostIds:["bioguide-a"],reviewerApproved:false};
test("unchanged host and feed preserve verified mapping",()=>assert.equal(assessFeedChange(c).decision,"UNCHANGED"));
test("host changes and feed moves require source-reviewed approval",()=>{
 assert.equal(assessFeedChange({...c,proposedHostIds:["bioguide-b"]}).decision,"REVIEW");
 assert.equal(assessFeedChange({...c,proposedUrl:"https://other.example/rss"}).decision,"REVIEW");
 assert.equal(assessFeedChange({...c,proposedHostIds:["bioguide-b"],reviewerApproved:true,sourceUrl:"https://publisher.example/notice"}).decision,"APPROVED_CHANGE");
});
test("unverified url and unknown identities stay held",()=>{
 assert.equal(assessFeedChange({...c,proposedUrl:"http://localhost/private"}).decision,"REVIEW");
 assert.equal(assessFeedChange({...c,proposedHostIds:[]}).decision,"REVIEW");
});
