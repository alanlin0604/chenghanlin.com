/**
 * Locale-swapping for the current URL.
 *
 * Both the language switcher and the `hreflang` tags need the same answer:
 * given the page being rendered, what is the URL of the same page in the other
 * language, and does it exist? Deriving both from one place keeps the switcher
 * and the SEO markup from drifting apart.
 *
 * The current pathname's shape (trailing slash or not) is preserved so the
 * alternates always match the canonical URL Astro emits.
 */
import {
  DEFAULT_LOCALE,
  LOCALES,
  OTHER_LOCALE,
  FALLBACK_HASH,
  type Locale,
} from "@/i18n/locales";
import { hasLocalisedRoute } from "@/utils/localeRoutes";
import { stripBase, stripLocale, getAssetPath } from "@/utils/withBase";

/** Strip base and locale prefix, leaving a path comparable across locales. */
export function getLogicalPath(pathname: string, locale: Locale): string {
  return stripLocale(stripBase(pathname), locale);
}

/** Build the pathname for `logicalPath` under `target`, keeping URL shape. */
function localisedPath(logicalPath: string, target: Locale): string {
  if (target === DEFAULT_LOCALE) return getAssetPath(logicalPath);
  const suffix = logicalPath === "/" ? "/" : logicalPath;
  return getAssetPath(`en${suffix}`);
}

export interface Alternate {
  locale: Locale;
  /** Root-relative URL of this page in `locale`, when it exists. */
  href: string;
  exists: boolean;
}

/**
 * Every locale's version of the current page.
 *
 * `override` lets dynamic routes (which cannot be discovered from filenames)
 * declare their counterparts explicitly, e.g. { en: "/en/projects/heartbox" }.
 */
export function getAlternates(
  pathname: string,
  locale: Locale,
  override?: Partial<Record<Locale, string | null>>
): Alternate[] {
  const logicalPath = getLogicalPath(pathname, locale);

  return LOCALES.map(target => {
    const declared = override?.[target];
    if (declared !== undefined) {
      return {
        locale: target,
        href: declared ?? localisedPath("/", target),
        exists: declared !== null,
      };
    }
    return {
      locale: target,
      href: localisedPath(logicalPath, target),
      exists: hasLocalisedRoute(target, logicalPath),
    };
  });
}

/**
 * Where the language switcher should point.
 *
 * When the other language has this page, it links straight to it. When it does
 * not, it links to that language's home page with the fallback anchor, which
 * reveals a notice there. Deliberately not a 404, and deliberately not
 * JavaScript — the notice is shown by a `:target` CSS rule.
 */
export function getSwitchTarget(
  pathname: string,
  locale: Locale,
  override?: Partial<Record<Locale, string | null>>
): { href: string; isFallback: boolean; target: Locale } {
  const target = OTHER_LOCALE[locale];
  const alternate = getAlternates(pathname, locale, override).find(
    entry => entry.locale === target
  );

  if (alternate?.exists) {
    return { href: alternate.href, isFallback: false, target };
  }

  return {
    href: `${localisedPath("/", target)}#${FALLBACK_HASH}`,
    isFallback: true,
    target,
  };
}
