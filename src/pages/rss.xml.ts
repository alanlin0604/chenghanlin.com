import rss from "@astrojs/rss";
import { getArticlesFor, articleUrl, articleLocale } from "@/utils/getArticles";
import { DEFAULT_LOCALE, HREFLANG } from "@/i18n/locales";
import config from "@/config";

/**
 * One feed, in the site's default language. Every article now exists in both
 * languages, so listing both versions would show each piece twice to the same
 * subscriber; `getArticlesFor` gives one entry per article, preferring Chinese
 * and falling back to English only where a translation is still missing.
 *
 * Each item still declares its own language, because that fallback means the
 * feed is not guaranteed to be uniform.
 */
export async function GET() {
  const articles = await getArticlesFor(DEFAULT_LOCALE);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: articles.map(article => ({
      link: articleUrl(article),
      title: article.data.title,
      description: article.data.description,
      pubDate: new Date(article.data.modDatetime ?? article.data.pubDatetime),
      customData: `<language>${HREFLANG[articleLocale(article)]}</language>`,
    })),
  });
}
