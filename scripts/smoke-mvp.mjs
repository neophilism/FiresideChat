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

for (const path of ["/api/health", "/api/health/ready"]) {
  const healthResponse = await fetch(`${baseUrl}${path}`);
  const health = await healthResponse.json();

  if (
    !healthResponse.ok ||
    health?.ok !== true ||
    health?.database !== "reachable"
  ) {
    failed = true;
    console.error(`FAIL ${path}`, health);
  } else {
    console.log(`PASS ${path}`, health);
  }
}

const liveResponse = await fetch(`${baseUrl}/api/health/live`);
const live = await liveResponse.json();
if (!liveResponse.ok || live?.ok !== true || live?.process !== "alive") {
  failed = true;
  console.error("FAIL /api/health/live", live);
} else {
  console.log("PASS /api/health/live", live);
}

const homepageResponse = await fetch(`${baseUrl}/`);
if (
  homepageResponse.headers.get("x-content-type-options") !== "nosniff" ||
  homepageResponse.headers.get("x-frame-options") !== "DENY"
) {
  failed = true;
  console.error("FAIL security headers");
} else {
  console.log("PASS security headers");
}

if (failed) process.exitCode = 1;
