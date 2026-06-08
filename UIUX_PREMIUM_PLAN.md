# Corrado's — Premium UI/UX Elevation Plan

**Project:** `corrados_frontend` · React 19 + TypeScript + Vite + MUI 7 + Tailwind 4 + Framer Motion
**Brand:** Corrado's Restaurant & Bar — authentic Italian dining, Whitby ON (since 2010)
**Date:** June 2026
**Goal:** Take a well-built, animation-rich site and elevate it to a *fine-dining, premium hospitality* level of polish — coherent, fast, accessible, and unmistakably "Italian."

---

## 1. Executive Summary

The frontend is already **technically strong**: a thoughtful terracotta/olive/gold palette, a rich custom motion library (`MotionWrappers.tsx`), comprehensive SEO/JSON-LD, live data via WebSockets, and a confident bento-grid home page. This is a solid 7/10 build.

What separates it from a true *premium* experience is **coherence and restraint**, not more features. Five themes drive this plan:

| # | Theme | One-line diagnosis |
|---|-------|--------------------|
| 1 | **Typography mismatch** | 6 font families are downloaded; the theme renders *everything* in Inter — a tech sans-serif. An Italian fine-dining brand is using the wrong voice. **This is the single highest-impact fix.** |
| 2 | **Design-system drift** | Border radii (2 / 8 / 16 / 20 / 28 / 40px), font sizes (0.52–0.72rem magic values), button styles, and card patterns are reinvented per page. |
| 3 | **Motion without a budget** | Effects are gorgeous individually but unbudgeted collectively — performance cost, inconsistent easings, partial `prefers-reduced-motion` coverage, and a few "hidden" interactions. |
| 4 | **Accessibility & states** | Missing focus-visible styles, limited keyboard support for carousels, spinner-only loading (no skeletons), silent error catches, borderline contrast on dark sections. |
| 5 | **Performance hygiene** | 6 font families + many weights, unoptimized full-size imagery, no responsive `srcset`, no critical-asset preloading. |

The plan is sequenced so **Phase 0–1 (foundation)** produces the most visible "premium" jump for the least risk, before per-page refinement.

---

## 2. Brand & Art Direction North Star

Before touching code, lock the visual intent. Every decision below serves this:

> **"Warm, handcrafted Italian hospitality — confident but never loud. Editorial, like a beautiful menu you don't want to put down."**

Principles:
- **Serif headlines, clean sans body.** Display type carries the romance; body stays legible.
- **Generous whitespace.** Premium = breathing room, not density.
- **Photography is the hero.** Reduce chrome; let food/interior imagery dominate.
- **One accent moment per view.** Gold is a *garnish*, not a flood.
- **Motion that feels like fabric** — soft, weighted, intentional. Calm, not carnival.

---

## 3. Phase 0 — Design System Foundation *(highest ROI, ~3–5 days)*

This phase alone will make the site feel like a different tier. Everything is centralized in the MUI theme + Tailwind `@theme` so pages inherit it for free.

### 3.1 Typography overhaul *(the flagship change)*

**Current problem** — [`src/theme/theme.ts`](src/theme/theme.ts) sets `fontFamily: "'Inter', sans-serif"` for *all* variants including `h1`–`h6`, while [`index.html`](index.html) downloads **Playfair Display, Lato, Anton, Inter, Instrument Serif, and Barlow** — five of which are never used. Playfair Display (an elegant serif perfect for this brand) is loaded and ignored.

**Action — adopt a deliberate two-typeface system:**

| Role | Typeface | Usage |
|------|----------|-------|
| **Display / Headings** (`h1`–`h3`, hero titles, section titles) | **Playfair Display** (already loaded) — or upgrade to *Cormorant Garamond* / *Fraunces* for more character | Romantic, editorial, Italian-restaurant warmth |
| **Body / UI** (`body1/2`, buttons, nav, captions) | **Inter** (keep) | Clean, legible, modern |
| **Optional accent** | *Instrument Serif italic* for pull-quotes/taglines | Used sparingly for "voice" moments |

- Update theme `typography` so `h1`–`h4` use the serif; keep `body`, `button`, `subtitle2`, `overline` on Inter.
- **Delete Anton, Lato, Barlow, and (if unused) Instrument Serif** from `index.html` → fewer requests, faster LCP.
- Add `font-display: swap` (already present) and self-host the two retained families later (Phase 4) to remove the third-party round-trip.
- Establish a **type scale** (1.250 "major third" ratio) as theme tokens so per-page `fontSize: { xs: "1.75rem", md: "2.25rem" }` overrides disappear.

