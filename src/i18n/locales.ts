/**
 * Single source of truth for the locale list. Keep this in sync with the
 * `i18n` block in astro.config.ts.
 */
export const LOCALES = ["zh-Hant", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-Hant";

/** The locale a reader would switch to from the given one. */
export const OTHER_LOCALE: Record<Locale, Locale> = {
  "zh-Hant": "en",
  en: "zh-Hant",
};

/** Value for the `hreflang` attribute. */
export const HREFLANG: Record<Locale, string> = {
  "zh-Hant": "zh-Hant",
  en: "en",
};

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Directory name each locale's content lives under, e.g.
 * src/content/projects/zh-hant/heartbox.md.
 *
 * Astro's glob loader slugifies entry ids, which lower-cases them, so
 * "zh-Hant/about" is never a valid lookup key. Keeping the directories
 * lower-case means the id is exactly `${CONTENT_DIR[locale]}/${name}`.
 */
export const CONTENT_DIR: Record<Locale, string> = {
  "zh-Hant": "zh-hant",
  en: "en",
};

/** The anchor used by the "no counterpart page" notice on each home page. */
export const FALLBACK_HASH = "lang-fallback";
