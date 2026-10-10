import assert from "node:assert/strict";
import test from "node:test";
import { parsePublisherTranscript } from "./publisher-transcript";

test("parses WebVTT publisher transcripts into searchable text and segments", () => {
  const parsed = parsePublisherTranscript(
    `WEBVTT

00:00:01.000 --> 00:00:04.500
Opening statement.

00:00:05.000 --> 00:00:08.000
A second <b>line</b>.
`,
    "text/vtt",
  );

  assert.equal(parsed.fullText, "Opening statement.\nA second line.");
  assert.deepEqual(parsed.segments, [
    { startSeconds: 1, endSeconds: 4.5, text: "Opening statement." },
    { startSeconds: 5, endSeconds: 8, text: "A second line." },
  ]);
});

test("parses SRT timing and comma milliseconds", () => {
  const parsed = parsePublisherTranscript(
    `1
00:01:02,500 --> 00:01:05,000
Hello Congress.

2
00:01:06,000 --> 00:01:07,250
Next line.
`,
    "application/x-subrip",
  );

  assert.equal(parsed.segments[0].startSeconds, 62.5);
  assert.equal(parsed.segments[1].endSeconds, 67.25);
});

test("accepts plain-text publisher transcripts", () => {
  const parsed = parsePublisherTranscript(
    "First paragraph.\n\nSecond paragraph.",
    "text/plain; charset=utf-8",
  );

  assert.equal(parsed.fullText, "First paragraph.\n\nSecond paragraph.");
  assert.deepEqual(parsed.segments, []);
});

test("rejects unsupported binary transcript types", () => {
  assert.throws(
    () => parsePublisherTranscript("binary-ish", "application/pdf"),
    /Unsupported publisher transcript type/,
  );
});

test("accepts Podcasting 2.0 JSON segment transcripts", () => {
  const parsed = parsePublisherTranscript(
    JSON.stringify({ segments: [
      { startTime: 1.5, endTime: 3, body: "First statement" },
      { startTime: 3, endTime: 5.2, body: "Second statement" },
    ] }),
    "application/json",
  );
  assert.equal(parsed.fullText, "First statement\nSecond statement");
  assert.equal(parsed.segments[0].startSeconds, 1.5);
});

test("imports HTML transcripts while dropping navigation and scripts", () => {
  const parsed = parsePublisherTranscript(
    "<html><nav>Menu</nav><article><p>Hello Congress.</p><p>Next point &amp; more.</p></article><script>alert(1)</script></html>",
    "text/html",
  );
  assert.match(parsed.fullText, /Hello Congress/);
  assert.match(parsed.fullText, /Next point & more/);
  assert.doesNotMatch(parsed.fullText, /alert|Menu/);
});
