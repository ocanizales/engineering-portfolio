# HANDOFF.md — engineering-portfolio

_Last updated: 2026-07-31_

## Status
**v5 — content refresh + interactive layer, Imperial Family Law removed.
Browser-verified, 64/64 checks.**

## v5 (2026-07-31) — new work, and an interactive layer
User asked to "update my portfolio with relevant projects / achievements" and
make it "more creative and interactive". The site had drifted ~2 weeks behind
the actual work.

**Content.** Projects went 8 → 13, regrouped into three blocks. New cards, all
sourced from the repos themselves rather than memory:
- **01 seo-ops** (flagship, `.project--flag`) — the nightly SEO engine, its
  five-check gate, and the **4 gate-passed changes it shipped unattended** to
  segundaitzel.mx. Verified from `sites/segundaitzel.mx/changelog.csv`.
- **02 apex-trader** — 10 strategies, the optimizer, and the committee memory
  loop. `+0.72R / PF 2.55` verified in `docs/statarb_research.md:108`.
- **03 Constrained decoding** — the 0/4 → 4/4 JSON-schema result on llama3.2:3b.
- **04 graphify**, **05 Leadscout**, **06 VPS fleet**, **07 music pipeline**,
  **08 video pipeline**, **09 client intake** (the old "CRM — In progress" card,
  now honestly reframed around what actually ships), **10 segundaitzel.mx**.
