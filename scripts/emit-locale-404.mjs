/**
 * Copy each locale's 404 route to the filename Cloudflare looks for.
 *
 * `not_found_handling: "404-page"` serves the closest `404.html` at or above
 * the requested path. Astro only special-cases the *root* `404.astro` into
 * `dist/404.html`; a nested one becomes `dist/en/404/index.html`, which that
 * lookup never finds — so an English reader who mistypes a URL would fall all
 * the way back to the Chinese 404.
 *
 * Runs after the last `astro build` in the `build` script. Copies rather than
 * moves, so `/en/404/` stays reachable as an ordinary page too.
 */
import { copyFile, readdir, access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist", import.meta.url));

const exists = async p => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

let copied = 0;
for (const entry of await readdir(DIST, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const source = join(DIST, entry.name, "404", "index.html");
  if (!(await exists(source))) continue;
  const target = join(DIST, entry.name, "404.html");
  await copyFile(source, target);
  console.log(`wrote dist/${entry.name}/404.html`);
  copied += 1;
}

if (copied === 0) {
  console.log("no per-locale 404 routes found — nothing to copy");
}
