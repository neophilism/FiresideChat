/** FC-P05: a changed feed or host needs explicit source review, not automatic trust. */
export type FeedClaim = {
  showId: string; canonicalUrl: string; proposedUrl: string;
  incumbentHostIds: string[]; proposedHostIds: string[];
  sourceUrl?: string; reviewerApproved: boolean;
};
export function assessFeedChange(c: FeedClaim) {
  if(!c.showId || !c.canonicalUrl || !c.proposedUrl) return {decision:"REVIEW",reason:"missing-identifiers"};
  const valid=(v:string)=>{try{const u=new URL(v);return u.protocol==="https:" && Boolean(u.hostname)&&!u.username&&!u.password;}catch{return false;}};
  if(!valid(c.canonicalUrl)||!valid(c.proposedUrl))return {decision:"REVIEW",reason:"invalid-feed-url"};
  const before=[...new Set(c.incumbentHostIds)].sort();
  const after=[...new Set(c.proposedHostIds)].sort();
  if(before.length===0||after.length===0)return {decision:"REVIEW",reason:"unknown-hosts"};
  const changed=before.join("|")!==after.join("|") || c.canonicalUrl!==c.proposedUrl;
  if(!changed)return {decision:"UNCHANGED",reason:"same-hosts-and-feed"};
  if(!c.reviewerApproved || !c.sourceUrl || !valid(c.sourceUrl))
    return {decision:"REVIEW",reason:"changed-host-or-feed-needs-evidence"};
  return {decision:"APPROVED_CHANGE",reason:"explicit-source-reviewed"};
}
