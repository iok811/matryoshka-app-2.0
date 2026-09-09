// File generato dallo split di grammar-core.js (originariamente un unico file da 7043
// righe) per permettere a Vite di creare un chunk più piccolo per ciascuna categoria,
// invece di un blocco unico da ~650KB scaricato sempre tutto insieme.

import { prep, ex } from "./grammar-helpers.js";

export const PREPOSITIONS = {
  A1: [
    prep(
      "в",
      "in, a (dentro / verso l'interno)",
      "Con l'accusativo indica il movimento verso un luogo ('andare in...'); con il prepositivo indica la posizione ('essere in...').",
      [
        { caseGoverned: "Винительный (movimento)", meaningNote: "verso, dentro (moto a luogo)", examples: ex("Я иду в шко́лу.", "Vado a scuola.", "Я не иду в шко́лу.", "Non vado a scuola.", "Ты идёшь в шко́лу?", "Vai a scuola?") },
        { caseGoverned: "Предложный (stato in luogo)", meaningNote: "dentro, all'interno di (stato in luogo)", examples: ex("Я живу́ в Москве́.", "Vivo a Mosca.", "Я не живу́ в Москве́.", "Non vivo a Mosca.", "Ты живёшь в Москве́?", "Vivi a Mosca?") },
      ]
    ),
    prep(
      "на",
      "su, a (sopra / verso la superficie)",
      "Con l'accusativo indica il movimento verso una superficie ('mettere su...'); con il prepositivo indica la posizione sopra qualcosa ('essere su...').",
      [
        { caseGoverned: "Винительный (movimento)", meaningNote: "sopra, su (moto a luogo)", examples: ex("Я кладу́ кни́гу на стол.", "Metto il libro sul tavolo.", "Я не кладу́ кни́гу на стол.", "Non metto il libro sul tavolo.", "Ты кладёшь кни́гу на стол?", "Metti il libro sul tavolo?") },
        { caseGoverned: "Предложный (stato in luogo)", meaningNote: "sopra (stato in luogo)", examples: ex("Кни́га лежи́т на столе́.", "Il libro è sul tavolo.", "Кни́га не лежи́т на столе́.", "Il libro non è sul tavolo.", "Кни́га лежи́т на столе́?", "Il libro è sul tavolo?") },
      ]
    ),
    prep(
      "у",
      "da, presso, vicino a",
      "Regge sempre il genitivo. Indica un luogo presso qualcuno o qualcosa, ed è anche la base della costruzione di possesso 'у меня есть' (ho).",
      [
        { caseGoverned: "Родительный", meaningNote: "presso, da (qualcuno/qualcosa)", examples: ex("Я живу́ у дру́га.", "Vivo da un amico.", "Я не живу́ у дру́га.", "Non vivo da un amico.", "Ты живёшь у дру́га?", "Vivi da un amico?") },
      ]
    ),
    prep(
      "с",
      "con",
      "Regge lo strumentale quando significa 'insieme a, con' (compagnia o strumento); con il genitivo significa invece 'da, giù da' (provenienza), un uso diverso non trattato qui.",
      [
        { caseGoverned: "Творительный", meaningNote: "insieme a, con (compagnia/strumento)", examples: ex("Я пью чай с молоко́м.", "Bevo il tè con il latte.", "Я не пью чай с молоко́м.", "Non bevo il tè con il latte.", "Ты пьёшь чай с молоко́м?", "Bevi il tè con il latte?") },
      ]
    ),
    prep(
      "к",
      "verso, da (qualcuno)",
      "Regge sempre il dativo. Indica il movimento in direzione di una persona o di un luogo, senza necessariamente arrivarci dentro.",
      [
        { caseGoverned: "Дательный", meaningNote: "verso, da (direzione)", examples: ex("Я иду́ к врачу́.", "Vado dal medico.", "Я не иду́ к врачу́.", "Non vado dal medico.", "Ты идёшь к врачу́?", "Vai dal medico?") },
      ]
    ),
    prep(
      "о / об",
      "di, riguardo a",
      "Regge sempre il prepositivo. Diventa 'об' davanti a una vocale (об э́том), e 'обо' davanti ad alcune parole specifiche (обо мне).",
      [
        { caseGoverned: "Предложный", meaningNote: "riguardo a, a proposito di", examples: ex("Я ду́маю о тебе́.", "Penso a te.", "Я не ду́маю о тебе́.", "Non penso a te.", "Ты ду́маешь о тебе́?", "Pensi a te?") },
      ]
    ),
    prep(
      "для",
      "per",
      "Regge sempre il genitivo. Indica lo scopo o il beneficiario di un'azione.",
      [
        { caseGoverned: "Родительный", meaningNote: "per (scopo/beneficiario)", examples: ex("Э́то подарок для тебя.", "Questo è un regalo per te.", "Э́то не подарок для тебя.", "Questo non è un regalo per te.", "Э́то подарок для тебя?", "Questo è un regalo per te?") },
      ]
    ),
    prep(
      "при",
      "presso, durante",
      "Regge sempre il prepositivo. Indica vicinanza fisica o un'occasione temporale.",
      [
        { caseGoverned: "Предложный", meaningNote: "presso, durante", examples: ex("Шко́ла при це́ркви.", "La scuola è presso la chiesa.", "Шко́лы нет при це́ркви.", "Non c'è la scuola presso la chiesa.", "Шко́ла при це́ркви?", "La scuola è presso la chiesa?") },
      ]
    ),
    prep(
      "о́коло",
      "vicino a, circa",
      "Regge sempre il genitivo. Indica vicinanza spaziale o un valore approssimativo.",
      [
        { caseGoverned: "Родительный", meaningNote: "vicino a, circa", examples: ex("Магази́н о́коло до́ма.", "Il negozio è vicino a casa.", "Магази́на нет о́коло до́ма.", "Il negozio non è vicino a casa.", "Магази́н о́коло до́ма?", "Il negozio è vicino a casa?") },
      ]
    ),
  ],
  A2: [
    prep(
      "из",
      "da, fuori da (provenienza)",
      "Regge sempre il genitivo. Indica la provenienza da un luogo, contrapposta a 'в' (moto a luogo).",
      [
        { caseGoverned: "Родительный", meaningNote: "provenienza, uscita da", examples: ex("Я прие́хал из Ита́лии.", "Sono venuto dall'Italia.", "Я не прие́хал из Ита́лии.", "Non sono venuto dall'Italia.", "Ты прие́хал из Ита́лии?", "Sei venuto dall'Italia?") },
      ]
    ),
    prep(
      "от",
      "da (allontanamento, causa)",
      "Regge sempre il genitivo. Indica l'allontanamento da un punto o la causa di qualcosa, diverso da 'из' che indica provenienza dall'interno di un luogo.",
      [
        { caseGoverned: "Родительный", meaningNote: "allontanamento, causa", examples: ex("Я получи́л письмо́ от дру́га.", "Ho ricevuto una lettera da un amico.", "Я не получи́л письмо́ от дру́га.", "Non ho ricevuto una lettera da un amico.", "Ты получи́л письмо́ от дру́га?", "Hai ricevuto una lettera da un amico?") },
      ]
    ),
    prep(
      "до",
      "fino a",
      "Regge sempre il genitivo. Indica un limite di tempo o spazio da raggiungere.",
      [
        { caseGoverned: "Родительный", meaningNote: "fino a (limite)", examples: ex("Я рабо́таю до пяти́.", "Lavoro fino alle cinque.", "Я не рабо́таю до пяти́.", "Non lavoro fino alle cinque.", "Ты рабо́таешь до пяти́?", "Lavori fino alle cinque?") },
      ]
    ),
    prep(
      "по",
      "per, secondo, lungo",
      "Regge tipicamente il dativo (per indicare distribuzione, mezzo, o percorso lungo qualcosa).",
      [
        { caseGoverned: "Дательный", meaningNote: "lungo, tramite, secondo", examples: ex("Я гуля́ю по па́рку.", "Passeggio per il parco.", "Я не гуля́ю по па́рку.", "Non passeggio per il parco.", "Ты гуля́ешь по па́рку?", "Passeggi per il parco?") },
      ]
    ),
    prep(
      "за",
      "dietro, per (durante), a favore di",
      "Regge lo strumentale per indicare posizione statica dietro qualcosa; regge l'accusativo per indicare movimento dietro o un periodo di tempo.",
      [
        { caseGoverned: "Творительный (stato)", meaningNote: "dietro (posizione)", examples: ex("Сад нахо́дится за до́мом.", "Il giardino si trova dietro casa.", "Сад не нахо́дится за до́мом.", "Il giardino non si trova dietro casa.", "Сад нахо́дится за до́мом?", "Il giardino si trova dietro casa?") },
        { caseGoverned: "Винительный (durata)", meaningNote: "in, entro (un periodo di tempo)", examples: ex("Я сделал э́то за час.", "L'ho fatto in un'ora.", "Я не сделал э́то за час.", "Non l'ho fatto in un'ora.", "Ты сделал э́то за час?", "L'hai fatto in un'ora?") },
      ]
    ),
    prep(
      "под",
      "sotto",
      "Regge lo strumentale per indicare posizione statica sotto qualcosa; regge l'accusativo per indicare movimento verso il basso, sotto qualcosa.",
      [
        { caseGoverned: "Творительный (stato)", meaningNote: "sotto (posizione)", examples: ex("Кот спит под столо́м.", "Il gatto dorme sotto il tavolo.", "Кот не спит под столо́м.", "Il gatto non dorme sotto il tavolo.", "Кот спит под столо́м?", "Il gatto dorme sotto il tavolo?") },
        { caseGoverned: "Винительный (movimento)", meaningNote: "sotto (moto a luogo)", examples: ex("Мяч закати́лся под стол.", "La palla è rotolata sotto il tavolo.", "Мяч не закати́лся под стол.", "La palla non è rotolata sotto il tavolo.", "Мяч закати́лся под стол?", "La palla è rotolata sotto il tavolo?") },
      ]
    ),
    prep(
      "через",
      "attraverso, tra (tempo)",
      "Regge sempre l'accusativo. Indica l'attraversamento di uno spazio o un intervallo di tempo che deve trascorrere.",
      [
        { caseGoverned: "Винительный", meaningNote: "attraverso, tra (tempo/spazio)", examples: ex("Я перейду́ через доро́гу.", "Attraverserò la strada.", "Я не перейду́ через доро́гу.", "Non attraverserò la strada.", "Ты перейдёшь через доро́гу?", "Attraverserai la strada?") },
      ]
    ),
      prep(
      "вдоль",
      "lungo",
      "Regge sempre il genitivo. Indica un movimento o una posizione parallela a qualcosa.",
      [
        { caseGoverned: "Родительный", meaningNote: "lungo", examples: ex("Мы гуля́ем вдоль реки́.", "Passeggiamo lungo il fiume.", "Мы не гуля́ем вдоль реки́.", "Non passeggiamo lungo il fiume.", "Вы гуля́ете вдоль реки́?", "Passeggiate lungo il fiume?") },
      ]
    ),
    prep(
      "напро́тив",
      "di fronte a",
      "Regge sempre il genitivo. Indica una posizione opposta.",
      [
        { caseGoverned: "Родительный", meaningNote: "di fronte a", examples: ex("Шко́ла напро́тив па́рка.", "La scuola è di fronte al parco.", "Шко́лы нет напро́тив па́рка.", "La scuola non è di fronte al parco.", "Шко́ла напро́тив па́рка?", "La scuola è di fronte al parco?") },
      ]
    ),
  ],
  B1: [
    prep(
      "ме́жду",
      "tra, fra",
      "Regge tipicamente lo strumentale. Indica una posizione intermedia tra due o più elementi.",
      [
        { caseGoverned: "Творительный", meaningNote: "tra, in mezzo a", examples: ex("Стол стои́т между о́кнами.", "Il tavolo si trova tra le finestre.", "Стол не стои́т между о́кнами.", "Il tavolo non si trova tra le finestre.", "Стол стои́т между о́кнами?", "Il tavolo si trova tra le finestre?") },
      ]
    ),
    prep(
      "пе́ред",
      "davanti a, prima di",
      "Regge sempre lo strumentale. Indica posizione o momento precedente rispetto a qualcosa.",
      [
        { caseGoverned: "Творительный", meaningNote: "davanti a (spazio/tempo)", examples: ex("Маши́на стои́т перед до́мом.", "La macchina è parcheggiata davanti a casa.", "Маши́на не стои́т перед до́мом.", "La macchina non è parcheggiata davanti a casa.", "Маши́на стои́т перед до́мом?", "La macchina è parcheggiata davanti a casa?") },
      ]
    ),
    prep(
      "над",
      "sopra (senza contatto)",
      "Regge sempre lo strumentale. Indica una posizione sopra qualcosa senza toccarlo, a differenza di 'на' che implica contatto.",
      [
        { caseGoverned: "Творительный", meaningNote: "sopra, al di sopra di", examples: ex("Ла́мпа виси́т над столо́м.", "La lampada è appesa sopra il tavolo.", "Ла́мпа не виси́т над столо́м.", "La lampada non è appesa sopra il tavolo.", "Ла́мпа виси́т над столо́м?", "La lampada è appesa sopra il tavolo?") },
      ]
    ),
    prep(
      "вокру́г",
      "intorno a",
      "Regge sempre il genitivo. Indica una posizione circostante rispetto a un punto centrale.",
      [
        { caseGoverned: "Родительный", meaningNote: "intorno a, attorno a", examples: ex("Де́ти бе́гают вокру́г до́ма.", "I bambini corrono intorno alla casa.", "Де́ти не бе́гают вокру́г до́ма.", "I bambini non corrono intorno alla casa.", "Де́ти бе́гают вокру́г до́ма?", "I bambini corrono intorno alla casa?") },
      ]
    ),
    prep(
      "без",
      "senza",
      "Regge sempre il genitivo. Indica l'assenza di qualcosa o qualcuno.",
      [
        { caseGoverned: "Родительный", meaningNote: "senza, in assenza di", examples: ex("Я пью ко́фе без са́хара.", "Bevo il caffè senza zucchero.", "Я не пью ко́фе без са́хара.", "Non bevo il caffè senza zucchero.", "Ты пьёшь ко́фе без са́хара?", "Bevi il caffè senza zucchero?") },
      ]
    ),
    prep(
      "про́тив",
      "contro",
      "Regge sempre il genitivo. Indica opposizione o contrarietà.",
      [
        { caseGoverned: "Родительный", meaningNote: "contro, in opposizione a", examples: ex("Я ничего не имею против э́того плана.", "Non ho niente contro questo piano.", "Я имею кое-что против э́того плана.", "Ho qualcosa contro questo piano.", "Ты имеешь что-то против э́того плана?", "Hai qualcosa contro questo piano?") },
      ]
    ),
    prep(
      "согла́сно",
      "secondo, conformemente a",
      "Regge sempre il dativo. Registro leggermente formale, usato per citare una fonte o una regola.",
      [
        { caseGoverned: "Дательный", meaningNote: "secondo, conformemente a", examples: ex("Согласно правилам, э́то запрещено.", "Secondo le regole, questo è vietato.", "Согласно правилам, э́то не запрещено.", "Secondo le regole, questo non è vietato.", "Согласно правилам, э́то запрещено?", "Secondo le regole, questo è vietato?") },
      ]
    ),
      prep(
      "внутри́",
      "dentro, all'interno di",
      "Regge sempre il genitivo. Indica una posizione interna.",
      [
        { caseGoverned: "Родительный", meaningNote: "dentro, all'interno di", examples: ex("Всё внутри́ до́ма чи́сто.", "Tutto è pulito dentro casa.", "Внутри́ до́ма не чи́сто.", "Dentro casa non è pulito.", "Внутри́ до́ма чи́сто?", "Dentro casa è pulito?") },
      ]
    ),
    prep(
      "вме́сто",
      "invece di, al posto di",
      "Regge sempre il genitivo. Indica sostituzione.",
      [
        { caseGoverned: "Родительный", meaningNote: "invece di", examples: ex("Вме́сто ча́я я вы́пил ко́фе.", "Invece del tè ho bevuto il caffè.", "Вме́сто ча́я я не вы́пил ко́фе.", "Invece del tè non ho bevuto il caffè.", "Вме́сто ча́я ты вы́пил ко́фе?", "Invece del tè hai bevuto il caffè?") },
      ]
    ),
  ],
  B2: [
    prep(
      "благодаря́",
      "grazie a",
      "Regge sempre il dativo. Indica una causa positiva, a differenza di 'из-за' che spesso ha connotazione neutra o negativa.",
      [
        { caseGoverned: "Дательный", meaningNote: "grazie a (causa positiva)", examples: ex("Мы успе́ли благодаря́ твое́й по́мощи.", "Ce l'abbiamo fatta grazie al tuo aiuto.", "Мы не успе́ли благодаря́ твое́й по́мощи.", "Non ce l'abbiamo fatta nonostante il tuo aiuto (uso ironico).", "Мы успе́ли благодаря́ твое́й по́мощи?", "Ce l'abbiamo fatta grazie al tuo aiuto?") },
      ]
    ),
    prep(
      "из-за",
      "a causa di",
      "Regge sempre il genitivo. Indica una causa spesso negativa o indesiderata.",
      [
        { caseGoverned: "Родительный", meaningNote: "a causa di (spesso negativo)", examples: ex("Мы опозда́ли из-за про́бок.", "Abbiamo fatto tardi a causa del traffico.", "Мы не опозда́ли из-за про́бок.", "Non abbiamo fatto tardi a causa del traffico.", "Вы опозда́ли из-за про́бок?", "Avete fatto tardi a causa del traffico?") },
      ]
    ),
    prep(
      "наряду́ с",
      "insieme a, oltre a",
      "Regge sempre lo strumentale. Registro formale, indica una compresenza o parallelismo.",
      [
        { caseGoverned: "Творительный", meaningNote: "insieme a, oltre a", examples: ex("Наряду́ с плю́сами есть и ми́нусы.", "Oltre ai vantaggi ci sono anche degli svantaggi.", "Наряду́ с плю́сами нет ми́нусов.", "Oltre ai vantaggi non ci sono svantaggi.", "Наряду́ с плю́сами есть ми́нусы?", "Oltre ai vantaggi ci sono svantaggi?") },
      ]
    ),
    prep(
      "в связи́ с",
      "in relazione a, a causa di",
      "Regge sempre lo strumentale. Registro formale/burocratico, tipico di comunicazioni ufficiali.",
      [
        { caseGoverned: "Творительный", meaningNote: "in relazione a, per via di", examples: ex("В свя́зи с пого́дой рейс отмени́ли.", "A causa del maltempo il volo è stato cancellato.", "В свя́зи с пого́дой рейс не отмени́ли.", "Nonostante il maltempo il volo non è stato cancellato.", "В свя́зи с пого́дой рейс отмени́ли?", "A causa del maltempo il volo è stato cancellato?") },
      ]
    ),
    prep(
      "по сравне́нию с",
      "rispetto a, in confronto a",
      "Regge sempre lo strumentale. Introduce un paragone esplicito tra due elementi.",
      [
        { caseGoverned: "Творительный", meaningNote: "in confronto a, rispetto a", examples: ex("По сравне́нию с про́шлым го́дом це́ны вы́росли.", "Rispetto all'anno scorso i prezzi sono aumentati.", "По сравне́нию с про́шлым го́дом це́ны не вы́росли.", "Rispetto all'anno scorso i prezzi non sono aumentati.", "По сравне́нию с про́шлым го́дом це́ны вы́росли?", "Rispetto all'anno scorso i prezzi sono aumentati?") },
      ]
    ),
    prep(
      "в тече́ние",
      "durante, nel corso di",
      "Regge sempre il genitivo. Indica la durata di un'azione all'interno di un periodo di tempo.",
      [
        { caseGoverned: "Родительный", meaningNote: "durante, nel corso di (tempo)", examples: ex("Я рабо́тал в тече́ние го́да.", "Ho lavorato per il corso di un anno.", "Я не рабо́тал в тече́ние го́да.", "Non ho lavorato per il corso di un anno.", "Ты рабо́тал в тече́ние го́да?", "Hai lavorato per il corso di un anno?") },
      ]
    ),
    prep(
      "вопреки́",
      "nonostante, contro (le aspettative)",
      "Regge sempre il dativo. Registro leggermente formale, indica un'azione che va contro previsioni o consigli.",
      [
        { caseGoverned: "Дательный", meaningNote: "nonostante, contro (aspettative/consigli)", examples: ex("Он пое́хал вопреки́ сове́там врача́.", "È partito nonostante i consigli del medico.", "Он не пое́хал вопреки́ сове́там врача́.", "Non è partito, seguendo i consigli del medico.", "Он пое́хал вопреки́ сове́там врача́?", "È partito nonostante i consigli del medico?") },
      ]
    ),
      prep(
      "путём",
      "tramite, per mezzo di",
      "Regge sempre lo strumentale (di fatto, la forma strumentale di 'путь'). Registro formale.",
      [
        { caseGoverned: "Творительный", meaningNote: "tramite, per mezzo di", examples: ex("Он реши́л зада́чу путём вычисле́ний.", "Ha risolto il problema tramite calcoli.", "Он не реши́л зада́чу путём вычисле́ний.", "Non ha risolto il problema tramite calcoli.", "Он реши́л зада́чу путём вычисле́ний?", "Ha risolto il problema tramite calcoli?") },
      ]
    ),
    prep(
      "в ви́де",
      "sotto forma di",
      "Regge sempre il genitivo. Registro formale/scritto.",
      [
        { caseGoverned: "Родительный", meaningNote: "sotto forma di", examples: ex("По́мощь пришла́ в ви́де де́нег.", "L'aiuto è arrivato sotto forma di denaro.", "По́мощь не пришла́ в ви́де де́нег.", "L'aiuto non è arrivato sotto forma di denaro.", "По́мощь пришла́ в ви́де де́нег?", "L'aiuto è arrivato sotto forma di denaro?") },
      ]
    ),
  ],
  C1: [
    prep(
      "по ме́ре",
      "man mano che, con il progredire di",
      "Regge sempre il genitivo. Registro formale, indica un'evoluzione progressiva parallela.",
      [
        { caseGoverned: "Родительный", meaningNote: "man mano che, con il progredire di", examples: ex("По ме́ре ро́ста компа́нии увели́чивался штат.", "Man mano che l'azienda cresceva, aumentava il personale.", "По ме́ре ро́ста компа́нии штат не увели́чивался.", "Man mano che l'azienda cresceva, il personale non aumentava.", "По ме́ре ро́ста компа́нии штат увели́чивался?", "Man mano che l'azienda cresceva, aumentava il personale?") },
      ]
    ),
    prep(
      "с то́чки зре́ния",
      "dal punto di vista di",
      "Regge sempre il genitivo. Espressione formale/accademica per introdurre una prospettiva specifica.",
      [
        { caseGoverned: "Родительный", meaningNote: "dal punto di vista di", examples: ex("С точки зрения экономики э́то выгодно.", "Dal punto di vista economico è vantaggioso.", "С точки зрения экономики э́то невыгодно.", "Dal punto di vista economico non è vantaggioso.", "С точки зрения экономики э́то выгодно?", "Dal punto di vista economico è vantaggioso?") },
      ]
    ),
    prep(
      "в отноше́нии",
      "nei confronti di, riguardo a",
      "Regge sempre il genitivo. Registro formale/giuridico, introduce l'oggetto di un'azione o di una politica.",
      [
        { caseGoverned: "Родительный", meaningNote: "nei confronti di, riguardo a", examples: ex("При́няты ме́ры в отноше́нии наруши́телей.", "Sono state prese misure nei confronti dei trasgressori.", "Не при́няты ме́ры в отноше́нии наруши́телей.", "Non sono state prese misure nei confronti dei trasgressori.", "При́няты ме́ры в отноше́нии наруши́телей?", "Sono state prese misure nei confronti dei trasgressori?") },
      ]
    ),
    prep(
      "в си́лу",
      "in virtù di, a causa di",
      "Regge sempre il genitivo. Registro formale/giuridico, introduce una causa strutturale o legale.",
      [
        { caseGoverned: "Родительный", meaningNote: "in virtù di, a causa di", examples: ex("В си́лу обстоя́тельств встре́ча отменена́.", "In virtù delle circostanze l'incontro è annullato.", "В си́лу обстоя́тельств встре́ча не отменена́.", "Nonostante le circostanze l'incontro non è annullato.", "В си́лу обстоя́тельств встре́ча отменена́?", "In virtù delle circostanze l'incontro è annullato?") },
      ]
    ),
    prep(
      "за счёт",
      "a spese di, grazie a (risorse di)",
      "Regge sempre il genitivo. Indica che qualcosa avviene utilizzando le risorse di qualcun altro o qualcos'altro.",
      [
        { caseGoverned: "Родительный", meaningNote: "a spese di, tramite le risorse di", examples: ex("Прое́кт финанси́руется за счёт госуда́рства.", "Il progetto è finanziato a spese dello stato.", "Прое́кт не финанси́руется за счёт госуда́рства.", "Il progetto non è finanziato a spese dello stato.", "Прое́кт финанси́руется за счёт госуда́рства?", "Il progetto è finanziato a spese dello stato?") },
      ]
    ),
    prep(
      "невзира́я на",
      "malgrado, senza tener conto di",
      "Regge sempre l'accusativo. Registro elevato/letterario, sinonimo formale di 'несмотря на'.",
      [
        { caseGoverned: "Винительный", meaningNote: "malgrado, senza tener conto di", examples: ex("Он продо́лжил, невзира́я на тру́дности.", "Ha continuato, malgrado le difficoltà.", "Он не продо́лжил, невзира́я на тру́дности.", "Non ha continuato, nonostante le difficoltà (contrasto).", "Он продо́лжил, невзира́я на тру́дности?", "Ha continuato, malgrado le difficoltà?") },
      ]
    ),
    prep(
      "по пово́ду",
      "in merito a, a proposito di",
      "Regge sempre il genitivo. Registro formale, introduce l'argomento di una discussione o comunicazione.",
      [
        { caseGoverned: "Родительный", meaningNote: "in merito a, a proposito di", examples: ex("Мы встре́тились по по́воду контра́кта.", "Ci siamo incontrati in merito al contratto.", "Мы не встре́тились по по́воду контра́кта.", "Non ci siamo incontrati in merito al contratto.", "Вы встре́тились по по́воду контра́кта?", "Vi siete incontrati in merito al contratto?") },
      ]
    ),
      prep(
      "по отноше́нию к",
      "nei confronti di",
      "Locuzione prepositiva composta, regge il dativo. Registro formale.",
      [
        { caseGoverned: "Дательный", meaningNote: "nei confronti di", examples: ex("Он че́стен по отноше́нию к друзья́м.", "È onesto nei confronti degli amici.", "Он не че́стен по отноше́нию к друзья́м.", "Non è onesto nei confronti degli amici.", "Он че́стен по отноше́нию к друзья́м?", "È onesto nei confronti degli amici?") },
      ]
    ),
    prep(
      "с по́мощью",
      "con l'aiuto di, tramite",
      "Locuzione prepositiva composta, regge il genitivo.",
      [
        { caseGoverned: "Родительный", meaningNote: "con l'aiuto di, tramite", examples: ex("Он откры́л дверь с по́мощью ключа́.", "Ha aperto la porta con l'aiuto di una chiave.", "Он не откры́л дверь с по́мощью ключа́.", "Non ha aperto la porta con l'aiuto di una chiave.", "Он откры́л дверь с по́мощью ключа́?", "Ha aperto la porta con l'aiuto di una chiave?") },
      ]
    ),
  ],
  C2: [
    prep(
      "вследствие",
      "in seguito a, per effetto di",
      "Regge sempre il genitivo. Registro burocratico/scientifico, introduce una conseguenza logica o causale formale.",
      [
        { caseGoverned: "Родительный", meaningNote: "in seguito a, per effetto di", examples: ex("Всле́дствие за́сухи урожа́й пострада́л.", "In seguito alla siccità il raccolto ha sofferto.", "Всле́дствие за́сухи урожа́й не пострада́л.", "Nonostante la siccità il raccolto non ha sofferto.", "Всле́дствие за́сухи урожа́й пострада́л?", "In seguito alla siccità il raccolto ha sofferto?") },
      ]
    ),
    prep(
      "по причи́не",
      "a causa di, per motivo di",
      "Regge sempre il genitivo. Registro formale/burocratico, sinonimo elevato di 'из-за'.",
      [
        { caseGoverned: "Родительный", meaningNote: "a causa di, per motivo di", examples: ex("Рейс заде́ржан по причи́не непого́ды.", "Il volo è ritardato per motivo di maltempo.", "Рейс не заде́ржан по причи́не непого́ды.", "Il volo non è ritardato nonostante il maltempo.", "Рейс заде́ржан по причи́не непого́ды?", "Il volo è ritardato per motivo di maltempo?") },
      ]
    ),
    prep(
      "в ка́честве",
      "in qualità di, come",
      "Regge sempre il genitivo. Registro formale, introduce un ruolo o una funzione ricoperta.",
      [
        { caseGoverned: "Родительный", meaningNote: "in qualità di, in veste di", examples: ex("Он вы́ступил в ка́честве экспе́рта.", "È intervenuto in qualità di esperto.", "Он не вы́ступил в ка́честве экспе́рта.", "Non è intervenuto in qualità di esperto.", "Он вы́ступил в ка́честве экспе́рта?", "È intervenuto in qualità di esperto?") },
      ]
    ),
    prep(
      "по ме́ре того как",
      "man mano che (con verbo)",
      "Locuzione congiuntiva formale, introduce una proposizione temporale progressiva; non regge un caso in senso stretto poiché segue con un verbo coniugato, non un sostantivo.",
      [
        { caseGoverned: "Introduce una proposizione (non un caso)", meaningNote: "man mano che, con il progredire di (con verbo)", examples: ex("По ме́ре того́ как темне́ло, станови́лось холодне́е.", "Man mano che si faceva buio, faceva più freddo.", "По ме́ре того́ как темне́ло, не станови́лось холодне́е.", "Man mano che si faceva buio, non faceva più freddo.", "По ме́ре того́ как темне́ло, станови́лось холодне́е?", "Man mano che si faceva buio, faceva più freddo?") },
      ]
    ),
    prep(
      "невзаве́симо от",
      "indipendentemente da",
      "Regge sempre il genitivo. Registro formale, indica che qualcosa non è influenzato da un fattore specifico.",
      [
        { caseGoverned: "Родительный", meaningNote: "indipendentemente da", examples: ex("Реше́ние при́нято незави́симо от мне́ния сове́та.", "La decisione è stata presa indipendentemente dall'opinione del consiglio.", "Реше́ние не при́нято незави́симо от мне́ния сове́та.", "La decisione non è stata presa indipendentemente dall'opinione del consiglio.", "Реше́ние при́нято незави́симо от мне́ния сове́та?", "La decisione è stata presa indipendentemente dall'opinione del consiglio?") },
      ]
    ),
    prep(
      "с учётом",
      "tenendo conto di",
      "Regge sempre il genitivo. Registro formale/burocratico, introduce un fattore da considerare in una decisione.",
      [
        { caseGoverned: "Родительный", meaningNote: "tenendo conto di, considerando", examples: ex("Реше́ние при́нято с учётом всех ри́сков.", "La decisione è stata presa tenendo conto di tutti i rischi.", "Реше́ние не при́нято с учётом всех ри́сков.", "La decisione non è stata presa tenendo conto di tutti i rischi.", "Реше́ние при́нято с учётом всех ри́сков?", "La decisione è stata presa tenendo conto di tutti i rischi?") },
      ]
    ),
    prep(
      "поми́мо",
      "oltre a, a prescindere da",
      "Regge sempre il genitivo. Indica un elemento aggiuntivo rispetto a quanto già menzionato.",
      [
        { caseGoverned: "Родительный", meaningNote: "oltre a, in aggiunta a", examples: ex("Поми́мо зарпла́ты есть бо́нусы.", "Oltre allo stipendio ci sono dei bonus.", "Поми́мо зарпла́ты нет бо́нусов.", "Oltre allo stipendio non ci sono bonus.", "Поми́мо зарпла́ты есть бо́нусы?", "Oltre allo stipendio ci sono bonus?") },
      ]
    ),
      prep(
      "в преде́лах",
      "entro i limiti di",
      "Locuzione prepositiva composta, regge il genitivo. Registro formale/burocratico.",
      [
        { caseGoverned: "Родительный", meaningNote: "entro i limiti di", examples: ex("Э́то в преде́лах бюдже́та.", "Questo è entro i limiti del budget.", "Э́то не в преде́лах бюдже́та.", "Questo non è entro i limiti del budget.", "Э́то в преде́лах бюдже́та?", "È entro i limiti del budget?") },
      ]
    ),
    prep(
      "по истече́нии",
      "allo scadere di",
      "Locuzione prepositiva composta, regge il genitivo. Registro molto formale/giuridico.",
      [
        { caseGoverned: "Родительный", meaningNote: "allo scadere di", examples: ex("По истече́нии сро́ка догово́р зака́нчивается.", "Allo scadere del termine, il contratto finisce.", "По истече́нии сро́ка догово́р не зака́нчивается.", "Allo scadere del termine, il contratto non finisce.", "По истече́нии сро́ка догово́р зака́нчивается?", "Allo scadere del termine il contratto finisce?") },
      ]
    ),
  ],
};

