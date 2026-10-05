const baseUrl = process.env.MVP_BASE_URL ?? "http://127.0.0.1:3000";

const checks = [
  { path: "/", contains: "Hear them yourself." },
  { path: "/people", contains: "The voices in the archive." },
  { path: "/people/ted-cruz", contains: "Ted Cruz" },
  { path: "/podcasts/verdict-with-ted-cruz", contains: "Verdict with Ted Cruz" },
  { path: "/search?q=Cruz", contains: "Ted Cruz" },
];

let failed = false;

for (const check of checks) {
  const response = await fetch(`${baseUrl}${check.path}`, {
    redirect: "error",
  });
  const body = await response.text();

  if (!response.ok || !body.includes(check.contains)) {
    failed = true;
    console.error(
      `FAIL ${check.path}: status=${response.status}, expected text=${JSON.stringify(check.contains)}`,
    );
  } else {
    console.log(`PASS ${check.path} (${response.status})`);
  }
}

const healthResponse = await fetch(`${baseUrl}/api/health`);
const health = await healthResponse.json();

if (
  !healthResponse.ok ||
  health?.ok !== true ||
  health?.database !== "reachable"
) {
  failed = true;
  console.error("FAIL /api/health", health);
} else {
  console.log("PASS /api/health", health);
}

if (failed) process.exitCode = 1;
