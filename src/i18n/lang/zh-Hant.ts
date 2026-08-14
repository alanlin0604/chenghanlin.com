import type { UIStrings } from "../types";

export default {
  siteName: "林承翰",
  nav: {
    home: "首頁",
    posts: "文章",
    tags: "標籤",
    about: "關於",
    archives: "封存",
    search: "搜尋",
    projects: "專案",
    resume: "履歷",
  },
  post: {
    publishedAt: "發布於",
    updatedAt: "更新於",
    sharePostIntro: "分享這篇文章：",
    sharePostOn: "分享到 {{platform}}",
    sharePostViaEmail: "以 Email 分享這篇文章",
    tagLabel: "標籤",
    backToTop: "回到頂端",
    goBack: "返回",
    editPage: "編輯此頁",
    previousPost: "上一篇",
    nextPost: "下一篇",
  },
  pagination: {
    prev: "上一頁",
    next: "下一頁",
    page: "第",
  },
  home: {
    socialLinks: "聯絡方式",
    featured: "精選",
    recentPosts: "最新文章",
    allPosts: "所有文章",
  },
  footer: {
    copyright: "版權所有",
    allRightsReserved: "保留一切權利。",
  },
  pages: {
    tagTitle: "標籤",
    tagDesc: "所有標記為此標籤的文章",

    tagsTitle: "標籤",
    tagsDesc: "文章使用過的所有標籤。",

    postsTitle: "文章",
    postsDesc: "所有已發布的文章。",

    archivesTitle: "封存",
    archivesDesc: "依時間排列的所有文章。",

    searchTitle: "搜尋",
    searchDesc: "搜尋文章⋯⋯",
  },
  a11y: {
    skipToContent: "跳至主要內容",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    toggleTheme: "切換深淺色主題",
    searchPlaceholder: "搜尋文章⋯⋯",
    noResults: "找不到符合的結果",
    goToPreviousPage: "前往上一頁",
    goToNextPage: "前往下一頁",
  },
  notFound: {
    title: "404 找不到頁面",
    message: "找不到這個頁面",
    goHome: "回到首頁",
  },
  lang: {
    switchTo: "English",
    switchLabel: "Switch to English",
    fallbackTitle: "這一頁還沒有中文版",
    fallbackBody: "已為你導向中文版首頁。",
    fallbackDismiss: "關閉",
  },
  projects: {
    sectionTitle: "專案",
    liveDemo: "線上版本",
    sourceCode: "原始碼",
    readCaseStudy: "閱讀案例研究",
    pageComingSoon: "案例研究撰寫中",
    readPage: "閱讀",
    indexIntro:
      "三個獨立開發的專案。HeartBox 是其中投入最深、也最值得細讀的一個 —— 它是這個網站存在的主要理由。",
  },
  decision: {
    context: "情境",
    options: "考慮過的選項",
    tradeoff: "取捨",
    outcome: "決定",
  },
  contact: {
    sectionTitle: "聯絡",
    emailLabel: "Email",
  },
} satisfies UIStrings;
