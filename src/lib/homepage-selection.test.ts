import assert from "node:assert/strict";
import test from "node:test";
import {
  homepageSideForPerson,
  selectHomepageEpisodes,
} from "./homepage-selection";

function episode(
  id: string,
  publishedAt: string,
  podcastId: string,
  people: Array<{ id: string; slug: string; party: string | null }>,
) {
  return {
    id,
    title: id,
    publishedAt: new Date(publishedAt),
    podcast: {
      id: podcastId,
      title: podcastId,
      slug: podcastId,
      people: people.map((person) => ({ person })),
    },
  };
}

test("homepage balance can override historical party labels", () => {
  assert.equal(
    homepageSideForPerson({
      slug: "joe-walsh",
      party: "Republican",
    }),
    "left",
  );
  assert.equal(
    homepageSideForPerson({
      slug: "erin-houchin",
      party: "Republican",
    }),
    "right",
  );
});

test("featured pair is one left and one right even when the newest nominal Republican is left-balanced", () => {
  const candidates = [
    episode("joe-new", "2026-10-07T17:00:00Z", "joe-show", [
      { id: "joe", slug: "joe-walsh", party: "Republican" },
    ]),
    episode("erin-new", "2026-10-07T14:00:00Z", "erin-show", [
      { id: "erin", slug: "erin-houchin", party: "Republican" },
    ]),
    episode("dem-new", "2026-10-05T14:00:00Z", "dem-show", [
      { id: "dem", slug: "some-democrat", party: "Democratic" },
    ]),
  ];

  const selected = selectHomepageEpisodes(candidates, 3);
  assert.equal(selected[0]?.side, "left");
  assert.equal(selected[0]?.episode.id, "joe-new");
  assert.equal(selected[1]?.side, "right");
  assert.equal(selected[1]?.episode.id, "erin-new");
});

test("the homepage box never repeats a podcaster or show", () => {
  const candidates = [
    episode("left-1", "2026-10-07T18:00:00Z", "left-show", [
      { id: "left", slug: "left-host", party: "Democratic" },
    ]),
    episode("right-1", "2026-10-07T17:00:00Z", "right-show", [
      { id: "right", slug: "right-host", party: "Republican" },
    ]),
    episode("left-2", "2026-10-07T16:00:00Z", "left-show", [
      { id: "left", slug: "left-host", party: "Democratic" },
    ]),
    episode("same-host-other-show", "2026-10-07T15:00:00Z", "left-show-2", [
      { id: "left", slug: "left-host", party: "Democratic" },
    ]),
    episode("other-1", "2026-10-07T14:00:00Z", "other-show", [
      { id: "other", slug: "other-host", party: null },
    ]),
  ];

  const selected = selectHomepageEpisodes(candidates, 6);

  assert.deepEqual(
    selected.map(({ episode: item }) => item.id),
    ["left-1", "right-1", "other-1"],
  );
});

test("selecting a cohosted show prevents either cohost from repeating elsewhere", () => {
  const candidates = [
    episode("joint", "2026-10-07T18:00:00Z", "joint-show", [
      { id: "left", slug: "left-host", party: "Democratic" },
      { id: "cohost", slug: "cohost", party: "Democratic" },
    ]),
    episode("right", "2026-10-07T17:00:00Z", "right-show", [
      { id: "right", slug: "right-host", party: "Republican" },
    ]),
    episode("cohost-solo", "2026-10-07T16:00:00Z", "cohost-show", [
      { id: "cohost", slug: "cohost", party: "Democratic" },
    ]),
  ];

  const selected = selectHomepageEpisodes(candidates, 6);
  assert.deepEqual(
    selected.map(({ episode: item }) => item.id),
    ["joint", "right"],
  );
});
