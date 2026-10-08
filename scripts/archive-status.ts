import "dotenv/config";
import { db } from "../src/lib/db";
import { getOperationalHealth } from "../src/lib/operational-health";

async function main() {
  const health = await getOperationalHealth();
  const transcriptFailures = await db.episode.count({
    where: { transcriptStatus: "FAILED" },
  });

  console.log(
    JSON.stringify(
      {
        ...health,
        archive: {
          ...health.archive,
          transcriptFailures,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
