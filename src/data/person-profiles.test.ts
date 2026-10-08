import assert from "node:assert/strict";
import test from "node:test";
import { personProfiles } from "@/data/person-profiles";
import { podcastRegistry } from "@/data/podcast-registry";

test("every ingestable podcast host has an editorial profile", () => {
  const hostSlugs = new Set(
    podcastRegistry.podcasts.flatMap((podcast) =>
      podcast.people.map(({ personSlug }) => personSlug),
    ),
  );

  for (const slug of hostSlugs) {
    assert.ok(personProfiles[slug], `Missing editorial profile for ${slug}`);
  }
});

test("editorial achievements preserve explicit source links", () => {
  for (const [slug, profile] of Object.entries(personProfiles)) {
    assert.ok(profile.summary.length > 80, `${slug} needs a substantive summary`);
    assert.ok(profile.biography.length >= 2, `${slug} needs a narrative biography`);
    assert.ok(profile.achievements.length >= 2, `${slug} needs at least two record items`);

    for (const achievement of profile.achievements) {
      assert.match(
        achievement.sourceUrl,
        /^https:\/\//,
        `${slug}: achievement source must be an HTTPS URL`,
      );
      assert.ok(achievement.sourceLabel.length > 0);
    }
  }
});
