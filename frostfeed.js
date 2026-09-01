/* =====================================================================
   FROSTBORNE DEADLANDS — лента станции (трек D).

   Зачем модуль. События узла рождаются в разных местах: гибель заносят
   в Хрониках, чертёж — в Архиве, рекорд — в профиле. Лента должна
   собирать их в одном месте, а виджет на главной — показывать последние.
   Чтобы не копировать одну и ту же запись в трёх файлах, она живёт здесь.

   Что делает:
     • пишет событие в feed/{id} с защитой от накрутки;
     • подписывает страницу на ленту;
     • знает типы событий и их вид (значок, цвет, «тихий» или нет).

   ⚠ Частота (D-19) держится не на совести браузера, а на правилах базы.
   Событие принимается, только если его ts совпадает с feedLast/{uid},
   а эту ветку правила разрешают двигать не чаще раза в 20 секунд.
   Поэтому порядок записи ровно такой: сперва замок, потом событие.
   Убрать замок из кода нельзя — база откажет.

   ⚠ Событие пишет САМ автор под своим uid: правила требуют
   uid === auth.uid. Системных событий «от станции» тут нет и быть не
   может — иначе любой смог бы писать от её имени.

   API:
     FrostFeed.attach(db, dbMod)          — подключить к Firebase
     FrostFeed.post(type, {a, b, n})      — записать событие
     FrostFeed.subscribe(fn, limit)       — слушать ленту, вернёт отписку
     FrostFeed.TYPES                      — описание типов
     FrostFeed.isQuiet(type)              — «тихий» тип (D-17)
   ===================================================================== */
