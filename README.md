# amartya — portfolio

Warm-paper sticker desk. Three pages: **the desk** (home), **things**, **about**.
Locked design canvas: https://claude.ai/code/artifact/e663991f-cf55-4551-a7cc-8dd017cb7bd9

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

## Hard rules

1. **UI components come from beUI only** — https://beui.dev/components/motion
   Copied verbatim into `components/motion/` (React + TS + Tailwind + Motion, the
   library's own delivery model). Do not hand-roll a control that beUI already
   ships; if a new interaction is needed, take it from that list first.
   Shared motion tokens live in `lib/ease.ts` — every spring in the app comes
   from there, so the whole site moves with one set of physics.

2. **The 3D desk and the cast are bespoke art, not UI.** `components/desk/` and
   `components/art/` are the illustrated layer. Rule of thumb: if it takes input,
   it's beUI; if it's a drawing, it's ours.

3. **The design system is locked** (`app/globals.css`):
   paper `#f4eee2` · ink `#241f1c` · orange `#e8562f` (voice) · blue `#2f6fed`
   (the route) · yellow `#ffc53a` · green `#6fae7b`.
   Type: Bricolage Grotesque (display) / Instrument Sans (body) /
   Shantell Sans (margin notes) / Geist Mono (labels). Self-hosted in `app/fonts/`.
   Spacing: 76px gutters, ~200px between sections, 30–34px grid gaps.

4. **The sticker is the atom.** Every interactive thing is a `<Sticker>`
   (`components/site/sticker.tsx`): white bleed ring + contact shadow, ±3° tilt.
   Three decorative stickers per screen, max. One margin note per area.

## Layout

```
app/            routes + tokens + self-hosted fonts
components/
  motion/       beUI components, verbatim
  site/         compositions built from beUI + the design system
  art/          the SVG cast (avatar, cat, mug, plant, plane…)
  desk/         the R3F hero scene (code geometry, no model pipeline)
lib/            cn(), motion tokens, hooks
```

## Deploy (GitHub Pages)

The site is a static export (`output: "export"`), so Pages can serve it as-is.
`.github/workflows/deploy.yml` builds on every push to `main` and works for
either repo shape — it derives `basePath` from the repo name, so a user site
(`iamartyaa.github.io`) serves from `/` and a project repo from `/<repo>`.

First time, from this folder:

```bash
# 1. create the repo on github.com (empty, no README), then:
git remote add origin https://github.com/iamartyaa/iamartyaa.github.io.git
git push -u origin main

# 2. on GitHub: Settings → Pages → Source: "GitHub Actions"
```

That's it — the workflow does the rest, and every later push redeploys.

## Status

- [x] Design system, fonts, tokens, night mode (View Transition wipe, lamp-lit 3D)
- [x] Home — hero, 3D desk, marquee, "what's on it", teasers, contact
- [x] /things — the route, four landings, the drawer
- [x] /about — the pilot, the shelf, "where I've flown", how I work, say hi
- [x] Real content from the résumé
- [x] Open Graph card (`public/og.png`) + `app/icon.svg`
- [x] The portrait peels off and can be stuck anywhere in the band; the face
      reacts through the gesture (`components/site/peel-sticker.tsx`)
- [x] The desk spins a true 360 and every object sits on the surface
- [x] Night mode is the lamp's pull chain on Home, and the cord hanging off
      the top edge everywhere else (`components/site/pull-cord.tsx`)
- [x] The cat's eyes follow the cursor on /about, and he is the mascot that
      follows it around /things (`components/site/cursor-cat.tsx`)
- [x] The say-hi card is signed by hand (`components/site/signature.tsx`)
- [x] /writings — the shelf, plus The GEMM Scrapbook served verbatim in its
      own design system (see below)
- [x] Traffic plumbing: sitemap.xml, robots.txt, RSS at /feed.xml,
      per-article canonical + OpenGraph + TechArticle JSON-LD
- [ ] Push to GitHub and turn Pages on — the two steps that need your login
- [ ] Drop a `resume.pdf` into `public/` — the "résumé" sticker links to it

## Interaction map

| Where | What it does |
| --- | --- |
| Home, the desk | drag to spin 360°, hover an object for its label, click to go there |
| Home, the lamp chain | pulls night mode on and off, and the wipe starts at the lamp |
| Home, the portrait | peel it off, drop it anywhere in the band, double-click to put it back |
| Home, the trait stickers | pick up and throw (drag momentum) |
| /things | the plane flies the four landings and stops at 04; the cat follows your cursor |
| /about, the cat | pupils track the pointer; click him for a hop |
| /about, the mug | click for a sip — it keeps count |
| Anywhere but Home | the cord top-right: drag it down or click it |

## Writings: one design system per article

An article is not a route. Each one is a **standalone HTML file** — its own
type, palette, motion and physics, everything inlined — dropped at
`public/writings/<slug>/index.html` and served verbatim. Next never renders it,
so nothing from the site's design system can leak in and nothing from the
article can leak out. That is the whole point of the shelf: a portfolio of one
design system is a portfolio of one idea.

Publishing is three steps:

1. `public/writings/<slug>/index.html` — the article itself, as built.
2. `public/writings/<slug>/og.png` — a 1200×630 share card, drawn in *that
   article's* palette, not this site's.
3. A row in `WRITINGS` (`lib/writings.ts`) and a specimen in
   `components/site/specimens.tsx`.

The specimen is the interesting part. `components/site/article-sticker.tsx`
renders one big die-cut sticker per piece, and the artwork on it is a live
miniature of the article's own world — painted in the article's colours, in the
article's type, animating on hover. The index is therefore a contact sheet of
design systems rather than a list of links.

Two things get injected into each published file, and only these two:

- share tags in `<head>` (canonical, OpenGraph, Twitter, description), so a
  link to it previews properly;
- one small fixed "← more writing" chip, styled with the article's *own* CSS
  variables so it wears the article's paper and ink.

`lib/writings.ts` is the registry the sitemap, the RSS feed at `/feed.xml` and
`robots.txt` all read from, so a new entry propagates everywhere.

Numbers in a card or a share image are read out of the article, never invented:
the GEMM ladder on the sticker and the OG image is the `DATA` array in that
file.

## The route

`components/site/route.tsx` owns the blue dashed line and the plane that flies
it. The path lives in a `0 0 1440 <height>` viewBox stretched over the section,
so a waypoint always lands on the card it belongs to; the plane is sampled off
that same path (`getPointAtLength`, pre-sampled once) and positioned in
percentages, with its heading taken from the tangent so it banks into turns.
