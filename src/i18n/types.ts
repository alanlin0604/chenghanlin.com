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
    /** Heading of the in-page section list. */
    toc: string;
    /** Takes `{{minutes}}`. */
    readingTime: string;
    adjacentLabel: string;
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
    /**
     * Standfirst above the name on the home page. Deliberately a status and a
     * place, not a job title — inventing one while not employed would be the
     * kind of small overstatement the rest of the site is written to avoid.
     */
    eyebrow: string;
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
    paginationLabel: string;
    /** Takes `{{n}}`, the page number. */
    goToPage: string;
  };
  notFound: {
    title: string;
    message: string;
    goHome: string;
    /** Sentence under the heading, before the three entry points. */
    body: string;
    /** Name of the case study as a destination, not as an instruction. */
    caseStudyTitle: string;
    /** One line each on where the three links go. */
    caseStudyLead: string;
    projectsLead: string;
    postsLead: string;
  };
  /** Language switcher, including the "no counterpart page" fallback notice. */
  lang: {
    /** Name of the *other* language, written in that language. */
    switchTo: string;
    switchLabel: string;
    /** Label beside the message, e.g. "LANGUAGE". */
    fallbackEyebrow: string;
    fallbackBody: string;
  };
  projects: {
    sectionTitle: string;
    liveDemo: string;
    sourceCode: string;
    readCaseStudy: string;
    indexIntro: string;
    /**
     * Badge on the one project worth opening first. Says which to read, not
     * what kind of page it is — the link beneath it already says "case study",
     * and the badge repeating that was four wasted characters.
     */
    caseStudyLabel: string;
    /** Rail labels on a project page. */
    role: string;
    period: string;
    stack: string;
    links: string;
    /** Heading of the pull-out above the body. */
    problem: string;
    backToIndex: string;
    previousProject: string;
    nextProject: string;
    adjacentLabel: string;
    /** Rail line on the index, e.g. "3 shipped products". */
    indexCount: string;
    otherProjects: string;
    projectPage: string;
    /** Two more rail labels, used when a project page is a case study. */
    kind: string;
    scope: string;
    /** Eyebrow above the figures. */
    results: string;
  };
  /** Controls of the screenshot strip in a case study. */
  gallery: {
    previous: string;
    next: string;
    /** Takes `{{index}}` and `{{total}}`. */
    position: string;
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
    /** Way back to the index from an article. */
    all: string;
  };
}
