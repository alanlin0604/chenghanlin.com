import { getCollection, type CollectionEntry } from "astro:content";
import { CONTENT_DIR, LOCALES, type Locale } from "@/i18n/locales";

export type Article = CollectionEntry<"posts">;

/**
 * Articles live under `src/content/posts/<locale>/<slug>.md`, and the two
 * language versions of a piece share a slug. That pairing is the whole
 * mechanism: it is what lets the language switcher land on the same article
 * instead of dropping the reader at the index, and what lets each locale's
 * listing show only text that reader can actually read.
 *
 * The slug is the same in both languages on purpose. A translated slug would
 * read marginally better in Chinese, but it would also mean the two versions no
 * longer look like the same document to anyone reading the URLs — and it is one
 * more thing to keep in sync for no reader-facing gain.
 */

/** The locale an article is written in, taken from the directory it sits in. */
export function articleLocale(article: Article): Locale {
  const dir = article.id.replace(/\/.*$/, "");
  const match = LOCALES.find(locale => CONTENT_DIR[locale] === dir);
  if (!match) {
    throw new Error(
      `Article "${article.id}" is not inside a locale directory. ` +
        `Expected one of: ${LOCALES.map(l => CONTENT_DIR[l]).join(", ")}.`
    );
  }
  return match;
}

/** The slug an article is published under, shared by its translations. */
export function articleSlug(article: Article): string {
  return article.id.replace(/^.*\//, "");
}

/** Root-relative URL for an article, in the language it is written in. */
export function articleUrl(article: Article): string {
  const slug = articleSlug(article);
  return articleLocale(article) === "en"
    ? `/en/posts/${slug}/`
    : `/posts/${slug}/`;
}

/** Every published article, in every language, newest first. */
export async function getArticles(): Promise<Article[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      (b.data.modDatetime ?? b.data.pubDatetime).valueOf() -
      (a.data.modDatetime ?? a.data.pubDatetime).valueOf()
  );
}

/** Articles written in one language, for that locale's own routes. */
export async function getArticlesIn(locale: Locale): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(article => articleLocale(article) === locale);
}

/**
 * One entry per article for a locale's listing, preferring that locale's own
 * version and falling back to the other language where no translation exists.
 *
 * Every article is meant to exist in both languages. This still handles the gap
 * rather than assuming it away, because the alternative failure is silent: a
 * newly written piece would simply not appear on one index, and nothing would
 * say so.
 */
export async function getArticlesFor(locale: Locale): Promise<Article[]> {
  const all = await getArticles();
  const seen = new Set<string>();
  const preferred = all.filter(article => articleLocale(article) === locale);

  for (const article of preferred) seen.add(articleSlug(article));

  const fallbacks = all.filter(article => !seen.has(articleSlug(article)));

  return [...preferred, ...fallbacks].sort(
    (a, b) =>
      (b.data.modDatetime ?? b.data.pubDatetime).valueOf() -
      (a.data.modDatetime ?? a.data.pubDatetime).valueOf()
  );
}

/**
 * The counterpart URL for each locale, for `hreflang` and the switcher.
 *
 * A missing translation yields `null` rather than a guessed URL: the switcher
 * then falls back to the other locale's home page with a notice, and no
 * `hreflang` is emitted claiming a page that does not exist.
 */
export async function articleAlternates(
  article: Article
): Promise<Partial<Record<Locale, string | null>>> {
  const slug = articleSlug(article);
  const all = await getArticles();

  return Object.fromEntries(
    LOCALES.map(locale => {
      const match = all.find(
        candidate =>
          articleSlug(candidate) === slug && articleLocale(candidate) === locale
      );
      return [locale, match ? articleUrl(match) : null];
    })
  );
}
