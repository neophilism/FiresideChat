import "dotenv/config";
import { db } from "../src/lib/db";
import { transcribeMissingEpisodes } from "../src/lib/transcription/generated-transcription";

async function main() {
  const limitArg = process.argv.find((argument) => argument.startsWith("--limit="));
  const limit = limitArg
    ? Number.parseInt(limitArg.slice("--limit=".length), 10)
    : undefined;

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error("--limit must be a positive integer");
  }

  const result = await transcribeMissingEpisodes({ limit });
  console.log(JSON.stringify(result, null, 2));

  if (!result.enabled) {
    console.log(
      "Generated transcription is disabled. Set TRANSCRIPTION_ENABLED=true and OPENAI_API_KEY to enable it.",
    );
  }

  if (result.failed > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
