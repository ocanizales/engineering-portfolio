# CLAUDE.md — engineering-portfolio

## What this is
Oscar Canizales' personal portfolio — a single-page site.
Design (v4): **technical / spec-sheet aesthetic**, first-person. **Dark
neutral-slate** `#232528`, **monochrome**. **Geist** for headings + prose,
**Geist Mono** for ALL metadata (kickers, labels, years, stack, skills, nav,
footer). Graph-paper dot-grid background, numeric section indices (`01 /
EXPERIENCE`), `[NN]` project numbers, `stack:` / `~/` mono affordances, sharp
3px radii. Focus: Computer Systems, cloud infrastructure, web & digital.

> History: v1 dark-terminal/blueprint → "too AI-looking" → v2 warm gray editorial
> (Instrument Serif) → v3 dark-gray monochrome, cursive removed → v4 (2026-07-09)
> "more tech oriented": Geist + Geist Mono, dot grid, numeric indices. The tech
> feel comes from MONO TYPE + GRID + SPEC-SHEET STRUCTURE, deliberately NOT from
> neon/terminal-green tropes (which the user rejected as AI-looking in v1). Still
> monochrome — `--accent` var exists as a single knob if a hue is ever wanted.

## How to run / test
- No build step. Open `index.html` directly, or:
  `py -3.11 -m http.server 8901` (preview config: `engineering-portfolio` in
  `../.claude/launch.json`, port **8901**).
- Nothing to compile, no package manager, no tests harness.

## Hard rules
- **No frameworks / no build step.** Hand-written HTML/CSS/JS only.
- **One external dependency:** Google Fonts (**Geist + Geist Mono**) via `<link>`
  in `index.html`. System fallbacks declared. No serif, no cursive.
- **No stock/filler imagery.** Visual slots are labeled, hatched placeholder
  boxes (`.ph`) — swap for real diagrams, never for stock photos.
- All animation stays `transform`/`opacity`/`max-height` and honors
  `prefers-reduced-motion`. Keep motion subtle — no flashy/AI-looking effects.
- Content is resume-accurate. IEEE role is **Project Space Officer** — do NOT
  label it "Super Computing Chair".

## Architecture (see PROJECT_MAP.md)
- `index.html` — intro (+ metrics band) → 01 experience (2 year-list tracks)
  → 02 projects (filter bar + 3 groups: "Autonomous systems & AI" 01–05,
  "Infrastructure & automation" 06–09, "Digital marketing & web" 10–12;
  12 expandable cards) → 03 systems (SVG fleet map) → 04 demos → 05 stack
  (6 skill groups) → 06 contact. Certs stay in the experience "Learning" track.
  Palette, shortcut overlay, and toast live at the end of `<body>`.
- `assets/css/styles.css` — token-driven; dark neutral-gray monochrome theme.
- `assets/js/main.js` — one IIFE, ten numbered blocks (see its header comment).

## The interactive layer (added 2026-07-31)
Everything here is **progressive** — with JS off the page is still a complete,
readable document. Do not add interactivity that gates content.
- **Command palette** — `⌘K` / `Ctrl K` / `/`. The index is read out of the DOM
  in `buildIndex()`, so it can never drift from the page. Ranking: subsequence
  match on the **label only**, substring on the body, plus a per-kind boost.
  Subsequence over long body text matches nearly everything — don't reintroduce it.
- **Keyboard map** — `?`. `j`/`k` cursor, `e` expand-all, `f` cycle filter,
  `g`+letter jumps, `esc` closes.
- **Project filters** — `data-cat` on each `.project`. The counts in the filter
  bar are hand-written; **update them when categories change** (there's no test
  harness in this repo to catch drift).
- **Fleet map** — built by `buildFleet()` from the `FLEET` object (nodes, edges,
  3 columns). Edit the data, not the SVG. The HTML holds a text fallback that JS
  replaces. Node boxes are 170×40 in a 760-wide viewBox; the container scrolls
  horizontally below 660px rather than letting the page overflow.
- **Metric count-up** — final values are already in the HTML; JS only animates
  toward them. Reduced motion and no-JS both just read the number.

## Content facts (keep accurate)
- **Prime Networks role is PAST** (2023–25, "was"). Oscar is no longer active there.
- IEEE role = **Project Space Officer** (never "Super Computing Chair").
- The metrics band is **counted, not estimated** — 16 repos / 303 commits /
  662 test functions across `~/apps`, 4 gate-passed autonomous changes, Lighthouse
  SEO 100. If you restate them, recount first; a stale number here is a lie on a
  résumé.
- **seo-ops (project 01) genuinely ships to a live client site.** Four changes,
  4/4 gate-passed. Don't inflate that number and don't soften it either.
- The old "Client CRM — In progress" card is now **09 Client Intake & Proposal
  Pipeline**, and it *does* ship: `engine.intake` + `engine.quote` + the
  dashboard `/intake` page. Deal-stage tracking still isn't built — don't claim it.
- apex-trader and polymarket-bot are **paper only**. Never imply live capital.
- Live client sites: segundaitzel.mx, radco.construction.
- **Imperial Family Law was removed at the user's request (2026-07-31).** Do not
  reintroduce it, and do not cite imperialfamilylaw.com anywhere.

## Source of truth for content
Two resumes: `..job_docs/oscar_canizales_engineering_resume.pdf` (primary) and
`Downloads/Oscar_Canizales_Digital_Marketing_Resume.pdf`. Project details also
draw on the user's other repos (polymarket-bot, apex-trader, homelab).
