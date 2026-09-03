# Project Memory — Headless WordPress → Next.js ("Vantage")

**Read this file first, every session, before doing anything else.** If this file and any handoff message ever disagree, this file wins — it's the more recent source of truth.

Last updated: 2026-08-30

---

## What this is

Learning project. User has a WordPress background, is new to Next.js/React/App Router. Building a dark, premium digital-studio brand site ("Vantage" — fictional) as a headless WP + Next.js app.

## How to work on this project (important — read every time)

- **The user writes the code.** Do not generate full files or components for them. Explain concepts, point at what needs to be written, review/correct what they write.
- When something is a genuinely new concept with no WordPress equivalent (Server vs Client Components, hooks, JSX, etc.), stop and explain it before touching code.
- Exception: non-app-code artifacts like this memory file are fine to write directly.

## Stack decisions

- WordPress on **Pantheon** (migrated from local LocalWP — old domain `learn-headless-nextjs.local` is dead, ignore it in old notes)
- REST API (not GraphQL) — simplicity/transferability
- **SCF** (Secure Custom Fields, Automattic's ACF fork) for repeater/gallery/options-page fields
- **Custom Post Type UI** plugin registered `Project` CPT (slug `project`, **REST base is plural `projects`**)
- Frontend: Next.js App Router, TypeScript, **plain CSS (no Tailwind)**, GSAP for animation
- `.env.local` → `WORDPRESS_API_URL` already points at the Pantheon REST base — always read it from there, never hardcode a domain

## Static design reference

Complete static HTML/CSS/JS prototype at `../frontend-template/` (sibling of this `frontend/` folder) — this is the visual/structural reference being translated into Next.js, NOT the final deliverable.

- Pages: `index.html`, `about.html`, `services.html`, `contact.html`, `work.html` (Projects archive), `work-single.html`, `blog.html`, `blog-single.html`
- Assets: `css/style.css` (design tokens as CSS custom properties + components — already ported into `src/app/globals.css`), `js/main.js` (vanilla GSAP + ScrollTrigger: hero word-reveal, scroll reveals, mobile nav overlay, infinite marquee — not yet ported)

## WordPress structure (as built pre-migration — verify still intact on Pantheon if anything seems off)

### Custom Post Type
- `Project` — REST base `projects`

### Pages
Home, About, Services, Contact (all published)

### Options Page
"Site Settings" — global data shared across pages

### Field groups (all "Show in REST API" enabled)

**Project Fields** (on CPT `Project`): `client`, `year`, `services`, `timeline` (text), `gallery` (gallery)

**Site Options** (on Options Page): `email`, `phone`, `location` (text) · `social_links` (repeater → `label`, `url`) · `services_list` (repeater → `title`, `description`, `tags`) · `footer_heading` (text) · `footer_link` (Link field → `{title, url, target}`)
- `cta_button_text` was tried here and **explicitly rejected** — do not reintroduce. See architectural rule below.

**Home Page Fields**: `hero_eyebrow`, `hero_headline`, `hero_lede`, `hero_stat_number`, `hero_stat_label`, `intro_heading`, `intro_lede`, `intro_stats` (repeater → `number`, `label`), `cta_eyebrow`, `cta_heading`, `cta_link` (Link field)

**About Page Fields**: `hero_eyebrow`, `hero_headline`, `hero_lede`, `story_eyebrow`, `story_heading`, `story_body` (WYSIWYG), `principles` (repeater → `label`, `title`, `description`), `team` (repeater → `name`, `role`, `photo` [image]), `cta_heading`, `cta_eyebrow`, `cta_link` (Link field)

**Services Page Fields**: `hero_eyebrow`, `hero_headline`, `hero_lede`, `process_steps` (repeater → `range`, `title`, `description`), `cta_heading`, `cta_eyebrow`, `cta_link` (Link field)
- Services list itself is NOT duplicated here — pull from Site Options → `services_list`

**Contact Page Fields**: `hero_eyebrow`, `hero_headline`, `hero_lede`
- email/phone/location reused from Site Options, not duplicated

### Architectural rules (don't undo these)

1. **A CTA button's text + destination are never global.** Every CTA band gets its own `cta_link` field (ACF Link field: label + URL + target bundled) on that page's own field group. Only exception: the site **footer** is genuinely identical everywhere, so it lives in Site Options as `footer_link`.
2. **A field belongs on a page only if the content is unique to that page.** Sections that are really queries against other content should query, not duplicate:
   - Marquee, "What we do" teaser → `Site Options.services_list`
   - "Selected work" → `/wp-json/wp/v2/projects?_embed`, latest 3
   - "From the journal" → Posts endpoint, latest 3

### Gotchas hit

- New CPTs need permalinks flushed (Settings → Permalinks → Save) before REST route works.
- `?_embed` needed on REST requests to pull `_embedded['wp:featuredmedia']`.
- SCF admin: typing a Field Name right after Label auto-fills can duplicate text (e.g. `cta_linkcta_link`) — always check Field Name after typing Label.
- **Pantheon's CDN (Fastly) caches public GET REST requests hard** (`Cache-Control: public, max-age=604800` — 7 days), keyed by exact URL/query string. Saving a post in wp-admin does NOT reliably purge this for custom REST routes/query strings (only normal page URLs seem to auto-purge reliably). Symptom: WordPress data confirmed correct and live via direct check, but the Next.js app keeps rendering old values. Diagnose with `curl -sD - <url> -o /dev/null | grep -i "x-cache\|age"` — `X-Cache: HIT` + a nonzero `Age` confirms a stale cached response. Fix: Pantheon Dashboard → environment page → **Clear Caches** button. Expect to hit this again anytime content is edited mid-development.
- A CPT needs "Excerpt" checked under Supports (CPT UI) for `excerpt.rendered` to appear in its REST response at all — otherwise the field is absent from the JSON entirely (not just empty), which throws `Cannot read properties of undefined` if code assumes it's always present.
- The native **Featured Image** panel (→ `featured_media` in REST, resolved via `?_embed`) is separate from an ACF **gallery** field — easy to add images to the wrong one and have `featured_media` stay `0`.

## Content entry (2026-08-29)

The user is using a separate Claude app/extension wired into the WP admin to do data entry — filling ACF fields, adding Posts/Projects content. So content population is **decoupled from this coding session**: don't worry about whether content exists yet, and don't offer to fill it in. The table below may go stale as that tool fills things in; if a fetch returns something unexpected, sanity-check against Pantheon rather than assuming the table here is current.

## Content status (verify current on Pantheon, update as filled in — may be stale, see above)

| Item | Status |
|---|---|
| Site Options (email, phone, social links ×3, services list ×4, footer heading, footer link) | ✅ Filled |
| Home page ACF content | ✅ Filled |
| About page ACF content (hero, story, 3 principles, 4 team members, CTA) | ✅ Filled |
| Services page ACF content | ❌ Empty — needs hero, process steps (4 rows), CTA |
| Contact page ACF content | ❌ Empty — needs hero |
| Projects (CPT entries) | ✅ 3 filled — Solace, Ferrum Coffee, Kestrel Aviation, with client/year/services/timeline, excerpt, and featured image all set |
| Posts (blog entries) | ❌ Zero real posts — only default "Hello world!" |
| Team member photos, project gallery images | ❌ Not set — image upload is manual, not automatable |

Note: pages' Gutenberg block content (separate from ACF meta boxes) may have leftover default-theme demo content ("Hero book" pattern) — irrelevant since frontend never renders WP block output, cosmetic cleanup only.

## Next.js build roadmap

1. ✅ Scaffold (`create-next-app`, TS, no Tailwind, App Router)
2. ✅ `.env.local` → `WORDPRESS_API_URL` pointed at Pantheon
3. ✅ `css/style.css` ported → `src/app/globals.css`
4. 🚧 `src/lib/wordpress.ts` — `getPage(slug)`, `getSiteOptions()`, `getProjects()` all built. `Page['acf']` still missing `cta_link` and doesn't yet cover About/Services/Contact page shapes. Still needed: `getPosts()`, `getPost(slug)`, `getProject(slug)`.
5. 🚧 Routes: `src/app/page.tsx` has real sections now — Hero, Marquee (inline, static text not yet animated), Intro stats, Selected work (Project cards) — all wired to live data. Still needed on the homepage: "What we do" (services_list), CTA band (needs `cta_link`), "From the journal" (posts), plus Footer/Nav in `layout.tsx`. Other routes (`about/`, `services/`, `contact/`, `work/`, `work/[slug]/`, `blog/`, `blog/[slug]/`) not started.
6. 🚧 Shared components: `Stat` and `Card` built (`src/components/`). Still needed: Nav, MenuOverlay, Footer, and a dedicated `Marquee` component (will need to become a Client Component once GSAP is wired in — see #7).
7. ❌ GSAP → Client Component (`'use client'` + `useEffect`) — needs a proper explanation before diving in
8. ❌ Images: `next/image`, WP domain added to `next.config.js` → `images.remotePatterns`
9. ❌ CORS — not yet hit, likely needed once fetching from Pantheon domain in the browser (though most fetches here are server-side)

## Deployment and infra (2026-08-29)

- **Two separate, unrelated git remotes/repos exist in this project** — don't confuse them:
  - `frontend/` (this repo) → GitHub `lazyZ33/vantage` → connected to **Vercel**. `git push` to `main` here deploys the Next.js frontend to production; other branches get preview URLs.
  - A second, sibling clone at `../headless-next-js/` (outside this repo, not part of it) → Pantheon's own git server (`codeserver.dev.<site-id>.drush.in`) → the actual WordPress codebase (core, plugins, `wp-content`). `git push` there (branch `master`) deploys straight to the Pantheon **Dev** environment (`dev-headless-next-js.pantheonsite.io`, which is what `WORDPRESS_API_URL` points at). No GitHub involvement on this side at all.
- Pantheon git access needed a **dedicated RSA key** (`~/.ssh/id_rsa_pantheon`) — their SSH key upload UI errored repeatedly on an ED25519 key. An `~/.ssh/config` entry routes any `*.drush.in` host to that key (`IdentitiesOnly yes`).
- **Custom Options Page REST endpoint**: SCF's "Show in REST API" only attaches to real content objects (posts/pages/CPTs) via their existing REST controller — an Options Page has no post object behind it (just rows in `wp_options`), so there's nothing for it to attach to, and it 404s by default. Fixed with a small custom mu-plugin: `headless-next-js/wp-content/mu-plugins/vantage-site-options.php`, registering `GET /wp-json/vantage/v1/site-options`, reading each field via `get_field($name, 'option')`. Confirmed live and returning real data.
- Known content gap surfaced by the live response: the 4th `social_links` entry has an empty `label`/`url` — needs filling in (content, not code).

## Resolved: Claude wrote page.tsx (2026-08-29)

Claude generated a full `page.tsx` (hero/intro/CTA) in violation of the "user writes the code" rule, and it hardcoded the CTA link. Reverted to the pre-existing stub (`getPage('home')` → renders `hero_headline` only) at the user's request. **Claude is not to write any app code in this project going forward** — see rule at the top of this file.
