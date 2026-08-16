/* =========================================================
   Nishant Routray — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Preloader ---------------- */
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (!pre) return;
    setTimeout(() => {
      pre.classList.add('hide');
      document.body.style.overflow = '';
    }, 450);
  });
  document.body.style.overflow = 'hidden';
  // Safety net in case `load` never fires (e.g. a stalled asset).
  setTimeout(() => {
    const pre = $('#preloader');
    if (pre && !pre.classList.contains('hide')) {
      pre.classList.add('hide');
      document.body.style.overflow = '';
    }
  }, 4000);

  /* ---------------- Current year ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Cursor glow ---------------- */
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let cx = gx, cy = gy;

    window.addEventListener('mousemove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('on');
    }, { passive: true });

    document.addEventListener('mouseleave', () => glow.classList.remove('on'));

    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Scroll progress + nav state + back to top ---------------- */
  const nav = $('#nav');
  const bar = $('#scrollProgress');
  const toTop = $('#toTop');

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- Mobile menu ---------------- */
  const toggle = $('#navToggle');
  const mobile = $('#mobileMenu');
  if (toggle && mobile) {
    const closeMenu = () => {
      toggle.classList.remove('open');
      mobile.classList.remove('open');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', mobile).forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobile.classList.contains('open')) closeMenu();
    });
  }

  /* ---------------- Active nav link (scroll spy) ---------------- */
  const sections = $$('section[id], header[id]');
  const navAnchors = $$('.nav-links a, .mobile-menu a');

  if (sections.length && navAnchors.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach((el) => el.classList.add('in'));
    } else {
      const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = parseFloat(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('in'), delay * 1000);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach((el) => revealObs.observe(el));
    }
  }

  /* ---------------- Typing effect ---------------- */
  const typeEl = $('#typed');
  if (typeEl) {
    const words = (typeEl.dataset.words || '').split('|').filter(Boolean);
    if (words.length) {
      if (reduceMotion) {
        typeEl.textContent = words[0];
      } else {
        let w = 0, c = 0, deleting = false;
        (function tick() {
          const word = words[w];
          c += deleting ? -1 : 1;
          typeEl.textContent = word.slice(0, c);

          let wait = deleting ? 45 : 85;
          if (!deleting && c === word.length) { deleting = true; wait = 1600; }
          else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; wait = 260; }
          setTimeout(tick, wait);
        })();
      }
    }
  }

  /* ---------------- Counters ---------------- */
  const counters = $$('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const dur = 1500;
        const start = performance.now();

        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => countObs.observe(el));
  }

  /* ---------------- Glass spotlight follow ---------------- */
  if (!reduceMotion) {
    $$('.glass').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
    });
  }

  /* ---------------- 3D tilt ---------------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-tilt]').forEach((el) => {
      const max = 8;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-8px)`;
      }, { passive: true });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.4;
        el.style.transform = `translate(${x}px, ${y - 3}px)`;
      }, { passive: true });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------- Skill filters ---------------- */
  const skillTabs = $$('.skill-tab');
  const skillChips = $$('.skill-chip');
  if (skillTabs.length && skillChips.length) {
    skillTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        skillTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        let shown = 0;
        skillChips.forEach((chip) => {
          const match = filter === 'all' || (chip.dataset.cat || '').split(' ').includes(filter);
          chip.style.display = match ? '' : 'none';
          if (match) {
            chip.style.animation = 'none';
            void chip.offsetWidth;
            chip.style.animation = `chipIn .45s var(--ease) ${shown * 0.035}s backwards`;
            shown++;
          }
        });
      });
    });
  }

  /* ---------------- Timeline switch ---------------- */
  const switchBtns = $$('.tl-switch button');
  if (switchBtns.length) {
    switchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        switchBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        $$('.pane').forEach((p) => p.classList.remove('active'));
        const pane = $('#' + btn.dataset.pane);
        if (pane) pane.classList.add('active');
      });
    });
  }

  /* ---------------- Marquee: duplicate track for seamless loop ---------------- */
  const marquee = $('#marquee');
  if (marquee) {
    const track = $('.marquee-track', marquee);
    if (track) marquee.appendChild(track.cloneNode(true));
  }

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox');
  if (lb) {
    const lbImg = $('#lbImg');
    const items = $$('.gal-item');
    let index = 0;

    const srcOf = (el) => el.dataset.full || $('img', el).src;

    function open(i) {
      index = (i + items.length) % items.length;
      lbImg.src = srcOf(items[index]);
      lbImg.alt = $('img', items[index]).alt || 'Gallery photo';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    items.forEach((el, i) => {
      el.addEventListener('click', () => open(i));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', (e) => { e.stopPropagation(); open(index - 1); });
    $('#lbNext').addEventListener('click', (e) => { e.stopPropagation(); open(index + 1); });
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(index - 1);
      if (e.key === 'ArrowRight') open(index + 1);
    });
  }

  /* ---------------- Copy to clipboard ---------------- */
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e2) { /* no-op */ }
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('done');
      setTimeout(() => { btn.textContent = original; btn.classList.remove('done'); }, 1800);
    });
  });

  /* ---------------- Contact form ---------------- */
  const form = $('#contactForm');
  if (form) {
    const status = $('#formStatus');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setInvalid = (field, on) => field.classList.toggle('invalid', on);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = $$('.field', form);
      let ok = true;

      fields.forEach((field) => {
        const input = $('input, textarea', field);
        if (!input || !input.required) return;
        const val = input.value.trim();
        let bad = !val;
        if (!bad && input.type === 'email') bad = !emailRe.test(val);
        setInvalid(field, bad);
        if (bad) ok = false;
      });

      if (!ok) return;

      const name = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const subject = $('#cf-subject').value.trim();
      const message = $('#cf-message').value.trim();

      const body = `${message}\n\n—\nFrom: ${name}\nEmail: ${email}`;
      const mailto = `mailto:nishant.routray@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      if (status) {
        status.textContent = 'Thanks, ' + name + '! Your mail app should be opening with the message ready to send.';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 9000);
      }
      form.reset();
    });

    $$('.field input, .field textarea', form).forEach((input) => {
      input.addEventListener('input', () => setInvalid(input.closest('.field'), false));
    });
  }

  /* ---------------- Hero parallax on blobs ---------------- */
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const blobs = $$('.blob');
    let tx = 0, ty = 0, x = 0, y = 0;
    window.addEventListener('mousemove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    (function parallax() {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 9;
        b.style.marginLeft = (x * depth) + 'px';
        b.style.marginTop = (y * depth) + 'px';
      });
      requestAnimationFrame(parallax);
    })();
  }

  /* ---------------- Broken image fallback ---------------- */
  $$('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const holder = document.createElement('div');
      holder.className = 'fallback';
      holder.textContent = img.dataset.fallback;
      img.replaceWith(holder);
    }, { once: true });
  });
})();