(function () {
  'use strict';

  var F = { db: null, m: null, _last: 0 };

  /* Типы событий (D-02). Тихие не кричат: их рисуют мельче и они не идут
     в уведомления — иначе лента превращается в шум. */
  var TYPES = {
    release:   { icon: '📡', color: '#7cceff', quiet: false },
    record:    { icon: '🏔', color: '#34d399', quiet: false },
    blueprint: { icon: '📐', color: '#a8e0ff', quiet: false },
    death:     { icon: '☠',  color: '#ef4444', quiet: true  },
    idea:      { icon: '💡', color: '#fbbf24', quiet: true  },
    post:      { icon: '📌', color: '#a78bfa', quiet: false }
  };

  F.TYPES = TYPES;
  F.isQuiet = function (t) { return !!(TYPES[t] && TYPES[t].quiet); };
  F.known = function (t) { return Object.prototype.hasOwnProperty.call(TYPES, t); };

  F.attach = function (db, dbMod) { F.db = db; F.m = dbMod; };
  F.live = function () { return !!(F.db && F.m); };

  function uid() {
    return (window.FrostAuth && FrostAuth.uid()) || '';
  }
  function signedIn() {
    return !!(window.FrostAuth && FrostAuth.state() !== 'local');
  }

  /* Одно и то же событие не должно попадать в ленту дважды: человек мог
     нажать «Погиб» и обновить страницу. Помним подпись последнего в браузере. */
  function seen(sig) {
    try {
      var raw = localStorage.getItem('fb_feed_sent') || '';
      if (raw.indexOf(sig) >= 0) return true;
      var arr = raw ? raw.split('|') : [];
      arr.push(sig);
      localStorage.setItem('fb_feed_sent', arr.slice(-20).join('|'));
    } catch (e) {}
    return false;
  }

  /* Записать событие. Возвращает 'ok' | 'skip' | 'often' | 'off'.
     Ошибку не выбрасываем: лента — вещь второстепенная, и падение записи
     не должно ломать то действие, ради которого человек пришёл. */
  F.post = function (type, payload) {
    payload = payload || {};
    if (!F.live() || !signedIn()) return Promise.resolve('off');
    if (!F.known(type)) return Promise.resolve('off');

    var me = uid();
    var nick = String(payload.nick || (window.FrostAuth && FrostAuth._profile && FrostAuth._profile.nick) || '').slice(0, 24);
    if (!me || !nick) return Promise.resolve('off');

    var a = String(payload.a || '').slice(0, 120);
    if (!a) return Promise.resolve('off');

    var sig = type + ':' + a + ':' + (payload.n || 0);
    if (payload.once !== false && seen(sig)) return Promise.resolve('skip');

    // Замок частоты: без него база не примет событие (см. шапку файла).
    var ts = Date.now();
    return F.m.set(F.m.ref(F.db, 'feedLast/' + me), ts)
      .then(function () {
        var rec = { t: type, ts: ts, uid: me, nick: nick, a: a };
        var b = String(payload.b || '').slice(0, 300);
        if (b) rec.b = b;
        var n = Number(payload.n);
        if (isFinite(n) && n > 0) rec.n = Math.min(999999, Math.round(n));
        return F.m.push(F.m.ref(F.db, 'feed'), rec);
      })
      .then(function () { return 'ok'; })
      .catch(function (e) {
        var code = (e && e.code) || '';
        // PERMISSION_DENIED на замке = событие идёт слишком часто
        console.warn('FrostFeed: событие не записано', code || e);
        return code.indexOf('PERMISSION') >= 0 ? 'often' : 'off';
      });
  };

  /* Подписка на ленту. limit — сколько последних событий держать. */
  F.subscribe = function (fn, limit) {
    if (!F.live()) return function () {};
    var q = F.m.query(F.m.ref(F.db, 'feed'), F.m.limitToLast(limit || 60));
    var off = F.m.onValue(q, function (snap) {
      var v = snap.val() || {};
      var list = Object.keys(v).map(function (id) {
        var e = v[id] || {};
        return {
          id: id, t: e.t, ts: Number(e.ts) || 0, uid: e.uid || '',
          nick: e.nick || '', a: e.a || '', b: e.b || '',
          n: Number(e.n) || 0, r: e.r || null, c: e.c || null
        };
      }).filter(function (e) { return F.known(e.t) && e.a; })
        .sort(function (x, y) { return y.ts - x.ts; });
      try { fn(list); } catch (err) { console.warn('FrostFeed render', err); }
    }, function (err) {
      console.warn('FrostFeed: лента недоступна', err && err.code);
      try { fn(null); } catch (e) {}
    });
    return off;
  };

  /* ── прочитано до (D-07) ──────────────────────────────────────
     Метка живёт в браузере, а не в базе: «докуда я дочитал» — личное дело
     этого устройства, и хранить его на узле незачем.

     ⚠ Метка ставится не при загрузке страницы, а когда человек её реально
     увидел (см. markSeen в feed.html). Иначе фоновая вкладка «прочитывала»
     бы события, которых никто не читал. */
  var LS_SEEN = 'fb_feed_seen';

  F.seen = function () {
    try { return Number(localStorage.getItem(LS_SEEN)) || 0; } catch (e) { return 0; }
  };
  F.markSeen = function (ts) {
    var v = Math.max(F.seen(), Number(ts) || 0);
    try { localStorage.setItem(LS_SEEN, String(v)); } catch (e) {}
    return v;
  };

  /* Сколько событий появилось с прошлого захода. Своё не считаем: человек
     и так знает, что он сделал, — иначе бейдж загорался бы от собственных
     действий. */
  F.countNew = function (list, since) {
    if (!list || !list.length) return 0;
    var mark = (since === undefined) ? F.seen() : since;
    if (!mark) return 0;
    var mine = window.FrostAuth;
    return list.filter(function (e) {
      if (e.ts <= mark) return false;
      if (mine && FrostAuth.isMine(e.uid)) return false;
      return true;
    }).length;
  };

  /* Лёгкая проверка «есть ли новое» для страниц, которым лента не нужна
     целиком — главной и Эфиру. Читает разово, без подписки. */
  F.peekNew = function (fn) {
    if (!F.live()) { fn(0); return; }
    var q = F.m.query(F.m.ref(F.db, 'feed'), F.m.limitToLast(40));
    F.m.get(q).then(function (snap) {
      var v = snap.val() || {};
      var list = Object.keys(v).map(function (id) {
        var e = v[id] || {};
        return { ts: Number(e.ts) || 0, uid: e.uid || '', t: e.t };
      }).filter(function (e) { return F.known(e.t); });
      fn(F.countNew(list));
    }).catch(function () { fn(0); });
  };

  /* Реакция на событие (D-10) — по образцу апвоутов идей. */
  F.react = function (id, on) {
    if (!F.live() || !signedIn() || !id) return Promise.resolve(false);
    var me = uid();
    return F.m.set(F.m.ref(F.db, 'feed/' + id + '/r/' + me), on ? 1 : null)
      .then(function () { return true; })
      .catch(function (e) { console.warn('FrostFeed react', e && e.code); return false; });
  };

  /* ── комментарии к событию (D-09) ─────────────────────────────
     Живут внутри события (feed/{id}/c), а не отдельной веткой: комментарий
     без события бессмыслен, и удалять их надо вместе. */
  F.comments = function (e) {
    if (!e || !e.c) return [];
    return Object.keys(e.c).map(function (id) {
      var c = e.c[id] || {};
      return { id: id, uid: c.uid || '', nick: c.nick || '', m: c.m || '', ts: Number(c.ts) || 0 };
    }).filter(function (c) { return c.m; })
      .sort(function (a, b) { return a.ts - b.ts; });
  };

  F.comment = function (eventId, text, nick) {
    if (!F.live() || !signedIn() || !eventId) return Promise.resolve(false);
    var m = String(text || '').trim().slice(0, 300);
    var who = String(nick || '').slice(0, 24);
    if (!m || !who) return Promise.resolve(false);
    return F.m.push(F.m.ref(F.db, 'feed/' + eventId + '/c'), {
      uid: uid(), nick: who, m: m, ts: Date.now()
    }).then(function () { return true; })
      .catch(function (err) { console.warn('FrostFeed comment', err && err.code); return false; });
  };

  window.FrostFeed = F;
})();
