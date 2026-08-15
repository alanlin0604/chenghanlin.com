import type { Locale } from "@/i18n/locales";

/**
 * Long-form date, in the reader's language.
 *
 * `Intl` renders zh-Hant-TW as "2026年8月15日", with no space around the digits.
 * That is a valid rendering, but it contradicts the convention used everywhere
 * else on this site — and in most Chinese technical publishing — of separating
 * Latin characters and digits from Han with a space ("2026 年 9 月起就讀").
 * Two spellings of the same date on one page reads as an oversight, so the
 * separators are inserted rather than left to the default.
 */
export function formatDate(date: Date, locale: Locale): string {
  const formatted = new Intl.DateTimeFormat(
    locale === "en" ? "en-GB" : "zh-Hant-TW",
    { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Taipei" }
  ).format(date);

  if (locale === "en") return formatted;

  return formatted.replace(/(\d)([年月日])/g, "$1 $2 ").trim();
}
