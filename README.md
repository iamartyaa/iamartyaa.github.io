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
| Home, the keyboard | a wave of keycaps depresses and the monitor types a line |
| Home, the cat | hops between three spots on the desk, and says so |
| Home, the lamp chain | pulls night mode on and off; the wipe starts at the lamp |
| Home, the portrait | peel it off, drop it anywhere in the band, double-click to put it back |
| Home, the trait stickers | pick up and throw (drag momentum) |
| /things, the filters | really filter, and the dashed line is re-generated through what's left |
| /things, scrolling | a mouse runs the line pinned to the middle of the screen; the cat chases it, never catches it, and loses it behind the drawer |
| /about, the portrait | eyes track the cursor; waves, stretches and drinks chai on its own clock; poke it for one on demand |
| /about, the cat and mug | pupils track the pointer; click for a hop or a sip |
| /about, the timeline | a figure walks it and changes costume at every stop |
| /about, the guestbook | press the stamp for the real visitor count |
| Anywhere but Home | the cord: drag it down or click it |

## Analytics

GoatCounter (`lib/analytics.ts`), cookieless and storing nothing personal —
which is why there is no consent banner anywhere on the site. The script goes
on every page including the standalone article; the guestbook on /about reads
the public `TOTAL.json` back. If the count can't be read the stamp still works
and claims no number rather than showing a zero.

## Accessibility notes

- Accents have text twins (`--orange-ink` and friends). The fills measure
  1.6:1 (yellow) to 4.1:1 (blue) at label size, so anything set in an accent
  uses the twin.
- Large inverted panels use `--panel`, which stays dark in both themes. An ink
  sticker flipping to paper is right at 40px and a floodlight at 400px.
- `:focus-visible` is the route's blue at 3px with an offset, because the
  browser default vanishes inside a sticker's 5px paper ring.
- Known gap: the 3D desk's hotspots are not in the tab order. Every
  destination they open is also a text link in the nav and in "What's on it",
  so nothing is only reachable by pointer — but the objects themselves are
  mouse-only.

## The route

`components/site/route.tsx` owns the blue dashed line and the plane that flies
it. The path lives in a `0 0 1440 <height>` viewBox stretched over the section,
so a waypoint always lands on the card it belongs to; the plane is sampled off
that same path (`getPointAtLength`, pre-sampled once) and positioned in
percentages, with its heading taken from the tangent so it banks into turns.
