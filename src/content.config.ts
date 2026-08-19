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
      // Language is not declared here: it is the directory the file sits in
      // (`posts/zh-hant/…`, `posts/en/…`), so a file cannot claim one language
      // while being published at the other's URL. See utils/getArticles.ts.
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
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** One sentence. This is the whole card body — keep it to one line. */
      tagline: z.string(),
      /**
       * Meta description for the project's own page. Falls back to `tagline`,
       * but a case study deserves a line written for search results rather than
       * for a card.
       */
      description: z.string().optional(),
      /** Ascending. HeartBox is 1 and stays pinned to the top. */
      order: z.number(),
      /**
       * Shown on the /projects index but not on the home page. The index exists
       * to help a reader choose which project to open, which needs more than the
       * home page's one-line pitch: who built it and when.
       */
      role: z.string(),
      period: z.string(),
      /** One sentence on the problem, again for the index rather than the card. */
      problem: z.string(),
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
      /**
       * Whether the page is a full case study rather than a project summary.
       * Drives the wording of the link into it, so the reader knows which of the
       * three is worth twenty minutes.
       */
      caseStudy: z.boolean().default(false),
      /**
       * Short category label set beside the title on the home page's featured
       * card, e.g. "AI 心情日記平台". Only the featured project carries one —
       * on a row that is already one of two, a category adds nothing.
       */
      label: z.string().optional(),
      /**
       * Headline figures for the featured card. `data: true` marks a figure as
       * one of the deliberately skewed ones (the AUC and the recall), which is
       * what earns it `--chart` rather than the plain foreground.
       */
      metrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
            /** What the figure is measured on, e.g. "scale 1–5". */
            note: z.string().optional(),
            data: z.boolean().default(false),
          })
        )
        .default([]),
      /** How the figures were arrived at. Shown once, above the band. */
      metricsCaption: z.string().optional(),
      /** Two more rail lines on a case study: what kind of work it was, and
       *  how far it reached. Omitted on the shorter project pages. */
      kind: z.string().optional(),
      scope: z.array(z.string()).default([]),
      /**
       * Product screenshot for the featured card. Optional: until the image
       * exists the card draws a placeholder at the same proportion, so the
       * layout does not move when it lands.
       */
      screenshot: image().optional(),
      screenshotAlt: z.string().optional(),
    }),
});

export const collections = { posts, pages, projects };
