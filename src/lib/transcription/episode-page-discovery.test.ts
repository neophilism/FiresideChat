import assert from "node:assert/strict";
import test from "node:test";
import { findTranscriptLinks } from "./episode-page-discovery";

test("discovers a transcript linked from the exact episode page", () => {
  const html = '<a href="/other">Other</a><a href="/episodes/10/transcript.vtt">Read Transcript</a>';
  assert.deepEqual(findTranscriptLinks(html, "https://example.com/episodes/10"), [
    "https://example.com/episodes/10/transcript.vtt",
  ]);
});

test("does not mistake guest descriptions and private URLs for transcript links", () => {
  const html = '<a href="/guests">Transcript of who was interviewed</a>' +
    '<a href="http://127.0.0.1/admin">Download transcript</a>' +
    '<a href="javascript:alert(1)">Transcript</a>';
  const links = findTranscriptLinks(html, "https://example.com/episode");
  assert.deepEqual(links, ["https://example.com/guests"]);
});

test("does not ingest unrelated links merely containing the word transcript", () => {
  assert.deepEqual(findTranscriptLinks('<a href="/transcript-repo">Home</a>', "https://example.org/e/1"), []);
});
