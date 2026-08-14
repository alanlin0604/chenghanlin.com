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
    pages/{zh-hant,en}/about.md      About copy, per locale
    projects/{zh-hant,en}/*.md       Project card metadata, per locale
    posts/                           Empty until Phase 5
  pages/
    index.astro  about.astro         Chinese (no locale prefix)
    en/                              English
  i18n/
    locales.ts                       Locale list, content dirs, hreflang values
    lang/{zh-Hant,en}.ts             UI strings
  parked/                            Blog routes, restored in Phase 5
  styles/
    fonts.generated.css              GENERATED — do not edit
scripts/
  build-fonts.mjs                    Subsets Noto Sans TC to the site's text
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

If a character somehow escapes the scan, that glyph falls back to the system CJK
font — visibly inconsistent, but never broken.

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
