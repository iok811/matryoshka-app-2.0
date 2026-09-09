// File generato dallo split di grammar-core.js (originariamente un unico file da 7043
// righe) per permettere a Vite di creare un chunk più piccolo per ciascuna categoria,
// invece di un blocco unico da ~650KB scaricato sempre tutto insieme.

import { vbPair, vf, sq } from "./grammar-helpers.js";

export const VERBS = {
  A1: [
    vbPair(
      "говори́ть",
      [
      vf("Presente – io", "говорю́", "Я говорю́ по-русски.", "Parlo russo (in generale, processo)."),
      vf("Presente – tu", "говори́шь", "Ты говори́шь гро́мко.", "Parli ad alta voce."),
      vf("Passato (processo)", "говори́л", "Он до́лго говори́л.", "Ha parlato a lungo (processo)."),
      ],
      "сказа́ть",
      [
      vf("Passato (risultato)", "сказа́л", "Он сказа́л правду.", "Ha detto la verità (fatto, completo)."),
      vf("Futuro – io", "скажу́", "Я скажу́ тебе завтра.", "Te lo dirò domani."),
      vf("Imperativo", "скажи́", "Скажи́ мне правду!", "Dimmi la verità!"),
      ],
      "parlare / dire",
      "Coppia classica (suppletiva): говорить descrive il parlare come processo, сказать il dire come atto singolo e completo.",
      sq("Sto parlando al telefono con mia madre.", "Я говорю́ с мамой.", "imperfettivo", "Я сказа́л маме.", "perfettivo")
    ),
    vbPair(
      "чита́ть",
      [
      vf("Presente – io", "чита́ю", "Я чита́ю газету.", "Sto leggendo il giornale."),
      vf("Presente – lei", "чита́ет", "Она чита́ет книгу.", "Lei sta leggendo un libro."),
      vf("Passato (processo)", "чита́л", "Я чита́л весь вечер.", "Ho letto tutta la sera (senza finire)."),
      ],
      "прочита́ть",
      [
      vf("Passato (risultato)", "прочита́л", "Я прочита́л книгу.", "Ho letto il libro (finito)."),
      vf("Futuro – io", "прочита́ю", "Я прочита́ю э́то завтра.", "Lo leggerò domani (tutto)."),
      vf("Imperativo", "прочита́й", "Прочита́й эту статью.", "Leggi questo articolo (fino alla fine)."),
      ],
      "leggere",
      "L'imperfettivo descrive la lettura come attività in corso, il perfettivo con prefisso про- ne indica il completamento.",
      sq("Ho finito di leggere il libro ieri sera.", "Я прочита́л книгу.", "perfettivo", "Я чита́л книгу.", "imperfettivo")
    ),
    vbPair(
      "писа́ть",
      [
      vf("Presente – io", "пишу́", "Я пишу́ письмо.", "Sto scrivendo una lettera."),
      vf("Presente – tu", "пи́шешь", "Ты пи́шешь бы́стро.", "Scrivi velocemente."),
      vf("Passato (processo)", "писа́л", "Вчера я до́лго писа́л.", "Ieri ho scritto a lungo (senza finire)."),
      ],
      "написа́ть",
      [
      vf("Passato (risultato)", "написа́л", "Я написа́л письмо.", "Ho scritto la lettera (finita)."),
      vf("Futuro – io", "напишу́", "Я напишу́ тебе завтра.", "Ti scriverò domani."),
      vf("Imperativo", "напиши́", "Напиши́ мне!", "Scrivimi (tutto)!"),
      ],
      "scrivere",
      "Coppia con prefisso на-: писать è il processo dello scrivere, написать il risultato — la lettera finita.",
      sq("Ho appena finito di scrivere la lettera.", "Я написа́л письмо.", "perfettivo", "Я пишу́ письмо.", "imperfettivo")
    ),
    vbPair(
      "ви́деть",
      [
      vf("Presente – io", "ви́жу", "Я ви́жу море отсюда.", "Vedo il mare da qui."),
      vf("Presente – tu", "ви́дишь", "Ты ви́дишь его?", "Lo vedi?"),
      vf("Passato (processo)", "ви́дел", "Раньше я ви́дел пло́хо.", "Prima vedevo male."),
      ],
      "уви́деть",
      [
      vf("Passato (risultato)", "уви́дел", "Я уви́дел друга на улице.", "Ho visto un amico per strada (un istante)."),
      vf("Futuro – io", "уви́жу", "Я уви́жу тебя завтра.", "Ti vedrò domani."),
      vf("Futuro – tu", "уви́дишь", "Ты уви́дишь результат.", "Vedrai il risultato."),
      ],
      "vedere",
      "Coppia con prefisso у-: видеть è la capacità/il processo del vedere, увидеть l'atto di scorgere qualcosa in un momento preciso.",
      sq("All'improvviso ho visto un arcobaleno.", "Я уви́дел ра́дугу.", "perfettivo", "Я ви́дел ра́дугу.", "imperfettivo")
    ),
    vbPair(
      "люби́ть",
      [
      vf("Presente – io", "люблю́", "Я люблю́ музыку.", "Amo la musica."),
      vf("Presente – lei", "лю́бит", "Она лю́бит читать.", "Le piace leggere."),
      vf("Passato (stato)", "люби́л", "Он люби́л её мно́го лет.", "L'ha amata per molti anni."),
      ],
      "полюби́ть",
      [
      vf("Passato (inizio)", "полюби́л", "Он полюби́л её с первого взгляда.", "Se ne innamorò a prima vista."),
      vf("Futuro – io", "полюблю́", "Я полюблю́ э́тот го́род.", "Finirò per amare questa città."),
      vf("Futuro – tu", "полю́бишь", "Ты полю́бишь эту книгу.", "Finirai per amare questo libro."),
      ],
      "amare / innamorarsi",
      "Любить descrive un sentimento stabile e duraturo; полюбить (con prefisso по-) ne indica l'inizio: 'iniziare ad amare'.",
      sq("Se ne è innamorato appena l'ha vista.", "Он полюби́л её сра́зу.", "perfettivo", "Он люби́л её сра́зу.", "imperfettivo")
    ),
    vbPair(
      "знать",
      [
      vf("Presente – io", "зна́ю", "Я зна́ю ответ.", "So la risposta."),
      vf("Presente – tu", "зна́ешь", "Ты зна́ешь его?", "Lo conosci?"),
      vf("Passato (stato)", "знал", "Я давно э́то знал.", "Lo sapevo già da tempo."),
      ],
      "узна́ть",
      [
      vf("Passato (risultato)", "узна́л", "Я узна́л но́вость только сейчас.", "Ho saputo la notizia solo ora."),
      vf("Futuro – io", "узна́ю", "Я узна́ю правду.", "Verrò a sapere la verità."),
      vf("Imperativo", "узна́й", "Узна́й, где он.", "Scopri dov'è."),
      ],
      "sapere / venire a sapere",
      "Знать è uno stato (sapere già qualcosa); узнать (prefisso у-) è l'atto di venire a conoscenza di qualcosa in un momento preciso.",
      sq("Ho appena saputo la notizia.", "Я узна́л но́вость.", "perfettivo", "Я знал но́вость.", "imperfettivo")
    ),
    vbPair(
      "идти́",
      [
      vf("Presente – io", "иду́", "Я иду́ в шко́лу.", "Sto andando a scuola."),
      vf("Presente – tu", "идёшь", "Куда́ ты идёшь?", "Dove stai andando?"),
      vf("Passato (processo)", "шёл", "Я шёл домо́й, когда пошёл дождь.", "Stavo andando a casa quando ha iniziato a piovere."),
      ],
      "прийти́",
      [
      vf("Passato (risultato)", "пришёл", "Я пришёл домо́й по́здно.", "Sono arrivato a casa tardi."),
      vf("Futuro – io", "приду́", "Я приду́ через час.", "Arriverò tra un'ora."),
      vf("Imperativo", "приди́", "Приди́ вовремя!", "Arriva in orario!"),
      ],
      "andare (a piedi) / arrivare",
      "Идти descrive il movimento in corso verso una direzione; прийти (con prefisso при-) indica l'arrivo, il completamento del percorso.",
      sq("Sono appena arrivato a casa.", "Я пришёл домо́.", "perfettivo", "Я шёл домо́.", "imperfettivo")
    ),
    vbPair(
      "де́лать",
      [
      vf("Presente – io", "де́лаю", "Я де́лаю уроки.", "Sto facendo i compiti."),
      vf("Presente – tu", "де́лаешь", "Что ты де́лаешь?", "Cosa stai facendo?"),
      vf("Passato (processo)", "де́лал", "Я до́лго де́лал э́то.", "Ci ho messo tempo a farlo."),
      ],
      "сде́лать",
      [
      vf("Passato (risultato)", "сде́лал", "Я сде́лал уроки.", "Ho fatto i compiti (finiti)."),
      vf("Futuro – io", "сде́лаю", "Я сде́лаю э́то завтра.", "Lo farò domani."),
      vf("Imperativo", "сде́лай", "Сде́лай э́то сейчас!", "Fallo adesso!"),
      ],
      "fare",
      "Делать è il fare come processo, сделать il completamento dell'azione.",
      sq("Ho appena finito di fare i compiti.", "Я сде́лал уро́ки.", "perfettivo", "Я де́лал уро́ки.", "imperfettivo")
    ),
    vbPair(
      "начина́ть",
      [
      vf("Presente – io", "начина́ю", "Я начина́ю урок.", "Sto iniziando la lezione."),
      vf("Presente – tu", "начина́ешь", "Когда ты начина́ешь рабо́ту?", "Quando inizi il lavoro?"),
      vf("Passato (processo)", "начина́л", "Я начина́л говорить, но замолчал.", "Stavo iniziando a parlare, ma mi sono fermato."),
      ],
      "нача́ть",
      [
      vf("Passato (risultato)", "нача́л", "Я нача́л новую книгу.", "Ho iniziato un nuovo libro."),
      vf("Futuro – io", "начну́", "Я начну́ завтра.", "Inizierò domani."),
      vf("Imperativo", "начни́", "Начни́ сейчас же!", "Inizia subito!"),
      ],
      "iniziare",
      "Начинать è l'avviarsi di un'azione come processo, начать l'atto specifico di darle inizio.",
      sq("Ho appena iniziato un nuovo libro.", "Я нача́л но́вую кни́гу.", "perfettivo", "Я начина́л но́вую кни́гу.", "imperfettivo")
    ),
    vbPair(
      "зака́нчивать",
      [
      vf("Presente – io", "зака́нчиваю", "Я зака́нчиваю рабо́ту в пять.", "Finisco il lavoro alle cinque."),
      vf("Presente – tu", "зака́нчиваешь", "Ты зака́нчиваешь шко́лу?", "Stai finendo la scuola?"),
      vf("Passato (processo)", "зака́нчивал", "Я зака́нчивал проект весь день.", "Ho passato tutto il giorno a finire il progetto."),
      ],
      "зако́нчить",
      [
      vf("Passato (risultato)", "зако́нчил", "Я зако́нчил рабо́ту.", "Ho finito il lavoro."),
      vf("Futuro – io", "закончу́", "Я закончу́ к вечеру.", "Finirò per sera."),
      vf("Imperativo", "зако́нчи", "Зако́нчи быстрее!", "Finisci più in fretta!"),
      ],
      "finire",
      "Заканчивать è il finire come processo, закончить il completamento effettivo.",
      sq("Ho appena finito il lavoro.", "Я зако́нчил рабо́ту.", "perfettivo", "Я зака́нчивал рабо́ту.", "imperfettivo")
    ),
    vbPair(
      "закрыва́ть",
      [
      vf("Presente – io", "закрыва́ю", "Я закрыва́ю окно.", "Sto chiudendo la finestra."),
      vf("Presente – tu", "закрыва́ешь", "Ты закрыва́ешь дверь?", "Stai chiudendo la porta?"),
      vf("Passato (processo)", "закрыва́л", "Я закрыва́л магазин каждый вечер.", "Chiudevo il negozio ogni sera."),
      ],
      "закры́ть",
      [
      vf("Passato (risultato)", "закры́л", "Я закры́л окно.", "Ho chiuso la finestra."),
      vf("Futuro – io", "закро́ю", "Я закро́ю дверь.", "Chiuderò la porta."),
      vf("Imperativo", "закро́й", "Закро́й окно!", "Chiudi la finestra!"),
      ],
      "chiudere",
      "Закрывать è il chiudere come processo, закрыть il completamento — la cosa risulta chiusa.",
      sq("Ho appena chiuso la finestra perché fa freddo.", "Я закры́л окно́.", "perfettivo", "Я закрыва́л окно́.", "imperfettivo")
    ),
    vbPair(
      "теря́ть",
      [
      vf("Presente – io", "теря́ю", "Я теря́ю терпение.", "Sto perdendo la pazienza."),
      vf("Presente – tu", "теря́ешь", "Ты теря́ешь время.", "Stai perdendo tempo."),
      vf("Passato (processo)", "теря́л", "Я часто теря́л ключи.", "Perdevo spesso le chiavi."),
      ],
      "потеря́ть",
      [
      vf("Passato (risultato)", "потеря́л", "Я потеря́л телефон.", "Ho perso il telefono."),
      vf("Futuro – io", "потеря́ю", "Я не потеря́ю надежду.", "Non perderò la speranza."),
      vf("Imperativo (negativo)", "не потеря́й", "Не потеря́й билет!", "Non perdere il biglietto!"),
      ],
      "perdere",
      "Терять è il perdere come tendenza/processo, потерять l'atto specifico di aver perso qualcosa.",
      sq("Ho appena perso il telefono in autobus.", "Я потеря́л телефо́н.", "perfettivo", "Я теря́л телефо́н.", "imperfettivo")
    ),
    vbPair(
      "находи́ть",
      [
      vf("Presente – io", "нахожу́", "Я нахожу́ решения бы́стро.", "Trovo soluzioni velocemente."),
      vf("Presente – tu", "нахо́дишь", "Ты всегда нахо́дишь причину.", "Trovi sempre una scusa."),
      vf("Passato (processo)", "находи́л", "Я до́лго находи́л ошибки в тексте.", "Ho passato tempo a trovare errori nel testo."),
      ],
      "найти́",
      [
      vf("Passato (risultato)", "нашёл", "Я нашёл ключи́.", "Ho trovato le chiavi."),
      vf("Futuro – io", "найду́", "Я найду́ решение.", "Troverò una soluzione."),
      vf("Imperativo", "найди́", "Найди́ мой телефон!", "Trova il mio telefono!"),
      ],
      "trovare",
      "Находить è il trovare come processo/abitudine, найти (irregolare) l'atto singolo di aver trovato qualcosa.",
      sq("Ho appena trovato le chiavi perse.", "Я нашёл ключи́.", "perfettivo", "Я находи́л ключи́.", "imperfettivo")
    ),
    vbPair(
      "спра́шивать",
      [
      vf("Presente – io", "спра́шиваю", "Я спра́шиваю дорогу.", "Sto chiedendo la strada."),
      vf("Presente – tu", "спра́шиваешь", "Ты часто спра́шиваешь совета.", "Chiedi spesso consiglio."),
      vf("Passato (processo)", "спра́шивал", "Я мно́го раз спра́шивал об э́том.", "Ho chiesto molte volte di questo."),
      ],
      "спроси́ть",
      [
      vf("Passato (risultato)", "спроси́л", "Я спроси́л его имя.", "Ho chiesto il suo nome."),
      vf("Futuro – io", "спрошу́", "Я спрошу́ учителя.", "Chiederò all'insegnante."),
      vf("Imperativo", "спроси́", "Спроси́ его сейчас!", "Chiediglielo ora!"),
      ],
      "chiedere",
      "Спрашивать è il chiedere come processo/abitudine, спросить l'atto specifico di porre una domanda.",
      sq("Gli ho appena chiesto il suo nome.", "Я спроси́л его и́мя.", "perfettivo", "Я спра́шивал его и́мя.", "imperfettivo")
    ),
    vbPair(
      "отвеча́ть",
      [
      vf("Presente – io", "отвеча́ю", "Я отвеча́ю на письма.", "Sto rispondendo alle lettere."),
      vf("Presente – tu", "отвеча́ешь", "Ты не отвеча́ешь на звонки.", "Non rispondi alle chiamate."),
      vf("Passato (processo)", "отвеча́л", "Он всегда отвеча́л вежливо.", "Rispondeva sempre gentilmente."),
      ],
      "отве́тить",
      [
      vf("Passato (risultato)", "отве́тил", "Я отве́тил на вопро́с.", "Ho risposto alla domanda."),
      vf("Futuro – io", "отве́чу", "Я отве́чу завтра.", "Risponderò domani."),
      vf("Imperativo", "отве́ть", "Отве́ть мне честно!", "Rispondimi onestamente!"),
      ],
      "rispondere",
      "Отвечать è il rispondere come processo/abitudine, ответить l'atto specifico di dare una risposta.",
      sq("Ho appena risposto alla sua domanda.", "Я отве́тил на вопро́с.", "perfettivo", "Я отвеча́л на вопро́с.", "imperfettivo")
    ),
    vbPair(
      "уходи́ть",
      [
      vf("Presente – io", "ухожу́", "Я ухожу́ в шесть.", "Me ne vado alle sei."),
      vf("Presente – tu", "ухо́дишь", "Куда ты ухо́дишь?", "Dove te ne vai?"),
      vf("Passato (processo)", "уходи́л", "Он часто уходи́л ра́но.", "Se ne andava spesso presto."),
      ],
      "уйти́",
      [
      vf("Passato (risultato)", "ушёл", "Он ушёл домо́й.", "Se n'è andato a casa."),
      vf("Futuro – io", "уйду́", "Я уйду́ через час.", "Me ne andrò tra un'ora."),
      vf("Imperativo", "уйди́", "Уйди́ отсюда!", "Vattene da qui!"),
      ],
      "andarsene",
      "Уходить è il processo dell'andarsene, уйти (irregolare) l'atto completo di essersene andati.",
      sq("Se n'è appena andato a casa.", "Он ушёл домо́.", "perfettivo", "Он уходи́л домо́й.", "imperfettivo")
    ),
    vbPair(
      "просыпа́ться",
      [
      vf("Presente – io", "просыпа́юсь", "Я просыпа́юсь ра́но.", "Mi sveglio presto."),
      vf("Presente – tu", "просыпа́ешься", "Ты просыпа́ешься по́здно.", "Ti svegli tardi."),
      vf("Passato (processo)", "просыпа́лся", "Раньше я просыпа́лся в семь.", "Prima mi svegliavo alle sette."),
      ],
      "просну́ться",
      [
      vf("Passato (risultato)", "просну́лся", "Я просну́лся в шесть.", "Mi sono svegliato alle sei."),
      vf("Futuro – io", "просну́сь", "Я просну́сь ра́но завтра.", "Domani mi sveglierò presto."),
      vf("Imperativo", "просни́сь", "Просни́сь уже!", "Svegliati ormai!"),
      ],
      "svegliarsi",
      "Просыпаться è lo svegliarsi come processo/abitudine, проснуться l'atto specifico di essersi svegliati.",
      sq("Mi sono svegliato molto presto stamattina.", "Я просну́лся о́чень ра́но.", "perfettivo", "Я просыпа́лся о́чень ра́но.", "imperfettivo")
    ),
    vbPair(
      "встава́ть",
      [
      vf("Presente – io", "встаю́", "Я встаю́ в семь.", "Mi alzo alle sette."),
      vf("Presente – tu", "встаёшь", "Когда́ ты встаёшь?", "Quando ti alzi?"),
      vf("Passato (processo)", "встава́л", "Раньше я встава́л по́здно.", "Prima mi alzavo tardi."),
      ],
      "встать",
      [
      vf("Passato (risultato)", "встал", "Я встал ра́но.", "Mi sono alzato presto."),
      vf("Futuro – io", "вста́ну", "Я вста́ну в шесть.", "Mi alzerò alle sei."),
      vf("Imperativo", "встань", "Встань неме́дленно!", "Alzati immediatamente!"),
      ],
      "alzarsi",
      "Вставать è l'alzarsi come processo/abitudine, встать (irregolare) l'atto specifico di essersi alzati.",
      sq("Mi sono alzato presto stamattina, un fatto compiuto.", "Я встал ра́но у́тром.", "perfettivo", "Я встава́л ра́но у́тром.", "imperfettivo")
    ),
    vbPair(
      "ложи́ться",
      [
      vf("Presente – io", "ложу́сь", "Я ложу́сь в десять.", "Mi corico alle dieci."),
      vf("Presente – tu", "ло́жишься", "Ты по́здно ло́жишься.", "Ti corichi tardi."),
      vf("Passato (processo)", "ложи́лся", "Раньше я ложи́лся ра́но.", "Prima mi coricavo presto."),
      ],
      "лечь",
      [
      vf("Passato (risultato)", "лёг", "Я лёг спать по́здно.", "Mi sono coricato tardi."),
      vf("Futuro – io", "ля́гу", "Я ля́гу пораньше.", "Mi coricherò un po' prima."),
      vf("Imperativo", "ляг", "Ляг уже́ спать!", "Vai a coricarti ormai!"),
      ],
      "coricarsi",
      "Ложиться è il coricarsi come processo/abitudine, лечь (irregolare) l'atto specifico di essersi coricati.",
      sq("Ieri mi sono coricato molto tardi, un fatto compiuto.", "Вчера́ я лёг о́чень по́здно.", "perfettivo", "Вчера́ я ложи́лся о́чень по́здно.", "imperfettivo")
    ),
    vbPair(
      "одева́ться",
      [
      vf("Presente – io", "одева́юсь", "Я одева́юсь бы́стро.", "Mi vesto velocemente."),
      vf("Presente – tu", "одева́ешься", "Ты до́лго одева́ешься.", "Ci metti tanto a vestirti."),
      vf("Passato (processo)", "одева́лся", "Я одева́лся, когда ты позвонил.", "Mi stavo vestendo quando hai chiamato."),
      ],
      "оде́ться",
      [
      vf("Passato (risultato)", "оде́лся", "Я оде́лся и вышел.", "Mi sono vestito e sono uscito."),
      vf("Futuro – io", "оде́нусь", "Я оде́нусь тепло́.", "Mi vestirò pesante."),
      vf("Imperativo", "оде́нься", "Оде́нься теплее!", "Vestiti più pesante!"),
      ],
      "vestirsi",
      "Одеваться è il vestirsi come processo, одеться il completamento — essere già vestiti.",
      sq("Mi sono appena vestito e sono pronto a uscire.", "Я оде́лся и гото́в вы́йти.", "perfettivo", "Я одева́лся и гото́в вы́йти.", "imperfettivo")
    ),
    vbPair(
      "мыть",
      [
      vf("Presente – io", "мо́ю", "Я мо́ю посуду.", "Sto lavando i piatti."),
      vf("Presente – tu", "мо́ешь", "Ты мо́ешь руки?", "Ti stai lavando le mani?"),
      vf("Passato (processo)", "мыл", "Я до́лго мыл машину.", "Ho lavato la macchina a lungo."),
      ],
      "помы́ть",
      [
      vf("Passato (risultato)", "помы́л", "Я помы́л посуду.", "Ho lavato i piatti (finiti)."),
      vf("Futuro – io", "помо́ю", "Я помо́ю руки.", "Mi laverò le mani."),
      vf("Imperativo", "помо́й", "Помо́й руки!", "Lavati le mani!"),
      ],
      "lavare",
      "Мыть è il lavare come processo, помыть il completamento dell'azione di lavare.",
      sq("Ho appena finito di lavare tutti i piatti.", "Я помы́л всю посу́ду.", "perfettivo", "Я мыл всю посу́ду.", "imperfettivo")
    ),
    vbPair(
      "игра́ть",
      [
      vf("Presente – io", "игра́ю", "Я игра́ю в футбол.", "Gioco a calcio."),
      vf("Presente – tu", "игра́ешь", "Ты игра́ешь на гитаре?", "Suoni la chitarra?"),
      vf("Passato (processo)", "игра́л", "Я игра́л весь день.", "Ho giocato tutto il giorno."),
      ],
      "сыгра́ть",
      [
      vf("Passato (risultato)", "сыгра́л", "Мы сыгра́ли па́ртию в ша́хматы.", "Abbiamo giocato una partita a scacchi (finita)."),
      vf("Futuro – io", "сыгра́ю", "Я сыгра́ю с тобой.", "Giocherò con te."),
      vf("Imperativo", "сыгра́й", "Сыгра́й со мной!", "Gioca con me!"),
      ],
      "giocare",
      "Играть è il giocare come processo, сыграть l'atto di giocare una partita specifica fino alla fine.",
      sq("Abbiamo appena finito una partita a scacchi.", "Мы сыгра́ли в ша́хматы.", "perfettivo", "Мы игра́ли в ша́хматы.", "imperfettivo")
    ),
    vbPair(
      "петь",
      [
      vf("Presente – io", "пою́", "Я пою́ в хоре.", "Canto nel coro."),
      vf("Presente – tu", "поёшь", "Ты хорошо́ поёшь.", "Canti bene."),
      vf("Passato (processo)", "пел", "Я пел весь ве́чер.", "Ho cantato tutta la sera."),
      ],
      "спеть",
      [
      vf("Passato (risultato)", "спел", "Я спел э́ту пе́сню.", "Ho cantato questa canzone (fino alla fine)."),
      vf("Futuro – io", "спою́", "Я спою́ для тебя.", "Canterò per te."),
      vf("Imperativo", "спой", "Спой ещё раз!", "Canta ancora una volta!"),
      ],
      "cantare",
      "Петь è il cantare come processo, спеть il completamento — cantare un brano fino alla fine.",
      sq("Ho appena cantato tutta la canzone fino alla fine.", "Я спел э́ту пе́сню.", "perfettivo", "Я пел э́ту пе́сню.", "imperfettivo")
    ),
    vbPair(
      "рисова́ть",
      [
      vf("Presente – io", "рису́ю", "Я рису́ю портрет.", "Sto disegnando un ritratto."),
      vf("Presente – tu", "рису́ешь", "Ты хорошо́ рису́ешь.", "Disegni bene."),
      vf("Passato (processo)", "рисова́л", "Я до́лго рисова́л э́тот пейзаж.", "Ho disegnato a lungo questo paesaggio."),
      ],
      "нарисова́ть",
      [
      vf("Passato (risultato)", "нарисова́л", "Я нарисова́л дом.", "Ho disegnato una casa (finita)."),
      vf("Futuro – io", "нарису́ю", "Я нарису́ю тебя.", "Ti disegnerò."),
      vf("Imperativo", "нарису́й", "Нарису́й мне кота!", "Disegnami un gatto!"),
      ],
      "disegnare",
      "Рисовать è il disegnare come processo, нарисовать il completamento — il disegno finito.",
      sq("Ho appena finito di disegnare la casa.", "Я нарисова́л дом.", "perfettivo", "Я рисова́л дом.", "imperfettivo")
    ),
    vbPair(
      "звони́ть",
      [
      vf("Presente – io", "звоню́", "Я звоню́ маме каждый день.", "Chiamo mia madre ogni giorno."),
      vf("Presente – tu", "звони́шь", "Ты звони́шь другу?", "Stai chiamando un amico?"),
      vf("Passato (processo)", "звони́л", "Я звони́л тебе весь день.", "Ti ho chiamato tutto il giorno."),
      ],
      "позвони́ть",
      [
      vf("Passato (risultato)", "позвони́л", "Я позвони́л другу.", "Ho chiamato un amico (fatto)."),
      vf("Futuro – io", "позвоню́", "Я позвоню́ завтра.", "Chiamerò domani."),
      vf("Imperativo", "позвони́", "Позвони́ мне ве́чером!", "Chiamami stasera!"),
      ],
      "telefonare",
      "Звонить è il telefonare come processo/abitudine, позвонить l'atto specifico di fare una telefonata.",
      sq("Ho appena chiamato mio padre per dirgli la notizia.", "Я позвони́л отцу́.", "perfettivo", "Я звони́л отцу́.", "imperfettivo")
    ),
    vbPair(
      "встреча́ть",
      [
      vf("Presente – io", "встреча́ю", "Я встреча́ю гостей.", "Sto accogliendo gli ospiti."),
      vf("Presente – tu", "встреча́ешь", "Ты встреча́ешь друзей на вокзале?", "Vai a incontrare gli amici alla stazione?"),
      vf("Passato (processo)", "встреча́л", "Я часто встреча́л его в парке.", "Lo incontravo spesso al parco."),
      ],
      "встре́тить",
      [
      vf("Passato (risultato)", "встре́тил", "Я встре́тил старого друга.", "Ho incontrato un vecchio amico."),
      vf("Futuro – io", "встре́чу", "Я встре́чу тебя завтра.", "Ti incontrerò domani."),
      vf("Imperativo", "встреть", "Встре́ть их на вокза́ле!", "Vai a incontrarli alla stazione!"),
      ],
      "incontrare",
      "Встречать è l'incontrare come processo/abitudine, встретить l'atto specifico di aver incontrato qualcuno.",
      sq("Ho appena incontrato un vecchio amico per strada.", "Я встре́тил ста́рого дру́га.", "perfettivo", "Я встреча́л ста́рого дру́га.", "imperfettivo")
    ),
    vbPair(
      "приглаша́ть",
      [
      vf("Presente – io", "приглаша́ю", "Я приглаша́ю друзей часто.", "Invito spesso amici."),
      vf("Presente – tu", "приглаша́ешь", "Ты приглаша́ешь его на праздник?", "Lo inviti alla festa?"),
      vf("Passato (processo)", "приглаша́л", "Я всегда приглаша́л всех.", "Invitavo sempre tutti."),
      ],
      "пригласи́ть",
      [
      vf("Passato (risultato)", "пригласи́л", "Я пригласи́л друзей на ужин.", "Ho invitato gli amici a cena."),
      vf("Futuro – io", "приглашу́", "Я приглашу́ тебя на свадьбу.", "Ti inviterò al matrimonio."),
      vf("Imperativo", "пригласи́", "Пригласи́ их тоже!", "Invita anche loro!"),
      ],
      "invitare",
      "Приглашать è l'invitare come processo/abitudine, пригласить l'atto specifico di aver fatto un invito.",
      sq("Ho appena invitato tutti gli amici a cena.", "Я пригласи́л всех друзе́й на у́жин.", "perfettivo", "Я приглаша́л всех друзе́й на у́жин.", "imperfettivo")
    ),
    vbPair(
      "дари́ть",
      [
      vf("Presente – io", "дарю́", "Я дарю́ цветы на праздники.", "Regalo fiori nelle feste."),
      vf("Presente – tu", "да́ришь", "Ты да́ришь книги?", "Regali libri?"),
      vf("Passato (processo)", "дари́л", "Я всегда дари́л цветы маме.", "Regalavo sempre fiori a mia madre."),
      ],
      "подари́ть",
      [
      vf("Passato (risultato)", "подари́л", "Я подари́л ей цветы.", "Le ho regalato dei fiori."),
      vf("Futuro – io", "подарю́", "Я подарю́ тебе книгу.", "Ti regalerò un libro."),
      vf("Imperativo", "подари́", "Подари́ ей цветы!", "Regalale dei fiori!"),
      ],
      "regalare",
      "Дарить è il regalare come processo/abitudine, подарить l'atto specifico di aver fatto un regalo.",
      sq("Le ho appena regalato dei fiori per il suo compleanno.", "Я подари́л ей цветы́.", "perfettivo", "Я дари́л ей цветы́.", "imperfettivo")
    ),
  ],
  A2: [
    vbPair(
      "смотре́ть",
      [
      vf("Presente – io", "смотрю́", "Я смотрю́ фильм.", "Sto guardando un film."),
      vf("Presente – tu", "смо́тришь", "Что ты смо́тришь?", "Cosa stai guardando?"),
      vf("Passato (processo)", "смотре́л", "Вчера я до́лго смотре́л телевизор.", "Ieri ho guardato la TV a lungo."),
      ],
      "посмотре́ть",
      [
      vf("Passato (risultato)", "посмотре́л", "Я посмотре́л э́тот фильм.", "Ho guardato questo film (fino alla fine)."),
      vf("Futuro – io", "посмотрю́", "Я посмотрю́ но́вости.", "Guarderò il telegiornale."),
      vf("Imperativo", "посмотри́", "Посмотри́ сюда!", "Guarda qui!"),
      ],
      "guardare",
      "Coppia con prefisso по-: смотреть è l'atto di guardare come processo, посмотреть un'occhiata o visione completa e puntuale.",
      sq("Ho appena guardato tutto il film.", "Я посмотре́л фильм.", "perfettivo", "Я смотре́л фильм.", "imperfettivo")
    ),
    vbPair(
      "слы́шать",
      [
      vf("Presente – io", "слы́шу", "Я слы́шу музыку.", "Sento la musica."),
      vf("Presente – lui", "слы́шит", "Он ничего не слы́шит.", "Lui non sente niente."),
      vf("Passato (stato)", "слы́шал", "Раньше я пло́хо слы́шал.", "Prima sentivo male."),
      ],
      "услы́шать",
      [
      vf("Passato (risultato)", "услы́шал", "Я услы́шал шум.", "Ho sentito un rumore (un istante)."),
      vf("Futuro – io", "услы́шу", "Я услы́шу тебя издалека.", "Ti sentirò da lontano."),
      vf("Futuro – tu", "услы́шишь", "Ты услы́шишь звонок.", "Sentirai il campanello."),
      ],
      "sentire, udire",
      "Coppia con prefisso у-: слышать è la capacità di sentire, услышать l'atto di percepire un suono in un istante preciso.",
      sq("Ho sentito un rumore improvviso.", "Я услы́шал шум.", "perfettivo", "Я слы́шал шум.", "imperfettivo")
    ),
    vbPair(
      "покупа́ть",
      [
      vf("Presente – io", "покупа́ю", "Я покупа́ю продукты каждый день.", "Faccio la spesa ogni giorno."),
      vf("Presente – tu", "покупа́ешь", "Что ты покупа́ешь?", "Cosa stai comprando?"),
      vf("Passato (processo)", "покупа́л", "Я до́лго покупа́л подарки.", "Ho fatto shopping per i regali a lungo."),
      ],
      "купи́ть",
      [
      vf("Passato (risultato)", "купи́л", "Я купи́л хлеб.", "Ho comprato il pane (fatto)."),
      vf("Futuro – io", "куплю́", "Я куплю́ билет завтра.", "Comprerò il biglietto domani."),
      vf("Futuro – tu", "ку́пишь", "Что ты ку́пишь?", "Cosa comprerai?"),
      ],
      "comprare",
      "Покупать descrive l'atto di fare acquisti come processo/abitudine, купить il singolo acquisto completato.",
      sq("Ho appena comprato il pane.", "Я купи́л хлеб.", "perfettivo", "Я покупа́л хлеб.", "imperfettivo")
    ),
    vbPair(
      "по́мнить",
      [
      vf("Presente – io", "по́мню", "Я по́мню тебя.", "Mi ricordo di te."),
      vf("Presente – tu", "по́мнишь", "Ты по́мнишь его имя?", "Ricordi il suo nome?"),
      vf("Passato (stato)", "по́мнил", "Я всегда по́мнил об э́том.", "Me ne sono sempre ricordato (stato)."),
      ],
      "вспо́мнить",
      [
      vf("Passato (risultato)", "вспо́мнил", "Я вспо́мнил, где ключи.", "Mi sono ricordato dove sono le chiavi."),
      vf("Futuro – io", "вспо́мню", "Я вспо́мню э́то позже.", "Me ne ricorderò più tardi."),
      vf("Imperativo", "вспо́мни", "Вспо́мни, пожалуйста!", "Ricordati, per favore!"),
      ],
      "ricordare / ricordarsi",
      "Помнить è uno stato (avere in memoria), вспомнить (prefisso вс-) è l'atto di ricordarsi qualcosa in un momento preciso.",
      sq("All'improvviso mi sono ricordato dove sono le chiavi.", "Я вспо́мнил, где ключи.", "perfettivo", "Я по́мнил, где ключи.", "imperfettivo")
    ),
    vbPair(
      "дава́ть",
      [
      vf("Presente – io", "даю́", "Я даю́ тебе совет.", "Ti do un consiglio."),
      vf("Presente – tu", "даёшь", "Ты даёшь мне вре́мя?", "Mi dai tempo?"),
      vf("Passato (processo)", "дава́л", "Он часто дава́л советы.", "Dava consigli spesso."),
      ],
      "дать",
      [
      vf("Passato (risultato)", "дал", "Я дал ему́ кни́гу.", "Gli ho dato il libro."),
      vf("Futuro – io", "дам", "Я дам тебе́ отве́т за́втра.", "Ti darò la risposta domani."),
      vf("Imperativo", "дай", "Дай мне ру́ку!", "Dammi la mano!"),
      ],
      "dare",
      "Давать è il processo del dare (ripetuto o in corso), дать (verbo irregolare) è l'atto singolo e completo di dare qualcosa.",
      sq("Gli ho appena dato il libro.", "Я дал ему кни́гу.", "perfettivo", "Я дава́л ему кни́гу.", "imperfettivo")
    ),
    vbPair(
      "брать",
      [
      vf("Presente – io", "беру́", "Я беру́ такси каждый день.", "Prendo il taxi ogni giorno."),
      vf("Presente – tu", "берёшь", "Что ты берёшь?", "Cosa stai prendendo?"),
      vf("Passato (processo)", "брал", "Он ча́сто брал кни́ги в библиоте́ке.", "Prendeva spesso libri in biblioteca."),
      ],
      "взять",
      [
      vf("Passato (risultato)", "взял", "Я взял такси́.", "Ho preso un taxi (una volta, fatto)."),
      vf("Futuro – io", "возьму́", "Я возьму́ эту книгу.", "Prenderò questo libro."),
      vf("Imperativo", "возьми́", "Возьми́ зонт!", "Prendi l'ombrello!"),
      ],
      "prendere",
      "Coppia suppletiva: брать è il processo del prendere, взять l'atto singolo e completo.",
      sq("Ho preso un taxi stamattina.", "Я взял такси́ у́тром.", "perfettivo", "Я брал такси́ у́тром.", "imperfettivo")
    ),
    vbPair(
      "есть",
      [
      vf("Presente – io", "ем", "Я ем суп.", "Sto mangiando la zuppa."),
      vf("Presente – tu", "ешь", "Что ты ешь?", "Cosa stai mangiando?"),
      vf("Passato (processo)", "ел", "Я до́лго ел.", "Ho mangiato a lungo."),
      ],
      "съесть",
      [
      vf("Passato (risultato)", "съел", "Я съел весь суп.", "Ho mangiato tutta la zuppa (finita)."),
      vf("Futuro – io", "съем", "Я съем я́блоко.", "Mangerò una mela."),
      vf("Imperativo", "съешь", "Съешь э́то, пожалуйста.", "Mangia questo, per favore (tutto)."),
      ],
      "mangiare",
      "Есть (irregolare) descrive il mangiare come processo, съесть (prefisso с-) il completare un piatto o un pasto.",
      sq("Ho appena finito di mangiare tutta la zuppa.", "Я съел весь суп.", "perfettivo", "Я ел весь суп.", "imperfettivo")
    ),
    vbPair(
      "гото́вить",
      [
      vf("Presente – io", "гото́влю", "Я гото́влю ужин.", "Sto cucinando la cena."),
      vf("Presente – tu", "гото́вишь", "Ты гото́вишь суп?", "Stai cucinando la zuppa?"),
      vf("Passato (processo)", "гото́вил", "Я до́лго гото́вил обед.", "Ho cucinato il pranzo per molto tempo."),
      ],
      "пригото́вить",
      [
      vf("Passato (risultato)", "пригото́вил", "Я пригото́вил ужин.", "Ho preparato la cena (pronta)."),
      vf("Futuro – io", "пригото́влю", "Я пригото́влю пасту.", "Preparerò la pasta."),
      vf("Imperativo", "пригото́вь", "Пригото́вь что-нибудь!", "Prepara qualcosa!"),
      ],
      "cucinare",
      "Готовить è il cucinare come processo, приготовить il piatto completato e pronto.",
      sq("Ho appena finito di preparare la cena.", "Я пригото́вил у́жин.", "perfettivo", "Я гото́вил у́жин.", "imperfettivo")
    ),
    vbPair(
      "переводи́ть",
      [
      vf("Presente – io", "перевожу́", "Я перевожу́ текст.", "Sto traducendo il testo."),
      vf("Presente – tu", "перево́дишь", "Ты перево́дишь книги?", "Traduci libri?"),
      vf("Passato (processo)", "переводи́л", "Я до́лго переводи́л статью.", "Ho tradotto l'articolo a lungo."),
      ],
      "перевести́",
      [
      vf("Passato (risultato)", "перевёл", "Я перевёл письмо́.", "Ho tradotto la lettera (finita)."),
      vf("Futuro – io", "переведу́", "Я переведу́ э́то завтра.", "Lo tradurrò domani."),
      vf("Imperativo", "переведи́", "Переведи́ э́то слово!", "Traduci questa parola!"),
      ],
      "tradurre",
      "Переводить è il tradurre come processo, перевести il completamento di una traduzione specifica.",
      sq("Ho appena finito di tradurre la lettera.", "Я перевёл письмо́.", "perfettivo", "Я переводи́л письмо́.", "imperfettivo")
    ),
    vbPair(
      "помога́ть",
      [
      vf("Presente – io", "помога́ю", "Я помога́ю маме.", "Sto aiutando mia madre."),
      vf("Presente – tu", "помога́ешь", "Ты помога́ешь другу?", "Stai aiutando un amico?"),
      vf("Passato (processo)", "помога́л", "Я часто помога́л соседям.", "Aiutavo spesso i vicini."),
      ],
      "помо́чь",
      [
      vf("Passato (risultato)", "помо́г", "Я помо́г другу.", "Ho aiutato un amico (fatto)."),
      vf("Futuro – io", "помогу́", "Я помогу́ тебе завтра.", "Ti aiuterò domani."),
      vf("Imperativo", "помоги́", "Помоги́ мне, пожалуйста!", "Aiutami, per favore!"),
      ],
      "aiutare",
      "Помогать è l'aiutare come processo/abitudine, помочь l'atto specifico di aver dato aiuto.",
      sq("Ho appena aiutato un amico a traslocare.", "Я помо́г дру́гу перее́хать.", "perfettivo", "Я помога́л дру́гу перее́хать.", "imperfettivo")
    ),
    vbPair(
      "лете́ть",
      [
      vf("Presente – io", "лечу́", "Я лечу́ в Москву.", "Sto volando a Mosca."),
      vf("Presente – tu", "лети́шь", "Куда ты лети́шь?", "Dove stai volando?"),
      vf("Passato (processo)", "лете́л", "Самолёт до́лго лете́л.", "L'aereo ha volato a lungo."),
      ],
      "полете́ть",
      [
      vf("Passato (risultato)", "полете́л", "Я полете́л в Италию.", "Sono volato in Italia (partenza compiuta)."),
      vf("Futuro – io", "полечу́", "Я полечу́ завтра.", "Volerò domani."),
      vf("Imperativo", "полети́", "Полети́ со мной!", "Vola con me!"),
      ],
      "volare (in aereo)",
      "Лететь descrive il volo in corso, полететь l'inizio o il completamento del viaggio in volo.",
      sq("Sono appena volato in Italia per lavoro.", "Я полете́л в Ита́лию.", "perfettivo", "Я лете́л в Ита́лию.", "imperfettivo")
    ),
    vbPair(
      "е́хать",
      [
      vf("Presente – io", "е́ду", "Я е́ду на рабо́ту.", "Sto andando al lavoro."),
      vf("Presente – tu", "е́дешь", "Куда ты е́дешь?", "Dove stai andando?"),
      vf("Passato (processo)", "е́хал", "Я до́лго е́хал domой.", "Ho viaggiato a lungo verso casa."),
      ],
      "пое́хать",
      [
      vf("Passato (risultato)", "пое́хал", "Я пое́хал в отпуск.", "Sono partito per le vacanze."),
      vf("Futuro – io", "пое́ду", "Я пое́ду завтра.", "Partirò domani."),
      vf("Imperativo", "поезжа́й", "Поезжа́й осторожно!", "Guida con prudenza!"),
      ],
      "andare (in veicolo)",
      "Ехать descrive il viaggio in corso, поехать l'inizio del viaggio o la sua realizzazione.",
      sq("Sono appena partito per le vacanze.", "Я пое́хал в о́тпуск.", "perfettivo", "Я е́хал в о́тпуск.", "imperfettivo")
    ),
    vbPair(
      "надева́ть",
      [
      vf("Presente – io", "надева́ю", "Я надева́ю пальто.", "Mi sto mettendo il cappotto."),
      vf("Presente – tu", "надева́ешь", "Что ты надева́ешь?", "Cosa ti stai mettendo?"),
      vf("Passato (processo)", "надева́л", "Я до́лго надева́л ботинки.", "Ci ho messo tempo a mettermi gli stivali."),
      ],
      "наде́ть",
      [
      vf("Passato (risultato)", "наде́л", "Я наде́л куртку.", "Mi sono messo la giacca (fatto)."),
      vf("Futuro – io", "наде́ну", "Я наде́ну шапку.", "Mi metterò il cappello."),
      vf("Imperativo", "наде́нь", "Наде́нь шарф!", "Mettiti la sciarpa!"),
      ],
      "indossare, mettersi",
      "Надевать è il mettersi un indumento come processo, надеть il completamento — l'indumento è ormai indossato.",
      sq("Mi sono appena messo la giacca ed sono pronto per uscire.", "Я наде́л ку́ртку.", "perfettivo", "Я надева́л ку́ртку.", "imperfettivo")
    ),
    vbPair(
      "снима́ть",
      [
      vf("Presente – io", "снима́ю", "Я снима́ю обувь дома.", "Mi tolgo le scarpe a casa."),
      vf("Presente – tu", "снима́ешь", "Ты снима́ешь куртку?", "Ti stai togliendo la giacca?"),
      vf("Passato (processo)", "снима́л", "Я снима́л перчатки ме́дленно.", "Mi toglievo i guanti lentamente."),
      ],
      "снять",
      [
      vf("Passato (risultato)", "снял", "Я снял пальто́.", "Mi sono tolto il cappotto (fatto)."),
      vf("Futuro – io", "сниму́", "Я сниму́ шапку.", "Mi toglierò il cappello."),
      vf("Imperativo", "сними", "Сними́ ку́ртку!", "Togliti la giacca!"),
      ],
      "togliersi (vestiti)",
      "Снимать è il togliersi qualcosa come processo, снять il completamento dell'azione.",
      sq("Mi sono appena tolto il cappotto entrando in casa.", "Я снял пальто́.", "perfettivo", "Я снима́л пальто́.", "imperfettivo")
    ),
    vbPair(
      "зака́зывать",
      [
      vf("Presente – io", "зака́зываю", "Я зака́зываю такси.", "Sto ordinando un taxi."),
      vf("Presente – tu", "зака́зываешь", "Ты зака́зываешь пиццу?", "Stai ordinando la pizza?"),
      vf("Passato (processo)", "зака́зывал", "Я всегда зака́зывал одно и то же.", "Ordinavo sempre la stessa cosa."),
      ],
      "заказа́ть",
      [
      vf("Passato (risultato)", "заказа́л", "Я заказа́л такси.", "Ho ordinato un taxi (fatto)."),
      vf("Futuro – io", "закажу́", "Я закажу́ столик.", "Prenoterò un tavolo."),
      vf("Imperativo", "закажи́", "Закажи́ ещё воды!", "Ordina ancora acqua!"),
      ],
      "ordinare",
      "Заказывать è l'ordinare come processo/abitudine, заказать l'atto specifico di fare un ordine.",
      sq("Ho appena ordinato un taxi per l'aeroporto.", "Я заказа́л такси́.", "perfettivo", "Я зака́зывал такси́.", "imperfettivo")
    ),
    vbPair(
      "плати́ть",
      [
      vf("Presente – io", "плачу́", "Я плачу́ за квартиру.", "Pago l'affitto."),
      vf("Presente – tu", "пла́тишь", "Ты пла́тишь наличными?", "Paghi in contanti?"),
      vf("Passato (processo)", "плати́л", "Я всегда плати́л вовремя.", "Pagavo sempre in orario."),
      ],
      "заплати́ть",
      [
      vf("Passato (risultato)", "заплати́л", "Я заплати́л за ужин.", "Ho pagato la cena (fatto)."),
      vf("Futuro – io", "заплачу́", "Я заплачу́ картой.", "Pagherò con la carta."),
      vf("Imperativo", "заплати́", "Заплати́ за нас!", "Paga per noi!"),
      ],
      "pagare",
      "Платить è il pagare come processo/abitudine, заплатить l'atto specifico di aver saldato un conto.",
      sq("Ho appena pagato il conto al ristorante.", "Я заплати́л за у́жин.", "perfettivo", "Я плати́л за у́жин.", "imperfettivo")
    ),
    vbPair(
      "боле́ть",
      [
      vf("Presente – io", "боле́ю", "Я боле́ю гриппом.", "Ho l'influenza (stato)."),
      vf("Presente – tu", "боле́ешь", "Ты часто боле́ешь?", "Ti ammali spesso?"),
      vf("Passato (stato)", "боле́л", "Я до́лго боле́л зимой.", "Sono stato malato a lungo d'inverno."),
      ],
      "заболе́ть",
      [
      vf("Passato (risultato)", "заболе́л", "Я заболе́л вчера.", "Mi sono ammalato ieri (un istante)."),
      vf("Futuro – io", "заболе́ю", "Я не заболе́ю.", "Non mi ammalerò."),
      vf("Futuro – tu", "заболе́ешь", "Ты заболе́ешь, если не оденешься.", "Ti ammalerai se non ti vesti bene."),
      ],
      "essere malato / ammalarsi",
      "Болеть è lo stato di malattia continuo, заболеть l'atto specifico di essersi ammalati.",
      sq("Mi sono ammalato all'improvviso ieri sera.", "Я заболе́л вчера́ ве́чером.", "perfettivo", "Я боле́л вчера́ ве́чером.", "imperfettivo")
    ),
    vbPair(
      "лечи́ть",
      [
      vf("Presente – io", "лечу́", "Я лечу́ пациентов.", "Curo i pazienti."),
      vf("Presente – tu", "ле́чишь", "Ты ле́чишь зубы?", "Curi i denti?"),
      vf("Passato (processo)", "лечи́л", "Врач до́лго лечи́л его.", "Il medico lo ha curato a lungo."),
      ],
      "вы́лечить",
      [
      vf("Passato (risultato)", "вы́лечил", "Врач вы́лечил его.", "Il medico l'ha guarito (completamente)."),
      vf("Futuro – io", "вы́лечу", "Я вы́лечу эту болезнь.", "Guarirò questa malattia."),
      vf("Imperativo", "вы́лечи", "Вы́лечи его скорее!", "Guariscilo presto!"),
      ],
      "curare",
      "Лечить è il curare come processo/trattamento in corso, вылечить il completamento — la guarigione ottenuta.",
      sq("Il medico ha appena guarito completamente il paziente.", "Врач вы́лечил пацие́нта.", "perfettivo", "Врач лечи́л пацие́нта.", "imperfettivo")
    ),
    vbPair(
      "чини́ть",
      [
      vf("Presente – io", "чиню́", "Я чиню́ машину.", "Sto riparando la macchina."),
      vf("Presente – tu", "чи́нишь", "Ты чи́нишь компьютер?", "Stai riparando il computer?"),
      vf("Passato (processo)", "чини́л", "Я до́лго чини́л велосипед.", "Ho riparato la bicicletta a lungo."),
      ],
      "почини́ть",
      [
      vf("Passato (risultato)", "почини́л", "Я почини́л телефон.", "Ho riparato il telefono (fatto)."),
      vf("Futuro – io", "починю́", "Я починю́ э́то завтра.", "Lo riparerò domani."),
      vf("Imperativo", "почини́", "Почини́ кран!", "Ripara il rubinetto!"),
      ],
      "riparare",
      "Чинить è il riparare come processo, починить il completamento — la cosa è di nuovo funzionante.",
      sq("Ho appena finito di riparare il telefono rotto.", "Я почини́л телефо́н.", "perfettivo", "Я чини́л телефо́н.", "imperfettivo")
    ),
    vbPair(
      "лома́ть",
      [
      vf("Presente – io", "лома́ю", "Я лома́ю старую мебель.", "Sto rompendo i vecchi mobili."),
      vf("Presente – tu", "лома́ешь", "Ты лома́ешь игрушки?", "Rompi i giocattoli?"),
      vf("Passato (processo)", "лома́л", "Ребёнок часто лома́л вещи.", "Il bambino rompeva spesso le cose."),
      ],
      "слома́ть",
      [
      vf("Passato (risultato)", "слома́л", "Я слома́л телефон.", "Ho rotto il telefono (fatto)."),
      vf("Futuro – io", "слома́ю", "Я не слома́ю э́то.", "Non lo romperò."),
      vf("Imperativo (negativo)", "не слома́й", "Не слома́й стул!", "Non rompere la sedia!"),
      ],
      "rompere",
      "Ломать è il rompere come processo, сломать il completamento — l'oggetto è ormai rotto.",
      sq("Ho appena rotto per sbaglio il mio telefono.", "Я слома́л телефо́н.", "perfettivo", "Я лома́л телефо́н.", "imperfettivo")
    ),
    vbPair(
      "стро́ить",
      [
      vf("Presente – io", "стро́ю", "Я стро́ю дом.", "Sto costruendo una casa."),
      vf("Presente – tu", "стро́ишь", "Ты стро́ишь планы?", "Stai facendo progetti?"),
      vf("Passato (processo)", "стро́ил", "Они до́лго строили мост.", "Hanno costruito il ponte a lungo."),
      ],
      "постро́ить",
      [
      vf("Passato (risultato)", "постро́ил", "Они постро́или дом.", "Hanno costruito la casa (finita)."),
      vf("Futuro – io", "постро́ю", "Я постро́ю новый план.", "Costruirò un nuovo piano."),
      vf("Imperativo", "постро́й", "Постро́й что-нибудь!", "Costruisci qualcosa!"),
      ],
      "costruire",
      "Строить è il costruire come processo, построить il completamento — l'edificio è finito.",
      sq("Hanno appena finito di costruire la casa nuova.", "Они́ постро́или но́вый дом.", "perfettivo", "Они́ стро́или но́вый дом.", "imperfettivo")
    ),
    vbPair(
      "ра́доваться",
      [
      vf("Presente – io", "ра́дуюсь", "Я ра́дуюсь солнцу.", "Sono felice del sole."),
      vf("Presente – tu", "ра́дуешься", "Ты ра́дуешься подарку?", "Sei contento del regalo?"),
      vf("Passato (stato)", "ра́довался", "Он всегда ра́довался успехам друзей.", "Era sempre felice per i successi degli amici."),
      ],
      "обра́доваться",
      [
      vf("Passato (risultato)", "обра́довался", "Я обра́довался но́вости.", "Mi sono rallegrato della notizia (un istante)."),
      vf("Futuro – io", "обра́дуюсь", "Я обра́дуюсь, если ты придёшь.", "Sarò felice se verrai."),
      vf("Imperativo", "обра́дуйся", "Обра́дуйся хоть немно́го!", "Rallegrati almeno un po'!"),
      ],
      "rallegrarsi",
      "Радоваться è la gioia come stato continuo, обрадоваться l'atto specifico di essersi rallegrati in un momento preciso.",
      sq("Mi sono rallegrato all'improvviso alla notizia.", "Я обра́довался но́вости.", "perfettivo", "Я ра́довался но́вости ка́ждый день.", "imperfettivo")
    ),
    vbPair(
      "пла́кать",
      [
      vf("Presente – io", "пла́чу", "Я пла́чу от радости.", "Sto piangendo di gioia."),
      vf("Presente – tu", "пла́чешь", "Почему ты пла́чешь?", "Perché piangi?"),
      vf("Passato (processo)", "пла́кал", "Ребёнок до́лго пла́кал.", "Il bambino ha pianto a lungo."),
      ],
      "запла́кать",
      [
      vf("Passato (risultato)", "запла́кал", "Он запла́кал внезапно.", "Si è messo a piangere all'improvviso."),
      vf("Futuro – io", "запла́чу", "Я не запла́чу.", "Non mi metterò a piangere."),
      vf("Imperativo (negativo)", "не запла́чь", "Не запла́чь!", "Non metterti a piangere!"),
      ],
      "piangere",
      "Плакать è il piangere come processo, заплакать l'inizio improvviso del pianto.",
      sq("Si è messo a piangere all'improvviso durante il film.", "Он запла́кал внеза́пно.", "perfettivo", "Он пла́кал внеза́пно.", "imperfettivo")
    ),
    vbPair(
      "смея́ться",
      [
      vf("Presente – io", "смею́сь", "Я смею́сь над шуткой.", "Sto ridendo per la battuta."),
      vf("Presente – tu", "смеёшься", "Ты смеёшься надо мной?", "Ti stai ridendo di me?"),
      vf("Passato (processo)", "смея́лся", "Мы до́лго смеялись вместе.", "Abbiamo riso insieme a lungo."),
      ],
      "засмея́ться",
      [
      vf("Passato (risultato)", "засмея́лся", "Он засмея́лся гро́мко.", "Ha scoppiato a ridere forte."),
      vf("Futuro – io", "засмею́сь", "Я засмею́сь, если э́то правда.", "Scoppierò a ridere se è vero."),
      vf("Imperativo (negativo)", "не засме́йся", "Не засме́йся!", "Non metterti a ridere!"),
      ],
      "ridere",
      "Смеяться è il ridere come processo, засмеяться l'inizio improvviso della risata.",
      sq("Ha scoppiato a ridere improvvisamente alla battuta.", "Он засмея́лся внеза́пно.", "perfettivo", "Он смея́лся внеза́пно.", "imperfettivo")
    ),
    vbPair(
      "устава́ть",
      [
      vf("Presente – io", "устаю́", "Я устаю́ на работе.", "Mi stanco al lavoro."),
      vf("Presente – tu", "устаёшь", "Ты устаёшь бы́стро?", "Ti stanchi in fretta?"),
      vf("Passato (processo)", "устава́л", "Раньше я бы́стро устава́л.", "Prima mi stancavo in fretta."),
      ],
      "уста́ть",
      [
      vf("Passato (risultato)", "уста́л", "Я уста́л сего́дня.", "Mi sono stancato oggi (fatto)."),
      vf("Futuro – io", "уста́ну", "Я уста́ну к вечеру.", "Mi stancherò per sera."),
      vf("Imperativo (raro)", "не устава́й", "Не устава́й!", "Non stancarti!"),
      ],
      "stancarsi",
      "Уставать è lo stancarsi come processo/abitudine, устать il completamento — essere ormai stanchi.",
      sq("Mi sono stancato molto oggi al lavoro.", "Я о́чень уста́л сего́дня.", "perfettivo", "Я о́чень устава́л ка́ждый день.", "imperfettivo")
    ),
    vbPair(
      "отдыха́ть",
      [
      vf("Presente – io", "отдыха́ю", "Я отдыха́ю на диване.", "Mi sto riposando sul divano."),
      vf("Presente – tu", "отдыха́ешь", "Ты отдыха́ешь летом?", "Ti riposi d'estate?"),
      vf("Passato (processo)", "отдыха́л", "Я до́лго отдыха́л на море.", "Mi sono riposato a lungo al mare."),
      ],
      "отдохну́ть",
      [
      vf("Passato (risultato)", "отдохну́л", "Я отдохну́л хорошо́.", "Mi sono riposato bene (fatto)."),
      vf("Futuro – io", "отдохну́", "Я отдохну́ завтра.", "Mi riposerò domani."),
      vf("Imperativo", "отдохни́", "Отдохни́ немно́го!", "Riposati un po'!"),
      ],
      "riposarsi",
      "Отдыхать è il riposarsi come processo, отдохнуть il completamento di un periodo di riposo.",
      sq("Mi sono riposato bene durante il weekend.", "Я хорошо́ отдохну́л на выходны́х.", "perfettivo", "Я хорошо́ отдыха́л ка́ждые выходны́е.", "imperfettivo")
    ),
    vbPair(
      "опа́здывать",
      [
      vf("Presente – io", "опа́здываю", "Я опа́здываю на рабо́ту.", "Sto facendo tardi al lavoro."),
      vf("Presente – tu", "опа́здываешь", "Ты всегда опа́здываешь.", "Fai sempre tardi."),
      vf("Passato (processo)", "опа́здывал", "Он часто опа́здывал в шко́лу.", "Faceva spesso tardi a scuola."),
      ],
      "опозда́ть",
      [
      vf("Passato (risultato)", "опозда́л", "Я опозда́л на встречу.", "Ho fatto tardi all'incontro (fatto)."),
      vf("Futuro – io", "опозда́ю", "Я не опозда́ю.", "Non farò tardi."),
      vf("Imperativo (negativo)", "не опозда́й", "Не опозда́й завтра!", "Non fare tardi domani!"),
      ],
      "fare tardi",
      "Опаздывать è il fare tardi come tendenza/abitudine, опоздать l'atto specifico di essere arrivati in ritardo.",
      sq("Ho fatto tardi una volta all'incontro di lavoro.", "Я опозда́л на встре́чу.", "perfettivo", "Я опа́здывал на встре́чу ка́ждый раз.", "imperfettivo")
    ),
    vbPair(
      "торопи́ться",
      [
      vf("Presente – io", "тороплю́сь", "Я тороплю́сь на поезд.", "Mi sto affrettando per il treno."),
      vf("Presente – tu", "торо́пишься", "Куда ты торо́пишься?", "Dove ti stai affrettando?"),
      vf("Passato (processo)", "торопи́лся", "Я торопи́лся весь день.", "Mi sono affrettato tutto il giorno."),
      ],
      "поторопи́ться",
      [
      vf("Passato (risultato)", "поторопи́лся", "Я поторопи́лся и успел.", "Mi sono affrettato e sono arrivato in tempo."),
      vf("Futuro – io", "потороплю́сь", "Я потороплю́сь.", "Mi sbrigherò."),
      vf("Imperativo", "поторопи́сь", "Поторопи́сь, пожалуйста!", "Sbrigati, per favore!"),
      ],
      "affrettarsi",
      "Торопиться è l'affrettarsi come processo continuo, поторопиться l'atto specifico di aver fatto in fretta.",
      sq("Mi sono affrettato una volta e sono riuscito a prendere il treno.", "Я поторопи́лся и успе́л.", "perfettivo", "Я торопи́лся и успе́л.", "imperfettivo")
    ),
  ],
  B1: [
    vbPair(
      "пока́зывать",
      [
      vf("Presente – io", "пока́зываю", "Я пока́зываю фотографии гостям.", "Sto mostrando le foto agli ospiti."),
      vf("Presente – tu", "пока́зываешь", "Что ты пока́зываешь?", "Cosa stai mostrando?"),
      vf("Passato (processo)", "пока́зывал", "Он часто пока́зывал слайды.", "Mostrava spesso le diapositive."),
      ],
      "показа́ть",
      [
      vf("Passato (risultato)", "показа́л", "Я показа́л ему дорогу.", "Gli ho mostrato la strada (fatto)."),
      vf("Futuro – io", "покажу́", "Я покажу́ тебе фото.", "Ti mostrerò la foto."),
      vf("Imperativo", "покажи́", "Покажи́ мне э́то!", "Mostrami questo!"),
      ],
      "mostrare",
      "Показывать è il processo del mostrare (anche ripetuto), показать l'atto singolo e completo.",
      sq("Gli ho appena mostrato la strada.", "Я показа́л ему доро́гу.", "perfettivo", "Я пока́зывал ему доро́гу.", "imperfettivo")
    ),
    vbPair(
      "реша́ть",
      [
      vf("Presente – io", "реша́ю", "Я реша́ю сложную задачу.", "Sto risolvendo un problema difficile."),
      vf("Presente – tu", "реша́ешь", "Что ты реша́ешь?", "Cosa stai decidendo?"),
      vf("Passato (processo)", "реша́л", "Я до́лго реша́л эту проблему.", "Ho lavorato a lungo su questo problema (senza finire)."),
      ],
      "реши́ть",
      [
      vf("Passato (risultato)", "реши́л", "Я реши́л остаться.", "Ho deciso di restare (fatto)."),
      vf("Futuro – io", "решу́", "Я решу́ эту проблему.", "Risolverò questo problema."),
      vf("Imperativo", "реши́", "Реши́ уже э́то!", "Decidilo ormai!"),
      ],
      "decidere, risolvere",
      "Решать descrive il processo del decidere/risolvere, решить il momento in cui la decisione o soluzione è raggiunta.",
      sq("Ho appena deciso di restare.", "Я реши́л оста́ться.", "perfettivo", "Я реша́л оста́ться.", "imperfettivo")
    ),
    vbPair(
      "сове́товать",
      [
      vf("Presente – io", "сове́тую", "Я сове́тую тебе отдохнуть.", "Ti consiglio di riposarti."),
      vf("Presente – lui", "сове́тует", "Врач сове́тует спорт.", "Il medico consiglia lo sport."),
      vf("Passato (processo)", "сове́товал", "Он всегда мне сове́товал быть терпеливым.", "Mi consigliava sempre di essere paziente."),
      ],
      "посове́товать",
      [
      vf("Passato (risultato)", "посове́товал", "Он посове́товал мне книгу.", "Mi ha consigliato un libro (fatto)."),
      vf("Futuro – io", "посове́тую", "Я посове́тую тебе врача.", "Ti consiglierò un medico."),
      vf("Imperativo", "посове́туй", "Посове́туй мне что-нибудь!", "Consigliami qualcosa!"),
      ],
      "consigliare",
      "Советовать è il consigliare come processo/abitudine, посоветовать l'atto singolo di dare un consiglio specifico.",
      sq("Mi ha appena consigliato un buon ristorante.", "Он посове́товал мне рестора́н.", "perfettivo", "Он сове́товал мне рестора́н.", "imperfettivo")
    ),
    vbPair(
      "беспоко́иться",
      [
      vf("Presente – io", "беспоко́юсь", "Я беспоко́юсь о тебе.", "Mi preoccupo per te."),
      vf("Presente – tu", "беспоко́ишься", "Ты беспоко́ишься зря.", "Ti preoccupi inutilmente."),
      vf("Passato (stato)", "беспоко́ился", "Он всегда беспоко́ился о семье.", "Si preoccupava sempre della famiglia."),
      ],
      "побеспоко́иться",
      [
      vf("Passato (risultato)", "побеспоко́ился", "Он побеспоко́ился о билетах заранее.", "Si è preoccupato dei biglietti in anticipo (fatto)."),
      vf("Futuro – io", "побеспоко́юсь", "Я побеспоко́юсь об э́том завтра.", "Me ne preoccuperò domani."),
      vf("Imperativo", "побеспоко́йся", "Побеспоко́йся хоть раз о себе!", "Preoccupati almeno una volta di te stesso!"),
      ],
      "preoccuparsi",
      "Беспокоиться è lo stato di preoccupazione continua, побеспокоиться (prefisso по-) indica il prendersene cura in un momento specifico.",
      sq("Si è già preoccupato di prenotare i biglietti.", "Он побеспоко́ился о биле́тах.", "perfettivo", "Он беспоко́ился о биле́тах.", "imperfettivo")
    ),
    vbPair(
      "учи́ться",
      [
      vf("Presente – io", "учу́сь", "Я учу́сь в университете.", "Studio all'università."),
      vf("Presente – tu", "у́чишься", "Где ты у́чишься?", "Dove studi?"),
      vf("Passato (processo)", "учи́лся", "Я до́лго учи́лся играть на пианино.", "Ho studiato a lungo per suonare il pianoforte."),
      ],
      "научи́ться",
      [
      vf("Passato (risultato)", "научи́лся", "Я научи́лся плавать.", "Ho imparato a nuotare (ci sono riuscito)."),
      vf("Futuro – io", "научу́сь", "Я научу́сь готовить.", "Imparerò a cucinare."),
      vf("Futuro – tu", "нау́чишься", "Ты нау́чишься бы́стро.", "Imparerai velocemente."),
      ],
      "studiare / imparare",
      "Учиться è il processo dello studiare, научиться (prefisso на-) indica il raggiungimento di una competenza.",
      sq("Ho finalmente imparato a nuotare.", "Я научи́лся пла́вать.", "perfettivo", "Я учи́лся пла́вать.", "imperfettivo")
    ),
    vbPair(
      "забыва́ть",
      [
      vf("Presente – io", "забыва́ю", "Я часто забыва́ю имена.", "Dimentico spesso i nomi."),
      vf("Presente – tu", "забыва́ешь", "Ты всё забыва́ешь.", "Dimentichi tutto."),
      vf("Passato (processo)", "забыва́л", "Он часто забыва́л ключи.", "Dimenticava spesso le chiavi."),
      ],
      "забы́ть",
      [
      vf("Passato (risultato)", "забы́л", "Я забы́л ключи дома.", "Ho dimenticato le chiavi a casa (oggi, fatto)."),
      vf("Futuro – io", "забу́ду", "Я не забу́ду э́то.", "Non lo dimenticherò."),
      vf("Imperativo (negativo)", "не забу́дь", "Не забу́дь зонт!", "Non dimenticare l'ombrello!"),
      ],
      "dimenticare",
      "Забывать descrive il dimenticare come tendenza/processo, забыть l'atto specifico di aver dimenticato qualcosa.",
      sq("Ho dimenticato le chiavi a casa stamattina.", "Я забы́л ключи́ до́ма.", "perfettivo", "Я забыва́л ключи́ до́ма.", "imperfettivo")
    ),
    vbPair(
      "про́бовать",
      [
      vf("Presente – io", "про́бую", "Я про́бую новые рецепты.", "Provo nuove ricette."),
      vf("Presente – tu", "про́буешь", "Ты про́буешь суши?", "Stai assaggiando il sushi?"),
      vf("Passato (processo)", "про́бовал", "Я до́лго про́бовал разные способы.", "Ho provato a lungo diversi metodi."),
      ],
      "попро́бовать",
      [
      vf("Passato (risultato)", "попро́бовал", "Я попро́бовал суши.", "Ho provato il sushi (una volta, fatto)."),
      vf("Futuro – io", "попро́бую", "Я попро́бую ещё раз.", "Ci proverò ancora una volta."),
      vf("Imperativo", "попро́буй", "Попро́буй э́то блюдо!", "Prova questo piatto!"),
      ],
      "provare",
      "Пробовать è il tentare/assaggiare come processo, попробовать (prefisso по-) l'atto singolo di provare qualcosa.",
      sq("Ho appena assaggiato il sushi per la prima volta.", "Я попро́бовал су́ши.", "perfettivo", "Я про́бовал су́ши.", "imperfettivo")
    ),
    vbPair(
      "меня́ть",
      [
      vf("Presente – io", "меня́ю", "Я меня́ю планы часто.", "Cambio spesso i piani."),
      vf("Presente – tu", "меня́ешь", "Ты меня́ешь мнение?", "Stai cambiando idea?"),
      vf("Passato (processo)", "меня́л", "Я до́лго меня́л настройки.", "Ho cambiato le impostazioni a lungo."),
      ],
      "поменя́ть",
      [
      vf("Passato (risultato)", "поменя́л", "Я поменя́л пароль.", "Ho cambiato la password (fatto)."),
      vf("Futuro – io", "поменя́ю", "Я поменя́ю рабо́ту.", "Cambierò lavoro."),
      vf("Imperativo", "поменя́й", "Поменя́й э́то скорее!", "Cambialo presto!"),
      ],
      "cambiare",
      "Менять è il cambiare come processo, поменять l'atto specifico e completato di aver cambiato qualcosa.",
      sq("Ho appena cambiato la password del computer.", "Я поменя́л паро́ль.", "perfettivo", "Я меня́л паро́ль ка́ждый ме́сяц.", "imperfettivo")
    ),
    vbPair(
      "проверя́ть",
      [
      vf("Presente – io", "проверя́ю", "Я проверя́ю почту.", "Sto controllando la posta."),
      vf("Presente – tu", "проверя́ешь", "Ты проверя́ешь домашку?", "Stai controllando i compiti?"),
      vf("Passato (processo)", "проверя́л", "Учитель до́лго проверя́л тесты.", "L'insegnante ha controllato i test a lungo."),
      ],
      "прове́рить",
      [
      vf("Passato (risultato)", "прове́рил", "Я прове́рил докуме́нты.", "Ho controllato i documenti (fatto)."),
      vf("Futuro – io", "прове́рю", "Я прове́рю э́то завтра.", "Lo controllerò domani."),
      vf("Imperativo", "прове́рь", "Прове́рь ещё раз!", "Controlla ancora una volta!"),
      ],
      "controllare",
      "Проверять è il controllare come processo, проверить il completamento della verifica.",
      sq("Ho appena controllato tutti i documenti necessari.", "Я прове́рил все докуме́нты.", "perfettivo", "Я проверя́л докуме́нты весь день.", "imperfettivo")
    ),
    vbPair(
      "сра́внивать",
      [
      vf("Presente – io", "сра́вниваю", "Я сра́вниваю цены.", "Sto confrontando i prezzi."),
      vf("Presente – tu", "сра́вниваешь", "Ты сра́вниваешь варианты?", "Stai confrontando le opzioni?"),
      vf("Passato (processo)", "сра́внивал", "Я до́лго сра́внивал модели.", "Ho confrontato i modelli a lungo."),
      ],
      "сравни́ть",
      [
      vf("Passato (risultato)", "сравни́л", "Я сравни́л результаты.", "Ho confrontato i risultati (fatto)."),
      vf("Futuro – io", "сравню́", "Я сравню́ варианты.", "Confronterò le opzioni."),
      vf("Imperativo", "сравни́", "Сравни́ эти два товара!", "Confronta questi due prodotti!"),
      ],
      "confrontare",
      "Сравнивать è il confrontare come processo, сравнить il completamento del confronto con una conclusione.",
      sq("Ho appena confrontato i due risultati e ho deciso.", "Я сравни́л результа́ты.", "perfettivo", "Я сра́внивал результа́ты весь день.", "imperfettivo")
    ),
    vbPair(
      "выбира́ть",
      [
      vf("Presente – io", "выбира́ю", "Я выбира́ю подарок.", "Sto scegliendo un regalo."),
      vf("Presente – tu", "выбира́ешь", "Ты выбира́ешь цвет?", "Stai scegliendo il colore?"),
      vf("Passato (processo)", "выбира́л", "Я до́лго выбира́л квартиру.", "Ho scelto l'appartamento a lungo."),
      ],
      "вы́брать",
      [
      vf("Passato (risultato)", "вы́брал", "Я вы́брал куртку.", "Ho scelto la giacca (fatto)."),
      vf("Futuro – io", "вы́беру", "Я вы́беру лучший вариант.", "Sceglierò l'opzione migliore."),
      vf("Imperativo", "вы́бери", "Вы́бери сам!", "Scegli tu stesso!"),
      ],
      "scegliere",
      "Выбирать è lo scegliere come processo di valutazione, выбрать l'atto della scelta finale e completata.",
      sq("Ho appena scelto il regalo giusto per lei.", "Я вы́брал пра́вильный пода́рок.", "perfettivo", "Я выбира́л пода́рок весь день.", "imperfettivo")
    ),
    vbPair(
      "покида́ть",
      [
      vf("Presente – io", "покида́ю", "Я покида́ю го́род.", "Sto lasciando la città."),
      vf("Presente – tu", "покида́ешь", "Ты покида́ешь рабо́ту?", "Stai lasciando il lavoro?"),
      vf("Passato (processo)", "покида́л", "Он редко покида́л дом.", "Lasciava di rado la casa."),
      ],
      "поки́нуть",
      [
      vf("Passato (risultato)", "поки́нул", "Он поки́нул страну.", "Ha lasciato il paese (fatto)."),
      vf("Futuro – io", "поки́ну", "Я не поки́ну тебя.", "Non ti abbandonerò."),
      vf("Imperativo (negativo)", "не поки́дай", "Не поки́дай меня!", "Non abbandonarmi!"),
      ],
      "lasciare, abbandonare (un luogo)",
      "Покидать è il lasciare come processo/tendenza, покинуть l'atto specifico di essersene andati.",
      sq("Ha lasciato definitivamente il paese l'anno scorso.", "Он поки́нул страну́ в про́шлом году́.", "perfettivo", "Он покида́л страну́ ка́ждый год.", "imperfettivo")
    ),
    vbPair(
      "поднима́ть",
      [
      vf("Presente – io", "поднима́ю", "Я поднима́ю руку.", "Sto alzando la mano."),
      vf("Presente – tu", "поднима́ешь", "Ты поднима́ешь тяжести?", "Sollevi pesi?"),
      vf("Passato (processo)", "поднима́л", "Он до́лго поднима́л коробку.", "Ha sollevato la scatola a lungo."),
      ],
      "подня́ть",
      [
      vf("Passato (risultato)", "подня́л", "Я подня́л сумку.", "Ho sollevato la borsa (fatto)."),
      vf("Futuro – io", "подниму́", "Я подниму́ цену.", "Alzerò il prezzo."),
      vf("Imperativo", "подними́", "Подними́ руку!", "Alza la mano!"),
      ],
      "alzare, sollevare",
      "Поднимать è il sollevare come processo, поднять il completamento dell'azione.",
      sq("Ho appena sollevato la borsa pesante da terra.", "Я подня́л тяжёлую су́мку.", "perfettivo", "Я поднима́л тяжёлую су́мку.", "imperfettivo")
    ),
    vbPair(
      "опуска́ть",
      [
      vf("Presente – io", "опуска́ю", "Я опуска́ю окно.", "Sto abbassando il finestrino."),
      vf("Presente – tu", "опуска́ешь", "Ты опуска́ешь голову?", "Stai abbassando la testa?"),
      vf("Passato (processo)", "опуска́л", "Он ме́дленно опуска́л руку.", "Abbassava lentamente la mano."),
      ],
      "опусти́ть",
      [
      vf("Passato (risultato)", "опусти́л", "Я опусти́л письмо в ящик.", "Ho imbucato la lettera (fatto)."),
      vf("Futuro – io", "опущу́", "Я опущу́ цену.", "Abbasserò il prezzo."),
      vf("Imperativo", "опусти́", "Опусти́ руку!", "Abbassa la mano!"),
      ],
      "abbassare",
      "Опускать è l'abbassare come processo, опустить il completamento dell'azione.",
      sq("Ho appena imbucato la lettera nella cassetta postale.", "Я опусти́л письмо́ в я́щик.", "perfettivo", "Я опуска́л пи́сьма в я́щик ка́ждый день.", "imperfettivo")
    ),
    vbPair(
      "включа́ть",
      [
      vf("Presente – io", "включа́ю", "Я включа́ю свет.", "Sto accendendo la luce."),
      vf("Presente – tu", "включа́ешь", "Ты включа́ешь телевизор?", "Stai accendendo la TV?"),
      vf("Passato (processo)", "включа́л", "Я включа́л компьютер ме́дленно.", "Accendevo il computer lentamente."),
      ],
      "включи́ть",
      [
      vf("Passato (risultato)", "включи́л", "Я включи́л музыку.", "Ho acceso la musica (fatto)."),
      vf("Futuro – io", "включу́", "Я включу́ свет.", "Accenderò la luce."),
      vf("Imperativo", "включи́", "Включи́ телевизор!", "Accendi la TV!"),
      ],
      "accendere",
      "Включать è l'accendere come processo, включить il completamento — l'apparecchio risulta acceso.",
      sq("Ho appena acceso la musica in salotto.", "Я включи́л му́зыку.", "perfettivo", "Я включа́л му́зыку ка́ждый ве́чер.", "imperfettivo")
    ),
    vbPair(
      "выключа́ть",
      [
      vf("Presente – io", "выключа́ю", "Я выключа́ю свет.", "Sto spegnendo la luce."),
      vf("Presente – tu", "выключа́ешь", "Ты выключа́ешь телефон?", "Stai spegnendo il telefono?"),
      vf("Passato (processo)", "выключа́л", "Он выключа́л всё перед сном.", "Spegneva tutto prima di dormire."),
      ],
      "вы́ключить",
      [
      vf("Passato (risultato)", "вы́ключил", "Я вы́ключил компьютер.", "Ho spento il computer (fatto)."),
      vf("Futuro – io", "вы́ключу", "Я вы́ключу свет.", "Spegnerò la luce."),
      vf("Imperativo", "вы́ключи", "Вы́ключи телевизор!", "Spegni la TV!"),
      ],
      "spegnere",
      "Выключать è lo spegnere come processo, выключить il completamento — l'apparecchio risulta spento.",
      sq("Ho appena spento il computer prima di uscire.", "Я вы́ключил компью́тер.", "perfettivo", "Я выключа́л компью́тер ка́ждый ве́чер.", "imperfettivo")
    ),
    vbPair(
      "добавля́ть",
      [
      vf("Presente – io", "добавля́ю", "Я добавля́ю соль.", "Sto aggiungendo il sale."),
      vf("Presente – tu", "добавля́ешь", "Ты добавля́ешь сахар?", "Stai aggiungendo zucchero?"),
      vf("Passato (processo)", "добавля́л", "Я постепенно добавля́л специи.", "Aggiungevo gradualmente le spezie."),
      ],
      "доба́вить",
      [
      vf("Passato (risultato)", "доба́вил", "Я доба́вил комментарий.", "Ho aggiunto un commento (fatto)."),
      vf("Futuro – io", "доба́влю", "Я доба́влю ещё пункт.", "Aggiungerò un altro punto."),
      vf("Imperativo", "доба́вь", "Доба́вь э́то в список!", "Aggiungilo alla lista!"),
      ],
      "aggiungere",
      "Добавлять è l'aggiungere come processo, добавить il completamento dell'azione di aggiunta.",
      sq("Ho appena aggiunto un ultimo punto alla lista.", "Я доба́вил после́дний пункт.", "perfettivo", "Я добавля́л пу́нкты оди́н за други́м.", "imperfettivo")
    ),
    vbPair(
      "удаля́ть",
      [
      vf("Presente – io", "удаля́ю", "Я удаля́ю файлы.", "Sto cancellando i file."),
      vf("Presente – tu", "удаля́ешь", "Ты удаля́ешь фото?", "Stai cancellando le foto?"),
      vf("Passato (processo)", "удаля́л", "Я до́лго удаля́л старые письма.", "Ho cancellato le vecchie lettere a lungo."),
      ],
      "удали́ть",
      [
      vf("Passato (risultato)", "удали́л", "Я удали́л приложение.", "Ho eliminato l'applicazione (fatto)."),
      vf("Futuro – io", "удалю́", "Я удалю́ э́тот файл.", "Cancellerò questo file."),
      vf("Imperativo", "удали́", "Удали́ э́то сообщение!", "Cancella questo messaggio!"),
      ],
      "rimuovere, cancellare",
      "Удалять è il rimuovere come processo, удалить il completamento — la cosa è ormai cancellata.",
      sq("Ho appena eliminato l'applicazione inutile dal telefono.", "Я удали́л нену́жное приложе́ние.", "perfettivo", "Я удаля́л ста́рые файлы́ весь день.", "imperfettivo")
    ),
    vbPair(
      "сохраня́ть",
      [
      vf("Presente – io", "сохраня́ю", "Я сохраня́ю докуме́нт.", "Sto salvando il documento."),
      vf("Presente – tu", "сохраня́ешь", "Ты сохраня́ешь фото?", "Stai salvando le foto?"),
      vf("Passato (processo)", "сохраня́л", "Я всегда сохраня́л копии.", "Salvavo sempre le copie."),
      ],
      "сохрани́ть",
      [
      vf("Passato (risultato)", "сохрани́л", "Я сохрани́л файл.", "Ho salvato il file (fatto)."),
      vf("Futuro – io", "сохраню́", "Я сохраню́ э́то.", "Lo salverò."),
      vf("Imperativo", "сохрани́", "Сохрани́ докуме́нт!", "Salva il documento!"),
      ],
      "salvare, conservare",
      "Сохранять è il salvare come processo, сохранить il completamento — l'informazione è ormai salvata.",
      sq("Ho appena salvato il documento prima di chiudere il computer.", "Я сохрани́л докуме́нт.", "perfettivo", "Я сохраня́л докуме́нты регуля́рно.", "imperfettivo")
    ),
    vbPair(
      "продолжа́ть",
      [
      vf("Presente – io", "продолжа́ю", "Я продолжа́ю работать.", "Continuo a lavorare."),
      vf("Presente – tu", "продолжа́ешь", "Ты продолжа́ешь учиться?", "Continui a studiare?"),
      vf("Passato (processo)", "продолжа́л", "Он до́лго продолжа́л спорить.", "Continuava a discutere a lungo."),
      ],
      "продо́лжить",
      [
      vf("Passato (risultato)", "продо́лжил", "Я продо́лжил рассказ.", "Ho ripreso il racconto (dopo una pausa)."),
      vf("Futuro – io", "продо́лжу", "Я продо́лжу завтра.", "Continuerò domani."),
      vf("Imperativo", "продо́лжи", "Продо́лжи, пожалуйста!", "Continua, per favore!"),
      ],
      "continuare",
      "Продолжать è il continuare come processo, продолжить il proseguire dopo un'interruzione, con un nuovo inizio.",
      sq("Ho appena ripreso il racconto dopo la pausa.", "Я продо́лжил расска́з по́сле па́узы.", "perfettivo", "Я продолжа́л расска́з до́лго.", "imperfettivo")
    ),
    vbPair(
      "прекраща́ть",
      [
      vf("Presente – io", "прекраща́ю", "Я прекраща́ю спорить.", "Sto smettendo di discutere."),
      vf("Presente – tu", "прекраща́ешь", "Ты прекраща́ешь курить?", "Stai smettendo di fumare?"),
      vf("Passato (processo)", "прекраща́л", "Дождь постепе́нно прекраща́лся.", "La pioggia stava gradualmente cessando."),
      ],
      "прекрати́ть",
      [
      vf("Passato (risultato)", "прекрати́л", "Я прекрати́л рабо́ту.", "Ho smesso il lavoro (fatto)."),
      vf("Futuro – io", "прекращу́", "Я прекращу́ э́то немедленно.", "La smetterò immediatamente."),
      vf("Imperativo", "прекрати́", "Прекрати́ немедленно!", "Smettila immediatamente!"),
      ],
      "smettere, cessare",
      "Прекращать è il cessare come processo, прекратить il momento specifico in cui l'azione si ferma.",
      sq("Ha smesso improvvisamente di piovere.", "Дождь прекрати́лся внеза́пно.", "perfettivo", "Дождь прекраща́лся постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "соглаша́ться",
      [
      vf("Presente – io", "соглаша́юсь", "Я соглаша́юсь с тобой.", "Sono d'accordo con te (in generale)."),
      vf("Presente – tu", "соглаша́ешься", "Ты соглаша́ешься легко́?", "Accetti facilmente?"),
      vf("Passato (processo)", "соглаша́лся", "Он редко соглаша́лся сразу.", "Accettava di rado subito."),
      ],
      "согласи́ться",
      [
      vf("Passato (risultato)", "согласи́лся", "Я согласи́лся на встречу.", "Ho accettato l'incontro (fatto)."),
      vf("Futuro – io", "соглашу́сь", "Я соглашу́сь, если э́то разумно.", "Accetterò se è ragionevole."),
      vf("Imperativo", "согласи́сь", "Согласи́сь хоть раз!", "Accetta almeno una volta!"),
      ],
      "essere d'accordo, accettare",
      "Соглашаться è l'accettare come processo di riflessione, согласиться l'atto specifico di aver dato il proprio assenso.",
      sq("Ho appena accettato di partecipare alla riunione.", "Я согласи́лся уча́ствовать во встре́че.", "perfettivo", "Я соглаша́лся на всё подря́д.", "imperfettivo")
    ),
    vbPair(
      "отка́зываться",
      [
      vf("Presente – io", "отка́зываюсь", "Я отка́зываюсь от сладкого.", "Rinuncio ai dolci."),
      vf("Presente – tu", "отка́зываешься", "Ты отка́зываешься от помощи?", "Rifiuti l'aiuto?"),
      vf("Passato (processo)", "отка́зывался", "Он всегда отка́зывался от денег.", "Rifiutava sempre i soldi."),
      ],
      "отказа́ться",
      [
      vf("Passato (risultato)", "отказа́лся", "Я отказа́лся от предложения.", "Ho rifiutato la proposta (fatto)."),
      vf("Futuro – io", "откажу́сь", "Я откажу́сь от э́того.", "Ci rinuncerò."),
      vf("Imperativo", "откажи́сь", "Откажи́сь от э́того плана!", "Rinuncia a questo piano!"),
      ],
      "rifiutare, rinunciare",
      "Отказываться è il rifiutare come processo/tendenza, отказаться l'atto specifico e definitivo del rifiuto.",
      sq("Ho appena rifiutato la loro proposta di lavoro.", "Я отказа́лся от их предложе́ния.", "perfettivo", "Я отка́зывался от предложе́ний ка́ждый раз.", "imperfettivo")
    ),
    vbPair(
      "развива́ть",
      [
      vf("Presente – io", "развива́ю", "Я развива́ю проект.", "Sto sviluppando il progetto."),
      vf("Presente – tu", "развива́ешь", "Ты развива́ешь бизнес?", "Stai sviluppando l'attività?"),
      vf("Passato (processo)", "развива́л", "Он годами развива́л идею.", "Ha sviluppato l'idea per anni."),
      ],
      "разви́ть",
      [
      vf("Passato (risultato)", "разви́л", "Я разви́л эту тему.", "Ho sviluppato questo argomento (fatto)."),
      vf("Futuro – io", "разовью́", "Я разовью́ эту мысль.", "Svilupperò questo pensiero."),
      vf("Imperativo", "разве́й", "Разве́й эту идею дальше!", "Sviluppa oltre questa idea!"),
      ],
      "sviluppare",
      "Развивать è lo sviluppare come processo graduale, развить il completamento — la cosa è ormai sviluppata.",
      sq("Ho appena sviluppato completamente quell'idea nel documento.", "Я разви́л э́ту иде́ю в докуме́нте.", "perfettivo", "Я развива́л э́ту иде́ю до́лгие го́ды.", "imperfettivo")
    ),
    vbPair(
      "улучша́ть",
      [
      vf("Presente – io", "улучша́ю", "Я улучша́ю навыки.", "Sto migliorando le mie competenze."),
      vf("Presente – tu", "улучша́ешь", "Ты улучша́ешь результат?", "Stai migliorando il risultato?"),
      vf("Passato (processo)", "улучша́л", "Компа́ния постепе́нно улучша́ла се́рвис.", "L'azienda migliorava gradualmente il servizio."),
      ],
      "улу́чшить",
      [
      vf("Passato (risultato)", "улу́чшил", "Я улу́чшил результат.", "Ho migliorato il risultato (fatto)."),
      vf("Futuro – io", "улу́чшу", "Я улу́чшу качество.", "Migliorerò la qualità."),
      vf("Imperativo", "улу́чши", "Улу́чши э́тот текст!", "Migliora questo testo!"),
      ],
      "migliorare",
      "Улучшать è il migliorare come processo graduale, улучшить il completamento — un miglioramento concreto ottenuto.",
      sq("Ho appena migliorato notevolmente il risultato dell'esame.", "Я заме́тно улу́чшил результа́т экза́мена.", "perfettivo", "Я постепе́нно улучша́л свои́ результа́ты.", "imperfettivo")
    ),
    vbPair(
      "ухудша́ть",
      [
      vf("Presente – io", "ухудша́ю", "Я ухудша́ю ситуацию.", "Sto peggiorando la situazione."),
      vf("Presente – tu", "ухудша́ешь", "Ты ухудша́ешь отношения?", "Stai peggiorando i rapporti?"),
      vf("Passato (processo)", "ухудша́л", "Стресс постепенно ухудша́л здоровье.", "Lo stress peggiorava gradualmente la salute."),
      ],
      "уху́дшить",
      [
      vf("Passato (risultato)", "уху́дшил", "Он уху́дшил ситуацию.", "Ha peggiorato la situazione (fatto)."),
      vf("Futuro – io", "уху́дшу", "Я не уху́дшу дело.", "Non peggiorerò le cose."),
      vf("Imperativo (negativo)", "не уху́дши", "Не уху́дши ситуацию!", "Non peggiorare la situazione!"),
      ],
      "peggiorare",
      "Ухудшать è il peggiorare come processo graduale, ухудшить il completamento — un peggioramento concreto avvenuto.",
      sq("La sua decisione ha appena peggiorato la situazione.", "Его́ реше́ние уху́дшило ситуа́цию.", "perfettivo", "Его́ реше́ния постепе́нно ухудша́ли ситуа́цию.", "imperfettivo")
    ),
    vbPair(
      "защища́ть",
      [
      vf("Presente – io", "защища́ю", "Я защища́ю свои права.", "Sto difendendo i miei diritti."),
      vf("Presente – tu", "защища́ешь", "Ты защища́ешь друга?", "Stai difendendo un amico?"),
      vf("Passato (processo)", "защища́л", "Адвокат до́лго защища́л клиента.", "L'avvocato ha difeso a lungo il cliente."),
      ],
      "защити́ть",
      [
      vf("Passato (risultato)", "защити́л", "Я защити́л диссертацию.", "Ho discusso la tesi con successo (fatto)."),
      vf("Futuro – io", "защищу́", "Я защищу́ тебя.", "Ti proteggerò."),
      vf("Imperativo", "защити́", "Защити́ свою идею!", "Difendi la tua idea!"),
      ],
      "proteggere, difendere",
      "Защищать è il proteggere come processo/dovere continuo, защитить l'atto specifico di aver difeso con successo.",
      sq("Ho appena discusso con successo la mia tesi.", "Я защити́л диссерта́цию.", "perfettivo", "Я защища́л диссерта́цию три го́да.", "imperfettivo")
    ),
    vbPair(
      "подде́рживать",
      [
      vf("Presente – io", "подде́рживаю", "Я подде́рживаю друзей.", "Sostengo i miei amici."),
      vf("Presente – tu", "подде́рживаешь", "Ты подде́рживаешь эту идею?", "Sostieni questa idea?"),
      vf("Passato (processo)", "подде́рживал", "Семья́ всегда́ подде́рживала его́.", "La famiglia lo sosteneva sempre."),
      ],
      "поддержа́ть",
      [
      vf("Passato (risultato)", "поддержа́л", "Друг поддержа́л меня.", "Un amico mi ha sostenuto (in un momento preciso)."),
      vf("Futuro – io", "поддержу́", "Я поддержу́ тебя.", "Ti sosterrò."),
      vf("Imperativo", "поддержи́", "Поддержи́ меня сейчас!", "Sostienimi adesso!"),
      ],
      "sostenere, supportare",
      "Поддерживать è il sostenere come processo continuo, поддержать l'atto specifico di aver dato sostegno in un momento preciso.",
      sq("Un amico mi ha sostenuto in un momento difficile specifico.", "Друг поддержа́л меня́ в тру́дный моме́нт.", "perfettivo", "Друг подде́рживал меня́ всегда́.", "imperfettivo")
    ),
  ],
  B2: [
    vbPair(
      "открыва́ть",
      [
      vf("Presente – io", "открыва́ю", "Я открыва́ю окно каждое утро.", "Apro la finestra ogni mattina."),
      vf("Presente – tu", "открыва́ешь", "Ты открыва́ешь дверь?", "Stai aprendo la porta?"),
      vf("Passato (processo)", "открыва́л", "Он до́лго открыва́л банку.", "Ha impiegato tempo ad aprire il barattolo."),
      ],
      "откры́ть",
      [
      vf("Passato (risultato)", "откры́л", "Я откры́л окно.", "Ho aperto la finestra (fatto)."),
      vf("Futuro – io", "откро́ю", "Я откро́ю магазин в девять.", "Aprirò il negozio alle nove."),
      vf("Imperativo", "откро́й", "Откро́й дверь, пожалуйста!", "Apri la porta, per favore!"),
      ],
      "aprire",
      "Открывать è il processo dell'aprire, открыть l'atto completato — la cosa risulta aperta.",
      sq("Ho appena aperto la finestra.", "Я откры́л окно́.", "perfettivo", "Я открыва́л окно́.", "imperfettivo")
    ),
    vbPair(
      "получа́ть",
      [
      vf("Presente – io", "получа́ю", "Я получа́ю письма каждый день.", "Ricevo lettere ogni giorno."),
      vf("Presente – tu", "получа́ешь", "Ты получа́ешь зарплату вовремя?", "Ricevi lo stipendio in orario?"),
      vf("Passato (processo)", "получа́л", "Раньше я получа́л мало писем.", "Prima ricevevo poche lettere."),
      ],
      "получи́ть",
      [
      vf("Passato (risultato)", "получи́л", "Я получи́л письмо.", "Ho ricevuto la lettera (fatto)."),
      vf("Futuro – io", "получу́", "Я получу́ результаты завтра.", "Riceverò i risultati domani."),
      vf("Futuro – tu", "полу́чишь", "Ты полу́чишь ответ скоро.", "Riceverai una risposta presto."),
      ],
      "ricevere",
      "Получать descrive il ricevere come processo/abitudine, получить l'atto specifico di aver ricevuto qualcosa.",
      sq("Ho appena ricevuto la lettera.", "Я получи́л письмо́.", "perfettivo", "Я получа́л письмо́.", "imperfettivo")
    ),
    vbPair(
      "объясня́ть",
      [
      vf("Presente – io", "объясня́ю", "Я объясня́ю грамматику ученикам.", "Sto spiegando la grammatica agli studenti."),
      vf("Presente – tu", "объясня́ешь", "Ты хорошо́ объясня́ешь.", "Spieghi bene."),
      vf("Passato (processo)", "объясня́л", "Учитель до́лго объясня́л тему.", "Il maestro ha spiegato l'argomento a lungo."),
      ],
      "объясни́ть",
      [
      vf("Passato (risultato)", "объясни́л", "Я объясни́л ему всё.", "Gli ho spiegato tutto (fatto, capito)."),
      vf("Futuro – io", "объясню́", "Я объясню́ э́то позже.", "Lo spiegherò più tardi."),
      vf("Imperativo", "объясни́", "Объясни́ мне, пожалуйста!", "Spiegami, per favore!"),
      ],
      "spiegare",
      "Объяснять è la spiegazione come processo, объяснить l'atto completo di aver chiarito qualcosa.",
      sq("Gli ho appena spiegato tutto e ha capito.", "Я объясни́л ему всё.", "perfettivo", "Я объясня́л ему всё.", "imperfettivo")
    ),
    vbPair(
      "предлага́ть",
      [
      vf("Presente – io", "предлага́ю", "Я предлага́ю разные решения.", "Propongo diverse soluzioni."),
      vf("Presente – tu", "предлага́ешь", "Что ты предлага́ешь?", "Cosa proponi?"),
      vf("Passato (processo)", "предлага́л", "Он часто предлага́л помощь.", "Offriva spesso aiuto."),
      ],
      "предложи́ть",
      [
      vf("Passato (risultato)", "предложи́л", "Я предложи́л план.", "Ho proposto un piano (fatto)."),
      vf("Futuro – io", "предложу́", "Я предложу́ альтернативу.", "Proporrò un'alternativa."),
      vf("Imperativo", "предложи́", "Предложи́ что-нибудь!", "Proponi qualcosa!"),
      ],
      "proporre",
      "Предлагать è il proporre come processo/abitudine, предложить l'atto singolo e completo di fare una proposta.",
      sq("Ho appena proposto un nuovo piano alla riunione.", "Я предложи́л план на встре́че.", "perfettivo", "Я предлага́л план на встре́че.", "imperfettivo")
    ),
    vbPair(
      "позволя́ть",
      [
      vf("Presente – io", "позволя́ю", "Я позволя́ю детям играть.", "Permetto ai bambini di giocare."),
      vf("Presente – tu", "позволя́ешь", "Ты позволя́ешь ему многое.", "Gli permetti molto."),
      vf("Passato (processo)", "позволя́л", "Отец всегда позволя́л мне читать допоздна.", "Mio padre mi permetteva sempre di leggere fino a tardi."),
      ],
      "позво́лить",
      [
      vf("Passato (risultato)", "позво́лил", "Он позво́лил мне уйти раньше.", "Mi ha permesso di andarmene prima (fatto)."),
      vf("Futuro – io", "позво́лю", "Я позво́лю тебе выбрать.", "Ti permetterò di scegliere."),
      vf("Imperativo", "позво́ль", "Позво́ль мне помочь!", "Permettimi di aiutare!"),
      ],
      "permettere",
      "Позволять è il permettere come processo/norma generale, позволить l'atto specifico di dare il permesso una volta.",
      sq("Mi ha appena permesso di uscire prima dal lavoro.", "Он позво́лил мне уйти́ ра́ньше.", "perfettivo", "Он позволя́л мне уйти́ ра́ньше.", "imperfettivo")
    ),
    vbPair(
      "замеча́ть",
      [
      vf("Presente – io", "замеча́ю", "Я замеча́ю детали.", "Noto i dettagli."),
      vf("Presente – tu", "замеча́ешь", "Ты замеча́ешь изменения?", "Noti i cambiamenti?"),
      vf("Passato (processo)", "замеча́л", "Я не замеча́л ничего странного.", "Non notavo niente di strano."),
      ],
      "заме́тить",
      [
      vf("Passato (risultato)", "заме́тил", "Я заме́тил ошибку.", "Ho notato un errore (un istante)."),
      vf("Futuro – io", "заме́чу", "Я заме́чу разницу сразу.", "Noterò subito la differenza."),
      vf("Futuro – tu", "заме́тишь", "Ты заме́тишь э́то позже.", "Lo noterai più tardi."),
      ],
      "notare",
      "Замечать è il notare come capacità/tendenza, заметить l'atto di accorgersi di qualcosa in un istante preciso.",
      sq("Ho notato un errore all'improvviso nel testo.", "Я заме́тил оши́бку.", "perfettivo", "Я замеча́л оши́бку.", "imperfettivo")
    ),
    vbPair(
      "справля́ться",
      [
      vf("Presente – io", "справля́юсь", "Я справля́юсь с работой.", "Sto gestendo il lavoro (in corso)."),
      vf("Presente – tu", "справля́ешься", "Ты справля́ешься со стрессом?", "Stai gestendo lo stress?"),
      vf("Passato (processo)", "справля́лся", "Он всегда справля́лся с трудностями.", "Ha sempre gestito le difficoltà (in generale)."),
      ],
      "спра́виться",
      [
      vf("Passato (risultato)", "спра́вился", "Я спра́вился с задачей.", "Ce l'ho fatta col compito (finito con successo)."),
      vf("Futuro – io", "спра́влюсь", "Я спра́влюсь с этим сам.", "Ce la farò da solo."),
      vf("Futuro – tu", "спра́вишься", "Ты спра́вишься с этим.", "Ce la farai."),
      ],
      "farcela, gestire",
      "Справляться è il gestire una situazione come processo continuo, справиться l'atto di esserne venuti a capo con successo.",
      sq("Alla fine ce l'ho fatta con quel compito difficile.", "Я спра́вился с зада́чей.", "perfettivo", "Я справля́лся с зада́чей.", "imperfettivo")
    ),
    vbPair(
      "подпи́сывать",
      [
      vf("Presente – io", "подпи́сываю", "Я подпи́сываю докуме́нты.", "Sto firmando i documenti."),
      vf("Presente – tu", "подпи́сываешь", "Ты подпи́сываешь контракт?", "Stai firmando il contratto?"),
      vf("Passato (processo)", "подпи́сывал", "Я до́лго подпи́сывал бумаги.", "Ho firmato le carte a lungo."),
      ],
      "подписа́ть",
      [
      vf("Passato (risultato)", "подписа́л", "Я подписа́л договор.", "Ho firmato il contratto (fatto)."),
      vf("Futuro – io", "подпишу́", "Я подпишу́ э́то завтра.", "Lo firmerò domani."),
      vf("Imperativo", "подпиши́", "Подпиши́ здесь!", "Firma qui!"),
      ],
      "firmare",
      "Подписывать è il firmare come processo, подписать il completamento della firma.",
      sq("Ho appena firmato il contratto definitivo.", "Я подписа́л догово́р.", "perfettivo", "Я подпи́сывал догово́р до́лго.", "imperfettivo")
    ),
    vbPair(
      "подпи́сываться",
      [
      vf("Presente – io", "подпи́сываюсь", "Я подпи́сываюсь на журнал.", "Mi sto abbonando alla rivista."),
      vf("Presente – tu", "подпи́сываешься", "Ты подпи́сываешься на канал?", "Ti iscrivi al canale?"),
      vf("Passato (processo)", "подпи́сывался", "Я до́лго подпи́сывался на рассылки.", "Mi sono iscritto alle newsletter a lungo."),
      ],
      "подписа́ться",
      [
      vf("Passato (risultato)", "подписа́лся", "Я подписа́лся на рассылку.", "Mi sono iscritto alla newsletter (fatto)."),
      vf("Futuro – io", "подпишу́сь", "Я подпишу́сь завтра.", "Mi iscriverò domani."),
      vf("Imperativo", "подпиши́сь", "Подпиши́сь на канал!", "Iscriviti al canale!"),
      ],
      "iscriversi, abbonarsi",
      "Подписываться è l'iscriversi come processo, подписаться il completamento dell'iscrizione.",
      sq("Mi sono appena iscritto al canale che mi hai consigliato.", "Я подписа́лся на кана́л.", "perfettivo", "Я подпи́сывался на кана́лы ча́сто.", "imperfettivo")
    ),
    vbPair(
      "увели́чивать",
      [
      vf("Presente – io", "увели́чиваю", "Я увели́чиваю громкость.", "Sto alzando il volume."),
      vf("Presente – tu", "увели́чиваешь", "Ты увели́чиваешь цену?", "Stai aumentando il prezzo?"),
      vf("Passato (processo)", "увели́чивал", "Компа́ния постепе́нно увели́чивала штат.", "L'azienda aumentava gradualmente il personale."),
      ],
      "увели́чить",
      [
      vf("Passato (risultato)", "увели́чил", "Я увели́чил бюджет.", "Ho aumentato il budget (fatto)."),
      vf("Futuro – io", "увели́чу", "Я увели́чу зарплату.", "Aumenterò lo stipendio."),
      vf("Imperativo", "увели́чь", "Увели́чь громкость!", "Alza il volume!"),
      ],
      "aumentare",
      "Увеличивать è l'aumentare come processo graduale, увеличить il completamento — un aumento concreto ottenuto.",
      sq("Ho appena aumentato il budget del progetto.", "Я увели́чил бюдже́т прое́кта.", "perfettivo", "Я увели́чивал бюдже́т ка́ждый год.", "imperfettivo")
    ),
    vbPair(
      "уменьша́ть",
      [
      vf("Presente – io", "уменьша́ю", "Я уменьша́ю расходы.", "Sto riducendo le spese."),
      vf("Presente – tu", "уменьша́ешь", "Ты уменьша́ешь риск?", "Stai riducendo il rischio?"),
      vf("Passato (processo)", "уменьша́л", "Он постепенно уменьша́л вес.", "Riduceva gradualmente il peso."),
      ],
      "уме́ньшить",
      [
      vf("Passato (risultato)", "уме́ньшил", "Я уме́ньшил порцию.", "Ho ridotto la porzione (fatto)."),
      vf("Futuro – io", "уме́ньшу", "Я уме́ньшу расходы.", "Ridurrò le spese."),
      vf("Imperativo", "уме́ньши", "Уме́ньши звук!", "Abbassa il volume!"),
      ],
      "diminuire",
      "Уменьшать è il diminuire come processo graduale, уменьшить il completamento — una riduzione concreta ottenuta.",
      sq("Ho appena ridotto le spese mensili del 20%.", "Я уме́ньшил расхо́ды на два́дцать проце́нтов.", "perfettivo", "Я уменьша́л расхо́ды ка́ждый ме́сяц.", "imperfettivo")
    ),
    vbPair(
      "выполня́ть",
      [
      vf("Presente – io", "выполня́ю", "Я выполня́ю задание.", "Sto eseguendo il compito."),
      vf("Presente – tu", "выполня́ешь", "Ты выполня́ешь план?", "Stai realizzando il piano?"),
      vf("Passato (processo)", "выполня́л", "Я до́лго выполня́л заказ.", "Ho eseguito l'ordine a lungo."),
      ],
      "вы́полнить",
      [
      vf("Passato (risultato)", "вы́полнил", "Я вы́полнил задачу.", "Ho eseguito il compito (fatto)."),
      vf("Futuro – io", "вы́полню", "Я вы́полню э́то сего́дня.", "Lo eseguirò oggi."),
      vf("Imperativo", "вы́полни", "Вы́полни э́то точно!", "Eseguilo con precisione!"),
      ],
      "eseguire, realizzare",
      "Выполнять è l'eseguire come processo, выполнить il completamento — il compito è ormai svolto.",
      sq("Ho appena finito di eseguire tutti i compiti richiesti.", "Я вы́полнил все зада́чи.", "perfettivo", "Я выполня́л зада́чи одну́ за друго́й.", "imperfettivo")
    ),
    vbPair(
      "нарушáть",
      [
      vf("Presente – io", "наруша́ю", "Я не наруша́ю правила.", "Non violo le regole."),
      vf("Presente – tu", "наруша́ешь", "Ты наруша́ешь закон?", "Stai violando la legge?"),
      vf("Passato (processo)", "наруша́л", "Он часто наруша́л тишину.", "Disturbava spesso il silenzio."),
      ],
      "нару́шить",
      [
      vf("Passato (risultato)", "нару́шил", "Он нару́шил обещание.", "Ha infranto la promessa (fatto)."),
      vf("Futuro – io", "нару́шу", "Я не нару́шу договор.", "Non violerò l'accordo."),
      vf("Imperativo (negativo)", "не нару́шь", "Не нару́шь правило!", "Non violare la regola!"),
      ],
      "violare, infrangere",
      "Нарушать è il violare come processo/tendenza, нарушить l'atto specifico della violazione.",
      sq("Ha appena infranto la promessa che mi aveva fatto.", "Он нару́шил обеща́ние.", "perfettivo", "Он наруша́л обеща́ния ча́сто.", "imperfettivo")
    ),
    vbPair(
      "достига́ть",
      [
      vf("Presente – io", "достига́ю", "Я достига́ю цели.", "Sto raggiungendo l'obiettivo."),
      vf("Presente – tu", "достига́ешь", "Ты достига́ешь успеха?", "Stai raggiungendo il successo?"),
      vf("Passato (processo)", "достига́л", "Он ме́дленно достига́л вершины.", "Raggiungeva lentamente la vetta."),
      ],
      "дости́чь",
      [
      vf("Passato (risultato)", "дости́г", "Я дости́г цели.", "Ho raggiunto l'obiettivo (fatto)."),
      vf("Futuro – io", "дости́гну", "Я дости́гну успеха.", "Raggiungerò il successo."),
      vf("Imperativo", "дости́гни", "Дости́гни своей цели!", "Raggiungi il tuo obiettivo!"),
      ],
      "raggiungere",
      "Достигать è il raggiungere come processo, достичь il completamento — l'obiettivo è ormai raggiunto.",
      sq("Ho appena raggiunto l'obiettivo che mi ero prefissato.", "Я дости́г свое́й це́ли.", "perfettivo", "Я достига́л це́ли постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "подверга́ть",
      [
      vf("Presente – io", "подверга́ю", "Я подверга́ю критике план.", "Sto sottoponendo il piano a critica."),
      vf("Presente – tu", "подверга́ешь", "Ты подверга́ешь риску проект?", "Stai esponendo il progetto al rischio?"),
      vf("Passato (processo)", "подверга́л", "Он подверга́л сомнению всё.", "Metteva tutto in dubbio."),
      ],
      "подве́ргнуть",
      [
      vf("Passato (risultato)", "подве́ргнул", "Он подве́ргнул план анализу.", "Ha sottoposto il piano ad analisi (fatto)."),
      vf("Futuro – io", "подве́ргну", "Я подве́ргну э́то проверке.", "Lo sottoporrò a verifica."),
      vf("Imperativo", "подве́ргни", "Подве́ргни э́то сомнению!", "Mettilo in dubbio!"),
      ],
      "sottoporre",
      "Подвергать è il sottoporre come processo, подвергнуть il completamento dell'azione.",
      sq("Ha appena sottoposto il piano a un'analisi approfondita.", "Он подве́ргнул план тща́тельному ана́лизу.", "perfettivo", "Он подверга́л план сомне́нию всегда́.", "imperfettivo")
    ),
    vbPair(
      "сокраща́ть",
      [
      vf("Presente – io", "сокраща́ю", "Я сокраща́ю расходы.", "Sto tagliando le spese."),
      vf("Presente – tu", "сокраща́ешь", "Ты сокраща́ешь текст?", "Stai accorciando il testo?"),
      vf("Passato (processo)", "сокраща́л", "Компа́ния постепе́нно сокраща́ла штат.", "L'azienda riduceva gradualmente il personale."),
      ],
      "сократи́ть",
      [
      vf("Passato (risultato)", "сократи́л", "Я сократи́л текст.", "Ho accorciato il testo (fatto)."),
      vf("Futuro – io", "сокращу́", "Я сокращу́ расходы.", "Taglierò le spese."),
      vf("Imperativo", "сократи́", "Сократи́ э́то вдвое!", "Riducilo a metà!"),
      ],
      "ridurre, tagliare",
      "Сокращать è il ridurre come processo, сократить il completamento della riduzione.",
      sq("Ho appena accorciato il testo alla metà della lunghezza.", "Я сократи́л текст вдво́е.", "perfettivo", "Я сокраща́л текст постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "расширя́ть",
      [
      vf("Presente – io", "расширя́ю", "Я расширя́ю бизнес.", "Sto ampliando l'attività."),
      vf("Presente – tu", "расширя́ешь", "Ты расширя́ешь ассортимент?", "Stai ampliando l'assortimento?"),
      vf("Passato (processo)", "расширя́л", "Компа́ния года́ми расширя́ла ры́нок.", "L'azienda ampliava il mercato da anni."),
      ],
      "расши́рить",
      [
      vf("Passato (risultato)", "расши́рил", "Я расши́рил компанию.", "Ho ampliato l'azienda (fatto)."),
      vf("Futuro – io", "расши́рю", "Я расши́рю список.", "Amplierò la lista."),
      vf("Imperativo", "расши́рь", "Расши́рь поиск!", "Amplia la ricerca!"),
      ],
      "ampliare",
      "Расширять è l'ampliare come processo, расширить il completamento — l'ampliamento è ormai fatto.",
      sq("Ho appena ampliato la lista dei prodotti disponibili.", "Я расши́рил спи́сок това́ров.", "perfettivo", "Я расширя́л спи́сок постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "уточня́ть",
      [
      vf("Presente – io", "уточня́ю", "Я уточня́ю детали.", "Sto precisando i dettagli."),
      vf("Presente – tu", "уточня́ешь", "Ты уточня́ешь дату?", "Stai confermando la data?"),
      vf("Passato (processo)", "уточня́л", "Я до́лго уточня́л информацию.", "Ho verificato l'informazione a lungo."),
      ],
      "уточни́ть",
      [
      vf("Passato (risultato)", "уточни́л", "Я уточни́л адрес.", "Ho verificato l'indirizzo (fatto)."),
      vf("Futuro – io", "уточню́", "Я уточню́ время.", "Confermerò l'orario."),
      vf("Imperativo", "уточни́", "Уточни́, пожалуйста!", "Chiarisci, per favore!"),
      ],
      "precisare, chiarire",
      "Уточнять è il precisare come processo, уточнить il completamento — l'informazione è ormai chiarita.",
      sq("Ho appena verificato l'indirizzo esatto della riunione.", "Я уточни́л то́чный а́дрес встре́чи.", "perfettivo", "Я уточня́л а́дрес неско́лько раз.", "imperfettivo")
    ),
    vbPair(
      "утвержда́ть",
      [
      vf("Presente – io", "утвержда́ю", "Я утвержда́ю, что э́то правда.", "Affermo che è vero."),
      vf("Presente – tu", "утвержда́ешь", "Ты утвержда́ешь план?", "Stai approvando il piano?"),
      vf("Passato (processo)", "утвержда́л", "Он всегда утвержда́л обратное.", "Affermava sempre il contrario."),
      ],
      "утверди́ть",
      [
      vf("Passato (risultato)", "утверди́л", "Директор утверди́л бюджет.", "Il direttore ha approvato il budget (fatto)."),
      vf("Futuro – io", "утвержу́", "Я утвержу́ э́тот план.", "Approverò questo piano."),
      vf("Imperativo", "утверди́", "Утверди́ докуме́нт!", "Approva il documento!"),
      ],
      "approvare, affermare",
      "Утверждать è l'affermare/approvare come processo, утвердить il completamento — l'approvazione formale ottenuta.",
      sq("Il direttore ha appena approvato definitivamente il budget.", "Дире́ктор утверди́л бюдже́т.", "perfettivo", "Дире́ктор утвержда́л бюдже́ты ка́ждый год.", "imperfettivo")
    ),
    vbPair(
      "отменя́ть",
      [
      vf("Presente – io", "отменя́ю", "Я отменя́ю встречу.", "Sto annullando l'incontro."),
      vf("Presente – tu", "отменя́ешь", "Ты отменя́ешь заказ?", "Stai annullando l'ordine?"),
      vf("Passato (processo)", "отменя́л", "Он часто отменя́л планы.", "Annullava spesso i piani."),
      ],
      "отмени́ть",
      [
      vf("Passato (risultato)", "отмени́л", "Я отмени́л поездку.", "Ho annullato il viaggio (fatto)."),
      vf("Futuro – io", "отменю́", "Я отменю́ заказ.", "Annullerò l'ordine."),
      vf("Imperativo", "отмени́", "Отмени́ э́то немедленно!", "Annullalo immediatamente!"),
      ],
      "annullare, cancellare",
      "Отменять è l'annullare come processo, отменить il completamento — l'evento è ormai annullato.",
      sq("Ho appena annullato il viaggio a causa del maltempo.", "Я отмени́л пое́здку из-за пого́ды.", "perfettivo", "Я отменя́л пое́здки ча́сто.", "imperfettivo")
    ),
    vbPair(
      "созда́вать",
      [
      vf("Presente – io", "создаю́", "Я создаю́ сайт.", "Sto creando il sito."),
      vf("Presente – tu", "создаёшь", "Ты создаёшь кома́нду?", "Stai creando una squadra?"),
      vf("Passato (processo)", "создава́л", "Он годами создава́л бренд.", "Ha creato il marchio nel corso degli anni."),
      ],
      "созда́ть",
      [
      vf("Passato (risultato)", "со́здал", "Я со́здал компанию.", "Ho creato l'azienda (fatto)."),
      vf("Futuro – io", "созда́м", "Я созда́м новый продукт.", "Creerò un nuovo prodotto."),
      vf("Imperativo", "созда́й", "Созда́й что-то новое!", "Crea qualcosa di nuovo!"),
      ],
      "creare",
      "Создавать è il creare come processo, создать il completamento — la cosa è ormai creata.",
      sq("Ho appena creato la mia prima azienda.", "Я со́здал свою́ пе́рвую компа́нию.", "perfettivo", "Я создава́л компа́нии в тече́ние лет.", "imperfettivo")
    ),
    vbPair(
      "разруша́ть",
      [
      vf("Presente – io", "разруша́ю", "Я не разруша́ю доверие.", "Non distruggo la fiducia."),
      vf("Presente – tu", "разруша́ешь", "Ты разруша́ешь отношения?", "Stai distruggendo il rapporto?"),
      vf("Passato (processo)", "разруша́л", "Война постепенно разрушала го́род.", "La guerra distruggeva gradualmente la città."),
      ],
      "разру́шить",
      [
      vf("Passato (risultato)", "разру́шил", "Ураган разру́шил дом.", "L'uragano ha distrutto la casa (fatto)."),
      vf("Futuro – io", "разру́шу", "Я не разру́шу э́то.", "Non lo distruggerò."),
      vf("Imperativo (negativo)", "не разру́шь", "Не разру́шь всё!", "Non distruggere tutto!"),
      ],
      "distruggere",
      "Разрушать è il distruggere come processo, разрушить il completamento — la cosa è ormai distrutta.",
      sq("L'uragano ha appena distrutto completamente la casa.", "Урага́н разру́шил дом полность́ю.", "perfettivo", "Урага́н разруша́л дома́ посте́пенно.", "imperfettivo")
    ),
    vbPair(
      "восстана́вливать",
      [
      vf("Presente – io", "восстана́вливаю", "Я восстана́вливаю силы.", "Sto recuperando le forze."),
      vf("Presente – tu", "восстана́вливаешь", "Ты восстана́вливаешь файлы?", "Stai ripristinando i file?"),
      vf("Passato (processo)", "восстана́вливал", "Он до́лго восстана́вливал здоровье.", "Ha ripristinato la salute a lungo."),
      ],
      "восстанови́ть",
      [
      vf("Passato (risultato)", "восстанови́л", "Я восстанови́л данные.", "Ho ripristinato i dati (fatto)."),
      vf("Futuro – io", "восстановлю́", "Я восстановлю́ файл.", "Ripristinerò il file."),
      vf("Imperativo", "восстанови́", "Восстанови́ резервную копию!", "Ripristina il backup!"),
      ],
      "ripristinare, ricostruire",
      "Восстанавливать è il ripristinare come processo, восстановить il completamento — la cosa è ormai ripristinata.",
      sq("Ho appena ripristinato completamente tutti i dati persi.", "Я восстанови́л все поте́рянные да́нные.", "perfettivo", "Я восстана́вливал да́нные постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "обеспе́чивать",
      [
      vf("Presente – io", "обеспе́чиваю", "Я обеспе́чиваю семью.", "Provvedo alla famiglia."),
      vf("Presente – tu", "обеспе́чиваешь", "Ты обеспе́чиваешь безопасность?", "Garantisci la sicurezza?"),
      vf("Passato (processo)", "обеспе́чивал", "Компания до́лго обеспечивала работой.", "L'azienda garantiva lavoro da tempo."),
      ],
      "обеспе́чить",
      [
      vf("Passato (risultato)", "обеспе́чил", "Я обеспе́чил себя работой.", "Mi sono garantito un lavoro (fatto)."),
      vf("Futuro – io", "обеспе́чу", "Я обеспе́чу безопасность.", "Garantirò la sicurezza."),
      vf("Imperativo", "обеспе́чь", "Обеспе́чь качество!", "Garantisci la qualità!"),
      ],
      "garantire, fornire",
      "Обеспечивать è il garantire come processo continuo, обеспечить il completamento — la garanzia è ormai assicurata.",
      sq("Mi sono appena garantito un buon lavoro per il futuro.", "Я обеспе́чил себя́ хоро́шей рабо́той.", "perfettivo", "Я обеспе́чивал себя́ рабо́той года́ми.", "imperfettivo")
    ),
    vbPair(
      "превраща́ть",
      [
      vf("Presente – io", "превраща́ю", "Я превраща́ю хобби в рабо́ту.", "Sto trasformando l'hobby in lavoro."),
      vf("Presente – tu", "превраща́ешь", "Ты превраща́ешь всё в шутку?", "Trasformi tutto in scherzo?"),
      vf("Passato (processo)", "превраща́л", "Время превращало го́род.", "Il tempo trasformava la città."),
      ],
      "преврати́ть",
      [
      vf("Passato (risultato)", "преврати́л", "Он преврати́л комнату в офис.", "Ha trasformato la stanza in ufficio (fatto)."),
      vf("Futuro – io", "превращу́", "Я превращу́ э́то в успех.", "Lo trasformerò in successo."),
      vf("Imperativo", "преврати́", "Преврати́ проблему в шанс!", "Trasforma il problema in opportunità!"),
      ],
      "trasformare",
      "Превращать è il trasformare come processo, превратить il completamento — la trasformazione è ormai avvenuta.",
      sq("Ha appena trasformato completamente la vecchia stanza in un ufficio.", "Он преврати́л ста́рую ко́мнату в о́фис.", "perfettivo", "Он превраща́л ко́мнаты постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "избега́ть",
      [
      vf("Presente – io", "избега́ю", "Я избега́ю конфликтов.", "Evito i conflitti."),
      vf("Presente – tu", "избега́ешь", "Ты избега́ешь ответа?", "Stai evitando la risposta?"),
      vf("Passato (processo)", "избега́л", "Он всегда избега́л риска.", "Evitava sempre il rischio."),
      ],
      "избежа́ть",
      [
      vf("Passato (risultato)", "избежа́л", "Я избежа́л ошибки.", "Ho evitato l'errore (fatto)."),
      vf("Futuro – io", "избегу́", "Я избегу́ проблем.", "Eviterò i problemi."),
      vf("Imperativo", "избеги́", "Избеги́ э́той ошибки!", "Evita questo errore!"),
      ],
      "evitare",
      "Избегать è l'evitare come tendenza/abitudine, избежать l'atto specifico di essere riusciti a evitare qualcosa.",
      sq("Sono appena riuscito a evitare un grave errore nel progetto.", "Я избежа́л серьёзной оши́бки.", "perfettivo", "Я избега́л оши́бок всегда́.", "imperfettivo")
    ),
    vbPair(
      "достава́ть",
      [
      vf("Presente – io", "достаю́", "Я достаю́ книгу с полки.", "Sto prendendo il libro dallo scaffale."),
      vf("Presente – tu", "достаёшь", "Ты достаёшь биле́ты?", "Stai procurando i biglietti?"),
      vf("Passato (processo)", "достава́л", "Он до́лго достава́л докуме́нты.", "Ha impiegato tempo a procurarsi i documenti."),
      ],
      "доста́ть",
      [
      vf("Passato (risultato)", "доста́л", "Я доста́л билеты.", "Ho procurato i biglietti (fatto)."),
      vf("Futuro – io", "доста́ну", "Я доста́ну информацию.", "Otterrò l'informazione."),
      vf("Imperativo", "доста́нь", "Доста́нь докуме́нты!", "Procura i documenti!"),
      ],
      "prendere, procurarsi",
      "Доставать è il procurarsi come processo, достать il completamento — l'oggetto è ormai ottenuto.",
      sq("Sono appena riuscito a procurarmi i biglietti per il concerto.", "Я доста́л биле́ты на конце́рт.", "perfettivo", "Я достава́л биле́ты ка́ждый раз.", "imperfettivo")
    ),
    vbPair(
      "облегча́ть",
      [
      vf("Presente – io", "облегча́ю", "Я облегча́ю задачу.", "Sto semplificando il compito."),
      vf("Presente – tu", "облегча́ешь", "Ты облегча́ешь процесс?", "Stai semplificando il processo?"),
      vf("Passato (processo)", "облегча́л", "Он постепенно облегча́л нагрузку.", "Alleggeriva gradualmente il carico."),
      ],
      "облегчи́ть",
      [
      vf("Passato (risultato)", "облегчи́л", "Я облегчи́л ему жизнь.", "Gli ho semplificato la vita (fatto)."),
      vf("Futuro – io", "облегчу́", "Я облегчу́ тебе задачу.", "Ti semplificherò il compito."),
      vf("Imperativo", "облегчи́", "Облегчи́ мне рабо́ту!", "Semplificami il lavoro!"),
      ],
      "alleggerire, semplificare",
      "Облегчать è il semplificare come processo, облегчить il completamento — il compito è ormai reso più facile.",
      sq("Gli ho appena semplificato notevolmente il compito.", "Я облегчи́л ему зада́чу.", "perfettivo", "Я облегча́л ему зада́чи ча́сто.", "imperfettivo")
    ),
  ],
  C1: [
    vbPair(
      "заставля́ть",
      [
      vf("Presente – io", "заставля́ю", "Я заставля́ю его работать.", "Lo sto costringendo a lavorare."),
      vf("Presente – tu", "заставля́ешь", "Ты заставля́ешь меня нервничать.", "Mi stai facendo innervosire."),
      vf("Passato (processo)", "заставля́л", "Отец всегда заставля́л меня учиться.", "Mio padre mi costringeva sempre a studiare."),
      ],
      "заста́вить",
      [
      vf("Passato (risultato)", "заста́вил", "Я заста́вил его признаться.", "L'ho costretto a confessare (fatto)."),
      vf("Futuro – io", "заста́влю", "Я заста́влю его извиниться.", "Lo costringerò a scusarsi."),
      vf("Futuro – tu", "заста́вишь", "Ты заста́вишь его согласиться.", "Lo costringerai ad accettare."),
      ],
      "costringere",
      "Заставлять è il costringere come pressione continua, заставить l'atto specifico di aver ottenuto che qualcuno faccia qualcosa.",
      sq("L'ho costretto a confessare tutto ieri.", "Я заста́вил его призна́ться.", "perfettivo", "Я заставля́л его призна́ться.", "imperfettivo")
    ),
    vbPair(
      "представля́ть",
      [
      vf("Presente – io", "представля́ю", "Я представля́ю себе будущее.", "Sto immaginando il futuro."),
      vf("Presente – tu", "представля́ешь", "Ты представля́ешь компанию?", "Rappresenti l'azienda?"),
      vf("Passato (processo)", "представля́л", "Я до́лго представля́л э́тот момент.", "Ho immaginato a lungo questo momento."),
      ],
      "предста́вить",
      [
      vf("Passato (risultato)", "предста́вил", "Я предста́вил ему коллегу.", "Gli ho presentato un collega (fatto)."),
      vf("Futuro – io", "предста́влю", "Я предста́влю проект завтра.", "Presenterò il progetto domani."),
      vf("Imperativo", "предста́вь", "Предста́вь себе э́то!", "Immaginatelo!"),
      ],
      "immaginare, presentare",
      "Представлять è il processo dell'immaginare/presentare, представить l'atto completo — l'immagine formata o la presentazione fatta.",
      sq("Gli ho appena presentato il mio nuovo collega.", "Я предста́вил ему колле́гу.", "perfettivo", "Я представля́л ему колле́гу.", "imperfettivo")
    ),
    vbPair(
      "подчёркивать",
      [
      vf("Presente – io", "подчёркиваю", "Я подчёркиваю ва́жные слова́.", "Sottolineo le parole importanti."),
      vf("Presente – tu", "подчёркиваешь", "Ты всегда́ подчёркиваешь дета́ли.", "Sottolinei sempre i dettagli."),
      vf("Passato (processo)", "подчёркивал", "Он постоя́нно подчёркивал свою́ роль.", "Sottolineava continuamente il suo ruolo."),
      ],
      "подчеркну́ть",
      [
      vf("Passato (risultato)", "подчеркну́л", "Он подчеркну́л главную мысль.", "Ha sottolineato il punto principale (fatto)."),
      vf("Futuro – io", "подчеркну́", "Я подчеркну́ э́то в тексте.", "Lo sottolineerò nel testo."),
      vf("Imperativo", "подчеркни́", "Подчеркни́ важное!", "Sottolinea ciò che è importante!"),
      ],
      "sottolineare",
      "Подчёркивать è il sottolineare come tendenza/enfasi ripetuta, подчеркнуть l'atto specifico di sottolineare un punto una volta.",
      sq("Nel suo discorso ha appena sottolineato il punto chiave.", "Он подчеркну́л гла́вную мысль.", "perfettivo", "Он подчёркивал гла́вную мысль.", "imperfettivo")
    ),
    vbPair(
      "предполага́ть",
      [
      vf("Presente – io", "предполага́ю", "Я предполага́ю худшее.", "Suppongo il peggio."),
      vf("Presente – tu", "предполага́ешь", "Ты предполага́ешь верно?", "Stai supponendo correttamente?"),
      vf("Passato (processo)", "предполага́л", "Я всегда предполага́л такой исход.", "Ho sempre supposto un tale esito."),
      ],
      "предположи́ть",
      [
      vf("Passato (risultato)", "предположи́л", "Я предположи́л, что он опоздает.", "Ho supposto che avrebbe fatto tardi (fatto, un'ipotesi precisa)."),
      vf("Futuro – io", "предположу́", "Я предположу́ другую причину.", "Ipotizzerò un'altra causa."),
      vf("Imperativo", "предположи́", "Предположи́ на минуту, что э́то правда.", "Supponi per un minuto che sia vero."),
      ],
      "supporre",
      "Предполагать è il supporre come ragionamento in corso, предположить l'atto di formulare un'ipotesi specifica.",
      sq("Ho appena ipotizzato che l'errore fosse suo.", "Я предположи́л, что оши́бка была́ его.", "perfettivo", "Я предполага́л, что оши́бка была́ его.", "imperfettivo")
    ),
    vbPair(
      "ста́лкиваться",
      [
      vf("Presente – io", "ста́лкиваюсь", "Я часто ста́лкиваюсь с трудностями.", "Mi imbatto spesso in difficoltà."),
      vf("Presente – tu", "ста́лкиваешься", "Ты ста́лкиваешься с этим каждый день?", "Ti imbatti in questo ogni giorno?"),
      vf("Passato (processo)", "ста́лкивался", "Я раньше часто ста́лкивался с э́той проблемой.", "Prima mi imbattevo spesso in questo problema."),
      ],
      "столкну́ться",
      [
      vf("Passato (risultato)", "столкну́лся", "Я столкну́лся с проблемой вчера.", "Mi sono imbattuto in un problema ieri (un episodio)."),
      vf("Futuro – io", "столкну́сь", "Я столкну́сь с этим позже.", "Mi imbatterò in questo più tardi."),
      vf("Futuro – tu", "столкнёшься", "Ты столкнёшься с тру́дностями.", "Ti imbatterai in difficoltà."),
      ],
      "imbattersi in, scontrarsi",
      "Сталкиваться descrive l'imbattersi come esperienza ricorrente, столкнуться l'episodio singolo e specifico.",
      sq("Mi sono imbattuto in un problema serio proprio ieri.", "Я столкну́лся с пробле́мой вчера́.", "perfettivo", "Я ста́лкивался с пробле́мой вчера́.", "imperfettivo")
    ),
    vbPair(
      "приобрета́ть",
      [
      vf("Presente – io", "приобрета́ю", "Я приобрета́ю новый опыт.", "Sto acquisendo nuova esperienza."),
      vf("Presente – tu", "приобрета́ешь", "Ты приобрета́ешь новые навыки.", "Stai acquisendo nuove competenze."),
      vf("Passato (processo)", "приобрета́л", "Он постепенно приобрета́л уверенность.", "Acquisiva gradualmente sicurezza."),
      ],
      "приобрести́",
      [
      vf("Passato (risultato)", "приобрёл", "Я приобрёл но́вый дом.", "Ho acquisito una nuova casa (fatto)."),
      vf("Futuro – io", "приобрету́", "Я приобрету́ машину в э́том году.", "Acquisirò un'auto quest'anno."),
      vf("Futuro – tu", "приобретёшь", "Ты приобретёшь о́пыт со вре́менем.", "Acquisirai esperienza col tempo."),
      ],
      "acquisire",
      "Приобретать è l'acquisire come processo graduale, приобрести il momento in cui una competenza o un bene è pienamente ottenuto.",
      sq("Ho appena acquisito una nuova casa.", "Я приобрёл но́вый дом.", "perfettivo", "Я приобрета́л но́вый дом.", "imperfettivo")
    ),
    vbPair(
      "воздерживаться",
      [
      vf("Presente – io", "воздерживаюсь", "Я возде́рживаюсь от алкого́ля.", "Mi astengo dall'alcol."),
      vf("Presente – tu", "воздерживаешься", "Ты возде́рживаешься от комментари́ев?", "Ti astieni dai commenti?"),
      vf("Passato (processo)", "воздерживался", "Он всегда́ возде́рживался от кри́тики.", "Si asteneva sempre dalla critica."),
      ],
      "воздержа́ться",
      [
      vf("Passato (risultato)", "воздержа́лся", "Я воздержа́лся от голосования.", "Mi sono astenuto dal voto (un'occasione precisa)."),
      vf("Futuro – io", "воздержу́сь", "Я воздержу́сь от комментариев.", "Mi asterrò dai commenti."),
      vf("Imperativo", "воздержи́сь", "Воздержи́сь от э́того!", "Astieniti da questo!"),
      ],
      "astenersi",
      "Воздерживаться è l'astenersi come pratica continua, воздержаться l'atto specifico di essersi trattenuti in un'occasione precisa.",
      sq("Alla riunione di ieri mi sono astenuto dal voto.", "Я воздержа́лся от голосова́ния.", "perfettivo", "Я воздерживался от голосова́ния.", "imperfettivo")
    ),
    vbPair(
      "осознава́ть",
      [
      vf("Presente – io", "осознаю́", "Я осознаю́ проблему.", "Mi sto rendendo conto del problema."),
      vf("Presente – tu", "осознаёшь", "Ты осознаёшь риск?", "Ti rendi conto del rischio?"),
      vf("Passato (processo)", "осознава́л", "Он постепенно осознава́л ошибку.", "Si rendeva conto gradualmente dell'errore."),
      ],
      "осозна́ть",
      [
      vf("Passato (risultato)", "осозна́л", "Я осозна́л свою ошибку.", "Mi sono reso conto del mio errore (fatto)."),
      vf("Futuro – io", "осозна́ю", "Я осозна́ю э́то позже.", "Me ne renderò conto più tardi."),
      vf("Imperativo", "осозна́й", "Осозна́й последствия!", "Rendetene conto delle conseguenze!"),
      ],
      "rendersi conto",
      "Осознавать è il rendersi conto come processo graduale, осознать il momento specifico della piena consapevolezza.",
      sq("Mi sono appena reso conto all'improvviso del mio errore.", "Я внеза́пно осозна́л свою́ оши́бку.", "perfettivo", "Я осознава́л оши́бку постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "подразумева́ть",
      [
      vf("Presente – io", "подразумева́ю", "Я подразумева́ю другое.", "Intendo un'altra cosa."),
      vf("Presente – tu", "подразумева́ешь", "Что ты подразумева́ешь?", "Cosa intendi?"),
      vf("Passato (processo)", "подразумева́л", "Он всегда подразумева́л согласие.", "Presupponeva sempre l'accordo."),
      ],
      "подразуме́ть",
      [
      vf("Passato (risultato)", "подразуме́л", "Он подразуме́л другое.", "Ha voluto dire altro (in quell'occasione)."),
      vf("Futuro – io", "подразуме́ю", "Я подразуме́ю э́то позже.", "Lo intenderò così più tardi."),
      vf("Imperativo", "подразуме́й", "Подразуме́й э́то верно!", "Intendilo correttamente!"),
      ],
      "sottintendere, implicare",
      "Подразумевать è di norma usato solo all'imperfettivo (verbo prevalentemente imperfectivum tantum); qui la forma perfettiva è rara ma teoricamente possibile per un singolo atto specifico.",
      sq("Con quella frase intendeva qualcos'altro in quel momento preciso.", "Он подразуме́л друго́е.", "perfettivo", "Он подразумева́л друго́е всегда́.", "imperfettivo")
    ),
    vbPair(
      "опира́ться",
      [
      vf("Presente – io", "опира́юсь", "Я опира́юсь на факты.", "Mi baso sui fatti."),
      vf("Presente – tu", "опира́ешься", "Ты опира́ешься на опыт?", "Ti basi sull'esperienza?"),
      vf("Passato (processo)", "опира́лся", "Он всегда опира́лся на данные.", "Si basava sempre sui dati."),
      ],
      "опере́ться",
      [
      vf("Passato (risultato)", "опере́лся", "Я опе́рся на сте́ну.", "Mi sono appoggiato al muro (un istante)."),
      vf("Futuro – io", "оберу́сь", "Я обопру́сь на пери́ла.", "Mi appoggerò alla ringhiera."),
      vf("Imperativo", "обопри́сь", "Обопри́сь на меня!", "Appoggiati a me!"),
      ],
      "appoggiarsi, basarsi",
      "Опираться è l'appoggiarsi/basarsi come stato continuo, опереться l'atto specifico di essersi appoggiati in un momento preciso.",
      sq("Mi sono appoggiato al muro per un istante per riposarmi.", "Я опере́лся на сте́ну на мгнове́ние.", "perfettivo", "Я опира́лся на сте́ну всегда́.", "imperfettivo")
    ),
    vbPair(
      "осуществля́ть",
      [
      vf("Presente – io", "осуществля́ю", "Я осуществля́ю план.", "Sto attuando il piano."),
      vf("Presente – tu", "осуществля́ешь", "Ты осуществля́ешь мечту?", "Stai realizzando il sogno?"),
      vf("Passato (processo)", "осуществля́л", "Он годами осуществля́л проект.", "Ha realizzato il progetto nel corso degli anni."),
      ],
      "осуществи́ть",
      [
      vf("Passato (risultato)", "осуществи́л", "Я осуществи́л мечту.", "Ho realizzato il sogno (fatto)."),
      vf("Futuro – io", "осуществлю́", "Я осуществлю́ э́то.", "Lo realizzerò."),
      vf("Imperativo", "осуществи́", "Осуществи́ свой план!", "Realizza il tuo piano!"),
      ],
      "realizzare, attuare",
      "Осуществлять è il realizzare come processo, осуществить il completamento — il progetto è ormai attuato.",
      sq("Ho appena realizzato completamente il sogno della mia vita.", "Я осуществи́л мечту́ всей жи́зни.", "perfettivo", "Я осуществля́л мечту́ года́ми.", "imperfettivo")
    ),
    vbPair(
      "приобрета́ть",
      [
      vf("Presente – io", "приобрета́ю", "Я приобрета́ю опыт.", "Sto acquisendo esperienza."),
      vf("Presente – tu", "приобрета́ешь", "Ты приобрета́ешь знания?", "Stai acquisendo conoscenze?"),
      vf("Passato (processo)", "приобрета́л", "Он годами приобрета́л репутацию.", "Ha acquisito reputazione nel corso degli anni."),
      ],
      "приобрести́",
      [
      vf("Passato (risultato)", "приобрёл", "Я приобрёл дом.", "Ho acquisito una casa (fatto)."),
      vf("Futuro – io", "приобрету́", "Я приобрету́ навык.", "Acquisirò una competenza."),
      vf("Imperativo", "приобрети́", "Приобрети́ э́тот опыт!", "Acquisisci questa esperienza!"),
      ],
      "acquisire (esperienza/beni)",
      "Приобретать è l'acquisire come processo, приобрести il completamento — la cosa è ormai acquisita.",
      sq("Ho appena acquisito una nuova importante competenza professionale.", "Я приобрёл но́вый ва́жный на́вык.", "perfettivo", "Я приобрета́л на́выки года́ми.", "imperfettivo")
    ),
    vbPair(
      "сопровожда́ть",
      [
      vf("Presente – io", "сопровожда́ю", "Я сопровожда́ю гостей.", "Sto accompagnando gli ospiti."),
      vf("Presente – tu", "сопровожда́ешь", "Ты сопровожда́ешь делегацию?", "Stai accompagnando la delegazione?"),
      vf("Passato (processo)", "сопровожда́л", "Он до́лго сопровожда́л туристов.", "Ha accompagnato i turisti a lungo."),
      ],
      "сопроводи́ть",
      [
      vf("Passato (risultato)", "сопроводи́л", "Я сопроводи́л её домо́й.", "L'ho accompagnata a casa (fatto)."),
      vf("Futuro – io", "сопровожу́", "Я сопровожу́ вас.", "Vi accompagnerò."),
      vf("Imperativo", "сопроводи́", "Сопроводи́ гостя!", "Accompagna l'ospite!"),
      ],
      "accompagnare",
      "Сопровождать è l'accompagnare come processo continuo, сопроводить l'atto specifico e completo dell'accompagnamento.",
      sq("L'ho appena accompagnata fino a casa dopo la festa.", "Я сопроводи́л её домо́й по́сле пра́здника.", "perfettivo", "Я сопровожда́л её ча́сто.", "imperfettivo")
    ),
    vbPair(
      "формирова́ть",
      [
      vf("Presente – io", "формиру́ю", "Я формиру́ю команду.", "Sto formando la squadra."),
      vf("Presente – tu", "формиру́ешь", "Ты формиру́ешь мнение?", "Ti stai formando un'opinione?"),
      vf("Passato (processo)", "формирова́л", "Он годами формирова́л стиль.", "Ha formato il proprio stile nel corso degli anni."),
      ],
      "сформирова́ть",
      [
      vf("Passato (risultato)", "сформирова́л", "Я сформирова́л команду.", "Ho formato la squadra (fatto)."),
      vf("Futuro – io", "сформиру́ю", "Я сформиру́ю план.", "Formerò un piano."),
      vf("Imperativo", "сформиру́й", "Сформиру́й список!", "Forma la lista!"),
      ],
      "formare",
      "Формировать è il formare come processo, сформировать il completamento — la cosa risulta ormai formata.",
      sq("Ho appena formato la squadra definitiva per il progetto.", "Я сформирова́л оконча́тельную кома́нду.", "perfettivo", "Я формирова́л кома́нду года́ми.", "imperfettivo")
    ),
    vbPair(
      "сомнева́ться",
      [
      vf("Presente – io", "сомнева́юсь", "Я сомнева́юсь в э́том.", "Dubito di questo."),
      vf("Presente – tu", "сомнева́ешься", "Ты сомнева́ешься во мне?", "Dubiti di me?"),
      vf("Passato (stato)", "сомнева́лся", "Он всегда сомнева́лся в успехе.", "Dubitava sempre del successo."),
      ],
      "усомни́ться",
      [
      vf("Passato (risultato)", "усомни́лся", "Я усомни́лся в его словах.", "Ho iniziato a dubitare delle sue parole (un istante)."),
      vf("Futuro – io", "усомню́сь", "Я усомню́сь, если увижу э́то.", "Dubiterò se lo vedrò."),
      vf("Imperativo", "усомни́сь", "Усомни́сь хоть раз!", "Dubita almeno una volta!"),
      ],
      "dubitare",
      "Сомневаться è il dubitare come stato continuo, усомниться l'atto specifico di aver iniziato a dubitare in un momento preciso.",
      sq("Ho iniziato improvvisamente a dubitare delle sue vere intenzioni.", "Я усомни́лся в его́ и́стинных наме́рениях.", "perfettivo", "Я сомнева́лся в его́ наме́рениях всегда́.", "imperfettivo")
    ),
    vbPair(
      "убежда́ть",
      [
      vf("Presente – io", "убежда́ю", "Я убежда́ю коллегу.", "Sto convincendo il collega."),
      vf("Presente – tu", "убежда́ешь", "Ты убежда́ешь клиента?", "Stai convincendo il cliente?"),
      vf("Passato (processo)", "убежда́л", "Он до́лго убежда́л совет.", "Ha convinto il consiglio a lungo."),
      ],
      "убеди́ть",
      [
      vf("Passato (risultato)", "убеди́л", "Я убеди́л её остаться.", "L'ho convinta a restare (fatto)."),
      vf("Futuro – tu", "убеди́шь", "Ты убеди́шь его.", "Lo convincerai."),
      vf("Imperativo", "убеди́", "Убеди́ меня!", "Convincimi!"),
      ],
      "convincere",
      "Убеждать è il convincere come processo, убедить il completamento — la persona è ormai convinta.",
      sq("L'ho appena convinta a restare per un altro anno.", "Я убеди́л её оста́ться ещё на год.", "perfettivo", "Я убежда́л её постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "толкова́ть",
      [
      vf("Presente – io", "толку́ю", "Я толку́ю закон по-своему.", "Interpreto la legge a modo mio."),
      vf("Presente – tu", "толку́ешь", "Ты толку́ешь э́то иначе?", "Lo interpreti diversamente?"),
      vf("Passato (processo)", "толкова́л", "Он всегда толкова́л текст буквально.", "Interpretava sempre il testo alla lettera."),
      ],
      "истолкова́ть",
      [
      vf("Passato (risultato)", "истолкова́л", "Я истолкова́л слова верно.", "Ho interpretato correttamente le parole (fatto)."),
      vf("Futuro – io", "истолку́ю", "Я истолку́ю э́то иначе.", "Lo interpreterò diversamente."),
      vf("Imperativo", "истолку́й", "Истолку́й э́то правильно!", "Interpretalo correttamente!"),
      ],
      "interpretare",
      "Толковать è l'interpretare come processo, истолковать il completamento — un'interpretazione specifica data.",
      sq("Ho appena interpretato correttamente il significato del testo antico.", "Я ве́рно истолкова́л смысл дре́внего те́кста.", "perfettivo", "Я толкова́л те́ксты по-сво́ему всегда́.", "imperfettivo")
    ),
    vbPair(
      "оправдыва́ть",
      [
      vf("Presente – io", "опра́вдываю", "Я опра́вдываю его поступок.", "Sto giustificando il suo gesto."),
      vf("Presente – tu", "опра́вдываешь", "Ты опра́вдываешь себя?", "Ti stai giustificando?"),
      vf("Passato (processo)", "опра́вдывал", "Он всегда опра́вдывал коллег.", "Giustificava sempre i colleghi."),
      ],
      "оправда́ть",
      [
      vf("Passato (risultato)", "оправда́л", "Суд оправда́л его.", "Il tribunale l'ha assolto (fatto)."),
      vf("Futuro – io", "оправда́ю", "Я оправда́ю доверие.", "Giustificherò la fiducia."),
      vf("Imperativo", "оправда́й", "Оправда́й себя!", "Giustificati!"),
      ],
      "giustificare",
      "Оправдывать è il giustificare come processo, оправдать il completamento — la giustificazione è data.",
      sq("Il tribunale l'ha appena assolto definitivamente da ogni accusa.", "Суд оправда́л его́ по всем пу́нктам обвине́ния.", "perfettivo", "Суд опра́вдывал люде́й ча́сто.", "imperfettivo")
    ),
    vbPair(
      "обвиня́ть",
      [
      vf("Presente – io", "обвиня́ю", "Я никого не обвиня́ю.", "Non accuso nessuno."),
      vf("Presente – tu", "обвиня́ешь", "Ты обвиня́ешь меня?", "Mi stai accusando?"),
      vf("Passato (processo)", "обвиня́л", "Он постоянно обвиня́л систему.", "Accusava continuamente il sistema."),
      ],
      "обвини́ть",
      [
      vf("Passato (risultato)", "обвини́л", "Он обвини́л меня публично.", "Mi ha accusato pubblicamente (fatto)."),
      vf("Futuro – io", "обвиню́", "Я обвиню́ его открыто.", "Lo accuserò apertamente."),
      vf("Imperativo", "обвини́", "Обвини́ виновного!", "Accusa il colpevole!"),
      ],
      "accusare",
      "Обвинять è l'accusare come processo, обвинить il completamento — l'accusa formale è ormai fatta.",
      sq("Mi ha appena accusato pubblicamente durante la riunione.", "Он обвини́л меня́ пу́блично на встре́че.", "perfettivo", "Он обвиня́л меня́ ча́сто.", "imperfettivo")
    ),
    vbPair(
      "отрица́ть",
      [
      vf("Presente – io", "отрица́ю", "Я отрица́ю обвинение.", "Nego l'accusa."),
      vf("Presente – tu", "отрица́ешь", "Ты отрица́ешь факты?", "Neghi i fatti?"),
      vf("Passato (processo)", "отрица́л", "Он всегда отрица́л вину.", "Negava sempre la colpa."),
      ],
      "отве́ргнуть",
      [
      vf("Passato (risultato)", "отве́ргнул", "Он отве́рг предложе́ние.", "Ha respinto la proposta (fatto)."),
      vf("Futuro – io", "отве́ргну", "Я отве́ргну э́то.", "Lo respingerò."),
      vf("Imperativo", "отве́ргни", "Отве́ргни эту идею!", "Respingi questa idea!"),
      ],
      "negare, respingere",
      "Отрицать è generalmente imperfectivum tantum (il negare come stato/posizione), отвергнуть (respingere) ne è il corrispettivo perfettivo funzionale in questo contesto.",
      sq("Ha appena respinto definitivamente la nostra proposta di collaborazione.", "Он отве́ргнул на́ше предложе́ние сотру́дничества.", "perfettivo", "Он отрица́л на́ши предложе́ния всегда́.", "imperfettivo")
    ),
    vbPair(
      "подтвержда́ть",
      [
      vf("Presente – io", "подтвержда́ю", "Я подтвержда́ю бронирование.", "Sto confermando la prenotazione."),
      vf("Presente – tu", "подтвержда́ешь", "Ты подтвержда́ешь встречу?", "Confermi l'incontro?"),
      vf("Passato (processo)", "подтвержда́л", "Он всегда подтвержда́л данные.", "Confermava sempre i dati."),
      ],
      "подтверди́ть",
      [
      vf("Passato (risultato)", "подтверди́л", "Я подтверди́л заказ.", "Ho confermato l'ordine (fatto)."),
      vf("Futuro – io", "подтвержу́", "Я подтвержу́ э́то письмом.", "Lo confermerò con una lettera."),
      vf("Imperativo", "подтверди́", "Подтверди́ участие!", "Conferma la partecipazione!"),
      ],
      "confermare",
      "Подтверждать è il confermare come processo, подтвердить il completamento — la conferma è ormai data.",
      sq("Ho appena confermato definitivamente la prenotazione per il volo.", "Я подтверди́л брони́рование на рейс.", "perfettivo", "Я подтвержда́л да́нные регуля́рно.", "imperfettivo")
    ),
    vbPair(
      "опроверга́ть",
      [
      vf("Presente – io", "опроверга́ю", "Я опроверга́ю слухи.", "Sto smentendo le voci."),
      vf("Presente – tu", "опроверга́ешь", "Ты опроверга́ешь теорию?", "Stai confutando la teoria?"),
      vf("Passato (processo)", "опроверга́л", "Учёный годами опроверга́л миф.", "Lo scienziato confutava il mito da anni."),
      ],
      "опрове́ргнуть",
      [
      vf("Passato (risultato)", "опрове́ргнул", "Я опрове́рг слух.", "Ho smentito la voce (fatto)."),
      vf("Futuro – io", "опрове́ргну", "Я опрове́ргну э́то.", "Lo confuterò."),
      vf("Imperativo", "опрове́ргни", "Опрове́ргни э́то утверждение!", "Confuta questa affermazione!"),
      ],
      "confutare",
      "Опровергать è il confutare come processo, опровергнуть il completamento — la confutazione è ormai fatta.",
      sq("Ho appena smentito pubblicamente quella voce infondata.", "Я пу́блично опрове́рг э́тот необосно́ванный слух.", "perfettivo", "Я опроверга́л слу́хи ча́сто.", "imperfettivo")
    ),
    vbPair(
      "выявля́ть",
      [
      vf("Presente – io", "выявля́ю", "Я выявля́ю проблему.", "Sto individuando il problema."),
      vf("Presente – tu", "выявля́ешь", "Ты выявля́ешь причину?", "Stai individuando la causa?"),
      vf("Passato (processo)", "выявля́л", "Врач до́лго выявля́л диагноз.", "Il medico ha individuato la diagnosi a lungo."),
      ],
      "вы́явить",
      [
      vf("Passato (risultato)", "вы́явил", "Я вы́явил ошибку.", "Ho individuato l'errore (fatto)."),
      vf("Futuro – io", "вы́явлю", "Я вы́явлю причину.", "Individuerò la causa."),
      vf("Imperativo", "вы́яви", "Вы́яви проблему!", "Individua il problema!"),
      ],
      "individuare, rivelare",
      "Выявлять è l'individuare come processo, выявить il completamento — il problema è ormai individuato.",
      sq("Ho appena individuato con precisione la causa del problema.", "Я то́чно вы́явил причи́ну пробле́мы.", "perfettivo", "Я выявля́л причи́ны постепе́нно.", "imperfettivo")
    ),
    vbPair(
      "сопоставля́ть",
      [
      vf("Presente – io", "сопоставля́ю", "Я сопоставля́ю данные.", "Sto confrontando i dati."),
      vf("Presente – tu", "сопоставля́ешь", "Ты сопоставля́ешь версии?", "Stai confrontando le versioni?"),
      vf("Passato (processo)", "сопоставля́л", "Он до́лго сопоставля́л факты.", "Ha confrontato i fatti a lungo."),
      ],
      "сопоста́вить",
      [
      vf("Passato (risultato)", "сопоста́вил", "Я сопоста́вил результаты.", "Ho confrontato i risultati (fatto)."),
      vf("Futuro – io", "сопоста́влю", "Я сопоста́влю цифры.", "Confronterò le cifre."),
      vf("Imperativo", "сопоста́вь", "Сопоста́вь эти данные!", "Confronta questi dati!"),
      ],
      "mettere a confronto",
      "Сопоставлять è il confrontare come processo analitico, сопоставить il completamento del confronto.",
      sq("Ho appena confrontato tutti i risultati dell'esperimento.", "Я сопоста́вил все результа́ты экспериме́нта.", "perfettivo", "Я сопоставля́л да́нные постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "ссыла́ться",
      [
      vf("Presente – io", "ссыла́юсь", "Я ссыла́юсь на источник.", "Faccio riferimento alla fonte."),
      vf("Presente – tu", "ссыла́ешься", "Ты ссыла́ешься на закон?", "Ti riferisci alla legge?"),
      vf("Passato (processo)", "ссыла́лся", "Он часто ссыла́лся на авторитеты.", "Citava spesso le autorità."),
      ],
      "сосла́ться",
      [
      vf("Passato (risultato)", "сосла́лся", "Я сосла́лся на исследование.", "Ho citato lo studio (fatto)."),
      vf("Futuro – io", "сошлю́сь", "Я сошлю́сь на статистику.", "Farò riferimento alle statistiche."),
      vf("Imperativo", "сошли́сь", "Сошли́сь на источник!", "Cita la fonte!"),
      ],
      "fare riferimento, citare",
      "Ссылаться è il fare riferimento come processo/abitudine, сослаться l'atto specifico di aver citato una fonte.",
      sq("Ho appena citato lo studio scientifico nella mia relazione.", "Я сосла́лся на нау́чное иссле́дование в докла́де.", "perfettivo", "Я ссыла́лся на иссле́дования постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "акценти́ровать",
      [
      vf("Presente – io", "акценти́рую", "Я акценти́рую внимание на деталях.", "Sto ponendo l'attenzione sui dettagli."),
      vf("Presente – tu", "акценти́руешь", "Ты акценти́руешь проблему?", "Stai sottolineando il problema?"),
      vf("Passato (processo)", "акценти́ровал", "Он всегда акценти́ровал важность сроков.", "Sottolineava sempre l'importanza delle scadenze."),
      ],
      "заакценти́ровать",
      [
      vf("Passato (risultato)", "заакценти́ровал", "Он заакценти́ровал э́тот момент.", "Ha accentuato questo punto specifico (fatto)."),
      vf("Futuro – io", "заакценти́рую", "Я заакценти́рую внимание на э́том.", "Porrò l'attenzione proprio su questo."),
      vf("Imperativo", "заакценти́руй", "Заакценти́руй э́то!", "Sottolinealo!"),
      ],
      "accentuare, sottolineare",
      "Акцентировать può essere sia imperfettivo che perfettivo di per sé; заакцентировать ne è una variante perfettiva più marcata per un singolo atto enfatico.",
      sq("Ha appena posto un'enfasi decisiva su quel punto specifico nel discorso.", "Он заакценти́ровал э́тот моме́нт в докла́де.", "perfettivo", "Он акценти́ровал моме́нты постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "противоре́чить",
      [
      vf("Presente – io", "противоре́чу", "Я противоре́чу себе.", "Mi contraddico."),
      vf("Presente – tu", "противоре́чишь", "Ты противоре́чишь фактам?", "Contraddici i fatti?"),
      vf("Passato (stato)", "противоре́чил", "Его́ слова́ противоре́чили дела́м.", "Le sue parole contraddicevano i fatti."),
      ],
      "противоре́чить",
      [
      vf("Presente (stato attuale)", "противоре́чит", "Э́то противоре́чит правилам.", "Questo contraddice le regole (adesso)."),
      vf("Presente (loro)", "противоре́чат", "Данные противоре́чат друг другу.", "I dati si contraddicono a vicenda."),
      vf("Passato (esteso)", "противоре́чили", "Показания свидетелей противоре́чили.", "Le testimonianze si contraddicevano."),
      ],
      "contraddire",
      "Противоречить è tipicamente usato solo all'imperfettivo (verbo di stato relazionale, imperfectivum tantum): esprime una relazione logica continua, non un atto singolo da completare.",
      sq("I due testimoni si sono contraddetti a vicenda durante il processo.", "Показа́ния свиде́телей противоре́чили друг дру́гу.", "imperfettivo", "Показа́ния свиде́телей противоре́чили бы друг дру́гу.", "perfettivo")
    ),
    vbPair(
      "сосредота́чиваться",
      [
      vf("Presente – io", "сосредота́чиваюсь", "Я сосредота́чиваюсь на работе.", "Mi sto concentrando sul lavoro."),
      vf("Presente – tu", "сосредота́чиваешься", "Ты сосредота́чиваешься бы́стро?", "Ti concentri in fretta?"),
      vf("Passato (processo)", "сосредота́чивался", "Он до́лго сосредота́чивался перед экзаменом.", "Si concentrava a lungo prima dell'esame."),
      ],
      "сосредото́читься",
      [
      vf("Passato (risultato)", "сосредото́чился", "Я сосредото́чился на задаче.", "Mi sono concentrato sul compito (fatto)."),
      vf("Futuro – io", "сосредото́чусь", "Я сосредото́чусь позже.", "Mi concentrerò più tardi."),
      vf("Imperativo", "сосредото́чься", "Сосредото́чься!", "Concentrati!"),
      ],
      "concentrarsi",
      "Сосредотачиваться è il concentrarsi come processo, сосредоточиться il completamento — la concentrazione è ormai raggiunta.",
      sq("Mi sono appena concentrato completamente sul compito finale.", "Я по́лностью сосредото́чился на фина́льной зада́че.", "perfettivo", "Я сосредота́чивался на зада́чах постепе́нно.", "imperfettivo")
    ),
  ],
  C2: [
    vbPair(
      "случа́ться",
      [
      vf("Presente (esso)", "случа́ется", "Такое случа́ется часто.", "Una cosa simile capita spesso."),
      vf("Presente (loro)", "случа́ются", "Ошибки случа́ются.", "Gli errori capitano."),
      vf("Passato (processo)", "случа́лся", "Раньше э́то часто случалось.", "Prima capitava spesso."),
      ],
      "случи́ться",
      [
      vf("Passato (risultato)", "случи́лось", "Вчера случи́лось нечто странное.", "Ieri è successo qualcosa di strano (un episodio)."),
      vf("Futuro", "случи́тся", "Не знаю, что случи́тся завтра.", "Non so cosa succederà domani."),
      vf("Passato (plurale)", "случи́лись", "С нами случи́лись неприятности.", "Ci sono capitati dei guai."),
      ],
      "accadere, capitare",
      "Случаться descrive eventi che accadono ripetutamente o in generale, случиться un episodio specifico avvenuto una volta.",
      sq("Ieri è successo qualcosa di inaspettato, un episodio unico.", "Вчера случи́лось не́что стра́нное.", "perfettivo", "Ра́ньше ча́сто случа́лось не́что стра́нное.", "imperfettivo")
    ),
    vbPair(
      "удава́ться",
      [
      vf("Presente (a me)", "удаётся", "Мне удаётся всё успева́ть.", "Riesco a fare tutto in tempo (in generale)."),
      vf("Presente (a te)", "удаётся", "Тебе́ всегда́ удаётся находи́ть реше́ние.", "Riesci sempre a trovare una soluzione."),
      vf("Passato (processo)", "удава́лось", "Раньше мне не удава́лось э́то.", "Prima non mi riusciva."),
      ],
      "уда́ться",
      [
      vf("Passato (a me)", "уда́лось", "Мне уда́лось закончить вовремя.", "Sono riuscito a finire in tempo (una volta)."),
      vf("Futuro (a te)", "уда́стся", "Тебе уда́стся убедить его.", "Riuscirai a convincerlo."),
      vf("Passato (a lei)", "уда́лось", "Ей уда́лось получить визу.", "È riuscita a ottenere il visto."),
      ],
      "riuscire",
      "Costruzione impersonale (dativo + verbo): удаваться descrive il riuscire come tendenza generale, удаться l'aver avuto successo in un'occasione precisa.",
      sq("Alla fine sono riuscito a finire il progetto in tempo.", "Мне уда́лось зако́нчить прое́кт во́время.", "perfettivo", "Мне удава́лось зака́нчивать прое́кты во́время.", "imperfettivo")
    ),
    vbPair(
      "ока́зываться",
      [
      vf("Presente – io", "ока́зываюсь", "Я часто ока́зываюсь прав.", "Risulto spesso avere ragione."),
      vf("Presente – tu", "ока́зываешься", "Ты ока́зываешься правым каждый раз.", "Risulti avere ragione ogni volta."),
      vf("Passato (processo)", "ока́зывался", "Он всегда ока́зывался лучшим.", "Risultava sempre il migliore."),
      ],
      "оказа́ться",
      [
      vf("Passato (risultato)", "оказа́лся", "Он оказа́лся прав.", "È risultato avere ragione (fatto, una volta)."),
      vf("Futuro – io", "окажу́сь", "Я окажу́сь там первым.", "Mi ritroverò lì per primo."),
      vf("Futuro – tu", "ока́жешься", "Ты ока́жешься прав.", "Risulterai avere ragione."),
      ],
      "risultare, scoprirsi",
      "Оказываться descrive lo scoprirsi vero/falso come tendenza generale, оказаться il momento specifico della scoperta.",
      sq("Alla fine è risultato che lui aveva ragione, si è scoperto in quell'occasione.", "Он оказа́лся прав.", "perfettivo", "Он ока́зывался прав ка́ждый раз.", "imperfettivo")
    ),
    vbPair(
      "приходи́ться",
      [
      vf("Presente (a me)", "прихо́дится", "Мне прихо́дится ра́но вставать.", "Sono costretto ad alzarmi presto (in generale)."),
      vf("Presente (a te)", "прихо́дится", "Тебе часто прихо́дится ждать.", "Sei spesso costretto ad aspettare."),
      vf("Passato (processo)", "приходи́лось", "Раньше мне приходи́лось экономить.", "Prima ero costretto a risparmiare."),
      ],
      "прийти́сь",
      [
      vf("Passato (risultato)", "пришло́сь", "Мне пришло́сь уйти раньше.", "Sono stato costretto ad andarmene prima (una volta)."),
      vf("Futuro", "придётся", "Тебе придётся объяснить э́то.", "Sarai costretto a spiegarlo."),
      vf("Passato (a lei)", "пришло́сь", "Ей пришло́сь согласиться.", "È stata costretta ad accettare."),
      ],
      "essere costretti a, toccare",
      "Costruzione impersonale: приходиться descrive l'essere costretti come situazione ricorrente, прийтись l'obbligo specifico in un'occasione precisa.",
      sq("Ieri sono stato costretto ad andarmene prima dal lavoro, un episodio specifico.", "Мне пришло́сь уйти́ ра́ньше.", "perfettivo", "Мне всегда приходи́лось уходи́ть ра́ньше.", "imperfettivo")
    ),
    vbPair(
      "везти́",
      [
      vf("Presente (a me)", "везёт", "Мне всегда́ везёт в игре́.", "Sono sempre fortunato nel gioco (in generale)."),
      vf("Presente (a te)", "везёт", "Тебе́ везёт с пого́дой.", "Sei fortunato col tempo."),
      vf("Passato (processo)", "везло́", "Раньше мне не везло́.", "Prima non ero fortunato."),
      ],
      "повезти́",
      [
      vf("Passato (a me)", "повезло́", "Мне повезло́ вчера.", "Sono stato fortunato ieri (un episodio)."),
      vf("Futuro (a te)", "повезёт", "Тебе́ повезёт в сле́дующий раз.", "Sarai fortunato la prossima volta."),
      vf("Passato (a lei)", "повезло́", "Ей повезло́ с работой.", "È stata fortunata col lavoro."),
      ],
      "essere fortunati",
      "Costruzione impersonale: везти descrive la fortuna come tendenza generale, повезти un episodio specifico di buona sorte.",
      sq("Sono stato fortunato proprio ieri, un episodio specifico.", "Мне повезло́ вчера́.", "perfettivo", "Мне всегда́ везло́.", "imperfettivo")
    ),
    vbPair(
      "удивля́ться",
      [
      vf("Presente – io", "удивля́юсь", "Я удивля́юсь его терпению.", "Mi sorprendo della sua pazienza (in generale)."),
      vf("Presente – tu", "удивля́ешься", "Ты ничему не удивля́ешься.", "Non ti sorprendi di niente."),
      vf("Passato (processo)", "удивля́лся", "Он всегда удивля́лся её энергии.", "Si sorprendeva sempre della sua energia."),
      ],
      "удиви́ться",
      [
      vf("Passato (risultato)", "удиви́лся", "Я удиви́лся но́вости.", "Mi sono sorpreso della notizia (un istante)."),
      vf("Futuro – io", "удивлю́сь", "Я не удивлю́сь, если э́то правда.", "Non mi sorprenderò se è vero."),
      vf("Imperativo", "не удиви́сь", "Не удиви́сь, если он опоздает.", "Non sorprenderti se farà tardi."),
      ],
      "sorprendersi, meravigliarsi",
      "Удивляться è il sorprendersi come reazione abituale, удивиться il momento specifico dello stupore.",
      sq("Mi sono appena sorpreso nel sentire la notizia.", "Я удиви́лся но́вости.", "perfettivo", "Я всегда́ удивля́лся тако́й но́вости.", "imperfettivo")
    ),
    vbPair(
      "хвата́ть",
      [
      vf("Presente", "хвата́ет", "Мне хвата́ет времени.", "Ho abbastanza tempo (in generale)."),
      vf("Presente (negativo)", "не хвата́ет", "Мне не хвата́ет денег.", "Non ho abbastanza soldi (situazione generale)."),
      vf("Passato (processo)", "хвата́ло", "Раньше мне не хвата́ло терпения.", "Prima non avevo abbastanza pazienza."),
      ],
      "хвати́ть",
      [
      vf("Passato (risultato)", "хвати́ло", "Денег хвати́ло на всё.", "I soldi sono bastati per tutto (alla fine, un risultato)."),
      vf("Futuro", "хва́тит", "Э́того хва́тит на неде́лю.", "Questo basterà per una settimana."),
      vf("Esclamativo", "хва́тит!", "Хва́тит спо́рить!", "Basta discutere!"),
      ],
      "bastare, essere sufficiente",
      "Costruzione impersonale con genitivo: хватать descrive il bastare come stato generale, хватить il raggiungimento del limite in un momento preciso.",
      sq("Alla fine i soldi sono bastati per tutto il viaggio, un risultato concreto.", "Де́ньги хвати́ло на всю пое́здку.", "perfettivo", "Де́нег всегда́ хвата́ло на пое́здки.", "imperfettivo")
    ),
    vbPair(
      "возника́ть",
      [
      vf("Presente – esso", "возника́ет", "Проблема возника́ет часто.", "Il problema sorge spesso."),
      vf("Presente – loro", "возника́ют", "Вопро́сы возника́ют постоянно.", "Le domande sorgono di continuo."),
      vf("Passato (processo)", "возника́л", "Конфликт всегда возника́л внезапно.", "Il conflitto sorgeva sempre all'improvviso."),
      ],
      "возни́кнуть",
      [
      vf("Passato (risultato)", "возни́к", "Возни́кла иде́я.", "È sorta un'idea (un istante)."),
      vf("Futuro", "возни́кнет", "Проблема не возни́кнет.", "Il problema non sorgerà."),
      vf("Passato (plurale)", "возни́кли", "Возни́кли трудности.", "Sono sorte delle difficoltà."),
      ],
      "sorgere, insorgere",
      "Возникать è il sorgere come processo/tendenza, возникнуть l'atto specifico dell'apparizione improvvisa.",
      sq("All'improvviso è sorta un'ottima idea durante la riunione.", "Внеза́пно возни́кла отли́чная иде́я.", "perfettivo", "Иде́и постоя́нно возника́ли на встре́че.", "imperfettivo")
    ),
    vbPair(
      "исчеза́ть",
      [
      vf("Presente – esso", "исчеза́ет", "Проблема не исчеза́ет.", "Il problema non scompare."),
      vf("Presente – loro", "исчеза́ют", "Деньги бы́стро исчеза́ют.", "I soldi spariscono in fretta."),
      vf("Passato (processo)", "исчеза́л", "Он часто исчеза́л без объяснений.", "Spariva spesso senza spiegazioni."),
      ],
      "исче́знуть",
      [
      vf("Passato (risultato)", "исче́з", "Он исче́з внезапно.", "È scomparso all'improvviso (un istante)."),
      vf("Futuro", "исче́знет", "Проблема исче́знет сама.", "Il problema scomparirà da solo."),
      vf("Imperativo", "исче́зни", "Исче́зни отсюда!", "Sparisci da qui!"),
      ],
      "scomparire",
      "Исчезать è lo scomparire come processo/tendenza, исчезнуть l'atto specifico della scomparsa in un istante.",
      sq("È scomparso all'improvviso senza lasciare traccia.", "Он исче́з внеза́пно без следа́.", "perfettivo", "Он исчеза́л ча́сто без объясне́ний.", "imperfettivo")
    ),
    vbPair(
      "допуска́ть",
      [
      vf("Presente – io", "допуска́ю", "Я допуска́ю ошибку.", "Ammetto l'errore (possibilità)."),
      vf("Presente – tu", "допуска́ешь", "Ты допуска́ешь э́то?", "Lo ammetti come possibile?"),
      vf("Passato (processo)", "допуска́л", "Он всегда допуска́л возможность.", "Ammetteva sempre la possibilità."),
      ],
      "допусти́ть",
      [
      vf("Passato (risultato)", "допусти́л", "Я допусти́л ошибку.", "Ho commesso un errore (fatto)."),
      vf("Futuro – io", "допущу́", "Я не допущу́ э́того.", "Non lo permetterò."),
      vf("Imperativo (negativo)", "не допусти́", "Не допусти́ ошибку!", "Non commettere l'errore!"),
      ],
      "ammettere, permettere (un'ipotesi/errore)",
      "Допускать è l'ammettere come processo/tendenza, допустить l'atto specifico di aver commesso o permesso qualcosa.",
      sq("Ho appena commesso un errore grave nel calcolo.", "Я допусти́л серьёзную оши́бку в расчёте.", "perfettivo", "Я допуска́л оши́бки постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "претерпева́ть",
      [
      vf("Presente – esso", "претерпева́ет", "Система претерпева́ет изменения.", "Il sistema sta subendo cambiamenti."),
      vf("Presente – loro", "претерпева́ют", "Цены претерпева́ют колебания.", "I prezzi subiscono oscillazioni."),
      vf("Passato (processo)", "претерпева́л", "Проект до́лго претерпева́л изменения.", "Il progetto subiva cambiamenti da tempo."),
      ],
      "претерпе́ть",
      [
      vf("Passato (risultato)", "претерпе́л", "План претерпе́л изменения.", "Il piano ha subito cambiamenti (fatto)."),
      vf("Futuro", "претерпи́т", "Курс претерпи́т корректировку.", "Il corso subirà una correzione."),
      vf("Passato (plurale)", "претерпе́ли", "Правила претерпе́ли реформу.", "Le regole hanno subito una riforma."),
      ],
      "subire (cambiamenti)",
      "Претерпевать è il subire cambiamenti come processo, претерпеть il completamento — il cambiamento è ormai avvenuto.",
      sq("Il piano originale ha subito modifiche sostanziali all'ultimo momento.", "Первонача́льный план претерпе́л суще́ственные измене́ния.", "perfettivo", "План постоя́нно претерпева́л измене́ния.", "imperfettivo")
    ),
    vbPair(
      "посяга́ть",
      [
      vf("Presente – esso", "посяга́ет", "Никто не посяга́ет на права.", "Nessuno attenta ai diritti."),
      vf("Presente – loro", "посяга́ют", "Они не посяга́ют на территорию.", "Non insidiano il territorio."),
      vf("Passato (processo)", "посяга́л", "Никто не посяга́л на его власть.", "Nessuno insidiava il suo potere."),
      ],
      "посягну́ть",
      [
      vf("Passato (risultato)", "посягну́л", "Он посягну́л на чужое.", "Ha attentato a beni altrui (un istante)."),
      vf("Futuro", "посягнёт", "Никто не посягнёт на э́то.", "Nessuno oserà attentarvi."),
      vf("Imperativo (negativo)", "не посягни́", "Не посягни́ на э́то!", "Non attentarvi!"),
      ],
      "attentare, insidiare",
      "Посягать è l'attentare come tendenza/atteggiamento, посягнуть l'atto specifico del tentativo.",
      sq("In quell'occasione ha osato attentare ai beni della famiglia.", "Он посягну́л на иму́щество семьи́.", "perfettivo", "Он посяга́л на иму́щество давно́.", "imperfettivo")
    ),
    vbPair(
      "испы́тывать",
      [
      vf("Presente – io", "испы́тываю", "Я испы́тываю радость.", "Provo gioia."),
      vf("Presente – tu", "испы́тываешь", "Ты испы́тываешь страх?", "Provi paura?"),
      vf("Passato (stato)", "испы́тывал", "Он всегда испы́тывал уважение.", "Provava sempre rispetto."),
      ],
      "испыта́ть",
      [
      vf("Passato (risultato)", "испыта́л", "Я испыта́л шок.", "Ho provato uno shock (un istante)."),
      vf("Futuro – io", "испыта́ю", "Я испыта́ю э́то чувство сно́ва.", "Proverò di nuovo questa sensazione."),
      vf("Imperativo", "испыта́й", "Испыта́й э́то сам!", "Provalo tu stesso!"),
      ],
      "provare, sperimentare (un sentimento)",
      "Испытывать è il provare un sentimento come stato/processo, испытать l'atto specifico di aver provato qualcosa in un momento preciso.",
      sq("Ho provato improvvisamente un forte senso di sollievo.", "Я внеза́пно испыта́л си́льное облегче́ние.", "perfettivo", "Я испы́тывал облегче́ние ча́сто.", "imperfettivo")
    ),
    vbPair(
      "перекликáться",
      [
      vf("Presente – esso", "переклика́ется", "Эта идея переклика́ется с прошлой.", "Questa idea si ricollega alla precedente."),
      vf("Presente – loro", "переклика́ются", "Темы переклика́ются друг с другом.", "I temi si richiamano a vicenda."),
      vf("Passato (processo)", "переклика́лся", "Мотив переклика́лся с классикой.", "Il motivo si ricollegava ai classici."),
      ],
      "перекли́кнуться",
      [
      vf("Passato (risultato)", "перекли́кнулся", "Роман перекли́кнулся с реальностью.", "Il romanzo ha trovato un riscontro nella realtà (un istante)."),
      vf("Futuro", "перекли́кнется", "Э́то перекли́кнется с темой.", "Questo si ricollegherà al tema."),
      vf("Passato (plurale)", "перекли́кнулись", "Идеи неожиданно перекли́кнулись.", "Le idee si sono inaspettatamente ricollegate."),
      ],
      "corrispondersi, richiamarsi (a vicenda)",
      "Перекликаться descrive una corrispondenza tematica come stato continuo, перекликнуться un richiamo specifico in un unico momento.",
      sq("Le due idee si sono inaspettatamente ricollegate in un unico momento di intuizione.", "Две́ иде́и неожи́данно перекли́кнулись.", "perfettivo", "Иде́и постоя́нно переклика́лись друг с дру́гом.", "imperfettivo")
    ),
    vbPair(
      "пресле́довать",
      [
      vf("Presente – io", "пресле́дую", "Я пресле́дую цель.", "Perseguo un obiettivo."),
      vf("Presente – tu", "пресле́дуешь", "Ты пресле́дуешь его?", "Lo stai perseguitando?"),
      vf("Passato (processo)", "пресле́довал", "Полиция до́лго преследовала преступника.", "La polizia ha inseguito a lungo il criminale."),
      ],
      "пресле́довать",
      [
      vf("Presente (loro)", "пресле́дуют", "Их пресле́дуют неудачи.", "Sono perseguitati dalla sfortuna."),
      vf("Futuro", "бу́дет пресле́довать", "Э́то бу́дет пресле́довать его.", "Questo lo perseguiterà."),
      vf("Passato (esteso)", "пресле́довали", "Их до́лго пресле́довали.", "Sono stati perseguitati a lungo."),
      ],
      "perseguitare, perseguire (un obiettivo)",
      "Преследовать è tipicamente imperfectivum tantum (verbo di processo continuo senza limite naturale): non ha un perfettivo distinto in questo significato.",
      sq("La polizia ha inseguito il criminale per tutta la città, un processo esteso.", "Поли́ция до́лго пресле́довала престу́пника по всему́ го́роду.", "imperfettivo", "Поли́ция пресле́довала бы престу́пника мгнове́нно.", "perfettivo")
    ),
    vbPair(
      "затрагива́ть",
      [
      vf("Presente – esso", "затра́гивает", "Э́то затра́гивает всех.", "Questo riguarda tutti."),
      vf("Presente – io", "затра́гиваю", "Я затра́гиваю тему кратко.", "Tocco l'argomento brevemente."),
      vf("Passato (processo)", "затра́гивал", "Доклад затра́гивал разные вопро́сы.", "La relazione toccava diverse questioni."),
      ],
      "затро́нуть",
      [
      vf("Passato (risultato)", "затро́нул", "Я затро́нул важный вопро́с.", "Ho toccato una questione importante (fatto)."),
      vf("Futuro – io", "затро́ну", "Я затро́ну эту тему.", "Toccherò questo argomento."),
      vf("Imperativo", "затро́нь", "Затро́нь эту проблему!", "Tocca questo problema!"),
      ],
      "toccare, riguardare (un argomento)",
      "Затрагивать è il toccare un argomento come processo, затронуть il completamento — l'argomento è ormai toccato.",
      sq("Ho appena toccato brevemente una questione molto delicata durante il discorso.", "Я кра́тко затро́нул о́чень щекотли́вый вопро́с в докла́де.", "perfettivo", "Докла́д постоя́нно затра́гивал ра́зные вопро́сы.", "imperfettivo")
    ),
    vbPair(
      "сгла́живать",
      [
      vf("Presente – io", "сгла́живаю", "Я сгла́живаю конфликт.", "Sto attenuando il conflitto."),
      vf("Presente – tu", "сгла́живаешь", "Ты сгла́живаешь ситуацию?", "Stai smussando la situazione?"),
      vf("Passato (processo)", "сгла́живал", "Он всегда сгла́живал углы.", "Smussava sempre gli angoli."),
      ],
      "сгла́дить",
      [
      vf("Passato (risultato)", "сгла́дил", "Я сгла́дил конфликт.", "Ho attenuato il conflitto (fatto)."),
      vf("Futuro – io", "сгла́жу", "Я сгла́жу впечатление.", "Attenuerò l'impressione."),
      vf("Imperativo", "сгла́дь", "Сгла́дь э́то недоразумение!", "Attenua questo malinteso!"),
      ],
      "attenuare, smussare",
      "Сглаживать è l'attenuare come processo, сгладить il completamento — la tensione è ormai attenuata.",
      sq("Ho appena attenuato con successo un momento di tensione tra i colleghi.", "Я успе́шно сгла́дил моме́нт напряже́ния ме́жду колле́гами.", "perfettivo", "Я сгла́живал конфли́кты постоя́нно.", "imperfettivo")
    ),
    vbPair(
      "потвор́ствовать",
      [
      vf("Presente – io", "потвор́ствую", "Я потвор́ствую капризам.", "Assecondo i capricci."),
      vf("Presente – tu", "потвор́ствуешь", "Ты потвор́ствуешь лени?", "Assecondi la pigrizia?"),
      vf("Passato (processo)", "потвор́ствовал", "Родитель всегда потвор́ствовал ребёнку.", "Il genitore assecondava sempre il bambino."),
      ],
      "потвор́ствовать",
      [
      vf("Presente (loro)", "потвор́ствуют", "Они потвор́ствуют ошибкам.", "Assecondano gli errori."),
      vf("Futuro", "бу́дет потвор́ствовать", "Э́то бу́дет потвор́ствовать лени.", "Questo favorirà la pigrizia."),
      vf("Passato (esteso)", "потвор́ствовали", "Они до́лго потвор́ствовали капризам.", "Hanno assecondato a lungo i capricci."),
      ],
      "assecondare, favorire (con indulgenza)",
      "Потворствовать è tipicamente imperfectivum tantum: descrive un atteggiamento indulgente continuo, senza un limite naturale che ne giustifichi una forma perfettiva distinta.",
      sq("Il genitore ha assecondato per anni ogni capriccio del figlio, un processo esteso.", "Роди́тель года́ми потвор́ствовал ка́ждому капри́зу сы́на.", "imperfettivo", "Роди́тель потвор́ствовал бы капри́зу мгнове́нно.", "perfettivo")
    ),
    vbPair(
      "заостря́ть",
      [
      vf("Presente – io", "заостря́ю", "Я заостря́ю внимание на э́том.", "Sto mettendo l'accento su questo."),
      vf("Presente – tu", "заостря́ешь", "Ты заостря́ешь проблему?", "Stai mettendo in risalto il problema?"),
      vf("Passato (processo)", "заостря́л", "Автор всегда заостря́л конфликт.", "L'autore metteva sempre in risalto il conflitto."),
      ],
      "заостри́ть",
      [
      vf("Passato (risultato)", "заостри́л", "Я заостри́л э́тот момент.", "Ho messo in risalto questo punto (fatto)."),
      vf("Futuro – io", "заострю́", "Я заострю́ проблему.", "Metterò in risalto il problema."),
      vf("Imperativo", "заостри́", "Заостри́ на э́том внимание!", "Metti l'accento su questo!"),
      ],
      "acuire, mettere in risalto",
      "Заострять è il mettere in risalto come processo, заострить il completamento — un punto specifico è ormai enfatizzato.",
      sq("Ho appena messo in risalto un punto cruciale nel mio intervento.", "Я заостри́л внима́ние на ключево́м моме́нте выступле́ния.", "perfettivo", "А́втор постоя́нно заостря́л ра́зные моме́нты.", "imperfettivo")
    ),
    vbPair(
      "смягча́ть",
      [
      vf("Presente – io", "смягча́ю", "Я смягча́ю критику.", "Sto mitigando la critica."),
      vf("Presente – tu", "смягча́ешь", "Ты смягча́ешь тон?", "Stai addolcendo il tono?"),
      vf("Passato (processo)", "смягча́л", "Дипломат всегда смягча́л формулировки.", "Il diplomatico attenuava sempre le formulazioni."),
      ],
      "смягчи́ть",
      [
      vf("Passato (risultato)", "смягчи́л", "Я смягчи́л ответ.", "Ho attenuato la risposta (fatto)."),
      vf("Futuro – io", "смягчу́", "Я смягчу́ тон.", "Addolcirò il tono."),
      vf("Imperativo", "смягчи́", "Смягчи́ выражения!", "Attenua le espressioni!"),
      ],
      "mitigare, addolcire",
      "Смягчать è il mitigare come processo, смягчить il completamento — l'effetto è ormai attenuato.",
      sq("Ho appena attenuato deliberatamente il tono della mia risposta scritta.", "Я наро́чно смягчи́л тон своего́ отве́та.", "perfettivo", "Дипло́мат постоя́нно смягча́л формулиро́вки.", "imperfettivo")
    ),
    vbPair(
      "обосно́вывать",
      [
      vf("Presente – io", "обосно́вываю", "Я обосно́вываю решение.", "Sto motivando la decisione."),
      vf("Presente – tu", "обосно́вываешь", "Ты обосно́вываешь выбор?", "Stai giustificando la scelta?"),
      vf("Passato (processo)", "обосно́вывал", "Учёный годами обосно́вывал теорию.", "Lo scienziato motivava la teoria da anni."),
      ],
      "обоснова́ть",
      [
      vf("Passato (risultato)", "обоснова́л", "Я обоснова́л позицию.", "Ho motivato la posizione (fatto)."),
      vf("Futuro – io", "обосну́ю", "Я обосну́ю э́то подробно.", "Lo motiverò in dettaglio."),
      vf("Imperativo", "обосну́й", "Обосну́й свой выбор!", "Motiva la tua scelta!"),
      ],
      "motivare, giustificare (con argomenti)",
      "Обосновывать è il motivare come processo argomentativo, обосновать il completamento — la motivazione è data e completa.",
      sq("Ho appena motivato dettagliatamente la mia decisione finale davanti alla commissione.", "Я подро́бно обоснова́л своё оконча́тельное реше́ние пе́ред коми́ссией.", "perfettivo", "Учёный года́ми обосно́вывал свою́ тео́рию.", "imperfettivo")
    ),
    vbPair(
      "переоце́нивать",
      [
      vf("Presente – io", "переоце́ниваю", "Я не переоце́ниваю свои силы.", "Non sopravvaluto le mie forze."),
      vf("Presente – tu", "переоце́ниваешь", "Ты переоце́ниваешь риск?", "Stai sopravvalutando il rischio?"),
      vf("Passato (processo)", "переоце́нивал", "Он всегда переоце́нивал свои возможности.", "Sopravvalutava sempre le proprie capacità."),
      ],
      "переоцени́ть",
      [
      vf("Passato (risultato)", "переоцени́л", "Я переоцени́л свои силы.", "Ho sopravvalutato le mie forze (fatto)."),
      vf("Futuro – io", "переоценю́", "Я не переоценю́ э́то.", "Non lo sopravvaluterò."),
      vf("Imperativo (negativo)", "не переоцени́", "Не переоцени́ себя!", "Non sopravvalutarti!"),
      ],
      "sopravvalutare",
      "Переоценивать è il sopravvalutare come processo, переоценить il completamento — una valutazione eccessiva specifica data.",
      sq("Ho appena sopravvalutato seriamente le mie capacità in quella gara specifica.", "Я серьёзно переоцени́л свои́ возмо́жности в той соревнова́нии.", "perfettivo", "Он постоя́нно переоце́нивал свои́ возмо́жности.", "imperfettivo")
    ),
    vbPair(
      "недооце́нивать",
      [
      vf("Presente – io", "недооце́ниваю", "Я не недооце́ниваю риск.", "Non sottovaluto il rischio."),
      vf("Presente – tu", "недооце́ниваешь", "Ты недооце́ниваешь проблему?", "Stai sottovalutando il problema?"),
      vf("Passato (processo)", "недооце́нивал", "Он часто недооце́нивал соперника.", "Sottovalutava spesso l'avversario."),
      ],
      "недооцени́ть",
      [
      vf("Passato (risultato)", "недооцени́л", "Я недооцени́л ситуацию.", "Ho sottovalutato la situazione (fatto)."),
      vf("Futuro – io", "недооценю́", "Я не недооценю́ э́то.", "Non lo sottovaluterò."),
      vf("Imperativo (negativo)", "не недооцени́", "Не недооцени́ его!", "Non sottovalutarlo!"),
      ],
      "sottovalutare",
      "Недооценивать è il sottovalutare come processo, недооценить il completamento — una sottovalutazione specifica avvenuta.",
      sq("Ho appena sottovalutato gravemente la difficoltà di quel compito specifico.", "Я серьёзно недооцени́л сло́жность того́ зада́ния.", "perfettivo", "Он ча́сто недооце́нивал сло́жность зада́ний.", "imperfettivo")
    ),
    vbPair(
      "побужда́ть",
      [
      vf("Presente – esso", "побужда́ет", "Э́то побужда́ет к действию.", "Questo spinge all'azione."),
      vf("Presente – io", "побужда́ю", "Я побужда́ю его к учёбе.", "Lo spingo a studiare."),
      vf("Passato (processo)", "побужда́л", "Учитель всегда побужда́л учеников думать.", "L'insegnante spingeva sempre gli studenti a pensare."),
      ],
      "побуди́ть",
      [
      vf("Passato (risultato)", "побуди́л", "Э́то побудило его уйти.", "Questo l'ha spinto ad andarsene (fatto)."),
      vf("Futuro – io", "побужу́", "Я побужу́ его действовать.", "Lo indurrò ad agire."),
      vf("Imperativo", "побуди́", "Побуди́ его к действию!", "Spingilo all'azione!"),
      ],
      "spingere, indurre (a fare qualcosa)",
      "Побуждать è lo spingere/indurre come processo, побудить il completamento — la spinta ha avuto effetto.",
      sq("Quel discorso specifico l'ha spinto a cambiare completamente idea.", "Тот докла́д побуди́л его́ по́лностью измени́ть мне́ние.", "perfettivo", "Докла́ды постоя́нно побужда́ли его́ к размышле́ниям.", "imperfettivo")
    ),
    vbPair(
      "содержа́ться",
      [
      vf("Presente – esso", "соде́ржится", "В тексте соде́ржится ошибка.", "Nel testo è contenuto un errore."),
      vf("Presente – loro", "соде́ржатся", "В договоре соде́ржатся условия.", "Nel contratto sono contenute delle condizioni."),
      vf("Passato (processo)", "соде́ржался", "В отчёте соде́ржался анализ.", "Nel rapporto era contenuta un'analisi."),
      ],
      "содержа́ться",
      [
      vf("Futuro", "бу́дет содержа́ться", "В новой версии бу́дет содержа́ться исправление.", "Nella nuova versione sarà contenuta una correzione."),
      vf("Presente (continuo)", "продолжа́ет содержа́ться", "Ошибка продолжа́ет содержа́ться в коде.", "L'errore continua a essere presente nel codice."),
      vf("Passato (esteso)", "долго́ содержа́лся", "В архиве долго́ содержа́лся докуме́нт.", "Nell'archivio era conservato a lungo il documento."),
      ],
      "essere contenuto, consistere",
      "Содержаться è tipicamente imperfectivum tantum: descrive una relazione statica di contenuto, senza un limite naturale che richieda una forma perfettiva.",
      sq("Nel contratto sono sempre state contenute quelle stesse clausole, per anni.", "В догово́ре года́ми соде́ржались те же усло́вия.", "imperfettivo", "В догово́ре бу́дут соде́ржаться усло́вия мгнове́нно.", "perfettivo")
    ),
    vbPair(
      "воплоща́ть",
      [
      vf("Presente – io", "воплоща́ю", "Я воплоща́ю идею в жизнь.", "Sto realizzando l'idea nella pratica."),
      vf("Presente – tu", "воплоща́ешь", "Ты воплоща́ешь план?", "Stai realizzando il piano?"),
      vf("Passato (processo)", "воплоща́л", "Он годами воплоща́л мечту.", "Ha realizzato il sogno nel corso degli anni."),
      ],
      "воплоти́ть",
      [
      vf("Passato (risultato)", "воплоти́л", "Я воплоти́л идею.", "Ho realizzato l'idea (fatto)."),
      vf("Futuro – io", "воплощу́", "Я воплощу́ э́то в жизнь.", "Lo realizzerò concretamente."),
      vf("Imperativo", "воплоти́", "Воплоти́ свою мечту!", "Realizza il tuo sogno!"),
      ],
      "realizzare, incarnare",
      "Воплощать è il realizzare concretamente un'idea come processo, воплотить il completamento — l'idea è ormai diventata realtà.",
      sq("Ho appena realizzato concretamente l'idea che avevo in mente da tempo.", "Я воплоти́л свою́ иде́ю в жизнь.", "perfettivo", "Я воплоща́л иде́ю года́ми.", "imperfettivo")
    ),
    vbPair(
      "иска́жать",
      [
      vf("Presente – io", "искажа́ю", "Я не искажа́ю факты.", "Non distorco i fatti."),
      vf("Presente – tu", "искажа́ешь", "Ты искажа́ешь смысл?", "Stai distorcendo il senso?"),
      vf("Passato (processo)", "искажа́л", "Пре́сса ча́сто искажа́ла пра́вду.", "La stampa distorceva spesso la verità."),
      ],
      "искази́ть",
      [
      vf("Passato (risultato)", "искази́л", "Он искази́л мои слова.", "Ha distorto le mie parole (fatto)."),
      vf("Futuro – io", "искажу́", "Я не искажу́ правду.", "Non distorcerò la verità."),
      vf("Imperativo (negativo)", "не искази́", "Не искази́ смысл!", "Non distorcere il senso!"),
      ],
      "distorcere, travisare",
      "Искажать è il distorcere come processo, исказить il completamento — il senso è ormai travisato.",
      sq("Ha appena travisato completamente le mie parole durante l'intervista.", "Он искази́л мои́ слова́ в интервью́.", "perfettivo", "Пре́сса ча́сто искажа́ла пра́вду.", "imperfettivo")
    ),
    vbPair(
      "олицетворя́ть",
      [
      vf("Presente – esso", "олицетворя́ет", "Он олицетворя́ет успех.", "Incarna il successo."),
      vf("Presente – io", "олицетворя́ю", "Я олицетворя́ю традицию.", "Incarno la tradizione."),
      vf("Passato (stato)", "олицетворя́л", "Символ веками олицетворя́л мир.", "Il simbolo incarnava la pace da secoli."),
      ],
      "олицетвори́ть",
      [
      vf("Presente (loro)", "олицетворя́ют", "Они олицетворя́ют надежду.", "Incarnano la speranza."),
      vf("Futuro", "бу́дет олицетворя́ть", "Э́то бу́дет олицетворя́ть единство.", "Questo incarnerà l'unità."),
      vf("Passato (esteso)", "олицетворя́ли", "Герои олицетворя́ли храбрость.", "Gli eroi incarnavano il coraggio."),
      ],
      "incarnare, simboleggiare",
      "Олицетворять è tipicamente imperfectivum tantum: descrive una relazione simbolica continua, senza un limite naturale che richieda una forma perfettiva.",
      sq("Quel monumento ha incarnato per generazioni lo spirito della città, un processo esteso.", "Тот па́мятник поколе́ниями олицетворя́л дух го́рода.", "imperfettivo", "Тот па́мятник бу́дет олицетворя́ть дух мгнове́нно.", "perfettivo")
    ),
  ],
};
