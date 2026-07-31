/* =================================================================
   Oscar Canizales — portfolio interactivity
   Vanilla JS, no dependencies, no build step.

   Everything here is progressive: with JS off the page is still a
   complete, readable document. Nothing below creates content that
   isn't otherwise reachable — the fleet diagram is the one generated
   element, and it replaces a text fallback that says the same thing.

     1  top bar        — scroll state, burger, scroll-spy, progress
     2  reveals
     3  accordions     — experience rows + project rows (shared factory)
     4  skill <-> project cross-highlight (hover, plus click-to-pin)
     5  metric count-up
     6  project filters
     7  fleet map      — SVG built from the FLEET data structure
     8  command palette
     9  keyboard shortcuts + the map overlay
    10  copy-to-clipboard, pointer light, deep links, year
   ================================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- 1. Top bar: scrolled state, mobile menu, spy, progress ---------- */
  const topbar = $('.topbar');
  const progress = $('#progress');

  const onScroll = () => {
    topbar.classList.toggle('is-scrolled', window.scrollY > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  const burger = $('#burger');
  const nav = $('.topbar__nav');
  burger?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('.topbar__nav a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger?.setAttribute('aria-expanded', 'false');
    })
  );

  const navLinks = $$('.topbar__nav a');
  const linkFor = (id) => navLinks.find((a) => a.getAttribute('href') === `#${id}`);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          linkFor(e.target.id)?.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  ['experience', 'projects', 'systems', 'demos', 'about', 'contact'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- 2. Scroll reveals ---------- */
  const revealEls = $$('[data-reveal]');
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          o.unobserve(e.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach((el) => obs.observe(el));
  }

  /* ---------- 3. Accordion factory (experience rows + project rows) ----------
     Returns an API rather than just wiring listeners, because the keyboard
     layer and the command palette both need to open a specific row from the
     outside — and "expand all" needs to bypass the close-the-others rule. */
  const makeAccordion = (rows, headSel, detailSel, openClass) => {
    const detailOf = (row) => row.querySelector(detailSel);
    const setHeight = (row, open) => {
      const d = detailOf(row);
      if (d) d.style.maxHeight = open ? `${d.scrollHeight}px` : '0px';
    };
    const setOpen = (row, open) => {
      row.classList.toggle(openClass, open);
      row.querySelector(headSel)?.setAttribute('aria-expanded', String(open));
      setHeight(row, open);
    };
    const closeOthers = (keep) =>
      rows.forEach((r) => { if (r !== keep && r.classList.contains(openClass)) setOpen(r, false); });

    const toggle = (row, { solo = true } = {}) => {
      const willOpen = !row.classList.contains(openClass);
      if (willOpen && solo) closeOthers(row);
      setOpen(row, willOpen);
      return willOpen;
    };

    rows.forEach((row) => row.querySelector(headSel)?.addEventListener('click', () => toggle(row)));

    // An open row's content height changes with the viewport; re-measure it.
    window.addEventListener('resize', () => {
      rows.forEach((r) => { if (r.classList.contains(openClass)) setHeight(r, true); });
    });

    return {
      rows,
      toggle,
      open: (row) => { closeOthers(row); setOpen(row, true); },
      openAll: () => rows.forEach((r) => setOpen(r, true)),
      closeAll: () => rows.forEach((r) => setOpen(r, false)),
      anyOpen: () => rows.some((r) => r.classList.contains(openClass)),
      remeasure: () => rows.forEach((r) => { if (r.classList.contains(openClass)) setHeight(r, true); }),
    };
  };

  makeAccordion($$('.yrow[data-exp]'), '.yrow__btn', '.yrow__detail', 'is-open');
  const projects = $$('.project');
  const pAcc = makeAccordion(projects, '.project__head', '.project__detail', 'is-open');

  /* ---------- 4. Skill <-> project cross-highlight ----------
     Hover previews the link; clicking pins it, so the mapping survives the
     scroll down to the project it points at. */
  const skills = $$('.skill');
  const chips = $$('.pchip');
  const projById = (id) => document.getElementById(`proj-${id}`);
  const idsOf = (el) => (el.dataset.projects || '').split(/\s+/).filter(Boolean);
  let pinned = null;

  const clearHighlight = () => {
    skills.forEach((s) => s.classList.remove('is-active', 'is-dim'));
    chips.forEach((c) => c.classList.remove('is-lit', 'is-dim'));
    projects.forEach((p) => p.classList.remove('is-linked'));
  };

  const fromSkill = (skill) => {
    const ids = idsOf(skill);
    clearHighlight();
    skills.forEach((s) => s.classList.add('is-dim'));
    skill.classList.remove('is-dim');
    skill.classList.add('is-active');
    chips.forEach((c) => {
      const on = ids.includes(c.dataset.project);
      c.classList.toggle('is-lit', on);
      c.classList.toggle('is-dim', !on);
    });
    ids.forEach((id) => projById(id)?.classList.add('is-linked'));
  };

  const fromChip = (chip) => {
    const id = chip.dataset.project;
    clearHighlight();
    chips.forEach((c) => { c.classList.toggle('is-lit', c === chip); c.classList.toggle('is-dim', c !== chip); });
    skills.forEach((s) => {
      const on = idsOf(s).includes(id);
      s.classList.toggle('is-active', on);
      s.classList.toggle('is-dim', !on);
    });
    projById(id)?.classList.add('is-linked');
  };

  const restore = () => (pinned ? fromSkill(pinned) : clearHighlight());

  skills.forEach((s) => {
    s.addEventListener('mouseenter', () => fromSkill(s));
    s.addEventListener('focus', () => fromSkill(s));
    s.addEventListener('mouseleave', restore);
    s.addEventListener('blur', restore);
    s.addEventListener('click', () => {
      pinned = pinned === s ? null : s;
      restore();
    });
  });
  chips.forEach((c) => {
    c.addEventListener('mouseenter', () => fromChip(c));
    c.addEventListener('mouseleave', restore);
  });

  const pinSkill = (skill) => { pinned = skill; fromSkill(skill); };

  /* ---------- 5. Metric count-up ----------
     Counts once, when the band first scrolls into view. The final value is
     already in the HTML, so with JS off (or reduced motion) it just reads. */
  const nums = $$('.metric__num');
  if (nums.length && !reduceMotion) {
    const countObs = new IntersectionObserver((entries, o) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        o.unobserve(e.target);
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = (String(el.dataset.count).split('.')[1] || '').length;
        const start = performance.now();
        const DUR = 900;
        const tick = (now) => {
          const t = Math.min((now - start) / DUR, 1);
          const eased = 1 - Math.pow(1 - t, 3);        // ease-out cubic
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => countObs.observe(n));
  }

  /* ---------- 6. Project filters ----------
     Heights are driven inline because CSS can't transition from `none` to `0`.
     `hidden` is set only after the collapse finishes, so a filtered-out row
     leaves the tab order but doesn't vanish mid-animation. */
  const filterBtns = $$('.filter');
  const emptyMsg = $('#filters-empty');
  const groups = $$('.pgroup');
  let activeFilter = 'all';

  const matches = (proj, f) => f === 'all' || (proj.dataset.cat || '').split(/\s+/).includes(f);

  const applyFilter = (f) => {
    activeFilter = f;
    filterBtns.forEach((b) => b.classList.toggle('is-on', b.dataset.filter === f));

    let shown = 0;
    projects.forEach((p) => {
      const on = matches(p, f);
      if (on) shown++;

      const isShown = !p.hasAttribute('hidden') && !p.classList.contains('is-filtered');
      if (on === isShown) return;

      // Clicking through filters faster than the 400ms collapse would otherwise
      // let a stale timer land `hidden` on a row that is now supposed to show.
      clearTimeout(p._filterTimer);

      if (reduceMotion) {
        p.toggleAttribute('hidden', !on);
        p.classList.toggle('is-filtered', !on);
        return;
      }

      if (on) {
        p.hidden = false;
        p.classList.add('is-sizing');
        p.style.maxHeight = '0px';
        void p.offsetHeight;                       // flush, so there's a value to animate from
        p.classList.remove('is-filtered');
        p.style.maxHeight = `${p.scrollHeight}px`;
        p._filterTimer = setTimeout(() => { p.style.maxHeight = ''; p.classList.remove('is-sizing'); }, 420);
      } else {
        if (p.classList.contains('is-open')) pAcc.toggle(p);
        p.classList.add('is-sizing');
        p.style.maxHeight = `${p.scrollHeight}px`;
        void p.offsetHeight;
        p.classList.add('is-filtered');
        p.style.maxHeight = '0px';
        p._filterTimer = setTimeout(() => { p.hidden = true; p.classList.remove('is-sizing'); }, 420);
      }
    });

    // A group whose every row is filtered out hides its label too.
    groups.forEach((g) => {
      const any = $$('.project', g).some((p) => matches(p, f));
      g.classList.toggle('is-empty', !any);
    });
    if (emptyMsg) emptyMsg.hidden = shown > 0;
  };

  filterBtns.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  /* ---------- 7. Fleet map ----------
     Laid out from data rather than hand-placed in the HTML: three columns,
     each vertically centred, with cubic edges between them. Hovering or
     focusing a node dims everything it doesn't touch. */
  const FLEET = {
    cols: ['sources & capabilities', 'services on the box', 'what ships'],
    nodes: [
      // col 0 — what comes in, and what the box can do
      { id: 'market',  col: 0, name: 'market data',      sub: 'Yahoo · Rithmic · Webull', desc: 'Price and order-flow feeds for futures and equities research.' },
      { id: 'places',  col: 0, name: 'prospect data',    sub: 'Places · OSM · Reddit',    desc: 'Three independent sources of local businesses, merged and deduplicated.' },
      { id: 'sites',   col: 0, name: 'live client sites', sub: 'crawl · Lighthouse',      desc: 'The real, deployed HTML — crawled nightly and scored for performance and SEO.' },
      { id: 'listens', col: 0, name: 'listening history', sub: 'ListenBrainz',            desc: 'Scrobbles leaving the media server, which come back as recommendations.' },
      { id: 'vods',    col: 0, name: 'source video',     sub: 'yt-dlp · 1080p',           desc: 'Long-form footage pulled at a guaranteed 1080p before any cutting.' },
      { id: 'ollama',  col: 0, name: 'local inference',  sub: 'Ollama · llama3.2:3b',     desc: 'CPU-only language model with schema-constrained decoding. No API bill.' },
      { id: 'graph',   col: 0, name: 'knowledge graph',  sub: 'graphify · 8 repos',       desc: 'Code and docs as a queryable graph — 3.8× less context per question.' },
      // col 1 — the services
      { id: 'seo',     col: 1, name: 'seo-ops',          sub: 'nightly · 5-check gate',   desc: 'Audits, writes the fix, and gates its own deploy. Fails closed.' },
      { id: 'apex',    col: 1, name: 'apex-trader',      sub: '10 strategies · paper',    desc: 'Walk-forward backtester, optimizer, and a committee that grades its own past calls.' },
      { id: 'poly',    col: 1, name: 'polymarket-bot',   sub: 'stat-arb · paper',         desc: 'Prediction-market engine, held to paper after walk-forward flagged it non-robust.' },
      { id: 'lead',    col: 1, name: 'leadscout',        sub: 'FastAPI · SQLite',         desc: 'Finds businesses with no website and qualifies them before outreach.' },
      { id: 'clip',    col: 1, name: 'shorts-clipper',   sub: 'ffmpeg · Whisper',         desc: 'Highlight detection, 9:16 reframe with motion tracking, captions.' },
      { id: 'music',   col: 1, name: 'music-stack',      sub: '7 containers',             desc: 'Listen, recommend, fetch, tag, playlist — a closed loop with no manual step.' },
      // col 2 — what leaves the box
      { id: 'site',    col: 2, name: 'segundaitzel.mx',  sub: 'live · SEO 100',           desc: 'A paying client’s storefront, edited unattended and gate-verified.' },
      { id: 'dash',    col: 2, name: 'fleet dashboard',  sub: ':8080 · one login',        desc: 'Stdlib-only gateway: live git state, TCP health, allow-listed reverse proxy.' },
      { id: 'vault',   col: 2, name: 'notes & memory',   sub: 'Markdown vault',           desc: 'Every run writes back what it learned, so the next one starts informed.' },
      { id: 'yt',      col: 2, name: 'YouTube',          sub: 'staged as drafts',         desc: 'Never auto-published. Automation that cannot publish is automation you can leave running.' },
      { id: 'plex',    col: 2, name: 'Plexamp',          sub: 'iOS',                      desc: 'The only front-end I actually touch.' },
    ],
    // [from, to, soft?] — "soft" means a capability or an observation, not a data path
    edges: [
      ['market', 'apex'], ['market', 'poly'], ['places', 'lead'],
      ['sites', 'seo'], ['listens', 'music'], ['vods', 'clip'],
      ['ollama', 'seo', 1], ['ollama', 'apex', 1], ['ollama', 'lead', 1],
      ['graph', 'seo', 1], ['graph', 'apex', 1], ['graph', 'clip', 1],
      ['seo', 'site'], ['seo', 'vault'], ['apex', 'vault'], ['poly', 'vault'],
      ['clip', 'yt'], ['music', 'plex'],
      ['seo', 'dash', 1], ['apex', 'dash', 1], ['poly', 'dash', 1],
      ['lead', 'dash', 1], ['clip', 'dash', 1], ['music', 'dash', 1],
    ],
  };

  const buildFleet = () => {
    const host = $('#fleet');
    const readout = $('#fleet-readout');
    if (!host) return;

    const W = 760, NODE_W = 170, NODE_H = 40, GAP = 14, TOP = 46, BODY_H = 400;
    const H = TOP + BODY_H + 14;
    const COL_X = [20, 295, 570];

    // Vertically centre each column against the tallest one.
    const pos = {};
    FLEET.cols.forEach((_, c) => {
      const inCol = FLEET.nodes.filter((n) => n.col === c);
      const colH = inCol.length * NODE_H + (inCol.length - 1) * GAP;
      const top = TOP + (BODY_H - colH) / 2;
      inCol.forEach((n, i) => { pos[n.id] = { x: COL_X[c], y: top + i * (NODE_H + GAP) }; });
    });

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label',
      'System diagram: data sources and local AI capabilities feed six services running on one server, which ship to a live client site, a fleet dashboard, a notes vault, YouTube drafts, and a music player.');

    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
      parent.appendChild(n);
      return n;
    };

    // column captions
    FLEET.cols.forEach((label, c) => {
      const t = el('text', { class: 'fleet__col', x: COL_X[c], y: 22 }, svg);
      t.textContent = label;
    });

    // edges first, so nodes paint over them
    const edgeLayer = el('g', {}, svg);
    const edgesOf = {};
    FLEET.edges.forEach(([from, to, soft], i) => {
      const a = pos[from], b = pos[to];
      const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2;
      const x2 = b.x,          y2 = b.y + NODE_H / 2;
      const mid = x1 + (x2 - x1) / 2;
      const path = el('path', {
        class: `fedge${soft ? ' fedge--soft' : ''}`,
        d: `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`,
      }, edgeLayer);
      (edgesOf[from] ||= []).push(i);
      (edgesOf[to]   ||= []).push(i);
      path.dataset.from = from;
      path.dataset.to = to;
    });
    const paths = $$('.fedge', svg);

    // nodes
    const nodeEls = {};
    FLEET.nodes.forEach((n) => {
      const { x, y } = pos[n.id];
      const g = el('g', { class: 'fnode', tabindex: '0', role: 'button', 'aria-label': `${n.name}. ${n.desc}` }, svg);
      el('rect', { x, y, width: NODE_W, height: NODE_H, rx: 3 }, g);
      const name = el('text', { x: x + 11, y: y + 17 }, g);
      name.textContent = n.name;
      const sub = el('text', { class: 'fnode__sub', x: x + 11, y: y + 30 }, g);
      sub.textContent = n.sub;
      nodeEls[n.id] = g;
      g.dataset.id = n.id;
    });

    const byId = Object.fromEntries(FLEET.nodes.map((n) => [n.id, n]));
    const nameOf = (id) => byId[id].name;

    const trace = (id) => {
      svg.classList.add('is-tracing');
      const touching = new Set([id]);
      paths.forEach((p, i) => {
        const lit = (edgesOf[id] || []).includes(i);
        p.classList.toggle('is-lit', lit);
        if (lit) { touching.add(p.dataset.from); touching.add(p.dataset.to); }
      });
      Object.entries(nodeEls).forEach(([nid, g]) => {
        g.classList.toggle('is-on', nid === id);
        g.classList.toggle('is-near', nid !== id && touching.has(nid));
      });

      const feeds = FLEET.edges.filter(([, to]) => to === id).map(([f]) => nameOf(f));
      const outs  = FLEET.edges.filter(([f]) => f === id).map(([, t]) => nameOf(t));
      const n = byId[id];
      readout.innerHTML = '';
      const mk = (cls, html) => { const p = document.createElement('p'); p.className = cls; p.innerHTML = html; readout.appendChild(p); };
      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      mk('fleet__name', esc(n.name) + '<span style="color:var(--faint)"> · ' + esc(n.sub) + '</span>');
      mk('fleet__desc', esc(n.desc));
      const parts = [];
      if (feeds.length) parts.push('&#8592; fed by <b>' + feeds.map(esc).join(', ') + '</b>');
      if (outs.length)  parts.push('&#8594; feeds <b>' + outs.map(esc).join(', ') + '</b>');
      if (parts.length) mk('fleet__flow', parts.join(' &#183; '));
    };

    const untrace = () => {
      svg.classList.remove('is-tracing');
      paths.forEach((p) => p.classList.remove('is-lit'));
      Object.values(nodeEls).forEach((g) => g.classList.remove('is-on', 'is-near'));
      readout.innerHTML = '<p class="fleet__hint">Select a node for its detail.</p>';
    };

    Object.entries(nodeEls).forEach(([id, g]) => {
      g.addEventListener('mouseenter', () => trace(id));
      g.addEventListener('mouseleave', untrace);
      g.addEventListener('focus', () => trace(id));
      g.addEventListener('blur', untrace);
      g.addEventListener('keydown', (e) => {
        const n = byId[id];
        const inCol = FLEET.nodes.filter((x) => x.col === n.col);
        const i = inCol.indexOf(n);
        let next = null;
        if (e.key === 'ArrowDown') next = inCol[(i + 1) % inCol.length];
        else if (e.key === 'ArrowUp') next = inCol[(i - 1 + inCol.length) % inCol.length];
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const dir = e.key === 'ArrowRight' ? 1 : -1;
          const targetCol = (n.col + dir + FLEET.cols.length) % FLEET.cols.length;
          const dest = FLEET.nodes.filter((x) => x.col === targetCol);
          next = dest[Math.min(i, dest.length - 1)];
        }
        if (next) { e.preventDefault(); nodeEls[next.id].focus(); }
      });
    });

    host.innerHTML = '';
    host.appendChild(svg);
  };
  buildFleet();

  /* ---------- 8. Command palette ----------
     The index is read out of the DOM, so it can never drift from the page. */
  const palette = $('#palette');
  const pInput = $('#palette-input');
  const pList = $('#palette-list');
  let items = [];
  let results = [];
  let sel = 0;

  const buildIndex = () => {
    const out = [];
    $$('section[id]').forEach((s) => {
      const title = $('.section__title, .contact__title', s);
      if (title) out.push({ kind: 'section', label: title.textContent.trim(), sub: `#${s.id}`, act: () => goTo(s.id) });
    });
    projects.forEach((p) => {
      const label = $('.project__title', p).textContent.trim();
      const sub = $('.project__no', p).textContent.trim();
      out.push({
        kind: 'project', label, sub: `[${sub}]`,
        body: `${$('.project__tag', p).textContent} ${p.dataset.cat || ''}`,
        act: () => openProject(p),
      });
    });
    $$('.demo').forEach((d) => {
      const label = $('.demo__name', d).textContent.trim();
      out.push({ kind: 'demo', label, sub: 'opens ↗', body: $('.demo__tag', d).textContent, act: () => window.open(d.href, '_blank', 'noopener') });
    });
    skills.forEach((s) => {
      const label = s.textContent.trim();
      out.push({ kind: 'skill', label, sub: `${idsOf(s).length} projects`, act: () => { goTo('about'); pinSkill(s); } });
    });
    $$('.contact__links a').forEach((a) => {
      out.push({ kind: 'contact', label: `${$('span', a).textContent.trim()} — ${a.lastChild.textContent.trim()}`, sub: '', act: () => a.click() });
    });
    return out;
  };

  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  const openProject = (p) => {
    // A filtered-out project can't be opened while it's hidden — reset first.
    if (p.hidden || p.classList.contains('is-filtered')) applyFilter('all');
    goTo(p.id);
    setTimeout(() => { if (!p.classList.contains('is-open')) pAcc.toggle(p); setCursor(projects.indexOf(p)); }, reduceMotion ? 0 : 420);
  };

  /* Ranking.

     Subsequence matching runs against the LABEL only. Against a long body it
     is close to useless — "walkforward" can be spelled out of the letters of
     almost any paragraph, so every item matches and the ranking is noise.
     Bodies therefore need a real substring hit, which is what a person typing
     a half-remembered phrase actually means.

     A label hit also outranks a body hit outright, and each kind carries a
     boost: typing "seo" on a portfolio means the seo-ops project far more
     often than it means the "SEO optimization" skill chip. */
  const KIND_BOOST = { project: 30, demo: 18, section: 12, skill: 6, contact: 4 };

  const subseq = (q, text) => {
    const t = text.toLowerCase();
    let ti = 0, s = 0, streak = 0;
    for (const ch of q) {
      const found = t.indexOf(ch, ti);
      if (found === -1) return -1;
      streak = found === ti ? streak + 1 : 0;
      s += 10 + streak * 5;
      if (found === 0 || /[\s\-—/·]/.test(t[found - 1] || '')) s += 12;
      ti = found + 1;
    }
    return s - t.length * 0.05;
  };

  const score = (q, it) => {
    const label = it.label.toLowerCase();
    const boost = KIND_BOOST[it.kind] || 0;
    if (label.startsWith(q)) return 400 + boost - label.length * 0.1;
    const ls = subseq(q, label);
    if (ls >= 0) return 100 + ls + boost;
    if (it.body && it.body.toLowerCase().includes(q)) return 40 + boost;
    return -1;
  };

  const render = () => {
    pList.innerHTML = '';
    if (!results.length) {
      const li = document.createElement('li');
      li.className = 'palette__none';
      li.textContent = 'Nothing matches that.';
      pList.appendChild(li);
      return;
    }
    results.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'palette__item' + (i === sel ? ' is-sel' : '');
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === sel));
      li.innerHTML =
        `<span class="palette__kind">${r.kind}</span>` +
        `<span class="palette__label"></span>` +
        (r.sub ? `<span class="palette__sub"></span>` : '');
      $('.palette__label', li).textContent = r.label;
      if (r.sub) $('.palette__sub', li).textContent = r.sub;
      li.addEventListener('click', () => { closePalette(); r.act(); });
      li.addEventListener('mousemove', () => { if (sel !== i) { sel = i; render(); } });
      pList.appendChild(li);
    });
  };

  const search = (q) => {
    q = q.trim().toLowerCase();
    if (!q) {
      results = items.slice(0, 12);
    } else {
      results = items
        .map((it) => ({ it, s: score(q, it) }))
        .filter((r) => r.s >= 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 14)
        .map((r) => r.it);
    }
    sel = 0;
    render();
  };

  let lastFocus = null;
  const openPalette = () => {
    if (!palette) return;
    closeKeys();
    lastFocus = document.activeElement;
    if (!items.length) items = buildIndex();
    palette.hidden = false;
    pInput.value = '';
    search('');
    pInput.focus();
  };
  const closePalette = () => {
    if (!palette || palette.hidden) return;
    palette.hidden = true;
    lastFocus?.focus?.();
  };

  $('#palette-open')?.addEventListener('click', openPalette);
  $$('[data-palette-close]').forEach((e) => e.addEventListener('click', closePalette));
  pInput?.addEventListener('input', (e) => search(e.target.value));
  pInput?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === 'Enter') { e.preventDefault(); const r = results[sel]; if (r) { closePalette(); r.act(); } }
    else if (e.key === 'Escape') { e.preventDefault(); closePalette(); }
  });

  /* ---------- 9. Keyboard shortcuts ---------- */
  const keys = $('#keys');
  const openKeys = () => { if (keys) { closePalette(); keys.hidden = false; } };
  const closeKeys = () => { if (keys) keys.hidden = true; };
  $$('[data-keys-close]').forEach((e) => e.addEventListener('click', closeKeys));

  let cursor = -1;
  const visibleProjects = () => projects.filter((p) => !p.hidden);
  const setCursor = (i) => {
    projects.forEach((p) => p.classList.remove('is-cursor'));
    const vis = visibleProjects();
    if (!vis.length) return;
    const target = projects[i] && !projects[i].hidden ? projects[i] : vis[0];
    cursor = projects.indexOf(target);
    target.classList.add('is-cursor');
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  };
  const moveCursor = (dir) => {
    const vis = visibleProjects();
    if (!vis.length) return;
    const here = vis.indexOf(projects[cursor]);
    const next = here === -1 ? 0 : (here + dir + vis.length) % vis.length;
    setCursor(projects.indexOf(vis[next]));
  };

  let gPending = false;
  const GO = { w: 'experience', p: 'projects', s: 'systems', d: 'demos', t: 'about', c: 'contact' };

  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;

    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); openPalette(); return; }
    if (typing) return;
    if (e.altKey || e.metaKey || e.ctrlKey) return;

    if (e.key === 'Escape') {
      if (!palette?.hidden) closePalette();
      else if (!keys?.hidden) closeKeys();
      else { projects.forEach((p) => p.classList.remove('is-cursor')); cursor = -1; }
      return;
    }

    if (gPending) {
      gPending = false;
      const dest = GO[e.key.toLowerCase()];
      if (dest) { e.preventDefault(); goTo(dest); }
      return;
    }

    switch (e.key) {
      case '?': e.preventDefault(); openKeys(); break;
      case '/': e.preventDefault(); openPalette(); break;
      case 'g': case 'G': gPending = true; setTimeout(() => { gPending = false; }, 1200); break;
      case 'j': case 'J': e.preventDefault(); moveCursor(1); break;
      case 'k': case 'K': e.preventDefault(); moveCursor(-1); break;
      case 'e': case 'E':
        e.preventDefault();
        if (pAcc.anyOpen()) pAcc.closeAll();
        else visibleProjects().forEach((p) => { if (!p.classList.contains('is-open')) pAcc.toggle(p, { solo: false }); });
        break;
      case 'f': case 'F': {
        e.preventDefault();
        const order = filterBtns.map((b) => b.dataset.filter);
        applyFilter(order[(order.indexOf(activeFilter) + 1) % order.length]);
        break;
      }
      case 'Enter':
        if (cursor >= 0 && projects[cursor]) { e.preventDefault(); pAcc.toggle(projects[cursor]); }
        break;
      default: break;
    }
  });

  /* ---------- 10a. Copy to clipboard ----------
     A sibling button, not a click handler on the link — mailto: and tel: must
     keep working exactly as a link should. */
  const toast = $('#toast');
  let toastTimer = null;
  const say = (msg) => {
    if (!toast) return;
    toast.hidden = false;
    toast.textContent = msg;
    requestAnimationFrame(() => toast.classList.add('is-up'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-up');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 1600);
  };

  $$('.contact__links a[data-copy]').forEach((a) => {
    const wrap = document.createElement('span');
    wrap.className = 'contact__item';
    a.parentNode.insertBefore(wrap, a);
    wrap.appendChild(a);

    const btn = document.createElement('button');
    btn.className = 'copybtn';
    btn.type = 'button';
    btn.textContent = 'copy';
    btn.setAttribute('aria-label', `Copy ${a.dataset.copy}`);
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(a.dataset.copy);
        say(`Copied ${a.dataset.copy}`);
      } catch {
        say('Clipboard blocked — select and copy manually');
      }
    });
    wrap.appendChild(btn);
  });

  /* ---------- 10b. Pointer light on the dot grid ----------
     Only on devices with a real pointer, and only two CSS vars per frame. */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const light = document.createElement('div');
    light.className = 'gridlight';
    document.body.appendChild(light);
    let px = 0, py = 0, queued = false;
    window.addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        light.style.setProperty('--mx', `${px}px`);
        light.style.setProperty('--my', `${py}px`);
        light.classList.add('is-on');
        queued = false;
      });
    }, { passive: true });
    window.addEventListener('pointerleave', () => light.classList.remove('is-on'));
  }

  /* ---------- 10c. Deep links + footer year ---------- */
  const openFromHash = () => {
    const m = /^#proj-(\d+)$/.exec(location.hash);
    if (!m) return;
    const p = document.getElementById(`proj-${m[1]}`);
    if (p && !p.classList.contains('is-open')) pAcc.toggle(p);
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  // Project chips deep-link into the list; open the row they point at.
  chips.forEach((c) => c.addEventListener('click', () => {
    const p = projById(c.dataset.project);
    if (p) setTimeout(() => { if (!p.classList.contains('is-open')) pAcc.toggle(p); }, 320);
  }));

  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
