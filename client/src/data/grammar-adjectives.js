// File generato dallo split di grammar-core.js (originariamente un unico file da 7043
// righe) per permettere a Vite di creare un chunk più piccolo per ciascuna categoria,
// invece di un blocco unico da ~650KB scaricato sempre tutto insieme.

import { adj, af } from "./grammar-helpers.js";

export const ADJECTIVES = {
  A1: [
    adj(
      "большо́й",
      "grande",
      "Aggettivo con accento sulla desinenza: al maschile termina in -ой invece del solito -ый. Il tema termina in ш, quindi per la regola ortografica delle 7 lettere si scrive и invece di ы (большим, большие, non большым/большые).",
      [
        af("Maschile", "большо́й", "дом", "Э́то большо́й дом.", "Questa è una grande casa."),
        af("Femminile", "больша́я", "кни́га", "Э́то больша́я кни́га.", "Questo è un grande libro."),
        af("Neutro", "большо́е", "окно́", "Э́то большо́е окно́.", "Questa è una grande finestra."),
        af("Plurale", "больши́е", "дома́", "Э́то больши́е дома́.", "Queste sono grandi case."),
      ],
      [
        af("Nominativo", "большо́й", "дом", "Большо́й дом стои́т на углу́.", "La grande casa si trova all'angolo."),
        af("Genitivo", "большо́го", "до́ма", "У большо́го до́ма есть сад.", "La grande casa ha un giardino."),
        af("Dativo", "большо́му", "до́му", "Мы идём к большо́му до́му.", "Andiamo verso la grande casa."),
        af("Accusativo", "большо́й", "дом", "Я ви́жу большо́й дом.", "Vedo la grande casa."),
        af("Strumentale", "больши́м", "до́мом", "Я дово́лен больши́м до́мом.", "Sono soddisfatto della grande casa."),
        af("Prepositivo", "большо́м", "до́ме", "Мы живём в большо́м до́ме.", "Viviamo nella grande casa."),
      ],
      { promptRu: "Большо́й дом стои́т на углу́.", promptIt: "Trasforma al PREPOSITIVO: 'nella grande casa'", targetCase: "Prepositivo", options: ["в большо́м до́ме","в большо́го до́ма","в большо́й дом"], correct: 0, fullRu: "Мы живём в большо́м до́ме.", fullIt: "Viviamo nella grande casa." }
    ),
    adj(
      "ма́ленький",
      "piccolo",
      "Aggettivo con tema in -к: per la regola ortografica delle 7 lettere si scrive и invece di ы (маленький, маленьким).",
      [
        af("Maschile", "ма́ленький", "дом", "Э́то ма́ленький дом.", "Questa è una piccola casa."),
        af("Femminile", "ма́ленькая", "кни́га", "Э́то ма́ленькая кни́га.", "Questo è un piccolo libro."),
        af("Neutro", "ма́ленькое", "окно́", "Э́то ма́ленькое окно́.", "Questa è una piccola finestra."),
        af("Plurale", "ма́ленькие", "дома́", "Э́то ма́ленькие дома́.", "Queste sono piccole case."),
      ],
      [
        af("Nominativo", "ма́ленький", "дом", "Ма́ленький дом уютный.", "La piccola casa è accogliente."),
        af("Genitivo", "ма́ленького", "до́ма", "У ма́ленького до́ма нет сада.", "La piccola casa non ha un giardino."),
        af("Dativo", "ма́ленькому", "до́му", "Мы идём к ма́ленькому до́му.", "Andiamo verso la piccola casa."),
        af("Accusativo", "ма́ленький", "дом", "Я купи́л ма́ленький дом.", "Ho comprato una piccola casa."),
        af("Strumentale", "ма́леньким", "до́мом", "Я дово́лен ма́леньким до́мом.", "Sono soddisfatto della piccola casa."),
        af("Prepositivo", "ма́леньком", "до́ме", "Мы живём в ма́леньком до́ме.", "Viviamo nella piccola casa."),
      ],
      { promptRu: "Ма́ленький дом уютный.", promptIt: "Trasforma al GENITIVO: 'della piccola casa'", targetCase: "Genitivo", options: ["ма́ленького до́ма","ма́ленький дом","ма́леньком до́ме"], correct: 0, fullRu: "У ма́ленького до́ма нет сада.", fullIt: "La piccola casa non ha un giardino." }
    ),
    adj(
      "хоро́ший",
      "buono",
      "Tema in -ш: per la regola ortografica delle 7 lettere il maschile termina in -ий (non -ый) e lo strumentale in -им (non -ым).",
      [
        af("Maschile", "хоро́ший", "дом", "Э́то хоро́ший дом.", "Questa è una buona casa."),
        af("Femminile", "хоро́шая", "кни́га", "Э́то хоро́шая кни́га.", "Questo è un buon libro."),
        af("Neutro", "хоро́шее", "окно́", "Э́то хоро́шее окно́.", "Questa è una buona finestra."),
        af("Plurale", "хоро́шие", "дома́", "Э́то хоро́шие дома́.", "Queste sono buone case."),
      ],
      [
        af("Nominativo", "хоро́ший", "дом", "Хоро́ший дом недалеко́.", "La buona casa non è lontana."),
        af("Genitivo", "хоро́шего", "до́ма", "У хоро́шего до́ма красивый вид.", "La buona casa ha una bella vista."),
        af("Dativo", "хоро́шему", "до́му", "Мы идём к хоро́шему до́му.", "Andiamo verso la buona casa."),
        af("Accusativo", "хоро́ший", "дом", "Я нашёл хоро́ший дом.", "Ho trovato una buona casa."),
        af("Strumentale", "хоро́шим", "до́мом", "Я дово́лен хоро́шим до́мом.", "Sono soddisfatto della buona casa."),
        af("Prepositivo", "хоро́шем", "до́ме", "Мы живём в хоро́шем до́ме.", "Viviamo nella buona casa."),
      ],
      { promptRu: "Хоро́ший дом недалеко́.", promptIt: "Trasforma allo STRUMENTALE: 'sono soddisfatto della buona casa'", targetCase: "Strumentale", options: ["хоро́шим до́мом","хоро́шего до́ма","хоро́шему до́му"], correct: 0, fullRu: "Я дово́лен хоро́шим до́мом.", fullIt: "Sono soddisfatto della buona casa." }
    ),
    adj(
      "но́вый",
      "nuovo",
      "Aggettivo regolare a tema duro, accento sulla radice: segue il modello standard senza eccezioni ortografiche.",
      [
        af("Maschile", "но́вый", "дом", "Э́то но́вый дом.", "Questa è una casa nuova."),
        af("Femminile", "но́вая", "кни́га", "Э́то но́вая кни́га.", "Questo è un libro nuovo."),
        af("Neutro", "но́вое", "окно́", "Э́то но́вое окно́.", "Questa è una finestra nuova."),
        af("Plurale", "но́вые", "дома́", "Э́то но́вые дома́.", "Queste sono case nuove."),
      ],
      [
        af("Nominativo", "но́вый", "дом", "Но́вый дом готов.", "La casa nuova è pronta."),
        af("Genitivo", "но́вого", "до́ма", "У но́вого до́ма нет забора.", "La casa nuova non ha una recinzione."),
        af("Dativo", "но́вому", "до́му", "Мы идём к но́вому до́му.", "Andiamo verso la casa nuova."),
        af("Accusativo", "но́вый", "дом", "Я купи́л но́вый дом.", "Ho comprato una casa nuova."),
        af("Strumentale", "но́вым", "до́мом", "Я дово́лен но́вым до́мом.", "Sono soddisfatto della casa nuova."),
        af("Prepositivo", "но́вом", "до́ме", "Мы живём в но́вом до́ме.", "Viviamo nella casa nuova."),
      ],
      { promptRu: "Но́вый дом гото́в.", promptIt: "Trasforma al DATIVO: 'andiamo verso la casa nuova'", targetCase: "Dativo", options: ["но́вому до́му","но́вого до́ма","но́вым до́мом"], correct: 0, fullRu: "Мы идём к но́вому до́му.", fullIt: "Andiamo verso la casa nuova." }
    ),
    adj(
      "краси́вый",
      "bello",
      "Aggettivo regolare a tema duro, accento sulla desinenza -и́вый: segue il modello standard senza eccezioni ortografiche.",
      [
        af("Maschile", "краси́вый", "дом", "Э́то краси́вый дом.", "Questa è una bella casa."),
        af("Femminile", "краси́вая", "кни́га", "Э́то краси́вая кни́га.", "Questo è un bel libro."),
        af("Neutro", "краси́вое", "окно́", "Э́то краси́вое окно́.", "Questa è una bella finestra."),
        af("Plurale", "краси́вые", "дома́", "Э́то краси́вые дома́.", "Queste sono belle case."),
      ],
      [
        af("Nominativo", "краси́вый", "дом", "Краси́вый дом продаётся.", "La bella casa è in vendita."),
        af("Genitivo", "краси́вого", "до́ма", "У краси́вого до́ма большой сад.", "La bella casa ha un grande giardino."),
        af("Dativo", "краси́вому", "до́му", "Мы идём к краси́вому до́му.", "Andiamo verso la bella casa."),
        af("Accusativo", "краси́вый", "дом", "Я сфотографи́ровал краси́вый дом.", "Ho fotografato la bella casa."),
        af("Strumentale", "краси́вым", "до́мом", "Я дово́лен краси́вым до́мом.", "Sono soddisfatto della bella casa."),
        af("Prepositivo", "краси́вом", "до́ме", "Мы живём в краси́вом до́ме.", "Viviamo nella bella casa."),
      ],
      { promptRu: "Краси́вый дом продаётся.", promptIt: "Trasforma all'ACCUSATIVO: 'ho fotografato la bella casa'", targetCase: "Accusativo", options: ["краси́вый дом","краси́вого до́ма","краси́вом до́ме"], correct: 0, fullRu: "Я сфотографи́ровал краси́вый дом.", fullIt: "Ho fotografato la bella casa." }
    ),
    adj(
      "молодо́й",
      "giovane",
      "Aggettivo con accento sulla desinenza (-ой al maschile), ma il tema termina in д (non una consonante 'sibilante'), quindi segue le desinenze standard senza modifiche ortografiche (молодым, non молодим).",
      [
        af("Maschile", "молодо́й", "учи́тель", "Э́то молодо́й учи́тель.", "Questo è un insegnante giovane."),
        af("Femminile", "молода́я", "учи́тельница", "Э́то молода́я учи́тельница.", "Questa è un'insegnante giovane."),
        af("Neutro", "молодо́е", "поколе́ние", "Э́то молодо́е поколе́ние.", "Questa è la giovane generazione."),
        af("Plurale", "молоды́е", "лю́ди", "Э́то молоды́е лю́ди.", "Queste sono persone giovani."),
      ],
      [
        af("Nominativo", "молодо́й", "учи́тель", "Молодо́й учи́тель нра́вится де́тям.", "Ai bambini piace il giovane insegnante."),
        af("Genitivo", "молодо́го", "учи́теля", "У молодо́го учи́теля мно́го иде́й.", "Il giovane insegnante ha molte idee."),
        af("Dativo", "молодо́му", "учи́телю", "Мы благода́рны молодо́му учи́телю.", "Siamo grati al giovane insegnante."),
        af("Accusativo", "молодо́го", "учи́теля", "Мы ви́дели молодо́го учи́теля.", "Abbiamo visto il giovane insegnante."),
        af("Strumentale", "молоды́м", "учи́телем", "Все дово́льны молоды́м учи́телем.", "Tutti sono soddisfatti del giovane insegnante."),
        af("Prepositivo", "молодо́м", "учи́теле", "Мы говори́м о молодо́м учи́теле.", "Parliamo del giovane insegnante."),
      ],
      { promptRu: "Молодо́й учи́тель нра́вится де́тям.", promptIt: "Trasforma all'ACCUSATIVO (persona = animato): 'abbiamo visto il giovane insegnante'", targetCase: "Accusativo (animato)", options: ["молодо́го учи́теля","молодо́й учи́тель","молодо́м учи́теле"], correct: 0, fullRu: "Мы ви́дели молодо́го учи́теля.", fullIt: "Abbiamo visto il giovane insegnante." }
    ),
    adj(
      "ста́рый",
      "vecchio, anziano",
      "Aggettivo regolare a tema duro, accento sulla radice: segue il modello standard senza eccezioni ortografiche.",
      [
        af("Maschile", "ста́рый", "дом", "Э́то ста́рый дом.", "Questa è una vecchia casa."),
        af("Femminile", "ста́рая", "кни́га", "Э́то ста́рая кни́га.", "Questo è un vecchio libro."),
        af("Neutro", "ста́рое", "окно́", "Э́то ста́рое окно́.", "Questa è una vecchia finestra."),
        af("Plurale", "ста́рые", "дома́", "Э́то ста́рые дома́.", "Queste sono vecchie case."),
      ],
      [
        af("Nominativo", "ста́рый", "дом", "Ста́рый дом разруша́ется.", "La vecchia casa sta crollando."),
        af("Genitivo", "ста́рого", "до́ма", "У ста́рого до́ма нет крыши.", "La vecchia casa non ha il tetto."),
        af("Dativo", "ста́рому", "до́му", "Мы идём к ста́рому до́му.", "Andiamo verso la vecchia casa."),
        af("Accusativo", "ста́рый", "дом", "Мы отремонти́ровали ста́рый дом.", "Abbiamo ristrutturato la vecchia casa."),
        af("Strumentale", "ста́рым", "до́мом", "Я горжу́сь ста́рым до́мом.", "Sono orgoglioso della vecchia casa."),
        af("Prepositivo", "ста́ром", "до́ме", "Мы живём в ста́ром до́ме.", "Viviamo nella vecchia casa."),
      ],
      { promptRu: "Ста́рый дом разруша́ется.", promptIt: "Trasforma al PREPOSITIVO: 'viviamo nella vecchia casa'", targetCase: "Prepositivo", options: ["в ста́ром до́ме","в ста́рого до́ма","в ста́рый дом"], correct: 0, fullRu: "Мы живём в ста́ром до́ме.", fullIt: "Viviamo nella vecchia casa." }
    ),
    adj(
      "молодо́й",
      "giovane",
      "Aggettivo con accento sulla desinenza, come большо́й.",
      [
        af("Maschile", "молодо́й", "челове́к", "Э́то молодо́й челове́к.", "Questo è un giovane uomo."),
        af("Femminile", "молода́я", "же́нщина", "Э́то молода́я же́нщина.", "Questa è una giovane donna."),
        af("Neutro", "молодо́е", "поколе́ние", "Э́то молодо́е поколе́ние.", "Questa è la giovane generazione."),
        af("Plurale", "молоды́е", "лю́ди", "Э́то молоды́е лю́ди.", "Queste sono persone giovani."),
      ],
      [
        af("Nominativo", "молодо́й", "челове́к", "Молодо́й челове́к рабо́тает здесь.", "Il giovane uomo lavora qui."),
        af("Genitivo", "молодо́го", "челове́ка", "У молодо́го челове́ка есть маши́на.", "Il giovane uomo ha una macchina."),
        af("Dativo", "молодо́му", "челове́ку", "Мы помога́ем молодо́му челове́ку.", "Aiutiamo il giovane uomo."),
        af("Accusativo", "молодо́го", "челове́ка", "Я ви́жу молодо́го челове́ка.", "Vedo il giovane uomo."),
        af("Strumentale", "молоды́м", "челове́ком", "Я говорю́ с молоды́м челове́ком.", "Parlo con il giovane uomo."),
        af("Prepositivo", "молодо́м", "челове́ке", "Мы ду́маем о молодо́м челове́ке.", "Pensiamo al giovane uomo."),
      ],
      { promptRu: "Молодо́й челове́к рабо́тает здесь.", promptIt: "Trasforma al DATIVO: 'al giovane uomo'", targetCase: "Dativo", options: ["молодо́му челове́ку","молодо́й челове́к","молодо́го челове́ка"], correct: 0, fullRu: "Мы помога́ем молодо́му челове́ку.", fullIt: "Aiutiamo il giovane uomo." }
    ),
    adj(
      "тёплый",
      "caldo, tiepido",
      "Aggettivo regolare in -ый.",
      [
        af("Maschile", "тёплый", "день", "Сего́дня тёплый день.", "Oggi è una giornata calda."),
        af("Femminile", "тёплая", "пого́да", "Сего́дня тёплая пого́да.", "Oggi il tempo è caldo."),
        af("Neutro", "тёплое", "мо́ре", "Э́то тёплое мо́ре.", "Questo è un mare caldo."),
        af("Plurale", "тёплые", "дни", "Э́то тёплые дни.", "Queste sono giornate calde."),
      ],
      [
        af("Nominativo", "тёплый", "день", "Тёплый день продолжа́ется.", "La giornata calda continua."),
        af("Genitivo", "тёплого", "дня", "Не жди́ тёплого дня.", "Non aspettare la giornata calda."),
        af("Dativo", "тёплому", "дню", "Мы ра́ды тёплому дню.", "Siamo felici della giornata calda."),
        af("Accusativo", "тёплый", "день", "Я по́мню тёплый день.", "Ricordo la giornata calda."),
        af("Strumentale", "тёплым", "днём", "Наслажда́юсь тёплым днём.", "Mi godo la giornata calda."),
        af("Prepositivo", "тёплом", "дне", "Ду́маю о тёплом дне.", "Penso alla giornata calda."),
      ],
      { promptRu: "Тёплый день продолжа́ется.", promptIt: "Trasforma allo STRUMENTALE: 'con la giornata calda'", targetCase: "Strumentale", options: ["тёплым днём","тёплый день","тёплого дня"], correct: 0, fullRu: "Наслажда́юсь тёплым днём.", fullIt: "Mi godo la giornata calda." }
    ),
  ],
  A2: [
    adj(
      "у́мный",
      "intelligente",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "у́мный", "человек", "Э́то у́мный человек.", "Questa è una persona intelligente."),
        af("Femminile", "у́мная", "де́вушка", "Э́то у́мная де́вушка.", "Questa è una ragazza intelligente."),
        af("Neutro", "у́мное", "реше́ние", "Э́то у́мное реше́ние.", "Questa è una decisione intelligente."),
        af("Plurale", "у́мные", "лю́ди", "Э́то у́мные лю́ди.", "Queste sono persone intelligenti."),
      ],
      [
        af("Nominativo", "у́мный", "челове́к", "У́мный челове́к думает.", "La persona intelligente pensa."),
        af("Genitivo", "у́много", "челове́ка", "У у́много челове́ка мно́го идей.", "La persona intelligente ha molte idee."),
        af("Dativo", "у́мному", "челове́ку", "Мы верим у́мному челове́ку.", "Crediamo alla persona intelligente."),
        af("Accusativo", "у́много", "челове́ка", "Я знаю у́много челове́ка.", "Conosco una persona intelligente."),
        af("Strumentale", "у́мным", "челове́ком", "Прия́тно быть у́мным челове́ком.", "È piacevole essere una persona intelligente."),
        af("Prepositivo", "у́мном", "челове́ке", "Мы говорим об у́мном челове́ке.", "Parliamo di una persona intelligente."),
      ],
      { promptRu: "Умный человек думает.", promptIt: "Trasforma al GENITIVO: 'la persona intelligente ha molte idee'", targetCase: "Genitivo", options: ["у́много челове́ка","у́мному челове́ку","у́мным челове́ком"], correct: 0, fullRu: "У умного человека мно́го идей.", fullIt: "La persona intelligente ha molte idee." }
    ),
    adj(
      "глу́пый",
      "stupido",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "глу́пый", "отве́т", "Э́то глу́пый отве́т.", "Questa è una risposta stupida."),
        af("Femminile", "глу́пая", "оши́бка", "Э́то глу́пая оши́бка.", "Questo è un errore stupido."),
        af("Neutro", "глу́пое", "замеча́ние", "Э́то глу́пое замеча́ние.", "Questa è un'osservazione stupida."),
        af("Plurale", "глу́пые", "вопро́сы", "Э́то глу́пые вопро́сы.", "Queste sono domande stupide."),
      ],
      [
        af("Nominativo", "глу́пый", "вопро́с", "Глу́пый вопро́с смешит всех.", "La domanda stupida fa ridere tutti."),
        af("Genitivo", "глу́пого", "вопро́са", "Он избегает глу́пого вопро́са.", "Evita la domanda stupida."),
        af("Dativo", "глу́пому", "вопро́су", "Не придавай значения глу́пому вопро́су.", "Non dare importanza alla domanda stupida."),
        af("Accusativo", "глу́пый", "вопро́с", "Я задал глу́пый вопро́с.", "Ho fatto una domanda stupida."),
        af("Strumentale", "глу́пым", "вопро́сом", "Он был озадачен глу́пым вопро́сом.", "Era perplesso per la domanda stupida."),
        af("Prepositivo", "глу́пом", "вопро́се", "Мы говорили о глу́пом вопро́се.", "Parlavamo della domanda stupida."),
      ],
      { promptRu: "Глупый вопро́с смешит всех.", promptIt: "Trasforma all'ACCUSATIVO: 'ho fatto una domanda stupida'", targetCase: "Accusativo", options: ["глу́пый вопро́с","глу́пого вопро́са","глу́пом вопро́се"], correct: 0, fullRu: "Я задал глупый вопро́с.", fullIt: "Ho fatto una domanda stupida." }
    ),
    adj(
      "бы́стрый",
      "veloce",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "бы́стрый", "поезд", "Э́то бы́стрый поезд.", "Questo è un treno veloce."),
        af("Femminile", "бы́страя", "маши́на", "Э́то бы́страя маши́на.", "Questa è una macchina veloce."),
        af("Neutro", "бы́строе", "реше́ние", "Э́то бы́строе реше́ние.", "Questa è una decisione veloce."),
        af("Plurale", "бы́стрые", "отве́ты", "Э́то бы́стрые отве́ты.", "Queste sono risposte veloci."),
      ],
      [
        af("Nominativo", "бы́стрый", "по́езд", "Бы́стрый по́езд отходит.", "Il treno veloce parte."),
        af("Genitivo", "бы́строго", "по́езда", "Я жду бы́строго по́езда.", "Aspetto il treno veloce."),
        af("Dativo", "бы́строму", "по́езду", "Мы бежим к бы́строму по́езду.", "Corriamo verso il treno veloce."),
        af("Accusativo", "бы́стрый", "по́езд", "Я выбрал бы́стрый по́езд.", "Ho scelto il treno veloce."),
        af("Strumentale", "бы́стрым", "по́ездом", "Я доволен бы́стрым по́ездом.", "Sono soddisfatto del treno veloce."),
        af("Prepositivo", "бы́стром", "по́езде", "Мы едем на бы́стром по́езде.", "Viaggiamo sul treno veloce."),
      ],
      { promptRu: "Быстрый поезд отходит.", promptIt: "Trasforma allo STRUMENTALE: 'sono soddisfatto del treno veloce'", targetCase: "Strumentale", options: ["бы́стрым по́ездом","бы́строго по́езда","бы́строму по́езду"], correct: 0, fullRu: "Я доволен быстрым поездом.", fullIt: "Sono soddisfatto del treno veloce." }
    ),
    adj(
      "ме́дленный",
      "lento",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "ме́дленный", "интерне́т", "Э́то ме́дленный интерне́т.", "Questo è internet lento."),
        af("Femminile", "ме́дленная", "рабо́та", "Э́то ме́дленная рабо́та.", "Questo è un lavoro lento."),
        af("Neutro", "ме́дленное", "движе́ние", "Э́то ме́дленное движе́ние.", "Questo è un movimento lento."),
        af("Plurale", "ме́дленные", "измене́ния", "Э́то ме́дленные измене́ния.", "Questi sono cambiamenti lenti."),
      ],
      [
        af("Nominativo", "ме́дленный", "интерне́т", "Ме́дленный интерне́т раздражает.", "Internet lento infastidisce."),
        af("Genitivo", "ме́дленного", "интерне́та", "Из-за ме́дленного интерне́та я опоздал.", "A causa di internet lento ho fatto tardi."),
        af("Dativo", "ме́дленному", "интерне́ту", "Мы привыкли к ме́дленному интерне́ту.", "Ci siamo abituati a internet lento."),
        af("Accusativo", "ме́дленный", "интерне́т", "Я терплю ме́дленный интерне́т.", "Sopporto internet lento."),
        af("Strumentale", "ме́дленным", "интерне́том", "Я недоволен ме́дленным интерне́том.", "Non sono soddisfatto di internet lento."),
        af("Prepositivo", "ме́дленном", "интерне́те", "Мы говорим о ме́дленном интерне́те.", "Parliamo di internet lento."),
      ],
      { promptRu: "Медленный интернет раздражает.", promptIt: "Trasforma al DATIVO: 'ci siamo abituati a internet lento'", targetCase: "Dativo", options: ["ме́дленному интерне́ту","ме́дленного интерне́та","ме́дленным интерне́том"], correct: 0, fullRu: "Мы привыкли к медленному интернету.", fullIt: "Ci siamo abituati a internet lento." }
    ),
    adj(
      "дорого́й",
      "caro, costoso",
      "Aggettivo con accento sulla desinenza (-ой al maschile); tema in г, ma dato che non è una consonante sibilante, segue le desinenze standard (дорогим, non dorogim con ortografia particolare).",
      [
        af("Maschile", "дорого́й", "телефо́н", "Э́то дорого́й телефо́н.", "Questo è un telefono caro."),
        af("Femminile", "дорога́я", "су́мка", "Э́то дорога́я су́мка.", "Questa è una borsa cara."),
        af("Neutro", "дорого́е", "кольцо́", "Э́то дорого́е кольцо́.", "Questo è un anello caro."),
        af("Plurale", "дороги́е", "часы́", "Э́то дороги́е часы́.", "Questo è un orologio caro (plurale in russo)."),
      ],
      [
        af("Nominativo", "дорого́й", "телефо́н", "Дорого́й телефо́н сломался.", "Il telefono caro si è rotto."),
        af("Genitivo", "дорого́го", "телефо́на", "У дорого́го телефо́на хорошая камера.", "Il telefono caro ha una buona fotocamera."),
        af("Dativo", "дорого́му", "телефо́ну", "Я привык к дорого́му телефо́ну.", "Mi sono abituato al telefono caro."),
        af("Accusativo", "дорого́й", "телефо́н", "Я купил дорого́й телефо́н.", "Ho comprato un telefono caro."),
        af("Strumentale", "дороги́м", "телефо́ном", "Я доволен дороги́м телефо́ном.", "Sono soddisfatto del telefono caro."),
        af("Prepositivo", "дорого́м", "телефо́не", "Мы говорим о дорого́м телефо́не.", "Parliamo del telefono caro."),
      ],
      { promptRu: "Дорогой телефон сломался.", promptIt: "Trasforma all'ACCUSATIVO: 'ho comprato un telefono caro'", targetCase: "Accusativo", options: ["дорого́й телефо́н","дорого́го телефо́на","дорого́м телефо́не"], correct: 0, fullRu: "Я купил дорогой телефон.", fullIt: "Ho comprato un telefono caro." }
    ),
    adj(
      "дешёвый",
      "economico, a buon mercato",
      "Aggettivo con tema in ш: al maschile e nello strumentale segue la regola ortografica delle 7 lettere (дешёвым, non dešövym).",
      [
        af("Maschile", "дешёвый", "биле́т", "Э́то дешёвый биле́т.", "Questo è un biglietto economico."),
        af("Femminile", "дешёвая", "оде́жда", "Э́то дешёвая оде́жда.", "Questi sono vestiti economici."),
        af("Neutro", "дешёвое", "вино́", "Э́то дешёвое вино́.", "Questo è un vino economico."),
        af("Plurale", "дешёвые", "биле́ты", "Э́то дешёвые биле́ты.", "Questi sono biglietti economici."),
      ],
      [
        af("Nominativo", "дешёвый", "биле́т", "Дешёвый биле́т распродан.", "Il biglietto economico è esaurito."),
        af("Genitivo", "дешёвого", "биле́та", "Я жду дешёвого биле́та.", "Aspetto il biglietto economico."),
        af("Dativo", "дешёвому", "биле́ту", "Я рад дешёвому биле́ту.", "Sono felice del biglietto economico."),
        af("Accusativo", "дешёвый", "биле́т", "Я нашёл дешёвый биле́т.", "Ho trovato un biglietto economico."),
        af("Strumentale", "дешёвым", "биле́том", "Я доволен дешёвым биле́том.", "Sono soddisfatto del biglietto economico."),
        af("Prepositivo", "дешёвом", "биле́те", "Мы говорим о дешёвом биле́те.", "Parliamo del biglietto economico."),
      ],
      { promptRu: "Дешёвый билет распродан.", promptIt: "Trasforma al GENITIVO: 'aspetto il biglietto economico'", targetCase: "Genitivo", options: ["дешёвого биле́та","дешёвому биле́ту","дешёвым биле́том"], correct: 0, fullRu: "Я жду дешёвого билета.", fullIt: "Aspetto il biglietto economico." }
    ),
    adj(
      "интере́сный",
      "interessante",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "интере́сный", "фильм", "Э́то интере́сный фильм.", "Questo è un film interessante."),
        af("Femminile", "интере́сная", "кни́га", "Э́то интере́сная кни́га.", "Questo è un libro interessante."),
        af("Neutro", "интере́сное", "путеше́ствие", "Э́то интере́сное путеше́ствие.", "Questo è un viaggio interessante."),
        af("Plurale", "интере́сные", "лю́ди", "Э́то интере́сные лю́ди.", "Queste sono persone interessanti."),
      ],
      [
        af("Nominativo", "интере́сный", "фильм", "Интере́сный фильм понравился всем.", "Il film interessante è piaciuto a tutti."),
        af("Genitivo", "интере́сного", "фи́льма", "Название интере́сного фи́льма забыл.", "Ho dimenticato il titolo del film interessante."),
        af("Dativo", "интере́сному", "фи́льму", "Дадим шанс интере́сному фи́льму.", "Diamo una possibilità al film interessante."),
        af("Accusativo", "интере́сный", "фильм", "Я посмотрел интере́сный фильм.", "Ho guardato un film interessante."),
        af("Strumentale", "интере́сным", "фи́льмом", "Я доволен интере́сным фи́льмом.", "Sono soddisfatto del film interessante."),
        af("Prepositivo", "интере́сном", "фи́льме", "Мы говорим об интере́сном фи́льме.", "Parliamo del film interessante."),
      ],
      { promptRu: "Интересный фильм понравился всем.", promptIt: "Trasforma al PREPOSITIVO: 'parliamo del film interessante'", targetCase: "Prepositivo", options: ["об интере́сном фи́льме","интере́сного фи́льма","интере́сному фи́льму"], correct: 0, fullRu: "Мы говорим об интересном фильме.", fullIt: "Parliamo del film interessante." }
    ),
    adj(
      "у́мный",
      "intelligente",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "у́мный", "дом", "Э́то у́мный дом.", "Questa è una casa intelligente."),
        af("Femminile", "у́мная", "кни́га", "Э́то у́мная книга.", "Questo è un libro intelligente."),
        af("Neutro", "у́мное", "окно́", "Э́то у́мное окно.", "Questa è una finestra intelligente."),
        af("Plurale", "у́мные", "дома́", "Э́то у́мные дома.", "Queste sono case intelligenti."),
      ],
      [
        af("Nominativo", "у́мный", "дом", "У́мный дом здесь.", "La casa intelligente è qui."),
        af("Genitivo", "у́много", "до́ма", "Возле у́много до́ма сад.", "Vicino alla casa intelligente c'è un giardino."),
        af("Dativo", "у́мному", "до́му", "Мы идём к у́мному до́му.", "Andiamo verso la casa intelligente."),
        af("Accusativo", "у́мный", "дом", "Я вижу у́мный дом.", "Vedo la casa intelligente."),
        af("Strumentale", "у́мным", "до́мом", "Я доволен у́мным до́мом.", "Sono soddisfatto della casa intelligente."),
        af("Prepositivo", "у́мном", "до́ме", "Мы живём в у́мном до́ме.", "Viviamo nella casa intelligente."),
      ],
      { promptRu: "У́мный дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa intelligente c'è un giardino'", targetCase: "Genitivo", options: ["у́много до́ма","у́мному до́му","у́мным до́мом"], correct: 0, fullRu: "Возле у́много до́ма сад.", fullIt: "Vicino alla casa intelligente c'è un giardino." }
    ),
    adj(
      "стра́нный",
      "strano",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "стра́нный", "дом", "Э́то стра́нный дом.", "Questa è una casa strana."),
        af("Femminile", "стра́нная", "кни́га", "Э́то стра́нная книга.", "Questo è un libro strano."),
        af("Neutro", "стра́нное", "окно́", "Э́то стра́нное окно.", "Questa è una finestra strana."),
        af("Plurale", "стра́нные", "дома́", "Э́то стра́нные дома.", "Queste sono case strane."),
      ],
      [
        af("Nominativo", "стра́нный", "дом", "Стра́нный дом здесь.", "La casa strana è qui."),
        af("Genitivo", "стра́нного", "до́ма", "Возле стра́нного до́ма сад.", "Vicino alla casa strana c'è un giardino."),
        af("Dativo", "стра́нному", "до́му", "Мы идём к стра́нному до́му.", "Andiamo verso la casa strana."),
        af("Accusativo", "стра́нный", "дом", "Я вижу стра́нный дом.", "Vedo la casa strana."),
        af("Strumentale", "стра́нным", "до́мом", "Я доволен стра́нным до́мом.", "Sono soddisfatto della casa strana."),
        af("Prepositivo", "стра́нном", "до́ме", "Мы живём в стра́нном до́ме.", "Viviamo nella casa strana."),
      ],
      { promptRu: "Стра́нный дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa strana c'è un giardino'", targetCase: "Genitivo", options: ["стра́нного до́ма","стра́нному до́му","стра́нным до́мом"], correct: 0, fullRu: "Возле стра́нного до́ма сад.", fullIt: "Vicino alla casa strana c'è un giardino." }
    ),
    adj(
      "ти́хий",
      "silenzioso",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "ти́хий", "дом", "Э́то ти́хий дом.", "Questa è una casa silenziosa."),
        af("Femminile", "ти́хая", "кни́га", "Э́то ти́хая книга.", "Questo è un libro silenzioso."),
        af("Neutro", "ти́хое", "окно́", "Э́то ти́хое окно.", "Questa è una finestra silenziosa."),
        af("Plurale", "ти́хие", "дома́", "Э́то ти́хие дома.", "Queste sono case silenziose."),
      ],
      [
        af("Nominativo", "ти́хий", "дом", "Ти́хий дом здесь.", "La casa silenziosa è qui."),
        af("Genitivo", "ти́хого", "до́ма", "Возле ти́хого до́ма сад.", "Vicino alla casa silenziosa c'è un giardino."),
        af("Dativo", "ти́хому", "до́му", "Мы идём к ти́хому до́му.", "Andiamo verso la casa silenziosa."),
        af("Accusativo", "ти́хий", "дом", "Я вижу ти́хий дом.", "Vedo la casa silenziosa."),
        af("Strumentale", "ти́хим", "до́мом", "Я доволен ти́хим до́мом.", "Sono soddisfatto della casa silenziosa."),
        af("Prepositivo", "ти́хом", "до́ме", "Мы живём в ти́хом до́ме.", "Viviamo nella casa silenziosa."),
      ],
      { promptRu: "Ти́хий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa silenziosa c'è un giardino'", targetCase: "Genitivo", options: ["ти́хого до́ма","ти́хому до́му","ти́хим до́мом"], correct: 0, fullRu: "Возле ти́хого до́ма сад.", fullIt: "Vicino alla casa silenziosa c'è un giardino." }
    ),
    adj(
      "гро́мкий",
      "rumoroso",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "гро́мкий", "дом", "Э́то гро́мкий дом.", "Questa è una casa rumorosa."),
        af("Femminile", "гро́мкая", "кни́га", "Э́то гро́мкая книга.", "Questo è un libro rumoroso."),
        af("Neutro", "гро́мкое", "окно́", "Э́то гро́мкое окно.", "Questa è una finestra rumorosa."),
        af("Plurale", "гро́мкие", "дома́", "Э́то гро́мкие дома.", "Queste sono case rumorose."),
      ],
      [
        af("Nominativo", "гро́мкий", "дом", "Гро́мкий дом здесь.", "La casa rumorosa è qui."),
        af("Genitivo", "гро́мкого", "до́ма", "Возле гро́мкого до́ма сад.", "Vicino alla casa rumorosa c'è un giardino."),
        af("Dativo", "гро́мкому", "до́му", "Мы идём к гро́мкому до́му.", "Andiamo verso la casa rumorosa."),
        af("Accusativo", "гро́мкий", "дом", "Я вижу гро́мкий дом.", "Vedo la casa rumorosa."),
        af("Strumentale", "гро́мким", "до́мом", "Я доволен гро́мким до́мом.", "Sono soddisfatto della casa rumorosa."),
        af("Prepositivo", "гро́мком", "до́ме", "Мы живём в гро́мком до́ме.", "Viviamo nella casa rumorosa."),
      ],
      { promptRu: "Гро́мкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa rumorosa c'è un giardino'", targetCase: "Genitivo", options: ["гро́мкого до́ма","гро́мкому до́му","гро́мким до́мом"], correct: 0, fullRu: "Возле гро́мкого до́ма сад.", fullIt: "Vicino alla casa rumorosa c'è un giardino." }
    ),
    adj(
      "лёгкий",
      "leggero, facile",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "лёгкий", "дом", "Э́то лёгкий дом.", "Questa è una casa leggera."),
        af("Femminile", "лёгкая", "кни́га", "Э́то лёгкая кни́га.", "Questo è un libro leggero."),
        af("Neutro", "лёгкое", "окно́", "Э́то лёгкое окно́.", "Questa è una finestra leggera."),
        af("Plurale", "лёгкие", "дома́", "Э́то лёгкие дома́.", "Queste sono case leggere."),
      ],
      [
        af("Nominativo", "лёгкий", "дом", "Лёгкий дом здесь.", "La casa leggera è qui."),
        af("Genitivo", "лёгкого", "до́ма", "Возле лёгкого до́ма сад.", "Vicino alla casa leggera c'è un giardino."),
        af("Dativo", "лёгкому", "до́му", "Мы идём к лёгкому до́му.", "Andiamo verso la casa leggera."),
        af("Accusativo", "лёгкий", "дом", "Я ви́жу лёгкий дом.", "Vedo la casa leggera."),
        af("Strumentale", "лёгким", "до́мом", "Я доволен лёгким до́мом.", "Sono soddisfatto della casa leggera."),
        af("Prepositivo", "лёгком", "до́ме", "Мы живём в лёгком до́ме.", "Viviamo nella casa leggera."),
      ],
      { promptRu: "Лёгкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa leggera c'è un giardino'", targetCase: "Genitivo", options: ["лёгкого до́ма","лёгкому до́му","лёгким до́мом"], correct: 0, fullRu: "Возле лёгкого до́ма сад.", fullIt: "Vicino alla casa leggera c'è un giardino." }
    ),
    adj(
      "тяжёлый",
      "pesante, difficile",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "тяжёлый", "дом", "Э́то тяжёлый дом.", "Questa è una casa pesante."),
        af("Femminile", "тяжёлая", "кни́га", "Э́то тяжёлая кни́га.", "Questo è un libro pesante."),
        af("Neutro", "тяжёлое", "окно́", "Э́то тяжёлое окно́.", "Questa è una finestra pesante."),
        af("Plurale", "тяжёлые", "дома́", "Э́то тяжёлые дома́.", "Queste sono case pesanti."),
      ],
      [
        af("Nominativo", "тяжёлый", "дом", "Тяжёлый дом здесь.", "La casa pesante è qui."),
        af("Genitivo", "тяжёлого", "до́ма", "Возле тяжёлого до́ма сад.", "Vicino alla casa pesante c'è un giardino."),
        af("Dativo", "тяжёлому", "до́му", "Мы идём к тяжёлому до́му.", "Andiamo verso la casa pesante."),
        af("Accusativo", "тяжёлый", "дом", "Я ви́жу тяжёлый дом.", "Vedo la casa pesante."),
        af("Strumentale", "тяжёлым", "до́мом", "Я доволен тяжёлым до́мом.", "Sono soddisfatto della casa pesante."),
        af("Prepositivo", "тяжёлом", "до́ме", "Мы живём в тяжёлом до́ме.", "Viviamo nella casa pesante."),
      ],
      { promptRu: "Тяжёлый дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa pesante c'è un giardino'", targetCase: "Genitivo", options: ["тяжёлого до́ма","тяжёлому до́му","тяжёлым до́мом"], correct: 0, fullRu: "Возле тяжёлого до́ма сад.", fullIt: "Vicino alla casa pesante c'è un giardino." }
    ),
    adj(
      "просто́рный",
      "spazioso",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "просто́рный", "дом", "Э́то просто́рный дом.", "Questa è una casa spaziosa."),
        af("Femminile", "просто́рная", "кни́га", "Э́то просто́рная книга.", "Questo è un libro spazioso."),
        af("Neutro", "просто́рное", "окно́", "Э́то просто́рное окно.", "Questa è una finestra spaziosa."),
        af("Plurale", "просто́рные", "дома́", "Э́то просто́рные дома.", "Queste sono case spaziose."),
      ],
      [
        af("Nominativo", "просто́рный", "дом", "Просто́рный дом здесь.", "La casa spaziosa è qui."),
        af("Genitivo", "просто́рного", "до́ма", "Возле просто́рного до́ма сад.", "Vicino alla casa spaziosa c'è un giardino."),
        af("Dativo", "просто́рному", "до́му", "Мы идём к просто́рному до́му.", "Andiamo verso la casa spaziosa."),
        af("Accusativo", "просто́рный", "дом", "Я вижу просто́рный дом.", "Vedo la casa spaziosa."),
        af("Strumentale", "просто́рным", "до́мом", "Я доволен просто́рным до́мом.", "Sono soddisfatto della casa spaziosa."),
        af("Prepositivo", "просто́рном", "до́ме", "Мы живём в просто́рном до́ме.", "Viviamo nella casa spaziosa."),
      ],
      { promptRu: "Просто́рный дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa spaziosa c'è un giardino'", targetCase: "Genitivo", options: ["просто́рного до́ма","просто́рному до́му","просто́рным до́мом"], correct: 0, fullRu: "Возле просто́рного до́ма сад.", fullIt: "Vicino alla casa spaziosa c'è un giardino." }
    ),
    adj(
      "те́сный",
      "stretto, angusto",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "те́сный", "дом", "Э́то те́сный дом.", "Questa è una casa stretta."),
        af("Femminile", "те́сная", "кни́га", "Э́то те́сная книга.", "Questo è un libro stretto."),
        af("Neutro", "те́сное", "окно́", "Э́то те́сное окно.", "Questa è una finestra stretta."),
        af("Plurale", "те́сные", "дома́", "Э́то те́сные дома.", "Queste sono case strette."),
      ],
      [
        af("Nominativo", "те́сный", "дом", "Те́сный дом здесь.", "La casa stretta è qui."),
        af("Genitivo", "те́сного", "до́ма", "Возле те́сного до́ма сад.", "Vicino alla casa stretta c'è un giardino."),
        af("Dativo", "те́сному", "до́му", "Мы идём к те́сному до́му.", "Andiamo verso la casa stretta."),
        af("Accusativo", "те́сный", "дом", "Я вижу те́сный дом.", "Vedo la casa stretta."),
        af("Strumentale", "те́сным", "до́мом", "Я доволен те́сным до́мом.", "Sono soddisfatto della casa stretta."),
        af("Prepositivo", "те́сном", "до́ме", "Мы живём в те́сном до́ме.", "Viviamo nella casa stretta."),
      ],
      { promptRu: "Те́сный дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa stretta c'è un giardino'", targetCase: "Genitivo", options: ["те́сного до́ма","те́сному до́му","те́сным до́мом"], correct: 0, fullRu: "Возле те́сного до́ма сад.", fullIt: "Vicino alla casa stretta c'è un giardino." }
    ),
    adj(
      "чи́стый",
      "pulito",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "чи́стый", "дом", "Э́то чи́стый дом.", "Questa è una casa pulita."),
        af("Femminile", "чи́стая", "кни́га", "Э́то чи́стая книга.", "Questo è un libro pulito."),
        af("Neutro", "чи́стое", "окно́", "Э́то чи́стое окно.", "Questa è una finestra pulita."),
        af("Plurale", "чи́стые", "дома́", "Э́то чи́стые дома.", "Queste sono case pulite."),
      ],
      [
        af("Nominativo", "чи́стый", "дом", "Чи́стый дом здесь.", "La casa pulita è qui."),
        af("Genitivo", "чи́стого", "до́ма", "Возле чи́стого до́ма сад.", "Vicino alla casa pulita c'è un giardino."),
        af("Dativo", "чи́стому", "до́му", "Мы идём к чи́стому до́му.", "Andiamo verso la casa pulita."),
        af("Accusativo", "чи́стый", "дом", "Я вижу чи́стый дом.", "Vedo la casa pulita."),
        af("Strumentale", "чи́стым", "до́мом", "Я доволен чи́стым до́мом.", "Sono soddisfatto della casa pulita."),
        af("Prepositivo", "чи́стом", "до́ме", "Мы живём в чи́стом до́ме.", "Viviamo nella casa pulita."),
      ],
      { promptRu: "Чи́стый дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa pulita c'è un giardino'", targetCase: "Genitivo", options: ["чи́стого до́ма","чи́стому до́му","чи́стым до́мом"], correct: 0, fullRu: "Возле чи́стого до́ма сад.", fullIt: "Vicino alla casa pulita c'è un giardino." }
    ),
    adj(
      "гря́зный",
      "sporco",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "гря́зный", "дом", "Э́то гря́зный дом.", "Questa è una casa sporca."),
        af("Femminile", "гря́зная", "кни́га", "Э́то гря́зная книга.", "Questo è un libro sporco."),
        af("Neutro", "гря́зное", "окно́", "Э́то гря́зное окно.", "Questa è una finestra sporca."),
        af("Plurale", "гря́зные", "дома́", "Э́то гря́зные дома.", "Queste sono case sporche."),
      ],
      [
        af("Nominativo", "гря́зный", "дом", "Гря́зный дом здесь.", "La casa sporca è qui."),
        af("Genitivo", "гря́зного", "до́ма", "Возле гря́зного до́ма сад.", "Vicino alla casa sporca c'è un giardino."),
        af("Dativo", "гря́зному", "до́му", "Мы идём к гря́зному до́му.", "Andiamo verso la casa sporca."),
        af("Accusativo", "гря́зный", "дом", "Я вижу гря́зный дом.", "Vedo la casa sporca."),
        af("Strumentale", "гря́зным", "до́мом", "Я доволен гря́зным до́мом.", "Sono soddisfatto della casa sporca."),
        af("Prepositivo", "гря́зном", "до́ме", "Мы живём в гря́зном до́ме.", "Viviamo nella casa sporca."),
      ],
      { promptRu: "Гря́зный дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa sporca c'è un giardino'", targetCase: "Genitivo", options: ["гря́зного до́ма","гря́зному до́му","гря́зным до́мом"], correct: 0, fullRu: "Возле гря́зного до́ма сад.", fullIt: "Vicino alla casa sporca c'è un giardino." }
    ),
    adj(
      "о́стрый",
      "acuto, tagliente, piccante",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "о́стрый", "дом", "Э́то о́стрый дом.", "Questa è una casa acuta."),
        af("Femminile", "о́страя", "кни́га", "Э́то о́страя книга.", "Questo è un libro acuto."),
        af("Neutro", "о́строе", "окно́", "Э́то о́строе окно.", "Questa è una finestra acuta."),
        af("Plurale", "о́стрые", "дома́", "Э́то о́стрые дома.", "Queste sono case acute."),
      ],
      [
        af("Nominativo", "о́стрый", "дом", "О́стрый дом здесь.", "La casa acuta è qui."),
        af("Genitivo", "о́строго", "до́ма", "Возле о́строго до́ма сад.", "Vicino alla casa acuta c'è un giardino."),
        af("Dativo", "о́строму", "до́му", "Мы идём к о́строму до́му.", "Andiamo verso la casa acuta."),
        af("Accusativo", "о́стрый", "дом", "Я вижу о́стрый дом.", "Vedo la casa acuta."),
        af("Strumentale", "о́стрым", "до́мом", "Я доволен о́стрым до́мом.", "Sono soddisfatto della casa acuta."),
        af("Prepositivo", "о́стром", "до́ме", "Мы живём в о́стром до́ме.", "Viviamo nella casa acuta."),
      ],
      { promptRu: "О́стрый дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa acuta c'è un giardino'", targetCase: "Genitivo", options: ["о́строго до́ма","о́строму до́му","о́стрым до́мом"], correct: 0, fullRu: "Возле о́строго до́ма сад.", fullIt: "Vicino alla casa acuta c'è un giardino." }
    ),
    adj(
      "здоро́вый",
      "sano, robusto",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "здоро́вый", "дом", "Э́то здоро́вый дом.", "Questa è una casa sana."),
        af("Femminile", "здоро́вая", "кни́га", "Э́то здоро́вая книга.", "Questo è un libro sano."),
        af("Neutro", "здоро́вое", "окно́", "Э́то здоро́вое окно.", "Questa è una finestra sana."),
        af("Plurale", "здоро́вые", "дома́", "Э́то здоро́вые дома.", "Queste sono case sane."),
      ],
      [
        af("Nominativo", "здоро́вый", "дом", "Здоро́вый дом здесь.", "La casa sana è qui."),
        af("Genitivo", "здоро́вого", "до́ма", "Возле здоро́вого до́ма сад.", "Vicino alla casa sana c'è un giardino."),
        af("Dativo", "здоро́вому", "до́му", "Мы идём к здоро́вому до́му.", "Andiamo verso la casa sana."),
        af("Accusativo", "здоро́вый", "дом", "Я вижу здоро́вый дом.", "Vedo la casa sana."),
        af("Strumentale", "здоро́вым", "до́мом", "Я доволен здоро́вым до́мом.", "Sono soddisfatto della casa sana."),
        af("Prepositivo", "здоро́вом", "до́ме", "Мы живём в здоро́вом до́ме.", "Viviamo nella casa sana."),
      ],
      { promptRu: "Здоро́вый дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa sana c'è un giardino'", targetCase: "Genitivo", options: ["здоро́вого до́ма","здоро́вому до́му","здоро́вым до́мом"], correct: 0, fullRu: "Возле здоро́вого до́ма сад.", fullIt: "Vicino alla casa sana c'è un giardino." }
    ),
    adj(
      "у́зкий",
      "stretto",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "у́зкий", "дом", "Э́то у́зкий дом.", "Questa è una casa stretta."),
        af("Femminile", "у́зкая", "кни́га", "Э́то у́зкая книга.", "Questo è un libro stretto."),
        af("Neutro", "у́зкое", "окно́", "Э́то у́зкое окно.", "Questa è una finestra stretta."),
        af("Plurale", "у́зкие", "дома́", "Э́то у́зкие дома.", "Queste sono case strette."),
      ],
      [
        af("Nominativo", "у́зкий", "дом", "У́зкий дом здесь.", "La casa stretta è qui."),
        af("Genitivo", "у́зкого", "до́ма", "Возле у́зкого до́ма сад.", "Vicino alla casa stretta c'è un giardino."),
        af("Dativo", "у́зкому", "до́му", "Мы идём к у́зкому до́му.", "Andiamo verso la casa stretta."),
        af("Accusativo", "у́зкий", "дом", "Я вижу у́зкий дом.", "Vedo la casa stretta."),
        af("Strumentale", "у́зким", "до́мом", "Я доволен у́зким до́мом.", "Sono soddisfatto della casa stretta."),
        af("Prepositivo", "у́зком", "до́ме", "Мы живём в у́зком до́ме.", "Viviamo nella casa stretta."),
      ],
      { promptRu: "У́зкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa stretta c'è un giardino'", targetCase: "Genitivo", options: ["у́зкого до́ма","у́зкому до́му","у́зким до́мом"], correct: 0, fullRu: "Возле у́зкого до́ма сад.", fullIt: "Vicino alla casa stretta c'è un giardino." }
    ),
    adj(
      "широ́кий",
      "largo",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "широ́кий", "дом", "Э́то широ́кий дом.", "Questa è una casa larga."),
        af("Femminile", "широ́кая", "кни́га", "Э́то широ́кая книга.", "Questo è un libro largo."),
        af("Neutro", "широ́кое", "окно́", "Э́то широ́кое окно.", "Questa è una finestra larga."),
        af("Plurale", "широ́кие", "дома́", "Э́то широ́кие дома.", "Queste sono case larghe."),
      ],
      [
        af("Nominativo", "широ́кий", "дом", "Широ́кий дом здесь.", "La casa larga è qui."),
        af("Genitivo", "широ́кого", "до́ма", "Возле широ́кого до́ма сад.", "Vicino alla casa larga c'è un giardino."),
        af("Dativo", "широ́кому", "до́му", "Мы идём к широ́кому до́му.", "Andiamo verso la casa larga."),
        af("Accusativo", "широ́кий", "дом", "Я вижу широ́кий дом.", "Vedo la casa larga."),
        af("Strumentale", "широ́ким", "до́мом", "Я доволен широ́ким до́мом.", "Sono soddisfatto della casa larga."),
        af("Prepositivo", "широ́ком", "до́ме", "Мы живём в широ́ком до́ме.", "Viviamo nella casa larga."),
      ],
      { promptRu: "Широ́кий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa larga c'è un giardino'", targetCase: "Genitivo", options: ["широ́кого до́ма","широ́кому до́му","широ́ким до́мом"], correct: 0, fullRu: "Возле широ́кого до́ма сад.", fullIt: "Vicino alla casa larga c'è un giardino." }
    ),
    adj(
      "высо́кий",
      "alto",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "высо́кий", "дом", "Э́то высо́кий дом.", "Questa è una casa alta."),
        af("Femminile", "высо́кая", "кни́га", "Э́то высо́кая книга.", "Questo è un libro alto."),
        af("Neutro", "высо́кое", "окно́", "Э́то высо́кое окно.", "Questa è una finestra alta."),
        af("Plurale", "высо́кие", "дома́", "Э́то высо́кие дома.", "Queste sono case alte."),
      ],
      [
        af("Nominativo", "высо́кий", "дом", "Высо́кий дом здесь.", "La casa alta è qui."),
        af("Genitivo", "высо́кого", "до́ма", "Возле высо́кого до́ма сад.", "Vicino alla casa alta c'è un giardino."),
        af("Dativo", "высо́кому", "до́му", "Мы идём к высо́кому до́му.", "Andiamo verso la casa alta."),
        af("Accusativo", "высо́кий", "дом", "Я вижу высо́кий дом.", "Vedo la casa alta."),
        af("Strumentale", "высо́ким", "до́мом", "Я доволен высо́ким до́мом.", "Sono soddisfatto della casa alta."),
        af("Prepositivo", "высо́ком", "до́ме", "Мы живём в высо́ком до́ме.", "Viviamo nella casa alta."),
      ],
      { promptRu: "Высо́кий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa alta c'è un giardino'", targetCase: "Genitivo", options: ["высо́кого до́ма","высо́кому до́му","высо́ким до́мом"], correct: 0, fullRu: "Возле высо́кого до́ма сад.", fullIt: "Vicino alla casa alta c'è un giardino." }
    ),
    adj(
      "ни́зкий",
      "basso",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "ни́зкий", "дом", "Э́то ни́зкий дом.", "Questa è una casa bassa."),
        af("Femminile", "ни́зкая", "кни́га", "Э́то ни́зкая книга.", "Questo è un libro basso."),
        af("Neutro", "ни́зкое", "окно́", "Э́то ни́зкое окно.", "Questa è una finestra bassa."),
        af("Plurale", "ни́зкие", "дома́", "Э́то ни́зкие дома.", "Queste sono case basse."),
      ],
      [
        af("Nominativo", "ни́зкий", "дом", "Ни́зкий дом здесь.", "La casa bassa è qui."),
        af("Genitivo", "ни́зкого", "до́ма", "Возле ни́зкого до́ма сад.", "Vicino alla casa bassa c'è un giardino."),
        af("Dativo", "ни́зкому", "до́му", "Мы идём к ни́зкому до́му.", "Andiamo verso la casa bassa."),
        af("Accusativo", "ни́зкий", "дом", "Я вижу ни́зкий дом.", "Vedo la casa bassa."),
        af("Strumentale", "ни́зким", "до́мом", "Я доволен ни́зким до́мом.", "Sono soddisfatto della casa bassa."),
        af("Prepositivo", "ни́зком", "до́ме", "Мы живём в ни́зком до́ме.", "Viviamo nella casa bassa."),
      ],
      { promptRu: "Ни́зкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa bassa c'è un giardino'", targetCase: "Genitivo", options: ["ни́зкого до́ма","ни́зкому до́му","ни́зким до́мом"], correct: 0, fullRu: "Возле ни́зкого до́ма сад.", fullIt: "Vicino alla casa bassa c'è un giardino." }
    ),
    adj(
      "глубо́кий",
      "profondo",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "глубо́кий", "дом", "Э́то глубо́кий дом.", "Questa è una casa profonda."),
        af("Femminile", "глубо́кая", "кни́га", "Э́то глубо́кая книга.", "Questo è un libro profondo."),
        af("Neutro", "глубо́кое", "окно́", "Э́то глубо́кое окно.", "Questa è una finestra profonda."),
        af("Plurale", "глубо́кие", "дома́", "Э́то глубо́кие дома.", "Queste sono case profonde."),
      ],
      [
        af("Nominativo", "глубо́кий", "дом", "Глубо́кий дом здесь.", "La casa profonda è qui."),
        af("Genitivo", "глубо́кого", "до́ма", "Возле глубо́кого до́ма сад.", "Vicino alla casa profonda c'è un giardino."),
        af("Dativo", "глубо́кому", "до́му", "Мы идём к глубо́кому до́му.", "Andiamo verso la casa profonda."),
        af("Accusativo", "глубо́кий", "дом", "Я вижу глубо́кий дом.", "Vedo la casa profonda."),
        af("Strumentale", "глубо́ким", "до́мом", "Я доволен глубо́ким до́мом.", "Sono soddisfatto della casa profonda."),
        af("Prepositivo", "глубо́ком", "до́ме", "Мы живём в глубо́ком до́ме.", "Viviamo nella casa profonda."),
      ],
      { promptRu: "Глубо́кий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa profonda c'è un giardino'", targetCase: "Genitivo", options: ["глубо́кого до́ма","глубо́кому до́му","глубо́ким до́мом"], correct: 0, fullRu: "Возле глубо́кого до́ма сад.", fullIt: "Vicino alla casa profonda c'è un giardino." }
    ),
    adj(
      "ме́лкий",
      "piccolo, superficiale",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "ме́лкий", "дом", "Э́то ме́лкий дом.", "Questa è una casa piccola."),
        af("Femminile", "ме́лкая", "кни́га", "Э́то ме́лкая книга.", "Questo è un libro piccolo."),
        af("Neutro", "ме́лкое", "окно́", "Э́то ме́лкое окно.", "Questa è una finestra piccola."),
        af("Plurale", "ме́лкие", "дома́", "Э́то ме́лкие дома.", "Queste sono case piccole."),
      ],
      [
        af("Nominativo", "ме́лкий", "дом", "Ме́лкий дом здесь.", "La casa piccola è qui."),
        af("Genitivo", "ме́лкого", "до́ма", "Возле ме́лкого до́ма сад.", "Vicino alla casa piccola c'è un giardino."),
        af("Dativo", "ме́лкому", "до́му", "Мы идём к ме́лкому до́му.", "Andiamo verso la casa piccola."),
        af("Accusativo", "ме́лкий", "дом", "Я вижу ме́лкий дом.", "Vedo la casa piccola."),
        af("Strumentale", "ме́лким", "до́мом", "Я доволен ме́лким до́мом.", "Sono soddisfatto della casa piccola."),
        af("Prepositivo", "ме́лком", "до́ме", "Мы живём в ме́лком до́ме.", "Viviamo nella casa piccola."),
      ],
      { promptRu: "Ме́лкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa piccola c'è un giardino'", targetCase: "Genitivo", options: ["ме́лкого до́ма","ме́лкому до́му","ме́лким до́мом"], correct: 0, fullRu: "Возле ме́лкого до́ма сад.", fullIt: "Vicino alla casa piccola c'è un giardino." }
    ),
    adj(
      "жёсткий",
      "duro, rigido",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "жёсткий", "дом", "Э́то жёсткий дом.", "Questa è una casa dura."),
        af("Femminile", "жёсткая", "кни́га", "Э́то жёсткая кни́га.", "Questo è un libro duro."),
        af("Neutro", "жёсткое", "окно́", "Э́то жёсткое окно́.", "Questa è una finestra dura."),
        af("Plurale", "жёсткие", "дома́", "Э́то жёсткие дома́.", "Queste sono case dure."),
      ],
      [
        af("Nominativo", "жёсткий", "дом", "Жёсткий дом здесь.", "La casa dura è qui."),
        af("Genitivo", "жёсткого", "до́ма", "Возле жёсткого до́ма сад.", "Vicino alla casa dura c'è un giardino."),
        af("Dativo", "жёсткому", "до́му", "Мы идём к жёсткому до́му.", "Andiamo verso la casa dura."),
        af("Accusativo", "жёсткий", "дом", "Я ви́жу жёсткий дом.", "Vedo la casa dura."),
        af("Strumentale", "жёстким", "до́мом", "Я доволен жёстким до́мом.", "Sono soddisfatto della casa dura."),
        af("Prepositivo", "жёстком", "до́ме", "Мы живём в жёстком до́ме.", "Viviamo nella casa dura."),
      ],
      { promptRu: "Жёсткий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa dura c'è un giardino'", targetCase: "Genitivo", options: ["жёсткого до́ма","жёсткому до́му","жёстким до́мом"], correct: 0, fullRu: "Возле жёсткого до́ма сад.", fullIt: "Vicino alla casa dura c'è un giardino." }
    ),
    adj(
      "мя́гкий",
      "morbido",
      "Aggettivo con tema in г/к/х: per la regola delle 7 lettere si scrive и invece di ы nelle desinenze (ma о/е restano regolari, poiché questa regola riguarda solo ц/ч/ш/щ/ж).",
      [
        af("Maschile", "мя́гкий", "дом", "Э́то мя́гкий дом.", "Questa è una casa morbida."),
        af("Femminile", "мя́гкая", "кни́га", "Э́то мя́гкая книга.", "Questo è un libro morbido."),
        af("Neutro", "мя́гкое", "окно́", "Э́то мя́гкое окно.", "Questa è una finestra morbida."),
        af("Plurale", "мя́гкие", "дома́", "Э́то мя́гкие дома.", "Queste sono case morbide."),
      ],
      [
        af("Nominativo", "мя́гкий", "дом", "Мя́гкий дом здесь.", "La casa morbida è qui."),
        af("Genitivo", "мя́гкого", "до́ма", "Возле мя́гкого до́ма сад.", "Vicino alla casa morbida c'è un giardino."),
        af("Dativo", "мя́гкому", "до́му", "Мы идём к мя́гкому до́му.", "Andiamo verso la casa morbida."),
        af("Accusativo", "мя́гкий", "дом", "Я вижу мя́гкий дом.", "Vedo la casa morbida."),
        af("Strumentale", "мя́гким", "до́мом", "Я доволен мя́гким до́мом.", "Sono soddisfatto della casa morbida."),
        af("Prepositivo", "мя́гком", "до́ме", "Мы живём в мя́гком до́ме.", "Viviamo nella casa morbida."),
      ],
      { promptRu: "Мя́гкий дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa morbida c'è un giardino'", targetCase: "Genitivo", options: ["мя́гкого до́ма","мя́гкому до́му","мя́гким до́мом"], correct: 0, fullRu: "Возле мя́гкого до́ма сад.", fullIt: "Vicino alla casa morbida c'è un giardino." }
    ),
    adj(
      "бы́стрый",
      "veloce",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "бы́стрый", "дом", "Э́то бы́стрый дом.", "Questa è una casa veloce."),
        af("Femminile", "бы́страя", "кни́га", "Э́то бы́страя книга.", "Questo è un libro veloce."),
        af("Neutro", "бы́строе", "окно́", "Э́то бы́строе окно.", "Questa è una finestra veloce."),
        af("Plurale", "бы́стрые", "дома́", "Э́то бы́стрые дома.", "Queste sono case veloci."),
      ],
      [
        af("Nominativo", "бы́стрый", "дом", "Бы́стрый дом здесь.", "La casa veloce è qui."),
        af("Genitivo", "бы́строго", "до́ма", "Возле бы́строго до́ма сад.", "Vicino alla casa veloce c'è un giardino."),
        af("Dativo", "бы́строму", "до́му", "Мы идём к бы́строму до́му.", "Andiamo verso la casa veloce."),
        af("Accusativo", "бы́стрый", "дом", "Я вижу бы́стрый дом.", "Vedo la casa veloce."),
        af("Strumentale", "бы́стрым", "до́мом", "Я доволен бы́стрым до́мом.", "Sono soddisfatto della casa veloce."),
        af("Prepositivo", "бы́стром", "до́ме", "Мы живём в бы́стром до́ме.", "Viviamo nella casa veloce."),
      ],
      { promptRu: "Бы́стрый дом здесь.", promptIt: "Trasforma al GENITIVO: 'vicino alla casa veloce c'è un giardino'", targetCase: "Genitivo", options: ["бы́строго до́ма","бы́строму до́му","бы́стрым до́мом"], correct: 0, fullRu: "Возле бы́строго до́ма сад.", fullIt: "Vicino alla casa veloce c'è un giardino." }
    ),
  ],
  B1: [
    adj(
      "уве́ренный",
      "sicuro (di sé)",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "уве́ренный", "челове́к", "Э́то уве́ренный челове́к.", "Questa è una persona sicura di sé."),
        af("Femminile", "уве́ренная", "же́нщина", "Э́то уве́ренная же́нщина.", "Questa è una donna sicura di sé."),
        af("Neutro", "уве́ренное", "реше́ние", "Э́то уве́ренное реше́ние.", "Questa è una decisione sicura."),
        af("Plurale", "уве́ренные", "лю́ди", "Э́то уве́ренные лю́ди.", "Queste sono persone sicure di sé."),
      ],
      [
        af("Nominativo", "уве́ренный", "челове́к", "Уве́ренный челове́к не боится.", "La persona sicura di sé non ha paura."),
        af("Genitivo", "уве́ренного", "челове́ка", "У уве́ренного челове́ка есть план.", "La persona sicura di sé ha un piano."),
        af("Dativo", "уве́ренному", "челове́ку", "Легко́ доверять уве́ренному челове́ку.", "È facile fidarsi di una persona sicura di sé."),
        af("Accusativo", "уве́ренного", "челове́ка", "Я вижу уве́ренного челове́ка.", "Vedo una persona sicura di sé."),
        af("Strumentale", "уве́ренным", "челове́ком", "Прия́тно быть уве́ренным челове́ком.", "È piacevole essere una persona sicura di sé."),
        af("Prepositivo", "уве́ренном", "челове́ке", "Мы говорим об уве́ренном челове́ке.", "Parliamo di una persona sicura di sé."),
      ],
      { promptRu: "Уверенный человек не боится.", promptIt: "Trasforma al DATIVO: 'è facile fidarsi di una persona sicura di sé'", targetCase: "Dativo", options: ["уве́ренному челове́ку","уве́ренного челове́ка","уве́ренным челове́ком"], correct: 0, fullRu: "Легко́ доверять уверенному человеку.", fullIt: "È facile fidarsi di una persona sicura di sé." }
    ),
    adj(
      "скро́мный",
      "modesto",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "скро́мный", "подаро́к", "Э́то скро́мный подаро́к.", "Questo è un regalo modesto."),
        af("Femminile", "скро́мная", "зарпла́та", "Э́то скро́мная зарпла́та.", "Questo è uno stipendio modesto."),
        af("Neutro", "скро́мное", "жела́ние", "Э́то скро́мное жела́ние.", "Questo è un desiderio modesto."),
        af("Plurale", "скро́мные", "успе́хи", "Э́то скро́мные успе́хи.", "Questi sono successi modesti."),
      ],
      [
        af("Nominativo", "скро́мный", "успе́х", "Скро́мный успе́х радует.", "Il successo modesto rallegra."),
        af("Genitivo", "скро́много", "успе́ха", "Он доволен скро́много успе́ха.", "È soddisfatto del modesto successo."),
        af("Dativo", "скро́мному", "успе́ху", "Мы рады скро́мному успе́ху.", "Siamo felici del modesto successo."),
        af("Accusativo", "скро́мный", "успе́х", "Мы отметили скро́мный успе́х.", "Abbiamo festeggiato il modesto successo."),
        af("Strumentale", "скро́мным", "успе́хом", "Я доволен скро́мным успе́хом.", "Sono soddisfatto del modesto successo."),
        af("Prepositivo", "скро́мном", "успе́хе", "Мы говорим о скро́мном успе́хе.", "Parliamo del modesto successo."),
      ],
      { promptRu: "Скромный успех радует.", promptIt: "Trasforma allo STRUMENTALE: 'sono soddisfatto del modesto successo'", targetCase: "Strumentale", options: ["скро́мным успе́хом","скро́много успе́ха","скро́мному успе́ху"], correct: 0, fullRu: "Я доволен скромным успехом.", fullIt: "Sono soddisfatto del modesto successo." }
    ),
    adj(
      "серьёзный",
      "serio",
      "Aggettivo con tema in з, accento sulla desinenza -ый; segue le desinenze standard dell'aggettivo duro.",
      [
        af("Maschile", "серьёзный", "вопро́с", "Э́то серьёзный вопро́с.", "Questa è una questione seria."),
        af("Femminile", "серьёзная", "пробле́ма", "Э́то серьёзная пробле́ма.", "Questo è un problema serio."),
        af("Neutro", "серьёзное", "реше́ние", "Э́то серьёзное реше́ние.", "Questa è una decisione seria."),
        af("Plurale", "серьёзные", "намере́ния", "Э́то серьёзные намере́ния.", "Queste sono intenzioni serie."),
      ],
      [
        af("Nominativo", "серьёзный", "вопро́с", "Серьёзный вопро́с требует времени.", "La questione seria richiede tempo."),
        af("Genitivo", "серьёзного", "вопро́са", "Мы избегаем серьёзного вопро́са.", "Evitiamo la questione seria."),
        af("Dativo", "серьёзному", "вопро́су", "Отнесись серьёзно к серьёзному вопро́су.", "Prendi sul serio la questione seria."),
        af("Accusativo", "серьёзный", "вопро́с", "Я задал серьёзный вопро́с.", "Ho posto una questione seria."),
        af("Strumentale", "серьёзным", "вопро́сом", "Я озабочен серьёзным вопро́сом.", "Sono preoccupato per la questione seria."),
        af("Prepositivo", "серьёзном", "вопро́се", "Мы говорим о серьёзном вопро́се.", "Parliamo della questione seria."),
      ],
      { promptRu: "Серьёзный вопро́с требует времени.", promptIt: "Trasforma al PREPOSITIVO: 'parliamo della questione seria'", targetCase: "Prepositivo", options: ["о серьёзном вопро́се","серьёзного вопро́са","серьёзному вопро́су"], correct: 0, fullRu: "Мы говорим о серьёзном вопросе.", fullIt: "Parliamo della questione seria." }
    ),
    adj(
      "споко́йный",
      "calmo, tranquillo",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "споко́йный", "го́лос", "Э́то споко́йный го́лос.", "Questa è una voce calma."),
        af("Femminile", "споко́йная", "атмосфе́ра", "Э́то споко́йная атмосфе́ра.", "Questa è un'atmosfera calma."),
        af("Neutro", "споко́йное", "мо́ре", "Э́то споко́йное мо́ре.", "Questo è un mare calmo."),
        af("Plurale", "споко́йные", "дни", "Э́то споко́йные дни.", "Questi sono giorni tranquilli."),
      ],
      [
        af("Nominativo", "споко́йный", "го́лос", "Споко́йный го́лос успокаивает.", "La voce calma tranquillizza."),
        af("Genitivo", "споко́йного", "го́лоса", "Мне не хватает споко́йного го́лоса.", "Mi manca una voce calma."),
        af("Dativo", "споко́йному", "го́лосу", "Прия́тно слушать споко́йному го́лосу.", "È piacevole ascoltare la voce calma."),
        af("Accusativo", "споко́йный", "го́лос", "Я услышал споко́йный го́лос.", "Ho sentito una voce calma."),
        af("Strumentale", "споко́йным", "го́лосом", "Он говорил споко́йным го́лосом.", "Parlava con voce calma."),
        af("Prepositivo", "споко́йном", "го́лосе", "Есть что-то в э́том споко́йном го́лосе.", "C'è qualcosa in questa voce calma."),
      ],
      { promptRu: "Спокойный голос успокаивает.", promptIt: "Trasforma allo STRUMENTALE: 'parlava con voce calma'", targetCase: "Strumentale", options: ["споко́йным го́лосом","споко́йного го́лоса","споко́йному го́лосу"], correct: 0, fullRu: "Он говорил спокойным голосом.", fullIt: "Parlava con voce calma." }
    ),
    adj(
      "беспоко́йный",
      "inquieto, agitato",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "беспоко́йный", "сон", "Э́то беспоко́йный сон.", "Questo è un sonno agitato."),
        af("Femminile", "беспоко́йная", "ночь", "Э́то беспоко́йная ночь.", "Questa è una notte inquieta."),
        af("Neutro", "беспоко́йное", "де́тство", "Э́то беспоко́йное де́тство.", "Questa è un'infanzia inquieta."),
        af("Plurale", "беспоко́йные", "мы́сли", "Э́то беспоко́йные мы́сли.", "Questi sono pensieri inquieti."),
      ],
      [
        af("Nominativo", "беспоко́йный", "сон", "Беспоко́йный сон мучил его.", "Il sonno agitato lo tormentava."),
        af("Genitivo", "беспоко́йного", "сна", "Он устал от беспоко́йного сна.", "Era stanco del sonno agitato."),
        af("Dativo", "беспоко́йному", "сну", "Причина беспоко́йному сну неясна.", "La causa del sonno agitato non è chiara."),
        af("Accusativo", "беспоко́йный", "сон", "Я видел беспоко́йный сон.", "Ho fatto un sonno agitato."),
        af("Strumentale", "беспоко́йным", "сном", "Он был измучен беспоко́йным сном.", "Era sfinito dal sonno agitato."),
        af("Prepositivo", "беспоко́йном", "сне", "Он говорил о беспоко́йном сне.", "Parlava del sonno agitato."),
      ],
      { promptRu: "Беспокойный сон мучил его.", promptIt: "Trasforma al GENITIVO: 'era stanco del sonno agitato'", targetCase: "Genitivo", options: ["беспоко́йного сна","беспоко́йному сну","беспоко́йным сном"], correct: 0, fullRu: "Он устал от беспокойного сна.", fullIt: "Era stanco del sonno agitato." }
    ),
    adj(
      "вне́шний",
      "esterno",
      "Aggettivo a tema morbido (declinazione soft): al maschile termina in -ий, non -ый, e mantiene -е- nelle desinenze invece di -о-.",
      [
        af("Maschile", "вне́шний", "вид", "Э́то вне́шний вид.", "Questo è l'aspetto esteriore."),
        af("Femminile", "вне́шняя", "поли́тика", "Э́то вне́шняя поли́тика.", "Questa è la politica estera."),
        af("Neutro", "вне́шнее", "влия́ние", "Э́то вне́шнее влия́ние.", "Questa è un'influenza esterna."),
        af("Plurale", "вне́шние", "фа́кторы", "Э́то вне́шние фа́кторы.", "Questi sono fattori esterni."),
      ],
      [
        af("Nominativo", "вне́шний", "вид", "Вне́шний вид обманчив.", "L'aspetto esteriore inganna."),
        af("Genitivo", "вне́шнего", "ви́да", "Не суди по вне́шнего ви́да.", "Non giudicare dall'aspetto esteriore."),
        af("Dativo", "вне́шнему", "ви́ду", "Он придаёт значение вне́шнему ви́ду.", "Dà importanza all'aspetto esteriore."),
        af("Accusativo", "вне́шний", "вид", "Я изменил вне́шний вид.", "Ho cambiato l'aspetto esteriore."),
        af("Strumentale", "вне́шним", "ви́дом", "Я доволен вне́шним ви́дом.", "Sono soddisfatto dell'aspetto esteriore."),
        af("Prepositivo", "вне́шнем", "ви́де", "Дело не во вне́шнем ви́де.", "Non è una questione di aspetto esteriore."),
      ],
      { promptRu: "Внешний вид обманчив.", promptIt: "Trasforma al DATIVO: 'dà importanza all'aspetto esteriore'", targetCase: "Dativo", options: ["вне́шнему ви́ду","вне́шнего ви́да","вне́шним ви́дом"], correct: 0, fullRu: "Он придаёт значение внешнему виду.", fullIt: "Dà importanza all'aspetto esteriore." }
    ),
    adj(
      "вну́тренний",
      "interno",
      "Aggettivo a tema morbido (declinazione soft), come вне́шний: al maschile -ий, con -е- nelle desinenze.",
      [
        af("Maschile", "вну́тренний", "мир", "Э́то вну́тренний мир.", "Questo è il mondo interiore."),
        af("Femminile", "вну́тренняя", "пробле́ма", "Э́то вну́тренняя пробле́ма.", "Questo è un problema interno."),
        af("Neutro", "вну́треннее", "простра́нство", "Э́то вну́треннее простра́нство.", "Questo è lo spazio interno."),
        af("Plurale", "вну́тренние", "дела́", "Э́то вну́тренние дела́.", "Questi sono affari interni."),
      ],
      [
        af("Nominativo", "вну́тренний", "мир", "Вну́тренний мир человека сложен.", "Il mondo interiore dell'uomo è complesso."),
        af("Genitivo", "вну́треннего", "ми́ра", "Она рассказала о вну́треннего ми́ра.", "Ha raccontato del mondo interiore."),
        af("Dativo", "вну́треннему", "ми́ру", "Он уделяет внимание вну́треннему ми́ру.", "Presta attenzione al mondo interiore."),
        af("Accusativo", "вну́тренний", "мир", "Я познал свой вну́тренний мир.", "Ho conosciuto il mio mondo interiore."),
        af("Strumentale", "вну́тренним", "ми́ром", "Я доволен своим вну́тренним ми́ром.", "Sono soddisfatto del mio mondo interiore."),
        af("Prepositivo", "вну́треннем", "ми́ре", "Мы говорим о вну́треннем ми́ре.", "Parliamo del mondo interiore."),
      ],
      { promptRu: "Внутренний мир человека сложен.", promptIt: "Trasforma al PREPOSITIVO: 'parliamo del mondo interiore'", targetCase: "Prepositivo", options: ["о вну́треннем ми́ре","вну́треннего ми́ра","вну́треннему ми́ру"], correct: 0, fullRu: "Мы говорим о внутреннем мире.", fullIt: "Parliamo del mondo interiore." }
    ),
      adj(
      "сло́жный",
      "complesso, difficile",
      "Aggettivo regolare in -ый.",
      [
        af("Maschile", "сло́жный", "вопро́с", "Э́то сло́жный вопро́с.", "Questa è una domanda complessa."),
        af("Femminile", "сло́жная", "зада́ча", "Э́то сло́жная зада́ча.", "Questo è un compito complesso."),
        af("Neutro", "сло́жное", "реше́ние", "Э́то сло́жное реше́ние.", "Questa è una decisione complessa."),
        af("Plurale", "сло́жные", "пробле́мы", "Э́то сло́жные пробле́мы.", "Questi sono problemi complessi."),
      ],
      [
        af("Nominativo", "сло́жный", "вопро́с", "Сло́жный вопро́с реша́ется до́лго.", "La domanda complessa si risolve a lungo."),
        af("Genitivo", "сло́жного", "вопро́са", "У сло́жного вопро́са нет отве́та.", "La domanda complessa non ha risposta."),
        af("Dativo", "сло́жному", "вопро́су", "Мы уделя́ем внима́ние сло́жному вопро́су.", "Dedichiamo attenzione alla domanda complessa."),
        af("Accusativo", "сло́жный", "вопро́с", "Я обсужда́ю сло́жный вопро́с.", "Discuto la domanda complessa."),
        af("Strumentale", "сло́жным", "вопро́сом", "Я занима́юсь сло́жным вопро́сом.", "Mi occupo della domanda complessa."),
        af("Prepositivo", "сло́жном", "вопро́се", "Мы говори́м о сло́жном вопро́се.", "Parliamo della domanda complessa."),
      ],
      { promptRu: "Сло́жный вопро́с реша́ется до́лго.", promptIt: "Trasforma al PREPOSITIVO: 'della domanda complessa'", targetCase: "Prepositivo", options: ["сло́жном вопро́се","сло́жный вопро́с","сло́жного вопро́са"], correct: 0, fullRu: "Мы говори́м о сло́жном вопро́се.", fullIt: "Parliamo della domanda complessa." }
    ),
    adj(
      "интере́сный",
      "interessante",
      "Aggettivo regolare in -ый, non declinato ancora nella sezione base.",
      [
        af("Maschile", "интере́сный", "фильм", "Э́то интере́сный фильм.", "Questo è un film interessante."),
        af("Femminile", "интере́сная", "кни́га", "Э́то интере́сная кни́га.", "Questo è un libro interessante."),
        af("Neutro", "интере́сное", "собы́тие", "Э́то интере́сное собы́тие.", "Questo è un evento interessante."),
        af("Plurale", "интере́сные", "лю́ди", "Э́то интере́сные лю́ди.", "Queste sono persone interessanti."),
      ],
      [
        af("Nominativo", "интере́сный", "фильм", "Интере́сный фильм идёт в кино́.", "Il film interessante è al cinema."),
        af("Genitivo", "интере́сного", "фи́льма", "Жду́ нача́ла интере́сного фи́льма.", "Aspetto l'inizio del film interessante."),
        af("Dativo", "интере́сному", "фи́льму", "Мы гото́вимся к интере́сному фи́льму.", "Ci prepariamo al film interessante."),
        af("Accusativo", "интере́сный", "фильм", "Я смотрю́ интере́сный фильм.", "Guardo il film interessante."),
        af("Strumentale", "интере́сным", "фи́льмом", "Я нас насла́ждаюсь интере́сным фи́льмом.", "Mi godo il film interessante."),
        af("Prepositivo", "интере́сном", "фи́льме", "Мы говори́м об интере́сном фи́льме.", "Parliamo del film interessante."),
      ],
      { promptRu: "Интере́сный фильм идёт в кино́.", promptIt: "Trasforma al GENITIVO: 'del film interessante'", targetCase: "Genitivo", options: ["интере́сного фи́льма","интере́сный фильм","интере́сном фи́льме"], correct: 0, fullRu: "Жду́ нача́ла интере́сного фи́льма.", fullIt: "Aspetto l'inizio del film interessante." }
    ),
  ],
  B2: [
    adj(
      "эффекти́вный",
      "efficace",
      "Aggettivo regolare a tema duro, accento sulla desinenza -и́вный.",
      [
        af("Maschile", "эффекти́вный", "ме́тод", "Э́то эффекти́вный ме́тод.", "Questo è un metodo efficace."),
        af("Femminile", "эффекти́вная", "страте́гия", "Э́то эффекти́вная страте́гия.", "Questa è una strategia efficace."),
        af("Neutro", "эффекти́вное", "реше́ние", "Э́то эффекти́вное реше́ние.", "Questa è una soluzione efficace."),
        af("Plurale", "эффекти́вные", "ме́тоды", "Э́то эффекти́вные ме́тоды.", "Questi sono metodi efficaci."),
      ],
      [
        af("Nominativo", "эффекти́вный", "ме́тод", "Эффекти́вный ме́тод работает.", "Il metodo efficace funziona."),
        af("Genitivo", "эффекти́вного", "ме́тода", "Мы ищем эффекти́вного ме́тода.", "Cerchiamo un metodo efficace."),
        af("Dativo", "эффекти́вному", "ме́тоду", "Мы следуем эффекти́вному ме́тоду.", "Seguiamo il metodo efficace."),
        af("Accusativo", "эффекти́вный", "ме́тод", "Я нашёл эффекти́вный ме́тод.", "Ho trovato un metodo efficace."),
        af("Strumentale", "эффекти́вным", "ме́тодом", "Я доволен эффекти́вным ме́тодом.", "Sono soddisfatto del metodo efficace."),
        af("Prepositivo", "эффекти́вном", "ме́тоде", "Мы говорим об эффекти́вном ме́тоде.", "Parliamo del metodo efficace."),
      ],
      { promptRu: "Эффективный метод работает.", promptIt: "Trasforma al GENITIVO: 'cerchiamo un metodo efficace'", targetCase: "Genitivo", options: ["эффекти́вного ме́тода","эффекти́вному ме́тоду","эффекти́вным ме́тодом"], correct: 0, fullRu: "Мы ищем эффективного метода.", fullIt: "Cerchiamo un metodo efficace." }
    ),
    adj(
      "противоречи́вый",
      "contraddittorio",
      "Aggettivo con tema in ч; segue regole standard di declinazione dura, accento sulla desinenza.",
      [
        af("Maschile", "противоречи́вый", "хара́ктер", "Э́то противоречи́вый хара́ктер.", "Questo è un carattere contraddittorio."),
        af("Femminile", "противоречи́вая", "информа́ция", "Э́то противоречи́вая информа́ция.", "Questa è un'informazione contraddittoria."),
        af("Neutro", "противоречи́вое", "мне́ние", "Э́то противоречи́вое мне́ние.", "Questa è un'opinione contraddittoria."),
        af("Plurale", "противоречи́вые", "да́нные", "Э́то противоречи́вые да́нные.", "Questi sono dati contraddittori."),
      ],
      [
        af("Nominativo", "противоречи́вый", "отзы́в", "Противоречи́вый отзы́в удивил.", "La recensione contraddittoria ha sorpreso."),
        af("Genitivo", "противоречи́вого", "отзы́ва", "Из-за противоречи́вого отзы́ва я засомневался.", "A causa della recensione contraddittoria ho avuto dubbi."),
        af("Dativo", "противоречи́вому", "отзы́ву", "Не стоит доверять противоречи́вому отзы́ву.", "Non conviene fidarsi della recensione contraddittoria."),
        af("Accusativo", "противоречи́вый", "отзы́в", "Я прочитал противоречи́вый отзы́в.", "Ho letto una recensione contraddittoria."),
        af("Strumentale", "противоречи́вым", "отзы́вом", "Я озадачен противоречи́вым отзы́вом.", "Sono perplesso per la recensione contraddittoria."),
        af("Prepositivo", "противоречи́вом", "отзы́ве", "Мы говорим о противоречи́вом отзы́ве.", "Parliamo della recensione contraddittoria."),
      ],
      { promptRu: "Противоречивый отзыв удивил.", promptIt: "Trasforma allo STRUMENTALE: 'sono perplesso per la recensione contraddittoria'", targetCase: "Strumentale", options: ["противоречи́вым отзы́вом","противоречи́вого отзы́ва","противоречи́вому отзы́ву"], correct: 0, fullRu: "Я озадачен противоречивым отзывом.", fullIt: "Sono perplesso per la recensione contraddittoria." }
    ),
    adj(
      "необходи́мый",
      "necessario",
      "Aggettivo regolare a tema duro, accento sulla desinenza -и́мый.",
      [
        af("Maschile", "необходи́мый", "шаг", "Э́то необходи́мый шаг.", "Questo è un passo necessario."),
        af("Femminile", "необходи́мая", "ме́ра", "Э́то необходи́мая ме́ра.", "Questa è una misura necessaria."),
        af("Neutro", "необходи́мое", "усло́вие", "Э́то необходи́мое усло́вие.", "Questa è una condizione necessaria."),
        af("Plurale", "необходи́мые", "ресу́рсы", "Э́то необходи́мые ресу́рсы.", "Queste sono risorse necessarie."),
      ],
      [
        af("Nominativo", "необходи́мый", "докуме́нт", "Необходи́мый докуме́нт готов.", "Il documento necessario è pronto."),
        af("Genitivo", "необходи́мого", "докуме́нта", "У меня нет необходи́мого докуме́нта.", "Non ho il documento necessario."),
        af("Dativo", "необходи́мому", "докуме́нту", "Мы придаём значение необходи́мому докуме́нту.", "Diamo importanza al documento necessario."),
        af("Accusativo", "необходи́мый", "докуме́нт", "Я подготовил необходи́мый докуме́нт.", "Ho preparato il documento necessario."),
        af("Strumentale", "необходи́мым", "докуме́нтом", "Я обладаю необходи́мым докуме́нтом.", "Dispongo del documento necessario."),
        af("Prepositivo", "необходи́мом", "докуме́нте", "Речь идёт о необходи́мом докуме́нте.", "Si tratta del documento necessario."),
      ],
      { promptRu: "Необходимый докуме́нт готов.", promptIt: "Trasforma al GENITIVO: 'non ho il documento necessario'", targetCase: "Genitivo", options: ["необходи́мого докуме́нта","необходи́мому докуме́нту","необходи́мым докуме́нтом"], correct: 0, fullRu: "У меня нет необходимого документа.", fullIt: "Non ho il documento necessario." }
    ),
    adj(
      "достато́чный",
      "sufficiente",
      "Aggettivo regolare a tema duro, accento sulla desinenza -о́чный.",
      [
        af("Maschile", "достато́чный", "о́пыт", "Э́то достато́чный о́пыт.", "Questa è un'esperienza sufficiente."),
        af("Femminile", "достато́чная", "су́мма", "Э́то достато́чная су́мма.", "Questa è una somma sufficiente."),
        af("Neutro", "достато́чное", "коли́чество", "Э́то достато́чное коли́чество.", "Questa è una quantità sufficiente."),
        af("Plurale", "достато́чные", "основа́ния", "Э́то достато́чные основа́ния.", "Queste sono ragioni sufficienti."),
      ],
      [
        af("Nominativo", "достато́чный", "о́пыт", "Достато́чный о́пыт важен.", "L'esperienza sufficiente è importante."),
        af("Genitivo", "достато́чного", "о́пыта", "У меня нет достато́чного о́пыта.", "Non ho esperienza sufficiente."),
        af("Dativo", "достато́чному", "о́пыту", "Мы доверяем достато́чному о́пыту.", "Ci fidiamo dell'esperienza sufficiente."),
        af("Accusativo", "достато́чный", "о́пыт", "Я получил достато́чный о́пыт.", "Ho ottenuto esperienza sufficiente."),
        af("Strumentale", "достато́чным", "о́пытом", "Я обладаю достато́чным о́пытом.", "Dispongo di esperienza sufficiente."),
        af("Prepositivo", "достато́чном", "о́пыте", "Речь о достато́чном о́пыте.", "Si parla di esperienza sufficiente."),
      ],
      { promptRu: "Достаточный опыт важен.", promptIt: "Trasforma allo STRUMENTALE: 'dispongo di esperienza sufficiente'", targetCase: "Strumentale", options: ["достато́чным о́пытом","достато́чного о́пыта","достато́чному о́пыту"], correct: 0, fullRu: "Я обладаю достаточным опытом.", fullIt: "Dispongo di esperienza sufficiente." }
    ),
    adj(
      "вы́годный",
      "vantaggioso, conveniente",
      "Aggettivo regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "вы́годный", "контра́кт", "Э́то вы́годный контра́кт.", "Questo è un contratto vantaggioso."),
        af("Femminile", "вы́годная", "сде́лка", "Э́то вы́годная сде́лка.", "Questo è un affare vantaggioso."),
        af("Neutro", "вы́годное", "предложе́ние", "Э́то вы́годное предложе́ние.", "Questa è un'offerta vantaggiosa."),
        af("Plurale", "вы́годные", "усло́вия", "Э́то вы́годные усло́вия.", "Queste sono condizioni vantaggiose."),
      ],
      [
        af("Nominativo", "вы́годный", "контра́кт", "Вы́годный контра́кт подписан.", "Il contratto vantaggioso è firmato."),
        af("Genitivo", "вы́годного", "контра́кта", "Мы ищем вы́годного контра́кта.", "Cerchiamo un contratto vantaggioso."),
        af("Dativo", "вы́годному", "контра́кту", "Мы рады вы́годному контра́кту.", "Siamo felici del contratto vantaggioso."),
        af("Accusativo", "вы́годный", "контра́кт", "Я подписал вы́годный контра́кт.", "Ho firmato un contratto vantaggioso."),
        af("Strumentale", "вы́годным", "контра́ктом", "Я доволен вы́годным контра́ктом.", "Sono soddisfatto del contratto vantaggioso."),
        af("Prepositivo", "вы́годном", "контра́кте", "Мы говорим о вы́годном контра́кте.", "Parliamo del contratto vantaggioso."),
      ],
      { promptRu: "Выгодный контракт подписан.", promptIt: "Trasforma al PREPOSITIVO: 'parliamo del contratto vantaggioso'", targetCase: "Prepositivo", options: ["о вы́годном контра́кте","вы́годного контра́кта","вы́годному контра́кту"], correct: 0, fullRu: "Мы говорим о выгодном контракте.", fullIt: "Parliamo del contratto vantaggioso." }
    ),
    adj(
      "обосно́ванный",
      "fondato, giustificato",
      "Aggettivo participiale regolare a tema duro, accento sulla desinenza.",
      [
        af("Maschile", "обосно́ванный", "аргуме́нт", "Э́то обосно́ванный аргуме́нт.", "Questo è un argomento fondato."),
        af("Femminile", "обосно́ванная", "кри́тика", "Э́то обосно́ванная кри́тика.", "Questa è una critica fondata."),
        af("Neutro", "обосно́ванное", "реше́ние", "Э́то обосно́ванное реше́ние.", "Questa è una decisione fondata."),
        af("Plurale", "обосно́ванные", "опасе́ния", "Э́то обосно́ванные опасе́ния.", "Questi sono timori fondati."),
      ],
      [
        af("Nominativo", "обосно́ванный", "аргуме́нт", "Обосно́ванный аргуме́нт убедил всех.", "L'argomento fondato ha convinto tutti."),
        af("Genitivo", "обосно́ванного", "аргуме́нта", "У него не было обосно́ванного аргуме́нта.", "Non aveva un argomento fondato."),
        af("Dativo", "обосно́ванному", "аргуме́нту", "Мы доверяем обосно́ванному аргуме́нту.", "Ci fidiamo dell'argomento fondato."),
        af("Accusativo", "обосно́ванный", "аргуме́нт", "Я привёл обосно́ванный аргуме́нт.", "Ho portato un argomento fondato."),
        af("Strumentale", "обосно́ванным", "аргуме́нтом", "Я убеждён обосно́ванным аргуме́нтом.", "Sono convinto dall'argomento fondato."),
        af("Prepositivo", "обосно́ванном", "аргуме́нте", "Речь идёт об обосно́ванном аргуме́нте.", "Si tratta dell'argomento fondato."),
      ],
      { promptRu: "Обоснованный аргумент убедил всех.", promptIt: "Trasforma allo STRUMENTALE: 'sono convinto dall'argomento fondato'", targetCase: "Strumentale", options: ["обосно́ванным аргуме́нтом","обосно́ванного аргуме́нта","обосно́ванному аргуме́нту"], correct: 0, fullRu: "Я убеждён обоснованным аргументом.", fullIt: "Sono convinto dall'argomento fondato." }
    ),
    adj(
      "неизбе́жный",
      "inevitabile",
      "Aggettivo regolare a tema duro, accento sulla desinenza.",
      [
        af("Maschile", "неизбе́жный", "конфли́кт", "Э́то неизбе́жный конфли́кт.", "Questo è un conflitto inevitabile."),
        af("Femminile", "неизбе́жная", "ошибка", "Э́то неизбе́жная ошибка.", "Questo è un errore inevitabile."),
        af("Neutro", "неизбе́жное", "измене́ние", "Э́то неизбе́жное измене́ние.", "Questo è un cambiamento inevitabile."),
        af("Plurale", "неизбе́жные", "после́дствия", "Э́то неизбе́жные после́дствия.", "Queste sono conseguenze inevitabili."),
      ],
      [
        af("Nominativo", "неизбе́жный", "конфли́кт", "Неизбе́жный конфли́кт разразился.", "Il conflitto inevitabile è scoppiato."),
        af("Genitivo", "неизбе́жного", "конфли́кта", "Мы боялись неизбе́жного конфли́кта.", "Temevamo il conflitto inevitabile."),
        af("Dativo", "неизбе́жному", "конфли́кту", "Мы готовы к неизбе́жному конфли́кту.", "Siamo pronti al conflitto inevitabile."),
        af("Accusativo", "неизбе́жный", "конфли́кт", "Мы предвидели неизбе́жный конфли́кт.", "Abbiamo previsto il conflitto inevitabile."),
        af("Strumentale", "неизбе́жным", "конфли́ктом", "Мы столкнулись с неизбе́жным конфли́ктом.", "Ci siamo scontrati con il conflitto inevitabile."),
        af("Prepositivo", "неизбе́жном", "конфли́кте", "Мы говорим о неизбе́жном конфли́кте.", "Parliamo del conflitto inevitabile."),
      ],
      { promptRu: "Неизбежный конфликт разразился.", promptIt: "Trasforma al DATIVO: 'siamo pronti al conflitto inevitabile'", targetCase: "Dativo", options: ["неизбе́жному конфли́кту","неизбе́жного конфли́кта","неизбе́жным конфли́ктом"], correct: 0, fullRu: "Мы готовы к неизбежному конфликту.", fullIt: "Siamo pronti al conflitto inevitabile." }
    ),
      adj(
      "серьёзный",
      "serio",
      "Aggettivo regolare in -ый.",
      [
        af("Maschile", "серьёзный", "разгово́р", "Э́то серьёзный разгово́р.", "Questa è una conversazione seria."),
        af("Femminile", "серьёзная", "пробле́ма", "Э́то серьёзная пробле́ма.", "Questo è un problema serio."),
        af("Neutro", "серьёзное", "реше́ние", "Э́то серьёзное реше́ние.", "Questa è una decisione seria."),
        af("Plurale", "серьёзные", "после́дствия", "Э́то серьёзные после́дствия.", "Queste sono conseguenze serie."),
      ],
      [
        af("Nominativo", "серьёзный", "разгово́р", "Серьёзный разгово́р начина́ется.", "La conversazione seria inizia."),
        af("Genitivo", "серьёзного", "разгово́ра", "Мы избега́ем серьёзного разгово́ра.", "Evitiamo la conversazione seria."),
        af("Dativo", "серьёзному", "разгово́ру", "Мы гото́вимся к серьёзному разгово́ру.", "Ci prepariamo alla conversazione seria."),
        af("Accusativo", "серьёзный", "разгово́р", "Я начина́ю серьёзный разгово́р.", "Inizio la conversazione seria."),
        af("Strumentale", "серьёзным", "разгово́ром", "Я озабо́чен серьёзным разгово́ром.", "Sono preoccupato per la conversazione seria."),
        af("Prepositivo", "серьёзном", "разгово́ре", "Мы ду́маем о серьёзном разгово́ре.", "Pensiamo alla conversazione seria."),
      ],
      { promptRu: "Серьёзный разгово́р начина́ется.", promptIt: "Trasforma al DATIVO: 'alla conversazione seria'", targetCase: "Dativo", options: ["серьёзному разгово́ру","серьёзный разгово́р","серьёзного разгово́ра"], correct: 0, fullRu: "Мы гото́вимся к серьёзному разгово́ру.", fullIt: "Ci prepariamo alla conversazione seria." }
    ),
    adj(
      "необходи́мый",
      "necessario",
      "Aggettivo regolare in -ый, registro formale.",
      [
        af("Maschile", "необходи́мый", "шаг", "Э́то необходи́мый шаг.", "Questo è un passo necessario."),
        af("Femminile", "необходи́мая", "ме́ра", "Э́то необходи́мая ме́ра.", "Questa è una misura necessaria."),
        af("Neutro", "необходи́мое", "усло́вие", "Э́то необходи́мое усло́вие.", "Questa è una condizione necessaria."),
        af("Plurale", "необходи́мые", "измене́ния", "Э́то необходи́мые измене́ния.", "Questi sono cambiamenti necessari."),
      ],
      [
        af("Nominativo", "необходи́мый", "шаг", "Необходи́мый шаг уже́ сде́лан.", "Il passo necessario è già stato fatto."),
        af("Genitivo", "необходи́мого", "ша́га", "Мы ждём необходи́мого ша́га.", "Aspettiamo il passo necessario."),
        af("Dativo", "необходи́мому", "ша́гу", "Гото́вимся к необходи́мому ша́гу.", "Ci prepariamo al passo necessario."),
        af("Accusativo", "необходи́мый", "шаг", "Мы де́лаем необходи́мый шаг.", "Facciamo il passo necessario."),
        af("Strumentale", "необходи́мым", "ша́гом", "Дово́лен необходи́мым ша́гом.", "Soddisfatto del passo necessario."),
        af("Prepositivo", "необходи́мом", "ша́ге", "Говори́м о необходи́мом ша́ге.", "Parliamo del passo necessario."),
      ],
      { promptRu: "Необходи́мый шаг уже́ сде́лан.", promptIt: "Trasforma al PREPOSITIVO: 'del passo necessario'", targetCase: "Prepositivo", options: ["необходи́мом ша́ге","необходи́мый шаг","необходи́мого ша́га"], correct: 0, fullRu: "Говори́м о необходи́мом ша́ге.", fullIt: "Parliamo del passo necessario." }
    ),
  ],
  C1: [
    adj(
      "неопровержи́мый",
      "inconfutabile",
      "Aggettivo regolare a tema duro, accento sulla desinenza.",
      [
        af("Maschile", "неопровержи́мый", "факт", "Э́то неопровержи́мый факт.", "Questo è un fatto inconfutabile."),
        af("Femminile", "неопровержи́мая", "ули́ка", "Э́то неопровержи́мая ули́ка.", "Questa è una prova inconfutabile."),
        af("Neutro", "неопровержи́мое", "доказа́тельство", "Э́то неопровержи́мое доказа́тельство.", "Questa è una prova inconfutabile."),
        af("Plurale", "неопровержи́мые", "фа́кты", "Э́то неопровержи́мые фа́кты.", "Questi sono fatti inconfutabili."),
      ],
      [
        af("Nominativo", "неопровержи́мый", "факт", "Неопровержи́мый факт остаётся фактом.", "Il fatto inconfutabile resta un fatto."),
        af("Genitivo", "неопровержи́мого", "фа́кта", "У нас нет неопровержи́мого фа́кта.", "Non abbiamo un fatto inconfutabile."),
        af("Dativo", "неопровержи́мому", "фа́кту", "Мы доверяем неопровержи́мому фа́кту.", "Ci fidiamo del fatto inconfutabile."),
        af("Accusativo", "неопровержи́мый", "факт", "Я привёл неопровержи́мый факт.", "Ho portato un fatto inconfutabile."),
        af("Strumentale", "неопровержи́мым", "фа́ктом", "Я убеждён неопровержи́мым фа́ктом.", "Sono convinto dal fatto inconfutabile."),
        af("Prepositivo", "неопровержи́мом", "фа́кте", "Речь идёт о неопровержи́мом фа́кте.", "Si tratta del fatto inconfutabile."),
      ],
      { promptRu: "Неопровержимый факт остаётся фактом.", promptIt: "Trasforma allo STRUMENTALE: 'sono convinto dal fatto inconfutabile'", targetCase: "Strumentale", options: ["неопровержи́мым фа́ктом","неопровержи́мого фа́кта","неопровержи́мому фа́кту"], correct: 0, fullRu: "Я убеждён неопровержимым фактом.", fullIt: "Sono convinto dal fatto inconfutabile." }
    ),
    adj(
      "всеобъе́млющий",
      "esaustivo, onnicomprensivo",
      "Aggettivo participiale a tema morbido (in -ий), accento sulla radice.",
      [
        af("Maschile", "всеобъе́млющий", "подхо́д", "Э́то всеобъе́млющий подхо́д.", "Questo è un approccio esaustivo."),
        af("Femminile", "всеобъе́млющая", "рефо́рма", "Э́то всеобъе́млющая рефо́рма.", "Questa è una riforma esaustiva."),
        af("Neutro", "всеобъе́млющее", "реше́ние", "Э́то всеобъе́млющее реше́ние.", "Questa è una soluzione esaustiva."),
        af("Plurale", "всеобъе́млющие", "измене́ния", "Э́то всеобъе́млющие измене́ния.", "Questi sono cambiamenti esaustivi."),
      ],
      [
        af("Nominativo", "всеобъе́млющий", "подхо́д", "Всеобъе́млющий подхо́д эффективен.", "L'approccio esaustivo è efficace."),
        af("Genitivo", "всеобъе́млющего", "подхо́да", "Мы придерживаемся всеобъе́млющего подхо́да.", "Ci atteniamo all'approccio esaustivo."),
        af("Dativo", "всеобъе́млющему", "подхо́ду", "Мы следуем всеобъе́млющему подхо́ду.", "Seguiamo l'approccio esaustivo."),
        af("Accusativo", "всеобъе́млющий", "подхо́д", "Мы выбрали всеобъе́млющий подхо́д.", "Abbiamo scelto l'approccio esaustivo."),
        af("Strumentale", "всеобъе́млющим", "подхо́дом", "Мы дово́льны всеобъе́млющим подхо́дом.", "Siamo soddisfatti dell'approccio esaustivo."),
        af("Prepositivo", "всеобъе́млющем", "подхо́де", "Речь о всеобъе́млющем подхо́де.", "Si parla dell'approccio esaustivo."),
      ],
      { promptRu: "Всеобъемлющий подход эффективен.", promptIt: "Trasforma al DATIVO: 'seguiamo l'approccio esaustivo'", targetCase: "Dativo", options: ["всеобъе́млющему подхо́ду","всеобъе́млющего подхо́да","всеобъе́млющим подхо́дом"], correct: 0, fullRu: "Мы следуем всеобъемлющему подходу.", fullIt: "Seguiamo l'approccio esaustivo." }
    ),
    adj(
      "уника́льный",
      "unico, peculiare",
      "Aggettivo regolare a tema duro, accento sulla desinenza.",
      [
        af("Maschile", "уника́льный", "слу́чай", "Э́то уника́льный слу́чай.", "Questo è un caso unico."),
        af("Femminile", "уника́льная", "возмо́жность", "Э́то уника́льная возмо́жность.", "Questa è un'opportunità unica."),
        af("Neutro", "уника́льное", "явле́ние", "Э́то уника́льное явле́ние.", "Questo è un fenomeno unico."),
        af("Plurale", "уника́льные", "свойства", "Э́то уника́льные свойства.", "Queste sono proprietà uniche."),
      ],
      [
        af("Nominativo", "уника́льный", "слу́чай", "Уника́льный слу́чай заинтересовал учёных.", "Il caso unico ha interessato gli scienziati."),
        af("Genitivo", "уника́льного", "слу́чая", "Мы ждём уника́льного слу́чая.", "Aspettiamo un caso unico."),
        af("Dativo", "уника́льному", "слу́чаю", "Учёные уделили внимание уника́льному слу́чаю.", "Gli scienziati hanno prestato attenzione al caso unico."),
        af("Accusativo", "уника́льный", "слу́чай", "Мы изучили уника́льный слу́чай.", "Abbiamo studiato il caso unico."),
        af("Strumentale", "уника́льным", "слу́чаем", "Учёные заинтересовались уника́льным слу́чаем.", "Gli scienziati si sono interessati al caso unico."),
        af("Prepositivo", "уника́льном", "слу́чае", "Статья о уника́льном слу́чае.", "L'articolo parla del caso unico."),
      ],
      { promptRu: "Уникальный случай заинтересовал учёных.", promptIt: "Trasforma allo STRUMENTALE: 'gli scienziati si sono interessati al caso unico'", targetCase: "Strumentale", options: ["уника́льным слу́чаем","уника́льного слу́чая","уника́льному слу́чаю"], correct: 0, fullRu: "Учёные заинтересовались уникальным случаем.", fullIt: "Gli scienziati si sono interessati al caso unico." }
    ),
    adj(
      "неопределённый",
      "indeterminato, incerto",
      "Aggettivo participiale regolare a tema duro, accento sulla desinenza.",
      [
        af("Maschile", "неопределённый", "срок", "Э́то неопределённый срок.", "Questo è un termine indeterminato."),
        af("Femminile", "неопределённая", "ситуа́ция", "Э́то неопределённая ситуа́ция.", "Questa è una situazione incerta."),
        af("Neutro", "неопределённое", "бу́дущее", "Э́то неопределённое бу́дущее.", "Questo è un futuro incerto."),
        af("Plurale", "неопределённые", "усло́вия", "Э́то неопределённые усло́вия.", "Queste sono condizioni incerte."),
      ],
      [
        af("Nominativo", "неопределённый", "срок", "Неопределённый срок трево́жит.", "Il termine indeterminato preoccupa."),
        af("Genitivo", "неопределённого", "сро́ка", "Из-за неопределённого сро́ка мы ждём.", "A causa del termine indeterminato aspettiamo."),
        af("Dativo", "неопределённому", "сро́ку", "Мы привыкли к неопределённому сро́ку.", "Ci siamo abituati al termine indeterminato."),
        af("Accusativo", "неопределённый", "срок", "Прое́кт отложи́ли на неопределённый срок.", "Il progetto è stato rinviato a data da destinarsi."),
        af("Strumentale", "неопределённым", "сро́ком", "Мы недовольны неопределённым сро́ком.", "Non siamo soddisfatti del termine indeterminato."),
        af("Prepositivo", "неопределённом", "сро́ке", "Речь идёт о неопределённом сро́ке.", "Si tratta del termine indeterminato."),
      ],
      { promptRu: "Неопределённый срок тревожит.", promptIt: "Trasforma all'ACCUSATIVO: 'il progetto è stato rinviato a data da destinarsi'", targetCase: "Accusativo", options: ["на неопределённый срок","неопределённого сро́ка","неопределённом сро́ке"], correct: 0, fullRu: "Проект отложили на неопределённый срок.", fullIt: "Il progetto è stato rinviato a data da destinarsi." }
    ),
    adj(
      "вырази́тельный",
      "espressivo",
      "Aggettivo regolare a tema duro, accento sulla desinenza -и́тельный.",
      [
        af("Maschile", "вырази́тельный", "жест", "Э́то вырази́тельный жест.", "Questo è un gesto espressivo."),
        af("Femminile", "вырази́тельная", "мими́ка", "Э́то вырази́тельная мими́ка.", "Questa è una mimica espressiva."),
        af("Neutro", "вырази́тельное", "лицо́", "Э́то вырази́тельное лицо́.", "Questo è un volto espressivo."),
        af("Plurale", "вырази́тельные", "глаза́", "Э́то вырази́тельные глаза́.", "Questi sono occhi espressivi."),
      ],
      [
        af("Nominativo", "вырази́тельный", "жест", "Вырази́тельный жест сказал всё.", "Il gesto espressivo ha detto tutto."),
        af("Genitivo", "вырази́тельного", "же́ста", "Значение вырази́тельного же́ста было ясно.", "Il significato del gesto espressivo era chiaro."),
        af("Dativo", "вырази́тельному", "же́сту", "Он придал значение вырази́тельному же́сту.", "Ha dato importanza al gesto espressivo."),
        af("Accusativo", "вырази́тельный", "жест", "Я заметил вырази́тельный жест.", "Ho notato un gesto espressivo."),
        af("Strumentale", "вырази́тельным", "же́стом", "Он сопроводил речь вырази́тельным же́стом.", "Ha accompagnato il discorso con un gesto espressivo."),
        af("Prepositivo", "вырази́тельном", "же́сте", "Мы говорим о вырази́тельном же́сте.", "Parliamo del gesto espressivo."),
      ],
      { promptRu: "Выразительный жест сказал всё.", promptIt: "Trasforma allo STRUMENTALE: 'ha accompagnato il discorso con un gesto espressivo'", targetCase: "Strumentale", options: ["вырази́тельным же́стом","вырази́тельного же́ста","вырази́тельному же́сту"], correct: 0, fullRu: "Он сопроводил речь выразительным жестом.", fullIt: "Ha accompagnato il discorso con un gesto espressivo." }
    ),
    adj(
      "глубоча́йший",
      "profondissimo (superlativo)",
      "Forma superlativa sintetica dell'aggettivo глубо́кий (profondo): tema in ч, segue le desinenze standard con и al posto di ы.",
      [
        af("Maschile", "глубоча́йший", "смысл", "Э́то глубоча́йший смысл.", "Questo è un senso profondissimo."),
        af("Femminile", "глубоча́йшая", "благода́рность", "Э́то глубоча́йшая благода́рность.", "Questa è una gratitudine profondissima."),
        af("Neutro", "глубоча́йшее", "уваже́ние", "Э́то глубоча́йшее уваже́ние.", "Questo è un rispetto profondissimo."),
        af("Plurale", "глубоча́йшие", "измене́ния", "Э́то глубоча́йшие измене́ния.", "Questi sono cambiamenti profondissimi."),
      ],
      [
        af("Nominativo", "глубоча́йший", "смысл", "Глубоча́йший смысл скрыт в этих словах.", "Il senso profondissimo è nascosto in queste parole."),
        af("Genitivo", "глубоча́йшего", "смы́сла", "Мы ищем глубоча́йшего смы́сла.", "Cerchiamo il senso profondissimo."),
        af("Dativo", "глубоча́йшему", "смы́слу", "Мы придаём значение глубоча́йшему смы́слу.", "Diamo importanza al senso profondissimo."),
        af("Accusativo", "глубоча́йший", "смысл", "Я понял глубоча́йший смысл.", "Ho compreso il senso profondissimo."),
        af("Strumentale", "глубоча́йшим", "смы́слом", "Текст наполнен глубоча́йшим смы́слом.", "Il testo è pieno di un senso profondissimo."),
        af("Prepositivo", "глубоча́йшем", "смы́сле", "Речь о глубоча́йшем смы́сле.", "Si parla del senso profondissimo."),
      ],
      { promptRu: "Глубочайший смысл скрыт в этих словах.", promptIt: "Trasforma allo STRUMENTALE: 'il testo è pieno di un senso profondissimo'", targetCase: "Strumentale", options: ["глубоча́йшим смы́слом","глубоча́йшего смы́сла","глубоча́йшему смы́слу"], correct: 0, fullRu: "Текст наполнен глубочайшим смыслом.", fullIt: "Il testo è pieno di un senso profondissimo." }
    ),
    adj(
      "взаимовы́годный",
      "reciprocamente vantaggioso",
      "Aggettivo composto regolare a tema duro, accento sulla radice.",
      [
        af("Maschile", "взаимовы́годный", "прое́кт", "Э́то взаимовы́годный прое́кт.", "Questo è un progetto reciprocamente vantaggioso."),
        af("Femminile", "взаимовы́годная", "схе́ма", "Э́то взаимовы́годная схе́ма.", "Questo è uno schema reciprocamente vantaggioso."),
        af("Neutro", "взаимовы́годное", "сотру́дничество", "Э́то взаимовы́годное сотру́дничество.", "Questa è una collaborazione reciprocamente vantaggiosa."),
        af("Plurale", "взаимовы́годные", "усло́вия", "Э́то взаимовы́годные усло́вия.", "Queste sono condizioni reciprocamente vantaggiose."),
      ],
      [
        af("Nominativo", "взаимовы́годный", "прое́кт", "Взаимовы́годный прое́кт одобрен.", "Il progetto reciprocamente vantaggioso è approvato."),
        af("Genitivo", "взаимовы́годного", "прое́кта", "Мы ищем взаимовы́годного прое́кта.", "Cerchiamo un progetto reciprocamente vantaggioso."),
        af("Dativo", "взаимовы́годному", "прое́кту", "Мы стремимся к взаимовы́годному прое́кту.", "Miriamo a un progetto reciprocamente vantaggioso."),
        af("Accusativo", "взаимовы́годный", "прое́кт", "Мы предложили взаимовы́годный прое́кт.", "Abbiamo proposto un progetto reciprocamente vantaggioso."),
        af("Strumentale", "взаимовы́годным", "прое́ктом", "Обе стороны дово́льны взаимовы́годным прое́ктом.", "Entrambe le parti sono soddisfatte del progetto reciprocamente vantaggioso."),
        af("Prepositivo", "взаимовы́годном", "прое́кте", "Речь идёт о взаимовы́годном прое́кте.", "Si tratta del progetto reciprocamente vantaggioso."),
      ],
      { promptRu: "Взаимовыгодный проект одобрен.", promptIt: "Trasforma allo STRUMENTALE: 'entrambe le parti sono soddisfatte del progetto reciprocamente vantaggioso'", targetCase: "Strumentale", options: ["взаимовы́годным прое́ктом","взаимовы́годного прое́кта","взаимовы́годному прое́кту"], correct: 0, fullRu: "Обе стороны дово́льны взаимовыгодным проектом.", fullIt: "Entrambe le parti sono soddisfatte del progetto reciprocamente vantaggioso." }
    ),
      adj(
      "убеди́тельный",
      "convincente",
      "Aggettivo regolare in -ый, registro formale.",
      [
        af("Maschile", "убеди́тельный", "аргуме́нт", "Э́то убеди́тельный аргуме́нт.", "Questo è un argomento convincente."),
        af("Femminile", "убеди́тельная", "побе́да", "Э́то убеди́тельная побе́да.", "Questa è una vittoria convincente."),
        af("Neutro", "убеди́тельное", "доказа́тельство", "Э́то убеди́тельное доказа́тельство.", "Questa è una prova convincente."),
        af("Plurale", "убеди́тельные", "аргуме́нты", "Э́то убеди́тельные аргуме́нты.", "Questi sono argomenti convincenti."),
      ],
      [
        af("Nominativo", "убеди́тельный", "аргуме́нт", "Убеди́тельный аргуме́нт реши́л спор.", "L'argomento convincente ha risolto la disputa."),
        af("Genitivo", "убеди́тельного", "аргуме́нта", "У него́ нет убеди́тельного аргуме́нта.", "Non ha un argomento convincente."),
        af("Dativo", "убеди́тельному", "аргуме́нту", "Мы пове́рили убеди́тельному аргуме́нту.", "Abbiamo creduto all'argomento convincente."),
        af("Accusativo", "убеди́тельный", "аргуме́нт", "Он привёл убеди́тельный аргуме́нт.", "Ha portato un argomento convincente."),
        af("Strumentale", "убеди́тельным", "аргуме́нтом", "Он был убеди́тельным аргуме́нтом.", "Era un argomento convincente."),
        af("Prepositivo", "убеди́тельном", "аргуме́нте", "Мы говори́м об убеди́тельном аргуме́нте.", "Parliamo dell'argomento convincente."),
      ],
      { promptRu: "Убеди́тельный аргуме́нт реши́л спор.", promptIt: "Trasforma al DATIVO: 'all'argomento convincente'", targetCase: "Dativo", options: ["убеди́тельному аргуме́нту","убеди́тельный аргуме́нт","убеди́тельного аргуме́нта"], correct: 0, fullRu: "Мы пове́рили убеди́тельному аргуме́нту.", fullIt: "Abbiamo creduto all'argomento convincente." }
    ),
    adj(
      "многочи́сленный",
      "numeroso",
      "Aggettivo regolare in -ый, registro formale/scritto.",
      [
        af("Maschile", "многочи́сленный", "наро́д", "Э́то многочи́сленный наро́д.", "Questo è un popolo numeroso."),
        af("Femminile", "многочи́сленная", "гру́ппа", "Э́то многочи́сленная гру́ппа.", "Questo è un gruppo numeroso."),
        af("Neutro", "многочи́сленное", "населе́ние", "Э́то многочи́сленное населе́ние.", "Questa è una popolazione numerosa."),
        af("Plurale", "многочи́сленные", "приме́ры", "Э́то многочи́сленные приме́ры.", "Questi sono esempi numerosi."),
      ],
      [
        af("Nominativo", "многочи́сленный", "наро́д", "Многочи́сленный наро́д собра́лся.", "Il popolo numeroso si è radunato."),
        af("Genitivo", "многочи́сленного", "наро́да", "Исто́рия многочи́сленного наро́да дли́нна.", "La storia del popolo numeroso è lunga."),
        af("Dativo", "многочи́сленному", "наро́ду", "Мы помога́ем многочи́сленному наро́ду.", "Aiutiamo il popolo numeroso."),
        af("Accusativo", "многочи́сленный", "наро́д", "Мы уважа́ем многочи́сленный наро́д.", "Rispettiamo il popolo numeroso."),
        af("Strumentale", "многочи́сленным", "наро́дом", "Он руководи́л многочи́сленным наро́дом.", "Guidava il popolo numeroso."),
        af("Prepositivo", "многочи́сленном", "наро́де", "Мы говори́м о многочи́сленном наро́де.", "Parliamo del popolo numeroso."),
      ],
      { promptRu: "Многочи́сленный наро́д собра́лся.", promptIt: "Trasforma al GENITIVO: 'del popolo numeroso'", targetCase: "Genitivo", options: ["многочи́сленного наро́да","многочи́сленный наро́д","многочи́сленном наро́де"], correct: 0, fullRu: "Исто́рия многочи́сленного наро́да дли́нна.", fullIt: "La storia del popolo numeroso è lunga." }
    ),
  ],
  C2: [
    adj(
      "вопию́щий",
      "clamoroso, flagrante",
      "Aggettivo participiale a tema morbido (in -ий), registro elevato/letterario, accento sulla desinenza.",
      [
        af("Maschile", "вопию́щий", "приме́р", "Э́то вопию́щий приме́р.", "Questo è un esempio clamoroso."),
        af("Femminile", "вопию́щая", "несправедли́вость", "Э́то вопию́щая несправедли́вость.", "Questa è un'ingiustizia flagrante."),
        af("Neutro", "вопию́щее", "наруше́ние", "Э́то вопию́щее наруше́ние.", "Questa è una violazione flagrante."),
        af("Plurale", "вопию́щие", "фа́кты", "Э́то вопию́щие фа́кты.", "Questi sono fatti clamorosi."),
      ],
      [
        af("Nominativo", "вопию́щий", "приме́р", "Вопию́щий приме́р возмутил всех.", "L'esempio clamoroso ha indignato tutti."),
        af("Genitivo", "вопию́щего", "приме́ра", "Мы стали свидетелями вопию́щего приме́ра.", "Siamo stati testimoni dell'esempio clamoroso."),
        af("Dativo", "вопию́щему", "приме́ру", "Внимание к вопию́щему приме́ру растёт.", "Cresce l'attenzione verso l'esempio clamoroso."),
        af("Accusativo", "вопию́щий", "приме́р", "Журналист описал вопию́щий приме́р.", "Il giornalista ha descritto l'esempio clamoroso."),
        af("Strumentale", "вопию́щим", "приме́ром", "Все возмущены вопию́щим приме́ром.", "Tutti sono indignati dall'esempio clamoroso."),
        af("Prepositivo", "вопию́щем", "приме́ре", "Статья о вопию́щем приме́ре.", "L'articolo parla dell'esempio clamoroso."),
      ],
      { promptRu: "Вопиющий пример возмутил всех.", promptIt: "Trasforma allo STRUMENTALE: 'tutti sono indignati dall'esempio clamoroso'", targetCase: "Strumentale", options: ["вопию́щим приме́ром","вопию́щего приме́ра","вопию́щему приме́ру"], correct: 0, fullRu: "Все возмущены вопиющим примером.", fullIt: "Tutti sono indignati dall'esempio clamoroso." }
    ),
    adj(
      "неотъе́млемый",
      "inalienabile, imprescindibile",
      "Aggettivo participiale regolare a tema duro, registro formale/giuridico.",
      [
        af("Maschile", "неотъе́млемый", "элеме́нт", "Э́то неотъе́млемый элеме́нт.", "Questo è un elemento imprescindibile."),
        af("Femminile", "неотъе́млемая", "часть", "Э́то неотъе́млемая часть.", "Questa è una parte imprescindibile."),
        af("Neutro", "неотъе́млемое", "пра́во", "Э́то неотъе́млемое пра́во.", "Questo è un diritto inalienabile."),
        af("Plurale", "неотъе́млемые", "усло́вия", "Э́то неотъе́млемые усло́вия.", "Queste sono condizioni imprescindibili."),
      ],
      [
        af("Nominativo", "неотъе́млемый", "элеме́нт", "Неотъе́млемый элеме́нт культуры сохранился.", "L'elemento imprescindibile della cultura si è conservato."),
        af("Genitivo", "неотъе́млемого", "элеме́нта", "Значение неотъе́млемого элеме́нта велико.", "L'importanza dell'elemento imprescindibile è grande."),
        af("Dativo", "неотъе́млемому", "элеме́нту", "Внимание к неотъе́млемому элеме́нту растёт.", "Cresce l'attenzione verso l'elemento imprescindibile."),
        af("Accusativo", "неотъе́млемый", "элеме́нт", "Учёный выделил неотъе́млемый элеме́нт.", "Lo scienziato ha individuato l'elemento imprescindibile."),
        af("Strumentale", "неотъе́млемым", "элеме́нтом", "Традиция считается неотъе́млемым элеме́нтом.", "La tradizione è considerata un elemento imprescindibile."),
        af("Prepositivo", "неотъе́млемом", "элеме́нте", "Речь идёт о неотъе́млемом элеме́нте.", "Si tratta dell'elemento imprescindibile."),
      ],
      { promptRu: "Неотъемлемый элемент культуры сохранился.", promptIt: "Trasforma allo STRUMENTALE: 'la tradizione è considerata un elemento imprescindibile'", targetCase: "Strumentale", options: ["неотъе́млемым элеме́нтом","неотъе́млемого элеме́нта","неотъе́млемому элеме́нту"], correct: 0, fullRu: "Традиция считается неотъемлемым элементом.", fullIt: "La tradizione è considerata un elemento imprescindibile." }
    ),
    adj(
      "изощрённый",
      "sofisticato, raffinato (spesso in senso critico)",
      "Aggettivo participiale regolare a tema duro, registro elevato.",
      [
        af("Maschile", "изощрённый", "ум", "Э́то изощрённый ум.", "Questa è una mente sofisticata."),
        af("Femminile", "изощрённая", "страте́гия", "Э́то изощрённая страте́гия.", "Questa è una strategia sofisticata."),
        af("Neutro", "изощрённое", "мастерство́", "Э́то изощрённое мастерство́.", "Questa è un'abilità raffinata."),
        af("Plurale", "изощрённые", "приёмы", "Э́то изощрённые приёмы.", "Queste sono tecniche sofisticate."),
      ],
      [
        af("Nominativo", "изощрённый", "план", "Изощрённый план срабо́тал.", "Il piano sofisticato ha funzionato."),
        af("Genitivo", "изощрённого", "пла́на", "Мы не ожидали изощрённого пла́на.", "Non ci aspettavamo un piano così sofisticato."),
        af("Dativo", "изощрённому", "пла́ну", "Эксперты удивились изощрённому пла́ну.", "Gli esperti si sono stupiti del piano sofisticato."),
        af("Accusativo", "изощрённый", "план", "Он разрабо́тал изощрённый план.", "Ha elaborato un piano sofisticato."),
        af("Strumentale", "изощрённым", "пла́ном", "Мы восхищены изощрённым пла́ном.", "Siamo ammirati dal piano sofisticato."),
        af("Prepositivo", "изощрённом", "пла́не", "Статья о изощрённом пла́не.", "L'articolo parla del piano sofisticato."),
      ],
      { promptRu: "Изощрённый план сработал.", promptIt: "Trasforma allo STRUMENTALE: 'siamo ammirati dal piano sofisticato'", targetCase: "Strumentale", options: ["изощрённым пла́ном","изощрённого пла́на","изощрённому пла́ну"], correct: 0, fullRu: "Мы восхищены изощрённым планом.", fullIt: "Siamo ammirati dal piano sofisticato." }
    ),
    adj(
      "безогово́рочный",
      "incondizionato, categorico",
      "Aggettivo regolare a tema duro, registro formale.",
      [
        af("Maschile", "безогово́рочный", "успе́х", "Э́то безогово́рочный успе́х.", "Questo è un successo incondizionato."),
        af("Femminile", "безогово́рочная", "подде́ржка", "Э́то безогово́рочная подде́ржка.", "Questo è un sostegno incondizionato."),
        af("Neutro", "безогово́рочное", "приня́тие", "Э́то безогово́рочное приня́тие.", "Questa è un'accettazione incondizionata."),
        af("Plurale", "безогово́рочные", "усло́вия", "Э́то безогово́рочные усло́вия.", "Queste sono condizioni categoriche."),
      ],
      [
        af("Nominativo", "безогово́рочный", "успе́х", "Безогово́рочный успе́х порадовал всех.", "Il successo incondizionato ha rallegrato tutti."),
        af("Genitivo", "безогово́рочного", "успе́ха", "Мы добились безогово́рочного успе́ха.", "Abbiamo ottenuto un successo incondizionato."),
        af("Dativo", "безогово́рочному", "успе́ху", "Мы рады безогово́рочному успе́ху.", "Siamo felici del successo incondizionato."),
        af("Accusativo", "безогово́рочный", "успе́х", "Команда одержала безогово́рочный успе́х.", "La squadra ha ottenuto un successo incondizionato."),
        af("Strumentale", "безогово́рочным", "успе́хом", "Все дово́льны безогово́рочным успе́хом.", "Tutti sono soddisfatti del successo incondizionato."),
        af("Prepositivo", "безогово́рочном", "успе́хе", "Статья о безогово́рочном успе́хе.", "L'articolo parla del successo incondizionato."),
      ],
      { promptRu: "Безоговорочный успех порадовал всех.", promptIt: "Trasforma allo STRUMENTALE: 'tutti sono soddisfatti del successo incondizionato'", targetCase: "Strumentale", options: ["безогово́рочным успе́хом","безогово́рочного успе́ха","безогово́рочному успе́ху"], correct: 0, fullRu: "Все дово́льны безоговорочным успехом.", fullIt: "Tutti sono soddisfatti del successo incondizionato." }
    ),
    adj(
      "вопло́щенный",
      "incarnato, personificato",
      "Aggettivo participiale regolare a tema duro, registro letterario.",
      [
        af("Maschile", "вопло́щенный", "идеа́л", "Э́то вопло́щенный идеа́л.", "Questo è l'ideale incarnato."),
        af("Femminile", "вопло́щенная", "мечта́", "Э́то вопло́щенная мечта́.", "Questo è il sogno realizzato."),
        af("Neutro", "вопло́щенное", "соверше́нство", "Э́то вопло́щенное соверше́нство.", "Questa è la perfezione incarnata."),
        af("Plurale", "вопло́щенные", "наде́жды", "Э́то вопло́щенные наде́жды.", "Queste sono speranze realizzate."),
      ],
      [
        af("Nominativo", "вопло́щенный", "идеа́л", "Вопло́щенный идеа́л вдохновляет.", "L'ideale incarnato ispira."),
        af("Genitivo", "вопло́щенного", "идеа́ла", "Мы ищем вопло́щенного идеа́ла.", "Cerchiamo l'ideale incarnato."),
        af("Dativo", "вопло́щенному", "идеа́лу", "Мы стремимся к вопло́щенному идеа́лу.", "Aspiriamo all'ideale incarnato."),
        af("Accusativo", "вопло́щенный", "идеа́л", "Художник изобразил вопло́щенный идеа́л.", "L'artista ha raffigurato l'ideale incarnato."),
        af("Strumentale", "вопло́щенным", "идеа́лом", "Он был вопло́щенным идеа́лом красоты.", "Era l'ideale incarnato della bellezza."),
        af("Prepositivo", "вопло́щенном", "идеа́ле", "Речь о вопло́щенном идеа́ле.", "Si parla dell'ideale incarnato."),
      ],
      { promptRu: "Воплощенный идеал вдохновляет.", promptIt: "Trasforma allo STRUMENTALE: 'era l'ideale incarnato della bellezza'", targetCase: "Strumentale", options: ["вопло́щенным идеа́лом","вопло́щенного идеа́ла","вопло́щенному идеа́лу"], correct: 0, fullRu: "Он был воплощенным идеалом красоты.", fullIt: "Era l'ideale incarnato della bellezza." }
    ),
    adj(
      "неисчерпа́емый",
      "inesauribile",
      "Aggettivo participiale regolare a tema duro, registro elevato.",
      [
        af("Maschile", "неисчерпа́емый", "исто́чник", "Э́то неисчерпа́емый исто́чник.", "Questa è una fonte inesauribile."),
        af("Femminile", "неисчерпа́емая", "эне́ргия", "Э́то неисчерпа́емая эне́ргия.", "Questa è un'energia inesauribile."),
        af("Neutro", "неисчерпа́емое", "терпе́ние", "Э́то неисчерпа́емое терпе́ние.", "Questa è una pazienza inesauribile."),
        af("Plurale", "неисчерпа́емые", "ресу́рсы", "Э́то неисчерпа́емые ресу́рсы.", "Queste sono risorse inesauribili."),
      ],
      [
        af("Nominativo", "неисчерпа́емый", "исто́чник", "Неисчерпа́емый исто́чник вдохновения.", "Fonte inesauribile di ispirazione."),
        af("Genitivo", "неисчерпа́емого", "исто́чника", "Мы нашли неисчерпа́емого исто́чника идей.", "Abbiamo trovato una fonte inesauribile di idee."),
        af("Dativo", "неисчерпа́емому", "исто́чнику", "Он благодарен неисчерпа́емому исто́чнику.", "È grato per la fonte inesauribile."),
        af("Accusativo", "неисчерпа́емый", "исто́чник", "Учёные обнаружили неисчерпа́емый исто́чник.", "Gli scienziati hanno scoperto una fonte inesauribile."),
        af("Strumentale", "неисчерпа́емым", "исто́чником", "Природа считается неисчерпа́емым исто́чником.", "La natura è considerata una fonte inesauribile."),
        af("Prepositivo", "неисчерпа́емом", "исто́чнике", "Статья о неисчерпа́емом исто́чнике.", "L'articolo parla della fonte inesauribile."),
      ],
      { promptRu: "Неисчерпаемый источник вдохновения.", promptIt: "Trasforma allo STRUMENTALE: 'la natura è considerata una fonte inesauribile'", targetCase: "Strumentale", options: ["неисчерпа́емым исто́чником","неисчерпа́емого исто́чника","неисчерпа́емому исто́чнику"], correct: 0, fullRu: "Природа считается неисчерпаемым источником.", fullIt: "La natura è considerata una fonte inesauribile." }
    ),
    adj(
      "вы́веренный",
      "calibrato, ponderato con precisione",
      "Aggettivo participiale regolare a tema duro, registro tecnico/letterario.",
      [
        af("Maschile", "вы́веренный", "расчёт", "Э́то вы́веренный расчёт.", "Questo è un calcolo calibrato con precisione."),
        af("Femminile", "вы́веренная", "страте́гия", "Э́то вы́веренная страте́гия.", "Questa è una strategia ponderata."),
        af("Neutro", "вы́веренное", "реше́ние", "Э́то вы́веренное реше́ние.", "Questa è una decisione ponderata."),
        af("Plurale", "вы́веренные", "да́нные", "Э́то вы́веренные да́нные.", "Questi sono dati verificati con precisione."),
      ],
      [
        af("Nominativo", "вы́веренный", "расчёт", "Вы́веренный расчёт оказался точным.", "Il calcolo calibrato si è rivelato preciso."),
        af("Genitivo", "вы́веренного", "расчёта", "Результат зависел от вы́веренного расчёта.", "Il risultato dipendeva dal calcolo calibrato."),
        af("Dativo", "вы́веренному", "расчёту", "Мы доверяем вы́веренному расчёту.", "Ci fidiamo del calcolo calibrato."),
        af("Accusativo", "вы́веренный", "расчёт", "Инженер представил вы́веренный расчёт.", "L'ingegnere ha presentato un calcolo calibrato."),
        af("Strumentale", "вы́веренным", "расчётом", "Мы дово́льны вы́веренным расчётом.", "Siamo soddisfatti del calcolo calibrato."),
        af("Prepositivo", "вы́веренном", "расчёте", "Речь о вы́веренном расчёте.", "Si parla del calcolo calibrato."),
      ],
      { promptRu: "Выверенный расчёт оказался точным.", promptIt: "Trasforma allo STRUMENTALE: 'siamo soddisfatti del calcolo calibrato'", targetCase: "Strumentale", options: ["вы́веренным расчётом","вы́веренного расчёта","вы́веренному расчёту"], correct: 0, fullRu: "Мы дово́льны выверенным расчётом.", fullIt: "Siamo soddisfatti del calcolo calibrato." }
    ),
      adj(
      "исключи́тельный",
      "eccezionale",
      "Aggettivo regolare in -ый, registro elevato.",
      [
        af("Maschile", "исключи́тельный", "тала́нт", "Э́то исключи́тельный тала́нт.", "Questo è un talento eccezionale."),
        af("Femminile", "исключи́тельная", "возмо́жность", "Э́то исключи́тельная возмо́жность.", "Questa è un'opportunità eccezionale."),
        af("Neutro", "исключи́тельное", "явле́ние", "Э́то исключи́тельное явле́ние.", "Questo è un fenomeno eccezionale."),
        af("Plurale", "исключи́тельные", "обстоя́тельства", "Э́то исключи́тельные обстоя́тельства.", "Queste sono circostanze eccezionali."),
      ],
      [
        af("Nominativo", "исключи́тельный", "тала́нт", "Исключи́тельный тала́нт про́явился ра́но.", "Il talento eccezionale si è manifestato presto."),
        af("Genitivo", "исключи́тельного", "тала́нта", "Учёные говоря́т об исключи́тельного тала́нта.", "Gli scienziati parlano del talento eccezionale."),
        af("Dativo", "исключи́тельному", "тала́нту", "Мы обя́заны исключи́тельному тала́нту.", "Dobbiamo tutto al talento eccezionale."),
        af("Accusativo", "исключи́тельный", "тала́нт", "Мы призна́ли исключи́тельный тала́нт.", "Abbiamo riconosciuto il talento eccezionale."),
        af("Strumentale", "исключи́тельным", "тала́нтом", "Он облада́л исключи́тельным тала́нтом.", "Possedeva un talento eccezionale."),
        af("Prepositivo", "исключи́тельном", "тала́нте", "Мы говори́м об исключи́тельном тала́нте.", "Parliamo del talento eccezionale."),
      ],
      { promptRu: "Исключи́тельный тала́нт про́явился ра́но.", promptIt: "Trasforma allo STRUMENTALE: 'con talento eccezionale'", targetCase: "Strumentale", options: ["исключи́тельным тала́нтом","исключи́тельный тала́нт","исключи́тельного тала́нта"], correct: 0, fullRu: "Он облада́л исключи́тельным тала́нтом.", fullIt: "Possedeva un talento eccezionale." }
    ),
    adj(
      "непревзойдённый",
      "insuperato",
      "Aggettivo participiale, registro molto elevato/letterario.",
      [
        af("Maschile", "непревзойдённый", "ма́стер", "Э́то непревзойдённый ма́стер.", "Questo è un maestro insuperato."),
        af("Femminile", "непревзойдённая", "красота́", "Э́то непревзойдённая красота́.", "Questa è una bellezza insuperata."),
        af("Neutro", "непревзойдённое", "мастерство́", "Э́то непревзойдённое мастерство́.", "Questa è una maestria insuperata."),
        af("Plurale", "непревзойдённые", "достиже́ния", "Э́то непревзойдённые достиже́ния.", "Questi sono risultati insuperati."),
      ],
      [
        af("Nominativo", "непревзойдённый", "ма́стер", "Непревзойдённый ма́стер твори́т чу́деса.", "Il maestro insuperato crea meraviglie."),
        af("Genitivo", "непревзойдённого", "ма́стера", "Рабо́ты непревзойдённого ма́стера це́нятся.", "Le opere del maestro insuperato sono apprezzate."),
        af("Dativo", "непревзойдённому", "ма́стеру", "Мы обраща́емся к непревзойдённому ма́стеру.", "Ci rivolgiamo al maestro insuperato."),
        af("Accusativo", "непревзойдённого", "ма́стера", "Мы пригласи́ли непревзойдённого ма́стера.", "Abbiamo invitato il maestro insuperato."),
        af("Strumentale", "непревзойдённым", "ма́стером", "Он стал непревзойдённым ма́стером.", "È diventato un maestro insuperato."),
        af("Prepositivo", "непревзойдённом", "ма́стере", "Мы говори́м о непревзойдённом ма́стере.", "Parliamo del maestro insuperato."),
      ],
      { promptRu: "Непревзойдённый ма́стер твори́т чу́деса.", promptIt: "Trasforma al GENITIVO: 'del maestro insuperato'", targetCase: "Genitivo", options: ["непревзойдённого ма́стера","непревзойдённый ма́стер","непревзойдённом ма́стере"], correct: 0, fullRu: "Рабо́ты непревзойдённого ма́стера це́нятся.", fullIt: "Le opere del maestro insuperato sono apprezzate." }
    ),
  ],
};

