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
- `index.html` — intro → experience (2 year-list tracks) → projects (2 groups:
  "Systems & software" 01–05, "Digital marketing & web" 06–08; 8 expandable
  cards) → about/skills (5 groups incl. Digital marketing & web) → contact.
  Certs folded into the experience "Learning" track (no carousel).
- `assets/css/styles.css` — token-driven; dark neutral-gray monochrome theme.
- `assets/js/main.js` — one IIFE: nav scroll-state/spy/burger, reveals, a shared
  accordion (experience rows + project rows), skill↔project highlight, year.

## Content facts (keep accurate)
- **Prime Networks role is PAST** (2023–25, "was"). Oscar is no longer active there.
- IEEE role = **Project Space Officer** (never "Super Computing Chair").
- Client CRM (project 04) is **not built yet** — labeled "In progress", results
  framed as goals. Don't claim it ships anything.
- Live client sites: radco.construction, imperialfamilylaw.com.

## Source of truth for content
Two resumes: `..job_docs/oscar_canizales_engineering_resume.pdf` (primary) and
`Downloads/Oscar_Canizales_Digital_Marketing_Resume.pdf`. Project details also
draw on the user's other repos (polymarket-bot, apex-trader, homelab).
