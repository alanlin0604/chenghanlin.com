import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      /** Articles are deliberately not required to exist in both languages. */
      lang: z.enum(["zh-Hant", "en"]).default("zh-Hant"),
    }),
});

/**
 * Static pages (About, …). Entries are stored per locale, so ids read
 * "zh-Hant/about" and "en/about".
 */
const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

/**
 * Portfolio projects. Card metadata lives here so the Chinese and English
 * home pages render from the same shape. Ids read "zh-Hant/heartbox".
 *
 * `hasPage` marks whether a dedicated case-study route exists yet. While it is
 * false the card links out to the live site / repository instead of to an
 * internal URL that would 404. HeartBox flips to true in Phase 2, the other
 * two in Phase 3.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    /** One sentence. This is the whole card body — keep it to one line. */
    tagline: z.string(),
    /** Ascending. HeartBox is 1 and stays pinned to the top. */
    order: z.number(),
    /** Short chips, 3–5 items. Not a full stack listing. */
    stack: z.array(z.string()).default([]),
    liveUrl: z.url().optional(),
    repoUrl: z.url().optional(),
    /**
     * Slug of the eventual case-study page, e.g. "heartbox".
     * Deliberately not called `slug`: that key is reserved by the content
     * loader and would collide across the two locale copies of each project.
     */
    pageSlug: z.string(),
    hasPage: z.boolean().default(false),
  }),
});

export const collections = { posts, pages, projects };
