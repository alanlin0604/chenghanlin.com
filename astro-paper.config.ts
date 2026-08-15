import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://chenghanlin.com/",
    // Fallback only. The name shown to readers is per-locale — 林承翰 on the
    // Chinese pages, "Cheng-Han Lin" on the English ones — and comes from
    // `siteName` in src/i18n/lang/*.ts.
    title: "Cheng-Han Lin",
    // Default-locale (zh-Hant) description. English pages pass their own
    // description to <Layout> explicitly.
    description:
      "林承翰的個人網站——三個獨立開發的上線產品。專長是把大型語言模型變成可信賴的東西：檢索增強生成（RAG）、自架模型推論與機器學習預測，以及支撐它們的後端、行動端與金流基礎建設。",
    // Latin form, used where a romanised name is correct regardless of page
    // language: the OG card and the structured author field.
    author: "Cheng-Han Lin",
    profile: "https://github.com/alanlin0604",
    lang: "zh-Hant",
    timezone: "Asia/Taipei",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    // Blog surfaces return in Phase 5, together with the first real articles.
    // The routes live under src/pages/_posts, _tags, _archives, _search.astro
    // (leading underscore = not routed by Astro).
    showArchives: false,
    search: false,
    showBackButton: true,
    editPost: { enabled: false },
  },
  socials: [
    {
      name: "github",
      url: "https://github.com/alanlin0604",
      linkTitle: "GitHub — alanlin0604",
    },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/chenghanlin-tw/",
      linkTitle: "LinkedIn — chenghanlin-tw",
    },
    {
      name: "mail",
      url: "mailto:alan930604@gmail.com",
      linkTitle: "Email — alan930604@gmail.com",
    },
  ],
  shareLinks: [
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20page&body=" },
  ],
});
