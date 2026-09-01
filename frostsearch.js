/* =====================================================================
   FROSTBORNE DEADLANDS — поиск по узлу (трек I: I-18, I-19, I-20).

   Зачем модуль. Разделов стало девять, и человек, который ищет «где взять
   латунь», не должен угадывать, в Кодексе это или в Эфире. Ctrl+K — и он
   спрашивает узел целиком.

   ⚠ Журнал в индекс НЕ входит. Его данные весят 170 КБ, и тянуть их на
   каждую страницу ради поиска — дороже, чем польза: у журнала есть свой
   поиск по тексту (H-07), и сюда мы кладём ссылку на него.

   ⚠ Кодекс подгружается по требованию — при первом открытии поиска, а не
   при загрузке страницы. На главной он не нужен, пока его не спросили.

   API:
     FrostSearch.open()      — открыть окно поиска
     FrostSearch.close()
   ===================================================================== */
(function () {
  'use strict';

  var S = { _box: null, _cdx: null, _loading: false };
  var LS_HIST = 'fb_search_hist';

  /* Разделы узла. Держим списком здесь, а не собираем со страниц: сайт
     статический, и «карта сайта» из девяти строк честнее любого обхода. */
  var PAGES = [
    { url: 'index.html',     key: 'nav.world',    fb: 'Станция',      hint: 'о сборке, шейдеры, галерея' },
    { url: 'download.html',  key: 'nav.download', fb: 'Скачать',      hint: 'установка, лаунчеры, память' },
    { url: 'codex.html',     key: 'nav.codex',    fb: 'Кодекс',       hint: 'дерево прогрессии, где взять' },
    { url: 'journal.html',   key: 'nav.journal',  fb: 'Журнал',       hint: 'дневник выжившего' },
    { url: 'tech.html',      key: 'nav.tech',     fb: 'Отсек',        hint: 'калькулятор ОЗУ, разбор крашей' },
    { url: 'aether.html',    key: 'nav.aether',   fb: 'Эфир',         hint: 'чат, идеи, чертежи, хроники' },
    { url: 'feed.html',      key: 'nav.feed',     fb: 'Лента',        hint: 'события станции' },
    { url: 'rules.html',     key: 'nav.rules',    fb: 'Устав',        hint: 'правила и данные' }
  ];

  function t(k, fb) {
    if (!window.I18N) return fb;
    var v = I18N.t(k);
    return (v === k) ? fb : v;
  }
  function esc(x) {
    return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function hist() {
    try { var a = JSON.parse(localStorage.getItem(LS_HIST) || '[]'); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  /* I-20: история запросов. Только последние восемь и только в этом браузере —
     список того, что человек искал, на узел отправлять незачем. */
  function remember(q) {
    q = String(q || '').trim();
    if (q.length < 2) return;
    var a = hist().filter(function (x) { return x !== q; });
    a.unshift(q);
    try { localStorage.setItem(LS_HIST, JSON.stringify(a.slice(0, 8))); } catch (e) {}
  }

  function loadCodex(done) {
    if (window.FROST_CODEX) { S._cdx = window.FROST_CODEX; done(); return; }
    if (S._loading) { setTimeout(function () { loadCodex(done); }, 150); return; }
    S._loading = true;
    var sc = document.createElement('script');
    sc.src = 'codex-data.js?v=' + ((window.FROST_VERSION && FROST_VERSION.site) || '1');
    sc.async = true;
    sc.onload = function () { S._cdx = window.FROST_CODEX || null; S._loading = false; done(); };
    sc.onerror = function () { S._loading = false; done(); };
    document.head.appendChild(sc);
  }

  function cdxText(node, field) {
    var k = 'cdx.' + node.id + '.' + field;
    if (window.I18N) { var v = I18N.t(k); if (v && v !== k) return v; }
    return node[field] || '';
  }
  function itemText(it, field) {
    var k = 'cdx.item.' + it.id + '.' + field;
    if (window.I18N) { var v = I18N.t(k); if (v && v !== k) return v; }
    return it[field] || '';
  }

  function search(q) {
    q = String(q || '').trim().toLowerCase();
    if (q.length < 2) return null;
    var out = [];

    PAGES.forEach(function (p) {
      var name = t(p.key, p.fb);
      if ((name + ' ' + p.hint).toLowerCase().indexOf(q) >= 0) {
        out.push({ kind: 'page', title: name, sub: p.hint, url: p.url });
      }
    });

    var C = S._cdx;
    if (C) {
      (C.nodes || []).forEach(function (n) {
        var name = cdxText(n, 'name');
        if (name.toLowerCase().indexOf(q) < 0) return;
        out.push({ kind: 'node', title: name, sub: cdxText(n, 'recipe') || cdxText(n, 'desc'),
                   url: 'codex.html?find=' + encodeURIComponent(name) });
      });
      (C.items || []).forEach(function (i) {
        var name = itemText(i, 'name');
        var hay = (name + ' ' + (i.alias || []).join(' ')).toLowerCase();
        if (hay.indexOf(q) < 0) return;
        out.push({ kind: 'item', title: name, sub: itemText(i, 'where'),
                   url: 'codex.html?find=' + encodeURIComponent(name) });
      });
    }

    // журнал ищем не здесь, но дорогу туда показываем
    out.push({ kind: 'jump', title: t('srch.inJournal', 'Искать в журнале'),
               sub: t('srch.inJournalSub', 'по тексту дневника выжившего'),
               url: 'journal.html' });
    return out.slice(0, 14);
  }

  function paint(q) {
    var res = S._box.querySelector('.fs-res');
    var list = search(q);

    if (list === null) {
      var h = hist();
      res.innerHTML = h.length
        ? '<div class="fs-lbl">' + esc(t('srch.recent', 'Недавние запросы')) + '</div>' +
          h.map(function (x) {
            return '<button class="fs-i" type="button" data-q="' + esc(x) + '">' +
              '<span class="fs-t">' + esc(x) + '</span></button>';
          }).join('')
        : '<div class="fs-empty">' + esc(t('srch.hint', 'Начни печатать — узел поищет по разделам и Кодексу.')) + '</div>';
      return;
    }
    if (!list.length) {
      res.innerHTML = '<div class="fs-empty">' + esc(t('srch.none', 'Ничего не нашлось.')) + '</div>';
      return;
    }
    var ICON = { page: '▤', node: '⬡', item: '◆', jump: '↗' };
    res.innerHTML = list.map(function (r) {
      return '<a class="fs-i" href="' + esc(r.url) + '">' +
        '<span class="fs-ic" aria-hidden="true">' + (ICON[r.kind] || '·') + '</span>' +
        '<span><span class="fs-t">' + esc(r.title) + '</span>' +
        (r.sub ? '<span class="fs-s">' + esc(String(r.sub).slice(0, 90)) + '</span>' : '') +
        '</span></a>';
    }).join('');
  }

  S.open = function () {
    if (S._box) { S._box.hidden = false; S._box.querySelector('input').focus(); return; }

    var box = document.createElement('div');
    box.className = 'fs';
    box.innerHTML =
      '<div class="fs-win" role="dialog" aria-modal="true">' +
        '<input class="fs-in" type="search" autocomplete="off" maxlength="60" ' +
          'placeholder="' + esc(t('srch.ph', 'Что ищем на узле?')) + '" ' +
          'aria-label="' + esc(t('srch.ph', 'Что ищем на узле?')) + '">' +
        '<div class="fs-res"></div>' +
        '<div class="fs-foot">' + esc(t('srch.foot', 'Esc — закрыть · Ctrl+K — открыть снова')) + '</div>' +
      '</div>';
    document.body.appendChild(box);
    S._box = box;

    var inp = box.querySelector('input');
    var timer = null;
    inp.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { paint(inp.value); }, 180);
    });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') S.close();
      if (e.key === 'Enter') {
        remember(inp.value);
        var first = box.querySelector('a.fs-i');
        if (first) location.href = first.getAttribute('href');
      }
    });
    box.addEventListener('click', function (e) {
      if (e.target === box) { S.close(); return; }
      var q = e.target.closest('[data-q]');
      if (q) { inp.value = q.dataset.q; paint(inp.value); inp.focus(); return; }
      var a = e.target.closest('a.fs-i');
      if (a) remember(inp.value);
    });

    loadCodex(function () { paint(inp.value); });
    paint('');
    inp.focus();
  };

  S.close = function () { if (S._box) S._box.hidden = true; };

  /* I-19: горячая клавиша. Ctrl+K — общепринятая, «/» — привычка из чатов.
     ⚠ В поле ввода «/» не перехватываем: человек может просто печатать. */
  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault(); S.open(); return;
    }
    if (e.key === '/' && !typing) { e.preventDefault(); S.open(); }
    if (e.key === 'Escape' && S._box && !S._box.hidden) S.close();
  });

  window.FrostSearch = S;
})();
