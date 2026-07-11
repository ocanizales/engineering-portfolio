# Oscar Canizales — Portfolio

A first-person single-page portfolio with a **technical / spec-sheet** aesthetic.
**Dark slate** theme, **Geist** for headings + prose, **Geist Mono** for all
metadata. **Monochrome** — no color accents, no cursive. Graph-paper dot grid,
numeric section indices, `[NN]` project numbers — handcrafted, deliberately
*not* a corporate/AI template.

**Stack:** hand-written HTML + CSS + vanilla JS. No framework, no build step.
One external dependency — Google Fonts.

## Run it

Open `index.html`, or serve the folder:

```bash
py -3.11 -m http.server 8901
# → http://localhost:8901
```

## Sections

1. **Intro** — big serif name + a first-person paragraph with monochrome inline
   links.
2. **Experience** — two year-list "tracks": **Work** (expandable rows with the
   detail bullets) and **Learning & certifications** (education + certs +
   continuous learning).
3. **Projects** — 8 editorial expandable rows in two groups (Systems & software,
   Digital marketing & web); each opens to Problem / Approach / Results, a labeled
   placeholder box, and the stack. One card is marked "In progress".
4. **About / skills** — skills grouped by domain (incl. Digital marketing & web);
   hovering a skill lights up the projects it powers (chips cross-highlight back).
5. **Contact** — "Work with me." with email / phone / LinkedIn.

## Design notes

- Single **dark slate** theme (`#232528` bg, `#e9eaec` ink) with a faint
  graph-paper dot grid. Monochrome — no color accents, no cursive. A single
  `--accent` CSS var (currently = ink) is the one knob to introduce a hue later.
- Motion is subtle: `transform`/`opacity` reveals, `max-height` accordions,
  underline draws. Fully honors `prefers-reduced-motion`.
- Responsive: two-column → stacked at 820px; mobile menu at 620px.
- Accessible: semantic HTML, `aria-expanded` on expandable rows, focusable
  skills, labeled placeholder regions.
- **No stock imagery** — visual slots are hatched, labeled placeholder boxes.

## Files

```
index.html                 structure + content (loads Google Fonts)
assets/css/styles.css      dark-gray monochrome design system
assets/js/main.js          all interactivity (IIFE, no globals)
```
