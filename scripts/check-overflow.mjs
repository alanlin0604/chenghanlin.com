/**
 * Fail if any built page scrolls sideways at phone width.
 *
 * Horizontal overflow is easy to ship and easy to miss: it does not show up in
 * a desktop browser, and a screenshot of a too-narrow viewport looks plausible
 * either way. Measuring `scrollWidth` against `clientWidth` is unambiguous.
 *
 * 320px is the floor because that is an iPhone SE in portrait — below the 375px
 * most designs are checked at, and the width where the English header (four
 * words rather than four two-character labels) first ran out of room.
 *
 *   npm run build && npx astro preview
 *   npm run check:overflow http://localhost:4321
 */
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const BASE = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");
const WIDTH = Number(process.argv[3] ?? 320);

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

async function findChrome() {
  const { access } = await import("node:fs/promises");
  for (const path of CHROME_CANDIDATES) {
    try {
      await access(path);
      return path;
    } catch {
      /* try the next one */
    }
  }
  throw new Error("Chrome not found. Set one of: " + CHROME_CANDIDATES.join(", "));
}

async function pages(dir = DIST, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await pages(full, out);
    else if (entry.name === "index.html") {
      const rel = relative(DIST, full).replace(/\\/g, "/").replace(/index\.html$/, "");
      out.push("/" + rel);
    }
  }
  return out;
}

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: 800 });

let failures = 0;

for (const path of (await pages()).sort()) {
  await page.goto(BASE + path, { waitUntil: "networkidle0" });

  const result = await page.evaluate(() => {
    const root = document.documentElement;
    const offenders = [];

    if (root.scrollWidth > root.clientWidth) {
      for (const el of document.querySelectorAll("body *")) {
        const box = el.getBoundingClientRect();
        if (box.right > root.clientWidth + 1 && box.width > 0) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.getAttribute("class") ?? "").slice(0, 60),
            right: Math.round(box.right),
          });
        }
      }
    }

    return {
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      // Only the outermost few are useful; the rest are their descendants.
      offenders: offenders.slice(0, 3),
    };
  });

  const overflowing = result.scrollWidth > result.clientWidth;
  if (overflowing) failures++;

  console.log(
    `  ${overflowing ? "FAIL" : "ok  "} ${path.padEnd(52)} ` +
      `${result.scrollWidth}/${result.clientWidth}`
  );

  for (const o of result.offenders) {
    console.log(`         <${o.tag}> right=${o.right} ${o.cls}`);
  }
}

await browser.close();

if (failures > 0) {
  console.log(`\nFAIL — ${failures} page(s) scroll sideways at ${WIDTH}px.`);
  process.exit(1);
}

console.log(`\nPASS — no page scrolls sideways at ${WIDTH}px.`);