> **Why this matters most:** Typography is 90% of what the eye reads as "premium vs. template." Swapping Inter headings → a refined serif transforms perceived quality instantly, across every page, with one file change.

### 3.2 Radius, spacing, elevation & color tokens

- **Border radius:** Pick one system. Recommendation: a soft, warm `8px` base for cards/buttons and `16px` for feature tiles — replacing the current chaos of `2 / 8 / 16 / 20 / 28 / 40`. Set `shape.borderRadius` and expose `--radius-sm/md/lg` Tailwind tokens. (Current theme says `borderRadius: 2 // Sharp corners per requirements` but cards override to 16–40px everywhere — reconcile this with the client.)
- **Spacing scale:** Standardize section rhythm. Today sections use `py: { xs: 8, md: 10 }` *mostly* but inner gaps drift (`spacing={3}` vs `4`, `gap` magic numbers). Define `SECTION_PY`, `CONTENT_GAP` constants.
- **Elevation:** Three shadow tokens already exist in [`index.css`](src/index.css) (`--shadow-sm/md/lg`) but cards hardcode bespoke `box-shadow` strings. Route every card through the tokens (warm-tinted shadows, e.g. `rgba(45,41,38,…)` not pure black, for an expensive feel).
- **Semantic color tokens:** Add `success`, `error`, `warning`, `info` to the palette. Today errors reuse `palette.primary.main` (terracotta) — e.g. the resume-upload error state in [Contact.tsx](src/pages/Contact.tsx) and [NewsletterSignup.tsx](src/components/NewsletterSignup.tsx) — so users can't distinguish "error" from "brand." Fix the WS banner too ([MainLayout.tsx](src/layouts/MainLayout.tsx) hardcodes `#b45309`).

### 3.3 Motion design tokens & a "motion budget"

- Centralize **easing + duration tokens**: e.g. `EASE_OUT_EXPO = [0.16, 1, 0.3, 1]`, `EASE_SOFT`, durations `fast/base/slow`. These cubic-beziers are copy-pasted across `MotionWrappers`, `Home`, `Specials`, CSS — unify them.
- Define a **motion budget per viewport**: at most *one* hero/character animation + *one* scroll-reveal pattern visible at a time. The home page currently stacks `MouseMoveSpotlight` + `FadingVideo` + `ScrollZoom` + per-tile drift + sheen sweep + `TiltCard` + shatter portal simultaneously — beautiful but heavy. Audit and demote secondary effects.
- **Complete `prefers-reduced-motion` coverage.** Some components honor it (`ParallaxImage`, `CinematicReveal`); others don't (`WelcomeSplash`, `BlurText`, the marquees, Ken Burns). Add a single `useReducedMotion()` gate used everywhere.

### 3.4 Reusable primitives (kill the per-page reinvention)

Create a small set of canonical components so pages stop hand-rolling:
- `<Section>` — standard vertical rhythm + optional `tone="default|cream|charcoal"` background, replacing repeated `<Box sx={{ py… bgcolor… }}>`.
- `<ContentCard>` — the one card (image + body + hover) used by Menus/Events/Specials/Family/Party instead of 5 near-duplicates.
- `<Skeleton>` variants (card, text, hero) — see §4.
- `<Carousel>` — **one** accessible carousel engine. Today Specials, ToonHub, the home specials popup, and PosterBar each implement their own 3D/scroll carousel with different keyboard/touch behavior.

**Deliverable for Phase 0:** updated `theme.ts`, `palette.ts`, `index.css` tokens, slimmed `index.html` fonts, and 4–5 new primitives. No page rewrites yet — but the whole site visibly levels up.

---

## 4. Phase 1 — Interaction, States & Accessibility *(~4–6 days)*

A premium product feels premium *because nothing ever feels broken or unresponsive.*

### 4.1 Loading & empty states
- Replace spinner-only loads with **content-shaped skeletons**. [PageLoader.tsx](src/components/PageLoader.tsx) is a bare `CircularProgress`; card grids on Menus/Events/Gallery/Specials pop in abruptly. Build shimmer skeletons matching each card's geometry. (Family Meals already has a hand-rolled skeleton — generalize it.)
- **Elevate empty states** from plain text ("Our menus are being updated") to a small illustration/icon + friendly copy + a relevant CTA.
- **Image loading:** add blur-up/LQIP placeholders and consistent `onError` fallbacks (today fallbacks are inconsistent — Events has one default for all categories; Gallery uses fragile external mixkit URLs with no fallback).

