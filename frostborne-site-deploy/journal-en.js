/* =====================================================================
   FROSTBORNE DEADLANDS — журнал, английский перевод.

   Файл грузится ТОЛЬКО на journal.html и только когда выбран английский:
   в i18n.js этому тексту не место, он там 76 тысяч знаков на язык,
   а i18n.js и так приезжает на все шесть страниц.

   Ключ записи составной — «глава|заголовок»: два заголовка в журнале
   повторяются («Периметр», «Последний рассвет»), одного title не хватает.
   Записи без перевода остаются русскими и помечаются на странице.

   Названия глав совпадают с Кодексом (cdx.chap.*) — иначе страницы
   называли бы одни и те же главы по-разному.
   ===================================================================== */
window.FROST_JOURNAL_LANG = {
  lang: 'en',

  ch: {
    "Первая ночь": "First Night",
    "Согреться": "Staying Warm",
    "Мёртвые не спят": "The Dead Don't Sleep"
  },

  e: {
    /* ───────────── Глава 1 · First Night ───────────── */
    "Первая ночь|Пережить ночь": {
      t: "Living Through the Night",
      x: [
        "Dawn. Grey, spiteful, barely alive — but dawn.",
        "I lived through the first night in a dead world. My hands work, the fire held, I am still breathing.",
        "This is not a victory. This is only the beginning.",
        "A campfire won't last. I need a real hearth — and walls warmer than these."
      ]
    },
    "Первая ночь|Позывной, что не отвечает": {
      t: "A Callsign That Doesn't Answer",
      x: [
        "While gathering wood I found a post with a peeling sign: «Outpost 11 — 14 km north-west. Automated supply. Do not approach without clearance».",
        "Automated supply. So someone — something — was meant to send freight here. Coal, tools, maybe even food.",
        "I don't remember a single delivery ever arriving.",
        "The outpost is either silent or long dead. There is only one way to find out."
      ]
    },
    "Первая ночь|Обгоревший журнал": {
      t: "A Burnt Logbook",
      x: [
        "Under the rubble, a scrap of paper charred along one edge. I read what survived: «...batch 04 did not depart... channel 11 silent for a third cycle... request manual...» — and there it ends, the rest is ash.",
        "Someone wrote this in a hurry. Or in a panic."
      ]
    },
    "Первая ночь|Координаты на пепле": {
      t: "Coordinates in the Ash",
      x: [
        "Numbers are scratched into the back of the transmitter — coordinates, I think. Whose hand, I can't tell: the engineer who kept this place running, or whoever last tried to get through."
      ]
    },
    "Первая ночь|Сложить осколки": {
      t: "Piecing It Together",
      x: [
        "I lay it all out on the snow: the scrap of log, the wire, the coordinates. A simple, ugly picture comes together: Outpost 11 was supposed to keep us in fuel and tools. It went quiet. Nobody came to check — there was nobody left.",
        "Except me. Now.",
        "The outpost didn't just stop answering. Something made it stop."
      ]
    },
    "Первая ночь|Форпост 11: первая зацепка": {
      t: "Outpost 11: The First Lead",
      x: [
        "Outpost 11 isn't dead — it is simply alone. The automation meant to ship freight is still running somewhere, blind, without a single living hand beside it. I don't know what happened there. But now I have a direction — and a reason to walk that way instead of wherever my eyes take me.",
        "A first lead is rarely the last one. But you have to start somewhere."
      ]
    },
    "Первая ночь|Странные показания": {
      t: "Strange Readings",
      x: [
        "The snow falls wrong. Thicker. Meaner. As if winter hasn't merely arrived — it is preparing for something.",
        "I never used to notice details like that. Now, it seems, I should start.",
        "If the cold is deepening for a reason, I need to know how bad it is going to get."
      ]
    },
    "Первая ночь|Читать по мутности": {
      t: "Reading the Cloudiness",
      x: [
        "I compare the vial against the snow samples. The murk in the liquid grows faster than anything I can see around me. Either the instrument lies, or the frost is running ahead of schedule — as if winter were in a hurry.",
        "No instrument lies for no reason. So it isn't the instrument."
      ]
    },
    "Первая ночь|Закономерность в цифрах": {
      t: "A Pattern in the Numbers",
      x: [
        "I set someone else's numbers beside my own. Even I can see the pattern, and I'm no scientist: the cold doesn't rise evenly, it jumps, and every jump is sharper than the last. Someone saw this shape before me. And was clearly frightened by what it meant.",
        "This isn't just a cold winter. This is a countdown."
      ]
    },
    "Первая ночь|Ледяные записи: первые числа": {
      t: "Ice Records: The First Figures",
      x: [
        "The figures all say one thing: the frost isn't merely strong — it is accelerating, and has been for years. Someone knew in advance. Wrote it down. Perhaps prepared. I want to know who — and whether they passed that knowledge on before it was too late.",
        "First figures rarely reassure. These are no exception."
      ]
    },

    /* ───────────── Глава 2 · Staying Warm ───────────── */
    "Согреться|Дыхание стынет": {
      t: "Breath Turns to Frost",
      x: [
        "The campfire dies by morning. Its warmth (≈10°) covers one night — no more.",
        "I am tired of waking up cold. Tired of counting embers instead of sleeping.",
        "Cold is patient. It waits for every gap, every wet thread, every ember that goes out.",
        "Today I stop merely warming myself — and start holding the heat."
      ]
    },
    "Согреться|Ночь у котла": {
      t: "A Night by the Boiler",
      x: [
        "Tonight I slept. Properly — not shivering, not counting the minutes to dawn.",
        "The boiler hums in the corner, a warm coat on my back, the wind howling behind the wall —",
        "and for the first time it howls outside me, not inside.",
        "Stitch the Thermal Coat — the highest protection against the freeze.",
        "This is your first real victory over the cold.",
        "But warmth draws more than the living."
      ]
    },
    "Согреться|Второй сигнал": {
      t: "The Second Signal",
      x: [
        "Here, closer to the hearth, the broken transmitter finally catches something — not a voice, a rhythm: a series of clicks repeating at even intervals. Not interference. Far too regular for interference.",
        "Interference doesn't repeat with clockwork precision. This is a signal."
      ]
    },
    "Согреться|Читать по звуку": {
      t: "Reading by Sound",
      x: [
        "I count the clicks and note the pauses between them. Three short, a pause, one long, a pause, two short — and back to the start. It is a code. Someone — something — has been repeating the same message for days.",
        "A machine cannot despair. But if it could, it would sound exactly like this."
      ]
    },
    "Согреться|Кто послал ящик": {
      t: "Who Sent the Crate",
      x: [
        "The crate carries the same marking as the sign by the post: Outpost 11. So the automation is still unloading whatever it manages to produce — there is simply nobody left to collect it in time, and it lies where it falls.",
        "The outpost isn't dead. It is shouting into the void — and waiting for someone to finally answer."
      ]
    },
    "Согреться|Форпост 11: сигнал жизни": {
      t: "Outpost 11: A Sign of Life",
      x: [
        "The signal, the crate, the marking — everything converges on one point on the map, fourteen kilometres north-west. Outpost 11 is alive in the way a machine can be alive: running, producing, repeating the same call into an empty band.",
        "I'm not going there for the freight. I'm going to learn what happened to the people who were meant to collect it.",
        "A sign of life is not rescue. But it is the only thing to hold on to."
      ]
    },
    "Согреться|Тревожная отметка": {
      t: "The Alarm Mark",
      x: [
        "It is warmer by the hearth, but the entries in that logbook won't leave me alone. I take out the vial-thermometer again — the murk in it has already passed the mark the other author called «alarming».",
        "Someone else's alarm, written down in advance, is worse than your own arriving too late."
      ]
    },
    "Согреться|Единое показание": {
      t: "One Single Reading",
      x: [
        "All the vials clouded almost at once. Not a draught, not a crack in the wall — the air outside itself turned colder, sharply, in a single day. The other records predicted exactly this jump — and not the last one.",
        "Instruments don't conspire. So the paper was right, and my doubts were not."
      ]
    },
    "Согреться|Кривая, что не выравнивается": {
      t: "A Curve That Won't Flatten",
      x: [
        "The numbers form a curve, and that curve refuses to flatten — it steepens every time. If the other author was right, and so far he hasn't been wrong once, then what lies ahead isn't merely a cold week. Ahead is a winter unlike any before it.",
        "Predicting a storm doesn't stop it. But it does mean you can be ready."
      ]
    },
    "Согреться|Ледяные записи: кривая бури": {
      t: "Ice Records: The Storm Curve",
      x: [
        "I now have what the author of those records never did: living confirmation of his figures, vial after vial, jump after jump. Winter is preparing something larger than another cold night. And it is preparing it on a schedule somebody predicted in advance — and may not have outlived.",
        "The records warn. Survival decides whether I heard them in time."
      ]
    },

    /* ───────────── Глава 3 · The Dead Don't Sleep ───────────── */
    "Мёртвые не спят|Они приходят в темноте": {
      t: "They Come in the Dark",
      x: [
        "I thought the worst of it was the cold. I was wrong.",
        "The fire that saves you from the freeze is visible from far away. And in the dark they walk toward that light.",
        "The dead don't sleep, don't freeze and know no fear. Every night there are more of them.",
        "Learn to kill quietly, to treat bites and to bar the door.",
        "Otherwise winter will prove kinder than what follows it."
      ]
    },
    "Мёртвые не спят|Ночь, когда пришли все": {
      t: "The Night They All Came",
      x: [
        "I heard them long before I saw them. Not one, not a dozen — all of them.",
        "The boiler hummed, the wire sang under dead hands. I did not pray.",
        "I simply held the door.",
        "By dawn the yard was heaped with bodies. And I was still breathing.",
        "Call the horde on your own terms — and outlive it. Put down 25 of the dead.",
        "Walls and traps need iron. Soon you will want something louder."
      ]
    },
    "Мёртвые не спят|Они всё ещё на посту": {
      t: "Still at Their Posts",
      x: [
        "The dead here move differently — they don't just drift toward noise, they hold positions, as though still on duty. One stood by the same wall three nights running, until I put him down.",
        "Ordinary corpses don't guard posts. These do."
      ]
    },
    "Мёртвые не спят|Не банда — часть": {
      t: "Not a Gang — a Unit",
      x: [
        "The patch isn't a gang, isn't looters. It is the uniform of a real, pre-war army. There weren't just people here — there was a unit.",
        "An army doesn't station a unit where there is nothing to guard."
      ]
    },
    "Мёртвые не спят|Кольцо, что они держали": {
      t: "The Ring They Held",
      x: [
        "The more of them fall, the clearer the shape: they stood in a circle, facing outward, as if covering a retreat — or an entrance."
      ]
    },
    "Мёртвые не спят|Приказ, что не отменили": {
      t: "An Order Never Rescinded",
      x: [
        "«Ordered to hold the perimeter to the last. Evacuation of the site continues. Whatever happens — let no one inside», and a signature blurred by water, or by tears.",
        "They weren't guarding against the dead. They were guarding against US — against those who weren't taken inside."
      ]
    },
    "Мёртвые не спят|Периметр очищен": {
      t: "Perimeter Cleared",
      x: [
        "The perimeter is cleared. What they were guarding isn't the bunker itself but the way into it, hidden where nobody would think to dig.",
        "They were guarding a door. A door leading somewhere deeper than I thought."
      ]
    },
    "Мёртвые не спят|Застава над бункером": {
      t: "The Outpost Above the Bunker",
      x: [
        "I put the uniform, the note and the defensive ring into one picture: this wasn't merely a checkpoint. They were guarding the path to whatever hides deep underground — to the very site the archive blueprints call a vault.",
        "The dead above are sentries. The living below were what they guarded. Both are echoes of the same order."
      ]
    },
    "Мёртвые не спят|Мёртвые на посту": {
      t: "The Dead on Duty",
      x: [
        "The dead don't sleep — not because they are hungry, but because someone once ordered them to stand to the death, and death did not rescind it. The outpost has held its post for years, guarding a bunker door that became a grave for the people who built it.",
        "I relieved them not as an enemy but as the only one who read the order to the end and understood that the evacuation finished long ago. They simply forgot to tell the sentries.",
        "The dead on duty are the quietest tragedy of this winter. Nobody even noticed they are still waiting for the order to fall back."
      ]
    }
  }
};
