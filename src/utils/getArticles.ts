import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/locales";

export type Article = CollectionEntry<"posts">;

/**
 * Articles are deliberately not required to exist in both languages: each is
 * written once, in whichever language suits its reader. Forcing parity would
 * double the maintenance and, as the brief puts it, end with neither side being
 * updated.
 *
 * So there is one list, ordered newest first, and every listing marks which
 * language each piece is in. The article itself lives at the URL of its own
 * language, so `<html lang>` always matches what is on the page.
 */
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
  return articles.filter(article => article.data.lang === locale);
}

/** The slug an article is published under, derived from its file id. */
export function articleSlug(article: Article): string {
  return article.id.replace(/^.*\//, "");
}

/** Root-relative URL for an article, in the language it was written in. */
export function articleUrl(article: Article): string {
  const slug = articleSlug(article);
  return article.data.lang === "en" ? `/en/posts/${slug}/` : `/posts/${slug}/`;
}