### 4.2 Focus & keyboard
- Add a **global `:focus-visible`** ring (gold, 2px, offset) via `MuiCssBaseline` so every interactive element is keyboard-navigable. Most buttons/links currently lack focus styles.
- **Carousels need arrow-key + roving-tabindex support** (Specials, ToonHub, PosterBar, home popup). Several have "hidden" affordances — e.g. Specials requires clicking the left/right ghost cards with no visual cue. Add visible controls and `aria` roles.
- **Lightboxes/dialogs:** verify focus trap + restore + `Esc` (PosterBar does Esc; Gallery's lightbox focus management is unclear).

### 4.3 Contrast & semantics
- Audit text on dark sections (footer links `rgba(255,255,255,0.6)`, gold-on-charcoal stats in About) against **WCAG AA 4.5:1**; bump muted text to ≥0.7 alpha or darker grounds.
- Add `title` to the Google Maps iframe in [Contact.tsx](src/pages/Contact.tsx); use semantic lists for menu-item lists in Party/Family pages (currently `Box`+`Typography`).
- Mark required form fields visually (not just the native `*`), and add an `aria-live` region for form/file-upload errors.

### 4.4 Forms (Contact & Newsletter)
- Move to a **single validated form pattern**: inline field-level validation, real-time email check, disabled→loading→success micro-transitions, and **server-error-to-field mapping** (today 400/413/415 only surface as a generic toast).
- Standardize toast position/duration; ensure the success message can't show the wrong subject (state-timing bug noted in Contact).
- Increase touch targets: social icons (16px → ≥40px hit area) in Footer/PosterBar; tiny PDF-download buttons (0.62–0.72rem) on Party/Family pages.

---

## 5. Phase 2 — Page-by-Page Refinement *(~6–9 days)*

Apply the new system per page. Priorities ranked by traffic/impact.

### Home ([Home.tsx](src/pages/Home.tsx), 2,200+ lines)
- **Split the file** into section components (`HeroBento`, `StoryTeaser`, `MenuPreview`, `SpecialsPreview`, `FamilyHighlight`, `EventsTeaser`) — currently a monolith, hard to maintain.
- **Trim the simultaneous effects** per the motion budget; keep the bento grid as the signature moment, calm the rest.
- Serif headings will dramatically lift the Story/teaser sections.
- Re-evaluate the auto-opening **specials popup** (700ms after load) — premium sites rarely interrupt immediately; consider a subtle docked badge instead, or delay/scope it.

### Menus ([Menus.tsx](src/pages/Menus.tsx))
- Unify category pills (currently MUI `Chip` *and* custom `<button>` mixed) with `aria-selected`.
- Card skeletons; disable 3D tilt on touch; PDF-thumbnail placeholders polished.

### Specials ([Specials.tsx](src/pages/Specials.tsx)) & ToonHub ([ToonHub.tsx](src/pages/ToonHub.tsx))
- Replace bespoke 3D carousels with the shared accessible `<Carousel>`; add visible controls, keyboard nav, and dot indicators with labels.
- Move grain-overlay SVG data-URIs into a reusable CSS utility class.
- ToonHub's "DISCOVER IT" links to `#` — wire it up or remove.

### Gallery ([Gallery.tsx](src/pages/Gallery.tsx), 1,130 lines)
- **Remove inline mock data and external mixkit video URLs** before launch; make fully data-driven with fallbacks.
- Cap/clean the marquee triple-duplication; ensure the masonry + sticky-stack layout degrades gracefully on resize/mobile.
- Descriptive `alt` text (not just category name); arrow-key navigation in lightbox.

### Contact ([Contact.tsx](src/pages/Contact.tsx), 791 lines)
- Refactor the nested resume-upload Box into a clean `<FileUpload>` component; mobile-optimize the 3-column field groups.

### About / GiftCards / Family Meals / Party Menus / Events
- Route through `<Section>` + `<ContentCard>`; normalize gradient overlays (each page hand-rolls its own); fix granular font sizes; make the GiftCard mockup and "By the Numbers" stats reusable, animated-on-scroll components.

### NotFound ([NotFound.tsx](src/pages/NotFound.tsx))
- Currently spartan. Give it brand personality — a warm illustration, the serif headline, and the three CTAs styled as primary/secondary consistently.

### WelcomeSplash ([WelcomeSplash.tsx](src/components/WelcomeSplash.tsx))
- Honor reduced-motion; make the 1900/2450ms timing configurable; ensure it never blocks LCP on slow connections (skip if assets cached).

---

## 6. Phase 3 — Performance & Polish *(~3–4 days)*

- **Fonts:** drop to 2 families (Phase 0); self-host via `@fontsource` or local files to cut a render-blocking third-party request; subset to needed weights.
- **Images:** generate responsive `srcset`/`sizes`, serve WebP/AVIF, add `width`/`height` to prevent CLS, lazy-load below the fold (partially done), and **preload the home hero/LCP image** specifically (today only one generic image is preloaded).
- **Video:** the home/family-meal background videos stream from `assets.mixkit.co` — host locally or lazy-mount; add `poster` frames and load failure handling ([FadingVideo.tsx](src/components/FadingVideo.tsx) has none).
- **Code-split heavy effects:** `ShatterPortalOverlay` (~340 lines) and other large motion components should be lazy/dynamic so they don't bloat initial JS.
- **Lighthouse target:** Performance ≥ 90, Accessibility ≥ 95, Best-Practices ≥ 95, SEO ≥ 100 on mobile.
- **Re-enable scrollbars thoughtfully:** global CSS hides *all* scrollbars (`scrollbar-width: none` everywhere) — fine aesthetically, but ensure long content (mobile menus, dialogs) still communicates scrollability.

---

## 7. Phase 4 — Validation & Handoff *(~2–3 days)*

- **Cross-device QA:** iOS Safari, Android Chrome, desktop Safari/Chrome/Firefox; 320px → 1920px.
- **Accessibility audit:** axe DevTools + manual keyboard + VoiceOver/NVDA pass; reduced-motion pass.
- **Design QA checklist** (below) signed off per page.
- **Living style guide / Storybook** (optional but recommended): document the tokens and primitives so future work stays consistent.
- Update [README.md](README.md) (currently the default Vite template) with the design-system conventions.

---

## 8. Prioritized Backlog (do-this-first order)

| Pri | Item | Effort | Impact |
|-----|------|--------|--------|
| 🔴 P0 | Serif display typography + remove 4 unused fonts | S | ★★★★★ |
| 🔴 P0 | Radius/spacing/shadow/easing tokens unified | M | ★★★★☆ |
| 🔴 P0 | Semantic color tokens (error≠brand) | S | ★★★☆☆ |
| 🟠 P1 | Global `:focus-visible` + keyboard carousels | M | ★★★★☆ |
| 🟠 P1 | Skeleton loading + richer empty states | M | ★★★★☆ |
| 🟠 P1 | Form validation + server-error mapping | M | ★★★☆☆ |
| 🟡 P2 | Shared `<Section>`/`<ContentCard>`/`<Carousel>` | L | ★★★★☆ |
| 🟡 P2 | Home file split + motion-budget trim | L | ★★★☆☆ |
| 🟡 P2 | Remove Gallery mock/external data | M | ★★★☆☆ |
| 🟢 P3 | Image `srcset`/WebP + LCP preload | M | ★★★★☆ |
| 🟢 P3 | Self-host fonts, code-split heavy motion | M | ★★★☆☆ |
| 🟢 P3 | NotFound + WelcomeSplash polish | S | ★★☆☆☆ |

**Total estimate:** ~18–27 focused engineering days (one developer), front-loaded so the "premium" perception lands in week one.

---

## 9. Design QA Checklist (per page)

- [ ] Headings use the display serif; body uses Inter; no per-page `fontSize` overrides
- [ ] One radius system; warm-tinted shadows from tokens
- [ ] Section vertical rhythm consistent (`SECTION_PY`)
- [ ] Every interactive element has hover **and** `:focus-visible`
- [ ] Loading = skeleton; empty = illustrated; error = clear + recoverable
- [ ] Keyboard + screen-reader navigable; AA contrast verified
- [ ] `prefers-reduced-motion` respected
- [ ] Images sized (no CLS), responsive, lazy below fold
- [ ] Touch targets ≥ 44×44px
- [ ] No mock/placeholder/external-CDN data in production paths

---

## 10. What We're *Keeping* (don't break these)

The build has real strengths worth protecting:
- The **terracotta/olive/gold palette** and warm-ivory ground — excellent, on-brand.
- The **bento-grid home** concept — a strong signature; just calm the surrounding effects.
- The **motion library quality** — easings and craft are genuinely good; the fix is *governance*, not removal.
- **SEO/JSON-LD depth**, **live WebSocket updates**, and the **MUI+Tailwind** foundation — all solid.

> The mandate is **elevation, not reinvention**: a confident edit toward restraint, coherence, and that unmistakable Italian-hospitality warmth.
