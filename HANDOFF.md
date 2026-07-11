# HANDOFF.md — engineering-portfolio

_Last updated: 2026-07-09_

## Status
**v4 — "more tech oriented" reskin. DOM-verified.** No console errors.

## v4 changes (latest)
User: "make the design more tech oriented" (+ ran `/web-stack`, which confirmed:
keep the simple static stack — no framework needed). Kept dark-gray + monochrome,
shifted the *look* to a technical spec-sheet:
- **Type:** dropped Instrument Serif. Now **Geist** (headings + prose) + **Geist
  Mono** (all metadata: kickers, labels, years, stack, skills, nav, footer).
- **Motifs:** graph-paper **dot-grid** background; numeric section indices
  (`01 / EXPERIENCE`…`04 / CONTACT`, `.section__kick`); `[NN]` project numbers;
  `stack:` prefix on stack lines; `~/` prefix on the nav name; `//` bullets;
  sharp 3px radii; slate `#232528` bg.
- Monochrome held; `--accent` var = `--ink` (single knob to add a hue later).
- Screenshots unavailable this session (browser-pane capture hung); verified via
  DOM/JS instead — fonts loaded, kickers present, accordions + skill highlight OK.

## (v3 changes retained — content)

## v2 → v3 changes (this session)
Per user: renamed the VOD scraper, added projects, moved Prime Networks to past,
de-accented the "resume", removed the cursive font, went darker gray, kept it simple.
Built with a **background Workflow** (10 parallel agents: 8 project cards +
skills group + design spec — the "use subagents" ask).

- **Theme:** dark neutral gray `#2c2c2c`, ink `#e8e8e8`, ink-2 `#b2b2b2`,
  faint `#8d8d8d` (all R=G=B, contrast-validated AA). **Monochrome** — every
  color accent (rust/olive/blue) removed. State shows via brightness + underline.
- **Cursive removed:** dropped Homemade Apple from the font `<link>` and deleted
  every handwritten aside / signature. Fonts now = Instrument Serif + Geist.
- **Projects → 8 cards in 2 groups:**
  - Systems & software: 01 Trading Bots, 02 Self-Hosted Infra, 03 **Leadscout**,
    04 **Client CRM** (In progress — goals not results), 05 **Automated Video
    Curation & Publishing Pipeline** (renamed from "LoL VOD Scraper").
  - Digital marketing & web: 06 **RADCO Construction** (radco.construction),
    07 **Imperial Family Law — CMS** (imperialfamilylaw.com), 08 **UI/UX
    Prototypes** (Inter-Amity, Crane HIFI Bar).
- **Prime Networks now past:** intro reworded ("Before that I ran…"); experience
  row = 2023–25, bullets past tense.
- **Skills:** remapped all `data-projects` to the new ids; added a **Digital
  marketing & web** group (SEO, lead gen, market research, analytics, WordPress,
  HTML/CSS, Figma/UI-UX, design systems) + JavaScript + FastAPI. 8 project chips.

## Verified working (Claude Preview, 2026-07-09)
- bg = rgb(44,44,44); 8 projects; 2 group labels; no "VOD Scraper"/"LoL" text;
  no Homemade font requested; CRM shows "In progress" pill + "Goals" header.
- Skill→project highlight on new ids (WordPress lit chips 6 & 7, linked proj 6/7).
- Project + experience accordions expand/collapse. No console errors.

## Gotchas
- Preview panel ~730px → stacked layout only. Two-column tracks/about need >820px.
- Workflow output archived at the run's transcript dir; card copy is in
  `index.html` now (source of truth).

## Next / possible follow-ups (not started)
- Real diagrams for the 8 `.ph` placeholders.
- Confirm real LinkedIn URL (currently `/in/oscar-canizales`, a guess).
- When the CRM is actually built, flip 04 from "In progress"/Goals to Results.
- Deploy (static). Not yet a git repo / not pushed to `ocanizales/engineering-portfolio`.
