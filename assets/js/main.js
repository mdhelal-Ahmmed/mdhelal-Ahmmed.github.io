/* ==========================================================================
   Site behaviour: theme, nav, publications, gallery lightbox.
   No build step, no dependencies. Edit assets/data/publications.json to
   add papers; everything on the Publications section renders from it.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */

  var STORAGE_KEY = 'mha-theme';
  var root = document.documentElement;

  function storedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function storeTheme(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* private mode */ }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
  }

  function applyTheme(value) {
    root.setAttribute('data-theme', value);
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      btn.setAttribute('aria-label', value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(value === 'dark'));
    }
  }

  var saved = storedTheme();
  if (saved === 'light' || saved === 'dark') applyTheme(saved);

  document.addEventListener('click', function (ev) {
    var toggle = ev.target.closest && ev.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
  });

  /* ---------- Mobile nav ---------- */

  var navToggle = document.querySelector('[data-nav-toggle]');
  var navList = document.getElementById('primary-nav');

  function closeNav() {
    if (!navList) return;
    navList.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      var open = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navList.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { closeNav(); closeLightbox(); }
  });

  /* ---------- Sticky header shading ---------- */

  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Active section in nav ---------- */

  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav__link[href^="#"]')
  );

  if (sectionLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    var targets = [];
    sectionLinks.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { byId[id] = link; targets.push(el); }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (l) { l.classList.remove('is-active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Publications ---------- */

  var pubMount = document.getElementById('pub-list');
  var pubFilters = document.getElementById('pub-filters');

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Bolds the site owner's name wherever it appears in an author string.
  var ME = /(\b(?:M\.?\s?H\.?|Md\.?)\s*Helal\s+Ahmmed\b|\bAhmmed,?\s*(?:M\.?\s?H\.?|Md\.?\s*Helal)\b|\bHelal\s+Ahmmed\b)/gi;

  function markAuthors(authors) {
    return escapeHtml(authors).replace(ME, '<span class="me">$1</span>');
  }

  function pubMarkup(p) {
    var titleInner = escapeHtml(p.title);
    if (p.url) {
      titleInner = '<a href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener">' + titleInner + '</a>';
    }

    var venue = '';
    if (p.venue) {
      venue = '<em>' + escapeHtml(p.venue) + '</em>';
      if (p.volume) venue += ', ' + escapeHtml(p.volume);
      if (p.pages) venue += ', ' + escapeHtml(p.pages);
      venue = '<p class="pub__venue">' + venue + '</p>';
    }

    var links = [];
    if (p.status) {
      links.push('<span class="tag tag--status">' + escapeHtml(p.status) + '</span>');
    }
    if (p.doi) {
      links.push('<a class="tag" href="https://doi.org/' + escapeHtml(p.doi) +
        '" target="_blank" rel="noopener">DOI</a>');
    }
    if (p.pdf) {
      links.push('<a class="tag" href="' + escapeHtml(p.pdf) + '" target="_blank" rel="noopener">PDF</a>');
    }
    if (p.data) {
      links.push('<a class="tag" href="' + escapeHtml(p.data) + '" target="_blank" rel="noopener">Data</a>');
    }
    if (p.slides) {
      links.push('<a class="tag" href="' + escapeHtml(p.slides) + '" target="_blank" rel="noopener">Slides</a>');
    }

    return '' +
      '<li class="pub" data-type="' + escapeHtml(p.type || 'other') + '">' +
        '<div class="pub__year">' + escapeHtml(p.year || '') + '</div>' +
        '<div class="pub__what">' +
          '<h3 class="pub__title">' + titleInner + '</h3>' +
          '<p class="pub__authors">' + markAuthors(p.authors || '') + '</p>' +
          venue +
          (links.length ? '<div class="pub__links">' + links.join('') + '</div>' : '') +
        '</div>' +
      '</li>';
  }

  function renderPubs(items) {
    if (!pubMount) return;
    if (!items.length) {
      pubMount.innerHTML =
        '<li class="pub"><div class="pub__year"></div><div class="pub__what">' +
        '<p class="pub__venue">Nothing in this category yet.</p></div></li>';
      return;
    }
    var sorted = items.slice().sort(function (a, b) {
      var ay = parseInt(a.year, 10) || 0;
      var by = parseInt(b.year, 10) || 0;
      if (by !== ay) return by - ay;
      return String(a.title).localeCompare(String(b.title));
    });
    pubMount.innerHTML = sorted.map(pubMarkup).join('');
  }

  function wirePubs(data) {
    var all = Array.isArray(data) ? data : (data.items || []);
    renderPubs(all);

    if (pubFilters) {
      pubFilters.addEventListener('click', function (ev) {
        var chip = ev.target.closest('.chip');
        if (!chip) return;
        Array.prototype.forEach.call(
          pubFilters.querySelectorAll('.chip'),
          function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); }
        );
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        var type = chip.getAttribute('data-filter');
        renderPubs(type === 'all' ? all : all.filter(function (p) { return p.type === type; }));
      });
    }
  }

  if (pubMount && window.__PUBS__) {
    // Single-file preview build: data is embedded rather than fetched.
    wirePubs(window.__PUBS__);
  } else if (pubMount) {
    fetch('assets/data/publications.json', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(wirePubs)
      .catch(function () {
        // Opening index.html straight off disk blocks fetch in most browsers.
        pubMount.innerHTML =
          '<li class="pub"><div class="pub__year"></div><div class="pub__what">' +
          '<p class="pub__venue">Publication list could not load. If you opened this file directly ' +
          'from your computer, run a local server instead: <code>python3 -m http.server</code> in the ' +
          'site folder, then visit <code>http://localhost:8000</code>. On GitHub Pages it loads normally.' +
          '</p></div></li>';
      });
  }

  /* ---------- Gallery lightbox ---------- */

  var lightbox = null;
  var lastFocused = null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.remove();
    lightbox = null;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function openLightbox(src, alt, caption) {
    closeLightbox();
    lastFocused = document.activeElement;

    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', alt || 'Enlarged figure');

    var fig = document.createElement('figure');
    fig.className = 'lightbox__fig';

    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    fig.appendChild(img);

    if (caption) {
      var cap = document.createElement('figcaption');
      cap.className = 'lightbox__cap';
      cap.textContent = caption;
      fig.appendChild(cap);
    }

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lightbox__close';
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&times;';
    close.addEventListener('click', closeLightbox);

    lightbox.appendChild(fig);
    lightbox.appendChild(close);
    lightbox.addEventListener('click', function (ev) {
      if (ev.target === lightbox) closeLightbox();
    });

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  document.addEventListener('click', function (ev) {
    var trigger = ev.target.closest && ev.target.closest('.figure__media');
    if (!trigger) return;
    var img = trigger.querySelector('img');
    if (!img) return; // placeholder tile, nothing to enlarge
    var figure = trigger.closest('.figure');
    var capEl = figure && figure.querySelector('figcaption');
    openLightbox(img.currentSrc || img.src, img.alt, capEl ? capEl.textContent.trim() : '');
  });

  /* ---------- Year in footer ---------- */

  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
