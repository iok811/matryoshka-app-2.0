// Dati dei Dialoghi (sezione Pratica): 42 dialoghi (7 per livello CEFR).
// Estratto da App.jsx per ridurre le dimensioni del file principale.
export function dlLine(speaker, ru, it) {
  return { speaker, ru, it };
}

export function dlTurn(otherLine, options) {
  return { otherLine, options };
}

export function dlOpt(ru, it, correct) {
  return { ru, it, correct };
}

export function dialogue(title, subtitle, characters, userRole, lines, turns, comprehension) {
  return { title, subtitle, characters, userRole, lines, turns, comprehension };
}

export const DIALOGUES = {
  A1: [
    dialogue(
      "В кафе",
      "Al bar — ordinare qualcosa da bere e mangiare",
      ["Официант", "Гость"],
      "Гость",
      [
        dlLine("Официант", "Здра́вствуйте! Что бу́дете зака́зывать?", "Buongiorno! Cosa ordina?"),
        dlLine("Гость", "Здра́вствуйте! Оди́н ко́фе, пожа́луйста.", "Buongiorno! Un caffè, per favore."),
        dlLine("Официант", "С молоко́м или без?", "Con latte o senza?"),
        dlLine("Гость", "С молоко́м, пожа́луйста.", "Con latte, per favore."),
        dlLine("Официант", "Что-нибудь ещё?", "Altro?"),
        dlLine("Гость", "Да, оди́н круасса́н.", "Sì, un croissant."),
        dlLine("Официант", "Хорошо́. Э́то всё?", "Va bene. È tutto?"),
        dlLine("Гость", "Да, спаси́бо! Ско́лько с меня́?", "Sì, grazie! Quanto le devo?"),
        dlLine("Официант", "Три́ста рубле́й.", "Trecento rubli."),
        dlLine("Гость", "Вот, пожа́луйста.", "Ecco, prego."),
      ],
      [
        dlTurn(
          dlLine("Официант", "Здра́вствуйте! Что бу́дете зака́зывать?", "Buongiorno! Cosa ordina?"),
          [
            dlOpt("Здра́вствуйте! Оди́н ко́фе, пожа́луйста.", "Buongiorno! Un caffè, per favore.", true),
            dlOpt("Спасибо, до свидания.", "Grazie, arrivederci.", false),
            dlOpt("Я не хочу есть.", "Non ho voglia di mangiare.", false),
          ]
        ),
        dlTurn(
          dlLine("Официант", "С молоко́м или без?", "Con latte o senza?"),
          [
            dlOpt("С молоко́м, пожа́луйста.", "Con latte, per favore.", true),
            dlOpt("Двадцать рублей.", "Venti rubli.", false),
            dlOpt("Я не знаю его.", "Non lo conosco.", false),
          ]
        ),
        dlTurn(
          dlLine("Официант", "Что-нибудь ещё?", "Altro?"),
          [
            dlOpt("Да, оди́н круасса́н.", "Sì, un croissant.", true),
            dlOpt("Нет, э́то стол.", "No, questo è un tavolo.", false),
            dlOpt("Хорошо́, до завтра.", "Va bene, a domani.", false),
          ]
        ),
        dlTurn(
          dlLine("Официант", "Хорошо́. Э́то всё?", "Va bene. È tutto?"),
          [
            dlOpt("Да, спаси́бо! Ско́лько с меня́?", "Sì, grazie! Quanto le devo?", true),
            dlOpt("Нет, я не понимаю.", "No, non capisco.", false),
            dlOpt("Один кофе, пожалуйста.", "Un caffè, per favore.", false),
          ]
        ),
        dlTurn(
          dlLine("Официант", "Три́ста рубле́й.", "Trecento rubli."),
          [
            dlOpt("Вот, пожа́луйста.", "Ecco, prego.", true),
            dlOpt("Э́то очень вкусно!", "È molto buono!", false),
            dlOpt("Извините, где туалет?", "Scusi, dov'è il bagno?", false),
          ]
        ),
      ],
      { question: "Сколько стоит заказ?", options: ["Триста рублей", "Двести рублей", "Сто рублей"], correct: 0 }
    ),
    dialogue(
      "Знакомство в парке",
      "Conoscersi al parco",
      ["Анна","Игорь"],
      "Игорь",
      [
        dlLine("Анна", "Приве́т! Меня́ зову́т А́нна.", "Ciao! Mi chiamo Anna."),
        dlLine("Игорь", "Привет! Я Игорь. Прия́тно познакомиться.", "Ciao! Io sono Igor. Piacere di conoscerti."),
        dlLine("Анна", "Отку́да ты?", "Di dove sei?"),
        dlLine("Игорь", "Я из Ита́лии. А ты?", "Sono dall'Italia. E tu?"),
        dlLine("Анна", "Я из Москвы́. Ты студе́нт?", "Sono di Mosca. Sei studente?"),
        dlLine("Игорь", "Да, я изуча́ю ру́сский язы́к.", "Sì, studio la lingua russa."),
        dlLine("Анна", "Здо́рово! Тебе́ нра́вится Москва́?", "Fantastico! Ti piace Mosca?"),
        dlLine("Игорь", "Да, о́чень нра́вится!", "Sì, mi piace molto!"),
      ],
      [
        dlTurn(
          dlLine("Анна", "Приве́т! Меня́ зову́т А́нна.", "Ciao! Mi chiamo Anna."),
          [
              dlOpt("Привет! Я Игорь. Прия́тно познакомиться.", "Ciao! Io sono Igor. Piacere di conoscerti.", true),
              dlOpt("До свидания!", "Arrivederci!", false),
              dlOpt("Сколько э́то стоит?", "Quanto costa?", false),
          ]
        ),
        dlTurn(
          dlLine("Анна", "Отку́да ты?", "Di dove sei?"),
          [
              dlOpt("Я из Ита́лии. А ты?", "Sono dall'Italia. E tu?", true),
              dlOpt("Мне двадцать лет.", "Ho vent'anni.", false),
              dlOpt("Я не понимаю.", "Non capisco.", false),
          ]
        ),
        dlTurn(
          dlLine("Анна", "Я из Москвы́. Ты студе́нт?", "Sono di Mosca. Sei studente?"),
          [
              dlOpt("Да, я изуча́ю ру́сский язы́к.", "Sì, studio la lingua russa.", true),
              dlOpt("Спаси́бо большо́е!", "Grazie mille!", false),
              dlOpt("Э́то моя книга.", "Questo è il mio libro.", false),
          ]
        ),
        dlTurn(
          dlLine("Анна", "Здо́рово! Тебе́ нра́вится Москва́?", "Fantastico! Ti piace Mosca?"),
          [
              dlOpt("Да, о́чень нра́вится!", "Sì, mi piace molto!", true),
              dlOpt("Нет, я не голоден.", "No, non ho fame.", false),
              dlOpt("Э́то далеко́ отсюда.", "È lontano da qui.", false),
          ]
        ),
      ],
      { question: "Откуда Игорь?", options: ["Из Италии","Из Москвы","Из Франции"], correct: 0 }
    ),
    dialogue(
      "Покупки в магазине",
      "Fare la spesa al negozio",
      ["Продавец","Покупатель"],
      "Покупатель",
      [
        dlLine("Продавец", "Здра́вствуйте! Что вы и́щете?", "Buongiorno! Cosa sta cercando?"),
        dlLine("Покупатель", "Здра́вствуйте! Мне ну́жен хлеб.", "Buongiorno! Ho bisogno di pane."),
        dlLine("Продавец", "Вот све́жий хлеб.", "Ecco il pane fresco."),
        dlLine("Покупатель", "Ско́лько он сто́ит?", "Quanto costa?"),
        dlLine("Продавец", "Пятьдеся́т рубле́й.", "Cinquanta rubli."),
        dlLine("Покупатель", "Хорошо́, я возьму два.", "Va bene, ne prendo due."),
        dlLine("Продавец", "Ещё что-нибудь?", "Altro?"),
        dlLine("Покупатель", "Нет, спасибо. Э́то всё.", "No, grazie. È tutto."),
      ],
      [
        dlTurn(
          dlLine("Продавец", "Здра́вствуйте! Что вы и́щете?", "Buongiorno! Cosa sta cercando?"),
          [
              dlOpt("Здра́вствуйте! Мне ну́жен хлеб.", "Buongiorno! Ho bisogno di pane.", true),
              dlOpt("До свидания!", "Arrivederci!", false),
              dlOpt("Я не голоден.", "Non ho fame.", false),
          ]
        ),
        dlTurn(
          dlLine("Продавец", "Вот све́жий хлеб.", "Ecco il pane fresco."),
          [
              dlOpt("Ско́лько он сто́ит?", "Quanto costa?", true),
              dlOpt("Я живу в Москве.", "Vivo a Mosca.", false),
              dlOpt("Мне двадцать лет.", "Ho vent'anni.", false),
          ]
        ),
        dlTurn(
          dlLine("Продавец", "Пятьдеся́т рубле́й.", "Cinquanta rubli."),
          [
              dlOpt("Хорошо́, я возьму два.", "Va bene, ne prendo due.", true),
              dlOpt("Меня зовут Анна.", "Mi chiamo Anna.", false),
              dlOpt("Э́то интере́сно.", "È interessante.", false),
          ]
        ),
        dlTurn(
          dlLine("Продавец", "Ещё что-нибудь?", "Altro?"),
          [
              dlOpt("Нет, спасибо. Э́то всё.", "No, grazie. È tutto.", true),
              dlOpt("Да, я студент.", "Sì, sono studente.", false),
              dlOpt("Извините, где банк?", "Scusi, dov'è la banca?", false),
          ]
        ),
      ],
      { question: "Сколько хлеба купил покупатель?", options: ["Два","Один","Три"], correct: 0 }
    ),
    dialogue(
      "В ресторане",
      "Al ristorante — ordinare un pasto completo",
      ["Официантка","Клиент"],
      "Клиент",
      [
        dlLine("Официантка", "До́брый ве́чер! Стол на одного́?", "Buonasera! Un tavolo per uno?"),
        dlLine("Клиент", "Да, пожа́луйста.", "Sì, per favore."),
        dlLine("Официантка", "Что вы бу́дете есть?", "Cosa mangia?"),
        dlLine("Клиент", "Суп и ры́бу, пожа́луйста.", "Zuppa e pesce, per favore."),
        dlLine("Официантка", "А пить что-нибудь?", "E da bere?"),
        dlLine("Клиент", "Во́ду, пожа́луйста.", "Acqua, per favore."),
      ],
      [
        dlTurn(
          dlLine("Официантка", "До́брый ве́чер! Стол на одного́?", "Buonasera! Un tavolo per uno?"),
          [
            dlOpt("Да, пожа́луйста.", "Sì, per favore.", true),
            dlOpt("Спасибо, до свидания.", "Grazie, arrivederci.", false),
            dlOpt("Э́то очень вкусно.", "È molto buono.", false),
          ]
        ),
        dlTurn(
          dlLine("Официантка", "Что вы бу́дете есть?", "Cosa mangia?"),
          [
            dlOpt("Суп и ры́бу, пожа́луйста.", "Zuppa e pesce, per favore.", true),
            dlOpt("Стол на одного.", "Un tavolo per uno.", false),
            dlOpt("Э́то моя сестра.", "Questa è mia sorella.", false),
          ]
        ),
        dlTurn(
          dlLine("Официантка", "А пить что-нибудь?", "E da bere?"),
          [
            dlOpt("Во́ду, пожа́луйста.", "Acqua, per favore.", true),
            dlOpt("Да, пожа́луйста.", "Sì, per favore.", false),
            dlOpt("Извините, где туалет?", "Scusi, dov'è il bagno?", false),
          ]
        ),
      ],
      { question: "Что заказал клиент на еду?", options: ["Суп и рыбу","Салат и мясо","Пиццу"], correct: 0 }
    ),
    dialogue(
      "В семье",
      "In famiglia — parlare della giornata a cena",
      ["Мама","Сын"],
      "Сын",
      [
        dlLine("Мама", "Как прошёл твой день?", "Com'è andata la tua giornata?"),
        dlLine("Сын", "Хорошо́, спасибо. Было мно́го уроков.", "Bene, grazie. C'erano molte lezioni."),
        dlLine("Мама", "А дома́шнее зада́ние есть?", "E hai compiti?"),
        dlLine("Сын", "Да, немно́го математики.", "Sì, un po' di matematica."),
        dlLine("Мама", "У́жин гото́в, иди́ есть.", "La cena è pronta, vieni a mangiare."),
        dlLine("Сын", "Иду́! Спаси́бо, ма́ма.", "Vengo! Grazie, mamma."),
      ],
      [
        dlTurn(
          dlLine("Мама", "Как прошёл твой день?", "Com'è andata la tua giornata?"),
          [
            dlOpt("Хорошо́, спасибо. Было мно́го уроков.", "Bene, grazie. C'erano molte lezioni.", true),
            dlOpt("Ужин готов.", "La cena è pronta.", false),
            dlOpt("Да, немно́го математики.", "Sì, un po' di matematica.", false),
          ]
        ),
        dlTurn(
          dlLine("Мама", "А дома́шнее зада́ние есть?", "E hai compiti?"),
          [
            dlOpt("Да, немно́го математики.", "Sì, un po' di matematica.", true),
            dlOpt("Хорошо́, спасибо.", "Bene, grazie.", false),
            dlOpt("Иду!", "Vengo!", false),
          ]
        ),
        dlTurn(
          dlLine("Мама", "У́жин гото́в, иди́ есть.", "La cena è pronta, vieni a mangiare."),
          [
            dlOpt("Иду́! Спаси́бо, ма́ма.", "Vengo! Grazie, mamma.", true),
            dlOpt("Да, немно́го математики.", "Sì, un po' di matematica.", false),
            dlOpt("Как прошёл твой день?", "Com'è andata la tua giornata?", false),
          ]
        ),
      ],
      { question: "Какой предмет упомянул сын?", options: ["Математика","Русский язык","История"], correct: 0 }
    ),
    dialogue(
      "В школе",
      "A scuola — parlare con l'insegnante prima della lezione",
      ["Учитель","Ученица"],
      "Ученица",
      [
        dlLine("Учитель", "До́брое у́тро! Ты гото́ва к уро́ку?", "Buongiorno! Sei pronta per la lezione?"),
        dlLine("Ученица", "До́брое у́тро! Да, гото́ва.", "Buongiorno! Sì, sono pronta."),
        dlLine("Учитель", "У тебя́ есть уче́бник?", "Hai il libro di testo?"),
        dlLine("Ученица", "Да, вот он.", "Sì, eccolo."),
        dlLine("Учитель", "Отли́чно. Садись на своё место.", "Ottimo. Siediti al tuo posto."),
        dlLine("Ученица", "Хорошо́, спасибо.", "Va bene, grazie."),
      ],
      [
        dlTurn(
          dlLine("Учитель", "До́брое у́тро! Ты гото́ва к уро́ку?", "Buongiorno! Sei pronta per la lezione?"),
          [
            dlOpt("До́брое у́тро! Да, гото́ва.", "Buongiorno! Sì, sono pronta.", true),
            dlOpt("У тебя́ есть уче́бник?", "Hai il libro di testo?", false),
            dlOpt("Садись на своё место.", "Siediti al tuo posto.", false),
          ]
        ),
        dlTurn(
          dlLine("Учитель", "У тебя́ есть уче́бник?", "Hai il libro di testo?"),
          [
            dlOpt("Да, вот он.", "Sì, eccolo.", true),
            dlOpt("Да, готова.", "Sì, sono pronta.", false),
            dlOpt("Хорошо́, спасибо.", "Va bene, grazie.", false),
          ]
        ),
        dlTurn(
          dlLine("Учитель", "Отли́чно. Садись на своё место.", "Ottimo. Siediti al tuo posto."),
          [
            dlOpt("Хорошо́, спасибо.", "Va bene, grazie.", true),
            dlOpt("Да, вот он.", "Sì, eccolo.", false),
            dlOpt("Доброе утро!", "Buongiorno!", false),
          ]
        ),
      ],
      { question: "Что попросил учитель у ученицы?", options: ["Учебник","Тетрадь","Ручку"], correct: 0 }
    ),
    dialogue(
      "Пого́да сего́дня",
      "Il meteo — parlarne prima di uscire",
      ["Оля","Максим"],
      "Максим",
      [
        dlLine("Оля", "Какая сего́дня пого́да?", "Che tempo fa oggi?"),
        dlLine("Максим", "На улице солнечно и тепло́.", "Fuori c'è sole ed è caldo."),
        dlLine("Оля", "Отли́чно! Пойдём гулять?", "Ottimo! Andiamo a passeggiare?"),
        dlLine("Максим", "Да, с удово́льствием!", "Sì, con piacere!"),
        dlLine("Оля", "Возьмём с собо́й во́ду?", "Prendiamo dell'acqua con noi?"),
        dlLine("Максим", "Хоро́шая иде́я.", "Buona idea."),
      ],
      [
        dlTurn(
          dlLine("Оля", "Какая сего́дня пого́да?", "Che tempo fa oggi?"),
          [
            dlOpt("На улице солнечно и тепло́.", "Fuori c'è sole ed è caldo.", true),
            dlOpt("Пойдём гулять?", "Andiamo a passeggiare?", false),
            dlOpt("Хоро́шая иде́я.", "Buona idea.", false),
          ]
        ),
        dlTurn(
          dlLine("Оля", "Отли́чно! Пойдём гулять?", "Ottimo! Andiamo a passeggiare?"),
          [
            dlOpt("Да, с удово́льствием!", "Sì, con piacere!", true),
            dlOpt("На улице тепло́.", "Fuori è caldo.", false),
            dlOpt("Возьмём воду?", "Prendiamo dell'acqua?", false),
          ]
        ),
        dlTurn(
          dlLine("Оля", "Возьмём с собо́й во́ду?", "Prendiamo dell'acqua con noi?"),
          [
            dlOpt("Хоро́шая иде́я.", "Buona idea.", true),
            dlOpt("Да, с удово́льствием!", "Sì, con piacere!", false),
            dlOpt("На улице солнечно.", "Fuori c'è sole.", false),
          ]
        ),
      ],
      { question: "Какая была пого́да?", options: ["Солнечно и тепло́","Дождь и хо́лодно","Снег"], correct: 0 }
    ),
  ],
  A2: [
    dialogue(
      "На вокзале",
      "Alla stazione, comprare un biglietto",
      ["Кассир","Пассажир"],
      "Пассажир",
      [
      dlLine("Кассир", "Здра́вствуйте! Куда́ вам биле́т?", "Buongiorno! Il biglietto per dove?"),
      dlLine("Пассажир", "Здра́вствуйте! Мне ну́жен биле́т в Санкт-Петербу́рг.", "Buongiorno! Ho bisogno di un biglietto per San Pietroburgo."),
      dlLine("Кассир", "На како́е число́?", "Per che data?"),
      dlLine("Пассажир", "На за́втра, пожа́луйста.", "Per domani, per favore."),
      dlLine("Кассир", "Есть места́ на у́тренний по́езд.", "Ci sono posti sul treno del mattino."),
      dlLine("Пассажир", "Отли́чно, беру один билет.", "Perfetto, prendo un biglietto."),
      dlLine("Кассир", "С вас полторы́ ты́сячи рубле́й.", "Sono millecinquecento rubli."),
      dlLine("Пассажир", "Вот, пожа́луйста.", "Ecco, prego."),
      ],
      [
      dlTurn(
        dlLine("Кассир", "Здра́вствуйте! Куда́ вам биле́т?", "Buongiorno! Il biglietto per dove?"),
        [
              dlOpt("Здра́вствуйте! Мне ну́жен биле́т в Санкт-Петербу́рг.", "Buongiorno! Ho bisogno di un biglietto per San Pietroburgo.", true),
              dlOpt("Спасибо, до свидания!", "Grazie, arrivederci!", false),
              dlOpt("Я не хочу ехать.", "Non voglio partire.", false),
        ]
      ),
      dlTurn(
        dlLine("Кассир", "На како́е число́?", "Per che data?"),
        [
              dlOpt("На за́втра, пожа́луйста.", "Per domani, per favore.", true),
              dlOpt("Мне нравится поезд.", "Mi piace il treno.", false),
              dlOpt("Э́то дорого.", "È caro.", false),
        ]
      ),
      dlTurn(
        dlLine("Кассир", "Есть места́ на у́тренний по́езд.", "Ci sono posti sul treno del mattino."),
        [
              dlOpt("Отли́чно, беру один билет.", "Perfetto, prendo un biglietto.", true),
              dlOpt("Я не знаю его.", "Non lo conosco.", false),
              dlOpt("Где здесь туалет?", "Dov'è il bagno qui?", false),
        ]
      ),
      dlTurn(
        dlLine("Кассир", "С вас полторы́ ты́сячи рубле́й.", "Sono millecinquecento rubli."),
        [
              dlOpt("Вот, пожа́луйста.", "Ecco, prego.", true),
              dlOpt("Э́то очень вкусно.", "È molto buono.", false),
              dlOpt("Я приеду завтра.", "Arriverò domani.", false),
        ]
      ),
      ],
      { question: "Куда едет пассажир?", options: ["В Санкт-Петербург","В Москву","В Италию"], correct: 0 }
    ),
    dialogue(
      "У врача",
      "Dal medico, descrivere i sintomi",
      ["Врач","Пациент"],
      "Пациент",
      [
      dlLine("Врач", "Здра́вствуйте! Что вас беспоко́ит?", "Buongiorno! Cosa la preoccupa?"),
      dlLine("Пациент", "У меня́ боли́т голова́.", "Ho mal di testa."),
      dlLine("Врач", "Как до́лго э́то продолжается?", "Da quanto tempo va avanti?"),
      dlLine("Пациент", "Уже́ два дня.", "Già da due giorni."),
      dlLine("Врач", "У вас есть температу́ра?", "Ha la febbre?"),
      dlLine("Пациент", "Да, небольша́я.", "Sì, un po'."),
      dlLine("Врач", "Я вы́пишу вам лека́рство.", "Le prescriverò una medicina."),
      dlLine("Пациент", "Спаси́бо большо́е, до́ктор.", "Grazie mille, dottore."),
      ],
      [
      dlTurn(
        dlLine("Врач", "Здра́вствуйте! Что вас беспоко́ит?", "Buongiorno! Cosa la preoccupa?"),
        [
              dlOpt("У меня́ боли́т голова́.", "Ho mal di testa.", true),
              dlOpt("Спасибо, до свидания.", "Grazie, arrivederci.", false),
              dlOpt("Я не болен.", "Non sono malato.", false),
        ]
      ),
      dlTurn(
        dlLine("Врач", "Как до́лго э́то продолжается?", "Da quanto tempo va avanti?"),
        [
              dlOpt("Уже́ два дня.", "Già da due giorni.", true),
              dlOpt("Мне нравится э́то.", "Mi piace questo.", false),
              dlOpt("Э́то дорого.", "È caro.", false),
        ]
      ),
      dlTurn(
        dlLine("Врач", "У вас есть температу́ра?", "Ha la febbre?"),
        [
              dlOpt("Да, небольша́я.", "Sì, un po'.", true),
              dlOpt("Я иду домо́й.", "Vado a casa.", false),
              dlOpt("Э́то не ва́жно.", "Non è importante.", false),
        ]
      ),
      dlTurn(
        dlLine("Врач", "Я вы́пишу вам лека́рство.", "Le prescriverò una medicina."),
        [
              dlOpt("Спаси́бо большо́е, до́ктор.", "Grazie mille, dottore.", true),
              dlOpt("Нет, спасибо, не надо.", "No grazie, non serve.", false),
              dlOpt("Где банк?", "Dov'è la banca?", false),
        ]
      ),
      ],
      { question: "Сколько дней болит голова у пациента?", options: ["Два дня","Одну неде́лю","Один день"], correct: 0 }
    ),
    dialogue(
      "Собеседование на рабо́ту",
      "Un colloquio di lavoro semplice",
      ["Менеджер","Кандидат"],
      "Кандидат",
      [
      dlLine("Менеджер", "Здра́вствуйте, проходи́те, сади́тесь.", "Buongiorno, entri, si sieda."),
      dlLine("Кандидат", "Спаси́бо, здра́вствуйте.", "Grazie, buongiorno."),
      dlLine("Менеджер", "Расскажи́те о своём о́пыте.", "Mi parli della sua esperienza."),
      dlLine("Кандидат", "Я рабо́тал в магази́не два го́да.", "Ho lavorato in un negozio per due anni."),
      dlLine("Менеджер", "Почему вы хотите эту рабо́ту?", "Perché vuole questo lavoro?"),
      dlLine("Кандидат", "Мне интере́сна ва́ша компа́ния.", "Mi interessa la vostra azienda."),
      dlLine("Менеджер", "Хорошо́, мы вам позвоним.", "Va bene, la chiameremo."),
      dlLine("Кандидат", "Спаси́бо за встре́чу.", "Grazie per l'incontro."),
      ],
      [
      dlTurn(
        dlLine("Менеджер", "Расскажи́те о своём о́пыте.", "Mi parli della sua esperienza."),
        [
              dlOpt("Я рабо́тал в магази́не два го́да.", "Ho lavorato in un negozio per due anni.", true),
              dlOpt("Я не хочу говорить.", "Non voglio parlare.", false),
              dlOpt("Э́то секрет.", "È un segreto.", false),
        ]
      ),
      dlTurn(
        dlLine("Менеджер", "Почему вы хотите эту рабо́ту?", "Perché vuole questo lavoro?"),
        [
              dlOpt("Мне интере́сна ва́ша компа́ния.", "Mi interessa la vostra azienda.", true),
              dlOpt("Мне нужны деньги.", "Ho bisogno di soldi.", false),
              dlOpt("Я не знаю.", "Non lo so.", false),
        ]
      ),
      dlTurn(
        dlLine("Менеджер", "Хорошо́, мы вам позвоним.", "Va bene, la chiameremo."),
        [
              dlOpt("Спаси́бо за встре́чу.", "Grazie per l'incontro.", true),
              dlOpt("Когда начинается фильм?", "Quando inizia il film?", false),
              dlOpt("Я не буду ждать.", "Non aspetterò.", false),
        ]
      ),
      ],
      { question: "Сколько лет кандидат работал в магазине?", options: ["Два года","Один год","Пять лет"], correct: 0 }
    ),
    dialogue(
      "В аптеке",
      "In farmacia — chiedere consiglio per un mal di testa",
      ["Фармацевт","Клиентка"],
      "Клиентка",
      [
        dlLine("Фармацевт", "Здра́вствуйте! Чем могу́ помо́чь?", "Buongiorno! Come posso aiutarla?"),
        dlLine("Клиентка", "У меня́ боли́т голова́.", "Ho mal di testa."),
        dlLine("Фармацевт", "Возьми́те э́ти табле́тки.", "Prenda queste pastiglie."),
        dlLine("Клиентка", "Как ча́сто их принима́ть?", "Con che frequenza le devo prendere?"),
        dlLine("Фармацевт", "Два ра́за в день.", "Due volte al giorno."),
        dlLine("Клиентка", "Спаси́бо большо́е!", "Grazie mille!"),
      ],
      [
        dlTurn(
          dlLine("Фармацевт", "Здра́вствуйте! Чем могу́ помо́чь?", "Buongiorno! Come posso aiutarla?"),
          [
            dlOpt("У меня́ боли́т голова́.", "Ho mal di testa.", true),
            dlOpt("Два ра́за в день.", "Due volte al giorno.", false),
            dlOpt("Спаси́бо большо́е!", "Grazie mille!", false),
          ]
        ),
        dlTurn(
          dlLine("Фармацевт", "Возьми́те э́ти табле́тки.", "Prenda queste pastiglie."),
          [
            dlOpt("Как ча́сто их принима́ть?", "Con che frequenza le devo prendere?", true),
            dlOpt("У меня́ боли́т голова́.", "Ho mal di testa.", false),
            dlOpt("Спаси́бо большо́е!", "Grazie mille!", false),
          ]
        ),
        dlTurn(
          dlLine("Фармацевт", "Два ра́за в день.", "Due volte al giorno."),
          [
            dlOpt("Спаси́бо большо́е!", "Grazie mille!", true),
            dlOpt("Как ча́сто их принима́ть?", "Con che frequenza le devo prendere?", false),
            dlOpt("Возьми́те э́ти табле́тки.", "Prenda queste pastiglie.", false),
          ]
        ),
      ],
      { question: "Как часто ну́жно принимать таблетки?", options: ["Два раза в день","Один раз в день","Три раза в день"], correct: 0 }
    ),
    dialogue(
      "Разговор по телефону",
      "Al telefono — organizzare un incontro con un amico",
      ["Настя","Дима"],
      "Дима",
      [
        dlLine("Настя", "Алло́! Ди́ма, приве́т!", "Pronto! Dima, ciao!"),
        dlLine("Дима", "Приве́т, На́стя! Как дела́?", "Ciao, Nastja! Come va?"),
        dlLine("Настя", "Хорошо́. Ты свободен завтра?", "Bene. Sei libero domani?"),
        dlLine("Дима", "Да, свобо́ден. А что?", "Sì, sono libero. Perché?"),
        dlLine("Настя", "Дава́й встре́тимся в кафе́.", "Incontriamoci al bar."),
        dlLine("Дима", "Отли́чно, во сколько?", "Ottimo, a che ora?"),
      ],
      [
        dlTurn(
          dlLine("Настя", "Алло́! Ди́ма, приве́т!", "Pronto! Dima, ciao!"),
          [
            dlOpt("Приве́т, На́стя! Как дела́?", "Ciao, Nastja! Come va?", true),
            dlOpt("Дава́й встре́тимся в кафе́.", "Incontriamoci al bar.", false),
            dlOpt("Отли́чно, во сколько?", "Ottimo, a che ora?", false),
          ]
        ),
        dlTurn(
          dlLine("Настя", "Хорошо́. Ты свободен завтра?", "Bene. Sei libero domani?"),
          [
            dlOpt("Да, свобо́ден. А что?", "Sì, sono libero. Perché?", true),
            dlOpt("Привет, Настя!", "Ciao, Nastja!", false),
            dlOpt("Отли́чно, во сколько?", "Ottimo, a che ora?", false),
          ]
        ),
        dlTurn(
          dlLine("Настя", "Дава́й встре́тимся в кафе́.", "Incontriamoci al bar."),
          [
            dlOpt("Отли́чно, во сколько?", "Ottimo, a che ora?", true),
            dlOpt("Да, свободен.", "Sì, sono libero.", false),
            dlOpt("Как дела?", "Come va?", false),
          ]
        ),
      ],
      { question: "Где договорились встретиться Настя и Дима?", options: ["В кафе","В парке","В кино"], correct: 0 }
    ),
    dialogue(
      "Планы на выходные",
      "Il tempo libero nel weekend",
      ["Лена","Артём"],
      "Артём",
      [
        dlLine("Лена", "Что ты де́лаешь в суббо́ту?", "Cosa fai sabato?"),
        dlLine("Артём", "Пока́ не зна́ю. А ты?", "Non lo so ancora. E tu?"),
        dlLine("Лена", "Я иду́ на конце́рт. Хо́чешь со мной?", "Vado a un concerto. Vuoi venire con me?"),
        dlLine("Артём", "С удово́льствием! Во ско́лько нача́ло?", "Con piacere! A che ora inizia?"),
        dlLine("Лена", "В во́семь ве́чера.", "Alle otto di sera."),
        dlLine("Артём", "Хорошо́, встретимся там.", "Va bene, ci vediamo lì."),
      ],
      [
        dlTurn(
          dlLine("Лена", "Что ты де́лаешь в суббо́ту?", "Cosa fai sabato?"),
          [
            dlOpt("Пока́ не зна́ю. А ты?", "Non lo so ancora. E tu?", true),
            dlOpt("В во́семь ве́чера.", "Alle otto di sera.", false),
            dlOpt("С удовольствием!", "Con piacere!", false),
          ]
        ),
        dlTurn(
          dlLine("Лена", "Я иду́ на конце́рт. Хо́чешь со мной?", "Vado a un concerto. Vuoi venire con me?"),
          [
            dlOpt("С удово́льствием! Во ско́лько нача́ло?", "Con piacere! A che ora inizia?", true),
            dlOpt("Пока не знаю.", "Non lo so ancora.", false),
            dlOpt("Встретимся там.", "Ci vediamo lì.", false),
          ]
        ),
        dlTurn(
          dlLine("Лена", "В во́семь ве́чера.", "Alle otto di sera."),
          [
            dlOpt("Хорошо́, встретимся там.", "Va bene, ci vediamo lì.", true),
            dlOpt("Во сколько начало?", "A che ora inizia?", false),
            dlOpt("Пока не знаю.", "Non lo so ancora.", false),
          ]
        ),
      ],
      { question: "Во сколько начинается концерт?", options: ["В восемь вечера","В семь вечера","В девять вечера"], correct: 0 }
    ),
    dialogue(
      "Как пройти?",
      "Chiedere indicazioni stradali per strada",
      ["Турист","Прохожий"],
      "Турист",
      [
        dlLine("Турист", "Извини́те, как пройти́ к музе́ю?", "Scusi, come si arriva al museo?"),
        dlLine("Прохожий", "Идите прямо, пото́м налево.", "Vada dritto, poi a sinistra."),
        dlLine("Турист", "Э́то далеко́?", "È lontano?"),
        dlLine("Прохожий", "Нет, мину́т десять пешком.", "No, dieci minuti a piedi."),
        dlLine("Турист", "Спаси́бо за по́мощь!", "Grazie per l'aiuto!"),
        dlLine("Прохожий", "Пожа́луйста, уда́чи!", "Prego, buona fortuna!"),
      ],
      [
        dlTurn(
          dlLine("Прохожий", "Идите прямо, пото́м налево.", "Vada dritto, poi a sinistra."),
          [
            dlOpt("Э́то далеко́?", "È lontano?", true),
            dlOpt("Спаси́бо за по́мощь!", "Grazie per l'aiuto!", false),
            dlOpt("Как пройти к музею?", "Come si arriva al museo?", false),
          ]
        ),
        dlTurn(
          dlLine("Прохожий", "Нет, мину́т десять пешком.", "No, dieci minuti a piedi."),
          [
            dlOpt("Спаси́бо за по́мощь!", "Grazie per l'aiuto!", true),
            dlOpt("Э́то далеко́?", "È lontano?", false),
            dlOpt("Идите прямо.", "Vada dritto.", false),
          ]
        ),
        dlTurn(
          dlLine("Прохожий", "Пожа́луйста, уда́чи!", "Prego, buona fortuna!"),
          [
            dlOpt("Спаси́бо за по́мощь!", "Grazie per l'aiuto!", true),
            dlOpt("Э́то далеко́?", "È lontano?", false),
            dlOpt("Идите прямо, пото́м налево.", "Vada dritto, poi a sinistra.", false),
          ]
        ),
      ],
      { question: "Сколько мину́т пешком до музея?", options: ["Десять","Пять","Двадцать"], correct: 0 }
    ),
  ],
  B1: [
    dialogue(
      "На собеседовании",
      "Al colloquio di lavoro",
      ["Работодатель","Кандидат"],
      "Кандидат",
      [
      dlLine("Работодатель", "Расскажите немно́го о себе.", "Mi parli un po' di lei."),
      dlLine("Кандидат", "Я рабо́таю в ма́ркетинге уже́ пять лет.", "Lavoro nel marketing da cinque anni."),
      dlLine("Работодатель", "Почему вы хотите сменить рабо́ту?", "Perché vuole cambiare lavoro?"),
      dlLine("Кандидат", "Я ищу́ но́вые вы́зовы и возмо́жности ро́ста.", "Cerco nuove sfide e opportunità di crescita."),
      dlLine("Работодатель", "Каки́е у вас си́льные сто́роны?", "Quali sono i suoi punti di forza?"),
      dlLine("Кандидат", "Я хорошо́ работаю в команде и бы́стро учусь.", "Lavoro bene in team e imparo velocemente."),
      dlLine("Работодатель", "Когда́ вы могли́ бы нача́ть?", "Quando potrebbe iniziare?"),
      dlLine("Кандидат", "Я готов начать через две неде́ли.", "Sono pronto a iniziare tra due settimane."),
      ],
      [
      dlTurn(
        dlLine("Работодатель", "Расскажите немно́го о себе.", "Mi parli un po' di lei."),
        [
              dlOpt("Я рабо́таю в ма́ркетинге уже́ пять лет.", "Lavoro nel marketing da cinque anni.", true),
              dlOpt("Спасибо за приглашение.", "Grazie per l'invito.", false),
              dlOpt("Э́то интересный вопро́с.", "È una domanda interessante.", false),
        ]
      ),
      dlTurn(
        dlLine("Работодатель", "Почему вы хотите сменить рабо́ту?", "Perché vuole cambiare lavoro?"),
        [
              dlOpt("Я ищу́ но́вые вы́зовы и возмо́жности ро́ста.", "Cerco nuove sfide e opportunità di crescita.", true),
              dlOpt("Я не уверен.", "Non sono sicuro.", false),
              dlOpt("У меня нет опыта.", "Non ho esperienza.", false),
        ]
      ),
      dlTurn(
        dlLine("Работодатель", "Каки́е у вас си́льные сто́роны?", "Quali sono i suoi punti di forza?"),
        [
              dlOpt("Я хорошо́ работаю в команде и бы́стро учусь.", "Lavoro bene in team e imparo velocemente.", true),
              dlOpt("Я пло́хо работаю под давлением.", "Lavoro male sotto pressione.", false),
              dlOpt("Э́то не ва́жно.", "Non è importante.", false),
        ]
      ),
      dlTurn(
        dlLine("Работодатель", "Когда́ вы могли́ бы нача́ть?", "Quando potrebbe iniziare?"),
        [
              dlOpt("Я готов начать через две неде́ли.", "Sono pronto a iniziare tra due settimane.", true),
              dlOpt("Никогда.", "Mai.", false),
              dlOpt("Э́то зависит от погоды.", "Dipende dal tempo.", false),
        ]
      ),
      ],
      { question: "Сколько лет кандидат работает в маркетинге?", options: ["Пять лет","Два года","Десять лет"], correct: 0 }
    ),
    dialogue(
      "Планирование отпуска",
      "Pianificare le vacanze con un amico",
      ["Анна","Максим"],
      "Максим",
      [
      dlLine("Анна", "Куда поедем в отпуск в э́том году?", "Dove andiamo in vacanza quest'anno?"),
      dlLine("Максим", "Я ду́маю, сто́ит пое́хать к мо́рю.", "Penso che valga la pena andare al mare."),
      dlLine("Анна", "Хорошая идея, но э́то будет дорого.", "Buona idea, ma sarà costoso."),
      dlLine("Максим", "Мо́жем найти́ что-то бюдже́тное.", "Possiamo trovare qualcosa di economico."),
      dlLine("Анна", "Когда́ лу́чше брони́ровать биле́ты?", "Quando è meglio prenotare i biglietti?"),
      dlLine("Максим", "Чем ра́ньше, тем деше́вле.", "Prima si prenota, più economico è."),
      dlLine("Анна", "Тогда забронируем на э́той неделе.", "Allora prenotiamo questa settimana."),
      dlLine("Максим", "Договори́лись!", "D'accordo!"),
      ],
      [
      dlTurn(
        dlLine("Анна", "Куда поедем в отпуск в э́том году?", "Dove andiamo in vacanza quest'anno?"),
        [
              dlOpt("Я ду́маю, сто́ит пое́хать к мо́рю.", "Penso che valga la pena andare al mare.", true),
              dlOpt("Я не люблю путешествовать.", "Non mi piace viaggiare.", false),
              dlOpt("Э́то не моё дело.", "Non sono affari miei.", false),
        ]
      ),
      dlTurn(
        dlLine("Анна", "Хорошая идея, но э́то будет дорого.", "Buona idea, ma sarà costoso."),
        [
              dlOpt("Мо́жем найти́ что-то бюдже́тное.", "Possiamo trovare qualcosa di economico.", true),
              dlOpt("Мне всё равно.", "Non mi importa.", false),
              dlOpt("Деньги не важны.", "I soldi non sono importanti.", false),
        ]
      ),
      dlTurn(
        dlLine("Анна", "Когда́ лу́чше брони́ровать биле́ты?", "Quando è meglio prenotare i biglietti?"),
        [
              dlOpt("Чем ра́ньше, тем деше́вле.", "Prima si prenota, più economico è.", true),
              dlOpt("Никогда не бронируй.", "Non prenotare mai.", false),
              dlOpt("Э́то не имеет значения.", "Non ha importanza.", false),
        ]
      ),
      ],
      { question: "Куда предлагает поехать Максим?", options: ["К морю","В горы","За границу"], correct: 0 }
    ),
    dialogue(
      "Разговор о карьере",
      "Parlare di cambiamenti di carriera",
      ["Ольга","Дмитрий"],
      "Дмитрий",
      [
      dlLine("Ольга", "Я слышала, ты меняешь рабо́ту.", "Ho sentito che cambi lavoro."),
      dlLine("Дмитрий", "Да, я уста́л от ста́рой компа́нии.", "Sì, sono stanco della vecchia azienda."),
      dlLine("Ольга", "Что тебе́ не нра́вилось?", "Cosa non ti piaceva?"),
      dlLine("Дмитрий", "Не бы́ло возмо́жностей для ро́ста.", "Non c'erano opportunità di crescita."),
      dlLine("Ольга", "Куда́ ты переходи́шь?", "Dove ti trasferisci?"),
      dlLine("Дмитрий", "В старта́п, там бо́льше свобо́ды.", "In una startup, lì c'è più libertà."),
      dlLine("Ольга", "Звучит интере́сно, удачи!", "Sembra interessante, buona fortuna!"),
      dlLine("Дмитрий", "Спаси́бо, наде́юсь на лу́чшее.", "Grazie, spero nel meglio."),
      ],
      [
      dlTurn(
        dlLine("Ольга", "Что тебе́ не нра́вилось?", "Cosa non ti piaceva?"),
        [
              dlOpt("Не бы́ло возмо́жностей для ро́ста.", "Non c'erano opportunità di crescita.", true),
              dlOpt("Всё было отли́чно.", "Andava tutto benissimo.", false),
              dlOpt("Я не помню.", "Non ricordo.", false),
        ]
      ),
      dlTurn(
        dlLine("Ольга", "Куда́ ты переходи́шь?", "Dove ti trasferisci?"),
        [
              dlOpt("В старта́п, там бо́льше свобо́ды.", "In una startup, lì c'è più libertà.", true),
              dlOpt("Никуда не перехожу.", "Non mi trasferisco da nessuna parte.", false),
              dlOpt("Э́то секрет.", "È un segreto.", false),
        ]
      ),
      dlTurn(
        dlLine("Ольга", "Звучит интере́сно, удачи!", "Sembra interessante, buona fortuna!"),
        [
              dlOpt("Спаси́бо, наде́юсь на лу́чшее.", "Grazie, spero nel meglio.", true),
              dlOpt("Мне не нужна удача.", "Non ho bisogno di fortuna.", false),
              dlOpt("Э́то плохая идея.", "È una cattiva idea.", false),
        ]
      ),
      ],
      { question: "Почему Дмитрий уходит со старой рабо́ты?", options: ["Не было возможностей для роста","Маленькая зарплата","Плохие коллеги"], correct: 0 }
    ),
    dialogue(
      "Обсуждение фильма",
      "Discutere di un film appena visto",
      ["Катя","Олег"],
      "Олег",
      [
        dlLine("Катя", "Ты уже́ посмотре́л но́вый фильм?", "Hai già visto il nuovo film?"),
        dlLine("Олег", "Да, вчера ве́чером. Мне очень понравилось.", "Sì, ieri sera. Mi è piaciuto molto."),
        dlLine("Катя", "А како́й моме́нт запо́мнился бо́льше всего́?", "E quale momento ti è rimasto più impresso?"),
        dlLine("Олег", "Фина́л был неожи́данным.", "Il finale è stato inaspettato."),
        dlLine("Катя", "Согла́сна, я то́же не ожида́ла.", "Concordo, nemmeno io me lo aspettavo."),
        dlLine("Олег", "Сто́ит посмотре́ть ещё раз.", "Vale la pena rivederlo."),
      ],
      [
        dlTurn(
          dlLine("Катя", "Ты уже́ посмотре́л но́вый фильм?", "Hai già visto il nuovo film?"),
          [
            dlOpt("Да, вчера ве́чером. Мне очень понравилось.", "Sì, ieri sera. Mi è piaciuto molto.", true),
            dlOpt("Фина́л был неожи́данным.", "Il finale è stato inaspettato.", false),
            dlOpt("Сто́ит посмотре́ть ещё раз.", "Vale la pena rivederlo.", false),
          ]
        ),
        dlTurn(
          dlLine("Катя", "А како́й моме́нт запо́мнился бо́льше всего́?", "E quale momento ti è rimasto più impresso?"),
          [
            dlOpt("Фина́л был неожи́данным.", "Il finale è stato inaspettato.", true),
            dlOpt("Мне очень понравилось.", "Mi è piaciuto molto.", false),
            dlOpt("Согласен, я тоже.", "Concordo, anche io.", false),
          ]
        ),
        dlTurn(
          dlLine("Катя", "Согла́сна, я то́же не ожида́ла.", "Concordo, nemmeno io me lo aspettavo."),
          [
            dlOpt("Сто́ит посмотре́ть ещё раз.", "Vale la pena rivederlo.", true),
            dlOpt("Фина́л был неожи́данным.", "Il finale è stato inaspettato.", false),
            dlOpt("Да, вчера ве́чером.", "Sì, ieri sera.", false),
          ]
        ),
      ],
      { question: "Что было неожиданным в фильме?", options: ["Финал","Начало","Музыка"], correct: 0 }
    ),
    dialogue(
      "Проблема с соседом",
      "Un problema con un vicino di casa rumoroso",
      ["Марина","Виктор"],
      "Виктор",
      [
        dlLine("Марина", "Ви́ктор, у нас пробле́ма с сосе́дом све́рху.", "Viktor, abbiamo un problema con il vicino di sopra."),
        dlLine("Виктор", "Что случи́лось?", "Cosa è successo?"),
        dlLine("Марина", "Он очень гро́мко включает музыку по ночам.", "Mette la musica molto forte di notte."),
        dlLine("Виктор", "Мо́жет, сто́ит с ним поговори́ть?", "Forse vale la pena parlargli?"),
        dlLine("Марина", "Я уже́ про́бовала, но не помогло́.", "Ho già provato, ma non ha aiutato."),
        dlLine("Виктор", "Тогда́ напи́шем в управля́ющую компа́нию.", "Allora scriveremo all'amministratore condominiale."),
      ],
      [
        dlTurn(
          dlLine("Марина", "Ви́ктор, у нас пробле́ма с сосе́дом све́рху.", "Viktor, abbiamo un problema con il vicino di sopra."),
          [
            dlOpt("Что случи́лось?", "Cosa è successo?", true),
            dlOpt("Я уже пробовала.", "Ho già provato.", false),
            dlOpt("Напишем в управляющую компанию.", "Scriveremo all'amministratore.", false),
          ]
        ),
        dlTurn(
          dlLine("Марина", "Он очень гро́мко включает музыку по ночам.", "Mette la musica molto forte di notte."),
          [
            dlOpt("Мо́жет, сто́ит с ним поговори́ть?", "Forse vale la pena parlargli?", true),
            dlOpt("Что случи́лось?", "Cosa è successo?", false),
            dlOpt("Я уже пробовала.", "Ho già provato.", false),
          ]
        ),
        dlTurn(
          dlLine("Марина", "Я уже́ про́бовала, но не помогло́.", "Ho già provato, ma non ha aiutato."),
          [
            dlOpt("Тогда́ напи́шем в управля́ющую компа́нию.", "Allora scriveremo all'amministratore condominiale.", true),
            dlOpt("Мо́жет, сто́ит с ним поговори́ть?", "Forse vale la pena parlargli?", false),
            dlOpt("Что случи́лось?", "Cosa è successo?", false),
          ]
        ),
      ],
      { question: "Что делает сосед по ночам?", options: ["Включает гро́мко музыку","Готовит еду","Смотрит телевизор"], correct: 0 }
    ),
    dialogue(
      "Заказ столика",
      "Prenotare un tavolo al ristorante per telefono",
      ["Администратор","Гость"],
      "Гость",
      [
        dlLine("Администратор", "Рестора́н «Во́лга», до́брый день.", "Ristorante «Volga», buongiorno."),
        dlLine("Гость", "До́брый день! Хочу́ заказа́ть сто́лик на за́втра.", "Buongiorno! Vorrei prenotare un tavolo per domani."),
        dlLine("Администратор", "На ско́лько челове́к?", "Per quante persone?"),
        dlLine("Гость", "На четверы́х, на во́семь ве́чера.", "Per quattro persone, alle otto di sera."),
        dlLine("Администратор", "Хорошо́, столик забронирован.", "Va bene, il tavolo è prenotato."),
        dlLine("Гость", "Отли́чно, спасибо большое!", "Ottimo, grazie mille!"),
      ],
      [
        dlTurn(
          dlLine("Администратор", "Рестора́н «Во́лга», до́брый день.", "Ristorante «Volga», buongiorno."),
          [
            dlOpt("До́брый день! Хочу́ заказа́ть сто́лик на за́втра.", "Buongiorno! Vorrei prenotare un tavolo per domani.", true),
            dlOpt("На четверых.", "Per quattro persone.", false),
            dlOpt("Отли́чно, спасибо!", "Ottimo, grazie!", false),
          ]
        ),
        dlTurn(
          dlLine("Администратор", "На ско́лько челове́к?", "Per quante persone?"),
          [
            dlOpt("На четверы́х, на во́семь ве́чера.", "Per quattro persone, alle otto di sera.", true),
            dlOpt("Хочу заказать столик.", "Vorrei prenotare un tavolo.", false),
            dlOpt("Спаси́бо большо́е!", "Grazie mille!", false),
          ]
        ),
        dlTurn(
          dlLine("Администратор", "Хорошо́, столик забронирован.", "Va bene, il tavolo è prenotato."),
          [
            dlOpt("Отли́чно, спасибо большое!", "Ottimo, grazie mille!", true),
            dlOpt("На четверых.", "Per quattro persone.", false),
            dlOpt("Добрый день!", "Buongiorno!", false),
          ]
        ),
      ],
      { question: "На сколько человек забронирован столик?", options: ["На четверых","На двоих","На шестерых"], correct: 0 }
    ),
    dialogue(
      "Разговор о спорте",
      "Parlare di uno sport praticato regolarmente",
      ["Тренер","Спортсмен"],
      "Спортсмен",
      [
        dlLine("Тренер", "Как ча́сто ты трениру́ешься?", "Con che frequenza ti alleni?"),
        dlLine("Спортсмен", "Три раза в неде́лю, по вечерам.", "Tre volte a settimana, di sera."),
        dlLine("Тренер", "Како́й вид спо́рта тебе́ нра́вится бо́льше всего́?", "Quale sport ti piace di più?"),
        dlLine("Спортсмен", "Пла́вание, оно́ расслабля́ет.", "Il nuoto, rilassa."),
        dlLine("Тренер", "У тебя есть цель на э́тот год?", "Hai un obiettivo per quest'anno?"),
        dlLine("Спортсмен", "Да, хочу́ уча́ствовать в соревнова́ниях.", "Sì, voglio partecipare a delle gare."),
      ],
      [
        dlTurn(
          dlLine("Тренер", "Как ча́сто ты трениру́ешься?", "Con che frequenza ti alleni?"),
          [
            dlOpt("Три раза в неде́лю, по вечерам.", "Tre volte a settimana, di sera.", true),
            dlOpt("Пла́вание, оно́ расслабля́ет.", "Il nuoto, rilassa.", false),
            dlOpt("Хочу участвовать в соревнованиях.", "Voglio partecipare a delle gare.", false),
          ]
        ),
        dlTurn(
          dlLine("Тренер", "Како́й вид спо́рта тебе́ нра́вится бо́льше всего́?", "Quale sport ti piace di più?"),
          [
            dlOpt("Пла́вание, оно́ расслабля́ет.", "Il nuoto, rilassa.", true),
            dlOpt("Три раза в неде́лю.", "Tre volte a settimana.", false),
            dlOpt("Да, хочу участвовать.", "Sì, voglio partecipare.", false),
          ]
        ),
        dlTurn(
          dlLine("Тренер", "У тебя есть цель на э́тот год?", "Hai un obiettivo per quest'anno?"),
          [
            dlOpt("Да, хочу́ уча́ствовать в соревнова́ниях.", "Sì, voglio partecipare a delle gare.", true),
            dlOpt("Пла́вание, оно́ расслабля́ет.", "Il nuoto, rilassa.", false),
            dlOpt("Три раза в неде́лю.", "Tre volte a settimana.", false),
          ]
        ),
      ],
      { question: "Какой вид спорта предпочитает спортсмен?", options: ["Плавание","Бег","Футбол"], correct: 0 }
    ),
  ],
  B2: [
    dialogue(
      "Реформа на работе",
      "Discutere una riforma sul lavoro",
      ["Директор","Сотрудник"],
      "Сотрудник",
      [
      dlLine("Директор", "Мы вво́дим но́вую систе́му отчётности.", "Stiamo introducendo un nuovo sistema di rendicontazione."),
      dlLine("Сотрудник", "Как э́то повлияет на нашу рабо́ту?", "Come influirà sul nostro lavoro?"),
      dlLine("Директор", "Отчёты бу́дут еженеде́льными вме́сто ежеме́сячных.", "I rapporti saranno settimanali invece che mensili."),
      dlLine("Сотрудник", "Э́то увеличит нагрузку на команду.", "Questo aumenterà il carico di lavoro sul team."),
      dlLine("Директор", "Мы понимаем, поэ́тому наймём ассистента.", "Lo capiamo, perciò assumeremo un assistente."),
      dlLine("Сотрудник", "Э́то хорошая но́вость. Когда начнём?", "È una buona notizia. Quando iniziamo?"),
      dlLine("Директор", "С нача́ла сле́дующего ме́сяца.", "Dall'inizio del mese prossimo."),
      dlLine("Сотрудник", "Хорошо́, мы подготовимся.", "Va bene, ci prepareremo."),
      ],
      [
      dlTurn(
        dlLine("Директор", "Мы вво́дим но́вую систе́му отчётности.", "Stiamo introducendo un nuovo sistema di rendicontazione."),
        [
              dlOpt("Как э́то повлияет на нашу рабо́ту?", "Come influirà sul nostro lavoro?", true),
              dlOpt("Отли́чно, спасибо!", "Perfetto, grazie!", false),
              dlOpt("Я не работаю здесь.", "Non lavoro qui.", false),
        ]
      ),
      dlTurn(
        dlLine("Директор", "Отчёты бу́дут еженеде́льными вме́сто ежеме́сячных.", "I rapporti saranno settimanali invece che mensili."),
        [
              dlOpt("Э́то увеличит нагрузку на команду.", "Questo aumenterà il carico di lavoro sul team.", true),
              dlOpt("Мне нравится эта идея.", "Mi piace questa idea.", false),
              dlOpt("Я не понимаю вопро́с.", "Non capisco la domanda.", false),
        ]
      ),
      dlTurn(
        dlLine("Директор", "Мы понимаем, поэ́тому наймём ассистента.", "Lo capiamo, perciò assumeremo un assistente."),
        [
              dlOpt("Э́то хорошая но́вость. Когда начнём?", "È una buona notizia. Quando iniziamo?", true),
              dlOpt("Э́то плохая идея.", "È una brutta idea.", false),
              dlOpt("Я увольняюсь.", "Mi dimetto.", false),
        ]
      ),
      dlTurn(
        dlLine("Директор", "С нача́ла сле́дующего ме́сяца.", "Dall'inizio del mese prossimo."),
        [
              dlOpt("Хорошо́, мы подготовимся.", "Va bene, ci prepareremo.", true),
              dlOpt("Э́то слишком ра́но.", "È troppo presto.", false),
              dlOpt("Уже по́здно.", "È già tardi.", false),
        ]
      ),
      ],
      { question: "Что изменится в отчётах?", options: ["Станут еженедельными","Отменят их","Станут ежегодными"], correct: 0 }
    ),
    dialogue(
      "Обсуждение бюджета проекта",
      "Discutere il budget di un progetto in ufficio",
      ["Директор","Сотрудник"],
      "Сотрудник",
      [
      dlLine("Директор", "Бюдже́т прое́кта превы́шен на де́сять проце́нтов.", "Il budget del progetto è stato superato del dieci percento."),
      dlLine("Сотрудник", "Да, возни́кли непредви́денные расхо́ды.", "Sì, ci sono state spese impreviste."),
      dlLine("Директор", "Каки́е и́менно расхо́ды?", "Quali spese esattamente?"),
      dlLine("Сотрудник", "Пришло́сь наня́ть дополни́тельного специали́ста.", "Abbiamo dovuto assumere uno specialista in più."),
      dlLine("Директор", "Э́то было необходимо?", "Era necessario?"),
      dlLine("Сотрудник", "Да, ина́че мы бы не успе́ли в срок.", "Sì, altrimenti non saremmo arrivati in tempo."),
      dlLine("Директор", "Хорошо́, но в следующий раз предупреждайте заранее.", "Va bene, ma la prossima volta avvisate in anticipo."),
      dlLine("Сотрудник", "Обязательно учту э́то.", "Lo terrò sicuramente in considerazione."),
      ],
      [
      dlTurn(
        dlLine("Директор", "Бюдже́т прое́кта превы́шен на де́сять проце́нтов.", "Il budget del progetto è stato superato del dieci percento."),
        [
              dlOpt("Да, возни́кли непредви́денные расхо́ды.", "Sì, ci sono state spese impreviste.", true),
              dlOpt("Э́то невозможно.", "È impossibile.", false),
              dlOpt("Мне всё равно.", "Non mi importa.", false),
        ]
      ),
      dlTurn(
        dlLine("Директор", "Каки́е и́менно расхо́ды?", "Quali spese esattamente?"),
        [
              dlOpt("Пришло́сь наня́ть дополни́тельного специали́ста.", "Abbiamo dovuto assumere uno specialista in più.", true),
              dlOpt("Я не хочу об э́том говорить.", "Non voglio parlarne.", false),
              dlOpt("Э́то не ва́жно сейчас.", "Non è importante ora.", false),
        ]
      ),
      dlTurn(
        dlLine("Директор", "Э́то было необходимо?", "Era necessario?"),
        [
              dlOpt("Да, ина́че мы бы не успе́ли в срок.", "Sì, altrimenti non saremmo arrivati in tempo.", true),
              dlOpt("Нет, э́то была ошибка.", "No, è stato un errore.", false),
              dlOpt("Я не уверен.", "Non sono sicuro.", false),
        ]
      ),
      ],
      { question: "На сколько процентов превышен бюджет?", options: ["На десять процентов","На двадцать процентов","На пять процентов"], correct: 0 }
    ),
    dialogue(
      "Спор о переезде",
      "Discutere se trasferirsi in un'altra città",
      ["Марина","Сергей"],
      "Сергей",
      [
      dlLine("Марина", "Мне предложили рабо́ту в другом городе.", "Mi hanno offerto un lavoro in un'altra città."),
      dlLine("Сергей", "Э́то серьёзное решение.", "È una decisione seria."),
      dlLine("Марина", "Зарпла́та там в два ра́за вы́ше.", "Lo stipendio lì è il doppio."),
      dlLine("Сергей", "А как же на́ши друзья́ и семья́ здесь?", "E i nostri amici e la famiglia qui?"),
      dlLine("Марина", "Мы мо́жем навеща́ть их регуля́рно.", "Possiamo visitarli regolarmente."),
      dlLine("Сергей", "Мне ну́жно подумать об э́том.", "Devo pensarci su."),
      dlLine("Марина", "Коне́чно, у нас есть время.", "Certo, abbiamo tempo."),
      dlLine("Сергей", "Давай обсудим э́то на выходных.", "Discutiamone questo weekend."),
      ],
      [
      dlTurn(
        dlLine("Марина", "Мне предложили рабо́ту в другом городе.", "Mi hanno offerto un lavoro in un'altra città."),
        [
              dlOpt("Э́то серьёзное решение.", "È una decisione seria.", true),
              dlOpt("Мне неинтересно.", "Non mi interessa.", false),
              dlOpt("Откажись сразу.", "Rifiuta subito.", false),
        ]
      ),
      dlTurn(
        dlLine("Марина", "Зарпла́та там в два ра́за вы́ше.", "Lo stipendio lì è il doppio."),
        [
              dlOpt("А как же на́ши друзья́ и семья́ здесь?", "E i nostri amici e la famiglia qui?", true),
              dlOpt("Деньги не имеют значения.", "I soldi non contano.", false),
              dlOpt("Мне всё равно, где жить.", "Non mi importa dove vivere.", false),
        ]
      ),
      dlTurn(
        dlLine("Марина", "Мы мо́жем навеща́ть их регуля́рно.", "Possiamo visitarli regolarmente."),
        [
              dlOpt("Мне ну́жно подумать об э́том.", "Devo pensarci su.", true),
              dlOpt("Никогда не поеду.", "Non ci andrò mai.", false),
              dlOpt("Решай сама.", "Decidi tu.", false),
        ]
      ),
      ],
      { question: "Насколько выше зарплата в новом городе?", options: ["В два раза","На десять процентов","В три раза"], correct: 0 }
    ),
    dialogue(
      "Экологическая дискуссия",
      "Discutere di ecologia e riciclo dei rifiuti",
      ["Анна","Павел"],
      "Павел",
      [
        dlLine("Анна", "Ты сортиру́ешь му́сор до́ма?", "Ricicli i rifiuti a casa?"),
        dlLine("Павел", "Да, стараюсь, хотя́ не всегда получается.", "Sì, ci provo, anche se non sempre ci riesco."),
        dlLine("Анна", "А что меша́ет?", "Cosa te lo impedisce?"),
        dlLine("Павел", "Иногда про́сто не хватает контейнеров рядом.", "A volte mancano semplicemente i cassonetti vicini."),
        dlLine("Анна", "Понимаю. Э́то общая проблема.", "Capisco. È un problema comune."),
        dlLine("Павел", "Наде́юсь, ситуа́ция изме́нится.", "Spero che la situazione cambi."),
      ],
      [
        dlTurn(
          dlLine("Анна", "Ты сортиру́ешь му́сор до́ма?", "Ricicli i rifiuti a casa?"),
          [
            dlOpt("Да, стараюсь, хотя́ не всегда получается.", "Sì, ci provo, anche se non sempre ci riesco.", true),
            dlOpt("Иногда не хватает контейнеров.", "A volte mancano i cassonetti.", false),
            dlOpt("Наде́юсь, ситуа́ция изме́нится.", "Spero che la situazione cambi.", false),
          ]
        ),
        dlTurn(
          dlLine("Анна", "А что меша́ет?", "Cosa te lo impedisce?"),
          [
            dlOpt("Иногда про́сто не хватает контейнеров рядом.", "A volte mancano semplicemente i cassonetti vicini.", true),
            dlOpt("Да, стараюсь.", "Sì, ci provo.", false),
            dlOpt("Э́то общая проблема.", "È un problema comune.", false),
          ]
        ),
        dlTurn(
          dlLine("Анна", "Понимаю. Э́то общая проблема.", "Capisco. È un problema comune."),
          [
            dlOpt("Наде́юсь, ситуа́ция изме́нится.", "Spero che la situazione cambi.", true),
            dlOpt("Да, стараюсь.", "Sì, ci provo.", false),
            dlOpt("Не хватает контейнеров.", "Mancano i cassonetti.", false),
          ]
        ),
      ],
      { question: "Что мешает Павлу сортировать мусор?", options: ["Не хватает контейнеров","Нет времени","Э́то дорого"], correct: 0 }
    ),
    dialogue(
      "Социальные сети",
      "Discutere l'uso dei social media e i suoi effetti",
      ["Ирина","Максим"],
      "Максим",
      [
        dlLine("Ирина", "Ско́лько вре́мени ты прово́дишь в соцсетя́х?", "Quanto tempo passi sui social media?"),
        dlLine("Максим", "Честно говоря, слишком мно́го.", "Ad essere sincero, troppo."),
        dlLine("Ирина", "Ты не ду́мал ограни́чить вре́мя?", "Non hai pensato di limitare il tempo?"),
        dlLine("Максим", "Думал, но тру́дно себя контролировать.", "Ci ho pensato, ma è difficile controllarsi."),
        dlLine("Ирина", "Попро́буй установи́ть та́ймер.", "Prova a impostare un timer."),
        dlLine("Максим", "Хоро́шая иде́я, попро́бую.", "Buona idea, ci proverò."),
      ],
      [
        dlTurn(
          dlLine("Ирина", "Ско́лько вре́мени ты прово́дишь в соцсетя́х?", "Quanto tempo passi sui social media?"),
          [
            dlOpt("Честно говоря, слишком мно́го.", "Ad essere sincero, troppo.", true),
            dlOpt("Думал, но тру́дно.", "Ci ho pensato, ma è difficile.", false),
            dlOpt("Попробую.", "Ci proverò.", false),
          ]
        ),
        dlTurn(
          dlLine("Ирина", "Ты не ду́мал ограни́чить вре́мя?", "Non hai pensato di limitare il tempo?"),
          [
            dlOpt("Думал, но тру́дно себя контролировать.", "Ci ho pensato, ma è difficile controllarsi.", true),
            dlOpt("Слишком мно́го.", "Troppo.", false),
            dlOpt("Хоро́шая иде́я.", "Buona idea.", false),
          ]
        ),
        dlTurn(
          dlLine("Ирина", "Попро́буй установи́ть та́ймер.", "Prova a impostare un timer."),
          [
            dlOpt("Хоро́шая иде́я, попро́бую.", "Buona idea, ci proverò.", true),
            dlOpt("Думал, но тру́дно.", "Ci ho pensato, ma è difficile.", false),
            dlOpt("Слишком мно́го.", "Troppo.", false),
          ]
        ),
      ],
      { question: "Что советует Ирина сделать Максиму?", options: ["Установить таймер","Удалить приложение","Купить новый телефон"], correct: 0 }
    ),
    dialogue(
      "Воспитание детей",
      "Parlare dell'educazione dei figli tra genitori",
      ["Светлана","Николай"],
      "Николай",
      [
        dlLine("Светлана", "Как у вас дела́ с дома́шним зада́нием?", "Come va con i compiti a casa?"),
        dlLine("Николай", "Сло́жно, сын не хо́чет занима́ться сам.", "È difficile, mio figlio non vuole studiare da solo."),
        dlLine("Светлана", "Мо́жет, сто́ит установи́ть чёткое расписа́ние?", "Forse vale la pena stabilire un orario preciso?"),
        dlLine("Николай", "Мы про́бовали, но не всегда́ получа́ется.", "Abbiamo provato, ma non sempre funziona."),
        dlLine("Светлана", "Терпение — э́то ключ в таких ситуациях.", "La pazienza è la chiave in queste situazioni."),
        dlLine("Николай", "Вы пра́вы, бу́ду стара́ться.", "Ha ragione, ci proverò."),
      ],
      [
        dlTurn(
          dlLine("Светлана", "Как у вас дела́ с дома́шним зада́нием?", "Come va con i compiti a casa?"),
          [
            dlOpt("Сло́жно, сын не хо́чет занима́ться сам.", "È difficile, mio figlio non vuole studiare da solo.", true),
            dlOpt("Мы пробовали.", "Abbiamo provato.", false),
            dlOpt("Буду стараться.", "Ci proverò.", false),
          ]
        ),
        dlTurn(
          dlLine("Светлана", "Мо́жет, сто́ит установи́ть чёткое расписа́ние?", "Forse vale la pena stabilire un orario preciso?"),
          [
            dlOpt("Мы про́бовали, но не всегда́ получа́ется.", "Abbiamo provato, ma non sempre funziona.", true),
            dlOpt("Сложно.", "È difficile.", false),
            dlOpt("Вы правы.", "Ha ragione.", false),
          ]
        ),
        dlTurn(
          dlLine("Светлана", "Терпение — э́то ключ в таких ситуациях.", "La pazienza è la chiave in queste situazioni."),
          [
            dlOpt("Вы пра́вы, бу́ду стара́ться.", "Ha ragione, ci proverò.", true),
            dlOpt("Мы пробовали.", "Abbiamo provato.", false),
            dlOpt("Сложно.", "È difficile.", false),
          ]
        ),
      ],
      { question: "В чём проблема сына Николая?", options: ["Не хочет заниматься сам","Пло́хо себя ведёт","Не ходит в шко́лу"], correct: 0 }
    ),
    dialogue(
      "Покупка квартиры",
      "Discutere l'acquisto di un appartamento con un agente",
      ["Агент","Покупательница"],
      "Покупательница",
      [
        dlLine("Агент", "Каку́ю кварти́ру вы и́щете?", "Che tipo di appartamento sta cercando?"),
        dlLine("Покупательница", "Двухко́мнатную, недалеко́ от це́нтра.", "Un bilocale, non lontano dal centro."),
        dlLine("Агент", "Есть хоро́ший вариа́нт на тре́тьем этаже́.", "C'è una buona opzione al terzo piano."),
        dlLine("Покупательница", "А кака́я пло́щадь?", "E che superficie ha?"),
        dlLine("Агент", "Пятьдеся́т квадра́тных ме́тров.", "Cinquanta metri quadrati."),
        dlLine("Покупательница", "Звучи́т непло́хо, хочу́ посмотре́ть.", "Sembra buono, voglio vederlo."),
      ],
      [
        dlTurn(
          dlLine("Агент", "Каку́ю кварти́ру вы и́щете?", "Che tipo di appartamento sta cercando?"),
          [
            dlOpt("Двухко́мнатную, недалеко́ от це́нтра.", "Un bilocale, non lontano dal centro.", true),
            dlOpt("Пятьдеся́т квадра́тных ме́тров.", "Cinquanta metri quadrati.", false),
            dlOpt("Хочу посмотреть.", "Voglio vederlo.", false),
          ]
        ),
        dlTurn(
          dlLine("Агент", "Есть хоро́ший вариа́нт на тре́тьем этаже́.", "C'è una buona opzione al terzo piano."),
          [
            dlOpt("А кака́я пло́щадь?", "E che superficie ha?", true),
            dlOpt("Двухкомнатную.", "Un bilocale.", false),
            dlOpt("Звучит неплохо.", "Sembra buono.", false),
          ]
        ),
        dlTurn(
          dlLine("Агент", "Пятьдеся́т квадра́тных ме́тров.", "Cinquanta metri quadrati."),
          [
            dlOpt("Звучи́т непло́хо, хочу́ посмотре́ть.", "Sembra buono, voglio vederlo.", true),
            dlOpt("А кака́я пло́щадь?", "E che superficie ha?", false),
            dlOpt("Двухкомнатную.", "Un bilocale.", false),
          ]
        ),
      ],
      { question: "Какая площадь у квартиры?", options: ["Пятьдесят квадратных метров","Сорок квадратных метров","Шестьдесят квадратных метров"], correct: 0 }
    ),
  ],
  C1: [
    dialogue(
      "Переговоры о зарплате",
      "Negoziare un aumento di stipendio",
      ["Начальник","Сотрудник"],
      "Сотрудник",
      [
      dlLine("Сотрудник", "Я хоте́л бы обсуди́ть моё вознагражде́ние.", "Vorrei discutere della mia retribuzione."),
      dlLine("Начальник", "Коне́чно, какие у вас аргументы?", "Certo, quali argomentazioni ha?"),
      dlLine("Сотрудник", "За э́тот год я перевыполнил план на двадцать процентов.", "Quest'anno ho superato l'obiettivo del venti percento."),
      dlLine("Начальник", "Э́то впечатляющий результат.", "È un risultato impressionante."),
      dlLine("Сотрудник", "Я прошу пересмотреть мою зарплату с учётом э́того.", "Chiedo di rivedere il mio stipendio tenendo conto di questo."),
      dlLine("Начальник", "Мне ну́жно обсудить э́то с руководством.", "Devo discuterne con la direzione."),
      dlLine("Сотрудник", "Когда́ я могу́ ожида́ть отве́та?", "Quando posso aspettarmi una risposta?"),
      dlLine("Начальник", "Дам ответ в течение неде́ли.", "Le darò una risposta entro una settimana."),
      ],
      [
      dlTurn(
        dlLine("Начальник", "Коне́чно, какие у вас аргументы?", "Certo, quali argomentazioni ha?"),
        [
              dlOpt("За э́тот год я перевыполнил план на двадцать процентов.", "Quest'anno ho superato l'obiettivo del venti percento.", true),
              dlOpt("Мне не нужны деньги.", "Non ho bisogno di soldi.", false),
              dlOpt("Я не думал об э́том.", "Non ci ho pensato.", false),
        ]
      ),
      dlTurn(
        dlLine("Начальник", "Э́то впечатляющий результат.", "È un risultato impressionante."),
        [
              dlOpt("Я прошу пересмотреть мою зарплату с учётом э́того.", "Chiedo di rivedere il mio stipendio tenendo conto di questo.", true),
              dlOpt("Спасибо, до свидания.", "Grazie, arrivederci.", false),
              dlOpt("Мне всё равно.", "Non mi importa.", false),
        ]
      ),
      dlTurn(
        dlLine("Начальник", "Мне ну́жно обсудить э́то с руководством.", "Devo discuterne con la direzione."),
        [
              dlOpt("Когда́ я могу́ ожида́ть отве́та?", "Quando posso aspettarmi una risposta?", true),
              dlOpt("Забудьте об э́том.", "Se ne dimentichi.", false),
              dlOpt("Э́то не ва́жно.", "Non è importante.", false),
        ]
      ),
      ],
      { question: "На сколько процентов сотрудник перевыполнил план?", options: ["На двадцать процентов","На десять процентов","На пятьдесят процентов"], correct: 0 }
    ),
    dialogue(
      "Дебаты об искусственном интеллекте",
      "Un dibattito sull'intelligenza artificiale",
      ["Модератор","Эксперт"],
      "Эксперт",
      [
      dlLine("Модератор", "Как ИИ изме́нит ры́нок труда́?", "Come cambierà l'IA il mercato del lavoro?"),
      dlLine("Эксперт", "Не́которые профе́ссии исче́знут, но поя́вятся но́вые.", "Alcune professioni scompariranno, ma ne nasceranno di nuove."),
      dlLine("Модератор", "Каких профессий э́то коснётся больше всего?", "Quali professioni ne saranno più colpite?"),
      dlLine("Эксперт", "В пе́рвую о́чередь рути́нных опера́ций.", "Prima di tutto le operazioni di routine."),
      dlLine("Модератор", "Ну́жно ли государству вмешиваться?", "Lo stato deve intervenire?"),
      dlLine("Эксперт", "Счита́ю, что регули́рование необходи́мо.", "Ritengo che la regolamentazione sia necessaria."),
      dlLine("Модератор", "Спаси́бо за ва́ше мне́ние.", "Grazie per la sua opinione."),
      dlLine("Эксперт", "Всегда́ рад обсуди́ть э́ту те́му.", "Sono sempre felice di discutere questo argomento."),
      ],
      [
      dlTurn(
        dlLine("Модератор", "Как ИИ изме́нит ры́нок труда́?", "Come cambierà l'IA il mercato del lavoro?"),
        [
              dlOpt("Не́которые профе́ссии исче́знут, но поя́вятся но́вые.", "Alcune professioni scompariranno, ma ne nasceranno di nuove.", true),
              dlOpt("Ничего не изменится.", "Non cambierà nulla.", false),
              dlOpt("Я не разбираюсь в э́том.", "Non me ne intendo.", false),
        ]
      ),
      dlTurn(
        dlLine("Модератор", "Каких профессий э́то коснётся больше всего?", "Quali professioni ne saranno più colpite?"),
        [
              dlOpt("В пе́рвую о́чередь рути́нных опера́ций.", "Prima di tutto le operazioni di routine.", true),
              dlOpt("Всех без исключения.", "Tutte senza eccezione.", false),
              dlOpt("Я предпочитаю не отвечать.", "Preferisco non rispondere.", false),
        ]
      ),
      dlTurn(
        dlLine("Модератор", "Ну́жно ли государству вмешиваться?", "Lo stato deve intervenire?"),
        [
              dlOpt("Счита́ю, что регули́рование необходи́мо.", "Ritengo che la regolamentazione sia necessaria.", true),
              dlOpt("Государство не должно ничего делать.", "Lo stato non deve fare nulla.", false),
              dlOpt("Э́то не моя тема.", "Non è il mio argomento.", false),
        ]
      ),
      ],
      { question: "Какие профессии пострадают больше всего, по мнению эксперта?", options: ["Рутинные операции","Творческие профессии","Управленческие должности"], correct: 0 }
    ),
    dialogue(
      "Переговоры о слиянии компаний",
      "Negoziare la fusione tra due aziende",
      ["Инвестор","Директор"],
      "Директор",
      [
      dlLine("Инвестор", "Мы рассма́триваем слия́ние с ва́шей компа́нией.", "Stiamo considerando una fusione con la vostra azienda."),
      dlLine("Директор", "Каки́е усло́вия вы предлага́ете?", "Quali condizioni proponete?"),
      dlLine("Инвестор", "Мы гото́вы сохрани́ть всю кома́нду.", "Siamo pronti a mantenere tutto il team."),
      dlLine("Директор", "А что насчёт управле́ния?", "E per quanto riguarda la gestione?"),
      dlLine("Инвестор", "Вы оста́нетесь на руководя́щей до́лжности.", "Lei resterà in una posizione dirigenziale."),
      dlLine("Директор", "Нам ну́жно время на обсуждение с советом.", "Ci serve tempo per discuterne con il consiglio."),
      dlLine("Инвестор", "Коне́чно, мы не торопим вас.", "Certo, non vi mettiamo fretta."),
      dlLine("Директор", "Свя́жемся с ва́ми на сле́дующей неде́ле.", "Vi contatteremo la settimana prossima."),
      ],
      [
      dlTurn(
        dlLine("Инвестор", "Мы рассма́триваем слия́ние с ва́шей компа́нией.", "Stiamo considerando una fusione con la vostra azienda."),
        [
              dlOpt("Каки́е усло́вия вы предлага́ете?", "Quali condizioni proponete?", true),
              dlOpt("Нас э́то не интересует.", "Non ci interessa.", false),
              dlOpt("Слишком по́здно для э́того.", "È troppo tardi per questo.", false),
        ]
      ),
      dlTurn(
        dlLine("Инвестор", "Мы гото́вы сохрани́ть всю кома́нду.", "Siamo pronti a mantenere tutto il team."),
        [
              dlOpt("А что насчёт управле́ния?", "E per quanto riguarda la gestione?", true),
              dlOpt("Команда не важна.", "Il team non è importante.", false),
              dlOpt("Э́то не решает проблему.", "Questo non risolve il problema.", false),
        ]
      ),
      dlTurn(
        dlLine("Инвестор", "Вы оста́нетесь на руководя́щей до́лжности.", "Lei resterà in una posizione dirigenziale."),
        [
              dlOpt("Нам ну́жно время на обсуждение с советом.", "Ci serve tempo per discuterne con il consiglio.", true),
              dlOpt("Согласен немедленно.", "Accetto immediatamente.", false),
              dlOpt("Мне э́то не интере́сно.", "Non mi interessa.", false),
        ]
      ),
      ],
      { question: "Что предлагает сохранить инвестор?", options: ["Всю команду","Только руководство","Только офис"], correct: 0 }
    ),
    dialogue(
      "Медицинская дилемма",
      "Un dilemma etico in medicina tra colleghi",
      ["Врач","Коллега"],
      "Врач",
      [
        dlLine("Коллега", "Пацие́нт отка́зывается от опера́ции. Что вы бу́дете де́лать?", "Il paziente rifiuta l'operazione. Cosa farà?"),
        dlLine("Врач", "Я обя́зан уважа́ть его́ реше́ние, несмотря́ на ри́ски.", "Sono obbligato a rispettare la sua decisione, nonostante i rischi."),
        dlLine("Коллега", "А если он не по́лностью осознаёт последствия?", "E se non è pienamente consapevole delle conseguenze?"),
        dlLine("Врач", "Тогда́ моя́ зада́ча — объясни́ть всё максима́льно я́сно.", "Allora il mio compito è spiegare tutto nel modo più chiaro possibile."),
        dlLine("Коллега", "Э́то непростая ситуация.", "È una situazione complessa."),
        dlLine("Врач", "Согла́сен, но э́тика тре́бует и́менно тако́го подхо́да.", "Concordo, ma l'etica richiede proprio questo approccio."),
      ],
      [
        dlTurn(
          dlLine("Коллега", "Пацие́нт отка́зывается от опера́ции. Что вы бу́дете де́лать?", "Il paziente rifiuta l'operazione. Cosa farà?"),
          [
            dlOpt("Я обя́зан уважа́ть его́ реше́ние, несмотря́ на ри́ски.", "Sono obbligato a rispettare la sua decisione, nonostante i rischi.", true),
            dlOpt("Э́то непростая ситуация.", "È una situazione complessa.", false),
            dlOpt("Согласен с этикой.", "Concordo con l'etica.", false),
          ]
        ),
        dlTurn(
          dlLine("Коллега", "А если он не по́лностью осознаёт последствия?", "E se non è pienamente consapevole delle conseguenze?"),
          [
            dlOpt("Тогда́ моя́ зада́ча — объясни́ть всё максима́льно я́сно.", "Allora il mio compito è spiegare tutto nel modo più chiaro possibile.", true),
            dlOpt("Я обязан уважать его решение.", "Sono obbligato a rispettare la sua decisione.", false),
            dlOpt("Э́то непростая ситуация.", "È una situazione complessa.", false),
          ]
        ),
        dlTurn(
          dlLine("Коллега", "Э́то непростая ситуация.", "È una situazione complessa."),
          [
            dlOpt("Согла́сен, но э́тика тре́бует и́менно тако́го подхо́да.", "Concordo, ma l'etica richiede proprio questo approccio.", true),
            dlOpt("Тогда объясню всё ясно.", "Allora spiegherò tutto chiaramente.", false),
            dlOpt("Я обязан уважать решение.", "Sono obbligato a rispettare la decisione.", false),
          ]
        ),
      ],
      { question: "Что обязан делать врач в э́той ситуации?", options: ["Уважать решение пациента","Настоять на операции","Отказаться лечить пациента"], correct: 0 }
    ),
    dialogue(
      "Дипломатический кризис",
      "Discutere una crisi diplomatica tra due paesi",
      ["Дипломат","Журналист"],
      "Дипломат",
      [
        dlLine("Журналист", "Как вы оце́ниваете ны́нешний кри́зис в отноше́ниях?", "Come valuta l'attuale crisi nei rapporti?"),
        dlLine("Дипломат", "Ситуа́ция серьёзная, но перегово́ры продолжа́ются.", "La situazione è seria, ma i negoziati continuano."),
        dlLine("Журналист", "Есть ли наде́жда на бы́строе реше́ние?", "C'è speranza per una soluzione rapida?"),
        dlLine("Дипломат", "Быстрого решения не будет, но диалог — э́то уже прогресс.", "Non ci sarà una soluzione rapida, ma il dialogo è già un progresso."),
        dlLine("Журналист", "Каки́е ме́ры рассма́триваются в пе́рвую о́чередь?", "Quali misure vengono considerate per prime?"),
        dlLine("Дипломат", "В пе́рвую о́чередь — восстановле́ние дове́рия ме́жду сторона́ми.", "Prima di tutto, il ripristino della fiducia tra le parti."),
      ],
      [
        dlTurn(
          dlLine("Журналист", "Как вы оце́ниваете ны́нешний кри́зис в отноше́ниях?", "Come valuta l'attuale crisi nei rapporti?"),
          [
            dlOpt("Ситуа́ция серьёзная, но перегово́ры продолжа́ются.", "La situazione è seria, ma i negoziati continuano.", true),
            dlOpt("Быстрого решения не будет.", "Non ci sarà una soluzione rapida.", false),
            dlOpt("В первую очередь доверие.", "Prima di tutto la fiducia.", false),
          ]
        ),
        dlTurn(
          dlLine("Журналист", "Есть ли наде́жда на бы́строе реше́ние?", "C'è speranza per una soluzione rapida?"),
          [
            dlOpt("Быстрого решения не будет, но диалог — э́то уже прогресс.", "Non ci sarà una soluzione rapida, ma il dialogo è già un progresso.", true),
            dlOpt("Ситуация серьёзная.", "La situazione è seria.", false),
            dlOpt("В первую очередь доверие.", "Prima di tutto la fiducia.", false),
          ]
        ),
        dlTurn(
          dlLine("Журналист", "Каки́е ме́ры рассма́триваются в пе́рвую о́чередь?", "Quali misure vengono considerate per prime?"),
          [
            dlOpt("В пе́рвую о́чередь — восстановле́ние дове́рия ме́жду сторона́ми.", "Prima di tutto, il ripristino della fiducia tra le parti.", true),
            dlOpt("Быстрого решения не будет.", "Non ci sarà una soluzione rapida.", false),
            dlOpt("Ситуация серьёзная.", "La situazione è seria.", false),
          ]
        ),
      ],
      { question: "Что считает дипломат приоритетом?", options: ["Восстановление доверия","Экономические санкции","Военные меры"], correct: 0 }
    ),
    dialogue(
      "Критика выставки",
      "Discutere criticamente una mostra d'arte contemporanea",
      ["Критик","Куратор"],
      "Критик",
      [
        dlLine("Куратор", "Что вы ду́маете о но́вой вы́ставке?", "Cosa pensa della nuova mostra?"),
        dlLine("Критик", "Конце́пция интере́сна, но исполне́ние спо́рно.", "Il concetto è interessante, ma l'esecuzione è discutibile."),
        dlLine("Куратор", "В чём и́менно пробле́ма, на ваш взгляд?", "Qual è esattamente il problema, secondo lei?"),
        dlLine("Критик", "Некоторые рабо́ты кажутся незавершёнными.", "Alcune opere sembrano incompiute."),
        dlLine("Куратор", "Э́то было сделано намеренно, как приём.", "È stato fatto intenzionalmente, come tecnica."),
        dlLine("Критик", "Тогда э́то меняет моё восприятие.", "Allora questo cambia la mia percezione."),
      ],
      [
        dlTurn(
          dlLine("Куратор", "Что вы ду́маете о но́вой вы́ставке?", "Cosa pensa della nuova mostra?"),
          [
            dlOpt("Конце́пция интере́сна, но исполне́ние спо́рно.", "Il concetto è interessante, ma l'esecuzione è discutibile.", true),
            dlOpt("Некоторые рабо́ты незавершены.", "Alcune opere sono incompiute.", false),
            dlOpt("Э́то меняет восприятие.", "Questo cambia la percezione.", false),
          ]
        ),
        dlTurn(
          dlLine("Куратор", "В чём и́менно пробле́ма, на ваш взгляд?", "Qual è esattamente il problema, secondo lei?"),
          [
            dlOpt("Некоторые рабо́ты кажутся незавершёнными.", "Alcune opere sembrano incompiute.", true),
            dlOpt("Концепция интересна.", "Il concetto è interessante.", false),
            dlOpt("Э́то меняет восприятие.", "Questo cambia la percezione.", false),
          ]
        ),
        dlTurn(
          dlLine("Куратор", "Э́то было сделано намеренно, как приём.", "È stato fatto intenzionalmente, come tecnica."),
          [
            dlOpt("Тогда э́то меняет моё восприятие.", "Allora questo cambia la mia percezione.", true),
            dlOpt("Некоторые рабо́ты незавершены.", "Alcune opere sono incompiute.", false),
            dlOpt("Концепция интересна.", "Il concetto è interessante.", false),
          ]
        ),
      ],
      { question: "Почему некоторые рабо́ты кажутся незавершёнными?", options: ["Э́то намеренный приём","Художник не успел","Э́то ошибка куратора"], correct: 0 }
    ),
    dialogue(
      "Технологические инновации",
      "Discutere l'introduzione di nuove tecnologie in azienda",
      ["Директор по инновациям","Инвестор"],
      "Директор по инновациям",
      [
        dlLine("Инвестор", "Каку́ю техноло́гию вы плани́руете внедри́ть?", "Quale tecnologia intende introdurre?"),
        dlLine("Директор по инновациям", "Систе́му автоматиза́ции на осно́ве иску́сственного интелле́кта.", "Un sistema di automazione basato sull'intelligenza artificiale."),
        dlLine("Инвестор", "Каковы́ ожида́емые преиму́щества?", "Quali sono i vantaggi previsti?"),
        dlLine("Директор по инновациям", "Значи́тельное сокраще́ние изде́ржек и оши́бок.", "Una significativa riduzione dei costi e degli errori."),
        dlLine("Инвестор", "А сотру́дники гото́вы к э́тим измене́ниям?", "E i dipendenti sono pronti a questi cambiamenti?"),
        dlLine("Директор по инновациям", "Мы уже́ на́чали обуче́ние персона́ла.", "Abbiamo già iniziato a formare il personale."),
      ],
      [
        dlTurn(
          dlLine("Инвестор", "Каку́ю техноло́гию вы плани́руете внедри́ть?", "Quale tecnologia intende introdurre?"),
          [
            dlOpt("Систе́му автоматиза́ции на осно́ве иску́сственного интелле́кта.", "Un sistema di automazione basato sull'intelligenza artificiale.", true),
            dlOpt("Значительное сокращение издержек.", "Una significativa riduzione dei costi.", false),
            dlOpt("Мы уже начали обучение.", "Abbiamo già iniziato la formazione.", false),
          ]
        ),
        dlTurn(
          dlLine("Инвестор", "Каковы́ ожида́емые преиму́щества?", "Quali sono i vantaggi previsti?"),
          [
            dlOpt("Значи́тельное сокраще́ние изде́ржек и оши́бок.", "Una significativa riduzione dei costi e degli errori.", true),
            dlOpt("Систему автоматизации.", "Un sistema di automazione.", false),
            dlOpt("Мы уже начали обучение.", "Abbiamo già iniziato la formazione.", false),
          ]
        ),
        dlTurn(
          dlLine("Инвестор", "А сотру́дники гото́вы к э́тим измене́ниям?", "E i dipendenti sono pronti a questi cambiamenti?"),
          [
            dlOpt("Мы уже́ на́чали обуче́ние персона́ла.", "Abbiamo già iniziato a formare il personale.", true),
            dlOpt("Значительное сокращение издержек.", "Una significativa riduzione dei costi.", false),
            dlOpt("Систему автоматизации.", "Un sistema di automazione.", false),
          ]
        ),
      ],
      { question: "Какую технологию планируют внедрить?", options: ["Автоматизацию на основе ИИ","Блокчейн","Виртуальную реальность"], correct: 0 }
    ),
  ],
  C2: [
    dialogue(
      "Полемика в прессе",
      "Una polemica sulla stampa, dibattito acceso",
      ["Журналист","Эксперт"],
      "Эксперт",
      [
      dlLine("Журналист", "Мно́гие критику́ют э́ту рефо́рму. Что вы ду́маете?", "Molti criticano questa riforma. Cosa ne pensa?"),
      dlLine("Эксперт", "При всём уваже́нии, кри́тика не всегда́ обосно́вана.", "Con tutto il rispetto, la critica non è sempre fondata."),
      dlLine("Журналист", "Но да́нные пока́зывают рост недово́льства.", "Ma i dati mostrano una crescita del malcontento."),
      dlLine("Эксперт", "Не прихо́дится удивля́ться: любы́е переме́ны вызыва́ют опасе́ния.", "Non c'è da stupirsi: qualsiasi cambiamento genera timori."),
      dlLine("Журналист", "Как вы отве́тите на обвине́ния в поспе́шности?", "Come risponde alle accuse di frettolosità?"),
      dlLine("Эксперт", "Осме́люсь возрази́ть: реше́ние гото́вилось не́сколько лет.", "Mi permetto di obiettare: la decisione è stata preparata per anni."),
      dlLine("Журналист", "Спаси́бо за открове́нность.", "Grazie per la franchezza."),
      dlLine("Эксперт", "Спасибо вам за вопро́сы.", "Grazie a lei per le domande."),
      ],
      [
      dlTurn(
        dlLine("Журналист", "Мно́гие критику́ют э́ту рефо́рму. Что вы ду́маете?", "Molti criticano questa riforma. Cosa ne pensa?"),
        [
              dlOpt("При всём уваже́нии, кри́тика не всегда́ обосно́вана.", "Con tutto il rispetto, la critica non è sempre fondata.", true),
              dlOpt("Я согласен с критикой.", "Sono d'accordo con la critica.", false),
              dlOpt("Не знаю, что сказать.", "Non so cosa dire.", false),
        ]
      ),
      dlTurn(
        dlLine("Журналист", "Но да́нные пока́зывают рост недово́льства.", "Ma i dati mostrano una crescita del malcontento."),
        [
              dlOpt("Не прихо́дится удивля́ться: любы́е переме́ны вызыва́ют опасе́ния.", "Non c'è da stupirsi: qualsiasi cambiamento genera timori.", true),
              dlOpt("Данные ошибочны.", "I dati sono sbagliati.", false),
              dlOpt("Мне всё равно.", "Non mi importa.", false),
        ]
      ),
      dlTurn(
        dlLine("Журналист", "Как вы отве́тите на обвине́ния в поспе́шности?", "Come risponde alle accuse di frettolosità?"),
        [
              dlOpt("Осме́люсь возрази́ть: реше́ние гото́вилось не́сколько лет.", "Mi permetto di obiettare: la decisione è stata preparata per anni.", true),
              dlOpt("Да, мы поспешили.", "Sì, abbiamo avuto fretta.", false),
              dlOpt("Э́то не мой вопро́с.", "Non è una mia domanda.", false),
        ]
      ),
      ],
      { question: "Quanto tempo è stata preparata la decisione, secondo l'esperto?", options: ["Несколько лет","Один месяц","Одну неде́лю"], correct: 0 }
    ),
    dialogue(
      "Философский спор о свободе воли",
      "Un dibattito filosofico sul libero arbitrio",
      ["Философ","Учёный"],
      "Учёный",
      [
      dlLine("Философ", "Существу́ет ли свобо́да во́ли на са́мом де́ле?", "Esiste davvero il libero arbitrio?"),
      dlLine("Учёный", "С точки зрения нейробиологии, э́то спорно.", "Dal punto di vista neurobiologico, è discutibile."),
      dlLine("Философ", "Зна́чит, на́ши реше́ния предопределены́?", "Quindi le nostre decisioni sono predeterminate?"),
      dlLine("Учёный", "Не совсе́м, но мозг де́йствует до осозна́ния.", "Non esattamente, ma il cervello agisce prima della coscienza."),
      dlLine("Философ", "Э́то подрывает саму идею ответственности.", "Questo mina l'idea stessa di responsabilità."),
      dlLine("Учёный", "Не обяза́тельно — отве́тственность социа́льная констру́кция.", "Non necessariamente — la responsabilità è una costruzione sociale."),
      dlLine("Философ", "Интересная позиция, хотя́ я не согласен.", "Posizione interessante, anche se non sono d'accordo."),
      dlLine("Учёный", "Именно поэ́тому дискуссия продолжается веками.", "Proprio per questo il dibattito continua da secoli."),
      ],
      [
      dlTurn(
        dlLine("Философ", "Существу́ет ли свобо́да во́ли на са́мом де́ле?", "Esiste davvero il libero arbitrio?"),
        [
              dlOpt("С точки зрения нейробиологии, э́то спорно.", "Dal punto di vista neurobiologico, è discutibile.", true),
              dlOpt("Коне́чно, э́то очевидно.", "Certo, è ovvio.", false),
              dlOpt("Меня э́то не волнует.", "Non mi interessa.", false),
        ]
      ),
      dlTurn(
        dlLine("Философ", "Зна́чит, на́ши реше́ния предопределены́?", "Quindi le nostre decisioni sono predeterminate?"),
        [
              dlOpt("Не совсе́м, но мозг де́йствует до осозна́ния.", "Non esattamente, ma il cervello agisce prima della coscienza.", true),
              dlOpt("Да, по́лностью предопределены.", "Sì, completamente predeterminate.", false),
              dlOpt("Наука не может э́то объяснить.", "La scienza non può spiegarlo.", false),
        ]
      ),
      dlTurn(
        dlLine("Философ", "Э́то подрывает саму идею ответственности.", "Questo mina l'idea stessa di responsabilità."),
        [
              dlOpt("Не обяза́тельно — отве́тственность социа́льная констру́кция.", "Non necessariamente — la responsabilità è una costruzione sociale.", true),
              dlOpt("Вы правы, ответственности не существует.", "Ha ragione, la responsabilità non esiste.", false),
              dlOpt("Э́то не имеет отношения к теме.", "Non è pertinente al tema.", false),
        ]
      ),
      ],
      { question: "Что, по мнению учёного, является ответственность?", options: ["Социальная конструкция","Биологический факт","Иллюзия"], correct: 0 }
    ),
    dialogue(
      "Литературная критика романа",
      "Critica letteraria di un romanzo contemporaneo",
      ["Критик","Писатель"],
      "Писатель",
      [
      dlLine("Критик", "Ваш рома́н получи́л сме́шанные о́тзывы.", "Il suo romanzo ha ricevuto recensioni contrastanti."),
      dlLine("Писатель", "Э́то ожидаемо для экспериментальной прозы.", "È prevedibile per la prosa sperimentale."),
      dlLine("Критик", "Не́которые счита́ют структу́ру сли́шком фрагменти́рованной.", "Alcuni ritengono la struttura troppo frammentata."),
      dlLine("Писатель", "Фрагмента́ция отража́ет саму́ приро́ду па́мяти.", "La frammentazione riflette la natura stessa della memoria."),
      dlLine("Критик", "А как насчёт обвине́ний в изли́шней сло́жности?", "E riguardo alle accuse di eccessiva complessità?"),
      dlLine("Писатель", "Я не пишу́ для лёгкого чте́ния.", "Non scrivo per una lettura facile."),
      dlLine("Критик", "Сме́лая пози́ция в на́ше вре́мя.", "Posizione coraggiosa di questi tempi."),
      dlLine("Писатель", "Литерату́ра должна́ броса́ть вы́зов чита́телю.", "La letteratura deve sfidare il lettore."),
      ],
      [
      dlTurn(
        dlLine("Критик", "Ваш рома́н получи́л сме́шанные о́тзывы.", "Il suo romanzo ha ricevuto recensioni contrastanti."),
        [
              dlOpt("Э́то ожидаемо для экспериментальной прозы.", "È prevedibile per la prosa sperimentale.", true),
              dlOpt("Э́то меня не удивляет, но огорчает.", "Non mi sorprende, ma mi rattrista.", false),
              dlOpt("Критики ничего не понимают.", "I critici non capiscono niente.", false),
        ]
      ),
      dlTurn(
        dlLine("Критик", "Не́которые счита́ют структу́ру сли́шком фрагменти́рованной.", "Alcuni ritengono la struttura troppo frammentata."),
        [
              dlOpt("Фрагмента́ция отража́ет саму́ приро́ду па́мяти.", "La frammentazione riflette la natura stessa della memoria.", true),
              dlOpt("Они правы, э́то была ошибка.", "Hanno ragione, è stato un errore.", false),
              dlOpt("Структура не имеет значения.", "La struttura non ha importanza.", false),
        ]
      ),
      dlTurn(
        dlLine("Критик", "А как насчёт обвине́ний в изли́шней сло́жности?", "E riguardo alle accuse di eccessiva complessità?"),
        [
              dlOpt("Я не пишу́ для лёгкого чте́ния.", "Non scrivo per una lettura facile.", true),
              dlOpt("Возможно, я упростю следующую книгу.", "Forse semplificherò il prossimo libro.", false),
              dlOpt("Сложность — э́то недостаток.", "La complessità è un difetto.", false),
        ]
      ),
      ],
      { question: "Как писатель объясняет фрагментированную структуру?", options: ["Она отражает природу памяти","Э́то была случайность","Так посоветовал редактор"], correct: 0 }
    ),
    dialogue(
      "Исторический парадокс",
      "Discutere un paradosso storico con ironia",
      ["Историк","Студентка"],
      "Историк",
      [
        dlLine("Студентка", "Не парадокса́льно ли, что реформа́тор сам стал тем, про́тив чего́ боро́лся?", "Non è paradossale che il riformatore sia diventato proprio ciò contro cui combatteva?"),
        dlLine("Историк", "И́менно! Исто́рия лю́бит таки́е го́рькие иро́нии.", "Esatto! La storia ama queste amare ironie."),
        dlLine("Студентка", "Зна́чит, власть неизбе́жно развраща́ет?", "Quindi il potere corrompe inevitabilmente?"),
        dlLine("Историк", "Не неизбе́жно, но собла́зн вели́к почти́ всегда́.", "Non inevitabilmente, ma la tentazione è quasi sempre grande."),
        dlLine("Студентка", "Уро́к для ны́нешних ли́деров, пожа́луй.", "Una lezione per i leader attuali, forse."),
        dlLine("Историк", "Е́сли бы то́лько исто́рия чему́-то учи́ла...", "Se solo la storia insegnasse qualcosa..."),
      ],
      [
        dlTurn(
          dlLine("Студентка", "Не парадокса́льно ли, что реформа́тор сам стал тем, про́тив чего́ боро́лся?", "Non è paradossale che il riformatore sia diventato proprio ciò contro cui combatteva?"),
          [
            dlOpt("И́менно! Исто́рия лю́бит таки́е го́рькие иро́нии.", "Esatto! La storia ama queste amare ironie.", true),
            dlOpt("Не неизбежно.", "Non inevitabilmente.", false),
            dlOpt("Урок для лидеров.", "Una lezione per i leader.", false),
          ]
        ),
        dlTurn(
          dlLine("Студентка", "Зна́чит, власть неизбе́жно развраща́ет?", "Quindi il potere corrompe inevitabilmente?"),
          [
            dlOpt("Не неизбе́жно, но собла́зн вели́к почти́ всегда́.", "Non inevitabilmente, ma la tentazione è quasi sempre grande.", true),
            dlOpt("Именно!", "Esatto!", false),
            dlOpt("Если бы только история учила.", "Se solo la storia insegnasse.", false),
          ]
        ),
        dlTurn(
          dlLine("Студентка", "Уро́к для ны́нешних ли́деров, пожа́луй.", "Una lezione per i leader attuali, forse."),
          [
            dlOpt("Е́сли бы то́лько исто́рия чему́-то учи́ла...", "Se solo la storia insegnasse qualcosa...", true),
            dlOpt("Не неизбежно.", "Non inevitabilmente.", false),
            dlOpt("Именно!", "Esatto!", false),
          ]
        ),
      ],
      { question: "Cosa suggerisce lo storico sulla storia?", options: ["Che raramente insegna qualcosa","Che si ripete sempre uguale","Che è sempre positiva"], correct: 0 }
    ),
    dialogue(
      "Политическая риторика",
      "Analizzare la retorica di un discorso politico",
      ["Аналитик","Редактор"],
      "Аналитик",
      [
        dlLine("Редактор", "Что вы ду́маете о вчера́шней ре́чи мини́стра?", "Cosa pensa del discorso di ieri del ministro?"),
        dlLine("Аналитик", "Мастерски обходит все острые вопро́сы.", "Aggira magistralmente tutte le domande scomode."),
        dlLine("Редактор", "То есть, ри́торика важне́е содержа́ния?", "Cioè, la retorica conta più del contenuto?"),
        dlLine("Аналитик", "В поли́тике ча́сто и́менно так и есть.", "In politica è spesso proprio così."),
        dlLine("Редактор", "Печа́льный вы́вод для избира́телей.", "Una triste conclusione per gli elettori."),
        dlLine("Аналитик", "Печа́льный, но, увы́, реалисти́чный.", "Triste, ma purtroppo realistico."),
      ],
      [
        dlTurn(
          dlLine("Редактор", "Что вы ду́маете о вчера́шней ре́чи мини́стра?", "Cosa pensa del discorso di ieri del ministro?"),
          [
            dlOpt("Мастерски обходит все острые вопро́сы.", "Aggira magistralmente tutte le domande scomode.", true),
            dlOpt("В политике часто так.", "In politica è spesso così.", false),
            dlOpt("Печальный вывод.", "Una triste conclusione.", false),
          ]
        ),
        dlTurn(
          dlLine("Редактор", "То есть, ри́торика важне́е содержа́ния?", "Cioè, la retorica conta più del contenuto?"),
          [
            dlOpt("В поли́тике ча́сто и́менно так и есть.", "In politica è spesso proprio così.", true),
            dlOpt("Мастерски обходит вопро́сы.", "Aggira magistralmente le domande.", false),
            dlOpt("Печальный вывод.", "Una triste conclusione.", false),
          ]
        ),
        dlTurn(
          dlLine("Редактор", "Печа́льный вы́вод для избира́телей.", "Una triste conclusione per gli elettori."),
          [
            dlOpt("Печа́льный, но, увы́, реалисти́чный.", "Triste, ma purtroppo realistico.", true),
            dlOpt("В политике часто так.", "In politica è spesso così.", false),
            dlOpt("Мастерски обходит вопро́сы.", "Aggira magistralmente le domande.", false),
          ]
        ),
      ],
      { question: "Secondo l'analista, cosa conta di più in politica?", options: ["La retorica","Il contenuto","I fatti concreti"], correct: 0 }
    ),
    dialogue(
      "Непереводимая ирония",
      "Discutere le sfumature intraducibili dell'ironia linguistica",
      ["Переводчица","Автор"],
      "Переводчица",
      [
        dlLine("Автор", "Как вы переда́дите э́ту игру́ слов на друго́м языке́?", "Come renderà questo gioco di parole in un'altra lingua?"),
        dlLine("Переводчица", "Честно говоря, дословно э́то невозможно.", "Ad essere sincera, alla lettera è impossibile."),
        dlLine("Автор", "И что вы предлага́ете?", "E cosa propone?"),
        dlLine("Переводчица", "Найти́ эквивале́нтную игру́ слов в целево́м языке́.", "Trovare un gioco di parole equivalente nella lingua di arrivo."),
        dlLine("Автор", "Но смысл при э́том слегка меняется.", "Ma il senso in questo modo cambia leggermente."),
        dlLine("Переводчица", "Увы́, перево́д — иску́сство поте́рь и компроми́ссов.", "Purtroppo la traduzione è l'arte delle perdite e dei compromessi."),
      ],
      [
        dlTurn(
          dlLine("Автор", "Как вы переда́дите э́ту игру́ слов на друго́м языке́?", "Come renderà questo gioco di parole in un'altra lingua?"),
          [
            dlOpt("Честно говоря, дословно э́то невозможно.", "Ad essere sincera, alla lettera è impossibile.", true),
            dlOpt("Найти эквивалент.", "Trovare un equivalente.", false),
            dlOpt("Смысл меняется.", "Il senso cambia.", false),
          ]
        ),
        dlTurn(
          dlLine("Автор", "И что вы предлага́ете?", "E cosa propone?"),
          [
            dlOpt("Найти́ эквивале́нтную игру́ слов в целево́м языке́.", "Trovare un gioco di parole equivalente nella lingua di arrivo.", true),
            dlOpt("Дословно невозможно.", "Alla lettera è impossibile.", false),
            dlOpt("Искусство потерь.", "L'arte delle perdite.", false),
          ]
        ),
        dlTurn(
          dlLine("Автор", "Но смысл при э́том слегка меняется.", "Ma il senso in questo modo cambia leggermente."),
          [
            dlOpt("Увы́, перево́д — иску́сство поте́рь и компроми́ссов.", "Purtroppo la traduzione è l'arte delle perdite e dei compromessi.", true),
            dlOpt("Найти эквивалент.", "Trovare un equivalente.", false),
            dlOpt("Дословно невозможно.", "Alla lettera è impossibile.", false),
          ]
        ),
      ],
      { question: "Come definisce la traduttrice la traduzione?", options: ["L'arte delle perdite e dei compromessi","Un processo semplice","Una scienza esatta"], correct: 0 }
    ),
    dialogue(
      "Моральная неоднозначность",
      "Discutere l'ambiguità morale del protagonista di un romanzo",
      ["Литературовед","Читательница"],
      "Литературовед",
      [
        dlLine("Читательница", "Гла́вный геро́й — злоде́й или же́ртва обстоя́тельств?", "Il protagonista è un cattivo o una vittima delle circostanze?"),
        dlLine("Литературовед", "В э́том и заключается гениальность автора — на э́тот вопро́с нет однозначного ответа.", "È proprio qui la genialità dell'autore — a questa domanda non c'è una risposta univoca."),
        dlLine("Читательница", "Но ведь он соверши́л ужа́сные посту́пки.", "Ma ha compiuto azioni terribili."),
        dlLine("Литературовед", "Соверши́л, и всё же а́втор заставля́ет нас ему́ сочу́вствовать.", "Le ha compiute, eppure l'autore ci costringe a provare empatia per lui."),
        dlLine("Читательница", "Э́то тревожит меня как читателя.", "Questo mi turba come lettrice."),
        dlLine("Литературовед", "Хоро́шая литерату́ра и должна́ трево́жить.", "La buona letteratura deve proprio turbare."),
      ],
      [
        dlTurn(
          dlLine("Читательница", "Гла́вный геро́й — злоде́й или же́ртва обстоя́тельств?", "Il protagonista è un cattivo o una vittima delle circostanze?"),
          [
            dlOpt("В э́том и заключается гениальность автора — на э́тот вопро́с нет однозначного ответа.", "È proprio qui la genialità dell'autore — a questa domanda non c'è una risposta univoca.", true),
            dlOpt("Совершил ужасные поступки.", "Ha compiuto azioni terribili.", false),
            dlOpt("Э́то тревожит меня.", "Questo mi turba.", false),
          ]
        ),
        dlTurn(
          dlLine("Читательница", "Но ведь он соверши́л ужа́сные посту́пки.", "Ma ha compiuto azioni terribili."),
          [
            dlOpt("Соверши́л, и всё же а́втор заставля́ет нас ему́ сочу́вствовать.", "Le ha compiute, eppure l'autore ci costringe a provare empatia per lui.", true),
            dlOpt("Нет однозначного ответа.", "Non c'è una risposta univoca.", false),
            dlOpt("Э́то тревожит меня.", "Questo mi turba.", false),
          ]
        ),
        dlTurn(
          dlLine("Читательница", "Э́то тревожит меня как читателя.", "Questo mi turba come lettrice."),
          [
            dlOpt("Хоро́шая литерату́ра и должна́ трево́жить.", "La buona letteratura deve proprio turbare.", true),
            dlOpt("Совершил ужасные поступки.", "Ha compiuto azioni terribili.", false),
            dlOpt("Нет однозначного ответа.", "Non c'è una risposta univoca.", false),
          ]
        ),
      ],
      { question: "Cosa pensa il critico letterario della buona letteratura?", options: ["Deve turbare il lettore","Deve sempre consolare","Deve essere semplice"], correct: 0 }
    ),
  ],
};
