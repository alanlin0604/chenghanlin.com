# chenghanlin.com

Personal site of Cheng-Han Lin. Traditional Chinese is the default language and
lives at the root; English lives under `/en/`.

Built with [Astro](https://astro.build), starting from the
[AstroPaper](https://github.com/satnaing/astro-paper) theme (MIT). Deployed to
Cloudflare Workers as a static asset site.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # regenerates font subsets, type-checks, builds to dist/
npm run preview
npm run deploy   # build + wrangler deploy
```

## Layout

```
src/
  content/
    pages/{zh-hant,en}/*.md          About and résumé copy, per locale
    projects/{zh-hant,en}/*.mdx      Project metadata and case studies
    posts/{zh-hant,en}/*.md          Articles; translations share a slug
  pages/
    index.astro  about.astro         Chinese (no locale prefix)
    en/                              English
  i18n/
    locales.ts                       Locale list, content dirs, hreflang values
    lang/{zh-Hant,en}.ts             UI strings
  utils/
    getArticles.ts                   Article pairing, listing and alternates
    transformers/                    Markdown/rehype plugins
  parked/                            Theme's unused blog surfaces; not built
  styles/
    fonts.generated.css              GENERATED — do not edit
scripts/
  build-fonts.mjs                    Subsets Noto Sans TC to the site's text
  build-resume-pdf.mjs               Renders /resume/ to public/*.pdf
  check-font-coverage.mjs            npm run check:fonts
  check-cjk-wrapping.mjs             npm run check:cjk
  check-overflow.mjs                 npm run check:overflow
```

Locale content directories are lower-case (`zh-hant`, not `zh-Hant`) because
the content loader slugifies entry ids; `CONTENT_DIR` in `src/i18n/locales.ts`
maps between the two.

## Decisions worth knowing

### The name is per-locale, not translated

Chinese pages say 林承翰, English pages say "Cheng-Han Lin". Both are the real
name in the form its readers expect, so neither is a translation of the other.
It lives in `siteName` in `src/i18n/lang/*.ts` and drives the header, `<title>`,
`og:site_name` and the home page heading. `site.author` in
`astro-paper.config.ts` stays Latin — it feeds the OG card, which is Latin-only
by design.

### `@emnapi/*` is a deliberate devDependency

Do not remove it. `@img/sharp-wasm32` and `@tailwindcss/oxide-wasm32-wasi`
declare `@emnapi/*` dependencies, but npm omits transitive dependencies of
optional packages it did not install locally. A lockfile generated on Windows
therefore lacks them, and `npm ci` on the Linux build machine fails with
`Missing: @emnapi/runtime@… from lock file`. Declaring them explicitly forces
top-level lock entries and keeps the lockfile valid on every platform.

Verify a change to dependencies with:

```
npm ci --dry-run --os=linux --cpu=x64 --libc=glibc
```

### Fonts are subset from the site's own text

`scripts/build-fonts.mjs` scans everything under `src/` that gets rendered,
collects the distinct characters, and subsets Noto Sans TC to exactly that set.
It runs automatically via `prebuild`, so new Chinese copy is covered on the next
build with nothing to maintain by hand.

This replaced a pre-sliced distribution (Fontsource's 105 unicode-range files).
Slicing is the right answer for character-heavy Chinese sites and the wrong one
here — the pages are short but their characters scatter across a dozen slices,
so the browser fetched nearly all of them. Measured on `/about/`:

| | pre-sliced | subset |
|---|---|---|
| Font requests | 14 | 2 |
| Font bytes | 936 KB | 178 KB |
| Total page weight | ~1 MB | 199 KB |
| First contentful paint | 4.7 s | 2.0 s |
| Lighthouse performance | 71 | 98 |

English pages set `font-family` to the system UI stack, so they download **no**
webfont at all (21 KB total page weight).

### The bold weight is subset separately

Only about a third of the site's characters ever render at weight 600 or more —
headings and `<strong>` are a small slice of the prose. Shipping the other two
thirds in a weight that never paints them is waste, and it measurably hurt the
case study page, whose length makes it the most font-sensitive route.

So the build runs twice: once to produce both weights over the full character
set and render the HTML, then again after re-subsetting bold to the characters
that actually appear in bold context in that HTML.

| | full both weights | bold subset |
|---|---|---|
| Bold face | 149 KB | 71 KB |
| Font bytes per page | 302 KB | 222 KB |
| `/projects/heartbox/` performance | 93 | 96 |

Deriving the set from built HTML rather than from source matters: it is what the
browser actually paints. The trade is a new failure mode — a component that
expresses boldness in a way the selector misses would render those characters in
the system CJK face inside a heading, silently. Two things guard against it:

- `build-fonts.mjs` refuses to write a bold subset that finds fewer than 50 CJK
  characters, so a broken selector degrades to the full set instead of shipping
  gaps.
- `npm run check:fonts` loads every built page in a browser, finds every
  character whose *computed* weight is 600+, and asks the CSS Font Loading API
  whether the bold face can render it. Run it after adding a component or a
  page:

  ```
  npm run build
  npx astro preview
  npm run check:fonts http://localhost:4321
  ```

  It needs Chrome, so it is not part of `npm run build` — the deploy machine has
  neither Chrome nor a server.

If a character escapes both, that glyph falls back to the system CJK font —
visibly inconsistent, but never broken.

### Chinese paragraphs are never hard-wrapped

Markdown and JSX both join a soft line break with a space. Between Latin words
that is the intent; between Han characters it renders as a visible gap in the
middle of a word, and it is invisible in the editor. The first pass of this site
shipped 89 of them.

So Chinese paragraphs stay on one source line, and `npm run check:cjk` fails if
one gets broken again. It needs no browser and no server, so unlike
`check:fonts` it can run anywhere:

```
npm run check:cjk
```

The check matches CJK punctuation as well as Han. An earlier version looked only
for `[一-鿿]` on both sides of the break and reported a clean tree —
every line it should have caught happened to end on a full-width comma.

### Nothing scrolls sideways at 320px

`npm run check:overflow` loads every built page at a 320px viewport and compares
`scrollWidth` to `clientWidth`. Horizontal overflow does not show up on a
desktop browser and a narrow screenshot looks plausible either way, so it needs
measuring rather than looking.

It caught two things this way. The header nav fitted in Chinese, where every
label is two characters, and overflowed in English on every page. And Markdown
comparison tables overflowed only in English, because Chinese breaks between any
two characters and "Interpretability" does not.

Tables are wrapped in a scrollable container by a small rehype plugin rather
than by `table { display: block }` — changing a table's `display` drops its
table semantics in some screen readers.

### Articles exist in both languages

`src/content/posts/<locale>/<slug>.md`. The two versions of a piece share a
slug, and that pairing is what makes the language switcher land on the same
article rather than dropping the reader at the index. Language comes from the
directory, never from frontmatter, so a file cannot claim one language while
being published at the other's URL.

Where a translation is genuinely missing, the listing falls back to the other
language with a badge instead of hiding the piece, and no `hreflang` is emitted
for the version that does not exist.

### Typography is tuned for Chinese first

Chinese is the default language, so the baseline metrics are Chinese metrics
(`line-height: 1.8`, `letter-spacing: 0.02em`) and `:lang(en)` tightens back to
Latin ones. Reading measure is set in `rem` for Chinese (~35 characters per
line) and in `ch` for English (68 characters) — `ch` derives from the digit
zero and is meaningless for CJK. Justified text is never used; it opens large
gaps between Chinese characters.

### The language switcher never 404s

`src/utils/localeRoutes.ts` derives, at build time, which logical pages exist in
which locale by globbing `src/pages`. The switcher links straight to the
counterpart page when it exists, and otherwise to the other language's home page
with a `#lang-fallback` anchor that reveals a notice via a `:target` CSS rule —
no JavaScript. Dynamic routes cannot be discovered from filenames, so those
pages pass their counterparts explicitly via the `alternates` prop.

`hreflang` is emitted only for locales that actually have the page. Pointing a
missing translation at a home page tells Google the two are equivalent when they
are not, which is worse than omitting the tag.

### The site works with JavaScript disabled

Verified, including navigation. AstroPaper's mobile hamburger menu was removed
rather than kept: this site has two nav links and a theme toggle, which fit on
one row at 320px, and a menu that cannot be opened without JS fails on phones.

### The OG image is Latin-only

`src/pages/og.png.ts` renders the social card with satori, which draws text with
the font buffers it is handed. The loaded face covers Latin, so Chinese would
render as blank boxes rather than failing loudly. The card shows the romanised
name and an English line — which is what a link preview needs in either
language — instead of pulling a multi-megabyte CJK TTF through the build. Per-post
cards return in Phase 5 and will need a CJK face for Chinese titles.

## Phase status

- [x] **Phase 1** — skeleton, home and About in both languages, i18n routing,
      deployment
- [ ] **Phase 2** — HeartBox case study (`/projects/heartbox`)
- [ ] **Phase 3** — LapseWatch and PantryKeeper, `/projects` index
- [ ] **Phase 4** — `/resume`
- [ ] **Phase 5** — technical writing; restore `src/parked/` routes, Pagefind
      search, RSS
- [ ] **Phase 6** — English content for the project pages

Project cards carry `hasPage: false` until their case study exists, which keeps
them linking to the live site and repository instead of to a route that would
404. Flip the flag when the page lands.

## Licence

Site content © Cheng-Han Lin. Theme derived from AstroPaper, MIT — see
`LICENSE`. Noto Sans TC is licensed under the SIL Open Font License 1.1.
