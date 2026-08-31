/* =====================================================================
   FROSTBORNE DEADLANDS — личность выжившего (трек A).

   Зачем модуль. До этого личность жила только в localStorage: сменил
   браузер — стал другим человеком, а база не умела отличить одного
   выжившего от другого. Без постоянного uid не построить ни личные
   сообщения, ни кланы, ни репутацию.

   Что делает:
     • входит в Firebase анонимно и получает постоянный uid;
     • помнит СТАРЫЙ локальный uid и считает своим и его тоже —
       иначе у людей отвязались бы их сообщения, голоса и реакции;
     • держит профиль в ветке users/{uid};
     • умеет закрепить личность за Google-аккаунтом (A-06).

   ⚠ Работает мягко: если анонимный вход выключен в консоли Firebase
   или база недоступна, модуль молча остаётся на локальном uid и узел
   ведёт себя ровно как раньше. Ничего не ломается.

   API:
     FrostAuth.attach(app, authMod, dbMod, db)  — подключить к Firebase
     FrostAuth.uid()        — текущий uid (auth или локальный)
     FrostAuth.legacy()     — старый локальный uid, если он был
     FrostAuth.isMine(uid)  — этот uid принадлежит мне?
     FrostAuth.ready(fn)    — вызвать, когда личность определена
     FrostAuth.linkGoogle() — закрепить личность за Google
     FrostAuth.saveProfile(obj) / FrostAuth.loadProfile(uid)
     FrostAuth.state()      — 'local' | 'anon' | 'linked'
   ===================================================================== */
