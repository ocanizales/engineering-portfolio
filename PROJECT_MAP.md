# PROJECT_MAP.md — engineering-portfolio

_Hand-maintained (project is 3 source files)._

```
engineering-portfolio/
├── index.html                 # Full HTML doc. <head> loads Google Fonts.
│                              # Sections in order:
│                              #   topbar → .intro → #experience (2 tracks)
│                              #   → #projects → #about → #contact → footer
├── assets/
│   ├── css/styles.css         # Tokens (:root) + editorial gray theme.
│   │                          #   Blocks: TOPBAR, INTRO, SECTION/reveal,
│   │                          #   EXPERIENCE(year lists), PROJECTS(rows),
│   │                          #   ABOUT/SKILLS, CONTACT, RESPONSIVE, RM.
│   └── js/main.js             # One IIFE:
│                              #   1 topbar scroll-state / burger / scroll-spy
│                              #   2 [data-reveal] IntersectionObserver
│                              #   3 makeAccordion() — reused for experience
│                              #     rows AND project rows
│                              #   4 skill<->project cross-highlight
│                              #   5 footer year
├── README.md · CLAUDE.md · HANDOFF.md · PROJECT_MAP.md
```

## Fonts (Google Fonts, via <link> in index.html)
Geist (headings + prose) · Geist Mono (all metadata). No serif, no cursive.
Technical spec-sheet look: dark slate #232528, dot grid, numeric indices,
monochrome (`--accent` = `--ink`).

## Projects
8 cards in 2 `.pgroup` blocks: Systems & software (01–05) and Digital marketing
& web (06–08). `data-project` ids 1–8 match `#proj-N`. CRM (04) carries a
`.status` "In progress" pill.

## Key selectors (JS ↔ CSS ↔ HTML contract)
- `[data-reveal]`                         — scroll reveal (`.is-in`)
- `.yrow[data-exp]` / `.yrow__btn` / `.yrow__detail`  — expandable experience rows (`.is-open`)
- `.project` / `.project__head` / `.project__detail`  — expandable project rows (`.is-open`)
- `.skill[data-projects]` ↔ `.pchip[data-project]` ↔ `.project[data-project]`  — cross-highlight
- `.topbar` (`.is-scrolled`), `#burger`, `.topbar__nav.is-open`
```
