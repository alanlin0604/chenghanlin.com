import { getCollection, type CollectionEntry } from "astro:content";
import { CONTENT_DIR, type Locale } from "@/i18n/locales";

/**
 * Projects for one locale, ordered by `order` (HeartBox first — it is the
 * page the site exists to lead people to).
 */
export async function getProjects(
  locale: Locale
): Promise<CollectionEntry<"projects">[]> {
  const prefix = `${CONTENT_DIR[locale]}/`;
  const all = await getCollection("projects");
  return all
    .filter(entry => entry.id.startsWith(prefix))
    .sort((a, b) => a.data.order - b.data.order);
}
