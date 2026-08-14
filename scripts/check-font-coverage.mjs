/**
 * Guard for the bold font subset.
 *
 * `build-fonts.mjs --bold-from-dist` ships a bold face containing only the
 * characters it believes render at weight 600 or more. It works that out by
 * matching tags and utility classes in the built HTML. If a new component
 * expresses boldness some other way — an inline style, a class the selector
 * does not list — the characters inside it would quietly fall back to the
 * system CJK face inside a heading. Nothing errors; the page just looks wrong
 * in a way that is easy to miss.
 *
 * This checks the real thing: it loads each built page in a browser, finds
 * every character whose *computed* font-weight is 600 or more, and asks the
 * CSS Font Loading API whether the loaded bold face can actually render it.
 *
 * Needs Chrome and a server for dist/. Not part of `npm run build` — the
 * deploy machine has neither. Run it after changing components or adding a
 * page:
 *
 *   npm run build
 *   npx astro preview &
 *   node scripts/check-font-coverage.mjs http://localhost:4321
 */
import { readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

async function findChrome() {
  const { access } = await import("node:fs/promises");
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      /* try the next one */
    }
  }
  throw new Error(
    `Chrome not found. Set CHROME_PATH, or install Chrome.\nTried:\n  ${CHROME_CANDIDATES.join("\n  ")}`
  );
}

/** Every built page, as a site-relative URL. */
async function builtPages(dir = join(ROOT, "dist"), pages = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await builtPages(full, pages);
    else if (entry.name.endsWith(".html")) {
      const rel = relative(join(ROOT, "dist"), full).replace(/\\/g, "/");
      pages.push("/" + rel.replace(/index\.html$/, ""));
    }
  }
  return pages;
}

const pages = await builtPages();
if (pages.length === 0) {
  console.error("No built pages under dist/. Run `npm run build` first.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});
const page = await browser.newPage();

const missing = new Set();
let checked = 0;

for (const path of pages) {
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  const { bold, notCovered } = await page.evaluate(async () => {
    await document.fonts.ready;

    const boldChars = new Set();
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    );
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      if (Number(getComputedStyle(parent).fontWeight) < 600) continue;
      for (const ch of node.textContent) if (ch.trim()) boldChars.add(ch);
    }

    const notCovered = [];
    for (const ch of boldChars) {
      if (!document.fonts.check('700 16px "Noto Sans TC"', ch)) {
        notCovered.push(ch);
      }
    }
    return { bold: boldChars.size, notCovered };
  });

  checked++;
  for (const ch of notCovered) missing.add(ch);
  const flag = notCovered.length === 0 ? "ok  " : "FAIL";
  console.log(`  ${flag} ${path.padEnd(28)} bold=${bold}`);
}

await browser.close();

console.log("");
if (missing.size === 0) {
  console.log(
    `PASS — every bold character across ${checked} pages is in the subset.`
  );
  process.exit(0);
}

console.error(
  `FAIL — ${missing.size} bold character(s) missing from the bold subset:\n` +
    `  ${[...missing].join(" ")}\n\n` +
    `The bold-context selector in scripts/build-fonts.mjs did not catch where\n` +
    `these are used. Add that pattern to BOLD_SELECTOR and rebuild.`
);
process.exit(1);
