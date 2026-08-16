/**
 * Build-time map of which logical pages exist in which locale.
 *
 * The language switcher has to answer one question on every page: "does the
 * other language have this same page?" Getting it wrong means either a 404 or
 * a switcher that always dumps the reader on the home page. Rather than
 * maintaining that list by hand, it is derived from the page files themselves,
 * so adding src/pages/en/resume.astro is enough to make the switcher work.
 *
 * A "logical path" is the route with the locale prefix removed:
 *   src/pages/about.astro      → zh-Hant  /about
 *   src/pages/en/about.astro   → en       /about
 */
import { DEFAULT_LOCALE, type Locale } from "@/i18n/locales";

const pageModules = import.meta.glob("/src/pages/**/*.{astro,md,mdx}");

const PAGES_PREFIX = "/src/pages/";

function toLogicalRoute(
  filePath: string
): { locale: Locale; path: string } | null {
  const rel = filePath.slice(PAGES_PREFIX.length).replace(/\.(astro|md|mdx)$/, "");
  const segments = rel.split("/");

  // Astro does not route files or directories prefixed with "_", so component
  // and helper files that live beside a route are not routes themselves.
  if (segments.some(segment => segment.startsWith("_"))) return null;
  // Dynamic routes cannot be resolved from the filename alone. Pages using them
  // pass an explicit counterpart to <Layout> instead.
  if (rel.includes("[")) return null;

  const isEnglish = segments[0] === "en";
  const locale: Locale = isEnglish ? "en" : DEFAULT_LOCALE;
  const rest = isEnglish ? segments.slice(1) : segments;

  let path = `/${rest.join("/")}`;
  if (path === "/index") path = "/";
  else path = path.replace(/\/index$/, "");

  return { locale, path };
}

const routesByLocale: Record<Locale, Set<string>> = {
  "zh-Hant": new Set(),
  en: new Set(),
};

for (const filePath of Object.keys(pageModules)) {
  const route = toLogicalRoute(filePath);
  if (route) routesByLocale[route.locale].add(route.path);
}

/** Does `locale` have a page at this logical path? */
export function hasLocalisedRoute(locale: Locale, path: string): boolean {
  const normalised =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return routesByLocale[locale].has(normalised);
}
