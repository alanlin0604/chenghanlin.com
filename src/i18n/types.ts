export interface UIStrings {
  /**
   * The author's name as written in this language. Not a translation of the
   * other — 林承翰 and "Cheng-Han Lin" are both the real name, each the form
   * its readers expect.
   */
  siteName: string;
  nav: {
    home: string;
    posts: string;
    tags: string;
    about: string;
    archives: string;
    search: string;
    projects: string;
    resume: string;
  };
  post: {
    publishedAt: string;
    updatedAt: string;
    sharePostIntro: string;
    sharePostOn: string;
    sharePostViaEmail: string;
    tagLabel: string;
    backToTop: string;
    goBack: string;
    editPage: string;
    previousPost: string;
    nextPost: string;
  };
  pagination: {
    prev: string;
    next: string;
    page: string;
  };
  home: {
    socialLinks: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
  };
  footer: {
    copyright: string;
    allRightsReserved: string;
  };
  pages: {
    tagTitle: string;
    tagDesc: string;

    tagsTitle: string;
    tagsDesc: string;

    postsTitle: string;
    postsDesc: string;

    archivesTitle: string;
    archivesDesc: string;

    searchTitle: string;
    searchDesc: string;
  };
  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    toggleTheme: string;
    searchPlaceholder: string;
    noResults: string;
    goToPreviousPage: string;
    goToNextPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
  };
  /** Language switcher, including the "no counterpart page" fallback notice. */
  lang: {
    /** Name of the *other* language, written in that language. */
    switchTo: string;
    switchLabel: string;
    fallbackTitle: string;
    fallbackBody: string;
    fallbackDismiss: string;
  };
  projects: {
    sectionTitle: string;
    liveDemo: string;
    sourceCode: string;
    readCaseStudy: string;
    pageComingSoon: string;
    /** Prefix for the link into a project page that is not a case study. */
    readPage: string;
    indexIntro: string;
  };
  /** Labels for the case-study decision blocks. */
  decision: {
    context: string;
    options: string;
    tradeoff: string;
    outcome: string;
  };
  contact: {
    sectionTitle: string;
    emailLabel: string;
  };
  articles: {
    intro: string;
    /** Badge marking which language a piece was written in. */
    writtenIn: string;
    inChinese: string;
    inEnglish: string;
    /** Shown on a listing entry that is in the other language. */
    otherLanguageNote: string;
    empty: string;
  };
}
