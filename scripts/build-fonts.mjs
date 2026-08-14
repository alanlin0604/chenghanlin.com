/**
 * Subset Noto Sans TC down to the characters this site actually uses.
 *
 * Why this exists
 * ---------------
 * Pre-sliced CJK webfonts (Fontsource, Google Fonts' unicode-range CSS) split
 * the font into ~105 files so a page downloads only the slices it needs. That
 * works well for character-heavy sites. It works badly here: the Chinese pages
 * are short, but their characters are scattered across slices 107–119, so the
 * browser fetched 14 files totalling 936 KB and first contentful paint landed
 * at 4.7 s.
 *
 * Two passes
 * ----------
 * The regular weight is subset to every character on the site. The bold weight
 * is subset to only the characters that actually render at weight 600 or more,
 * which measured at roughly a third of the total — headings and <strong> are a
 * small slice of the prose. Serving glyphs in a weight that never paints them
 * is pure waste.
 *
 * The bold set is derived from the *built* HTML rather than from source,
 * because that is what the browser paints. Hence the two passes:
 *
 *   1. `node scripts/build-fonts.mjs`            → both weights, full set
 *   2. `astro build`                             → produces dist/
 *   3. `node scripts/build-fonts.mjs --bold-from-dist` → re-subsets bold only
 *   4. `astro build`                             → picks up the smaller file
 *
 * Pass 1 keeps `npm run dev` correct on its own. If pass 3 cannot find enough
 * characters it refuses to write anything, so a broken parse degrades to the
 * full subset instead of silently shipping headings with missing glyphs.
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";
import { parse } from "node-html-parser";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BOLD_FROM_DIST = process.argv.includes("--bold-from-dist");

/** Directories scanned for text that will be rendered. */
const SCAN_DIRS = [
  "src/content",
  "src/pages",
  "src/components",
  "src/layouts",
  "src/i18n",
];

/** Files at the project root that carry rendered copy. */
const SCAN_FILES = ["astro-paper.config.ts"];

const SCAN_EXTENSIONS = new Set([".md", ".mdx", ".astro", ".ts", ".tsx"]);

/** Not routed, not rendered — Phase 5 blog surfaces. */
const IGNORED = ["src/parked"];

/**
 * Always included regardless of current copy, so small edits do not silently
 * drop a glyph: ASCII, the CJK punctuation used in Chinese typesetting, and
 * full-width forms. Both weights get these — they are cheap.
 */
const BASELINE = [
  // Printable ASCII
  ...Array.from({ length: 95 }, (_, i) => String.fromCodePoint(32 + i)),
  // CJK and general punctuation
  "、。〈〉《》「」『』【】〔〕・…‥—–‐‘’“”′″〜～",
  "！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝",
  "©®°±×÷§¶†‡•→←↑↓⋯",
].join("");

async function* walk(dir, ignored = IGNORED) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full).replace(/\\/g, "/");
    if (ignored.some(skip => rel.startsWith(skip))) continue;
    if (entry.isDirectory()) yield* walk(full, ignored);
    else yield full;
  }
}

/** Every character appearing anywhere in the rendered sources. */
async function collectAllCharacters() {
  const chars = new Set(BASELINE);

  const files = [];
  for (const dir of SCAN_DIRS) {
    for await (const file of walk(join(ROOT, dir))) {
      if (SCAN_EXTENSIONS.has(extname(file))) files.push(file);
    }
  }
  for (const file of SCAN_FILES) files.push(join(ROOT, file));

  for (const file of files) {
    try {
      for (const ch of await readFile(file, "utf8")) chars.add(ch);
    } catch {
      /* unreadable file contributes nothing */
    }
  }

  return { text: [...chars].join(""), fileCount: files.length };
}

/**
 * Elements whose text renders at weight >= 600, either by tag or by utility
 * class. font-weight inherits, so a match contributes all of its descendants'
 * text too.
 */
const BOLD_SELECTOR =
  "h1, h2, h3, h4, h5, h6, strong, b, th, dt, " +
  ".font-bold, .font-semibold, .font-extrabold, .font-black";

