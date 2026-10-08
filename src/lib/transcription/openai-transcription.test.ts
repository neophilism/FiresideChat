import assert from "node:assert/strict";
import test from "node:test";
import { normalizeOpenAITranscript } from "./openai-transcription";

test("normalizes verbose transcription text and timestamp segments", () => {
  const result = normalizeOpenAITranscript({
    text: " Opening statement. Next point. ",
    language: "english",
    segments: [
      { start: 0, end: 2.4, text: " Opening statement. " },
      { start: 2.4, end: 4.8, text: " Next point. " },
    ],
  });

  assert.equal(result.fullText, "Opening statement. Next point.");
  assert.equal(result.language, "english");
  assert.deepEqual(result.segments, [
    { startSeconds: 0, endSeconds: 2.4, text: "Opening statement." },
    { startSeconds: 2.4, endSeconds: 4.8, text: "Next point." },
  ]);
});

test("drops malformed timestamp segments while preserving full text", () => {
  const result = normalizeOpenAITranscript({
    text: "Complete text",
    segments: [
      { start: "bad", end: 1, text: "invalid" },
      { start: 2, end: 1, text: "backwards" },
      { start: 1, end: 2, text: "" },
    ],
  });

  assert.equal(result.fullText, "Complete text");
  assert.deepEqual(result.segments, []);
});

test("rejects empty transcription responses", () => {
  assert.throws(
    () => normalizeOpenAITranscript({ text: "  " }),
    /returned no text/,
  );
});
