/* =====================================================================
   FROSTBORNE DEADLANDS — уведомления (трек E).

   Зачем модуль. Человек уходит со страницы и не знает, что ему ответили,
   что его позвали в чате или что на станции появилось событие. Колокол
   собирает это в одном месте.

   ⚠ Уведомления НЕ хранятся в базе. Они выводятся из того, что и так
   приезжает на страницу — чата и ленты, — а прочитанность живёт в
   localStorage. Значит: ни новой ветки, ни новых правил, ни лишних
   чтений. Цена — уведомления не переезжают между устройствами, и это
   честный размен: класть «кто что видел» в общую базу ради колокола
   не стоит.

   ⚠ Разрешение на системные уведомления спрашиваем только по действию
   человека (E-13). Запрос в первую секунду почти всегда получает отказ
   навсегда — браузер запоминает его и больше не спросит.

   API:
     FrostNotify.mount(sel)          — повесить колокол
     FrostNotify.push(item)          — добавить уведомление
     FrostNotify.unread()            — сколько непрочитанных
     FrostNotify.markAllRead()
     FrostNotify.settings() / setSettings(patch)
     FrostNotify.quietNow()          — сейчас тихие часы?
     FrostNotify.askPermission()     — спросить браузер (по клику!)
   ===================================================================== */
