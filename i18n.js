/* =====================================================================
   FROSTBORNE DEADLANDS — i18n engine
   Языки: ru (база), en, uk, de, be, kk
   Шрифты: Inter / Oswald грузятся с subset cyrillic-ext + latin-ext,
   что покрывает украинский (ї,є,і,ґ), беларуский (ў,і), казахский
   (ә,ғ,қ,ң,ө,ұ,ү,і) и немецкие умлауты (ä,ö,ü,ß).
   ===================================================================== */
(function () {
  'use strict';

  const DICT = {
    ru: {
      _name: 'Русский', _flag: '🇷🇺',
      'nav.world': 'Мир', 'nav.features': 'Особенности', 'nav.shaders': 'Шейдеры',
      'nav.gallery': 'Галерея', 'nav.mods': 'Моды', 'nav.aether': 'Эфир',
      'nav.tech': 'Отсек', 'nav.download': 'Скачать', 'nav.req': 'Требования', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'Мир замёрз окончательно. Природа стала оружием, еда портится без консервации, заражённые быстрее и злее, а бури стирают всё живое. Это не просто сборка — это выживание на грани.',
      'hero.dl': '💾 Скачать сборку', 'hero.watch': '▶ Смотреть 100 дней',
      'hero.mc': 'МОДОВ', 'status.offline': 'СТАТУС: ОФФЛАЙН / ДЕМО', 'status.live': 'СТАТУС: FIREBASE LIVE',
      'hud.env': '❄ Окружающая среда', 'hud.envNote': 'Критический мороз',
      'hud.mut': '🧬 Мутация зомби', 'hud.mutNote': 'Стандартный сигнал',
      'hud.core': '⚙ Стабильность ядра', 'hud.coreNote': 'Коснись, чтобы запустить аварийную диагностику',
      'hud.rad': '☢ Радиационный фон',
      'm.downloads': 'Скачиваний', 'm.online': 'В сети', 'm.views': 'Просмотров',
      'about.kicker': '// Хроника катастрофы', 'about.title': 'Мир замёрз. Мёртвые остались.',
      'about.lead': 'Ядерная зима пришла не за день. Сначала пропало солнце. Потом — тепло. Потом начали возвращаться те, кого уже похоронили. Теперь над пустошами воет вечный буран, а каждый рассвет встречают всё меньше выживших.',
      'about.body': 'Frostborne Deadlands — это хардкорная сборка о выживании в замёрзшем постъядерном мире. Холод убивает быстрее зомби. Еда гниёт. Топливо на вес золота. Каждое решение — между «рискнуть» и «замёрзнуть в темноте». Здесь нет лёгких побед, только цена, которую ты готов заплатить за ещё один день.',
      'about.s1': 'Стартовый мороз', 'about.s2': 'Модов в сборке', 'about.s3': 'Дней на видео',
      'video.kicker': '// Запись экспедиции', 'video.title': 'Сводка экспедиции',
      'video.sub': 'Короткая подача, которая сразу объясняет, что это за мир — и зачем здесь оставаться.',
      'video.note': '100 дней выживания в вечной зиме — полный путь от первого костра до укреплённого бункера.',
      'sh.kicker': '// Спектр мерзлоты', 'sh.title': 'Эксклюзивные шейдеры',
      'sh.sub': 'Перетащи ползунок. Холодная цветокоррекция, объёмный туман и светящийся снег — 5 профилей под любое железо.',
      'sh.before': 'Ваниль', 'sh.after': 'Frostborne пресет',
      'g.kicker': '// Архив снимков', 'g.title': 'Галерея пустошей',
      'g.sub': 'Кадры из мира Frostborne. Нажми на любой, чтобы открыть в полном размере.',
      'f.kicker': '// Что внутри', 'f.title': 'Ключевые особенности',
      'f.sub': 'Девять столпов, на которых держится выживание в Frostborne Deadlands.',
      'mods.kicker': '// Каталог пакета', 'mods.title': 'Список модов',
      'mods.sub': '230+ модов, собранных и протестированных вручную. Найди нужный или отфильтруй по категории.',
      'mods.search': 'Поиск мода…',
      'cat.all': 'Все', 'cat.survival': 'Выживание', 'cat.atmosphere': 'Атмосфера',
      'cat.tech': 'Техника', 'cat.world': 'Мир', 'cat.perf': 'Оптимизация',
      'req.kicker': '// Аппаратный профиль', 'req.title': 'Системные требования',
      'req.sub': 'Сборка тяжёлая — это честно. Вот к чему готовиться.',
      'req.min': 'Минимум', 'req.minTag': 'Запустится', 'req.rec': 'Рекомендуется', 'req.recTag': 'Комфорт',
      'faq.kicker': '// База знаний', 'faq.title': 'Частые вопросы',
      'dl.kicker': '// Загрузочный шлюз', 'dl.title': 'Скачать сборку',
      'dl.sub': 'Сначала проверка системных требований, потом доступ к ссылкам. Это не каприз — это забота о твоём первом впечатлении.',
      'dl.checklist': 'Чек-лист готовности', 'dl.access': 'Статус доступа',
      'dl.locked': '🔒 ШЛЮЗ ЗАБЛОКИРОВАН', 'dl.open': '🔓 ШЛЮЗ ОТКРЫТ',
      'dl.scan': 'Запустить быструю диагностику',
      'soc.kicker': '// Связь', 'soc.title': 'Сообщество узла',
      'soc.sub': 'Новости, стримы, поддержка разработки и прямая связь с автором.',
      'cl.kicker': '// Архив версий', 'cl.title': 'Журнал изменений сайта',
      'cl.sub': 'Это станция, а не сборка. Здесь — история обновлений самого узла.',
      'death.kicker': '// Хроники погибших', 'death.title': 'Жертвы Великого Обледенения',
      'death.sub': 'Сервера нет, но трагедия — общая. Каждая смерть в твоём мире становится частью общей статистики выживших.',
      'death.total': 'Всего погибло', 'death.cause': 'Частая причина', 'death.record': 'Рекорд выживания',
      'death.btn': '☠ Зафиксировать гибель', 'death.days': 'дней',
      'foot.donate': '☕ Поддержать разработку',
      'tech.title': 'Технический отсек', 'tech.back': '← На станцию',
    },
    en: {
      _name: 'English', _flag: '🇬🇧',
      'nav.world': 'World', 'nav.features': 'Features', 'nav.shaders': 'Shaders',
      'nav.gallery': 'Gallery', 'nav.mods': 'Mods', 'nav.aether': 'Aether',
      'nav.tech': 'Tech Bay', 'nav.download': 'Download', 'nav.req': 'Requirements', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'The world has frozen for good. Nature became a weapon, food rots without preservation, the infected are faster and angrier, and storms erase all life. This is not just a modpack — this is survival on the edge.',
      'hero.dl': '💾 Download', 'hero.watch': '▶ Watch 100 Days',
      'hero.mc': 'MODS', 'status.offline': 'STATUS: OFFLINE / DEMO', 'status.live': 'STATUS: FIREBASE LIVE',
      'hud.env': '❄ Environment', 'hud.envNote': 'Critical frost',
      'hud.mut': '🧬 Zombie mutation', 'hud.mutNote': 'Standard signal',
      'hud.core': '⚙ Core stability', 'hud.coreNote': 'Tap to run emergency diagnostics',
      'hud.rad': '☢ Radiation level',
      'm.downloads': 'Downloads', 'm.online': 'Online', 'm.views': 'Views',
      'about.kicker': '// Catastrophe chronicle', 'about.title': 'The world froze. The dead remained.',
      'about.lead': 'Nuclear winter didn\u2019t come in a day. First the sun vanished. Then the warmth. Then those already buried began to return. Now an eternal blizzard howls over the wastes, and each dawn fewer survivors greet it.',
      'about.body': 'Frostborne Deadlands is a hardcore modpack about surviving a frozen post-nuclear world. Cold kills faster than zombies. Food rots. Fuel is priceless. Every choice is between \u201Crisk it\u201D and \u201Cfreeze in the dark.\u201D There are no easy wins here \u2014 only the price you\u2019ll pay for one more day.',
      'about.s1': 'Starting cold', 'about.s2': 'Mods inside', 'about.s3': 'Days on video',
      'video.kicker': '// Expedition record', 'video.title': 'Expedition Briefing',
      'video.sub': 'A short pitch that instantly explains what this world is \u2014 and why you should stay.',
      'video.note': '100 days of survival in an endless winter \u2014 the full path from first campfire to fortified bunker.',
      'sh.kicker': '// Frost spectrum', 'sh.title': 'Exclusive Shaders',
      'sh.sub': 'Drag the slider. Cold color grading, volumetric fog and glowing snow \u2014 5 profiles for any hardware.',
      'sh.before': 'Vanilla', 'sh.after': 'Frostborne preset',
      'g.kicker': '// Snapshot archive', 'g.title': 'Wasteland Gallery',
      'g.sub': 'Frames from the Frostborne world. Tap any to open full size.',
      'f.kicker': '// What\u2019s inside', 'f.title': 'Key Features',
      'f.sub': 'Nine pillars that survival in Frostborne Deadlands stands on.',
      'mods.kicker': '// Pack catalogue', 'mods.title': 'Mod List',
      'mods.sub': '230+ mods, hand-picked and tested. Find one or filter by category.',
      'mods.search': 'Search a mod\u2026',
      'cat.all': 'All', 'cat.survival': 'Survival', 'cat.atmosphere': 'Atmosphere',
      'cat.tech': 'Tech', 'cat.world': 'World', 'cat.perf': 'Performance',
      'req.kicker': '// Hardware profile', 'req.title': 'System Requirements',
      'req.sub': 'The pack is heavy \u2014 honestly. Here\u2019s what to expect.',
      'req.min': 'Minimum', 'req.minTag': 'Will run', 'req.rec': 'Recommended', 'req.recTag': 'Comfort',
      'faq.kicker': '// Knowledge base', 'faq.title': 'Frequently Asked',
      'dl.kicker': '// Download gate', 'dl.title': 'Download the Pack',
      'dl.sub': 'First a system check, then the links. Not a whim \u2014 care for your first impression.',
      'dl.checklist': 'Readiness checklist', 'dl.access': 'Access status',
      'dl.locked': '🔒 GATE LOCKED', 'dl.open': '🔓 GATE OPEN',
      'dl.scan': 'Run quick diagnostics',
      'soc.kicker': '// Contact', 'soc.title': 'Node Community',
      'soc.sub': 'News, streams, dev support and a direct line to the author.',
      'cl.kicker': '// Version archive', 'cl.title': 'Site Changelog',
      'cl.sub': 'This is a station, not the modpack. Here\u2019s the history of the node itself.',
      'death.kicker': '// Chronicle of the fallen', 'death.title': 'Victims of the Great Freezing',
      'death.sub': 'There\u2019s no server, but the tragedy is shared. Every death in your world joins the survivors\u2019 global tally.',
      'death.total': 'Total fallen', 'death.cause': 'Common cause', 'death.record': 'Survival record',
      'death.btn': '☠ Log a death', 'death.days': 'days',
      'foot.donate': '☕ Support development',
      'tech.title': 'Tech Bay', 'tech.back': '← Back to station',
    },
    uk: {
      _name: 'Українська', _flag: '🇺🇦',
      'nav.world': 'Світ', 'nav.features': 'Особливості', 'nav.shaders': 'Шейдери',
      'nav.gallery': 'Галерея', 'nav.mods': 'Моди', 'nav.aether': 'Ефір',
      'nav.tech': 'Відсік', 'nav.download': 'Завантажити', 'nav.req': 'Вимоги', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'Світ замерз остаточно. Природа стала зброєю, їжа псується без консервації, заражені швидші та лютіші, а бурі стирають усе живе. Це не просто збірка — це виживання на межі.',
      'hero.dl': '💾 Завантажити', 'hero.watch': '▶ Дивитися 100 днів',
      'hero.mc': 'МОДІВ', 'status.offline': 'СТАТУС: ОФЛАЙН / ДЕМО', 'status.live': 'СТАТУС: FIREBASE LIVE',
      'hud.env': '❄ Довкілля', 'hud.envNote': 'Критичний мороз',
      'hud.mut': '🧬 Мутація зомбі', 'hud.mutNote': 'Стандартний сигнал',
      'hud.core': '⚙ Стабільність ядра', 'hud.coreNote': 'Торкнись, щоб запустити аварійну діагностику',
      'hud.rad': '☢ Радіаційний фон',
      'm.downloads': 'Завантажень', 'm.online': 'У мережі', 'm.views': 'Переглядів',
      'about.kicker': '// Хроніка катастрофи', 'about.title': 'Світ замерз. Мертві лишились.',
      'about.lead': 'Ядерна зима прийшла не за день. Спершу зникло сонце. Потім — тепло. Потім почали повертатися ті, кого вже поховали. Тепер над пустками виє вічний буран, і кожен світанок зустрічає все менше тих, хто вижив.',
      'about.body': 'Frostborne Deadlands — це хардкорна збірка про виживання в замерзлому постʼядерному світі. Холод вбиває швидше за зомбі. Їжа гниє. Паливо на вагу золота. Кожне рішення — між «ризикнути» та «замерзнути в темряві». Тут немає легких перемог, лише ціна за ще один день.',
      'about.s1': 'Стартовий мороз', 'about.s2': 'Модів у збірці', 'about.s3': 'Днів на відео',
      'video.kicker': '// Запис експедиції', 'video.title': 'Зведення експедиції',
      'video.sub': 'Коротка подача, що одразу пояснює, що це за світ — і навіщо тут лишатись.',
      'video.note': '100 днів виживання у вічній зимі — повний шлях від першого вогнища до укріпленого бункера.',
      'sh.kicker': '// Спектр мерзлоти', 'sh.title': 'Ексклюзивні шейдери',
      'sh.sub': 'Перетягни повзунок. Холодна кольорокорекція, обʼємний туман і сяючий сніг — 5 профілів під будь-яке залізо.',
      'sh.before': 'Ваніль', 'sh.after': 'Frostborne пресет',
      'g.kicker': '// Архів знімків', 'g.title': 'Галерея пусток',
      'g.sub': 'Кадри зі світу Frostborne. Натисни будь-який, щоб відкрити на повний розмір.',
      'f.kicker': '// Що всередині', 'f.title': 'Ключові особливості',
      'f.sub': 'Дев’ять стовпів, на яких тримається виживання у Frostborne Deadlands.',
      'mods.kicker': '// Каталог пакета', 'mods.title': 'Список модів',
      'mods.sub': '230+ модів, зібраних і протестованих вручну. Знайди потрібний або відфільтруй за категорією.',
      'mods.search': 'Пошук мода…',
      'cat.all': 'Усі', 'cat.survival': 'Виживання', 'cat.atmosphere': 'Атмосфера',
      'cat.tech': 'Техніка', 'cat.world': 'Світ', 'cat.perf': 'Оптимізація',
      'req.kicker': '// Профіль заліза', 'req.title': 'Системні вимоги',
      'req.sub': 'Збірка важка — чесно. Ось до чого готуватись.',
      'req.min': 'Мінімум', 'req.minTag': 'Запуститься', 'req.rec': 'Рекомендовано', 'req.recTag': 'Комфорт',
      'faq.kicker': '// База знань', 'faq.title': 'Часті запитання',
      'dl.kicker': '// Завантажувальний шлюз', 'dl.title': 'Завантажити збірку',
      'dl.sub': 'Спершу перевірка вимог, потім доступ до посилань. Це не примха — це турбота про твоє перше враження.',
      'dl.checklist': 'Чек-лист готовності', 'dl.access': 'Статус доступу',
      'dl.locked': '🔒 ШЛЮЗ ЗАБЛОКОВАНО', 'dl.open': '🔓 ШЛЮЗ ВІДКРИТО',
      'dl.scan': 'Запустити швидку діагностику',
      'soc.kicker': '// Звʼязок', 'soc.title': 'Спільнота вузла',
      'soc.sub': 'Новини, стріми, підтримка розробки та прямий звʼязок з автором.',
      'cl.kicker': '// Архів версій', 'cl.title': 'Журнал змін сайту',
      'cl.sub': 'Це станція, а не збірка. Тут — історія оновлень самого вузла.',
      'death.kicker': '// Хроніки загиблих', 'death.title': 'Жертви Великого Зледеніння',
      'death.sub': 'Сервера немає, але трагедія — спільна. Кожна смерть у твоєму світі стає частиною загальної статистики.',
      'death.total': 'Усього загинуло', 'death.cause': 'Часта причина', 'death.record': 'Рекорд виживання',
      'death.btn': '☠ Зафіксувати загибель', 'death.days': 'днів',
      'foot.donate': '☕ Підтримати розробку',
      'tech.title': 'Технічний відсік', 'tech.back': '← На станцію',
    },
    de: {
      _name: 'Deutsch', _flag: '🇩🇪',
      'nav.world': 'Welt', 'nav.features': 'Features', 'nav.shaders': 'Shader',
      'nav.gallery': 'Galerie', 'nav.mods': 'Mods', 'nav.aether': 'Äther',
      'nav.tech': 'Technik', 'nav.download': 'Download', 'nav.req': 'Anforderungen', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'Die Welt ist endgültig zugefroren. Die Natur wurde zur Waffe, Nahrung verdirbt ohne Konservierung, die Infizierten sind schneller und wütender, und Stürme löschen alles Leben aus. Das ist kein Modpack — das ist Überleben am Limit.',
      'hero.dl': '💾 Herunterladen', 'hero.watch': '▶ 100 Tage ansehen',
      'hero.mc': 'MODS', 'status.offline': 'STATUS: OFFLINE / DEMO', 'status.live': 'STATUS: FIREBASE LIVE',
      'hud.env': '❄ Umgebung', 'hud.envNote': 'Kritischer Frost',
      'hud.mut': '🧬 Zombie-Mutation', 'hud.mutNote': 'Standardsignal',
      'hud.core': '⚙ Kernstabilität', 'hud.coreNote': 'Tippen für Notfalldiagnose',
      'hud.rad': '☢ Strahlungspegel',
      'm.downloads': 'Downloads', 'm.online': 'Online', 'm.views': 'Aufrufe',
      'about.kicker': '// Katastrophen-Chronik', 'about.title': 'Die Welt fror. Die Toten blieben.',
      'about.lead': 'Der nukleare Winter kam nicht an einem Tag. Zuerst verschwand die Sonne. Dann die Wärme. Dann kehrten jene zurück, die längst begraben waren. Nun heult ein ewiger Schneesturm über das Ödland, und jeder Morgen begrüßt weniger Überlebende.',
      'about.body': 'Frostborne Deadlands ist ein Hardcore-Modpack über das Überleben in einer gefrorenen post-nuklearen Welt. Kälte tötet schneller als Zombies. Nahrung verfault. Treibstoff ist unbezahlbar. Jede Entscheidung liegt zwischen „riskieren" und „im Dunkeln erfrieren". Hier gibt es keine leichten Siege — nur den Preis für einen weiteren Tag.',
      'about.s1': 'Startfrost', 'about.s2': 'Mods enthalten', 'about.s3': 'Tage im Video',
      'video.kicker': '// Expeditions-Aufzeichnung', 'video.title': 'Expeditions-Briefing',
      'video.sub': 'Eine kurze Vorstellung, die sofort erklärt, was diese Welt ist — und warum du bleiben solltest.',
      'video.note': '100 Tage Überleben im ewigen Winter — der ganze Weg vom ersten Lagerfeuer zum befestigten Bunker.',
      'sh.kicker': '// Frost-Spektrum', 'sh.title': 'Exklusive Shader',
      'sh.sub': 'Zieh den Regler. Kühle Farbkorrektur, volumetrischer Nebel und leuchtender Schnee — 5 Profile für jede Hardware.',
      'sh.before': 'Vanilla', 'sh.after': 'Frostborne-Preset',
      'g.kicker': '// Schnappschuss-Archiv', 'g.title': 'Ödland-Galerie',
      'g.sub': 'Bilder aus der Frostborne-Welt. Tippe eines an, um es groß zu öffnen.',
      'f.kicker': '// Was drin ist', 'f.title': 'Hauptmerkmale',
      'f.sub': 'Neun Säulen, auf denen das Überleben in Frostborne Deadlands ruht.',
      'mods.kicker': '// Paket-Katalog', 'mods.title': 'Mod-Liste',
      'mods.sub': '230+ Mods, handverlesen und getestet. Finde einen oder filtere nach Kategorie.',
      'mods.search': 'Mod suchen\u2026',
      'cat.all': 'Alle', 'cat.survival': 'Überleben', 'cat.atmosphere': 'Atmosphäre',
      'cat.tech': 'Technik', 'cat.world': 'Welt', 'cat.perf': 'Leistung',
      'req.kicker': '// Hardware-Profil', 'req.title': 'Systemanforderungen',
      'req.sub': 'Das Pack ist schwer — ehrlich. Darauf solltest du dich einstellen.',
      'req.min': 'Minimum', 'req.minTag': 'Läuft', 'req.rec': 'Empfohlen', 'req.recTag': 'Komfort',
      'faq.kicker': '// Wissensbasis', 'faq.title': 'Häufige Fragen',
      'dl.kicker': '// Download-Schleuse', 'dl.title': 'Pack herunterladen',
      'dl.sub': 'Erst ein System-Check, dann die Links. Keine Laune — Sorge um deinen ersten Eindruck.',
      'dl.checklist': 'Bereitschafts-Checkliste', 'dl.access': 'Zugangsstatus',
      'dl.locked': '🔒 SCHLEUSE VERRIEGELT', 'dl.open': '🔓 SCHLEUSE OFFEN',
      'dl.scan': 'Schnelldiagnose starten',
      'soc.kicker': '// Kontakt', 'soc.title': 'Knoten-Community',
      'soc.sub': 'News, Streams, Entwickler-Support und direkter Draht zum Autor.',
      'cl.kicker': '// Versionsarchiv', 'cl.title': 'Website-Changelog',
      'cl.sub': 'Das ist eine Station, nicht das Modpack. Hier ist die Historie des Knotens selbst.',
      'death.kicker': '// Chronik der Gefallenen', 'death.title': 'Opfer der Großen Vereisung',
      'death.sub': 'Es gibt keinen Server, doch die Tragödie ist gemeinsam. Jeder Tod in deiner Welt fließt in die globale Statistik ein.',
      'death.total': 'Gefallen insgesamt', 'death.cause': 'Häufige Ursache', 'death.record': 'Überlebensrekord',
      'death.btn': '☠ Tod erfassen', 'death.days': 'Tage',
      'foot.donate': '☕ Entwicklung unterstützen',
      'tech.title': 'Technik-Bucht', 'tech.back': '← Zur Station',
    },
    be: {
      _name: 'Беларуская', _flag: '🇧🇾',
      'nav.world': 'Свет', 'nav.features': 'Асаблівасці', 'nav.shaders': 'Шэйдэры',
      'nav.gallery': 'Галерэя', 'nav.mods': 'Моды', 'nav.aether': 'Эфір',
      'nav.tech': 'Адсек', 'nav.download': 'Спампаваць', 'nav.req': 'Патрабаванні', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'Свет замёрз канчаткова. Прырода стала зброяй, ежа псуецца без кансервацыі, заражаныя хутчэйшыя і злейшыя, а буры сціраюць усё жывое. Гэта не проста зборка — гэта выжыванне на мяжы.',
      'hero.dl': '💾 Спампаваць', 'hero.watch': '▶ Глядзець 100 дзён',
      'hero.mc': 'МОДАЎ', 'status.offline': 'СТАТУС: АФЛАЙН / ДЭМА', 'status.live': 'СТАТУС: FIREBASE LIVE',
      'hud.env': '❄ Асяроддзе', 'hud.envNote': 'Крытычны мароз',
      'hud.mut': '🧬 Мутацыя зомбі', 'hud.mutNote': 'Стандартны сігнал',
      'hud.core': '⚙ Стабільнасць ядра', 'hud.coreNote': 'Націсні, каб запусціць аварыйную дыягностыку',
      'hud.rad': '☢ Радыяцыйны фон',
      'm.downloads': 'Спамповак', 'm.online': 'У сетцы', 'm.views': 'Праглядаў',
      'about.kicker': '// Хроніка катастрофы', 'about.title': 'Свет замёрз. Мёртвыя засталіся.',
      'about.lead': 'Ядзерная зіма прыйшла не за дзень. Спачатку знікла сонца. Потым — цяпло. Потым пачалі вяртацца тыя, каго ўжо пахавалі. Цяпер над пусткамі вые вечны буран, і кожны золак сустракае ўсё менш тых, хто выжыў.',
      'about.body': 'Frostborne Deadlands — гэта хардкорная зборка пра выжыванне ў замёрзлым постʼядзерным свеце. Холад забівае хутчэй за зомбі. Ежа гніе. Паліва на вагу золата. Кожнае рашэнне — паміж «рызыкнуць» і «замерзнуць у цемры». Тут няма лёгкіх перамог, толькі цана за яшчэ адзін дзень.',
      'about.s1': 'Стартавы мароз', 'about.s2': 'Модаў у зборцы', 'about.s3': 'Дзён на відэа',
      'video.kicker': '// Запіс экспедыцыі', 'video.title': 'Зводка экспедыцыі',
      'video.sub': 'Кароткая падача, якая адразу тлумачыць, што гэта за свет — і навошта тут заставацца.',
      'video.note': '100 дзён выжывання ў вечнай зіме — поўны шлях ад першага вогнішча да ўмацаванага бункера.',
      'sh.kicker': '// Спектр мерзлаты', 'sh.title': 'Эксклюзіўныя шэйдэры',
      'sh.sub': 'Пацягні паўзунок. Халодная колеракарэкцыя, абʼёмны туман і ззяючы снег — 5 профіляў пад любое жалеза.',
      'sh.before': 'Ваніль', 'sh.after': 'Frostborne прэсет',
      'g.kicker': '// Архіў здымкаў', 'g.title': 'Галерэя пустак',
      'g.sub': 'Кадры са свету Frostborne. Націсні любы, каб адкрыць на поўны памер.',
      'f.kicker': '// Што ўнутры', 'f.title': 'Ключавыя асаблівасці',
      'f.sub': 'Дзевяць слупоў, на якіх трымаецца выжыванне ў Frostborne Deadlands.',
      'mods.kicker': '// Каталог пакета', 'mods.title': 'Спіс модаў',
      'mods.sub': '230+ модаў, сабраных і пратэставаных уручную. Знайдзі патрэбны або адфільтруй па катэгорыі.',
      'mods.search': 'Пошук мода…',
      'cat.all': 'Усе', 'cat.survival': 'Выжыванне', 'cat.atmosphere': 'Атмасфера',
      'cat.tech': 'Тэхніка', 'cat.world': 'Свет', 'cat.perf': 'Аптымізацыя',
      'req.kicker': '// Профіль жалеза', 'req.title': 'Сістэмныя патрабаванні',
      'req.sub': 'Зборка цяжкая — шчыра. Вось да чаго рыхтавацца.',
      'req.min': 'Мінімум', 'req.minTag': 'Запусціцца', 'req.rec': 'Рэкамендавана', 'req.recTag': 'Камфорт',
      'faq.kicker': '// База ведаў', 'faq.title': 'Частыя пытанні',
      'dl.kicker': '// Загрузачны шлюз', 'dl.title': 'Спампаваць зборку',
      'dl.sub': 'Спачатку праверка патрабаванняў, потым доступ да спасылак. Гэта не капрыз — гэта клопат пра тваё першае ўражанне.',
      'dl.checklist': 'Чэк-ліст гатоўнасці', 'dl.access': 'Статус доступу',
      'dl.locked': '🔒 ШЛЮЗ ЗАБЛАКАВАНЫ', 'dl.open': '🔓 ШЛЮЗ АДКРЫТЫ',
      'dl.scan': 'Запусціць хуткую дыягностыку',
      'soc.kicker': '// Сувязь', 'soc.title': 'Супольнасць вузла',
      'soc.sub': 'Навіны, стрымы, падтрымка распрацоўкі і прамая сувязь з аўтарам.',
      'cl.kicker': '// Архіў версій', 'cl.title': 'Журнал зменаў сайта',
      'cl.sub': 'Гэта станцыя, а не зборка. Тут — гісторыя абнаўленняў самога вузла.',
      'death.kicker': '// Хронікі загінуўшых', 'death.title': 'Ахвяры Вялікага Зледзянення',
      'death.sub': 'Сервера няма, але трагедыя — агульная. Кожная смерць у тваім свеце становіцца часткай агульнай статыстыкі.',
      'death.total': 'Усяго загінула', 'death.cause': 'Частая прычына', 'death.record': 'Рэкорд выжывання',
      'death.btn': '☠ Зафіксаваць гібель', 'death.days': 'дзён',
      'foot.donate': '☕ Падтрымаць распрацоўку',
      'tech.title': 'Тэхнічны адсек', 'tech.back': '← На станцыю',
    },
    kk: {
      _name: 'Қазақ тілі', _flag: '🇰🇿',
      'nav.world': 'Әлем', 'nav.features': 'Мүмкіндіктер', 'nav.shaders': 'Шейдерлер',
      'nav.gallery': 'Галерея', 'nav.mods': 'Модтар', 'nav.aether': 'Эфир',
      'nav.tech': 'Бөлім', 'nav.download': 'Жүктеу', 'nav.req': 'Талаптар', 'nav.faq': 'FAQ',
      'hero.t1': 'FROSTBORNE', 'hero.t2': 'DEADLANDS',
      'hero.tagline': 'Survive the endless winter.',
      'hero.desc': 'Әлем біржола мұзға айналды. Табиғат қаруға айналды, тағам сақтаусыз бұзылады, жұқтырғандар жылдамырақ әрі ашулы, ал боран бүкіл тіршілікті жояды. Бұл жай ғана жинақ емес — бұл шектегі тіршілік.',
      'hero.dl': '💾 Жүктеп алу', 'hero.watch': '▶ 100 күнді көру',
      'hero.mc': 'МОД', 'status.offline': 'КҮЙІ: ОФФЛАЙН / ДЕМО', 'status.live': 'КҮЙІ: FIREBASE LIVE',
      'hud.env': '❄ Қоршаған орта', 'hud.envNote': 'Қауіпті аяз',
      'hud.mut': '🧬 Зомби мутациясы', 'hud.mutNote': 'Стандартты сигнал',
      'hud.core': '⚙ Ядро тұрақтылығы', 'hud.coreNote': 'Апаттық диагностиканы іске қосу үшін басыңыз',
      'hud.rad': '☢ Радиация деңгейі',
      'm.downloads': 'Жүктеулер', 'm.online': 'Желіде', 'm.views': 'Қаралымдар',
      'about.kicker': '// Апат шежіресі', 'about.title': 'Әлем қатты. Өлілер қалды.',
      'about.lead': 'Ядролық қыс бір күнде келген жоқ. Алдымен күн жоғалды. Содан кейін — жылу. Содан соң жерленгендер қайта орала бастады. Енді шөл далада мәңгілік боран ұлиды, әр таң сайын тірі қалғандар азая береді.',
      'about.body': 'Frostborne Deadlands — мұзға айналған ядролық соғыстан кейінгі әлемде тіршілік ету туралы хардкор жинақ. Суық зомбиден жылдам өлтіреді. Тағам шіриді. Отын алтындай қымбат. Әр шешім — «тәуекелге бару» мен «қараңғыда қату» арасында. Мұнда жеңіл жеңіс жоқ, тек тағы бір күн үшін төлейтін баға бар.',
      'about.s1': 'Бастапқы аяз', 'about.s2': 'Жинақтағы мод', 'about.s3': 'Видеодағы күн',
      'video.kicker': '// Экспедиция жазбасы', 'video.title': 'Экспедиция қысқаша мазмұны',
      'video.sub': 'Бұл қандай әлем екенін бірден түсіндіретін қысқа таныстырылым — және неге мұнда қалу керектігі.',
      'video.note': 'Мәңгілік қыстағы 100 күндік тіршілік — алғашқы оттан бекіністі бункерге дейінгі толық жол.',
      'sh.kicker': '// Мұздық спектрі', 'sh.title': 'Эксклюзивті шейдерлер',
      'sh.sub': 'Жүгірткіні сүйреңіз. Суық түс түзету, көлемді тұман және жарқыраған қар — кез келген темірге 5 профиль.',
      'sh.before': 'Ваниль', 'sh.after': 'Frostborne пресеті',
      'g.kicker': '// Суреттер мұрағаты', 'g.title': 'Шөл дала галереясы',
      'g.sub': 'Frostborne әлемінен кадрлар. Толық өлшемде ашу үшін кез келгенін басыңыз.',
      'f.kicker': '// Ішінде не бар', 'f.title': 'Негізгі мүмкіндіктер',
      'f.sub': 'Frostborne Deadlands тіршілігі сүйенетін тоғыз тірек.',
      'mods.kicker': '// Пакет каталогы', 'mods.title': 'Мод тізімі',
      'mods.sub': '230+ мод, қолмен жиналып, тексерілген. Керегін тауып немесе санат бойынша сүзіңіз.',
      'mods.search': 'Мод іздеу…',
      'cat.all': 'Барлығы', 'cat.survival': 'Тіршілік', 'cat.atmosphere': 'Атмосфера',
      'cat.tech': 'Техника', 'cat.world': 'Әлем', 'cat.perf': 'Оңтайландыру',
      'req.kicker': '// Темір профилі', 'req.title': 'Жүйелік талаптар',
      'req.sub': 'Жинақ ауыр — шынымен. Міне неге дайындалу керек.',
      'req.min': 'Минимум', 'req.minTag': 'Іске қосылады', 'req.rec': 'Ұсынылады', 'req.recTag': 'Жайлылық',
      'faq.kicker': '// Білім қоры', 'faq.title': 'Жиі қойылатын сұрақтар',
      'dl.kicker': '// Жүктеу қақпасы', 'dl.title': 'Жинақты жүктеу',
      'dl.sub': 'Алдымен жүйені тексеру, содан кейін сілтемелер. Бұл қалау емес — алғашқы әсеріңіз туралы қамқорлық.',
      'dl.checklist': 'Дайындық тізімі', 'dl.access': 'Қол жеткізу күйі',
      'dl.locked': '🔒 ҚАҚПА ЖАБЫҚ', 'dl.open': '🔓 ҚАҚПА АШЫҚ',
      'dl.scan': 'Жылдам диагностиканы іске қосу',
      'soc.kicker': '// Байланыс', 'soc.title': 'Түйін қауымдастығы',
      'soc.sub': 'Жаңалықтар, стримдер, әзірлеуді қолдау және автормен тікелей байланыс.',
      'cl.kicker': '// Нұсқалар мұрағаты', 'cl.title': 'Сайт өзгерістер журналы',
      'cl.sub': 'Бұл станция, жинақ емес. Міне түйіннің жаңару тарихы.',
      'death.kicker': '// Қаза тапқандар шежіресі', 'death.title': 'Ұлы Мұзданудың құрбандары',
      'death.sub': 'Сервер жоқ, бірақ қайғы — ортақ. Сіздің әлеміңіздегі әр өлім жалпы статистиканың бөлігіне айналады.',
      'death.total': 'Барлығы қаза тапты', 'death.cause': 'Жиі себеп', 'death.record': 'Тіршілік рекорды',
      'death.btn': '☠ Өлімді тіркеу', 'death.days': 'күн',
      'foot.donate': '☕ Әзірлеуді қолдау',
      'tech.title': 'Техникалық бөлім', 'tech.back': '← Станцияға',
    },
  };

  const LANGS = Object.keys(DICT);
  const STORE = 'frostborne_lang';

  function detect() {
    const saved = localStorage.getItem(STORE);
    if (saved && DICT[saved]) return saved;
    const nav = (navigator.language || 'ru').slice(0, 2).toLowerCase();
    return DICT[nav] ? nav : 'ru';
  }

  let current = detect();

  function t(key) {
    return (DICT[current] && DICT[current][key]) || (DICT.ru[key]) || key;
  }

  function apply(lang) {
    if (!DICT[lang]) lang = 'ru';
    current = lang;
    localStorage.setItem(STORE, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = t(key);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      // format: "placeholder:key, aria-label:key2"
      el.getAttribute('data-i18n-attr').split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    // обновить активный язык в свитчере
    document.querySelectorAll('[data-lang-opt]').forEach(o => {
      o.classList.toggle('active', o.getAttribute('data-lang-opt') === lang);
    });
    const cur = document.getElementById('langCurrent');
    if (cur) cur.textContent = DICT[lang]._flag + ' ' + lang.toUpperCase();

    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  }

  function buildSwitcher(mountSel) {
    const mount = document.querySelector(mountSel);
    if (!mount) return;
    const opts = LANGS.map(l =>
      `<button class="lang-opt" data-lang-opt="${l}" type="button">${DICT[l]._flag} <span>${DICT[l]._name}</span></button>`
    ).join('');
    mount.innerHTML = `
      <button class="lang-btn" id="langBtn" type="button" aria-haspopup="true" aria-expanded="false">
        <span id="langCurrent">🌐 ${current.toUpperCase()}</span>
        <svg viewBox="0 0 12 8" width="11"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
      </button>
      <div class="lang-menu" id="langMenu" role="menu">${opts}</div>`;
    const btn = mount.querySelector('#langBtn');
    const menu = mount.querySelector('#langMenu');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = mount.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('[data-lang-opt]').forEach(o =>
      o.addEventListener('click', () => {
        apply(o.getAttribute('data-lang-opt'));
        mount.classList.remove('open');
        if (window.FrostSFX) window.FrostSFX.play('click');
      })
    );
    document.addEventListener('click', () => mount.classList.remove('open'));
  }

  window.I18N = { t, apply, current: () => current, langs: LANGS, dict: DICT, buildSwitcher };

  // авто-инициализация
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
  function init() { apply(current); }
})();