- 11–12 are the old RADCO / UI-UX cards, renumbered. (Imperial Family Law was
  removed later the same day at the user's request — see below.)
- New **metrics band** under the intro. Numbers are counted, not estimated —
  16 repos, 303 commits, 662 test functions, 4 unattended changes, SEO 100, 3.8×.
- New experience row: independent web & systems work (2025–).
- Stack section: 5 groups → 6, added AI/LLM and Quantitative.

**Interactive layer** (all vanilla, still no build step):
command palette (`⌘K`/`/`), keyboard map (`?`), `j`/`k`/`e`/`f`/`g`+letter
shortcuts, project filters, an SVG fleet map generated from a data structure,
metric count-up, scroll-progress hairline, pointer-tracked grid light,
copy-to-clipboard on contacts, deep links that open the row they point at.

**Verified in headless Chromium**, 48/48 assertions: filters (every visible row
carries the tag, for all 5 categories), palette ranking and empty states,
accordion + aria-expanded, all keyboard paths, fleet tracing (6 lit edges on
seo-ops, both directions in the readout), skill pinning, deep links, zero runtime
errors. Overflow audited at 360/390/414/768/820/1024/1440px.

### Bugs found and fixed during verification
- **Filter taxonomy was wrong.** Hand-written counts didn't match `data-cat`,
  and "autonomous" tagged 9 of 13 rows, which narrows nothing. Recut to
  web 7 / ai 6 / automation 6 / infra 4 / trading 2.
- **Palette ranked a skill chip above the project.** Scoring ran subsequence
  matching over the whole description, so long entries were penalised by length
  and "seo" surfaced "SEO optimization" over "seo-ops". Now: subsequence on the
  label only, substring on the body, per-kind boost. Subsequence over long body
  text also made junk like `walkforward` match everything.
- **5px horizontal overflow at 360px** from `.ln { white-space: nowrap }` — fine
  for the old short link text, not for the new intro's longer phrases. The rule
  is gone and the underline is `text-decoration` now, because the old absolute
  `::after` would only underline the first line box of a wrapped link.
- **Filter double-click race** — a stale 400ms timer could land `hidden` on a row
  that had since been re-shown. Timer is now per-element and cleared.

### Gotchas for the next session
- `--virtual-time-budget` **does not advance CSS transitions**. Screenshots come
  out mid-fade and `getComputedStyle` reports `opacity: 0` on revealed elements.
  Use `--force-prefers-reduced-motion` for visual checks. This cost a debugging
  detour — the page was fine, the capture wasn't.
- Filter counts in the HTML are hand-maintained; recount when categories change.
- The metrics band is résumé-grade content. Recount from the repos before editing.

## 2026-07-31 (later) — Imperial Family Law removed
User: "remove imperial law website from the portfolio as a whole." Card 12 was
excised, the UI/UX card renumbered 13 -> 12, its `.pchip` dropped and the UI/UX
chip renumbered, and every `data-projects` mapping remapped (12 dropped, 13 -> 12).
Filter counts updated: all 13 -> 12, web 7 -> 6. The demos section's
"prototyped in Figma (project [13])" cross-reference now points at [12].

Skills that lost their only other referent: **WordPress** now maps to RADCO alone,
**Lead generation** to Leadscout alone. Both still map to something, so no chip is
orphaned - worth rechecking if RADCO ever goes too.

Careful: `index.html` still contains "Imperial CA" in the Sun Dental demo card.
That is the city in California, not the law firm. Leave it.

Re-verified: **64/64**. The harness gained checks that would have caught this
class of mistake earlier: every filter's *printed* count is now asserted against
the live row count, no `.pchip` or `.skill` may point at a missing `#proj-N`, and
"Imperial" must be absent everywhere except the Sun Dental city.

## (v4 + demo gallery retained below)

## Status at v4
**v4 + client demo gallery. Screenshot-verified.**

## Demo gallery (2026-07-16)
New `03 / DEMOS` section between PROJECTS and STACK (STACK→04, CONTACT→05);
"Demos" nav link + scroll-spy id added. 9 live demo builds from the private
`ocanizales/demo-sites` repo now ship under `demos/<slug>/` as pre-built Vite
static bundles (`--base=./`), thumbnails in `assets/img/demos/*.webp`
(1200×750, headless-chromium captures). The portfolio itself remains
no-build; to update a demo, rebuild in demo-sites and re-copy its `dist/`.

Gallery facts worth knowing:
- Card [01] **Crane HIFI Bar** is a full-width feature (`.demo--wide`,
  2:1 thumb) — the coded build of the Figma prototype linked in project
  card 08. In demo-sites it's a component *kit* (lib-mode vite config);
  the servable demo builds with its separate `vite.config.demo.ts`.
- The other 8 folders are **6 brands** — two briefs have A/B concept pairs,
  shown side-by-side: Sun Dental (sun-dental-office = A,
  local-dentist-business = B) and Colchones Segunda Itzel
  (colchones-segunda-itzel = A, bilingual-landing-page = B). Card copy says
  "second concept" honestly.
- `fitness-page` is **Boulevard Fitness**; `purple-fitness-page` is **Prime
  Fitness** (different gyms, different designs).
- Demo SPAs use react-router **memory routers** (fitness-page was converted
  from browser router — it 404'd under a subpath), so they work at any path.
- CSS gotcha hit + fixed: `.demo__shot` needed `height: auto` — the img
  `height` attribute otherwise defeats `aspect-ratio: 16/10`.

## (v4 changes retained)

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
- ~~Confirm real LinkedIn URL~~ — confirmed by the user 2026-07-31:
  `https://www.linkedin.com/in/oscarcanizales/` (no hyphen). Was a guess until then.
- When the CRM is actually built, flip 04 from "In progress"/Goals to Results.
- Deploy (static). Not yet a git repo / not pushed to `ocanizales/engineering-portfolio`.

---

## Change: graphify + the 3B-model card removed (2026-07-31, later session)
User: *"change the search to ctrl+k, and do not include: graphify and the 3b model."*

- **Cards 03 (Constrained Decoding on a 3B Model) and 04 (graphify) deleted.**
  05–12 renumbered down to **03–10**; ids, `data-project`, `aria-controls`,
  `#proj-N` anchors, `.project__no`, contact chips, and the two `(project [NN])`
  cross-refs in the demos section all moved with them.
- Filter counts recut from `data-cat`: all 10 · web 6 · ai 4 · automation 6 ·
  infra 3 · trading 1.
- Skill chips remapped; **"Constrained decoding"** and **"Knowledge graphs"**
  dropped (both pointed only at removed cards).
- Fleet map: `graph` node and its 3 soft edges removed from `FLEET` in
  `main.js`; the `ollama` node's sub is now `Ollama · CPU-only` (was
  `llama3.2:3b`). Fallback list lost its `· graphify`.
- Metrics band tile 6 was graphify's `3.8× less context` → now **9 demo sites
  built end to end** (keeps the 6-column grid, which the 3/2-col breakpoints
  divide evenly).
- Intro sentence lost its "knowledge graph over my own codebases" clause →
  now links Leadscout. VPS-fleet card no longer lists "graph rebuilds".
- **Search keycaps now read `Ctrl K`** in the topbar, the metrics note, and the
  `?` overlay (the overlay row collapsed from `⌘K / Ctrl K / /` to `Ctrl K / /`).
  `main.js` still fires on `metaKey || ctrlKey`, so ⌘K keeps working on macOS —
  it just isn't advertised.

**Verified in headless Chromium** against the live :8901 server: zero page
errors, 17 fleet nodes render, Ctrl+K opens the palette, searching *graphify*
and *3B* both return "Nothing matches that.", 10 project rows, AI filter shows
4. Static checks: no dangling `href="#…"` / `aria-controls`, no duplicate ids,
every `.filter__n` matches its `data-cat` tally, every skill chip points at a
live project.