(function () {
  'use strict';

  var LS_UID = 'fb_uid';          // тот же ключ, что и раньше — ничего не теряем
  var LS_LEGACY = 'fb_uid_legacy';

  function lsGet(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // Локальный uid остаётся запасным вариантом и «памятью» о прошлом
  var localUid = lsGet(LS_UID) || ('s-' + Math.random().toString(36).slice(2, 10));
  lsSet(LS_UID, localUid);

  var A = {
    app: null, auth: null, authMod: null, dbMod: null, db: null,
    user: null,
    _uid: localUid,
    _legacy: lsGet(LS_LEGACY) || '',
    _state: 'local',
    _nickKey: '',
    _ready: false,
    _queue: [],
    _profile: null
  };

  function fire() {
    A._ready = true;
    var q = A._queue.slice();
    A._queue.length = 0;
    q.forEach(function (fn) { try { fn(A._uid); } catch (e) { console.warn('FrostAuth ready', e); } });
    try {
      document.dispatchEvent(new CustomEvent('frostauth:ready', {
        detail: { uid: A._uid, state: A._state }
      }));
    } catch (e) {}
  }

  /* Личность определилась: запоминаем uid и — единожды — старый локальный,
     чтобы прошлые сообщения и голоса остались «своими». */
  function applyUser(user) {
    A.user = user || null;
    if (!user) { A._state = 'local'; A._uid = localUid; return; }

    if (user.uid !== localUid && !A._legacy && localUid.indexOf('s-') === 0) {
      A._legacy = localUid;
      lsSet(LS_LEGACY, A._legacy);
    }
    A._uid = user.uid;
    lsSet(LS_UID, user.uid);

    var anon = !!user.isAnonymous;
    A._state = anon ? 'anon' : 'linked';
  }

  /* ── подключение ──────────────────────────────────────────────── */
  A.attach = function (app, authMod, dbMod, db) {
    A.app = app; A.authMod = authMod; A.dbMod = dbMod; A.db = db;
    try {
      A.auth = authMod.getAuth(app);
    } catch (e) {
      console.warn('FrostAuth: auth недоступен', e);
      fire(); return Promise.resolve(A._uid);
    }

    return new Promise(function (resolve) {
      var settled = false;
      var done = function () {
        if (settled) return;
        settled = true;
        fire();
        resolve(A._uid);
      };

      authMod.onAuthStateChanged(A.auth, function (user) {
        if (user) {
          applyUser(user);
          done();
          return;
        }
        // Пользователя нет — пробуем войти анонимно.
        authMod.signInAnonymously(A.auth).catch(function (err) {
          // Самая частая причина: анонимный вход не включён в консоли.
          // Это не ошибка узла — просто остаёмся на локальном uid.
          var code = err && err.code ? err.code : '';
          if (code !== 'auth/operation-not-allowed') console.warn('FrostAuth: вход', code || err);
          A._state = 'local';
          done();
        });
      });

      // Страховка: если Firebase молчит, узел не должен ждать вечно
      setTimeout(done, 6000);
    });
  };

  /* ── кто я ────────────────────────────────────────────────────── */
  A.uid = function () { return A._uid; };
  A.legacy = function () { return A._legacy; };
  A.state = function () { return A._state; };
  A.isAnon = function () { return A._state === 'anon'; };
  A.isLinked = function () { return A._state === 'linked'; };

  /* Своим считается и старый локальный uid: иначе человек потерял бы
     авторство своих прежних сообщений и смог бы проголосовать дважды. */
  A.isMine = function (uid) {
    if (!uid) return false;
    return uid === A._uid || (!!A._legacy && uid === A._legacy);
  };

  A.ready = function (fn) {
    if (typeof fn !== 'function') return;
    if (A._ready) { fn(A._uid); return; }
    A._queue.push(fn);
  };

  /* ── закрепить личность за Google (A-06) ──────────────────────
     Именно link, а не вход заново: uid сохраняется, вместе с ним
     остаётся всё нажитое — дни, прогресс, авторство сообщений. */
  A.linkGoogle = function () {
    if (!A.auth || !A.authMod) return Promise.reject(new Error('no-auth'));
    var provider = new A.authMod.GoogleAuthProvider();
    var cur = A.auth.currentUser;

    if (cur && cur.isAnonymous) {
      return A.authMod.linkWithPopup(cur, provider).then(function (res) {
        applyUser(res.user);
        return res.user;
      }).catch(function (err) {
        // Этот Google-аккаунт уже привязан к другой личности на узле.
        // Тогда просто входим им — но честно говорим, что анонимная
        // личность останется в стороне.
        if (err && err.code === 'auth/credential-already-in-use') {
          return A.authMod.signInWithPopup(A.auth, provider).then(function (res) {
            applyUser(res.user);
            return res.user;
          });
        }
        throw err;
      });
    }
    return A.authMod.signInWithPopup(A.auth, provider).then(function (res) {
      applyUser(res.user);
      return res.user;
    });
  };

  A.signOut = function () {
    if (!A.auth || !A.authMod) return Promise.resolve();
    return A.authMod.signOut(A.auth);
  };

  /* ── профиль в базе ───────────────────────────────────────────── */
  A.saveProfile = function (obj) {
    if (!A.db || !A.dbMod || A._state === 'local') return Promise.resolve(false);
    var pv = A.privacy();
    var base = {
      nick: String(obj.nick || '').slice(0, 16),
      status: String(obj.status || '').slice(0, 24),
      cls: String(obj.cls || '').slice(0, 24),
      fac: String(obj.fac || '').slice(0, 24),
      day: Math.max(0, Math.min(9999, Number(obj.day) || 0)),
      best: Math.max(0, Math.min(9999, Number(obj.best) || 0)),
      priv: (pv.day ? 1 : 0) + (pv.best ? 2 : 0) + (pv.cls ? 4 : 0) +
            (pv.fac ? 8 : 0) + (pv.status ? 16 : 0) + (pv.stats ? 32 : 0),
      ts: Date.now()
    };
    var ava = String(obj.ava || '').slice(0, 300);
    if (ava && ava !== 'skin') base.ava = ava;
    if (A._legacy) base.legacy = A._legacy.slice(0, 64);

    /* Транзакция, а не set: старый позывной и дату первого входа надо взять
       из того, что уже лежит в базе. Профиль в памяти после перезагрузки
       страницы пуст, и на него полагаться нельзя — история бы терялась. */
    var ref = A.dbMod.ref(A.db, 'users/' + A._uid);
    return A.dbMod.runTransaction(ref, function (cur) {
      var rec = Object.assign({}, base);

      /* A-13: позывной сменился — прошлый уходит в историю.
         Так «переобувшегося» видно: дело помнит, кем он был. */
      var prev = [];
      if (cur && cur.prev) {
        prev = Array.isArray(cur.prev) ? cur.prev.slice() : Object.keys(cur.prev).map(function (k) { return cur.prev[k]; });
      }
      if (cur && cur.nick && cur.nick !== rec.nick && prev.indexOf(cur.nick) < 0) prev.push(cur.nick);
      prev = prev.filter(function (n) { return typeof n === 'string' && n && n !== rec.nick; }).slice(-5);
      if (prev.length) rec.prev = prev;

      rec.first = (cur && Number(cur.first)) ? Number(cur.first) : Date.now();
      return rec;
    }).then(function (res) {
      var ok = !!(res && res.committed);
      if (ok && res.snapshot) A._profile = res.snapshot.val();
      return ok;
    }).catch(function (e) {
      console.warn('FrostAuth: профиль не сохранён', e && e.code);
      return false;
    });
  };

  /* ── позывные (A-12) ─────────────────────────────────────────
     Индекс nicks/{ключ} -> uid. Ключ — позывной в нижнем регистре, чтобы
     «Firilare» и «firilare» не оказались разными людьми. */
  A.nickKey = function (nick) {
    return String(nick || '').trim().toLowerCase().replace(/[.#$\[\]\/]/g, '_').slice(0, 32);
  };

  /* Кто занял позывной: uid или null. */
  A.whoHasNick = function (nick) {
    var key = A.nickKey(nick);
    if (!key || !A.db || !A.dbMod) return Promise.resolve(null);
    return A.dbMod.get(A.dbMod.ref(A.db, 'nicks/' + key))
      .then(function (snap) { return snap.exists() ? snap.val() : null; })
      .catch(function () { return null; });
  };

  /* Свободен ли позывной для меня: свободен вообще или уже мой. */
  A.nickFree = function (nick) {
    return A.whoHasNick(nick).then(function (owner) {
      return !owner || owner === A._uid;
    });
  };

  /* Занять позывной. Транзакция, потому что двое могут нажать «сохранить»
     одновременно — выиграет тот, кто успел первым. */
  A.claimNick = function (nick) {
    var key = A.nickKey(nick);
    if (!key || !A.db || !A.dbMod || A._state === 'local') return Promise.resolve(false);
    var me = A._uid;
    var ref = A.dbMod.ref(A.db, 'nicks/' + key);

    return A.dbMod.runTransaction(ref, function (cur) {
      if (cur === null || cur === me) return me;
      return undefined;              // занято другим — транзакция отменяется
    }).then(function (res) {
      var ok = !!(res && res.committed && res.snapshot && res.snapshot.val() === me);
      if (ok && A._nickKey && A._nickKey !== key) {
        // старый позывной освобождаем, чтобы он не висел за нами вечно
        A.dbMod.set(A.dbMod.ref(A.db, 'nicks/' + A._nickKey), null).catch(function () {});
      }
      if (ok) A._nickKey = key;
      return ok;
    }).catch(function (e) {
      console.warn('FrostAuth: позывной', e && e.code);
      return false;
    });
  };

  /* Маска приватности профиля: одно число вместо пяти полей — правилам проще,
     а читателю всё равно нужен разбор на стороне страницы. */
  A.unpackPriv = function (n) {
    n = Number(n);
    if (!isFinite(n)) n = 63;                 // старые профили — всё открыто
    return {
      day: !!(n & 1), best: !!(n & 2), cls: !!(n & 4),
      fac: !!(n & 8), status: !!(n & 16), stats: !!(n & 32)
    };
  };

  A.loadProfile = function (uid) {
    if (!A.db || !A.dbMod) return Promise.resolve(null);
    return A.dbMod.get(A.dbMod.ref(A.db, 'users/' + (uid || A._uid)))
      .then(function (snap) { return snap.exists() ? snap.val() : null; })
      .catch(function () { return null; });
  };

  /* ── приватность профиля (A-11) ───────────────────────────────
     По умолчанию открыто всё, кроме ничего: узел и так публичный,
     но человек вправе спрятать день и рекорд. */
  var LS_PRIV = 'fb_privacy';
  var PRIV_DEFAULT = { day: 1, best: 1, cls: 1, fac: 1, status: 1, stats: 1 };

  A.privacy = function () {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_PRIV) || 'null');
      if (raw && typeof raw === 'object') return Object.assign({}, PRIV_DEFAULT, raw);
    } catch (e) {}
    return Object.assign({}, PRIV_DEFAULT);
  };

  A.setPrivacy = function (obj) {
    var p = Object.assign(A.privacy(), obj || {});
    try { localStorage.setItem(LS_PRIV, JSON.stringify(p)); } catch (e) {}
    return p;
  };

  /* ── чёрный список (A-23) ─────────────────────────────────────
     Живёт только в браузере: это личное дело каждого, а не общая метка. */
  var LS_MUTE = 'fb_muted';

  A.muted = function () {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_MUTE) || '[]');
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  };
  A.isMuted = function (uid) { return !!uid && A.muted().indexOf(uid) !== -1; };
  A.mute = function (uid) {
    if (!uid || A.isMine(uid)) return A.muted();          // себя не заглушить
    var list = A.muted();
    if (list.indexOf(uid) === -1) list.push(uid);
    try { localStorage.setItem(LS_MUTE, JSON.stringify(list.slice(0, 200))); } catch (e) {}
    return list;
  };
  A.unmute = function (uid) {
    var list = A.muted().filter(function (x) { return x !== uid; });
    try { localStorage.setItem(LS_MUTE, JSON.stringify(list)); } catch (e) {}
    return list;
  };

  /* ── выгрузка всего нажитого (A-18) ───────────────────────────
     Собираем и то, что в браузере, и профиль из базы. */
  A.exportData = function () {
    var local = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf('fb_') === 0 || k.indexOf('frostborne_') === 0)) {
          local[k] = localStorage.getItem(k);
        }
      }
    } catch (e) {}

    return A.loadProfile().then(function (profile) {
      return {
        exported: new Date().toISOString(),
        node: 'Frostborne Deadlands',
        identity: { uid: A._uid, legacy: A._legacy || null, state: A._state },
        profile: profile || null,
        browser: local
      };
    });
  };

  /* ── стереть личность (A-19) ──────────────────────────────────
     Убираем профиль, освобождаем позывной и чистим браузер. Сообщения
     в общем эфире остаются: правила не дают править чужие записи, и
     обещать их удаление было бы неправдой — об этом говорит интерфейс. */
  A.deleteIdentity = function () {
    if (!A.db || !A.dbMod || A._state === 'local') return wipeLocal();

    /* ⚠ Позывной надо освободить ДО удаления аккаунта, иначе он останется
       висеть за мёртвым uid: занять его не сможет ни новый человек (ключ занят),
       ни прежний (аккаунта больше нет). Ключ ищем в памяти, в браузере и в самом
       профиле — после перезагрузки страницы A._nickKey пуст. */
    var uid = A._uid;
    return A.loadProfile(uid).then(function (p) {
      var keys = {};
      if (A._nickKey) keys[A._nickKey] = 1;
      var lsNick = lsGet('fb_nick');
      if (lsNick) keys[A.nickKey(lsNick)] = 1;
      if (p && p.nick) keys[A.nickKey(p.nick)] = 1;

      var jobs = [A.dbMod.set(A.dbMod.ref(A.db, 'users/' + uid), null).catch(function () {})];
      Object.keys(keys).forEach(function (k) {
        if (!k) return;
        // чужой ключ трогать нельзя — правила и не дадут, но проверим сами
        jobs.push(
          A.dbMod.get(A.dbMod.ref(A.db, 'nicks/' + k)).then(function (sn) {
            if (sn.exists() && sn.val() === uid) {
              return A.dbMod.set(A.dbMod.ref(A.db, 'nicks/' + k), null);
            }
          }).catch(function () {})
        );
      });
      return Promise.all(jobs);
    }).then(wipeLocal);
  };

  function wipeLocal() {
    return Promise.resolve().then(function () {
      try {
        var kill = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && (k.indexOf('fb_') === 0 || k.indexOf('frostborne_') === 0)) kill.push(k);
        }
        kill.forEach(function (k) { localStorage.removeItem(k); });
      } catch (e) {}
      // аккаунт в Firebase удаляем последним: после него доступ к базе пропадёт
      var u = A.auth && A.auth.currentUser;
      if (u && u.delete) return u.delete().catch(function () {});
    });
  }

  /* ── ранг удостоверения (A-15) ────────────────────────────────
     Рамка не выбирается в настройках, а зарабатывается: иначе она перестаёт
     что-либо значить. Считается по личному рекорду дней — это единственное
     достижение, которое лежит в базе и потому видно и в чужом деле.
     Прогресс Кодекса живёт в браузере, поэтому он добавляет отметку только
     владельцу дела (см. 2.29 про чужой прогресс). */
  var RANKS = [
    { id: 'novice',  days: 0,   color: '#4a5d70' },
    { id: 'holder',  days: 10,  color: '#7cceff' },
    { id: 'veteran', days: 30,  color: '#34d399' },
    { id: 'keeper',  days: 100, color: '#fbbf24' },
    { id: 'legend',  days: 300, color: '#ef4444' }
  ];

  A.rank = function (best) {
    var d = Math.max(0, Number(best) || 0), r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (d >= RANKS[i].days) r = RANKS[i];
    return r;
  };
  A.ranks = function () { return RANKS.slice(); };

  /* ── аватар (A-14) ────────────────────────────────────────────
     Три источника: скин Minecraft по позывному, свой кадр по ссылке или
     знак, который станция рисует сама. Файлы мы по-прежнему не храним —
     ссылка остаётся у автора, как в архиве чертежей.

     ⚠ Чужая ссылка грузится с crossOrigin='anonymous'. Если сервер не отдаёт
     CORS-заголовки, картинка просто не загрузится — и это правильно: без
     этого флага холст удостоверения стал бы «грязным» и перестал бы
     сохраняться в PNG. Не загрузилось — рисуем знак. */
  var AVA_SKIN = 'skin', AVA_SIGIL = 'sigil';
  var sigilCache = {};

  A.avaMode = function (ava) {
    var v = String(ava || '');
    if (v === AVA_SIGIL) return AVA_SIGIL;
    if (v.indexOf('https://') === 0) return 'url';
    return AVA_SKIN;
  };

  /* Знак выжившего: детерминированный рисунок из uid. Один и тот же человек
     всегда получает свой знак, разные — разные. */
  A.sigil = function (seed, size) {
    size = size || 96;
    var key = seed + '|' + size;
    if (sigilCache[key]) return sigilCache[key];

    var str = String(seed || 'frostborne');
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    function rnd() {
      h ^= h << 13; h >>>= 0;
      h ^= h >>> 17;
      h ^= h << 5;  h >>>= 0;
      return h / 4294967296;
    }

    var PAL = ['#7cceff', '#a8e0ff', '#3a86ff', '#34d399', '#fbbf24', '#ef4444'];
    var main = PAL[Math.floor(rnd() * PAL.length)];
    var alt = PAL[Math.floor(rnd() * PAL.length)];

    var c, cx;
    try {
      c = document.createElement('canvas');
      c.width = c.height = size;
      cx = c.getContext('2d');
    } catch (e) { return ''; }

    var g = cx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#0d1a28'); g.addColorStop(1, '#070d16');
    cx.fillStyle = g; cx.fillRect(0, 0, size, size);

    // сетка 5x5, симметричная по вертикали — знак, а не шум
    var pad = Math.round(size * 0.14), cell = (size - pad * 2) / 5;
    for (var y = 0; y < 5; y++) {
      for (var x = 0; x < 3; x++) {
        if (rnd() < 0.46) continue;
        cx.fillStyle = rnd() < 0.28 ? alt : main;
        cx.globalAlpha = 0.55 + rnd() * 0.45;
        var w = Math.ceil(cell);
        cx.fillRect(Math.round(pad + x * cell), Math.round(pad + y * cell), w, w);
        if (x < 2) cx.fillRect(Math.round(pad + (4 - x) * cell), Math.round(pad + y * cell), w, w);
      }
    }
    cx.globalAlpha = 1;

    cx.strokeStyle = 'rgba(124,206,255,.35)';
    cx.lineWidth = Math.max(1, size * 0.02);
    cx.strokeRect(cx.lineWidth, cx.lineWidth, size - cx.lineWidth * 2, size - cx.lineWidth * 2);

    var url = '';
    try { url = c.toDataURL('image/png'); } catch (e) { return ''; }
    sigilCache[key] = url;
    return url;
  };

  /* Куда смотреть за картинкой: сам решает по режиму. */
  A.avatarUrl = function (ava, nick, uid, size) {
    size = size || 96;
    var mode = A.avaMode(ava);
    if (mode === 'url') return String(ava);
    if (mode === AVA_SIGIL) return A.sigil(uid || nick || 'frost', size);
    return 'https://minotar.net/armor/bust/' + encodeURIComponent(nick || 'Steve') + '/' + size + '.png';
  };

  /* ── личная статистика (A-17) ─────────────────────────────────
     Считается чтением веток, а не счётчиками в профиле: счётчик пишет сам
     человек, а значит его можно накрутить. Прочитанное из чата и форума
     врать не умеет.

     ⚠ Чат берётся последними 2000 сообщениями. Пока их сотни — цифра точная;
     если лента когда-нибудь перерастёт этот предел, здесь понадобится
     счётчик в профиле, и тогда его придётся защищать правилами.

     Смерти ищутся по позывному: в chronicle/deaths нет uid — там только ник. */
  A.stats = function (uid, legacy, nick) {
    if (!A.db || !A.dbMod) return Promise.resolve(null);
    var D = A.dbMod, db = A.db;
    var ids = [uid || A._uid];
    if (legacy) ids.push(legacy);

    function own(u) { return !!u && ids.indexOf(u) >= 0; }
    function votes(v) { return v && typeof v === 'object' ? Object.keys(v).length : 0; }
    function vals(snap) { var v = snap && snap.val(); return v ? Object.keys(v).map(function (k) { return v[k]; }) : []; }

    var chatRef = D.query(D.ref(db, 'aether/chat'), D.limitToLast(2000));
    var jobs = [
      D.get(chatRef),
      D.get(D.ref(db, 'aether/ideas')),
      D.get(D.ref(db, 'aether/bugs')),
      D.get(D.ref(db, 'aether/blueprints')),
      D.get(D.ref(db, 'chronicle/deaths'))
    ].map(function (p) { return p.catch(function () { return null; }); });

    return Promise.all(jobs).then(function (r) {
      var st = { msgs: 0, reacts: 0, ideas: 0, ideaVotes: 0, bugs: 0, bugsSolved: 0,
                 bp: 0, bpVotes: 0, deaths: 0, first: 0 };

      function mark(ts) { if (ts && (!st.first || ts < st.first)) st.first = ts; }

      vals(r[0]).forEach(function (m) {
        if (!own(m && m.uid)) return;
        st.msgs++; st.reacts += votes(m.r); mark(m.ts);
      });
      vals(r[1]).forEach(function (i) {
        if (!own(i && i.uid)) return;
        st.ideas++; st.ideaVotes += votes(i.votes); mark(i.ts);
      });
      vals(r[2]).forEach(function (b) {
        if (!own(b && b.uid)) return;
        st.bugs++; if (b.status === 'solved') st.bugsSolved++; mark(b.ts);
      });
      vals(r[3]).forEach(function (b) {
        if (!own(b && b.uid)) return;
        st.bp++; st.bpVotes += votes(b.votes); mark(b.ts);
      });
      if (nick) {
        vals(r[4]).forEach(function (d) {
          if (d && d.nick === nick) { st.deaths++; mark(d.ts); }
        });
      }
      return st;
    }).catch(function (e) {
      console.warn('FrostAuth: статистика', e && e.code);
      return null;
    });
  };

  /* Профиль по позывному — для публичной страницы выжившего (A-09). */
  A.profileByNick = function (nick) {
    return A.whoHasNick(nick).then(function (uid) {
      if (!uid) return null;
      return A.loadProfile(uid).then(function (p) {
        return p ? Object.assign({ uid: uid }, p) : null;
      });
    });
  };

  window.FrostAuth = A;
})();
