/**
 * Render /resume to a PDF.
 *
 * The web page is the resume; the PDF is a rendering of it. Keeping one source
 * means the two can never disagree — which they already had once, when the
 * committed PDF still claimed 105 achievements after the number was corrected
 * to 103 everywhere else.
 *
 * Needs Chrome, so it does not run on the deploy machine. Run it locally after
 * changing the resume and commit the result:
 *
 *   npm run build
 *   npx astro preview
 *   npm run resume:pdf http://localhost:4321
 *
 * The output lands in public/, so the next build serves it.
 */
import { access, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");
const OUT = join(ROOT, "public", "chenghanlin-resume-zh.pdf");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

async function findChrome() {
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

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
// Render in light mode explicitly. The print stylesheet forces light colours
// anyway, but emulating the media the user would print from keeps the two in
// agreement rather than relying on one overriding the other.
await page.emulateMediaFeatures([
  { name: "prefers-color-scheme", value: "light" },
]);

const response = await page.goto(`${BASE}/resume/`, {
  waitUntil: "networkidle0",
});

if (!response?.ok()) {
  await browser.close();
  throw new Error(
    `${BASE}/resume/ returned ${response?.status()}. Is the preview server running?`
  );
}

// Fonts must be resolved before printing or the PDF embeds fallback glyphs.
await page.evaluateHandle("document.fonts.ready");

await mkdir(join(ROOT, "public"), { recursive: true });
await page.pdf({
  path: OUT,
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
});

await browser.close();

const { statSync } = await import("node:fs");
console.log(
  `wrote public/chenghanlin-resume-zh.pdf (${(statSync(OUT).size / 1024).toFixed(1)} KB)`
);