/**
 * Characters that actually paint in a bold weight, read out of the built HTML.
 * Returns null when the result looks implausible, so the caller can leave the
 * existing full subset in place rather than ship broken headings.
 */
async function collectBoldCharacters() {
  const chars = new Set(BASELINE);
  let pageCount = 0;

  for await (const file of walk(join(ROOT, "dist"), [])) {
    if (extname(file) !== ".html") continue;
    pageCount++;
    const root = parse(await readFile(file, "utf8"));
    for (const element of root.querySelectorAll(BOLD_SELECTOR)) {
      for (const ch of element.text) chars.add(ch);
    }
  }

  const cjk = [...chars].filter(isCjk).length;

  if (pageCount === 0) {
    console.warn("  ! no built pages found — keeping the full bold subset");
    return null;
  }
  // Any real build has headings on every page. A near-empty result means the
  // selector or the markup changed, not that the site stopped using bold.
  if (cjk < 50) {
    console.warn(
      `  ! only ${cjk} bold CJK characters found across ${pageCount} pages;` +
        " that looks wrong — keeping the full bold subset"
    );
    return null;
  }

  return { text: [...chars].join(""), pageCount, cjk };
}

function isCjk(ch) {
  const cp = ch.codePointAt(0);
  return cp >= 0x3400 && cp <= 0x9fff;
}

const WEIGHTS = {
  400: {
    source:
      "@expo-google-fonts/noto-sans-tc/400Regular/NotoSansTC_400Regular.ttf",
    out: "noto-sans-tc-400.subset.woff2",
  },
  700: {
    source: "@expo-google-fonts/noto-sans-tc/700Bold/NotoSansTC_700Bold.ttf",
    out: "noto-sans-tc-700.subset.woff2",
  },
};

const OUT_DIR = join(ROOT, "src/assets/fonts");
const CSS_PATH = join(ROOT, "src/styles/fonts.generated.css");

async function subsetWeight(weight, text) {
  const { source, out } = WEIGHTS[weight];
  const original = await readFile(join(ROOT, "node_modules", source));
  const subset = await subsetFont(original, text, { targetFormat: "woff2" });
  await writeFile(join(OUT_DIR, out), subset);
  console.log(
    `  ${weight}: ${[...text].length} chars -> ${(subset.length / 1024).toFixed(1)} KB`
  );
  return subset.length;
}

function faceCss(weight) {
  return `@font-face {
  font-family: "Noto Sans TC";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("../assets/fonts/${WEIGHTS[weight].out}") format("woff2");
}`;
}

async function writeCss(note) {
  const header = `/* GENERATED by scripts/build-fonts.mjs — do not edit by hand.
 *
 * ${note}
 *
 * Noto Sans TC is licensed under the SIL Open Font License 1.1.
 */
`;
  await writeFile(
    CSS_PATH,
    `${header}\n${[faceCss(400), faceCss(700)].join("\n\n")}\n`
  );
}

await mkdir(OUT_DIR, { recursive: true });

if (BOLD_FROM_DIST) {
  const bold = await collectBoldCharacters();
  if (bold) {
    const bytes = await subsetWeight(700, bold.text);
    await writeCss(
      `Regular weight covers every character on the site; bold covers the ` +
        `${bold.cjk} CJK characters that actually render at weight 600+, found ` +
        `across ${bold.pageCount} built pages.`
    );
    console.log(
      `  bold subset: ${bold.cjk} CJK chars from ${bold.pageCount} pages` +
        ` (${(bytes / 1024).toFixed(1)} KB)`
    );
  }
} else {
  const { text, fileCount } = await collectAllCharacters();
  const cjk = [...text].filter(isCjk).length;
  await subsetWeight(400, text);
  await subsetWeight(700, text);
  await writeCss(
    `Subset to the ${cjk} CJK characters (plus Latin and punctuation) found ` +
      `across ${fileCount} source files. Regenerated on every build.`
  );
  console.log(`  full set: ${[...text].length} chars, ${cjk} CJK`);
}
