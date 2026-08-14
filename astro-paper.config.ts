import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://chenghanlin.com/",
    title: "Cheng-Han Lin",
    // Default-locale (zh-Hant) description. English pages pass their own
    // description to <Layout> explicitly.
    description:
      "Cheng-Han Lin 的個人網站 —— 全端工程師，專注於檢索增強生成（RAG）、自架模型推論與機器學習預測，以及圍繞它們的後端、行動端與金流基礎建設。",
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
