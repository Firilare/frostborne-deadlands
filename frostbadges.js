/* =====================================================================
   FROSTBORNE DEADLANDS — знаки станции (трек J).

   Зачем модуль. Ранг за дни уже есть (A-15), но он один и меняется редко.
   Знаки отмечают разное: пройденный Кодекс, вклад в узел, разгаданную
   загадку, пережитые зимы.

   ⚠ Главное правило (J-16, J-17): знак НЕ хранится в базе и не выдаётся
   кнопкой. Он вычисляется из данных, которые узел и так проверяет —
   рекорда дней, прогресса Кодекса, прочитанных записей, числа сообщений
   и чертежей. Значит:
     • накрутить знак нельзя, не сделав того, за что он даётся;
     • список знаков можно менять, не трогая ничьи профили;
     • «за присутствие» знаков нет вовсе — каждый привязан к делу.

   ⚠ Часть знаков считается по локальным данным (Кодекс, журнал живут в
   браузере). В чужом деле они не показываются — узел о них не знает, и
   рисовать чужой знак по своим данным было бы обманом.

   API:
     FrostBadges.all()             — описание всех знаков
     FrostBadges.earned(ctx)       — какие заслужены
     FrostBadges.ctxLocal()        — собрать контекст из этого браузера
   ===================================================================== */
(function () {
  'use strict';

  var B = {};

  /* Каждый знак — условие над контекстом. `local: true` означает, что данные
     для него лежат только в браузере владельца. */
  var BADGES = [
    { id: 'first_night',  icon: '🌑', color: '#7cceff',
      test: function (c) { return c.best >= 1; } },

    { id: 'ten_days',     icon: '❄',  color: '#7cceff',
      test: function (c) { return c.best >= 10; } },

    { id: 'winter',       icon: '🏔', color: '#34d399',
      test: function (c) { return c.best >= 30; } },

    { id: 'hundred',      icon: '⛰',  color: '#fbbf24',
      test: function (c) { return c.best >= 100; } },

    { id: 'legend',       icon: '☄',  color: '#ef4444',
      test: function (c) { return c.best >= 300; } },

    /* Кодекс: половина и полный */
    { id: 'codex_half',   icon: '◐',  color: '#a8e0ff', local: true,
      test: function (c) { return c.codexTotal > 0 && c.codexDone * 2 >= c.codexTotal; } },

    { id: 'codex_full',   icon: '◉',  color: '#a8e0ff', local: true,
      test: function (c) { return c.codexTotal > 0 && c.codexDone >= c.codexTotal; } },

    /* Журнал: дочитал открытые главы */
    { id: 'reader',       icon: '📖', color: '#c8a86a', local: true,
      test: function (c) { return c.journalRead >= 40; } },

    /* Загадка ICE-17 */
    { id: 'cipher',       icon: '🔑', color: '#a78bfa', local: true, secret: true,
      test: function (c) { return !!c.argSolved; } },

    /* Вклад в узел — считается по данным эфира, а не по словам */
    { id: 'voice',        icon: '📡', color: '#7cceff',
      test: function (c) { return c.msgs >= 50; } },

    { id: 'builder',      icon: '📐', color: '#a8e0ff',
      test: function (c) { return c.bp >= 3; } },

    { id: 'thinker',      icon: '💡', color: '#fbbf24',
      test: function (c) { return c.ideas >= 3; } },

    { id: 'hunter',       icon: '🐞', color: '#34d399',
      test: function (c) { return c.bugs >= 3; } },

    /* Тот, кого слушают: отклики на свои сообщения */
    { id: 'heard',        icon: '❉',  color: '#a78bfa',
      test: function (c) { return c.reacts >= 20; } },

    /* Пережил много смертей и продолжает — это тоже про дело */
    { id: 'stubborn',     icon: '☠',  color: '#ef4444',
      test: function (c) { return c.deaths >= 10 && c.best >= 20; } }
  ];

  B.all = function () { return BADGES.slice(); };

  function num(v) { var n = Number(v); return isFinite(n) && n > 0 ? n : 0; }

  /* Контекст из браузера: то, что знает только это устройство. */
  B.ctxLocal = function () {
    var c = { best: 0, codexDone: 0, codexTotal: 0, journalRead: 0, argSolved: false,
              msgs: 0, ideas: 0, bugs: 0, bp: 0, reacts: 0, deaths: 0 };
    try {
      c.best = num(localStorage.getItem('fb_day_best'));
      var st = String(localStorage.getItem('fb_codex_stat') || '');
      var m = /^(\d+)\/(\d+)$/.exec(st);
      if (m) { c.codexDone = num(m[1]); c.codexTotal = num(m[2]); }
      var bits = String(localStorage.getItem('fb_journal_read') || '');
      c.journalRead = (bits.match(/1/g) || []).length;
      c.argSolved = localStorage.getItem('fb_journal_arg') === '1';
    } catch (e) {}
    return c;
  };

  /* Какие знаки заслужены. Второй аргумент — что из этого показывать:
     'all' (своё дело) или 'public' (чужое, где локальных данных нет). */
  B.earned = function (ctx, scope) {
    ctx = ctx || {};
    var pub = (scope === 'public');
    return BADGES.filter(function (b) {
      if (pub && b.local) return false;
      try { return !!b.test(ctx); } catch (e) { return false; }
    });
  };

  /* Название и пояснение — через i18n, с русским запасом на случай,
     если ключи ещё не заведены. */
  B.name = function (b) {
    var k = 'bdg.' + b.id + '.n';
    if (window.I18N) { var v = I18N.t(k); if (v !== k) return v; }
    return b.id;
  };
  B.hint = function (b) {
    var k = 'bdg.' + b.id + '.h';
    if (window.I18N) { var v = I18N.t(k); if (v !== k) return v; }
    return '';
  };

  /* Разметка витрины (J-06). Одна на все страницы: и профиль, и личное дело. */
  B.html = function (list, opts) {
    opts = opts || {};
    if (!list.length) {
      return '<div class="bdg-none">' +
        (window.I18N ? I18N.t('bdg.none') : 'Знаков пока нет.') + '</div>';
    }
    return '<div class="bdg-row">' + list.map(function (b) {
      var name = String(B.name(b)).replace(/&/g, '&amp;').replace(/</g, '&lt;');
      var hint = String(B.hint(b)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
      return '<span class="bdg" style="--bc:' + b.color + '" title="' + hint + '">' +
        '<i aria-hidden="true">' + b.icon + '</i>' +
        (opts.names === false ? '' : '<b>' + name + '</b>') + '</span>';
    }).join('') + '</div>';
  };

  window.FrostBadges = B;
})();