(function () {
  'use strict';

  var N = { _items: [], _mounted: null, _tabBase: null, _extra: 0 };

  var LS_ITEMS = 'fb_notes';
  var LS_READ  = 'fb_notes_read';
  var LS_SET   = 'fb_notes_set';
  var MAX = 40;

  /* Что уведомляет, а что молчит (E-09). По умолчанию включено всё, кроме
     тихих типов ленты: иначе колокол звонил бы на каждую чужую смерть. */
  var DEFAULTS = {
    mention: 1,   // позвали по позывному
    reply: 1,     // ответили на сообщение
    feed: 1,      // события ленты
    sound: 1,     // звук
    quiet: 0,     // тихие часы включены
    from: 23,     // с какого часа
    to: 8         // до какого
  };

  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  N.settings = function () {
    try {
      var raw = JSON.parse(lsGet(LS_SET, 'null'));
      if (raw && typeof raw === 'object') return Object.assign({}, DEFAULTS, raw);
    } catch (e) {}
    return Object.assign({}, DEFAULTS);
  };
  N.setSettings = function (patch) {
    var s = Object.assign(N.settings(), patch || {});
    lsSet(LS_SET, JSON.stringify(s));
    paint();
    return s;
  };

  /* Тихие часы (E-10). Полночь внутри промежутка — обычный случай
     (с 23 до 8), поэтому сравнение двухсторонее. */
  N.quietNow = function () {
    var s = N.settings();
    if (!s.quiet) return false;
    var h = new Date().getHours();
    var from = Number(s.from), to = Number(s.to);
    if (from === to) return false;
    return (from < to) ? (h >= from && h < to) : (h >= from || h < to);
  };

  function load() {
    try {
      var raw = JSON.parse(lsGet(LS_ITEMS, '[]'));
      if (Array.isArray(raw)) N._items = raw.slice(-MAX);
    } catch (e) { N._items = []; }
  }
  function save() { lsSet(LS_ITEMS, JSON.stringify(N._items.slice(-MAX))); }

  N.readMark = function () { return Number(lsGet(LS_READ, '0')) || 0; };
  N.markAllRead = function () {
    var top = N._items.reduce(function (m, i) { return Math.max(m, i.ts || 0); }, 0);
    lsSet(LS_READ, String(Math.max(N.readMark(), top)));
    paint();
  };
  N.unread = function () {
    var mark = N.readMark();
    return N._items.filter(function (i) { return (i.ts || 0) > mark; }).length;
  };
  N.list = function () { return N._items.slice().sort(function (a, b) { return b.ts - a.ts; }); };

  /* Добавить уведомление. Дубли отсекаются по id: чат перерисовывается
     целиком, и без этого одно сообщение звонило бы при каждой перерисовке. */
  N.push = function (item) {
    if (!item || !item.id) return false;
    var s = N.settings();
    if (item.type && s[item.type] === 0) return false;
    if (N._items.some(function (i) { return i.id === item.id; })) return false;

    var rec = {
      id: String(item.id).slice(0, 80),
      type: item.type || 'feed',
      title: String(item.title || '').slice(0, 80),
      body: String(item.body || '').slice(0, 160),
      url: String(item.url || '').slice(0, 200),
      ts: Number(item.ts) || Date.now()
    };
    N._items.push(rec);
    if (N._items.length > MAX) N._items = N._items.slice(-MAX);
    save();
    paint();

    var quiet = N.quietNow();
    if (!quiet) {
      if (s.sound && window.FrostSFX) { try { FrostSFX.play('beep'); } catch (e) {} }
      systemNote(rec);
    }
    return true;
  };

  /* Системное уведомление браузера — только если человек сам разрешил
     и вкладка не на виду: показывать поверх открытой страницы незачем. */
  function systemNote(rec) {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;
      if (document.visibilityState === 'visible') return;
      var n = new Notification(rec.title || 'Frostborne', {
        body: rec.body || '',
        tag: rec.id,
        icon: 'assets/images/og-cover.jpg'
      });
      n.onclick = function () {
        try { window.focus(); if (rec.url) location.href = rec.url; } catch (e) {}
        n.close();
      };
    } catch (e) {}
  }

  /* E-13: спрашиваем разрешение только по нажатию. Возвращает итог. */
  N.askPermission = function () {
    if (!('Notification' in window)) return Promise.resolve('unsupported');
    if (Notification.permission === 'granted') return Promise.resolve('granted');
    if (Notification.permission === 'denied') return Promise.resolve('denied');
    try {
      var r = Notification.requestPermission();
      return (r && r.then) ? r : new Promise(function (res) { Notification.requestPermission(res); });
    } catch (e) { return Promise.resolve('denied'); }
  };
  N.permission = function () {
    return ('Notification' in window) ? Notification.permission : 'unsupported';
  };

  /* iPhone честно (E-16): Safari шлёт уведомления только тем страницам,
     которые добавили на домашний экран. Врать про это нельзя — человек
     будет ждать сигнала, которого не будет. */
  N.iosNeedsInstall = function () {
    var ua = navigator.userAgent || '';
    var isIOS = /iPad|iPhone|iPod/.test(ua) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isIOS) return false;
    var installed = window.navigator.standalone === true ||
                    window.matchMedia('(display-mode: standalone)').matches;
    return !installed;
  };

  /* ── счётчик в заголовке вкладки (E-08) ─────────────────────── */
  function paintTab() {
    try {
      if (N._tabBase === null) N._tabBase = document.title.replace(/^\(\d+\)\s*/, '');
      var n = N.unread() + N._extra;
      document.title = n > 0 ? '(' + n + ') ' + N._tabBase : N._tabBase;
    } catch (e) {}
  }

  /* Внешний счётчик: у Эфира свои непрочитанные сообщения чата, и заголовок
     вкладки должен быть один на всех — иначе два куска кода перетирают
     друг друга. */
  N.setExtra = function (n) {
    N._extra = Math.max(0, Number(n) || 0);
    paintTab();
  };

  /* ── колокол (E-01) ─────────────────────────────────────────── */
  function paint() {
    paintTab();
    var host = N._mounted;
    if (!host) return;
    var n = N.unread();
    var btn = host.querySelector('.nb-btn');
    var dot = host.querySelector('.nb-dot');
    if (btn) btn.setAttribute('aria-label', (window.I18N ? I18N.t('nt.bell') : 'Уведомления'));
    if (dot) {
      dot.hidden = n === 0;
      dot.textContent = n > 9 ? '9+' : String(n);
    }
    var panel = host.querySelector('.nb-panel');
    if (panel && !panel.hidden) paintPanel(panel);
  }

  function t(k, fallback) {
    if (!window.I18N) return fallback;
    var v = I18N.t(k);
    return (v === k) ? fallback : v;
  }

  function ago(ts) {
    var d = Date.now() - ts;
    if (d < 60000) return t('fd.justNow', 'только что');
    if (d < 3600000) return t('fd.minAgo', '{n} мин назад').replace('{n}', Math.max(1, Math.round(d / 60000)));
    if (d < 86400000) return t('fd.hourAgo', '{n} ч назад').replace('{n}', Math.round(d / 3600000));
    return t('fd.dayAgo', '{n} дн назад').replace('{n}', Math.round(d / 86400000));
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function paintPanel(panel) {
    var items = N.list();
    var mark = N.readMark();
    var head = '<div class="nb-head"><span>' + esc(t('nt.title', 'Сигналы')) + '</span>' +
      (items.length ? '<button type="button" class="nb-clear">' + esc(t('nt.readAll', 'Прочитано')) + '</button>' : '') +
      '</div>';

    var perm = N.permission();
    var ask = '';
    if (perm === 'default') {
      ask = '<button type="button" class="nb-ask">' + esc(t('nt.allow', 'Разрешить уведомления браузера')) + '</button>';
    } else if (perm === 'denied') {
      ask = '<div class="nb-note">' + esc(t('nt.denied', 'Браузер запретил уведомления для этого узла.')) + '</div>';
    } else if (N.iosNeedsInstall()) {
      ask = '<div class="nb-note">' + esc(t('nt.ios', 'На iPhone сигналы приходят только после добавления сайта на экран «Домой».')) + '</div>';
    }

    if (!items.length) {
      panel.innerHTML = head + ask + '<div class="nb-empty">' + esc(t('nt.empty', 'Пока тихо. Здесь появятся ответы и события станции.')) + '</div>';
      return;
    }
    panel.innerHTML = head + ask + '<div class="nb-list">' + items.map(function (i) {
      var unread = (i.ts || 0) > mark;
      var inner = '<div class="nb-t">' + esc(i.title) + '</div>' +
        (i.body ? '<div class="nb-b">' + esc(i.body) + '</div>' : '') +
        '<div class="nb-m">' + esc(ago(i.ts)) + '</div>';
      return i.url
        ? '<a class="nb-i' + (unread ? ' un' : '') + '" href="' + esc(i.url) + '">' + inner + '</a>'
        : '<div class="nb-i' + (unread ? ' un' : '') + '">' + inner + '</div>';
    }).join('') + '</div>';
  }

  N.mount = function (sel) {
    var host = (typeof sel === 'string') ? document.querySelector(sel) : sel;
    if (!host) return;
    host.classList.add('nb');
    host.innerHTML =
      '<button class="nb-btn" type="button" aria-haspopup="true" aria-expanded="false">' +
        '<span aria-hidden="true">🔔</span><span class="nb-dot" hidden>0</span></button>' +
      '<div class="nb-panel" hidden></div>';
    N._mounted = host;

    var btn = host.querySelector('.nb-btn');
    var panel = host.querySelector('.nb-panel');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.hidden;
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      if (open) { paintPanel(panel); N.markAllRead(); }
      if (window.FrostSFX) { try { FrostSFX.play('tab'); } catch (err) {} }
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('.nb-clear')) {
        e.stopPropagation();
        N._items = []; save(); N.markAllRead(); paintPanel(panel);
        return;
      }
      var ask = e.target.closest('.nb-ask');
      if (ask) {
        e.stopPropagation();
        N.askPermission().then(function () { paintPanel(panel); });
      }
    });

    document.addEventListener('click', function () {
      if (!panel.hidden) { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });

    if (window.I18N) document.addEventListener('i18n:changed', paint);
    paint();
  };

  /* События ленты (D-17 + E): тихие типы не звонят, своё не звонит,
     и первый заход не сыплет историей — только то, что пришло при нас. */
  var feedFloor = 0;
  N.scanFeed = function (list) {
    if (!list || !list.length) return;
    var top = list.reduce(function (m, e) { return Math.max(m, e.ts || 0); }, 0);
    if (!feedFloor) { feedFloor = top; return; }

    list.forEach(function (e) {
      if (!e || !e.id || (e.ts || 0) <= feedFloor) return;
      if (window.FrostAuth && FrostAuth.isMine(e.uid)) return;
      if (window.FrostFeed && FrostFeed.isQuiet(e.t)) return;

      var line = e.a;
      if (window.I18N) {
        var k = 'fd.ev_' + e.t, tpl = I18N.t(k);
        if (tpl !== k) line = tpl.replace('{a}', e.a).replace('{n}', e.n || '');
      }
      N.push({
        id: 'feed:' + e.id, type: 'feed', ts: e.ts,
        title: t('nt.feed', 'На станции: {n}').replace('{n}', line),
        body: e.nick || '', url: 'feed.html'
      });
    });
    feedFloor = top;
  };

  load();
  paintTab();
  window.FrostNotify = N;
})();
