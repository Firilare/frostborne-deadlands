/* =====================================================================
   FROSTBORNE DEADLANDS — внешний собеседник для МОРОЗ-01.

   Зачем. У МОРОЗ-01 есть 21 заготовленная тема и весь Кодекс — этого
   хватает на вопросы про сборку, но не на всё остальное. Модуль
   подключает языковую модель как ЗАПАСНОЙ вариант: только когда свои
   данные молчат.

   ⚠ Порядок принципиален: сначала база знаний, потом Кодекс, и лишь
   затем внешняя модель. Своё отвечает точно и мгновенно; чужая модель
   про эту сборку не знает ничего и начнёт выдумывать рецепты. Менять
   порядок — значит менять справочник на генератор правдоподобного.

   ⚠ Вопрос уходит на сторонний сервис, поэтому:
     • скрипт грузится ТОЛЬКО после явного согласия человека;
     • согласие спрашивается один раз и запоминается (fb_ai_ok);
     • до согласия ни одного байта наружу не уходит.
   Это прямо следует из устава станции: мы обещали, что данные не
   уезжают на сторону, — значит обязаны спросить, прежде чем нарушить
   это в конкретном случае.

   ⚠ Ключей у нас нет и быть не может: сайт статический, любой ключ в
   коде виден всем. Поэтому используется сервис, который берёт оплату с
   конечного пользователя, а не с владельца узла.

   ⚠ У сервиса СВОЁ окно согласия. Проверено вживую: первый вызов
   `puter.ai.chat` вставляет в страницу элемент `<puter-dialog>` с текстом
   «Continue / Cancel» и ссылками на его Terms of Service. Оно на английском
   и в чужом оформлении — поэтому наш текст согласия предупреждает об этом
   заранее, иначе белое окно посреди станции выглядит как взлом. Пока человек
   его читает, ответа нет: отсюда длинное ожидание ниже, а не 20 секунд.

   API:
     FrostAI.enabled()        — согласие получено?
     FrostAI.allow() / deny()
     FrostAI.ask(q)           — Promise<string|null>, null = не вышло
   ===================================================================== */
(function () {
  'use strict';

  var A = { _loading: false, _ready: false };
  var LS_OK = 'fb_ai_ok';
  var SRC = 'https://js.puter.com/v2/';

  /* Характер МОРОЗ-01 задаётся здесь, а не в вопросе: модель должна
     отвечать голосом станции и честно говорить, когда не знает. */
  var SYSTEM =
    'Ты — МОРОЗ-01, повреждённый ИИ полярной станции «Буран» из модпака ' +
    'Frostborne Deadlands для Minecraft 1.20.1 (Forge). Отвечай коротко, ' +
    'по делу, в сдержанном тоне выжившего. Не выдумывай рецепты, предметы ' +
    'и механики этой сборки: если не уверен — скажи прямо, что данных нет, ' +
    'и посоветуй Кодекс станции. Отвечай на языке вопроса. Максимум 4 предложения.';

  A.enabled = function () {
    try { return localStorage.getItem(LS_OK) === '1'; } catch (e) { return false; }
  };
  A.allow = function () { try { localStorage.setItem(LS_OK, '1'); } catch (e) {} };
  A.deny = function () { try { localStorage.setItem(LS_OK, '0'); } catch (e) {} };
  A.asked = function () {
    try { return localStorage.getItem(LS_OK) !== null; } catch (e) { return false; }
  };

  function load() {
    if (A._ready) return Promise.resolve(true);
    if (A._loading) {
      return new Promise(function (res) {
        var t = setInterval(function () {
          if (!A._loading) { clearInterval(t); res(A._ready); }
        }, 150);
      });
    }
    A._loading = true;
    return new Promise(function (res) {
      var sc = document.createElement('script');
      sc.src = SRC;
      sc.async = true;
      sc.onload = function () {
        A._loading = false;
        A._ready = !!(window.puter && window.puter.ai);
        res(A._ready);
      };
      sc.onerror = function () {
        A._loading = false;
        A._ready = false;
        res(false);
      };
      document.head.appendChild(sc);
    });
  }

  /* Спросить модель. Возвращает текст или null — вызывающая сторона сама
     решает, что показать; молча подставлять «ошибка сети» в диалог ИИ
     нельзя, это выглядит как ответ станции. */
  A.ask = function (question) {
    var q = String(question || '').trim().slice(0, 500);
    if (!q || !A.enabled()) return Promise.resolve(null);

    return load().then(function (ok) {
      if (!ok) return null;
      /* ⚠ Обрываем ожидание сами: без таймера «думает» может висеть
         бесконечно, а в чате это выглядит как зависший узел. 45 секунд —
         с запасом на чужое окно согласия: человеку надо его прочитать. */
      return Promise.race([
        window.puter.ai.chat(SYSTEM + '\n\nВопрос: ' + q),
        new Promise(function (res) { setTimeout(function () { res(null); }, 45000); })
      ]);
    }).then(function (r) {
      if (!r) return null;
      var text = (typeof r === 'string') ? r
        : (r.message && r.message.content) ? r.message.content
        : (r.text || r.content || '');
      if (Array.isArray(text)) {
        text = text.map(function (p) { return p && p.text ? p.text : ''; }).join(' ');
      }
      text = String(text || '').trim();
      return text ? text.slice(0, 900) : null;
    }).catch(function (e) {
      console.warn('FrostAI', e && e.message);
      return null;
    });
  };

  window.FrostAI = A;
})();
