/**
 * Score the deployed site with Lighthouse and print one summary table.
 *
 *   npm run check:lighthouse                    # the live site
 *   npm run check:lighthouse -- http://localhost:4321   # a preview build
 *
 * Four pages × mobile and desktop, five to ten minutes. Reports land in
 * `lighthouse/` (git-ignored) so any single run can be opened afterwards.
 *
 * Two things here work around Windows rather than around Lighthouse:
 *
 * Chrome gets an explicit `--user-data-dir` inside the output folder. Left to
 * itself chrome-launcher makes one under %TEMP% and deletes it on exit, and
 * that delete fails with EPERM whenever a virus scanner or a sync client still
 * holds a handle — after the audit has already finished and produced good
 * results. Success is therefore judged by whether the report parses, not by the
 * exit code.
 *
 * The command is also built as one string rather than a command plus an args
 * array: on Windows `npx` is a .cmd, which since Node 20 cannot be spawned
 * without a shell, while passing an args array *with* a shell is what triggers
 * the DEP0190 warning.
 */
import { mkdir, readFile, rm, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const BASE = (process.argv[2] ?? "https://chenghanlin.com").replace(/\/$/, "");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "lighthouse");
await mkdir(OUT, { recursive: true });

const PROFILE = join(OUT, "chrome-profile");

/* The four worth watching: the two entry points, the heaviest page, and the one
   a reader is most likely to open from an application. */
const URLS = [
  ["home-zh", `${BASE}/`],
  ["home-en", `${BASE}/en/`],
  ["case", `${BASE}/projects/heartbox/`],
  ["resume", `${BASE}/resume/`],
];
const FORMS = ["mobile", "desktop"];

/* Built as one command string rather than a command plus an args array. On
   Windows `npx` is a .cmd, and since Node 20 spawning one without a shell
   throws EINVAL — while passing an args array *with* a shell is what triggers
   the DEP0190 warning. A single string through the shell avoids both. */
const runLighthouse = args =>
  new Promise(resolve => {
    const p = spawn(`npx --yes lighthouse ${args.join(" ")}`, {
      shell: true,
      stdio: ["ignore", "ignore", "inherit"],
    });
    // Resolve either way: the exit code cannot be trusted on Windows, where a
    // failure to delete Chrome's temp profile exits non-zero after a good run.
    p.on("close", code => resolve(code));
    p.on("error", () => resolve(-1));
  });

const exists = async p => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const results = [];
const skipped = [];

for (const [name, url] of URLS) {
  // Warm the edge cache so the measured run is not the cold one.
  await fetch(url).catch(() => {});

  for (const form of FORMS) {
    const base = join(OUT, `${name}-${form}`);
    const json = `${base}.report.json`;
    process.stdout.write(`\n▶ ${name} (${form}) …\n`);

    await rm(PROFILE, { recursive: true, force: true }).catch(() => {});

    await runLighthouse([
      url,
      "--quiet",
      "--output=json",
      "--output=html",
      `"--output-path=${base}"`,
      ...(form === "desktop" ? ["--preset=desktop"] : []),
      `"--chrome-flags=--headless=new --no-sandbox --disable-gpu --user-data-dir=${PROFILE.split("\\").join("/")}"`,
    ]);

    if (!(await exists(json))) {
      console.log(`   跳過：沒有產生報告`);
      skipped.push(`${name} (${form})`);
      continue;
    }

    const data = JSON.parse(await readFile(json, "utf8"));
    const score = k => Math.round((data.categories[k]?.score ?? 0) * 100);

    /* Everything that did not pass in the three categories meant to sit at 100.
       Informative and not-applicable audits are excluded: they are not failures
       and would bury the real ones. */
    const failures = [];
    for (const cat of ["accessibility", "best-practices", "seo"]) {
      for (const ref of data.categories[cat]?.auditRefs ?? []) {
        const a = data.audits[ref.id];
        if (!a || a.score === null || a.score >= 1) continue;
        if (a.scoreDisplayMode === "informative") continue;
        failures.push(`${cat}/${a.id}: ${a.title}`);
      }
    }

    results.push({
      page: `${name} (${form})`,
      perf: score("performance"),
      a11y: score("accessibility"),
      bp: score("best-practices"),
      seo: score("seo"),
      failures,
    });
    console.log(
      `   效能 ${score("performance")} · 無障礙 ${score("accessibility")} · 最佳做法 ${score("best-practices")} · SEO ${score("seo")}`
    );
  }
}

await rm(PROFILE, { recursive: true, force: true }).catch(() => {});

console.log("\n" + "=".repeat(66));
console.log("頁面                     效能  無障礙  最佳做法   SEO");
console.log("=".repeat(66));
for (const r of results) {
  console.log(
    `${r.page.padEnd(23)}${String(r.perf).padStart(4)}${String(r.a11y).padStart(7)}${String(r.bp).padStart(9)}${String(r.seo).padStart(7)}`
  );
}
if (skipped.length) console.log(`\n沒跑成功：${skipped.join(", ")}`);

const allFailures = [...new Set(results.flatMap(r => r.failures))];
console.log("\n" + "=".repeat(66));
if (results.length === 0) {
  console.log("一次都沒跑成功——把上面的錯誤訊息貼回來。");
} else if (allFailures.length === 0) {
  console.log("無障礙／最佳做法／SEO：沒有任何未通過的項目");
} else {
  console.log("未通過的項目（把這幾行貼回來就好）：");
  allFailures.forEach(f => console.log("  " + f));
}
console.log(`\n完整報告：${OUT}`);
