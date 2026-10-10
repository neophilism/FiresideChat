import "dotenv/config";
import { db } from "../src/lib/db";
import { backfillExternalTranscripts } from "../src/lib/transcription/external-transcripts";

function optionalLimit(name: string): number | undefined {
  const prefix = "--" + name + "=";
  const raw = process.argv.find((value) => value.startsWith(prefix));
  if (!raw) return undefined;
  const value = Number(raw.slice(prefix.length));
  if (!Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new Error(prefix + " requires an integer from 0 to 10000");
  }
  return value;
}

async function main() {
  const summary = await backfillExternalTranscripts({
    publisherLimit: optionalLimit("publisher-limit"),
    discoveryLimit: optionalLimit("discovery-limit"),
  });
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => db.$disconnect());
