/**
 * Guard against hard-wrapped Chinese in source.
 *
 * Both Markdown and JSX join a soft line break with a space. In Latin text that
 * is the intent; between Han characters it renders as a visible gap in the
 * middle of a word. It is invisible in the editor and obvious on the page, which
 * is exactly the kind of bug that survives review — so it gets a check.
 *
 * The character class deliberately includes CJK punctuation. An earlier version
 * matched only U+4E00–U+9FFF and reported a clean tree, because the lines that
 * were actually broken ended on a full-width comma.
 *
 *   npm run check:cjk
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "src");
const EXTENSIONS = new Set([".astro", ".ts", ".tsx", ".md", ".mdx"]);

/** Han, CJK punctuation, and full-width forms. */
const CJK = "\\u3000-\\u303f\\u4e00-\\u9fff\\uff01-\\uff65";
const WRAPPED = new RegExp(`[${CJK}][ \\t]*\\r?\\n[ \\t]*[${CJK}]`, "g");

async function files(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await files(full, out);
    else if (EXTENSIONS.has(extname(entry.name))) out.push(full);
  }
  return out;
}

let total = 0;

for (const file of await files(SRC)) {
  const text = await readFile(file, "utf8");
  const matches = [...text.matchAll(WRAPPED)];
  if (matches.length === 0) continue;

  total += matches.length;
  console.log(`\n  ${relative(ROOT, file)}`);
  for (const match of matches) {
    const line = text.slice(0, match.index).split("\n").length;
    const shown = match[0].replace(/\r?\n\s*/, " ⏎ ");
    console.log(`    line ${line}: …${shown}…`);
  }
}

if (total > 0) {
  console.log(
    `\nFAIL — ${total} hard-wrapped Chinese line break(s). ` +
      `Join the lines: a soft break renders as a space between Han characters.`
  );
  process.exit(1);
}

console.log("PASS — no hard-wrapped Chinese in src.");
