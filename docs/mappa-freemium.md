# Mappa tecnica del Freemium — Матрёшка Мариса

Riferimento di come funziona lo sblocco a pagamento, già interamente implementato nel codice (vedi la nota in fondo al documento).

---

## Principio generale

**Non serve una lista di "sezioni premium"** separata dal contenuto — la regola è quasi tutta su UNA variabile: **il livello CEFR** (`A1`/`A2`/`B1`/`B2`/`C1`/`C2`). Le sezioni "trasversali" (Carte, Sessione, Corsivo) restano codice unico, semplicemente filtrano il contenuto in base al livello sbloccato — non serve duplicare logica.

```js
const FREE_LEVELS = ["A1", "A2"];  // unica fonte di verità per "cosa è gratis per livello" — aggiornato: A2 esteso a gratuito
function isLevelFree(levelId) {
  return FREE_LEVELS.includes(levelId);
}
```

---

## 🟢 Sempre gratis (indipendentemente dal livello)

| Vista (`view`) | Componente | Note |
|---|---|---|
| `insidie` | `InsidieItalianiView` | Contenuto fisso, non dipende dal livello |
| `placement` | Test di piazzamento | Deve restare accessibile anche senza abbonamento |
| `search` | Ricerca vocabolario | Leggero, buon gancio per il freemium |
| `difficolta` | `DifficoltaView` | **Con tetto**: max 20 elementi in coda contemporaneamente (vedi sotto) |

## 🔒 Filtrate per livello (gratis su A1-A2, premium su B1-C2)

Tutte le seguenti viste già ricevono `level` come prop o filtrano per livello attivo — la modifica è aggiungere un controllo `isLevelFree(level) || premium.active` prima di mostrare il contenuto, non prima di mostrare il pulsante (il pulsante resta visibile, il contenuto oltre A2 mostra un invito a sbloccare):

| Vista (`view`) | Componente | Dati coinvolti |
|---|---|---|
| `declensions` | Casi | `DECLENSIONS[level]` |
| `verbs` | Verbi | `VERBS[level]` |
| `adjectives` | Aggettivi | `ADJECTIVES[level]` |
| `prepositions` | Preposizioni | `PREPOSITIONS[level]` |
| `pronouns`, `numerals`, `numbers-practice`, `adverbs`, `conjunctions`, `particles`, `interjections` | Le 5 parti invariabili + numeri + pronomi | `grammar-minor.js` |
| `syntax` | Analisi sintattica | `grammar-minor.js` |
| `compose` | Componi | `phrases-compose.js` |
| `phrases` | Frasi | `phrases-compose.js` |
| `dialogues` | Dialoghi | `dialogues.js` |
| `flashcards` | Carte | filtra per livello attivo |
| `session` | Sessione | filtra per livello attivo |
| `corsivo` | Scrivi in corsivo | filtra per livello attivo |
| Lezioni (dentro `activeSector === "lezioni"`) | `allLessonsFor(level)` | `lessons.js` |

## 🔒 Sempre premium (nessuna versione gratuita, a qualsiasi livello)

| Funzione | Dove nel codice | Perché |
|---|---|---|
| Generazione pacchetti con IA | Ogni pulsante "+ Nuovo pacchetto" (`onGenerate*`) | Costo reale lato server ad ogni generazione |
| Piani di studio personalizzati | `view === "programma"` | Funzionalità di pianificazione, valore alto |
| Le mie difficoltà **oltre 20 elementi** | `DifficoltaView`, filtro sulla `queue` | Il tetto stesso è la leva di conversione |

---

## Come mostrare il muro (UX, non solo logica)

Per ogni sezione filtrata per livello: **non nascondere il pulsante del livello B1-C2** — mostralo, ma al click apri una schermata con:
- Un assaggio (es. prima voce/frase visibile, il resto sfocato o coperto)
- Un pulsante chiaro "Sblocca [livello] con l'abbonamento — X €/anno"

Questo è meglio di nascondere del tutto i livelli superiori: fa vedere quanto contenuto c'è oltre, il che è il miglior argomento di vendita che l'app ha (60 lezioni, non 10).

---

## Stato dell'abbonamento nel codice (quando implementeremo il pagamento vero)

Un solo punto di verità, da caricare all'avvio come già fatto per `premium` (voce) — probabilmente da rinominare per evitare confusione col nome attuale:

```js
const [subscription, setSubscription] = useState({ active: false, expiresAt: null });
```

Verificato tramite RevenueCat (o il plugin scelto) al mount, con fallback "non attivo" se il controllo fallisce — mai bloccare l'app per un errore di verifica abbonamento.

---

*Questo documento descriveva la specifica PRIMA che l'abbonamento fosse costruito — è già stato interamente implementato (RevenueCat + StoreKit, vedi `PaywallView` e `subscription` in `client/src/App.jsx`). La logica `FREE_LEVELS`/`isLevelFree` sopra corrisponde esattamente al codice reale attuale; il resto del documento resta utile come riferimento di cosa è filtrato per livello e cosa è sempre premium, ma non è più "da fare".*
