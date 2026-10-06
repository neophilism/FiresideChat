import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const localDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/fireside_chat?schema=public";

const connectionString = process.env.DATABASE_URL ?? localDatabaseUrl;
const attempts = Number.parseInt(process.env.DB_WAIT_ATTEMPTS ?? "30", 10);
const delayMs = Number.parseInt(process.env.DB_WAIT_DELAY_MS ?? "1000", 10);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function canConnect() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query("SELECT 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

for (let attempt = 1; attempt <= attempts; attempt += 1) {
  if (await canConnect()) {
    console.log(`PostgreSQL is ready (attempt ${attempt}/${attempts}).`);
    process.exit(0);
  }

  console.log(`Waiting for PostgreSQL (${attempt}/${attempts})...`);
  await sleep(delayMs);
}

console.error(
  `PostgreSQL did not become ready after ${attempts} attempts.`,
);
process.exit(1);
