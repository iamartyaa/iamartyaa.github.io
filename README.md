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
- [x] Home — hero, 3D desk (drag/hover/click objects), marquee, "what's on it", teasers, contact
- [x] /things — the dashed route with the plane flown by scroll, landings, sticker sheet
- [x] /about — the pilot, sticker pack, "where I've flown", how I work, say hi
- [x] Home — the portrait peels on hover; the trait stickers are draggable
      and throwable (drag momentum, tilt into the throw)
- [x] Page transitions — `app/template.tsx` flies the plane across on every
      route change while the new page settles in
- [x] Mobile pass — fluid gutters, wrapping nav, the desk refits itself to the
      canvas, the route plane is desktop-only; reduced motion respected throughout
- [x] Real content from the résumé
- [x] The drawer — only real things go on the sheet; the dashed circle at the
      end is the honest placeholder. Send me a title + year and I'll add one.
- [x] Open Graph card (`public/og.png`, drawn in the design system) + `app/icon.svg`
- [ ] Push to GitHub and turn Pages on — the two steps that need your login (below)

## The route

`components/site/route.tsx` owns the blue dashed line and the plane that flies
it. The path lives in a `0 0 1440 <height>` viewBox stretched over the section,
so a waypoint always lands on the card it belongs to; the plane is sampled off
that same path (`getPointAtLength`, pre-sampled once) and positioned in
percentages, with its heading taken from the tangent so it banks into turns.
