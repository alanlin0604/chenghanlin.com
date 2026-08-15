import type { UIStrings } from "../types";

export default {
  siteName: "Cheng-Han Lin",
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    about: "About",
    archives: "Archives",
    search: "Search",
    projects: "Projects",
    resume: "Résumé",
  },
  post: {
    publishedAt: "Published at",
    updatedAt: "Updated",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share this post on {{platform}}",
    sharePostViaEmail: "Share this post via email",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    socialLinks: "Contact",
    featured: "Featured",
    recentPosts: "Recent Posts",
    allPosts: "All Posts",
    eyebrow: "M.S. student, Computer Science · Taichung, Taiwan",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",

    archivesTitle: "Archives",
    archivesDesc: "All the articles I've archived.",

    searchTitle: "Search",
    searchDesc: "Search any article ...",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
  lang: {
    switchTo: "繁體中文",
    switchLabel: "切換為繁體中文",
    fallbackTitle: "This page is not available in English yet",
    fallbackBody: "You have been taken to the English home page instead.",
    fallbackDismiss: "Dismiss",
  },
  projects: {
    sectionTitle: "Projects",
    liveDemo: "Live demo",
    sourceCode: "Source",
    readCaseStudy: "Read the case study",
    pageComingSoon: "Case study in progress",
    readPage: "Read about",
    indexIntro:
      "Three projects, each built solo. HeartBox is the deepest of them and the one worth reading properly — it is the reason this site exists.",
    caseStudyLabel: "Case study",
  },
  decision: {
    context: "Situation",
    options: "Alternatives considered",
    tradeoff: "Trade-off",
    outcome: "Decision",
  },
  contact: {
    sectionTitle: "Contact",
    emailLabel: "Email",
  },
  articles: {
    intro:
      "On the engineering judgement behind these projects: why each call went the way it did, what it gave up, and what is still not good enough. Available in English and Chinese.",
    writtenIn: "Written in",
    inChinese: "中文",
    inEnglish: "English",
    otherLanguageNote: "No English version of this one yet",
    empty: "Nothing published yet.",
  },
} satisfies UIStrings;
