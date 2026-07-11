/* =================================================================
   Oscar Canizales — portfolio interactivity
   Vanilla JS, no dependencies. Subtle by design.
   ================================================================= */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- 1. Top bar: scrolled state, mobile menu, scroll-spy ---------- */
  const topbar = $('.topbar');
  const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
  ['experience', 'about', 'contact'].forEach((id) => {
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

  /* ---------- 3. Generic accordion (experience rows + project rows) ---------- */
  const makeAccordion = (rows, rowSel, headSel, detailSel, openClass) => {
    const setHeight = (row, open) => {
      const d = row.querySelector(detailSel);
      d.style.maxHeight = open ? `${d.scrollHeight}px` : '0px';
    };
    rows.forEach((row) => {
      const head = row.querySelector(headSel);
      head.addEventListener('click', () => {
        const isOpen = row.classList.contains(openClass);
        rows.forEach((r) => {
          if (r !== row && r.classList.contains(openClass)) {
            r.classList.remove(openClass);
            r.querySelector(headSel).setAttribute('aria-expanded', 'false');
            setHeight(r, false);
          }
        });
        row.classList.toggle(openClass, !isOpen);
        head.setAttribute('aria-expanded', String(!isOpen));
        setHeight(row, !isOpen);
      });
    });
    window.addEventListener('resize', () => {
      rows.forEach((r) => { if (r.classList.contains(openClass)) setHeight(r, true); });
    });
  };

  makeAccordion($$('.yrow[data-exp]'), '.yrow', '.yrow__btn', '.yrow__detail', 'is-open');
  const projects = $$('.project');
  makeAccordion(projects, '.project', '.project__head', '.project__detail', 'is-open');

  /* ---------- 4. Skill <-> project cross-highlight ---------- */
  const skills = $$('.skill');
  const chips = $$('.pchip');
  const projById = (id) => document.getElementById(`proj-${id}`);
  const idsOf = (el) => (el.dataset.projects || '').split(/\s+/).filter(Boolean);

  const clear = () => {
    skills.forEach((s) => s.classList.remove('is-active', 'is-dim'));
    chips.forEach((c) => c.classList.remove('is-lit', 'is-dim'));
    projects.forEach((p) => p.classList.remove('is-linked'));
  };

  const fromSkill = (skill) => {
    const ids = idsOf(skill);
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
    chips.forEach((c) => { c.classList.toggle('is-lit', c === chip); c.classList.toggle('is-dim', c !== chip); });
    skills.forEach((s) => {
      const on = idsOf(s).includes(id);
      s.classList.toggle('is-active', on);
      s.classList.toggle('is-dim', !on);
    });
    projById(id)?.classList.add('is-linked');
  };

  skills.forEach((s) => {
    s.addEventListener('mouseenter', () => fromSkill(s));
    s.addEventListener('focus', () => fromSkill(s));
    s.addEventListener('mouseleave', clear);
    s.addEventListener('blur', clear);
  });
  chips.forEach((c) => {
    c.addEventListener('mouseenter', () => fromChip(c));
    c.addEventListener('mouseleave', clear);
  });

  /* ---------- 5. Footer year ---------- */
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
