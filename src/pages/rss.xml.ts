import rss from "@astrojs/rss";
import { getArticles, articleUrl } from "@/utils/getArticles";
import config from "@/config";

/**
 * One feed for the whole site. Articles are written once, in whichever language
 * suits them, so splitting the feed per locale would fragment a single list
 * rather than translate it. Each item declares its own language instead.
 */
export async function GET() {
  const articles = await getArticles();

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: articles.map(article => ({
      link: articleUrl(article),
      title: article.data.title,
      description: article.data.description,
      pubDate: new Date(article.data.modDatetime ?? article.data.pubDatetime),
      customData: `<language>${article.data.lang}</language>`,
    })),
  });
}
