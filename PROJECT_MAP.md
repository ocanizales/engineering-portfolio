# PROJECT_MAP.md — engineering-portfolio

_Hand-maintained (project is 3 source files)._

```
engineering-portfolio/
├── index.html                 # Full HTML doc. <head> loads Google Fonts.
│                              # Sections in order:
│                              #   topbar → .intro (+ .metrics band)
│                              #   → 01 #experience (2 tracks)
│                              #   → 02 #projects (.filters + 3 .pgroup)
│                              #   → 03 #systems (SVG fleet map + readout)
│                              #   → 04 #demos → 05 #about → 06 #contact
│                              # End of <body>: #palette, #keys, #toast
├── assets/
│   ├── css/styles.css         # Tokens (:root) + editorial gray theme.
│   │                          #   Blocks: TOPBAR, INTRO, METRICS,
│   │                          #   SECTION/reveal, EXPERIENCE(year lists),
│   │                          #   FILTERS, PROJECTS(rows), FLEET(svg),
│   │                          #   DEMOS(gallery), ABOUT/SKILLS, CONTACT,
│   │                          #   PALETTE/KEYS/TOAST, RESPONSIVE, RM.
│   ├── img/demos/*.webp       # Gallery thumbnails (1200×750, one per demo)
│   └── js/main.js             # One IIFE, ten numbered blocks:
│                              #   1 topbar scroll-state / burger / spy /
│                              #     scroll-progress hairline
│                              #   2 [data-reveal] IntersectionObserver
│                              #   3 makeAccordion() — returns an API (open,
│                              #     openAll, closeAll, toggle) because the
│                              #     keyboard layer and palette drive it too
│                              #   4 skill<->project highlight + click-to-pin
│                              #   5 metric count-up (once, on first view)
│                              #   6 project filters (inline heights; CSS
│                              #     can't transition from `none` to `0`)
│                              #   7 fleet map — built from the FLEET object
│                              #   8 command palette (index read from DOM)
│                              #   9 keyboard shortcuts + ? overlay
│                              #  10 clipboard, pointer light, deep links, year
├── demos/<slug>/              # 8 PRE-BUILT static bundles (React+Vite dist
│                              # output, built with --base=./ in the
│                              # ocanizales/demo-sites repo — NOT built here;
│                              # this repo stays no-build. Rebuild there,
│                              # re-copy dist/ to update.)
├── README.md · CLAUDE.md · HANDOFF.md · PROJECT_MAP.md
```

## Fonts (Google Fonts, via <link> in index.html)
Geist (headings + prose) · Geist Mono (all metadata). No serif, no cursive.
Technical spec-sheet look: dark slate #232528, dot grid, numeric indices,
monochrome (`--accent` = `--ink`).

## Projects
10 cards in 3 `.pgroup` blocks: Autonomous systems & AI (01–03), Infrastructure
& automation (04–07), Digital marketing & web (08–10). `data-project` ids 1–10
match `#proj-N`. Card 01 is the flagship (`.project--flag`, left hairline).
Shipping projects carry a `.status--live` pill (pulse dot).

`data-cat` drives the filter bar — web 6 · ai 4 · automation 6 · infra 3 ·
trading 1. **The counts printed in `.filter__n` are hand-written: recount when
you retag anything.**

## Key selectors (JS ↔ CSS ↔ HTML contract)
- `[data-reveal]`                         — scroll reveal (`.is-in`)
- `.yrow[data-exp]` / `.yrow__btn` / `.yrow__detail`  — expandable experience rows (`.is-open`)
- `.project` / `.project__head` / `.project__detail`  — expandable project rows (`.is-open`)
- `.project[data-cat]` ↔ `.filter[data-filter]`       — filtering (`.is-filtered`, `.is-sizing`, `hidden`)
- `.skill[data-projects]` ↔ `.pchip[data-project]` ↔ `.project[data-project]`  — cross-highlight
- `.metric__num[data-count]` (+ optional `data-suffix`) — count-up target
- `#fleet` → generated `svg` with `.fnode[data-id]` / `.fedge` (`.is-on`, `.is-near`, `.is-lit`, svg `.is-tracing`)
- `#palette` / `#palette-input` / `#palette-list`, `#keys`, `#toast`
- `.contact__links a[data-copy]`          — JS wraps these and appends `.copybtn`
- `.topbar` (`.is-scrolled`), `#burger`, `.topbar__nav.is-open`, `#progress`
```
