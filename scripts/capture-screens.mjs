/**
 * Capture the whole site for a design handoff.
 *
 * Every page in both locales, at desktop and phone width, in light and dark,
 * plus close-ups of the components a redesign has to account for. Run against
 * a preview server so what is captured is the built output, not the dev server.
 *
 *   npm run build && npx astro preview
 *   node scripts/capture-screens.mjs [baseUrl] [outDir]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import puppeteer from "puppeteer-core";

const BASE = (process.argv[2] ?? "http://localhost:4321").replace(/\/$/, "");
const OUT =
  process.argv[3] ?? "C:/Users/alan9/OneDrive/Desktop/design-handoff/screens";

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

/** Pages worth a full-page capture, with the label used in filenames. */
const PAGES = [
  ["home-zh", "/"],
  ["home-en", "/en/"],
  ["projects-index-zh", "/projects/"],
  ["projects-index-en", "/en/projects/"],
  ["case-heartbox-zh", "/projects/heartbox/"],
  ["case-heartbox-en", "/en/projects/heartbox/"],
  ["project-lapsewatch-zh", "/projects/lapsewatch/"],
  ["project-pantrykeeper-zh", "/projects/pantrykeeper/"],
  ["posts-index-zh", "/posts/"],
  ["posts-index-en", "/en/posts/"],
  ["article-zh", "/posts/why-random-forest-beat-xgboost-and-an-lstm/"],
  ["article-en", "/en/posts/why-random-forest-beat-xgboost-and-an-lstm/"],
  ["resume-zh", "/resume/"],
  ["resume-en", "/en/resume/"],
  ["about-zh", "/about/"],
  ["about-en", "/en/about/"],
  ["notfound", "/404"],
];

/**
 * Component close-ups. Cropped to the element so a designer can see the
 * detail without hunting through a 6,000px page.
 */
const COMPONENTS = [
  ["header-zh", "/", "header > div"],
  ["header-en", "/en/", "header > div"],
  ["footer-zh", "/", "footer > div"],
  ["hero-zh", "/", "#hero"],
  ["hero-en", "/en/", "#hero"],
  ["project-card-zh", "/", "#projects li:first-child"],
  ["contact-zh", "/", "#contact"],
  // The projects index leads with a card and follows with rows; the two are
  // different components now, not one entry with a modifier class.
  ["project-card-featured-zh", "/projects/", "main article"],
  // Child selectors throughout: the stack chips are also <li>, so a loose
  // descendant match crops a 33px chip instead of the entry.
  ["project-row-zh", "/projects/", "main ol > li:first-child"],
  ["article-list-item-zh", "/posts/", "main ol > li:first-child"],
  ["demo-notice-zh", "/projects/heartbox/", ".demo-notice"],
  ["demo-notice-en", "/en/projects/heartbox/", ".demo-notice"],
  ["resume-labelled-entries-zh", "/resume/", ".resume ul:first-of-type"],
  ["resume-skills-table-zh", "/resume/", ".resume table"],
  ["markdown-table-zh", "/posts/why-random-forest-beat-xgboost-and-an-lstm/", ".table-scroll"],
];

/**
 * Case-study components carry no class of their own — they are styled through
 * Astro's scoped attributes — so they are located structurally, from inside the
 * article so the header's own <svg> icons cannot match.
 */
const CASE_PARTS = [
  ["case-decision-block-zh", "/projects/heartbox/", "article section.not-prose"],
  ["case-decision-block-en", "/en/projects/heartbox/", "article section.not-prose"],
  // The metric band moved out of the body and above it, so it is no longer
  // inside <article> — it is the section carrying the <dl> in the page header.
  ["case-metric-grid-zh", "/projects/heartbox/", "section:has(> dl)"],
  // Both components render a <figure>, and the comparison table comes first —
  // so they are told apart by what is inside, not by document order.
  ["case-architecture-zh", "/projects/heartbox/", "article figure:has(svg)"],
  ["case-architecture-en", "/en/projects/heartbox/", "article figure:has(svg)"],
  [
    "case-model-comparison-zh",
    "/projects/heartbox/",
    "article figure:has(table.model-comparison)",
  ],
  ["case-demo-table-zh", "/projects/heartbox/", "article .table-scroll"],
];

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

async function findChrome() {
  const { access } = await import("node:fs/promises");
  for (const path of CHROME_CANDIDATES) {
    try {
      await access(path);
      return path;
    } catch {
      /* next */
    }
  }
  throw new Error("Chrome not found");
}

const browser = await puppeteer.launch({
  executablePath: await findChrome(),
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const manifest = [];

async function shoot({ dir, name, path, scheme, width, height, selector }) {
  const page = await browser.newPage();
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: scheme },
  ]);
  await page.setViewport({ width, height, deviceScaleFactor: 2 });

  const response = await page.goto(BASE + path, { waitUntil: "networkidle0" });
  if (!response || response.status() >= 400) {
    console.log(`  SKIP ${name} — ${path} returned ${response?.status()}`);
    await page.close();
    return;
  }
  await page.evaluate(() => document.fonts.ready);

  await mkdir(join(OUT, dir), { recursive: true });
  const file = join(OUT, dir, `${name}.png`);

  let size;

  if (selector) {
    const el = await page.$(selector);
    if (!el) {
      console.log(`  SKIP ${name} — no element matches ${selector}`);
      await page.close();
      return;
    }
    const box = await el.boundingBox();
    // A zero-height match is a hidden element that happened to match — the
    // theme toggle's off-state icon did exactly this. Better to skip loudly.
    if (!box || box.width < 1 || box.height < 1) {
      console.log(`  SKIP ${name} — ${selector} matched a zero-size element`);
      await page.close();
      return;
    }
    await el.screenshot({ path: file });
    size = { w: Math.round(box.width), h: Math.round(box.height) };
  } else {
    await page.screenshot({ path: file, fullPage: true });
    size = await page.evaluate(() => ({
      w: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
    }));
  }

  manifest.push({
    file: `${dir}/${name}.png`,
    path,
    scheme,
    viewportWidth: width,
    size,
  });
  console.log(`  ${dir}/${name}.png  (${size.w}×${size.h})`);
  await page.close();
}

console.log("Full pages");
for (const [name, path] of PAGES) {
  for (const [vpName, width, height] of VIEWPORTS) {
    for (const scheme of vpName === "desktop" ? ["light", "dark"] : ["light"]) {
      await shoot({
        dir: `${vpName}-${scheme}`,
        name,
        path,
        scheme,
        width,
        height,
      });
    }
  }
}

console.log("\nComponents");
for (const [name, path, selector] of [...COMPONENTS, ...CASE_PARTS]) {
  for (const scheme of ["light", "dark"]) {
    await shoot({
      dir: `components-${scheme}`,
      name,
      path,
      scheme,
      width: 1440,
      height: 900,
      selector,
    });
  }
}

await browser.close();

await writeFile(
  join(OUT, "manifest.json"),
  JSON.stringify({ base: BASE, captured: manifest }, null, 2),
  "utf8"
);

console.log(`\n${manifest.length} images written to ${OUT}`);
