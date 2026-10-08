import assert from "node:assert/strict";
import test from "node:test";
import { portraitUrlForSlug, portraitUrls } from "./portraits";

test("maps uploaded congressional portraits to stable public URLs", () => {
  assert.equal(portraitUrlForSlug("ted-cruz"), "/portraits/ted-cruz.webp");
  assert.equal(portraitUrlForSlug("bernie-sanders"), "/portraits/bernie-sanders.webp");
  assert.equal(portraitUrlForSlug("michael-d-brown"), "/portraits/michael-d-brown.webp");
  assert.equal(portraitUrlForSlug("mark-pocan"), "/portraits/MarkPocan_bust.svg");
  assert.equal(portraitUrlForSlug("james-lankford"), "/portraits/JamesLankford_bust.svg");
  assert.equal(portraitUrlForSlug("anthony-weiner"), "/portraits/AnthonyWeiner_bust.svg");
  assert.equal(Object.keys(portraitUrls).length, 42);
});

test("returns null when no uploaded portrait exists", () => {
  assert.equal(portraitUrlForSlug("not-yet-uploaded"), null);
});
