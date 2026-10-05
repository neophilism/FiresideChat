import "dotenv/config";
import { db } from "../src/lib/db";
import { ingestPodcastBySlug } from "../src/lib/feeds/ingest-feed";
import type { IngestionResult } from "../src/lib/feeds/types";

type CliOptions = {
  slugs: string[];
  force: boolean;
  concurrency: number;
};

function usage() {
  console.log(`Usage: npm run ingest:feeds -- [options]

Options:
  --slug <slug>       Ingest one podcast. Repeat to ingest several.
  --force             Ignore disabled status and retry backoff.
  --concurrency <n>   Number of feeds to process concurrently (default: 3, max: 10).
  --help              Show this help message.
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { slugs: [], force: false, concurrency: 3 };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--help") {
      usage();
      process.exit(0);
    }
    if (argument === "--force") {
      options.force = true;
      continue;
    }
    if (argument === "--slug") {
      const slug = args[index + 1];
      if (!slug || slug.startsWith("--")) {
        throw new Error("--slug requires a value");
      }
      options.slugs.push(slug);
      index += 1;
      continue;
    }
    if (argument === "--concurrency") {
      const raw = args[index + 1];
      const value = Number.parseInt(raw ?? "", 10);
      if (!Number.isInteger(value) || value < 1 || value > 10) {
        throw new Error("--concurrency must be an integer from 1 through 10");
      }
      options.concurrency = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${argument}`);
  }

  options.slugs = [...new Set(options.slugs)];
  return options;
}

async function selectSlugs(options: CliOptions): Promise<string[]> {
  if (options.slugs.length > 0) {
    const found = await db.podcast.findMany({
      where: { slug: { in: options.slugs } },
      select: { slug: true },
    });
    const foundSlugs = new Set(found.map((podcast) => podcast.slug));
    const missing = options.slugs.filter((slug) => !foundSlugs.has(slug));
    if (missing.length > 0) {
      throw new Error(`Unknown podcast slug(s): ${missing.join(", ")}`);
    }
    return options.slugs;
  }

  const podcasts = await db.podcast.findMany({
    where: options.force
      ? { active: true }
      : {
          active: true,
          OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: new Date() } }],
        },
    orderBy: { slug: "asc" },
    select: { slug: true },
  });
  return podcasts.map((podcast) => podcast.slug);
}

async function runPool(
  slugs: string[],
  concurrency: number,
  force: boolean,
): Promise<IngestionResult[]> {
  const results: IngestionResult[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < slugs.length) {
      const index = cursor;
      cursor += 1;
      const result = await ingestPodcastBySlug(slugs[index], { force });
      results[index] = result;
      console.log(JSON.stringify(result));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, slugs.length) }, () => worker()),
  );
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const slugs = await selectSlugs(options);

  if (slugs.length === 0) {
    console.log("No podcast feeds are currently due for ingestion.");
    return;
  }

  const results = await runPool(slugs, options.concurrency, options.force);
  const summary = results.reduce(
    (totals, result) => {
      totals[result.status] += 1;
      totals.created += result.episodesCreated;
      totals.updated += result.episodesUpdated;
      totals.skippedEpisodes += result.episodesSkipped;
      return totals;
    },
    {
      succeeded: 0,
      "not-modified": 0,
      skipped: 0,
      failed: 0,
      created: 0,
      updated: 0,
      skippedEpisodes: 0,
    },
  );

  console.log(JSON.stringify({ summary }, null, 2));
  if (summary.failed > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
