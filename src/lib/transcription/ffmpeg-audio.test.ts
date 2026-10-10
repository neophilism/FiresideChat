import assert from "node:assert/strict";
import test from "node:test";
import { parseSegmentIndex } from "./ffmpeg-audio";

test("FFmpeg chunk indexes preserve original positions for searchable playback", () => {
  const segments = parseSegmentIndex(
    'chunk-000.mp3,0.000000,900.024000\nchunk-001.mp3,900.024000,1775.993000\n',
    "/tmp/episode",
  );
  assert.equal(segments.length, 2);
  assert.equal(segments[1].startSeconds, 900.024);
  assert.equal(segments[1].endSeconds, 1775.993);
  assert.match(segments[1].path, /chunk-001\.mp3$/);
});

test("rejects unsafe FFmpeg index filenames and negative timestamp intervals", () => {
  assert.throws(() => parseSegmentIndex("../escape.mp3,0,10", "/tmp/e"), /invalid segment index/);
  assert.throws(() => parseSegmentIndex("chunk-000.mp3,10,5", "/tmp/e"), /invalid segment index/);
});
