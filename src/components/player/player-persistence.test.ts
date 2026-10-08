import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizePersistedPlayerState,
  parsePersistedPlayerState,
  serializePlayerState,
} from "./player-persistence";

const episode = {
  id: "ep-1",
  title: "A conversation",
  audioUrl: "https://cdn.example.com/episode.mp3",
  podcastTitle: "Example Show",
  podcastSlug: "example-show",
  personName: "Example Person",
  imageUrl: "/portraits/example.png",
};

test("round-trips a valid resumable player state", () => {
  const serialized = serializePlayerState({
    episode,
    currentTime: 125,
    duration: 1800,
    volume: 0.65,
    playbackRate: 1.25,
  });

  assert.deepEqual(parsePersistedPlayerState(serialized), {
    version: 1,
    episode,
    currentTime: 125,
    duration: 1800,
    volume: 0.65,
    playbackRate: 1.25,
  });
});

test("resets an episode that was effectively finished", () => {
  const restored = normalizePersistedPlayerState({
    version: 1,
    episode,
    currentTime: 1790,
    duration: 1800,
    volume: 1,
    playbackRate: 1,
  });

  assert.equal(restored?.currentTime, 0);
});

test("clamps user preferences and rejects malformed state", () => {
  const restored = normalizePersistedPlayerState({
    version: 1,
    episode,
    currentTime: 12,
    duration: 120,
    volume: 9,
    playbackRate: 8,
  });

  assert.equal(restored?.volume, 1);
  assert.equal(restored?.playbackRate, 3);
  assert.equal(parsePersistedPlayerState("{bad json"), null);
  assert.equal(normalizePersistedPlayerState({ version: 1 }), null);
});
