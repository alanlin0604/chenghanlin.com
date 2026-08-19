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

/** One PDF per locale. The two résumés are separate documents, not one
 *  translated — see the note in ResumePage.astro. */
const TARGETS = [
  { path: "/resume/", out: "chenghanlin-resume-zh.pdf" },
  { path: "/en/resume/", out: "chenghanlin-resume-en.pdf" },
];

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

await mkdir(join(ROOT, "public"), { recursive: true });
const { statSync } = await import("node:fs");

for (const { path, out } of TARGETS) {
  const response = await page.goto(`${BASE}${path}`, {
    waitUntil: "networkidle0",
  });

  if (!response?.ok()) {
    await browser.close();
    throw new Error(
      `${BASE}${path} returned ${response?.status()}. Is the preview server running?`
    );
  }

  // Fonts must be resolved before printing or the PDF embeds fallback glyphs.
  await page.evaluateHandle("document.fonts.ready");

  const target = join(ROOT, "public", out);
  await page.pdf({
    path: target,
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
  });

  console.log(
    `wrote public/${out} (${(statSync(target).size / 1024).toFixed(1)} KB)`
  );
}

await browser.close();
