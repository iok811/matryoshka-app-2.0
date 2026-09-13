import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { BookOpen, Flame, Check, X, Volume2, Mic, ChevronRight, Sparkles, Layers, Languages } from "lucide-react";
import { ex, prep, vf, af, adj, vbPair, sq } from "./data/grammar-helpers.js";
import { PREPOSITIONS } from "./data/grammar-prepositions.js";
import { DECLENSIONS } from "./data/grammar-declensions.js";
import { ADJECTIVES } from "./data/grammar-adjectives.js";
import { VERBS } from "./data/grammar-verbs.js";
import { dlLine, dlTurn, dlOpt, dialogue, DIALOGUES } from "./data/dialogues.js";
import { pg, cf, PHRASE_GROUPS, COMPOSE_GROUPS } from "./data/phrases-compose.js";
import { LESSONS } from "./data/lessons.js";
import { ADVERBS, CONJUNCTIONS, PARTICLES, INTERJECTIONS, NUMERALS, SIMPLE_POS_DATA_MAP, NUMBERS_TABLE, SYNTAX_SENTENCES, PRONOUN_SENTENCES, PRONOUNS, LEVEL_TESTS } from "./data/grammar-minor.js";

// Error Boundary a livello di radice: senza questo, un errore in QUALSIASI componente
// (anche il più piccolo, anche in una vista usata raramente) manda in schermata bianca
// l'intera app — inaccettabile per un'app pubblicata. Cattura l'errore, mostra un
// messaggio di recupero invece del crash, e offre un modo per ripartire senza perdere
// i progressi salvati (che vivono su file/localStorage, non nello stato React in memoria).
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    // solo log in console: nessun servizio di crash-reporting collegato, per restare
    // coerenti con "nessun dato inviato a terzi" dichiarato nella privacy policy.
    console.error("Matryoshka — errore catturato dal boundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            textAlign: "center",
            background: "#1B2430",
            color: "#F0EAD8",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: TEXT_SIZES.hero2XL }}>🪆</div>
          <div style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>Qualcosa è andato storto.</div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, maxWidth: 320 }}>
            I tuoi progressi restano salvati sul dispositivo. Ricarica per continuare da dove eri.
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              if (typeof window !== "undefined" && window.location && window.location.reload) {
                window.location.reload();
              }
            }}
            style={{
              background: "#D9A441",
              color: "#1B2430",
              border: "none",
              borderRadius: 10,
              padding: "12px 24px",
              fontSize: TEXT_SIZES.bodyLarge,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Ricarica
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Muro "assaggio + sblocca" per un livello non gratuito: mostrato AL POSTO del
// contenuto (non al posto del pulsante del livello, che resta sempre visibile e
// cliccabile — vedi docs/mappa-freemium.md). Fa vedere quanto contenuto c'è oltre
// invece di nasconderlo del tutto: è il miglior argomento di vendita che l'app ha.
function LevelLockWall({ levelId, onUnlock }) {
  const levelInfo = LEVELS.find((l) => l.id === levelId);
  return (
    <div
      style={{
        border: "1px dashed rgba(217,164,65,0.4)",
        borderRadius: 14,
        padding: "28px 20px",
        textAlign: "center",
        background: "rgba(217,164,65,0.06)",
      }}
    >
      <div className="lock-snap-in" style={{ fontSize: TEXT_SIZES.hero, marginBottom: 10 }}>🔒</div>
      <div style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginBottom: 6 }}>
        Livello {levelInfo ? levelInfo.label : levelId} — contenuto abbonamento
      </div>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 18, maxWidth: 340, marginInline: "auto" }}>
        Il livello A1 resta sempre gratuito. Dal livello A2 in poi, sblocca tutto — casi,
        verbi, aggettivi, dialoghi, lezioni e frasi — con l'abbonamento.
      </div>
      <button
        onClick={onUnlock}
        style={{
          background: "#D9A441",
          color: "#1B2430",
          border: "none",
          borderRadius: 10,
          padding: "12px 26px",
          fontSize: TEXT_SIZES.bodyLarge,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Sblocca con l'abbonamento
      </button>
    </div>
  );
}

// ---------- Content ----------

// Elenco delle "view" che corrispondono a una sottocategoria aperta dentro Impara:
// quando una di queste è attiva, la griglia dei pulsanti si nasconde per lasciare spazio al contenuto.
const IMPARA_SUBVIEWS = [
  "pronouns", "declensions", "verbs", "adjectives", "numerals", "numbers-practice",
  "prepositions", "adverbs", "conjunctions", "particles", "interjections", "syntax", "insidie", "reggenza", "comparativi", "participi", "condizionale",
];
const PRATICA_SUBVIEWS = ["compose", "difficolta", "phrases", "dialogues", "flashcards", "session", "corsivo", "conversazione", "scrittura-tempo"];

// Proprietà dei fiocchi di neve per l'effetto ambientale opzionale (❄️), generate
// UNA SOLA VOLTA al caricamento del modulo — così restano stabili per tutta la
// sessione invece di "saltare" ad ogni ri-render del componente App.
// Proprietà dei coriandoli per il traguardo settimanale della serie, generate UNA
// SOLA VOLTA al caricamento del modulo. Colori presi dalla stessa tavolozza già
// usata per i livelli (LEVELS sotto), per restare coerenti col resto dell'app.
const CONFETTI_COLORS = ["#D9A441", "#C1543C", "#5B84B1", "#7C8C6B", "#9A6B9E", "#E8D9B5"];
const CONFETTI_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 6 + Math.random() * 8,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  duration: 1.4 + Math.random() * 1,
  delay: Math.random() * 0.4,
  drift: Math.round((Math.random() - 0.5) * 160),
  spin: Math.round(Math.random() * 720 - 360),
}));

const SNOWFLAKES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: 10 + Math.random() * 14,
  duration: 8 + Math.random() * 10,
  delay: Math.random() * 10,
  drift: Math.round((Math.random() - 0.5) * 80),
}));

const LEVELS = [
  { id: "A1", label: "Principiante", color: "#C1543C", size: 62, ready: true },
  { id: "A2", label: "Elementare", color: "#D9A441", size: 100, ready: true },
  { id: "B1", label: "Intermedio", color: "#5B84B1", size: 140, ready: true },
  { id: "B2", label: "Intermedio alto", color: "#7C8C6B", size: 182, ready: true },
  { id: "C1", label: "Avanzato", color: "#9A6B9E", size: 228, ready: true },
  { id: "C2", label: "Madrelingua", color: "#E8D9B5", size: 275, ready: true },
];

// Calcola se il testo debba essere scuro o chiaro per restare leggibile sopra un dato
// colore di sfondo (formula di luminanza percepita), invece di un colore fisso che
// rischia di avere poco contrasto sulle tonalità più scure/sature dei livelli.
function readableTextColor(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1B2430" : "#F0EAD8";
}

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=PT+Sans:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');";

const MATRYOSHKA_SILHOUETTE_SVG = `
<svg width="120" height="160" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
  <path d="M60 8 C70 8 76 18 74 28 C92 40 102 62 102 88 C102 122 84 152 60 152 C36 152 18 122 18 88 C18 62 28 40 46 28 C44 18 50 8 60 8 Z"
        fill="none" stroke="white" stroke-width="3" stroke-linejoin="round"/>
  <path d="M40 66 C40 60 48 56 60 56 C72 56 80 60 80 66" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="49" cy="80" r="3.2" fill="white"/>
  <circle cx="71" cy="80" r="3.2" fill="white"/>
  <path d="M48 96 Q60 106 72 96" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M30 112 C42 122 78 122 90 112" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
</svg>`.trim();

const MATRYOSHKA_PATTERN_URI = "data:image/svg+xml," + encodeURIComponent(MATRYOSHKA_SILHOUETTE_SVG);

// Filigrana centrata per lo sfondo interno delle sezioni: una nuova forma piena
// (non ripetuta a pattern come quella sopra), pensata per restare discreta
// dietro al contenuto.
const MATRYOSHKA_WATERMARK_SVG = `
<svg width="260" height="340" viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg" opacity="0.05">
  <path d="M130,26 C168,26 195,54 190,84 C226,106 246,146 246,190 C246,258 198,318 130,318 C62,318 14,258 14,190 C14,146 34,106 70,84 C65,54 92,26 130,26 Z"
        fill="white"/>
  <path d="M70,84 C90,98 170,98 190,84" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/>
  <circle cx="102" cy="150" r="9" fill="white"/>
  <circle cx="158" cy="150" r="9" fill="white"/>
  <path d="M94,178 Q130,208 166,178" fill="none" stroke="white" stroke-width="7" stroke-linecap="round"/>
  <path d="M52,232 C82,256 178,256 208,232" fill="none" stroke="white" stroke-width="6" stroke-linecap="round"/>
  <circle cx="130" cy="272" r="13" fill="white"/>
</svg>`.trim();

const MATRYOSHKA_WATERMARK_URI = "data:image/svg+xml," + encodeURIComponent(MATRYOSHKA_WATERMARK_SVG);

// Versione a piena opacità e colorata della stessa matrioska stilizzata, per usarla
// come vera icona (non solo come filigrana di sfondo), es. nell'angolo della Home.
const MATRYOSHKA_ICON_SVG = `
<svg width="260" height="340" viewBox="0 0 260 340" xmlns="http://www.w3.org/2000/svg">
  <path d="M130,26 C168,26 195,54 190,84 C226,106 246,146 246,190 C246,258 198,318 130,318 C62,318 14,258 14,190 C14,146 34,106 70,84 C65,54 92,26 130,26 Z"
        fill="#D9A441"/>
  <path d="M70,84 C90,98 170,98 190,84" fill="none" stroke="#C1543C" stroke-width="9" stroke-linecap="round"/>
  <circle cx="102" cy="150" r="9" fill="#1B2430"/>
  <circle cx="158" cy="150" r="9" fill="#1B2430"/>
  <path d="M94,178 Q130,208 166,178" fill="none" stroke="#C1543C" stroke-width="7" stroke-linecap="round"/>
  <path d="M52,232 C82,256 178,256 208,232" fill="none" stroke="#C1543C" stroke-width="8" stroke-linecap="round"/>
  <circle cx="130" cy="272" r="13" fill="#7C8C6B"/>
</svg>`.trim();
const MATRYOSHKA_ICON_URI = "data:image/svg+xml," + encodeURIComponent(MATRYOSHKA_ICON_SVG);
// Stessa immagine usata come icona dell'app quando la si installa (col testo
// "Матрёшка Мариса" integrato) — incorporata qui come base64 così funziona sempre,
// senza dipendere dal caricamento di un file esterno in ambienti diversi.
const MATRYOSHKA_LABELED_ICON_URI = "data:image/png;base64,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TFTLmwJMmUDLxrFWYsCkzn1pbqFJ4aCk+YE2t3IZymlSbaKOIJSHSugARKnlsYLPYWMGtxDQEMblvMEHQwgljhm91L41s6aRmWtkQWOWpilWlZPq6xj9/6z1xX+08M+aW/up2qD4JCgNMszBUUU6oH+4k3847eG4fIzt7T+WC27N50B/WEL3+wp/K6W/cnW49NZ0b3o7+1MY+4eseFPisRIoUkgnIkkpb4eHkts4j50OIkCmYasQvS2Nj6yMH/uyj5Y7KMSfdZA05IGkYZA0JI8s5EGuE08sGAIFgQrgtw3dFwP61dYsaOyqaO3KOFu/r8gXhfD3AL382YdymY+qPXhYH2Mzw0ALfR/4D4z40kqgxIU3+691X1//id/f2tUSzA8KujCEdhSQpremXumKQSeFvDrVXE0nSeT3kQBrkDEI0/LoV5rmd6fnu5+dRfG5r70RFFtqbJvzm4W2f+3T7u/9NAQ65oXBi+AdSPNQLvPRtwcP6xNoj//EX84/vgH8GeCPCVoLoRdNY9+Ha3sKOBPAOq6M5m67viHAOurgcBcy5PgnOXp3/J6J+nRoZZyX0UzQG6tiUeQ3gJ8Q+C2A81/8X77uXf1g32V78LA+gWYiBwZwA/LjoF80qIgGNSnTd7cIMHpY42uDhzUAytg5K9cxG9FhSOp0cMbYW+tVNmYJh1/zYNXJ39O3xHVTFcS0wI4HT+rBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHuzBHmxq/38m7g/bQuJxbQAAABF0RVh0ZXhpZjpDb2xvclNwYWNlADEPmwJJAAAAIHRFWHRleGlmOkNvbXBvbmVudHNDb25maWd1cmF0aW9uAC4uLmryoWQAAAATdEVYdGV4aWY6RXhpZk9mZnNldAAxMDJzQimnAAAAFXRFWHRleGlmOkV4aWZWZXJzaW9uADAyMjHkXDUtAAAAGXRFWHRleGlmOkZsYXNoUGl4VmVyc2lvbgAwMTAwEtQorAAAABh0RVh0ZXhpZjpQaXhlbFhEaW1lbnNpb24AMjIwdkKctgAAABh0RVh0ZXhpZjpQaXhlbFlEaW1lbnNpb24AMjIxnEpNVgAAABd0RVh0ZXhpZjpTY2VuZUNhcHR1cmVUeXBlADAitDFjAAAAHHRFWHRleGlmOnRodW1ibmFpbDpDb21wcmVzc2lvbgA2+WVwVwAAACh0RVh0ZXhpZjp0aHVtYm5haWw6SlBFR0ludGVyY2hhbmdlRm9ybWF0ADI4NotSTnsAAAAvdEVYdGV4aWY6dGh1bWJuYWlsOkpQRUdJbnRlcmNoYW5nZUZvcm1hdExlbmd0aAA2Njc556Av8wAAAB90RVh0ZXhpZjp0aHVtYm5haWw6UmVzb2x1dGlvblVuaXQAMiVAXtMAAAAfdEVYdGV4aWY6dGh1bWJuYWlsOlhSZXNvbHV0aW9uADcyLzHahxgsAAAAH3RFWHRleGlmOnRodW1ibmFpbDpZUmVzb2x1dGlvbgA3Mi8xdO+JvQAAABd0RVh0ZXhpZjpZQ2JDclBvc2l0aW9uaW5nADGsD4BjAAAAAElFTkSuQmCC";

// Stile da applicare allo sfondo dei pannelli di sezione: aggiunge la filigrana
// centrata, molto discreta, dietro al contenuto esistente.
const sectionWatermarkStyle = {};

// Filigrana della matrioska stilizzata, riservata allo sfondo blu della Home.
const homeWatermarkStyle = {
  backgroundImage: `url("${MATRYOSHKA_WATERMARK_URI}")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center 80px",
  backgroundSize: "220px auto",
};

// ---------- Storage helpers ----------

// ATTENZIONE — DA CONFIGURARE PRIMA DELLA PUBBLICAZIONE SU APP STORE/GOOGLE
// PLAY: questo valore resta vuoto per lo sviluppo locale (dove il proxy di Vite
// in vite.config.js inoltra /api al backend su localhost:3001) — MA un'app
// Capacitor pubblicata gira come app nativa su "capacitor://localhost" (iOS) o
// un dominio virtuale simile (Android), MAI sullo stesso dominio del backend
// reale (che è un servizio remoto separato, es. su Render). Con questo valore
// ancora vuoto, ogni chiamata a "/api/..." fallirebbe silenziosamente su un
// vero dispositivo — non un crash (gestito con un messaggio "verifica la
// connessione"), ma la generazione IA, la conversazione e la voce premium
// smetterebbero di funzionare per chiunque, sempre, indipendentemente dalla
// qualità della connessione reale. Prima di pubblicare, sostituire con l'URL
// completo e pubblico del backend (es. "https://tuo-backend.onrender.com").
const API_BASE = "https://matryoshka-app.onrender.com";

// L'app riconosce da sola l'ambiente in cui gira: se è aperta come artifact
// dentro Claude.ai (dove esiste window.storage), usa quel meccanismo; se gira
// come app standalone pubblicata (nessun window.storage), usa il backend reale.
const IS_ARTIFACT_ENV = typeof window !== "undefined" && !!window.storage;

// Persistenza dei dati utente (progressi, pacchetti generati, impostazioni, ecc.).
// PRIORITÀ: mai dipendere dalla rete per salvare/leggere i progressi — sia perché l'app
// deve restare utilizzabile offline, sia perché un'unica chiave utente lato server
// (com'era prima) farebbe collidere i dati di utenti diversi in produzione.
//
// Tre percorsi, in ordine di controllo:
// 1. Anteprima artifact di Claude.ai (window.storage) — solo per il test in chat.
// 2. App nativa incapsulata con Capacitor: un file JSON per chiave in Directory.Data,
//    tramite @capacitor/filesystem (import dinamico, fallisce silenziosamente se il
//    pacchetto non è disponibile — stesso pattern già usato per notifiche e aptica).
// 3. Browser normale (nessun Capacitor): localStorage, sempre disponibile, nessuna rete.
const STORAGE_DIR = "matryoshka-data";
function storageFileName(key) {
  return `${STORAGE_DIR}/${encodeURIComponent(key)}.json`;
}
// Calcola la data (YYYY-MM-DD) del lunedì della settimana contenente "d" —
// usata per far ripartire da zero gli obiettivi settimanali ogni lunedì.
function mondayOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0=domenica..6=sabato
  const diff = day === 0 ? -6 : 1 - day; // porta al lunedì della stessa settimana
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
}

async function loadJSON(key, fallback) {
  if (IS_ARTIFACT_ENV) {
    try {
      const res = await window.storage.get(key);
      return res ? JSON.parse(res.value) : fallback;
    } catch {
      return fallback;
    }
  }
  try {
    const { Filesystem, Directory, Encoding } = await import("@capacitor/filesystem");
    const res = await Filesystem.readFile({
      path: storageFileName(key),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
    return JSON.parse(res.data);
  } catch {
    // non su Capacitor nativo (browser normale), o file non ancora creato: prova localStorage.
    try {
      const raw = window.localStorage.getItem(`matryoshka:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
}
async function saveJSON(key, value) {
  if (IS_ARTIFACT_ENV) {
    try {
      const res = await window.storage.set(key, JSON.stringify(value));
      return !!res;
    } catch {
      return false;
    }
  }
  try {
    const { Filesystem, Directory, Encoding } = await import("@capacitor/filesystem");
    // assicura che la cartella dati esista (silenzioso se già presente).
    try {
      await Filesystem.mkdir({ path: STORAGE_DIR, directory: Directory.Data, recursive: true });
    } catch {}
    await Filesystem.writeFile({
      path: storageFileName(key),
      directory: Directory.Data,
      data: JSON.stringify(value),
      encoding: Encoding.UTF8,
    });
    return true;
  } catch {
    // non su Capacitor nativo: salva su localStorage invece.
    try {
      window.localStorage.setItem(`matryoshka:${key}`, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
}

// ---------- Le mie difficoltà: coda di ripasso basata sugli errori reali ----------
// Ogni voce: { id, section, level, promptRu, promptIt, answerRu, answerIt, addedAt, box }
// "box" segue una logica Leitner semplice (0 = da rivedere subito, più alto = rivisto con successo più volte)
const DAY_MS = 24 * 60 * 60 * 1000;

// Pianifica la prossima revisione con una versione semplificata dell'algoritmo SM-2
// (lo stesso principio usato da Anki): ogni risposta corretta allunga l'intervallo
// prima della prossima revisione, ogni errore lo riporta a 1 giorno. Le voci non
// vengono mai cancellate definitivamente — restano nella coda con intervalli sempre
// più lunghi, così la parola viene ripresentata proprio quando si rischia di dimenticarla,
// invece di sparire per sempre dopo un paio di risposte corrette consecutive.
function scheduleReview(item, correct) {
  const ease = item.easeFactor || 2.5;
  if (correct) {
    if (!item.interval || item.interval === 0) item.interval = 1;
    else if (item.interval === 1) item.interval = 3;
    else item.interval = Math.max(1, Math.round(item.interval * ease));
    item.easeFactor = Math.min(3.0, ease + 0.1);
    item.reviewCount = (item.reviewCount || 0) + 1;
  } else {
    item.interval = 1;
    item.easeFactor = Math.max(1.3, ease - 0.2);
    item.lapses = (item.lapses || 0) + 1;
  }
  item.nextReview = Date.now() + item.interval * DAY_MS;
  return item;
}

async function recordMistake(section, level, promptRu, promptIt, answerRu, answerIt) {
  try {
    const queue = await loadJSON("mistakes-queue", []);
    // evita duplicati esatti (stessa sezione+risposta): aggiorna invece di duplicare
    const existingIdx = queue.findIndex((m) => m.section === section && m.answerRu === answerRu && m.promptRu === promptRu);
    if (existingIdx >= 0) {
      scheduleReview(queue[existingIdx], false);
      queue[existingIdx].addedAt = Date.now();
    } else {
      const item = {
        id: `${section}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        section,
        level,
        promptRu: promptRu || "",
        promptIt: promptIt || "",
        answerRu,
        answerIt: answerIt || "",
        addedAt: Date.now(),
        firstSeenAt: Date.now(), // impostato una sola volta, mai aggiornato — a
        // differenza di addedAt (che segna l'ultima volta sbagliata), serve a
        // sapere da QUANTO TEMPO l'utente lotta con questo errore specifico.
        interval: 0,
        easeFactor: 2.5,
        reviewCount: 0,
        lapses: 0,
      };
      scheduleReview(item, false); // appena sbagliata: va ripresentata a breve
      queue.push(item);
    }
    // limite ragionevole di dimensione della coda
    const trimmed = queue.slice(-500);
    await saveJSON("mistakes-queue", trimmed);
  } catch {
    // il tracciamento degli errori non deve mai bloccare l'esercizio in corso
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ---------- Audio helpers ----------

const TTS_SUPPORTED = typeof window !== "undefined" && !!window.speechSynthesis;
const SPEECH_RECOGNITION_SUPPORTED =
  typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

function pickBestVoice(voices) {
  const ruVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("ru"));
  if (!ruVoices.length) return null;
  const priority = ["google", "natural", "neural", "online", "milena", "yuri", "irina", "pavel", "elena", "microsoft"];
  for (const term of priority) {
    const match = ruVoices.find((v) => v.name.toLowerCase().includes(term));
    if (match) return match;
  }
  return ruVoices[0];
}

function getRuVoices() {
  if (!TTS_SUPPORTED) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("ru"));
}

function getVoicesAsync() {
  return new Promise((resolve) => {
    if (!TTS_SUPPORTED) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    // su molti browser (soprattutto al primissimo utilizzo) le voci si caricano in modo asincrono:
    // senza aspettare "voiceschanged" la prima riproduzione audio può restare silenziosa.
    let resolved = false;
    const handler = () => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    }, 350);
  });
}

async function speak(text, opts = {}) {
  if (!TTS_SUPPORTED) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "ru-RU";
  utter.rate = opts.rate || 0.92;
  utter.pitch = 1;
  const voices = await getVoicesAsync();
  let voice = null;
  if (opts.voiceURI) voice = voices.find((v) => v.voiceURI === opts.voiceURI);
  if (!voice) voice = pickBestVoice(voices);
  if (voice) utter.voice = voice;
  // senza aspettare "onend", la funzione tornava non appena l'audio veniva accodato (non quando finiva
  // di essere pronunciato): questo causava frasi tagliate o sovrapposte durante l'ascolto sequenziale.
  await new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    utter.onend = finish;
    utter.onerror = finish;
    // rete di sicurezza: alcuni browser talvolta non emettono "onend" per frasi molto brevi o silenziose.
    // la stima deve tenere conto della velocità di lettura (rate): con rate più basso (voce più lenta)
    // la pronuncia dura proporzionalmente di più, altrimenti la rete di sicurezza scatta troppo presto
    // e taglia la frase prima che finisca davvero.
    const estimatedMs = Math.max(1500, (text.length * 110) / utter.rate) + 600;
    setTimeout(finish, estimatedMs);
    window.speechSynthesis.speak(utter);
  });
}

// ---------- Abbonamento (paywall) ----------
// Segue esattamente la mappa già decisa in docs/mappa-freemium.md: A1 e A2
// sono gratuiti, B1-C2 richiedono l'abbonamento attivo. Un'unica fonte di
// verità (FREE_LEVELS) usata ovunque nell'app invece di sparpagliare il
// controllo livello per livello in ogni componente.
const FREE_LEVELS = ["A1", "A2"];
function isLevelFree(levelId) {
  return FREE_LEVELS.includes(levelId);
}
// Tetto di elementi contemporanei in coda per "Le mie difficoltà" quando
// l'abbonamento non è attivo — oltre questo numero, resta comunque possibile
// continuare a usare l'app, semplicemente non si accumulano altre voci finché
// non se ne risolvono alcune o si sblocca l'abbonamento.
const FREE_DIFFICOLTA_CAP = 20;

// Identificativo dell'"entitlement" configurato lato RevenueCat — da sostituire
// con quello reale creato nel dashboard RevenueCat prima della pubblicazione.
const REVENUECAT_ENTITLEMENT_ID = "premium";
// Chiavi pubbliche RevenueCat (non segrete, ma specifiche per piattaforma) —
// segnaposto da sostituire con quelle reali del tuo progetto RevenueCat.
const REVENUECAT_API_KEY_IOS = "REPLACE_WITH_REVENUECAT_IOS_PUBLIC_KEY";
const REVENUECAT_API_KEY_ANDROID = "REPLACE_WITH_REVENUECAT_ANDROID_PUBLIC_KEY";
// Identificativi dei pacchetti/prodotti come configurati in RevenueCat (che a
// loro volta puntano ai prodotti reali creati in App Store Connect / Play Console).
const REVENUECAT_PACKAGE_ANNUAL = "$rc_annual";
const REVENUECAT_PACKAGE_LIFETIME = "$rc_lifetime";
// URL pubblici stabili di Termini di Servizio (EULA) e Privacy Policy — Apple
// richiede ESPLICITAMENTE (Guideline 3.1.2) che entrambi i link siano visibili
// nella stessa schermata dei pulsanti d'acquisto, non solo raggiungibili da
// altrove nell'app. Segnaposto da sostituire con gli URL reali una volta
// pubblicata la Privacy Policy (vedi docs/privacy-policy.md) e scelti i Termini
// (Apple mette a disposizione un EULA standard riusabile, vedi la sezione
// "Termini di Servizio" in docs/note-revisore-e-permessi.md).
const TERMS_OF_SERVICE_URL = "REPLACE_WITH_TERMS_URL";
const PRIVACY_POLICY_URL = "REPLACE_WITH_PRIVACY_POLICY_URL";

// Codice di sblocco personale: attivandolo, tutto il contenuto risulta sbloccato
// esattamente come con un abbonamento attivo, senza passare da RevenueCat/store —
// pensato per il tuo uso personale e per i test, non per gli utenti normali.
// Un PIN numerico che scegli tu — cambialo con qualsiasi sequenza di cifre preferisci.
// NOTA ONESTA: essendo confrontato lato client (dentro il bundle JS dell'app),
// chiunque analizzi a fondo il codice compilato potrebbe risalire a questo PIN —
// non è una vera protezione DRM, ma è più che sufficiente per il suo scopo
// (sblocco personale, non un meccanismo anti-pirateria).
// ---------- Dimensioni del testo, centralizzate ----------
// Prima ogni fontSize era un numero scritto singolarmente in ~868 punti sparsi
// nel file — per cambiare una dimensione bisognava trovare e modificare ogni
// occorrenza una per una. Ora ogni valore ha un nome (basato sul ruolo che
// svolge nell'interfaccia, non sul px esatto) e si usa TEXT_SIZES.nome ovunque:
// cambiare un solo numero qui sotto aggiorna tutti i punti che lo usano insieme.
// I valori numerici sono rimasti IDENTICI a prima — nessun cambiamento visivo
// introdotto da questa modifica, solo la possibilità di modificarli più avanti.
const TEXT_SIZES = {
  micro: 13,          // etichette minuscole, badge, hint discreti — portato a livello "piccolo" (13px)
  tiny: 12,            // testo molto piccolo (didascalie compatte)
  small: 13,           // testo secondario, note
  body: 14,            // corpo del testo — la dimensione più usata nell'app
  bodyLarge: 15,        // corpo del testo, variante leggermente più grande
  emphasis: 16,         // etichette in grassetto, enfasi leggera
  emphasisLarge: 17,     // enfasi, pulsanti secondari
  subtitle: 18,          // sottotitoli di sezione
  subtitleLarge: 19,      // sottotitoli, variante più grande
  cardTitle: 20,          // titoli di singole schede/esercizi
  cardTitleMedium: 21,     // titolo di scheda, variante intermedia (usata nella formula dimensione matrioske)
  cardTitleLarge: 22,      // titoli di scheda, variante più grande
  sectionTitle: 24,        // intestazioni di una vista intera
  sectionTitleLarge: 26,    // intestazioni, variante più grande
  sectionTitleXL: 28,        // intestazioni, variante ancora più grande
  hero: 32,                  // testo grande (schermate speciali)
  heroLarge: 34,               // testo grande, variante più grande
  heroXL: 36,                    // testo grande, variante ancora più grande
  hero2XL: 40,                     // testo molto grande
  heroMax: 48,                       // il testo più grande in assoluto nell'app
};

const DEV_UNLOCK_CODE = "813381";

let _revenueCatConfigured = false;
async function ensureRevenueCatConfigured() {
  if (_revenueCatConfigured) return true;
  try {
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const { Capacitor } = await import("@capacitor/core");
    const platform = Capacitor.getPlatform();
    const apiKey = platform === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    if (!apiKey || apiKey.startsWith("REPLACE_WITH_")) return false; // non configurato: niente crash, solo "non disponibile"
    await Purchases.configure({ apiKey });
    _revenueCatConfigured = true;
    return true;
  } catch {
    // pacchetto non disponibile (browser, anteprima artifact) o piattaforma non supportata: silenzioso.
    return false;
  }
}

// Legge lo stato di abbonamento attuale da RevenueCat. Non blocca mai l'avvio
// dell'app: qualunque errore (rete assente, RevenueCat non configurato, non su
// piattaforma nativa) ricade su "non attivo" invece di far fallire il caricamento.
async function checkSubscriptionStatus() {
  try {
    const ok = await ensureRevenueCatConfigured();
    if (!ok) return { active: false, expiresAt: null };
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const { customerInfo } = await Purchases.getCustomerInfo();
    const entitlement = customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    if (entitlement) {
      return { active: true, expiresAt: entitlement.expirationDate || null };
    }
    return { active: false, expiresAt: null };
  } catch {
    return { active: false, expiresAt: null };
  }
}

// Avvia l'acquisto del pacchetto indicato (annuale o vita intera). Restituisce
// { success, active } — non lancia mai eccezioni verso il chiamante, per non
// dover ripetere try/catch identici in ogni punto dell'interfaccia che vende.
async function purchaseSubscriptionPackage(packageId) {
  try {
    const ok = await ensureRevenueCatConfigured();
    if (!ok) return { success: false, active: false, error: "Acquisti non disponibili in questo ambiente." };
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const offerings = await Purchases.getOfferings();
    const pkg = offerings?.current?.availablePackages?.find((p) => p.identifier === packageId);
    if (!pkg) return { success: false, active: false, error: "Pacchetto non trovato." };
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
    const entitlement = customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    return { success: true, active: !!entitlement };
  } catch (e) {
    // l'utente che annulla l'acquisto genera un errore "normale": non è un vero fallimento tecnico.
    const cancelled = e && (e.userCancelled || e.code === "PURCHASE_CANCELLED_ERROR");
    return { success: false, active: false, error: cancelled ? null : (e.message || "Acquisto non riuscito.") };
  }
}

async function restorePurchases() {
  try {
    const ok = await ensureRevenueCatConfigured();
    if (!ok) return { success: false, active: false, error: "Ripristino non disponibile in questo ambiente." };
    const { Purchases } = await import("@revenuecat/purchases-capacitor");
    const { customerInfo } = await Purchases.restorePurchases();
    const entitlement = customerInfo?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    return { success: true, active: !!entitlement };
  } catch (e) {
    return { success: false, active: false, error: e.message || "Ripristino non riuscito." };
  }
}

const ELEVENLABS_DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // "Rachel", multilingual, supports Russian

async function speakPremium(text, apiKey, voiceId) {
  // ElevenLabs non permette chiamate dirette dal browser: verificato con la console
  // sviluppatore che restituisce "blocked by CORS policy — no
  // 'Access-Control-Allow-Origin' header", indipendentemente da chiave o voce usate.
  // Prima questa funzione chiamava api.elevenlabs.io direttamente e falliva sempre
  // con "Failed to fetch" — passa quindi dal backend (chiamata server-a-server, dove
  // CORS non si applica). La chiave transita per il server ma non viene mai salvata
  // né loggata lì, solo inoltrata a ElevenLabs.
  let res;
  try {
    res = await fetch(`${API_BASE}/api/tts/premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, apiKey, voiceId }),
    });
  } catch {
    // fetch stessa può fallire (rete assente, backend irraggiungibile) PRIMA di
    // arrivare a "res.ok" — in quel caso lancerebbe un errore tecnico del browser
    // (es. "Failed to fetch", in inglese) invece del messaggio chiaro gestito sotto.
    throw new Error("Audio non disponibile. Verifica la connessione.");
  }
  if (!res.ok) {
    let msg = `Errore audio (${res.status}).`;
    try {
      const body = await res.json();
      if (body?.error?.message) msg = body.error.message;
    } catch {}
    throw new Error(msg);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  // "audio.play()" si risolve non appena la riproduzione INIZIA, non quando finisce:
  // bisogna aspettare esplicitamente l'evento "ended" per sapere quando l'audio è davvero terminato.
  await new Promise((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(() => {
      // errore del browser stesso (es. autoplay bloccato) — messaggio tecnico e in
      // inglese, mai da mostrare direttamente all'utente.
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      reject(new Error("Non sono riuscita a riprodurre l'audio. Riprova."));
    });
  });
}

// Voce madrelingua inclusa nell'abbonamento (maschile o femminile): a differenza di
// speakPremium (che usa una chiave ElevenLabs fornita dall'utente), questa passa dal
// server dell'app, che tiene la propria chiave — l'utente non deve procurarsene una.
// Riusa lo stesso meccanismo di riproduzione di speakPremium.
async function speakNativeVoice(text, gender) {
  let res;
  try {
    res = await fetch(`${API_BASE}/api/tts/native`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, gender: gender === "male" ? "male" : "female" }),
    });
  } catch {
    throw new Error("Audio non disponibile. Verifica la connessione.");
  }
  if (!res.ok) {
    throw new Error(`Voce madrelingua non disponibile (${res.status}).`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await new Promise((resolve, reject) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(() => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      reject(new Error("Non sono riuscita a riprodurre l'audio. Riprova."));
    });
  });
}

// Riproduce un breve suono di feedback (accordo ascendente per corretto, discendente per errato),
// sintetizzato via Web Audio API senza bisogno di file audio esterni.
let _feedbackAudioCtx = null;
// Handle dell'intervallo del sottofondo ambientale (idea #4): null quando spento.
// Nota d'onestà: non sono campioni audio reali di balalaika/fisarmonica (non ne ho
// a disposizione in questo ambiente) — è un arpeggio delicato sintetizzato via Web
// Audio, in stile "pizzicato", pensato per restare un tocco d'atmosfera discreto
// senza pretendere di essere una vera registrazione strumentale.
let _ambientInterval = null;
let _lastScheduledReminderCount = null;

let _ambientCurrentGain = null;
function startAmbientSound() {
  if (_ambientInterval) return; // già in esecuzione, non sovrapporre un secondo loop
  try {
    if (!_feedbackAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      _feedbackAudioCtx = new Ctx();
    }
    const ctx = _feedbackAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    // sequenza breve in stile modale russo (La minore naturale), pizzicata e MOLTO
    // sommessa — pensata per stare sotto la voce/i suoni degli esercizi, mai sopra.
    const notes = [220.0, 261.63, 293.66, 329.63, 261.63, 246.94];
    let i = 0;
    function pluck() {
      if (!_ambientInterval) return; // spento nel frattempo, non pianificare altro
      const freq = notes[i % notes.length];
      i++;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.35);
      // tiene traccia della nota attualmente in corso, così stopAmbientSound può
      // zittirla subito invece di lasciarla esaurire naturalmente (fino a 1.35s) —
      // senza questo, disattivare il sottofondo e cliccare subito altrove faceva
      // ancora sentire la nota residua, dando l'impressione che l'audio non si
      // fosse davvero disattivato.
      _ambientCurrentGain = gain;
      osc.onended = () => {
        if (_ambientCurrentGain === gain) _ambientCurrentGain = null;
      };
    }
    // L'ordine qui è importante: _ambientInterval deve essere assegnato PRIMA della
    // prima chiamata a pluck(), perché pluck() stesso controlla "if (!_ambientInterval)
    // return" all'inizio — se pluck() venisse chiamato prima dell'assegnazione, quel
    // controllo bloccherebbe silenziosamente proprio la primissima nota, facendo
    // sembrare che il sottofondo non parta subito quando lo si attiva.
    _ambientInterval = setInterval(pluck, 1450);
    pluck();
  } catch (e) {
    // silenzioso: il sottofondo è sempre facoltativo
  }
}

function stopAmbientSound() {
  if (_ambientInterval) {
    clearInterval(_ambientInterval);
    _ambientInterval = null;
  }
  if (_ambientCurrentGain && _feedbackAudioCtx) {
    // silenzia SUBITO la nota in corso invece di lasciarla esaurire naturalmente —
    // una rampa breve (30ms) evita un "click" udibile da un taglio istantaneo.
    try {
      const now = _feedbackAudioCtx.currentTime;
      _ambientCurrentGain.gain.cancelScheduledValues(now);
      _ambientCurrentGain.gain.setValueAtTime(_ambientCurrentGain.gain.value, now);
      _ambientCurrentGain.gain.linearRampToValueAtTime(0, now + 0.03);
    } catch (e) {
      // silenzioso: se il nodo è già stato disconnesso non c'è nulla da fare
    }
    _ambientCurrentGain = null;
  }
}

// Programma (o aggiorna) un promemoria locale giornaliero alle 18:00 con il numero di parole
// da ripassare — un solo id fisso (1), così ogni chiamata SOSTITUISCE il promemoria precedente
// invece di accumularne uno nuovo ogni volta. Su un dispositivo reale (incapsulato con Capacitor)
// diventa una vera notifica push locale; nel browser normale il plugin non ha effetto (nessun
// errore). Se non ci sono parole da ripassare, cancella il promemoria invece di mostrarne uno vuoto.
async function scheduleReviewReminder(count) {
  if (count === _lastScheduledReminderCount) return; // evita richieste ripetute inutili
  _lastScheduledReminderCount = count;
  try {
    // import dinamico: nell'app incapsulata con Capacitor questo pacchetto esiste davvero;
    // nell'anteprima artifact di Claude.ai (che supporta solo un elenco fisso di librerie)
    // e in un browser normale l'import fallisce silenziosamente e usciamo senza errori.
    const { LocalNotifications } = await import("@capacitor/local-notifications");
    if (count <= 0) {
      await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
      return;
    }
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== "granted") {
      const req = await LocalNotifications.requestPermissions();
      if (req.display !== "granted") return;
    }
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Матрёшка Мариса",
          body: `Hai ${count} parol${count === 1 ? "a" : "e"} da ripassare oggi 📌`,
          schedule: { on: { hour: 18, minute: 0 }, allowWhileIdle: true },
        },
      ],
    });
  } catch (e) {
    // silenzioso: nel browser normale o nell'anteprima artifact questo plugin non esiste
  }
}

function playFeedbackSound(correct) {
  try {
    // Evento personalizzato: la mascotte nell'header (nel componente App, ben
    // separato da questa funzione standalone) si registra ad esso per reagire
    // brevemente — senza dover far passare una callback attraverso ogni singola
    // vista-esercizio che chiama playFeedbackSound.
    window.dispatchEvent(new CustomEvent("matryoshka-feedback", { detail: { correct } }));
  } catch (e) {
    // silenzioso: la reazione della mascotte è un extra
  }
  try {
    // feedback aptico: su un dispositivo reale (incapsulato con Capacitor) dà una vibrazione
    // distinta per risposta giusta/sbagliata; import dinamico per non rompere l'anteprima
    // artifact o un browser normale dove il pacchetto non è disponibile.
    import("@capacitor/haptics")
      .then(({ Haptics, NotificationType }) =>
        Haptics.notification({ type: correct ? NotificationType.Success : NotificationType.Error })
      )
      .catch(() => {});
  } catch (e) {
    // silenzioso: l'aptica è un extra
  }
  try {
    if (!_feedbackAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      _feedbackAudioCtx = new Ctx();
    }
    const ctx = _feedbackAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const notes = correct ? [523.25, 659.25, 784.0] : [392.0, 329.63];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = correct ? "sine" : "triangle";
      osc.frequency.value = freq;
      const start = now + i * (correct ? 0.09 : 0.11);
      const dur = correct ? 0.16 : 0.22;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    });
  } catch (e) {
    // silenzioso: il feedback sonoro è un extra, non deve mai bloccare l'esercizio
  }
}

// Piccolo arpeggio "a scatti" che richiama il suono legnoso di una matrioska che si
// apre — usato quando l'ULTIMA lezione di un livello viene completata (non ad ogni
// lezione singola, solo al vero traguardo). Volutamente più ricco e festoso del tock
// di navigazione: qui si festeggia un livello intero, non un semplice tocco.
function playLevelCompleteSound() {
  try {
    if (!_feedbackAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      _feedbackAudioCtx = new Ctx();
    }
    const ctx = _feedbackAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    // quattro "clic" legnosi brevi (bambole che si aprono in sequenza) seguiti da
    // un accordo finale caldo che chiude il traguardo.
    const clicks = [1200, 1400, 1250, 1500];
    clicks.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const start = now + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.05, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.05);
    });
    const chordStart = now + 0.4;
    [523.25, 659.25, 784.0, 1046.5].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, chordStart);
      gain.gain.linearRampToValueAtTime(0.14, chordStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(chordStart);
      osc.stop(chordStart + 0.95);
    });
  } catch (e) {
    // silenzioso: il feedback sonoro è sempre un extra
  }
  try {
    // il momento più significativo dell'app (un intero livello completato) era
    // l'unico dei tre grandi feedback (risposta giusta/sbagliata, streak, livello)
    // senza aptica — corretto usando lo stile più marcato, coerente con la sua
    // importanza rispetto agli altri due.
    import("@capacitor/haptics")
      .then(({ Haptics, ImpactStyle }) => Haptics.impact({ style: ImpactStyle.Heavy }))
      .catch(() => {});
  } catch (e) {
    // silenzioso: l'aptica è un extra
  }
}

// Piccolo tintinnio di campanella (spesso presente sulle vere matrioske decorate)
// per quando la serie di giorni consecutivi si allunga — un rinforzo positivo breve
// e distinto, diverso dal tock di navigazione e dall'apertura-livello.
function playStreakBellSound() {
  try {
    if (!_feedbackAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      _feedbackAudioCtx = new Ctx();
    }
    const ctx = _feedbackAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1760; // A6, un tintinnio acuto e breve
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.52);
    // seconda armonica leggermente sfasata, per dare corpo di "campanella" invece
    // di un tono puro
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 2637; // E7
    gain2.gain.setValueAtTime(0, now + 0.02);
    gain2.gain.linearRampToValueAtTime(0.05, now + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.42);
  } catch (e) {
    // silenzioso: il feedback sonoro è sempre un extra
  }
  try {
    import("@capacitor/haptics")
      .then(({ Haptics, ImpactStyle }) => Haptics.impact({ style: ImpactStyle.Light }))
      .catch(() => {});
  } catch (e) {
    // silenzioso: l'aptica è un extra
  }
}

// Suonino breve e amichevole per la navigazione (tap su una macrosezione della Home —
// Impara/Pratica/Programma/Lezioni — o su una sottosezione al loro interno). Volutamente
// diverso e più discreto del feedback giusto/sbagliato del quiz sopra: qui non si sta
// valutando nulla, è solo un "tock" leggero di conferma del tocco. Riusa lo stesso
// AudioContext condiviso per non aprirne uno nuovo ad ogni tap.
// Genera un'immagine (formato storia social, 1080×1920) coi progressi reali
// dell'utente e la condivide — pensata per essere il momento "condivisibile"
// dell'app, che altrimenti non ne avrebbe nessuno: un buon motore didattico da
// solo non genera passaparola, serve qualcosa che l'utente voglia mostrare.
async function generateAndShareProgressCard({ streak, lessonsCompleted, wordsLearned, level }) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1400;
  const ctx = canvas.getContext("2d");

  // Sfondo con lo stesso gradiente navy già usato in "Il tuo percorso"
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#0A1F4D");
  grad.addColorStop(1, "#061530");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pattern decorativo già esistente nell'app, ripetuto a bassa opacità — stesso
  // trucco visivo già usato in "Il tuo percorso", non un elemento nuovo da mantenere.
  try {
    const patternImg = new Image();
    await new Promise((resolve, reject) => {
      patternImg.onload = resolve;
      patternImg.onerror = reject;
      patternImg.src = MATRYOSHKA_PATTERN_URI;
    });
    ctx.globalAlpha = 0.13;
    const tileW = 260, tileH = 340;
    for (let y = -tileH; y < canvas.height + tileH; y += tileH) {
      for (let x = -tileW; x < canvas.width + tileW; x += tileW) {
        ctx.drawImage(patternImg, x, y, tileW, tileH);
      }
    }
    ctx.globalAlpha = 1;
  } catch (e) {
    // silenzioso: il pattern è decorativo, la card resta leggibile senza
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#F0EAD8";
  ctx.font = "700 64px serif";
  ctx.fillText("Матрёшка Мариса", canvas.width / 2, 150);
  ctx.font = "400 34px sans-serif";
  ctx.fillStyle = "rgba(240,234,216,0.7)";
  ctx.fillText("Il mio percorso nel russo", canvas.width / 2, 210);

  const stats = [
    { icon: "🔥", value: String(streak), label: streak === 1 ? "giorno di serie" : "giorni di serie", color: "#D9A441" },
    { icon: "📖", value: String(lessonsCompleted), label: "lezioni completate", color: "#5B84B1" },
    { icon: "🗂️", value: String(wordsLearned), label: "parole imparate", color: "#7C8C6B" },
  ];
  // Ogni statistica occupa uno spazio fisso e prevedibile subito dopo l'altra —
  // niente calcolo di centratura complesso: la riga finale segue direttamente
  // l'ultimo elemento disegnato, così non lascia mai un vuoto sproporzionato.
  let y = 380;
  for (const s of stats) {
    ctx.font = "700 120px sans-serif";
    ctx.fillStyle = s.color;
    ctx.fillText(s.value, canvas.width / 2, y);
    ctx.font = "400 40px sans-serif";
    ctx.fillStyle = "#F0EAD8";
    ctx.fillText(`${s.icon} ${s.label}`, canvas.width / 2, y + 65);
    y += 260;
  }

  if (level) {
    ctx.font = "700 44px sans-serif";
    ctx.fillStyle = "#D9A441";
    ctx.fillText(`Livello ${level}`, canvas.width / 2, y + 20);
    y += 90;
  }

  ctx.font = "400 30px sans-serif";
  ctx.fillStyle = "rgba(240,234,216,0.5)";
  ctx.fillText("italiano → russo, un livello alla volta", canvas.width / 2, y + 60);

  const dataUrl = canvas.toDataURL("image/png");

  // Su dispositivo nativo, il plugin Share NON accetta un data URL direttamente
  // (confermato dalla documentazione ufficiale Capacitor) — va prima salvato su
  // file e condiviso tramite il suo percorso reale.
  const nativePlatform = typeof window !== "undefined" && window.Capacitor?.getPlatform?.();
  if (IS_ARTIFACT_ENV || !nativePlatform || nativePlatform === "web") {
    // Anteprima/web: prova prima la vera condivisione, se il browser la supporta.
    // Il download automatico (link.click()) NON è affidabile qui: in un iframe
    // sandboxato senza il permesso "allow-downloads" (come l'anteprima artifact),
    // viene bloccato silenziosamente senza lanciare alcun errore — l'utente
    // clicca e non succede visibilmente nulla. Restituiamo sempre anche il
    // dataUrl: se non possiamo confermare che la condivisione sia riuscita,
    // il chiamante mostra l'immagine a schermo (funziona sempre, senza bisogno
    // di alcun permesso) invece di sperare in silenzio che il download sia partito.
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "matryoshka-progresso.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Матрёшка Мариса" });
        return { ok: true, dataUrl: null };
      }
    } catch (e) {
      // silenzioso: l'utente potrebbe aver semplicemente annullato la finestra di
      // condivisione — si passa comunque al fallback dell'immagine mostrata a schermo
    }
    return { ok: true, dataUrl };
  }

  try {
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    const base64Data = dataUrl.split(",")[1];
    const fileName = `matryoshka-progresso-${Date.now()}.png`;
    const written = await Filesystem.writeFile({ path: fileName, data: base64Data, directory: Directory.Cache });
    await Share.share({ files: [written.uri], title: "Матрёшка Мариса — il mio percorso nel russo" });
    return { ok: true, dataUrl: null };
  } catch (e) {
    return { ok: false, dataUrl: null };
  }
}

function playNavigationSound() {
  try {
    if (!_feedbackAudioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      _feedbackAudioCtx = new Ctx();
    }
    const ctx = _feedbackAudioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } catch (e) {
    // silenzioso: è solo un tocco di rifinitura, non deve mai bloccare la navigazione
  }
}

// Componente riutilizzabile: mostra una frase russa con un pulsante di modifica manuale.
// La correzione dell'utente viene salvata in modo permanente (per "storageKey") e mostrata
// al posto del testo originale ad ogni successiva visita, finché non viene modificata di nuovo.
function EditableSentence({ storageKey, text, itText, fontSize = 15, style = {}, onSaved }) {
  const [savedText, setSavedText] = useState(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = await loadJSON(`frase-modificata-${storageKey}`, null);
      if (!cancelled) setSavedText(stored);
    })();
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const displayedText = savedText != null ? savedText : text;

  function startEditing() {
    setValue(displayedText);
    setEditing(true);
  }

  async function save() {
    const trimmed = value.trim();
    if (!trimmed) {
      setEditing(false);
      return;
    }
    await saveJSON(`frase-modificata-${storageKey}`, trimmed);
    setSavedText(trimmed);
    setEditing(false);
    if (onSaved) onSaved(trimmed);
  }

  if (editing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          autoFocus
          style={{
            width: "100%",
            background: "#232E3D",
            border: "1px solid #D9A441",
            borderRadius: 8,
            padding: "8px 10px",
            color: "#F0EAD8",
            fontSize,
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={save}
            style={{ background: "#D9A441", border: "none", borderRadius: 6, padding: "5px 12px", color: "#1B2430", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
          >
            Salva
          </button>
          <button
            onClick={() => setEditing(false)}
            style={{ background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 6, padding: "5px 12px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
          >
            Annulla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, ...style }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div style={{ fontSize, flex: 1 }}>{displayedText}</div>
          <PhraseCaseTag ru={displayedText} />
        </div>
        <PronunciationHint text={displayedText} />
        {itText && <div style={{ fontSize: Math.max(TEXT_SIZES.small, fontSize - 1), opacity: 0.6, fontStyle: "italic" }}>{itText}</div>}
        {savedText != null && <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.5, marginTop: 2 }}>✏️ modificata da te</div>}
      </div>
      <button
        onClick={startEditing}
        title="Modifica questa frase"
        style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
      >
        ✏️
      </button>
    </div>
  );
}

async function playAudio(text, { ttsSettings, premium }, onError) {
  // priorità 1: voce madrelingua inclusa nell'abbonamento. "premium.useNative" qui è già
  // stato calcolato a monte (vedi effectivePremium in App()) incrociando la preferenza
  // dell'utente con lo stato reale dell'abbonamento — quindi qui basta controllare questo
  // solo campo, senza dover passare anche "subscription" a ogni singola chiamata sparsa
  // nel codice.
  if (premium && premium.useNative) {
    try {
      await speakNativeVoice(text, premium.voiceGender);
    } catch (e) {
      onError && onError(e.message);
    }
    // NOTA: qui prima si ricadeva sulla voce gratuita del dispositivo in caso di errore.
    // Rimosso: se l'audio a pagamento aveva già iniziato a riprodursi e falliva SOLO a metà
    // (es. un errore di rete intermittente durante lo streaming), la voce gratuita partiva
    // SOPRA quella ancora in corso, facendo sentire la stessa frase due volte sovrapposte.
    // Ora un errore mostra semplicemente il messaggio, senza tentare un'altra voce sopra.
    return;
  }
  // priorità 2: chiave ElevenLabs propria dell'utente (funzione già esistente).
  if (premium && premium.enabled && premium.apiKey) {
    try {
      await speakPremium(text, premium.apiKey, premium.voiceId);
    } catch (e) {
      onError && onError(e.message);
    }
    // stesso motivo del blocco sopra: nessuna ricaduta automatica su un'altra voce.
    return;
  }
  await speak(text, ttsSettings);
}

const LEVEL_RATE = {
  A1: 0.72,
  A2: 0.78,
  B1: 0.9,
  B2: 0.96,
  C1: 1.0,
  C2: 1.0,
};

function levelFromId(id) {
  if (!id) return null;
  const m = /^([abc][12])/i.exec(id);
  return m ? m[1].toUpperCase() : null;
}

function rateForLevel(id, fallbackRate) {
  const lvl = levelFromId(id);
  return lvl && LEVEL_RATE[lvl] ? LEVEL_RATE[lvl] : fallbackRate;
}

function stripAccentMarks(s) {
  return typeof s === "string" ? s.replace(/\u0301/g, "") : s;
}

// Alcune voci di vocabolario hanno una nota tra parentesi (es. "дать (что-то)", "apre (si apre)")
// utile da leggere visivamente ma non da pronunciare — la sintesi vocale altrimenti la legge
// per intero, cosa che suona innaturale e non aiuta la pronuncia della parola vera.
function stripParentheticalForAudio(s) {
  return typeof s === "string" ? s.replace(/\s*\([^)]*\)/g, "").trim() : s;
}

// Trascrizione approssimativa lettera per lettera, pensata per un lettore italiano che
// non conosce il cirillico. A differenza di una semplice mappa 1-a-1, applica la regola
// di riduzione vocalica russa più importante per la pronuncia: la "о" non accentata si
// legge come una "a" (fenomeno detto "akanie"), mentre la "о" accentata resta "o" —
// una differenza che cambia completamente il suono della parola e che un principiante
// italiano non intuirebbe mai guardando solo le lettere cirilliche.
// Questo è possibile con certezza perché ogni parola polisillabica nei dati dell'app ha
// il segno di accento (U+0301) verificato esplicitamente; per le parole di una sola
// sillaba (senza segno, perché non serve: l'unica vocale è per forza quella accentata)
// la "о" resta "o" di default.
const CYRILLIC_TO_IT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "jo", ж: "j", з: "z", и: "i",
  й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "z", ч: "č", ш: "š", щ: "šč", ъ: "", ы: "i", ь: "",
  э: "e", ю: "ju", я: "ja",
};
const IT_ACUTE = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };

function transliterateForItalians(text) {
  if (typeof text !== "string") return "";
  // isola le "parole" (sequenze di lettere cirilliche + eventuale segno d'accento) per poter
  // decidere, PAROLA PER PAROLA, se contiene un accento esplicito (polisillabica marcata)
  // o no (monosillabica, la sua unica vocale è per forza quella accentata).
  const wordPattern = /[а-яёА-ЯЁ\u0301]+/g;
  let out = "";
  let lastIndex = 0;
  let m;
  while ((m = wordPattern.exec(text)) !== null) {
    out += text.slice(lastIndex, m.index); // spazi/punteggiatura tra una parola e l'altra, invariati
    const word = m[0];
    const chars = [...word];
    // "ё" è sempre accentata di sua natura — la sua sola presenza dimostra che la
    // parola è polisillabica con l'accento noto, esattamente come un segno \u0301
    // esplicito. Senza questo controllo, una parola come "тёплого" (tё-pla-va)
    // veniva trattata come "senza accento marcato" → le "о" finali restavano
    // erroneamente "o" invece di ridursi correttamente ad "a".
    const wordHasStressMark = chars.includes("\u0301") || chars.some((c) => c.toLowerCase() === "ё");
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === "\u0301") continue;
      const lower = ch.toLowerCase();
      const isUpper = ch !== lower;
      const nextIsStress = chars[i + 1] === "\u0301";
      let mapped = CYRILLIC_TO_IT[lower];
      if (mapped === undefined) {
        out += ch;
        continue;
      }
      // riduzione vocalica: "о" non accentata (in una parola che HA un accento marcato
      // altrove) si legge "a" — ma se la parola non ha alcun accento marcato, è
      // monosillabica e la sua "о" è per forza quella accentata, quindi resta "o".
      if (lower === "о" && wordHasStressMark && !nextIsStress) {
        mapped = "a";
      }
      if (nextIsStress && IT_ACUTE[mapped]) mapped = IT_ACUTE[mapped];
      out += isUpper ? mapped.charAt(0).toUpperCase() + mapped.slice(1) : mapped;
    }
    lastIndex = m.index + word.length;
  }
  out += text.slice(lastIndex);
  return out;
}

// Piccola riga di aiuto alla pronuncia per italiani, da mettere sotto un testo russo.
// "č"/"š"/"ž" seguono la convenzione internazionale per i suoni "c" dolce, "sc" e "sg"
// che l'italiano scrive diversamente a seconda della vocale seguente.
// Piccolo numero che "conta" fino al valore nuovo invece di scattare di colpo —
// usato per la serie di giorni in Home, dà un senso di progresso più vivo quando
// il numero cambia. Se il valore resta uguale, non fa nulla (nessuna animazione
// inutile al semplice re-render).
// Piccolo scoppio di coriandoli colorati, per un punteggio perfetto in un test —
// particelle generate ad ogni montaggio (varietà visiva ogni volta), con la stessa
// tavolozza di colori già usata per i livelli della matrioska. Puramente decorativo,
// non blocca mai il tocco (pointer-events: none).
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ["#D9A441", "#7C8C6B", "#C1543C", "#5B84B1", "#9A6B9E", "#E8D9B5"][i % 6],
        size: 6 + Math.random() * 6,
        duration: 1.4 + Math.random() * 1.2,
        delay: Math.random() * 0.5,
        rotate: Math.random() * 360,
      })),
    []
  );
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-5%",
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            borderRadius: 2,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// Tre puntini che si accendono in sequenza — un piccolo indicatore di attività per
// le generazioni IA (nuove lezioni, frasi, esempi), che prima mostravano solo testo
// statico ("Genero…") per diversi secondi senza alcun segnale visivo di movimento.
// Piccolo "termometro" A1→C2: una barra con un segmento colorato per livello (stessi
// colori già in LEVELS) e un indicatore che si sposta fluidamente su quello scelto —
// dà un senso immediato di "dove si è" nello spettro CEFR, oltre al semplice testo.
function CefrThermometer({ level }) {
  const idx = Math.max(0, LEVELS.findIndex((l) => l.id === level));
  const pct = LEVELS.length > 1 ? (idx / (LEVELS.length - 1)) * 100 : 0;
  return (
    <div
      role="img"
      aria-label={`Livello ${level || "A1"}, ${idx + 1} su ${LEVELS.length} (da ${LEVELS[0]?.id} a ${LEVELS[LEVELS.length - 1]?.id})`}
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}
    >
      <div style={{ flex: 1, position: "relative", height: 6, borderRadius: 3, overflow: "hidden", display: "flex" }}>
        {LEVELS.map((l) => (
          <div key={l.id} style={{ flex: 1, background: l.color, opacity: 0.35 }} />
        ))}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -3,
            left: `${pct}%`,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: LEVELS[idx]?.color || "#D9A441",
            border: "2px solid #F0EAD8",
            transform: "translateX(-50%)",
            transition: "left 0.3s cubic-bezier(0.34, 1.4, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, marginLeft: 6, verticalAlign: "middle" }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "currentColor",
            display: "inline-block",
            animation: `loadingDotPulse 1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  useEffect(() => {
    const from = fromRef.current;
    if (from === value) return;
    if (typeof requestAnimationFrame !== "function") {
      // fallback di sicurezza: ambienti senza requestAnimationFrame mostrano
      // direttamente il valore finale, senza animazione, invece di crashare
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const start = performance.now();
    const duration = 550;
    let raf;
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubico
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    }
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [value]);
  return display;
}

function PronunciationHint({ text, style }) {
  const translit = transliterateForItalians(text);
  if (!translit) return null;
  return (
    <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.5, fontStyle: "italic", marginTop: 2, ...style }}>
      {translit}
    </div>
  );
}

// Va a capo automaticamente un testo lungo dentro un canvas, centrato — usato per il
// biglietto generato in Corsivo, dove la frase russa può essere più larga della tela.
function wrapCanvasText(ctx, text, centerX, centerY, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((l, i) => ctx.fillText(l, centerX, startY + i * lineHeight));
}

function pickRandom(arr) {
  if (!arr || !arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleOnce(tokens) {
  if (!tokens) return [];
  const arr = tokens.map((t, i) => ({ t, i }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function phraseType(ru) {
  if (!ru) return "aff";
  if (ru.trim().endsWith("?")) return "int";
  if (/(^|[\s—])(не|нет)([\s,.!]|$)/i.test(ru) || /вряд ли|ни\s.*ни\s/i.test(ru)) return "neg";
  return "aff";
}

const PHRASE_TYPE_LABEL = {
  aff: { text: "Affermativa", color: "#7C8C6B" },
  neg: { text: "Negativa", color: "#C1543C" },
  int: { text: "Interrogativa", color: "#5B84B1" },
};

function normalizeText(s) {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"'«»—-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  // Confronta il testo trascritto dal riconoscimento vocale con il testo target.
  // Va normalizzato con normalizeForTyping (non il semplice normalizeText): una
  // trascrizione vocale non contiene mai l'accento tonico (U+0301) né distingue
  // ё da е, quindi confrontarli col testo originale (che li ha) falsava sistematicamente
  // ogni punteggio verso il basso, anche a pronuncia perfetta.
  const na = normalizeForTyping(a),
    nb = normalizeForTyping(b);
  const dist = levenshtein(na, nb);
  const len = Math.max(na.length, nb.length, 1);
  return Math.max(0, 1 - dist / len);
}

function startPronunciationCheck(target, onUpdate) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    onUpdate({ status: "unsupported" });
    return;
  }
  onUpdate({ status: "listening" });
  const rec = new SR();
  rec.lang = "ru-RU";
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const score = similarity(transcript, target);
    onUpdate({ status: "done", transcript, score });
    recordPronunciationAttempt(score);
  };
  rec.onerror = (e) => {
    onUpdate({ status: e.error === "not-allowed" ? "denied" : "error" });
  };
  try {
    rec.start();
  } catch {
    onUpdate({ status: "error" });
  }
}

// Traccia i tentativi di pronuncia (usati per l'asse "Pronuncia/Ascolto" nella mappa di padronanza).
async function recordPronunciationAttempt(score) {
  try {
    const stats = await loadJSON("pronunciation-stats", { attempts: 0, totalScore: 0 });
    const next = { attempts: stats.attempts + 1, totalScore: stats.totalScore + score };
    await saveJSON("pronunciation-stats", next);
  } catch {
    // il tracciamento non deve mai interrompere l'esercizio
  }
}

const LEVEL_DESCRIPTIONS = {
  A1: "principiante assoluto: presente indicativo, frasi brevi, lessico quotidiano di base",
  A2: "elementare: passato/futuro semplice, casi grammaticali di base, situazioni pratiche (negozi, viaggi, lavoro semplice)",
  B1: "intermedio: aspetto verbale, condizionale, frasi relative con который, argomenti di vita quotidiana e opinioni semplici",
  B2: "intermedio alto: discorso indiretto, sfumature di aspetto, frasi relative complesse, argomenti astratti e professionali",
  C1: "avanzato: participi e gerundi, concessive, connettori di discorso, registro formale/informale",
  C2: "madrelingua: particelle pragmatiche (же, -то, ведь), idiomi, proverbi, ironia, registro letterario",
};

const CASE_INFO = {
  Именительный: { name_it: "Nominativo", it: "chi? cosa? (soggetto)", ru: "Кто? Что?" },
  Родительный: { name_it: "Genitivo", it: "di chi? di cosa? (anche dopo 'нет')", ru: "Кого? Чего?" },
  Дательный: { name_it: "Dativo", it: "a chi? a cosa?", ru: "Кому? Чему?" },
  Винительный: { name_it: "Accusativo", it: "chi? cosa? (oggetto diretto)", ru: "Кого? Что?" },
  Творительный: { name_it: "Strumentale", it: "con chi? con cosa?", ru: "Кем? Чем?" },
  Предложный: { name_it: "Prepositivo", it: "di chi/cosa (con о/в/на)", ru: "О ком? О чём?" },
};

// ---------- Dialoghi e conversazioni ----------

// ---------- Preposizioni ----------

function vb(word, meaning_it, aspect, note_it, forms) {
  return { word, meaning_it, aspect, note_it, forms: forms.map((f) => vf(...f)) };
}

// Coppia aspettuale: un verbo imperfettivo e il suo corrispondente perfettivo,
// ciascuno con le proprie forme coniugate, più un mini-esercizio situazionale
// che allena a riconoscere quale aspetto usare in un contesto reale.

// ---------- Aggettivi: concordanza totale (genere, numero, caso) ----------

async function callClaudeJSONOnce(prompt, maxTokens = 3000) {
  let res, data;
  if (IS_ARTIFACT_ENV) {
    // Dentro un artifact Claude.ai: meccanismo speciale, niente chiave API,
    // max_tokens fisso a 1000 (requisito dell'ambiente).
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    data = await res.json();
  } else {
    // App standalone: passa dal nostro backend, con la tua chiave API reale.
    res = await fetch(`${API_BASE}/api/claude`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, max_tokens: maxTokens }),
    });
    data = await res.json();
  }
  if (!res.ok) {
    const apiMsg = data?.error?.message || `Errore HTTP ${res.status}`;
    throw new Error(apiMsg);
  }
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
  if (!text.trim()) {
    throw new Error("Risposta vuota dall'IA.");
  }

  let jsonSlice;
  const markerStart = text.indexOf("===JSON===");
  const markerEnd = text.indexOf("===END===");
  if (markerStart !== -1 && markerEnd !== -1 && markerEnd > markerStart) {
    jsonSlice = text.slice(markerStart + "===JSON===".length, markerEnd);
  } else {
    jsonSlice = text.replace(/```json|```/g, "");
  }
  jsonSlice = jsonSlice.trim();
  const firstBrace = jsonSlice.indexOf("{");
  const lastBrace = jsonSlice.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Formato non riconosciuto — inizio risposta: " + text.slice(0, 150));
  }
  jsonSlice = jsonSlice.slice(firstBrace, lastBrace + 1);
  jsonSlice = jsonSlice.replace(/,(\s*[}\]])/g, "$1");

  try {
    return JSON.parse(jsonSlice);
  } catch (parseErr) {
    throw new Error("JSON non valido (" + parseErr.message + ") — inizio: " + jsonSlice.slice(0, 150));
  }
}

async function callClaudeJSON(prompt, maxTokens = 3000) {
  if (IS_ARTIFACT_ENV) {
    // Mitiga un bug documentato di Safari/iOS per cui le richieste fetch
    // avviate subito dopo un tocco/interazione falliscono più spesso.
    await new Promise((r) => setTimeout(r, 400));
  }
  const delays = IS_ARTIFACT_ENV ? [900, 1800, 3000] : [800, 1800];
  let lastErr;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      return await callClaudeJSONOnce(prompt, maxTokens);
    } catch (e) {
      lastErr = e;
      const transient = /failed to fetch|load failed|network|networkerror|pattern|internal server error|overloaded|too many requests|rate.?limit|50[0234]|bad gateway|gateway timeout|service unavailable/i.test(e.message || "");
      if (!transient || attempt === delays.length) throw e;
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastErr;
}

const CONTEXT_SUGGESTIONS = [
  "Al lavoro",
  "In viaggio",
  "A casa",
  "Al ristorante",
  "Con la famiglia",
  "Dal medico",
  "Al telefono",
  "Per strada",
];

const JSON_FORMAT_INSTRUCTIONS = `Rispondi usando ESATTAMENTE questo formato, senza nient'altro prima o dopo: apri con la riga ===JSON=== poi l'oggetto JSON valido, poi chiudi con la riga ===END===. Dentro ai valori di testo NON usare mai il carattere virgolette doppie (") per citare parole: usa virgolette semplici 'così' o «così». Non lasciare virgole finali prima di } o ]. Sii conciso: rispondi solo con i campi richiesti, senza aggiungere altro testo.`;

// ---------- Main component ----------

export default function App() {
  const [view, setView] = useState("home");
  const [testLevel, setTestLevel] = useState(null);
  const [openLevel, setOpenLevel] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showGloss, setShowGloss] = useState({});
  const [quizPicked, setQuizPicked] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [productionHint, setProductionHint] = useState(null);
  const [productionHintLoading, setProductionHintLoading] = useState(false);
  const [productionHintError, setProductionHintError] = useState(null);

  const [progress, setProgress] = useState({ completed: [], started: [], streak: 0, lastActive: null });
  const [showFreezeNotice, setShowFreezeNotice] = useState(false);
  const freezeNoticeShownRef = useRef(false);

  useEffect(() => {
    // avvisa l'utente quando un congelamento serie è stato usato: un meccanismo
    // motivazionale che agisce in silenzio non costruisce fiducia — l'utente deve
    // sapere che la sua costanza è stata salvata, non scoprirlo per caso.
    const t = todayStr();
    if (progress.lastFreezeUsed === t && !freezeNoticeShownRef.current) {
      freezeNoticeShownRef.current = true;
      setShowFreezeNotice(true);
      const timer = setTimeout(() => setShowFreezeNotice(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [progress.lastFreezeUsed]);

  const [vocabBox, setVocabBox] = useState({});
  const [easyHardCounts, setEasyHardCounts] = useState({ easy: 0, hard: 0 });
  const [ready, setReady] = useState(false);

  const [cardIndex, setCardIndex] = useState(0);
  const [cardFilter, setCardFilter] = useState("learning");
  const [verbPairIndex, setVerbPairIndex] = useState(0);
  useEffect(() => {
    setCardIndex(0);
  }, [cardFilter]);
  const [flipped, setFlipped] = useState(false);

  const [ttsSettings, setTtsSettings] = useState({ voiceURI: null, rate: 0.92 });
  const [voiceOptions, setVoiceOptions] = useState([]);
  // ---------- Scala del testo, regolabile dall'utente ----------
  // Un solo numero (textScale) applicato via CSS "zoom" sul contenitore radice
  // dell'app: scala in blocco TUTTO il testo (e lo spazio attorno) in ogni
  // sezione — esercizi, frasi, parole, schede — senza dover toccare le
  // centinaia di punti che già usano TEXT_SIZES.nome. Persistito come le
  // altre preferenze utente (stesso schema di ttsSettings).
  const [textScale, setTextScale] = useState(1);
  // Reazione breve della mascotte agli esercizi: si accende di un lieve alone verde
  // (risposta giusta) o rosso (sbagliata) per un istante, poi torna neutra. Ascolta
  // lo stesso evento "matryoshka-feedback" che playFeedbackSound emette da qualsiasi
  // vista-esercizio, senza dover collegare ogni singolo quiz individualmente.
  const [mascotGlow, setMascotGlow] = useState(null); // null | "correct" | "wrong"
  // Piccolo scintillio extra quando si accumulano 3 risposte corrette DI FILA (in
  // qualsiasi esercizio, senza distinzione) — un rinforzo per la costanza, non solo
  // per la singola risposta. Il conteggio si azzera alla prima risposta sbagliata.
  const [mascotStreakSparkle, setMascotStreakSparkle] = useState(false);
  const correctStreakRef = useRef(0);
  useEffect(() => {
    function onFeedback(e) {
      const correct = !!e.detail?.correct;
      setMascotGlow(correct ? "correct" : "wrong");
      setTimeout(() => setMascotGlow(null), 900);
      if (correct) {
        correctStreakRef.current += 1;
        if (correctStreakRef.current > 0 && correctStreakRef.current % 3 === 0) {
          setMascotStreakSparkle(true);
          setTimeout(() => setMascotStreakSparkle(false), 900);
        }
      } else {
        correctStreakRef.current = 0;
      }
    }
    window.addEventListener("matryoshka-feedback", onFeedback);
    return () => window.removeEventListener("matryoshka-feedback", onFeedback);
  }, []);
  // Mascotte che "respira" mentre l'IA sta scrivendo nella Conversazione — riceve
  // l'evento dispatchato da ConversationView (componente separato) tramite lo stesso
  // schema di comunicazione già usato per il feedback giusto/sbagliato.
  const [mascotThinking, setMascotThinking] = useState(false);
  useEffect(() => {
    function onThinking(e) {
      setMascotThinking(!!e.detail?.active);
    }
    window.addEventListener("matryoshka-thinking", onThinking);
    return () => window.removeEventListener("matryoshka-thinking", onThinking);
  }, []);
  // Celebrazione a schermo intero quando un intero livello viene completato (idea #5):
  // null quando non attiva, altrimenti l'id del livello appena finito (es. "A1").
  const [levelCompleteCelebration, setLevelCompleteCelebration] = useState(null);
  // "Il tuo percorso" — riepilogo con animazione a cascata delle statistiche reali
  // disponibili oggi. Chiamarlo "settimanale" sarebbe stato disonesto: l'app non
  // registra la data di completamento di ogni lezione (solo l'elenco degli id), quindi
  // non può sapere cosa è stato fatto "in questi ultimi 7 giorni" — aggiungere quel
  // tracciamento avrebbe richiesto una migrazione della struttura dati toccando ogni
  // punto dell'app che legge progress.completed, un rischio sproporzionato rispetto a
  // un riepilogo che comunque mostra con piacere i progressi totali reali.
  const [showJourneySummary, setShowJourneySummary] = useState(false);
  const [shareCardLoading, setShareCardLoading] = useState(false);
  const [shareCardError, setShareCardError] = useState(null);
  const [shareCardImageUrl, setShareCardImageUrl] = useState(null);
  // Parallasse leggero sul pattern di matrioske decorativo dentro "Il tuo percorso":
  // manipolazione diretta dello stile via ref, MAI passando da setState/re-render ad
  // ogni evento di scroll — throttled con requestAnimationFrame per sicurezza sulle
  // prestazioni. Effetto puramente decorativo, mai un requisito, e limitato a questo
  // singolo overlay (nessun listener globale su window che tocchi il resto dell'app).
  const journeyPatternRef = useRef(null);
  const journeyParallaxRaf = useRef(null);
  function handleJourneyScroll(e) {
    if (journeyParallaxRaf.current) return;
    const scrollTop = e.currentTarget.scrollTop;
    journeyParallaxRaf.current = requestAnimationFrame(() => {
      if (journeyPatternRef.current) {
        journeyPatternRef.current.style.transform = `translateY(${scrollTop * 0.35}px)`;
      }
      journeyParallaxRaf.current = null;
    });
  }
  // Breve pioggia di coriandoli (non bloccante, si dissolve da sola) per i traguardi
  // settimanali della serie — un rinforzo positivo più leggero della celebrazione a
  // schermo intero dei livelli, per un evento che ricorre più spesso.
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [freezeUsedFlash, setFreezeUsedFlash] = useState(false);
  const [showTextSizePanel, setShowTextSizePanel] = useState(false);
  const TEXT_SCALE_MIN = 0.85;
  const TEXT_SCALE_MAX = 1.3;
  const TEXT_SCALE_STEP = 0.05;
  function updateTextScale(next) {
    const clamped = Math.min(TEXT_SCALE_MAX, Math.max(TEXT_SCALE_MIN, next));
    const rounded = Math.round(clamped * 100) / 100;
    setTextScale(rounded);
    saveJSON("text-scale", rounded);
  }
  useEffect(() => {
    (async () => {
      const s = await loadJSON("text-scale", null);
      if (typeof s === "number" && s >= TEXT_SCALE_MIN && s <= TEXT_SCALE_MAX) setTextScale(s);
    })();
  }, []);
  // Sottofondo ambientale facoltativo (idea #4) — spento di default: un suono non
  // richiesto è invasivo, meglio farlo scoprire e attivare di proposito.
  const [ambientSoundOn, setAmbientSoundOn] = useState(false);
  useEffect(() => {
    (async () => {
      const s = await loadJSON("ambient-sound-on", false);
      if (s) setAmbientSoundOn(true);
    })();
  }, []);
  useEffect(() => {
    if (ambientSoundOn) startAmbientSound();
    else stopAmbientSound();
    return () => stopAmbientSound();
  }, [ambientSoundOn]);
  function toggleAmbientSound() {
    setAmbientSoundOn((prev) => {
      const next = !prev;
      saveJSON("ambient-sound-on", next);
      return next;
    });
  }
  // Neve ambientale (tema invernale russo) — non più un pulsante scelto dall'utente,
  // ma un piccolo tocco "vivo" che appare da solo dopo 5 minuti senza alcuna
  // interazione (come uno screensaver discreto), e sparisce non appena l'utente
  // tocca di nuovo qualcosa. Il timer si resetta ad ogni tocco/click/tasto/scroll.
  const [snowOn, setSnowOn] = useState(false);
  useEffect(() => {
    const IDLE_MS = 5 * 60 * 1000;
    let idleTimer = null;
    function startIdleTimer() {
      idleTimer = setTimeout(() => setSnowOn(true), IDLE_MS);
    }
    function onActivity() {
      setSnowOn(false);
      clearTimeout(idleTimer);
      startIdleTimer();
    }
    const events = ["click", "touchstart", "keydown", "mousemove", "scroll"];
    events.forEach((ev) => document.addEventListener(ev, onActivity, { passive: true }));
    startIdleTimer();
    return () => {
      clearTimeout(idleTimer);
      events.forEach((ev) => document.removeEventListener(ev, onActivity));
    };
  }, []);
  const [activeSector, setActiveSector] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dollWobble, setDollWobble] = useState(false);
  const [wobbleKey, setWobbleKey] = useState(0);

  useEffect(() => {
    // saluto e movimento della matriosca ad ogni apertura dell'app, non solo la prima volta
    setShowWelcome(true);
    setDollWobble(true);
    const t1 = setTimeout(() => setShowWelcome(false), 2600);
    const t2 = setTimeout(() => setDollWobble(false), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  const [isOffline, setIsOffline] = useState(typeof navigator !== "undefined" && !navigator.onLine);

  useEffect(() => {
    // rilevamento connessione: su iOS incapsulato con Capacitor, così come nel browser,
    // vogliamo mostrare un avviso chiaro invece di lasciare che l'app si blocchi in silenzio
    // (i progressi restano comunque salvati localmente, quindi non si perde nulla).
    // Preferisce il plugin nativo @capacitor/network (già installato) quando disponibile:
    // è molto più affidabile di navigator.onLine dentro una WebView iOS/Android, che
    // spesso riporta "online" anche senza vera connettività o non si aggiorna mai.
    let cleanupNative = null;
    let usedNative = false;
    (async () => {
      try {
        const { Network } = await import("@capacitor/network");
        const status = await Network.getStatus();
        setIsOffline(!status.connected);
        const handle = await Network.addListener("networkStatusChange", (s) => setIsOffline(!s.connected));
        cleanupNative = () => handle.remove();
        usedNative = true;
      } catch (e) {
        // plugin non disponibile (browser/anteprima artifact): resta sul fallback sotto
      }
    })();
    function goOnline() {
      if (!usedNative) setIsOffline(false);
    }
    function goOffline() {
      if (!usedNative) setIsOffline(true);
    }
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      if (cleanupNative) cleanupNative();
    };
  }, []);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dueReviewCount, setDueReviewCount] = useState(0);

  const refreshDueReviewCount = useCallback(async () => {
    const q = await loadJSON("mistakes-queue", []);
    const now = Date.now();
    const count = q.filter((m) => !m.nextReview || m.nextReview <= now).length;
    setDueReviewCount(count);
    scheduleReviewReminder(count);
  }, []);

  useEffect(() => {
    refreshDueReviewCount();
  }, [refreshDueReviewCount, view]);

  // Piani del Programma "in svolgimento" — almeno un'attività fatta ma non tutte —
  // da mostrare in una sezione dedicata in Home, per riprenderli senza dover
  // ricordare di essere entrati a metà in "Programma". Ricaricato ogni volta che si
  // torna alla home, stesso schema già usato per il conteggio del ripasso dovuto.
  const [inProgressPlans, setInProgressPlans] = useState([]);
  const [weeklyBaseline, setWeeklyBaseline] = useState(null);

  const refreshInProgressPlans = useCallback(async () => {
    const plans = await loadJSON("programma-saved-plans", []);
    const filtered = plans.filter((p) => {
      const total = (p.plan || []).reduce((s, d) => s + (d.activities || []).length, 0);
      const doneCount = Object.values(p.done || {}).filter(Boolean).length;
      return total > 0 && doneCount > 0 && doneCount < total;
    });
    setInProgressPlans(filtered);
  }, []);

  useEffect(() => {
    refreshInProgressPlans();
  }, [refreshInProgressPlans, view]);

  const [pendingOpenPlanId, setPendingOpenPlanId] = useState(null);
  const [guidedSession, setGuidedSession] = useState(null); // { day, activities, index } | null

  function startGuidedSession(day, activities, startIndex) {
    setGuidedSession({ day, activities, index: startIndex });
    const activity = activities[startIndex];
    setPendingJump({ level: activity.level, packageIndex: activity.packageIndex });
    setView(activity.id);
  }

  async function markGuidedDoneAndAdvance() {
    if (!guidedSession) return;
    const { day, activities, index } = guidedSession;
    const activeId = await loadJSON("programma-active-plan-id", null);
    if (activeId) {
      const plans = await loadJSON("programma-saved-plans", []);
      const updated = plans.map((p) => (p.id === activeId ? { ...p, done: { ...(p.done || {}), [`${day}-${index}`]: true } } : p));
      await saveJSON("programma-saved-plans", updated);
    }

    if (index + 1 >= activities.length) {
      setGuidedSession(null);
      setView("programma");
    } else {
      const nextIndex = index + 1;
      setGuidedSession({ day, activities, index: nextIndex });
      const nextActivity = activities[nextIndex];
      setPendingJump({ level: nextActivity.level, packageIndex: nextActivity.packageIndex });
      setView(nextActivity.id);
    }
  }

  function exitGuidedSession() {
    setGuidedSession(null);
    setView("programma");
  }
  const [pendingJump, setPendingJump] = useState(null);
  const [numbersPracticeInitialMode, setNumbersPracticeInitialMode] = useState("table");
  const [showPartiDelDiscorso, setShowPartiDelDiscorso] = useState(false);
  const [showPartiDellaFrase, setShowPartiDellaFrase] = useState(false);
  const [premium, setPremium] = useState({ enabled: false, apiKey: "", voiceId: ELEVENLABS_DEFAULT_VOICE, voiceIdMale: "", useNative: false, voiceGender: "female" });
  const [premiumError, setPremiumError] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  // Stato dell'abbonamento: mai blocca l'avvio dell'app se il controllo fallisce (rete
  // assente, RevenueCat non configurato) — ricade su "non attivo", che significa
  // semplicemente restare nella parte gratuita (A1 e A2) invece di un errore visibile.
  const [subscriptionFromStore, setSubscriptionFromStore] = useState({ active: false, expiresAt: null, loading: true });
  useEffect(() => {
    let cancelled = false;
    checkSubscriptionStatus().then((result) => {
      if (!cancelled) setSubscriptionFromStore({ ...result, loading: false });
    });
    return () => { cancelled = true; };
  }, []);
  // Codice di sblocco personale (vedi DEV_UNLOCK_CODE): se attivato una volta, resta
  // sbloccato per sempre su questo dispositivo, salvato allo stesso modo dei progressi.
  const [devUnlocked, setDevUnlocked] = useState(false);
  useEffect(() => {
    let cancelled = false;
    loadJSON("dev-unlocked", false).then((v) => {
      if (!cancelled) setDevUnlocked(!!v);
    });
    return () => { cancelled = true; };
  }, []);
  // Riusata sia dalla pagina di benvenuto (primo avvio) sia dal paywall (in qualsiasi
  // momento successivo) — un solo punto che confronta il PIN, invece di duplicare la
  // logica in due posti. Ripulisce l'input da spazi/trattini prima del confronto, così
  // "192-837" o "192 837" funzionano allo stesso modo di "192837".
  function handleDevUnlock(code) {
    const cleaned = (code || "").replace(/[\s-]/g, "");
    if (cleaned === DEV_UNLOCK_CODE) {
      setDevUnlocked(true);
      saveJSON("dev-unlocked", true);
      return true;
    }
    return false;
  }
  // Secondo punto di ingresso per lo stesso sblocco sviluppatore, questa volta
  // dalla schermata Home (visibile ogni volta, non solo al primo avvio come
  // quello della pagina di benvenuto) — stato separato ma stessa funzione di
  // verifica sopra, per non duplicare la logica del confronto PIN.
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [devCodeValue, setDevCodeValue] = useState("");
  const [devCodeError, setDevCodeError] = useState(false);
  // Stato per l'inserimento discreto del PIN sviluppatore nella pagina di benvenuto
  // (mostrata al primo avvio) — separato da quello del paywall perché sono due punti
  // di ingresso diversi nell'interfaccia, anche se chiamano la stessa funzione sopra.
  const [showOnboardingCodeInput, setShowOnboardingCodeInput] = useState(false);
  const [onboardingCodeValue, setOnboardingCodeValue] = useState("");
  const [onboardingCodeError, setOnboardingCodeError] = useState(false);
  // Fonte unica usata ovunque nell'app al posto dello stato grezzo: "attivo" se
  // arriva un abbonamento vero da RevenueCat OPPURE se il codice di sblocco personale
  // è stato inserito — nessun punto dell'app deve sapere quale delle due cose vale.
  const subscription = useMemo(
    () => ({ ...subscriptionFromStore, active: subscriptionFromStore.active || devUnlocked }),
    [subscriptionFromStore, devUnlocked]
  );
  // Oggetto derivato passato ovunque al posto di "premium" grezzo: incrocia la
  // preferenza dell'utente (premium.useNative) con lo stato REALE dell'abbonamento,
  // così nessun componente a valle deve controllare "subscription" separatamente —
  // se l'abbonamento scade o non è mai stato attivato, useNative ricade su false
  // automaticamente ovunque, senza dover toccare le decine di punti che già usano
  // "premium" per la riproduzione audio.
  const effectivePremium = useMemo(
    () => ({ ...premium, useNative: !!(premium.useNative && subscription.active) }),
    [premium, subscription.active]
  );

  const [generatedLessons, setGeneratedLessons] = useState({});
  const [genLoading, setGenLoading] = useState({});
  const [genError, setGenError] = useState({});
  const [genSuccess, setGenSuccess] = useState({});
  const [genLoaded, setGenLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const g = await loadJSON("generated-lessons", {});
      setGeneratedLessons(g);
      setGenLoaded(true);
    })();
  }, []);

  function allLessonsFor(levelId) {
    return [...(LESSONS[levelId] || []), ...(generatedLessons[levelId] || [])];
  }

  async function generateLesson(levelId, topic, extraExisting = []) {
    setGenLoading((s) => ({ ...s, [levelId]: true }));
    setGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const existing = [...allLessonsFor(levelId).map((l) => l.title), ...extraExisting];
      const topicLine = topic
        ? `L'argomento richiesto è: "${topic}". La lezione deve trattare questo argomento specifico.`
        : "";

      if (!IS_ARTIFACT_ENV) {
        // App standalone: nessun limite di 1000 token, quindi una sola chiamata —
        // dimezza il tempo di attesa ed evita di superare eventuali timeout del
        // server (es. il gateway di Render) che due chiamate in sequenza rischiano di superare.
        const prompt = `Sei un'insegnante di russo madrelingua che crea materiale didattico per studenti italiani. Crea UNA nuova lezione di russo completa per il livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diversa per argomento da queste già esistenti: ${existing.join(", ") || "nessuna"}. ${topicLine}

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title":"titolo breve in russo","subtitle":"traduzione italiana del titolo","story":[{"ru":"...","it":"..."}],"vocab":[{"ru":"...","translit":"...","it":"..."}],"grammar":{"pattern":"...","explanation_it":"...","examples":["...","..."],"exercise":{"template":"frase con ___ da completare","options":["...","...","..."],"correct":0,"full_ru":"la frase completa con la risposta corretta inserita","full_it":"traduzione italiana della frase completa"}},"quiz":{"question":"...","options":["...","...","..."],"correct":0},"sentenceBuilder":{"instruction_it":"Metti le parole in ordine.","tokens":["...scrambled..."],"answer":"frase corretta completa.","answer_it":"traduzione italiana della frase"},"translationDrills":[{"prompt_it":"...","answer_ru":"..."}],"production":"consegna in italiano per una risposta libera in russo"}

Regole: story 4-6 righe di dialogo naturale, vocab 4 voci, examples 2-3 voci, translationDrills 3 voci. Russo grammaticalmente corretto e coerente con il livello. IMPORTANTE: prima di rispondere, rileggi il dialogo che hai scritto e verifica con attenzione che il valore "correct" del "quiz" indichi VERAMENTE l'indice (0, 1 o 2) dell'opzione che risponde in modo esatto alla "question" in base a ciò che il dialogo dice — non un'opzione plausibile ma sbagliata. Fai lo stesso controllo anche per "correct" dentro "grammar.exercise".`;

        const parsed = await callClaudeJSON(prompt, 3500);
        if (!parsed.title || !parsed.story || !parsed.vocab || !parsed.grammar || !parsed.grammar.exercise || !parsed.quiz || !parsed.production) {
          throw new Error("Struttura incompleta.");
        }
        parsed.id = `${levelId.toLowerCase()}-gen-${Date.now()}`;
        parsed.topic = topic || "Altro";

        setGeneratedLessons((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
          saveJSON("generated-lessons", next);
          return next;
        });
        setGenSuccess((s) => ({ ...s, [levelId]: parsed.title }));
        setTimeout(() => setGenSuccess((s) => ({ ...s, [levelId]: null })), 3000);
        return parsed.title;
      }

      const prompt1 = `Sei un'insegnante di russo madrelingua che crea materiale didattico per studenti italiani. Crea l'inizio di UNA nuova lezione di russo per il livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diversa per argomento da queste già esistenti: ${existing.join(", ") || "nessuna"}. ${topicLine}

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta (solo questi campi):
{"title":"titolo breve in russo","subtitle":"traduzione italiana del titolo","story":[{"ru":"...","it":"..."}],"vocab":[{"ru":"...","translit":"...","it":"..."}],"grammar":{"pattern":"...","explanation_it":"...","examples":["...","..."],"exercise":{"template":"frase con ___ da completare","options":["...","...","..."],"correct":0,"full_ru":"la frase completa con la risposta corretta inserita","full_it":"traduzione italiana della frase completa"}}}

Regole: story 4 righe di dialogo naturale, vocab 4 voci, examples 2 voci. Russo grammaticalmente corretto e coerente con il livello.`;

      const part1 = await callClaudeJSON(prompt1);
      if (!part1.title || !part1.story || !part1.vocab || !part1.grammar || !part1.grammar.exercise) {
        throw new Error("Struttura incompleta (parte 1).");
      }

      const storyText = part1.story.map((s) => s.ru).join(" ");
      const prompt2 = `Hai appena creato questo dialogo russo per una lezione di livello ${levelId}: "${storyText}". Vocabolario chiave: ${part1.vocab.map((v) => v.ru).join(", ")}.

Ora crea SOLO gli esercizi di completamento coerenti con questo dialogo.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta (solo questi campi):
{"quiz":{"question":"...","options":["...","...","..."],"correct":0},"sentenceBuilder":{"instruction_it":"Metti le parole in ordine.","tokens":["...scrambled..."],"answer":"frase corretta completa.","answer_it":"traduzione italiana della frase"},"translationDrills":[{"prompt_it":"...","answer_ru":"..."}],"production":"consegna in italiano per una risposta libera in russo"}

Regole: translationDrills 2 voci, tutte coerenti col vocabolario del dialogo sopra. IMPORTANTE: prima di rispondere, rileggi il dialogo qui sopra e verifica con attenzione che il valore "correct" del "quiz" indichi VERAMENTE l'indice (0, 1 o 2) dell'opzione che risponde in modo esatto alla "question" in base a ciò che il dialogo dice — non un'opzione plausibile ma sbagliata.`;

      const part2 = await callClaudeJSON(prompt2);
      if (!part2.quiz || !part2.production) {
        throw new Error("Struttura incompleta (parte 2).");
      }

      const parsed = { ...part1, ...part2, id: `${levelId.toLowerCase()}-gen-${Date.now()}`, topic: topic || "Altro" };
      setGeneratedLessons((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("generated-lessons", next);
        return next;
      });
      setGenSuccess((s) => ({ ...s, [levelId]: parsed.title }));
      setTimeout(() => setGenSuccess((s) => ({ ...s, [levelId]: null })), 3000);
      return parsed.title;
    } catch (e) {
      setGenError((s) => ({ ...s, [levelId]: "Errore sconosciuto." }));
      return null;
    } finally {
      setGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  async function generateBatch(levelId, count) {
    const batchTitles = [];
    for (let i = 0; i < count; i++) {
      const title = await generateLesson(levelId, batchTitles);
      if (title) batchTitles.push(title);
    }
  }

  const [customNouns, setCustomNouns] = useState({});
  const [nounGenLoading, setNounGenLoading] = useState({});
  const [nounGenError, setNounGenError] = useState({});

  useEffect(() => {
    (async () => {
      const n = await loadJSON("custom-nouns", {});
      setCustomNouns(n);
    })();
  }, []);

  async function generateOneNoun(levelId, gender, existingWords) {
    const genderLabel = gender === "masc" ? "maschile" : gender === "fem" ? "femminile" : "neutro";
    const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UN sostantivo russo di genere ${genderLabel}, adatto al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diverso da questi già usati: ${existingWords.join(", ") || "nessuno"}.

Fornisci la declinazione completa nei 6 casi (singolare), e per ogni caso 3 frasi brevi ed esempio: affermativa, negativa, interrogativa, ciascuna con traduzione italiana.

IMPORTANTE — accento tonico: nel campo "word" e in ogni "form", segna la sillaba accentata inserendo il carattere Unicode U+0301 (accento acuto combinante) subito dopo la vocale accentata, es. "окно\u0301" per una parola con accento sull'ultima sillaba. Non serve per parole di una sola sillaba. Non aggiungere l'accento dentro le frasi di esempio, solo nei campi "word" e "form".

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"forma al nominativo con accento","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale in italiano su questo tipo di declinazione (1 frase)","cases":[{"case":"Именительный","form":"...","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"...","it":"..."},"int":{"ru":"...","it":"..."}}},{"case":"Родительный","form":"...","examples":{...}},{"case":"Дательный","form":"...","examples":{...}},{"case":"Винительный","form":"...","examples":{...}},{"case":"Творительный","form":"...","examples":{...}},{"case":"Предложный","form":"...","examples":{...}}]}

Ogni frase deve essere breve (4-8 parole) e naturale, coerente con il livello ${levelId}.`;

    const parsed = await callClaudeJSON(prompt);
    if (!parsed.word || !parsed.cases || parsed.cases.length !== 6) {
      throw new Error(`Struttura incompleta per il sostantivo ${genderLabel}.`);
    }
    return parsed;
  }

  async function generateNounSet(levelId) {
    setNounGenError((s) => ({ ...s, [levelId]: null }));
    const existing = [...DECLENSIONS[levelId], ...(customNouns[levelId] || [])].map((n) => stripAccentMarks(n.word));
    const newNouns = [];
    try {
      for (const gender of ["masc", "fem", "neu"]) {
        setNounGenLoading((s) => ({ ...s, [levelId]: gender }));
        const noun = await generateOneNoun(levelId, gender, [...existing, ...newNouns.map((n) => stripAccentMarks(n.word))]);
        newNouns.push(noun);
      }
      setCustomNouns((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), ...newNouns] };
        saveJSON("custom-nouns", next);
        return next;
      });
    } catch (e) {
      setNounGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare i sostantivi." }));
      if (newNouns.length) {
        setCustomNouns((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), ...newNouns] };
          saveJSON("custom-nouns", next);
          return next;
        });
      }
    } finally {
      setNounGenLoading((s) => ({ ...s, [levelId]: null }));
    }
  }

  const [customPronouns, setCustomPronouns] = useState([]);
  const [pronounGenLoading, setPronounGenLoading] = useState(false);
  const [pronounGenError, setPronounGenError] = useState(null);

  const [customReggenza, setCustomReggenza] = useState([]);
  const [reggenzaGenLoading, setReggenzaGenLoading] = useState(false);
  const [reggenzaGenError, setReggenzaGenError] = useState(null);
  const [customComparativi, setCustomComparativi] = useState([]);
  const [comparativiGenLoading, setComparativiGenLoading] = useState(false);
  const [comparativiGenError, setComparativiGenError] = useState(null);
  const [customParticipi, setCustomParticipi] = useState([]);
  const [participiGenLoading, setParticipiGenLoading] = useState(false);
  const [participiGenError, setParticipiGenError] = useState(null);
  const [customCondizionale, setCustomCondizionale] = useState([]);
  const [condizionaleGenLoading, setCondizionaleGenLoading] = useState(false);
  const [condizionaleGenError, setCondizionaleGenError] = useState(null);
  const [cardExamples, setCardExamples] = useState({});
  const [customFiabe, setCustomFiabe] = useState({}); // { A1: [...], A2: [...], ... }
  const [extraInterrogative, setExtraInterrogative] = useState({}); // { "level-groupIndex": {ru,it} }
  const [interrogativeGenLoading, setInterrogativeGenLoading] = useState(null);
  const [allCasesExample, setAllCasesExample] = useState({}); // { "level-groupIndex": {...} }
  const [customErroriTipici, setCustomErroriTipici] = useState([]);
  const [erroreGenLoading, setErroreGenLoading] = useState(false);
  const [erroreGenError, setErroreGenError] = useState(null);
  const [allCasesGenLoading, setAllCasesGenLoading] = useState(null);
  const [fiabaGenLoading, setFiabaGenLoading] = useState(false);
  const [fiabaGenError, setFiabaGenError] = useState(null);
  const [cardExampleLoading, setCardExampleLoading] = useState(null);
  const [cardExampleError, setCardExampleError] = useState(null);
  const [phraseCaseTags, setPhraseCaseTags] = useState({});
  const [phraseCaseTagLoading, setPhraseCaseTagLoading] = useState(null);
  const [phraseCaseTagError, setPhraseCaseTagError] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await loadJSON("custom-pronouns", []);
      setCustomPronouns(p);
      setCustomReggenza(await loadJSON("custom-reggenza", []));
      setCustomComparativi(await loadJSON("custom-comparativi", []));
      setCustomParticipi(await loadJSON("custom-participi", []));
      setCardExamples(await loadJSON("card-examples", {}));
      setCustomFiabe(await loadJSON("custom-fiabe", {}));
      setExtraInterrogative(await loadJSON("extra-interrogative", {}));
      setAllCasesExample(await loadJSON("all-cases-example", {}));
      setCustomErroriTipici(await loadJSON("custom-errori-tipici", []));
      const loadedCaseTags = await loadJSON("phrase-case-tags", {});
      // unisce invece di sovrascrivere: se l'utente ha già aperto Frasi/Componi e la
      // generazione automatica ha scritto nuove etichette PRIMA che questa lettura (più
      // lenta, in coda a diverse altre) finisse, non le deve cancellare — altrimenti le
      // etichette appena apparse sparirebbero di nuovo.
      setPhraseCaseTags((prev) => ({ ...loadedCaseTags, ...prev }));
      setCustomCondizionale(await loadJSON("custom-condizionale", []));
    })();
  }, []);

  async function generateReggenza() {
    setReggenzaGenLoading(true);
    setReggenzaGenError(null);
    try {
      const existing = [...REGGENZA_VERBI.flatMap((g) => g.verbs), ...customReggenza].map((v) => stripAccentMarks(v.word));
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UN verbo russo comune con un caso specifico che governa (senza preposizione, oppure con una preposizione se è lo schema più naturale per quel verbo), diverso da questi già usati: ${existing.join(", ") || "nessuno"}.

IMPORTANTE — accento tonico: segna la sillaba accentata con U+0301 subito dopo la vocale accentata nel campo "word" e nell'esempio "example_ru", tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"case":"uno tra Genitivo, Dativo, Accusativo, Strumentale, Prepositivo","word":"verbo con accento (+ preposizione se presente)","meaning_it":"traduzione italiana","example_ru":"frase breve con accenti","example_it":"traduzione della frase","note_it":"breve nota su questa reggenza, perché è utile saperla (1-2 frasi)"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.word || !parsed.case || !parsed.example_ru) throw new Error("Struttura incompleta.");
      setCustomReggenza((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-reggenza", next);
        return next;
      });
    } catch (e) {
      setReggenzaGenError("Non sono riuscita a generare l'esempio.");
    } finally {
      setReggenzaGenLoading(false);
    }
  }

  async function generateComparativo() {
    setComparativiGenLoading(true);
    setComparativiGenError(null);
    try {
      const existing = [...COMPARATIVI_AGGETTIVI, ...customComparativi].map((a) => stripAccentMarks(a.word));
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UN aggettivo russo comune, con la sua forma di comparativo e superlativo, diverso da questi già usati: ${existing.join(", ") || "nessuno"}. Preferisci aggettivi utili e frequenti; indica se la forma è irregolare (non segue il normale suffisso -ее).

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata in ogni campo russo, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"aggettivo al maschile con accento","meaning_it":"traduzione italiana","comparative":"forma comparativa con accento","superlative":"forma superlativa con accento","irregular":true o false,"example_ru":"frase breve col comparativo, con accenti","example_it":"traduzione","example_superlative_ru":"frase breve DIVERSA dalla prima, che usa il superlativo (non il comparativo), con accenti","example_superlative_it":"traduzione della frase col superlativo","note_it":"breve nota se irregolare, altrimenti stringa vuota"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.word || !parsed.comparative || !parsed.superlative) throw new Error("Struttura incompleta.");
      setCustomComparativi((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-comparativi", next);
        return next;
      });
    } catch (e) {
      setComparativiGenError("Non sono riuscita a generare l'esempio.");
    } finally {
      setComparativiGenLoading(false);
    }
  }

  async function generateParticipio() {
    setParticipiGenLoading(true);
    setParticipiGenError(null);
    try {
      const existing = [...PARTICIPI_GERUNDI, ...customParticipi].map((p) => p.title);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani, livello B2/C1. Crea UN esempio di trasformazione da frase con "который" (o da due proposizioni coordinate) a participio o gerundio russo, diverso da questi già usati: ${existing.join(", ") || "nessuno"}. Scegli un tipo tra: participio presente attivo, participio passato attivo, participio passato passivo, gerundio imperfettivo, gerundio perfettivo.

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata in transform_before e transform_after, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title":"nome del tipo di participio/gerundio in italiano","subtitle_ru":"nome tecnico in russo","explanation_it":"spiegazione in italiano di come si forma e quando si usa (2-3 frasi)","transform_before":"frase originale russa con который o due proposizioni, con accenti","transform_after":"stessa frase trasformata col participio/gerundio, con accenti","transform_it":"traduzione italiana di entrambe, formato 'prima → dopo'"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.title || !parsed.transform_before || !parsed.transform_after) throw new Error("Struttura incompleta.");
      setCustomParticipi((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-participi", next);
        return next;
      });
    } catch (e) {
      setParticipiGenError("Non sono riuscita a generare l'esempio.");
    } finally {
      setParticipiGenLoading(false);
    }
  }

  async function generateCondizionale() {
    setCondizionaleGenLoading(true);
    setCondizionaleGenError(null);
    try {
      const existing = [...CONDIZIONALE_CARDS, ...customCondizionale].map((c) => c.title);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea UNA scheda su un uso della particella condizionale "бы" in russo, diverso da questi già usati: ${existing.join(", ") || "nessuno"}. Scegli un aspetto specifico e utile (es. un contesto d'uso diverso da formazione base, periodo ipotetico, desiderio attenuato, consiglio attenuato, posizione della particella).

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata in example_ru, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title":"titolo breve in italiano","subtitle_ru":"nome tecnico in russo","explanation_it":"spiegazione in italiano (2-3 frasi)","example_ru":"frase russa con бы, con accenti","example_it":"traduzione italiana","tip_it":"un consiglio pratico breve per ricordare questo uso"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.title || !parsed.example_ru) throw new Error("Struttura incompleta.");
      setCustomCondizionale((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-condizionale", next);
        return next;
      });
    } catch (e) {
      setCondizionaleGenError("Non sono riuscita a generare l'esempio.");
    } finally {
      setCondizionaleGenLoading(false);
    }
  }

  async function generateCardExample(card) {
    setCardExampleLoading(card.key);
    setCardExampleError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scrivi UNA breve frase di esempio in russo che usi naturalmente la parola/espressione "${card.ru}" (che significa "${card.it}" in italiano), a un livello semplice e comprensibile.

IMPORTANTE — accento tonico: segna la sillaba accentata con U+0301 subito dopo la vocale accentata, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"example_ru":"frase breve con accenti che usa la parola","example_it":"traduzione italiana della frase"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.example_ru) throw new Error("Struttura incompleta.");
      setCardExamples((prev) => {
        const next = { ...prev, [card.key]: parsed };
        saveJSON("card-examples", next);
        return next;
      });
    } catch (e) {
      setCardExampleError("Non sono riuscita a generare la frase esempio.");
    } finally {
      setCardExampleLoading(null);
    }
  }

  async function generateFiaba(level) {
    setFiabaGenLoading(true);
    setFiabaGenError(null);
    try {
      const existing = (customFiabe[level] || []).map((f) => f.title_it);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scrivi UNA breve fiaba o raccontino originale in russo, adatta al livello ${level} del CEFR (frasi ${level.startsWith("A") ? "brevi e semplici" : level.startsWith("B") ? "di media complessità" : "articolate, con lessico più ricco"}), diversa da queste già scritte: ${existing.join(", ") || "nessuna"}. Divide il racconto in 5-8 frasi/paragrafi brevi, ciascuno con la sua traduzione italiana. Alla fine, scrivi anche 3 domande di comprensione a scelta multipla (3 opzioni ciascuna) sul contenuto del racconto, in russo.

IMPORTANTE — accento tonico: segna la sillaba accentata con U+0301 subito dopo la vocale accentata in ogni frase russa, comprese le domande e le opzioni, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title_ru":"titolo in russo con accenti","title_it":"titolo in italiano","paragraphs":[{"ru":"frase/paragrafo con accenti","it":"traduzione italiana"}],"questions":[{"question":"domanda in russo con accenti","options":["opzione1","opzione2","opzione3"],"correct":0}]}`;

      const parsed = await callClaudeJSON(prompt, 3500);
      if (!parsed.paragraphs || !parsed.paragraphs.length) throw new Error("Struttura incompleta.");
      setCustomFiabe((prev) => {
        const next = { ...prev, [level]: [...(prev[level] || []), parsed] };
        saveJSON("custom-fiabe", next);
        return next;
      });
    } catch (e) {
      setFiabaGenError("Non sono riuscita a generare la fiaba.");
    } finally {
      setFiabaGenLoading(false);
    }
  }

  async function generateInterrogative(tagKey, pattern, patternIt) {
    setInterrogativeGenLoading(tagKey);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Per questo modello di frase: "${pattern}" (in italiano: "${patternIt}"), scrivi UNA frase interrogativa russa naturale che usi lo stesso modello/struttura, adatta a completare un pacchetto di studio che già ha frasi affermative e negative.

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"ru":"frase interrogativa russa con accenti, che termina con ?","it":"traduzione italiana"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.ru) throw new Error("Struttura incompleta.");
      setExtraInterrogative((prev) => {
        const next = { ...prev, [tagKey]: parsed };
        saveJSON("extra-interrogative", next);
        return next;
      });
    } catch (e) {
      // silenzioso: extra opzionale, non deve bloccare lo studio
    } finally {
      setInterrogativeGenLoading(null);
    }
  }

  async function generateAllCasesExample(tagKey, pattern, patternIt) {
    setAllCasesGenLoading(tagKey);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Per questo modello di frase: "${pattern}" (in italiano: "${patternIt}"), scegli UN sostantivo chiave pertinente al tema, dichiaralo al singolare, e fornisci la sua declinazione completa nei 6 casi russi, ciascuno con una breve frase di esempio (5-8 parole) che usi il modello dato o un contesto simile.

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"forma base al nominativo, con accento","meaning_it":"traduzione italiana","cases":[{"case":"Именительный","meaning_it":"chi? cosa?","form":"...","example_ru":"...","example_it":"..."},{"case":"Родительный","meaning_it":"di chi? di cosa?","form":"...","example_ru":"...","example_it":"..."},{"case":"Дательный","meaning_it":"a chi? a cosa?","form":"...","example_ru":"...","example_it":"..."},{"case":"Винительный","meaning_it":"chi? cosa? (oggetto)","form":"...","example_ru":"...","example_it":"..."},{"case":"Творительный","meaning_it":"con chi? con cosa?","form":"...","example_ru":"...","example_it":"..."},{"case":"Предложный","meaning_it":"di chi/cosa (con о/в/на)","form":"...","example_ru":"...","example_it":"..."}]}`;

      const parsed = await callClaudeJSON(prompt, 3000);
      if (!parsed.word || !parsed.cases) throw new Error("Struttura incompleta.");
      setAllCasesExample((prev) => {
        const next = { ...prev, [tagKey]: parsed };
        saveJSON("all-cases-example", next);
        return next;
      });
    } catch (e) {
      // silenzioso
    } finally {
      setAllCasesGenLoading(null);
    }
  }

  async function generateErroreTipico() {
    setErroreGenLoading(true);
    setErroreGenError(null);
    try {
      const existing = [...ERRORI_TIPICI_ITALIANI, ...customErroriTipici].map((e) => e.title);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani, esperta di interferenza linguistica italiano-russo. Crea UNA scheda su un errore tipico che gli italiani commettono imparando il russo, diverso da questi già trattati: ${existing.join(", ")}.

Scegli un fenomeno di interferenza REALE e specifico (falsi amici, calchi di preposizioni, genere grammaticale diverso, aspetto verbale, accento tonico, ordine delle parole, uso di ты/вы, reggenza dei casi, uso degli articoli, verbi di moto, ecc — ma diverso da quelli già coperti). Scrivi una frase SBAGLIATA realistica che un italiano scriverebbe per interferenza, poi la versione corretta, poi la spiegazione del perché.

IMPORTANTE — accento tonico: U+0301 subito dopo la vocale accentata nelle frasi russe, tranne nelle parole di una sola sillaba.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title":"titolo breve del fenomeno in italiano","wrong_ru":"frase o esempio sbagliato (russo o descrizione)","wrong_it":"nota tra parentesi sull'errore","correct_ru":"versione corretta in russo con accenti","correct_it":"traduzione italiana","explanation_it":"spiegazione del perché in 1-3 frasi"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.title || !parsed.correct_ru) throw new Error("Struttura incompleta.");
      setCustomErroriTipici((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-errori-tipici", next);
        return next;
      });
    } catch (e) {
      setErroreGenError("Non sono riuscita a generare l'errore tipico.");
    } finally {
      setErroreGenLoading(false);
    }
  }

  async function generatePhraseCaseTag(tagKey, ruPhrase) {
    setPhraseCaseTagLoading(tagKey);
    setPhraseCaseTagError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Analizza SOLO questa specifica frase russa, non altre: "${ruPhrase}"

Indica qual è il caso grammaticale principale coinvolto IN QUESTA FRASE (es. Nominativo, Genitivo, Dativo, Accusativo, Strumentale, Prepositivo) e, se la frase è una domanda, che tipo di domanda è (es. Chi, Che cosa, Dove, Quando, Perché, Come, Quanto) — altrimenti lascia vuoto.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"case":"nome del caso in italiano","questionType":"tipo di domanda oppure stringa vuota se non è una domanda"}`;

      const parsed = await callClaudeJSON(prompt, 300);
      if (!parsed.case) throw new Error("Risposta incompleta dal servizio di generazione.");
      setPhraseCaseTags((prev) => {
        const next = { ...prev, [tagKey]: parsed };
        saveJSON("phrase-case-tags", next);
        return next;
      });
    } catch (e) {
      setPhraseCaseTagError({ key: tagKey, message: "Non sono riuscita a determinare il caso." });
    } finally {
      setPhraseCaseTagLoading(null);
    }
  }

  async function generatePronoun() {
    setPronounGenLoading(true);
    setPronounGenError(null);
    try {
      const existing = [...PRONOUNS, ...customPronouns].map((p) => stripAccentMarks(p.word));
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UN pronome russo (personale, possessivo, dimostrativo, interrogativo o riflessivo — non un pronome personale semplice se già presente) adatto a uno studente che sta imparando il russo, diverso da questi già usati: ${existing.join(", ") || "nessuno"}.

Fornisci la declinazione nei 6 casi (usa la forma più rappresentativa se il pronome varia per genere, es. maschile singolare per un possessivo), e per ogni caso 3 frasi brevi di esempio: affermativa, negativa, interrogativa, ciascuna con traduzione italiana.

IMPORTANTE — accento tonico: nel campo "word" e in ogni "form", segna la sillaba accentata inserendo il carattere Unicode U+0301 (accento acuto combinante) subito dopo la vocale accentata. Non serve per parole di una sola sillaba. Non aggiungere l'accento dentro le frasi di esempio, solo nei campi "word" e "form".

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"forma al nominativo con accento","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale in italiano su questo pronome (1-2 frasi)","cases":[{"case":"Именительный","form":"...","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"...","it":"..."},"int":{"ru":"...","it":"..."}}},{"case":"Родительный","form":"...","examples":{...}},{"case":"Дательный","form":"...","examples":{...}},{"case":"Винительный","form":"...","examples":{...}},{"case":"Творительный","form":"...","examples":{...}},{"case":"Предложный","form":"...","examples":{...}}]}

Ogni frase deve essere breve (4-8 parole) e naturale.`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.word || !parsed.cases || parsed.cases.length !== 6) {
        throw new Error("Struttura incompleta.");
      }
      setCustomPronouns((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-pronouns", next);
        return next;
      });
    } catch (e) {
      setPronounGenError("Non sono riuscita a generare il pronome.");
    } finally {
      setPronounGenLoading(false);
    }
  }

  const [customPrepositions, setCustomPrepositions] = useState({});
  const [prepGenLoading, setPrepGenLoading] = useState({});
  const [prepGenError, setPrepGenError] = useState({});
  const [customAdjectives, setCustomAdjectives] = useState({});

  useEffect(() => {
    (async () => {
      const p = await loadJSON("custom-prepositions", {});
      setCustomPrepositions(p);
      const a = await loadJSON("custom-adjectives", {});
      setCustomAdjectives(a);
    })();
  }, []);

  async function generatePreposition(levelId) {
    setPrepGenLoading((s) => ({ ...s, [levelId]: true }));
    setPrepGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const existing = [...PREPOSITIONS[levelId], ...(customPrepositions[levelId] || [])].map((p) => p.word);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UNA preposizione russa adatta al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diversa da queste già usate: ${existing.join(", ") || "nessuna"}.

Per ciascun caso che questa preposizione regge (1 o 2, raramente di più), fornisci: il nome del caso in russo, una breve nota sul significato in quel contesto, e 3 frasi brevi (4-8 parole): affermativa, negativa, interrogativa, ciascuna con traduzione italiana.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"preposizione","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale (1-2 frasi) su quali casi regge e perché","usages":[{"caseGoverned":"Nome del caso in russo","meaningNote":"breve nota sul significato in questo uso","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"...","it":"..."},"int":{"ru":"...","it":"..."}}}]}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.word || !parsed.usages || !parsed.usages.length) {
        throw new Error("Struttura incompleta.");
      }
      setCustomPrepositions((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-prepositions", next);
        return next;
      });
    } catch (e) {
      setPrepGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare la preposizione." }));
    } finally {
      setPrepGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  const [wordPackageLoading, setWordPackageLoading] = useState(false);
  const [wordPackageError, setWordPackageError] = useState(null);

  // Genera un pacchetto di studio per una parola cercata che non è ancora presente in nessuna sezione,
  // classificandola automaticamente nella categoria grammaticale corretta (Casi/Verbi/Aggettivi/Preposizioni).
  async function generateWordPackage(query) {
    setWordPackageLoading(true);
    setWordPackageError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Uno studente ha cercato questa parola o espressione, che non è presente nei materiali dell'app: "${query}" (può essere scritta in russo o in italiano).

Identifica di quale parola russa si tratta e determina: la sua categoria grammaticale principale tra sostantivo, verbo, aggettivo, preposizione; il livello CEFR più adatto (A1, A2, B1, B2, C1 o C2).

Poi genera il pacchetto di studio completo per questa parola, usando ESATTAMENTE la struttura della categoria scelta:

- Se sostantivo: {"category":"noun","level":"A1","word":"forma al nominativo con accento (usa U+0301 dopo la vocale accentata)","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale (1 frase)","cases":[{"case":"Именительный","form":"...","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"...","it":"..."},"int":{"ru":"...","it":"..."}}},{"case":"Родительный","form":"...","examples":{...}},{"case":"Дательный","form":"...","examples":{...}},{"case":"Винительный","form":"...","examples":{...}},{"case":"Творительный","form":"...","examples":{...}},{"case":"Предложный","form":"...","examples":{...}}]}

- Se verbo: {"category":"verb","level":"A1","meaning_it":"traduzione italiana condivisa","note_it":"breve nota sulla differenza di aspetto","imperfective":{"word":"infinito imperfettivo con accento","forms":[{"label":"...","form":"...","example_ru":"...","example_it":"..."}]},"perfective":{"word":"infinito perfettivo con accento","forms":[{"label":"...","form":"...","example_ru":"...","example_it":"..."}]},"situational":{"prompt_it":"...","options":[{"ru":"corretta","aspect":"imperfettivo|perfettivo"},{"ru":"sbagliata","aspect":"imperfettivo|perfettivo"}],"correct":0}}

- Se aggettivo: {"category":"adjective","level":"A1","word":"forma maschile singolare con accento","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale","genderForms":[{"label":"Maschile","form":"...","noun":"sostantivo di esempio maschile","example_ru":"...","example_it":"..."},{"label":"Femminile","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Neutro","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Plurale","form":"...","noun":"...","example_ru":"...","example_it":"..."}],"caseForms":[{"label":"Nominativo","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Genitivo","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Dativo","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Accusativo","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Strumentale","form":"...","noun":"...","example_ru":"...","example_it":"..."},{"label":"Prepositivo","form":"...","noun":"...","example_ru":"...","example_it":"..."}],"transform":{"promptIt":"frase italiana da trasformare in russo con l'aggettivo in un caso specifico","targetCase":"nome del caso richiesto","options":["forma corretta","forma sbagliata 1","forma sbagliata 2"],"correct":0}}

- Se preposizione: {"category":"preposition","level":"A1","word":"preposizione","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale su quali casi regge","usages":[{"caseGoverned":"Nome del caso in russo","meaningNote":"breve nota sul significato","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"...","it":"..."},"int":{"ru":"...","it":"..."}}}]}

IMPORTANTE — accento tonico: in ogni campo "word"/"form", segna la sillaba accentata con il carattere Unicode U+0301 subito dopo la vocale accentata (non nelle frasi di esempio).

${JSON_FORMAT_INSTRUCTIONS}

Rispondi SOLO con l'oggetto JSON della categoria scelta, includendo sempre il campo "category" e "level".`;

      const parsed = await callClaudeJSON(prompt);
      const category = parsed.category;
      const levelId = LEVELS.some((l) => l.id === parsed.level) ? parsed.level : "A1";

      if (category === "noun") {
        if (!parsed.word || !parsed.cases || parsed.cases.length !== 6) throw new Error("Struttura incompleta.");
        setCustomNouns((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
          saveJSON("custom-nouns", next);
          return next;
        });
        return { section: "declensions", level: levelId, index: DECLENSIONS[levelId].length + (customNouns[levelId] || []).length };
      }
      if (category === "verb") {
        if (!parsed.imperfective || !parsed.perfective) throw new Error("Struttura incompleta.");
        setCustomVerbs((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
          saveJSON("custom-verbs", next);
          return next;
        });
        return { section: "verbs", level: levelId, index: VERBS[levelId].length + (customVerbs[levelId] || []).length };
      }
      if (category === "adjective") {
        if (!parsed.word || !parsed.genderForms || !parsed.caseForms) throw new Error("Struttura incompleta.");
        setCustomAdjectives((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
          saveJSON("custom-adjectives", next);
          return next;
        });
        return { section: "adjectives", level: levelId, index: ADJECTIVES[levelId].length + (customAdjectives[levelId] || []).length };
      }
      if (category === "preposition") {
        if (!parsed.word || !parsed.usages || !parsed.usages.length) throw new Error("Struttura incompleta.");
        setCustomPrepositions((prev) => {
          const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
          saveJSON("custom-prepositions", next);
          return next;
        });
        return { section: "prepositions", level: levelId, index: PREPOSITIONS[levelId].length + (customPrepositions[levelId] || []).length };
      }
      throw new Error("Non sono riuscita a classificare questa parola.");
    } catch (e) {
      setWordPackageError("Non sono riuscita a creare il pacchetto per questa parola.");
      return null;
    } finally {
      setWordPackageLoading(false);
    }
  }

  const SIMPLE_POS_META = {
    adverbs: { it: "avverbio", storageKey: "custom-adverbs" },
    numerals: { it: "numerale", storageKey: "custom-numerals" },
    conjunctions: { it: "congiunzione", storageKey: "custom-conjunctions" },
    particles: { it: "particella", storageKey: "custom-particles" },
    interjections: { it: "interiezione", storageKey: "custom-interjections" },
  };
  const [customSimplePos, setCustomSimplePos] = useState({ adverbs: {}, numerals: {}, conjunctions: {}, particles: {}, interjections: {} });
  const [simplePosGenLoading, setSimplePosGenLoading] = useState({});
  const [simplePosGenError, setSimplePosGenError] = useState({});

  useEffect(() => {
    (async () => {
      const next = {};
      for (const cat of Object.keys(SIMPLE_POS_META)) {
        next[cat] = await loadJSON(SIMPLE_POS_META[cat].storageKey, {});
      }
      setCustomSimplePos(next);
    })();
  }, []);

  async function generateSimplePosItem(categoryId, levelId) {
    const key = `${categoryId}-${levelId}`;
    setSimplePosGenLoading((s) => ({ ...s, [key]: true }));
    setSimplePosGenError((s) => ({ ...s, [key]: null }));
    try {
      const meta = SIMPLE_POS_META[categoryId];
      const staticData = (SIMPLE_POS_DATA_MAP[categoryId][levelId] || []).map((i) => stripAccentMarks(i.word));
      const customData = (customSimplePos[categoryId]?.[levelId] || []).map((i) => stripAccentMarks(i.word));
      const existing = [...staticData, ...customData];
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UN(A) ${meta.it} russo adatto al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diverso da questi già usati: ${existing.join(", ") || "nessuno"}.

Fornisci una breve nota grammaticale in italiano (1-2 frasi) e una frase di esempio affermativa, una negativa e una interrogativa (se ha senso per questa parola: se la parola non può naturalmente apparire in una frase negativa o interrogativa, usa il valore "—" per ru e it di quel campo).

IMPORTANTE — accento tonico: nel campo "word" e nelle frasi di esempio, segna la sillaba accentata con il carattere Unicode U+0301 subito dopo la vocale accentata (non serve per parole di una sola sillaba).

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"word":"parola con accento","meaning_it":"traduzione italiana","note_it":"breve nota grammaticale","examples":{"aff":{"ru":"...","it":"..."},"neg":{"ru":"... oppure —","it":"... oppure —"},"int":{"ru":"...","it":"..."}}}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.word || !parsed.examples?.aff?.ru) throw new Error("Struttura incompleta.");
      setCustomSimplePos((prev) => {
        const next = { ...prev, [categoryId]: { ...prev[categoryId], [levelId]: [...(prev[categoryId]?.[levelId] || []), parsed] } };
        saveJSON(meta.storageKey, next[categoryId]);
        return next;
      });
    } catch (e) {
      setSimplePosGenError((s) => ({ ...s, [key]: "Non sono riuscita a generare l'elemento." }));
    } finally {
      setSimplePosGenLoading((s) => ({ ...s, [key]: false }));
    }
  }

  const [customSyntax, setCustomSyntax] = useState({});
  const [syntaxGenLoading, setSyntaxGenLoading] = useState({});
  const [syntaxGenError, setSyntaxGenError] = useState({});

  const [customNumbers, setCustomNumbers] = useState([]);
  const [numberGenLoading, setNumberGenLoading] = useState(false);
  const [numberGenError, setNumberGenError] = useState(null);

  useEffect(() => {
    (async () => {
      const n = await loadJSON("custom-numbers-table", []);
      setCustomNumbers(n);
    })();
  }, []);

  async function generateCustomNumber(targetNum) {
    setNumberGenLoading(true);
    setNumberGenError(null);
    try {
      const existing = [...NUMBERS_TABLE, ...customNumbers].map((n) => n.num);
      if (targetNum !== undefined) {
        if (!Number.isInteger(targetNum) || targetNum <= 0) throw new Error("Inserisci un numero intero positivo.");
        if (existing.includes(targetNum)) throw new Error("Questo numero è già presente nell'elenco.");
      }
      const prompt = targetNum !== undefined
        ? `Sei un'insegnante di russo madrelingua per studenti italiani. Scrivi come si dice il numero ${targetNum} in russo.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"num": ${targetNum}, "ru": "forma scritta in russo con l'accento tonico (U+0301)"}`
        : `Sei un'insegnante di russo madrelingua per studenti italiani. Genera UN numero russo (in cifre e la sua forma scritta in russo) che NON sia tra questi già presenti: ${existing.join(", ")}.

Scegli un numero interessante da imparare — ad esempio un numero composto tra 21 e 99 non ancora coperto, oppure centinaia (200, 300...), migliaia (1000, 2000...) o un numero ordinale interessante. Varia la scelta.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"num": 21, "ru": "forma scritta in russo con l'accento tonico (U+0301)"}`;
      const parsed = await callClaudeJSON(prompt);
      if (typeof parsed.num !== "number" || !parsed.ru) throw new Error("Struttura incompleta.");
      if (existing.includes(parsed.num)) throw new Error("Numero già presente, riprova.");
      setCustomNumbers((prev) => {
        const next = [...prev, parsed];
        saveJSON("custom-numbers-table", next);
        return next;
      });
    } catch (e) {
      setNumberGenError("Non sono riuscita a generare un nuovo numero.");
    } finally {
      setNumberGenLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const s = await loadJSON("custom-syntax", {});
      setCustomSyntax(s);
    })();
  }, []);

  async function generateSyntaxSentence(levelId) {
    setSyntaxGenLoading((s) => ({ ...s, [levelId]: true }));
    setSyntaxGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const existing = [...SYNTAX_SENTENCES[levelId], ...(customSyntax[levelId] || [])].map((s) => s.ru);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea UNA frase russa adatta al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}) da usare per un esercizio di analisi sintattica (analisi logica), diversa da queste già usate: ${existing.join(" | ") || "nessuna"}.

La frase deve contenere chiaramente: un Soggetto, un Predicato (verbo), un Complemento Oggetto, e se possibile anche un Attributo (aggettivo), una Circostanza di Tempo e una Circostanza di Luogo — a seconda di cosa è naturale per il livello.

Scomponi la frase in "chunks": ogni chunk è una parte consecutiva della frase (una o più parole) a cui assegni ESATTAMENTE uno di questi ruoli: "soggetto", "predicato", "oggetto", "attributo", "circTempo", "circLuogo". La concatenazione di tutti i chunk nell'ordine dato deve ricostruire ESATTAMENTE la frase russa originale (stessi spazi, stessa punteggiatura, incluso l'accento tonico).

IMPORTANTE — accento tonico: nella frase russa e in ogni chunk, segna la sillaba accentata con il carattere Unicode U+0301 subito dopo la vocale accentata.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"ru":"frase russa completa con accenti","it":"traduzione italiana","chunks":[{"text":"...","role":"..."},{"text":"...","role":"..."}]}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.ru || !parsed.chunks || !parsed.chunks.length) throw new Error("Struttura incompleta.");
      const allChunksFound = parsed.chunks.every((c) => parsed.ru.includes(c.text));
      if (!allChunksFound) {
        throw new Error("I pezzi della frase non corrispondono esattamente alla frase originale.");
      }
      setCustomSyntax((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-syntax", next);
        return next;
      });
    } catch (e) {
      setSyntaxGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare la frase." }));
    } finally {
      setSyntaxGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  const [customDialogues, setCustomDialogues] = useState({});
  const [dialogueGenLoading, setDialogueGenLoading] = useState({});
  const [dialogueGenError, setDialogueGenError] = useState({});

  useEffect(() => {
    (async () => {
      const d = await loadJSON("custom-dialogues", {});
      setCustomDialogues(d);
    })();
  }, []);

  async function generateDialogue(levelId) {
    setDialogueGenLoading((s) => ({ ...s, [levelId]: true }));
    setDialogueGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const existing = [...DIALOGUES[levelId], ...(customDialogues[levelId] || [])].map((d) => d.title);
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea UN dialogo realistico tra due persone, adatto al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), su un tema di vita quotidiana diverso da questi già usati: ${existing.join(", ") || "nessuno"}.

Il dialogo deve avere 8-10 battute alternate tra i due personaggi. Scegli quale dei due personaggi sarà interpretato dallo studente (userRole).

Poi crea un "gioco di ruolo": per OGNI battuta dell'ALTRO personaggio (quello che lo studente NON interpreta), fornisci in "turns" un turno con: la battuta dell'altro personaggio, e 3 possibili risposte per il personaggio dello studente — la risposta corretta deve essere ESATTAMENTE la battuta successiva del personaggio dello studente nel dialogo originale (campo "lines"), le altre 2 devono essere plausibili come frasi russe ma chiaramente sbagliate o fuori contesto in quel punto della conversazione.

Infine crea una domanda di comprensione sul contenuto del dialogo, con 3 opzioni.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"title":"titolo breve in russo","subtitle":"descrizione breve in italiano","characters":["Nome1","Nome2"],"userRole":"Nome1 o Nome2","lines":[{"speaker":"...","ru":"...","it":"..."}],"turns":[{"otherLine":{"speaker":"...","ru":"...","it":"..."},"options":[{"ru":"...","it":"...","correct":true},{"ru":"...","it":"...","correct":false},{"ru":"...","it":"...","correct":false}]}],"comprehension":{"question":"...","options":["...","...","..."],"correct":0}}

Importante: in ogni "options" dei turni, mescola l'ordine (la risposta corretta non deve essere sempre la prima). Il numero di "turns" deve corrispondere esattamente al numero di battute del personaggio interpretato dallo studente nel dialogo.`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.title || !parsed.lines || !parsed.turns || !parsed.turns.length || !parsed.comprehension) {
        throw new Error("Struttura incompleta.");
      }
      setCustomDialogues((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-dialogues", next);
        return next;
      });
    } catch (e) {
      setDialogueGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare il dialogo." }));
    } finally {
      setDialogueGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  const [customVerbs, setCustomVerbs] = useState({});
  const [verbGenLoading, setVerbGenLoading] = useState({});
  const [verbGenError, setVerbGenError] = useState({});

  useEffect(() => {
    (async () => {
      const v = await loadJSON("custom-verbs", {});
      setCustomVerbs(v);
    })();
  }, []);

  async function generateVerb(levelId) {
    setVerbGenLoading((s) => ({ ...s, [levelId]: true }));
    setVerbGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const existing = [...VERBS[levelId], ...(customVerbs[levelId] || [])].map((v) =>
        stripAccentMarks(v.imperfective ? `${v.imperfective.word}/${v.perfective.word}` : v.word)
      );
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Scegli UNA coppia aspettuale di verbi russi (un imperfettivo e il suo perfettivo corrispondente) adatta al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), diversa da queste già usate: ${existing.join(", ") || "nessuna"}.

Per ciascuno dei due verbi (imperfettivo e perfettivo), fornisci 3 forme rilevanti (es. presente-io, presente-tu, passato per l'imperfettivo; passato, futuro, imperativo per il perfettivo — scegli le forme più utili), ciascuna con una breve frase di esempio (4-8 parole) e la sua traduzione italiana che renda evidente la differenza di aspetto (es. "sto scrivendo" per l'imperfettivo, "ho scritto" per il perfettivo).

Includi anche un breve quiz situazionale: una frase italiana che richiede di scegliere l'aspetto corretto, con la frase russa giusta e una frase russa sbagliata (nell'aspetto opposto).

IMPORTANTE — accento tonico: in ogni "word" e "form", segna la sillaba accentata con il carattere Unicode U+0301 subito dopo la vocale accentata (non serve per parole di una sola sillaba, e non va messo dentro le frasi di esempio).

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"meaning_it":"traduzione italiana condivisa","note_it":"breve nota grammaticale sulla differenza di aspetto (1-2 frasi)","imperfective":{"word":"infinito imperfettivo con accento","forms":[{"label":"...","form":"...","example_ru":"...","example_it":"..."}]},"perfective":{"word":"infinito perfettivo con accento","forms":[{"label":"...","form":"...","example_ru":"...","example_it":"..."}]},"situational":{"prompt_it":"frase italiana che richiede di scegliere l'aspetto","options":[{"ru":"frase russa corretta","aspect":"imperfettivo|perfettivo"},{"ru":"frase russa nell'aspetto sbagliato","aspect":"imperfettivo|perfettivo"}],"correct":0}}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.imperfective || !parsed.perfective || !parsed.imperfective.forms?.length || !parsed.perfective.forms?.length) {
        throw new Error("Struttura incompleta.");
      }
      setCustomVerbs((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-verbs", next);
        return next;
      });
    } catch (e) {
      setVerbGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare il verbo." }));
    } finally {
      setVerbGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  const [customPhraseGroups, setCustomPhraseGroups] = useState({});
  const [phraseGenLoading, setPhraseGenLoading] = useState({});
  const [phraseGenError, setPhraseGenError] = useState({});
  const [repeatFlags, setRepeatFlags] = useState({});
  const [learnedPhrasePackages, setLearnedPhrasePackages] = useState({});
  const [learnedPackages, setLearnedPackages] = useState({});

  useEffect(() => {
    (async () => {
      const g = await loadJSON("custom-phrase-groups", {});
      setCustomPhraseGroups(g);
      const r = await loadJSON("repeat-flags", {});
      setRepeatFlags(r);
      const lp = await loadJSON("learned-phrase-packages", {});
      setLearnedPhrasePackages(lp);
      const lg = await loadJSON("learned-packages", {});
      setLearnedPackages(lg);
    })();
  }, []);

  // key generico: "sezione-livello-indice" (es. "casi-A1-3"), usato da Casi/Verbi/Aggettivi/Preposizioni/Componi
  function toggleLearnedPackage(key) {
    setLearnedPackages((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveJSON("learned-packages", next);
      return next;
    });
  }

  function toggleRepeatFlag(key) {
    setRepeatFlags((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveJSON("repeat-flags", next);
      return next;
    });
  }

  function toggleLearnedPhrasePackage(key) {
    setLearnedPhrasePackages((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveJSON("learned-phrase-packages", next);
      return next;
    });
  }

  function restartPhrasePackage(key) {
    setLearnedPhrasePackages((prev) => {
      const next = { ...prev, [key]: false };
      saveJSON("learned-phrase-packages", next);
      return next;
    });
    setRepeatFlags((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) {
        if (k.startsWith(key + "-")) delete next[k];
      }
      saveJSON("repeat-flags", next);
      return next;
    });
  }

  async function generatePhraseGroup(levelId, targetCase) {
    setPhraseGenLoading((s) => ({ ...s, [levelId]: true }));
    setPhraseGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const allGroups = [...PHRASE_GROUPS[levelId], ...(customPhraseGroups[levelId] || [])];
      const existingPatterns = allGroups.map((g) => g.pattern);
      const caseToUse = targetCase || leastRepresentedCase(allGroups.flatMap((g) => g.phrases.map((p) => p.ru)));
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea un gruppo di 5 frasi russe brevi che condividono la STESSA struttura grammaticale/lessicale (un pattern fisso con un elemento che cambia), adatto al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}). Questo aiuta la memorizzazione per ripetizione del pattern.

IMPORTANTE: tutte le 5 frasi devono usare il caso grammaticale russo "${caseToUse}" per il complemento principale del pattern (non al nominativo, a meno che il caso richiesto sia proprio "Nominativo").

Il pattern deve essere diverso da questi già usati: ${existingPatterns.join(" | ") || "nessuno"}.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"pattern":"il pattern con ___ al posto della parte variabile","pattern_it":"spiegazione breve del pattern in italiano","phrases":[{"ru":"...","it":"..."}]}

Devi fornire esattamente 5 frasi nell'array "phrases", tutte con la stessa struttura ma un elemento diverso, tutte al caso ${caseToUse}.`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.pattern || !parsed.phrases || parsed.phrases.length < 2) {
        throw new Error("Struttura incompleta.");
      }
      setCustomPhraseGroups((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-phrase-groups", next);
        return next;
      });
    } catch (e) {
      setPhraseGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare le frasi." }));
    } finally {
      setPhraseGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  const [customComposeGroups, setCustomComposeGroups] = useState({});
  const [composeGenLoading, setComposeGenLoading] = useState({});
  const [composeGenError, setComposeGenError] = useState({});

  useEffect(() => {
    (async () => {
      const c = await loadJSON("custom-compose-groups", {});
      setCustomComposeGroups(c);
    })();
  }, []);

  async function generateComposeGroup(levelId, targetCase) {
    setComposeGenLoading((s) => ({ ...s, [levelId]: true }));
    setComposeGenError((s) => ({ ...s, [levelId]: null }));
    try {
      const allGroups = [...COMPOSE_GROUPS[levelId], ...(customComposeGroups[levelId] || [])];
      const existingThemes = allGroups.map((g) => g.theme);
      const caseToUse = targetCase || leastRepresentedCase(allGroups.flatMap((g) => g.items.map((i) => i.ru)));
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea un gruppo di 9 frasi brevi su un tema comunicativo utile, adatto al livello CEFR ${levelId} (${LEVEL_DESCRIPTIONS[levelId]}), per un esercizio in cui lo studente vede la frase in ITALIANO e deve ricomporla in russo scegliendo le parole in ordine.

IMPORTANTE: tutte e 9 le frasi devono usare il caso grammaticale russo "${caseToUse}" per il complemento principale (non al nominativo, a meno che il caso richiesto sia proprio "Nominativo").

Il tema deve essere diverso da questi già usati: ${existingThemes.join(", ") || "nessuno"}.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"theme":"nome breve del tema in italiano","items":[{"it":"frase in italiano","ru":"traduzione russa corretta, con maiuscola iniziale e punteggiatura finale","tokens":["parole della frase russa in ordine sparso, punteggiatura attaccata alla parola precedente"]}]}

Fornisci ESATTAMENTE 9 elementi nell'array "items", in quest'ordine preciso: le prime 3 frasi affermative, le successive 3 negative, le ultime 3 interrogative — tutte sullo stesso tema, tutte al caso ${caseToUse}. Le frasi russe devono essere naturali e corrette per il livello indicato.`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.theme || !parsed.items || parsed.items.length < 2) {
        throw new Error("Struttura incompleta.");
      }
      setCustomComposeGroups((prev) => {
        const next = { ...prev, [levelId]: [...(prev[levelId] || []), parsed] };
        saveJSON("custom-compose-groups", next);
        return next;
      });
    } catch (e) {
      setComposeGenError((s) => ({ ...s, [levelId]: "Non sono riuscita a generare le frasi." }));
    } finally {
      setComposeGenLoading((s) => ({ ...s, [levelId]: false }));
    }
  }

  useEffect(() => {
    (async () => {
      const pr = await loadJSON("premium-tts", null);
      if (pr) setPremium(pr);
    })();
  }, []);

  function updatePremium(next) {
    setPremium((prev) => {
      const merged = { ...prev, ...next };
      saveJSON("premium-tts", merged);
      return merged;
    });
  }

  useEffect(() => {
    function refreshVoices() {
      const opts = getRuVoices();
      setVoiceOptions(opts);
    }
    refreshVoices();
    if (TTS_SUPPORTED) window.speechSynthesis.onvoiceschanged = refreshVoices;
  }, []);

  useEffect(() => {
    (async () => {
      const t = await loadJSON("tts-settings", null);
      if (t) setTtsSettings(t);
    })();
  }, []);

  function updateTtsSettings(next) {
    setTtsSettings((prev) => {
      const merged = { ...prev, ...next };
      saveJSON("tts-settings", merged);
      return merged;
    });
  }

  useEffect(() => {
    (async () => {
      const p = await loadJSON("progress", { completed: [], started: [], streak: 0, lastActive: null });
      // Compatibilità con dati salvati prima dell'introduzione del campo "started"
      // (lezioni aperte ma non completate) — senza questo, un utente che aggiorna
      // l'app da una versione precedente avrebbe "progress.started" undefined
      // ovunque, invece di un array vuoto.
      if (!Array.isArray(p.started)) p.started = [];
      const v = await loadJSON("vocab-box", {});
      const eh = await loadJSON("easy-hard-counts", { easy: 0, hard: 0 });
      // Nell'anteprima artifact di Claude.ai (IS_ARTIFACT_ENV) la pagina di benvenuto
      // deve comparire SEMPRE, ad ogni apertura — per poterla mostrare/testare senza
      // dover cancellare a mano lo storage salvato da un'apertura precedente della
      // stessa anteprima. Nell'app vera (pubblicata, Capacitor o browser) il flag resta
      // persistente come deve essere: mostrata solo al primissimo avvio del dispositivo.
      const onboardingDone = IS_ARTIFACT_ENV ? false : await loadJSON("onboarding-done", false);
      setProgress(p);
      setVocabBox(v);
      setEasyHardCounts(eh);
      // Obiettivi settimanali: fissa un "punto di partenza" (parole imparate,
      // scambi in conversazione) all'inizio di ogni settimana, per poi mostrare la
      // differenza rispetto al valore attuale come progresso settimanale — usa p/v
      // già caricati qui (non gli state React, che non sarebbero ancora aggiornati
      // in modo sincrono a questo punto), per non fissare per errore un punto di
      // partenza a zero prima che il vero progresso salvato sia disponibile.
      const currentMonday = mondayOfWeek(new Date());
      const savedBaseline = await loadJSON("weekly-goals-baseline", null);
      const masteredNow = Object.values(v).filter((b) => b >= 5).length;
      if (!savedBaseline || savedBaseline.weekStart !== currentMonday) {
        const nextBaseline = { weekStart: currentMonday, masteredCountStart: masteredNow, conversationTurnsStart: p.conversationTurns || 0 };
        await saveJSON("weekly-goals-baseline", nextBaseline);
        setWeeklyBaseline(nextBaseline);
      } else {
        setWeeklyBaseline(savedBaseline);
      }
      setShowOnboarding(!onboardingDone);
      if (!onboardingDone) {
        // la matrioska dell'onboarding va animata QUI, non al mount generico dell'app:
        // quel trigger (poco sopra) scatta e finisce prima che questo controllo asincrono
        // si risolva, quindi quando la pagina di benvenuto appare davvero l'animazione
        // era già terminata — da qui il "non è animata" segnalato.
        setDollWobble(true);
        setTimeout(() => setDollWobble(false), 1000);
      }
      setReady(true);
    })();
  }, []);

  function completeOnboarding(choice) {
    // Aggiorna subito la UI (niente await prima): su dispositivo reale il salvataggio
    // passa per il filesystem di Capacitor, una vera scrittura su disco che può
    // richiedere qualche centinaio di millisecondi — se il tocco dell'utente doveva
    // aspettare quel tempo prima che la schermata cambiasse, il gesto sembrava "non
    // fare niente" e un secondo tocco nel frattempo poteva far atterrare altrove.
    // Il salvataggio del flag "onboarding-done" parte comunque, solo non blocca più
    // la transizione visiva.
    saveJSON("onboarding-done", true);
    setShowOnboarding(false);
    setActiveSector(null);
    if (choice === "beginner") {
      // apre direttamente la sezione Lezioni (bypassando le 4 macrosezioni, per non
      // costringere chi parte da zero a orientarsi tra Impara/Pratica/Programma/Lezioni),
      // ma SENZA saltare dentro A1: openLevel resta null così la prima cosa che vede è
      // la schermata con la matrioska per livelli, dove sceglie lui stesso da dove partire.
      setActiveSector("lezioni");
      setOpenLevel(null);
    } else if (choice === "placement") {
      setActiveSector(null);
      setView("placement");
    }
  }

  const bumpStreak = useCallback(async () => {
    setProgress((prev) => {
      const t = todayStr();
      if (prev.lastActive === t) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      const currentMonth = t.slice(0, 7);
      let freezes = prev.streakFreezes ?? 2;
      // le "riserve" di congelamento si rinnovano ogni mese, così l'utente ne ha sempre
      // un paio a disposizione senza doverle guadagnare — l'obiettivo non è un premio,
      // ma evitare che saltare UN giorno per stanchezza cancelli settimane di costanza.
      if (prev.streakFreezeMonth !== currentMonth) freezes = 2;
      let streak = prev.streak;
      let usedFreeze = false;
      if (prev.lastActive === yesterday) {
        streak = prev.streak + 1;
      } else if (prev.lastActive === twoDaysAgo && freezes > 0) {
        // esattamente un giorno saltato: consuma un congelamento invece di azzerare la serie
        streak = prev.streak + 1;
        freezes -= 1;
        usedFreeze = true;
      } else {
        streak = 1;
      }
      const next = {
        ...prev,
        streak,
        lastActive: t,
        streakFreezes: freezes,
        streakFreezeMonth: currentMonth,
        lastFreezeUsed: usedFreeze ? t : prev.lastFreezeUsed,
      };
      saveJSON("progress", next);
      // Solo quando la serie si allunga davvero (non al primo giorno assoluto,
      // dove streak parte da 1 senza un giorno precedente da "estendere").
      if (streak > prev.streak) {
        playStreakBellSound();
        if (streak % 7 === 0) {
          setConfettiBurst(true);
          setTimeout(() => setConfettiBurst(false), 2200);
        }
        if (usedFreeze) {
          // Rinforzo distinto dal traguardo settimanale: il congelamento ha
          // protetto la serie in silenzio finora — questo lampo lo rende visibile,
          // così l'utente capisce PERCHÉ la serie non si è azzerata.
          setFreezeUsedFlash(true);
          setTimeout(() => setFreezeUsedFlash(false), 1800);
        }
      }
      return next;
    });
  }, []);

  // Contatore persistente degli scambi in "Conversazione libera" — nessuna logica di
  // data/serie qui, solo un incremento semplice ad ogni risposta riuscita, salvato
  // nello stesso oggetto progress già usato per streak/lezioni/congelamenti.
  const bumpConversationTurns = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, conversationTurns: (prev.conversationTurns || 0) + 1 };
      saveJSON("progress", next);
      return next;
    });
  }, []);

  const completeLesson = useCallback(
    (lessonId) => {
      setProgress((prev) => {
        if (prev.completed.includes(lessonId)) return prev;
        const next = { ...prev, completed: [...prev.completed, lessonId], started: prev.started.filter((id) => id !== lessonId) };
        saveJSON("progress", next);
        // Suono "apertura matrioska" SOLO al vero traguardo (ultima lezione del
        // livello), non ad ogni singola lezione — altrimenti perderebbe di
        // significato. Il livello si deduce dal prefisso dell'id (es. "a1-3",
        // "a1-gen-..."), coerente con come vengono generati gli id altrove.
        const levelId = (lessonId.split("-")[0] || "").toUpperCase();
        const levelLessons = allLessonsFor(levelId);
        if (levelId && levelLessons.length > 0) {
          const wasComplete = levelLessons.every((l) => prev.completed.includes(l.id));
          const isNowComplete = levelLessons.every((l) => next.completed.includes(l.id));
          if (!wasComplete && isNowComplete) {
            playLevelCompleteSound();
            setLevelCompleteCelebration(levelId);
          }
        }
        return next;
      });
      bumpStreak();
    },
    [bumpStreak]
  );

  const allVocab = [...Object.values(LESSONS).flat(), ...Object.values(generatedLessons).flat()].flatMap((l) =>
    (l.vocab || []).map((v) => ({ ...v, key: `${l.id}:${v.ru}` }))
  );

  const verbPairsDeck = Object.keys(VERBS).flatMap((level) =>
    [...VERBS[level], ...(customVerbs[level] || [])]
      .filter((v) => v.imperfective)
      .map((v, i) => ({ ...v, level, key: `${level}-verbpair-${i}` }))
  );

  const deck = allVocab.length ? allVocab : [];
  const sortedDeck = [...deck].sort((a, b) => (vocabBox[a.key] || 1) - (vocabBox[b.key] || 1));
  const learningDeck = sortedDeck.filter((c) => (vocabBox[c.key] || 1) < 5);
  const masteredDeck = sortedDeck.filter((c) => (vocabBox[c.key] || 1) >= 5);
  const filteredDeck = cardFilter === "mastered" ? masteredDeck : cardFilter === "learning" ? learningDeck : sortedDeck;

  function markVerbPairDifficulty(kind) {
    setEasyHardCounts((prev) => {
      const next = { ...prev, [kind]: (prev[kind] || 0) + 1 };
      saveJSON("easy-hard-counts", next);
      return next;
    });
    if (kind === "easy") bumpStreak();
  }

  function reviewCard(delta) {
    const card = filteredDeck[cardIndex % (filteredDeck.length || 1)];
    if (!card) return;
    setVocabBox((prev) => {
      const cur = prev[card.key] || 1;
      const next = { ...prev, [card.key]: Math.max(1, Math.min(5, cur + delta)) };
      saveJSON("vocab-box", next);
      return next;
    });
    if (delta === -1 || delta === 2) {
      setEasyHardCounts((prev) => {
        const next = { ...prev, [delta === 2 ? "easy" : "hard"]: (prev[delta === 2 ? "easy" : "hard"] || 0) + 1 };
        saveJSON("easy-hard-counts", next);
        return next;
      });
    }
    setFlipped(false);
    setCardIndex((i) => i + 1);
    if (delta > 0) bumpStreak();
  }

  function toggleMastered() {
    const card = filteredDeck[cardIndex % (filteredDeck.length || 1)];
    if (!card) return;
    const cur = vocabBox[card.key] || 1;
    const wasMastered = cur >= 5;
    setVocabBox((prev) => {
      const next = { ...prev, [card.key]: wasMastered ? 1 : 5 };
      saveJSON("vocab-box", next);
      return next;
    });
    setFlipped(false);
    setCardIndex((i) => i + 1);
    if (!wasMastered) bumpStreak();
  }

  const [sessionLevel, setSessionLevel] = useState(null);
  const [sessionSteps, setSessionSteps] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);

  async function saveSession(levelId, steps) {
    const history = await loadJSON("session-history", []);
    const entry = {
      id: `session-${Date.now()}`,
      level: levelId,
      steps,
      completedAt: Date.now(),
    };
    const next = [entry, ...history].slice(0, 100);
    await saveJSON("session-history", next);
    setSessionSaved(true);
  }

  function generateSession(levelId) {
    setSessionSaved(false);
    const steps = [];

    const levelDeck = learningDeck.filter((c) => levelFromId(c.key.split(":")[0]) === levelId);
    const cardPool = levelDeck.length ? levelDeck : sortedDeck.filter((c) => levelFromId(c.key.split(":")[0]) === levelId);
    const usedCardKeys = new Set();
    for (let i = 0; i < 3; i++) {
      const remaining = cardPool.filter((c) => !usedCardKeys.has(c.key));
      const card = pickRandom(remaining);
      if (card) {
        usedCardKeys.add(card.key);
        steps.push({ type: "flashcard", card });
      }
    }

    const phraseGroupsAll = [...PHRASE_GROUPS[levelId], ...(customPhraseGroups[levelId] || [])];
    const allPhrases = phraseGroupsAll.flatMap((g) => g.phrases.map((p) => ({ ...p, pattern: g.pattern })));
    const usedPhrases = new Set();
    for (let i = 0; i < 3; i++) {
      const remaining = allPhrases.filter((p) => !usedPhrases.has(p.ru));
      const phrase = pickRandom(remaining);
      if (phrase) {
        usedPhrases.add(phrase.ru);
        steps.push({ type: "phrase", ...phrase });
      }
    }

    const composeGroupsAll = [...COMPOSE_GROUPS[levelId], ...(customComposeGroups[levelId] || [])];
    const allComposeItems = composeGroupsAll.flatMap((g) => g.items);
    const usedCompose = new Set();
    for (let i = 0; i < 3; i++) {
      const remaining = allComposeItems.filter((c) => !usedCompose.has(c.ru));
      const composeItem = pickRandom(remaining);
      if (composeItem) {
        usedCompose.add(composeItem.ru);
        steps.push({ type: "compose", item: composeItem });
      }
    }

    const nounsAll = [...DECLENSIONS[levelId], ...(customNouns[levelId] || [])];
    const usedNouns = new Set();
    for (let i = 0; i < 3; i++) {
      const remaining = nounsAll.filter((n) => !usedNouns.has(n.word));
      const noun = pickRandom(remaining);
      if (noun) {
        usedNouns.add(noun.word);
        const c = pickRandom(noun.cases);
        steps.push({ type: "declension", word: noun.word, meaning_it: noun.meaning_it, case: c.case, form: c.form, example: c.examples.aff });
      }
    }

    const verbsAll = [...VERBS[levelId], ...(customVerbs[levelId] || [])];
    const usedVerbs = new Set();
    for (let i = 0; i < 3; i++) {
      const remaining = verbsAll.filter((v) => !usedVerbs.has(v.imperfective.word));
      const verb = pickRandom(remaining);
      if (verb) {
        usedVerbs.add(verb.imperfective.word);
        const aspectMember = pickRandom([verb.imperfective, verb.perfective]);
        const f = pickRandom(aspectMember.forms);
        steps.push({ type: "verb", word: aspectMember.word, meaning_it: verb.meaning_it, label: f.label, form: f.form, example_ru: f.example_ru, example_it: f.example_it });
      }
    }

    setSessionLevel(levelId);
    setSessionSteps(steps);
    setSessionIndex(0);
  }

  async function requestFeedback(lesson) {
    setFeedbackLoading(true);
    setFeedback(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua, gentile e naturale. Uno studente italiano di livello intermedio ha letto questo dialogo:
${lesson.story.map((s) => s.ru).join(" ")}

Consegna: "${lesson.production}"

Risposta dello studente: "${answer}"

Correggi come farebbe un genitore con un bambino: ripeti la frase in modo naturale e corretto, senza elencare regole grammaticali pedanti. Poi aggiungi una riga di incoraggiamento in italiano.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"corrected":"...","note_it":"...","encouragement_it":"..."}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.corrected && !parsed.note_it) {
        throw new Error("Struttura incompleta nella risposta.");
      }
      setFeedback(parsed);
    } catch (e) {
      setFeedback({
        corrected: "",
        note_it: "Non sono riuscita a correggere il testo in questo momento. Riprova.",
        encouragement_it: "Non è un problema del testo che hai scritto — riprova più tardi.",
      });
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function requestProductionHint(lesson) {
    setProductionHintLoading(true);
    setProductionHintError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Per questa consegna di produzione libera: "${lesson.production}" (vocabolario della lezione: ${lesson.vocab.map((v) => v.ru).join(", ")}), scrivi l'INIZIO di una possibile frase russa che risponda alla consegna, lasciando l'ultima parte da completare allo studente. L'inizio deve essere abbastanza lungo da dare un aiuto concreto (almeno metà della frase), ma lasciare comunque qualcosa di significativo da scrivere.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"starter":"l'inizio della frase in russo, che finisce a metà di un pensiero, SENZA punto finale"}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.starter) throw new Error("Struttura incompleta.");
      setProductionHint(parsed.starter);
      setAnswer((a) => (a.trim() ? a : parsed.starter + " "));
    } catch (e) {
      // Prima l'errore veniva assorbito senza mostrare nulla: se la richiesta falliva
      // (backend non raggiungibile, connessione assente, chiave API non configurata…)
      // l'utente vedeva il pulsante tornare normale senza alcuna spiegazione, dando
      // l'impressione che non facesse nulla. Ora l'errore è mostrato esplicitamente.
      setProductionHintError("Non riesco a generare un aiuto in questo momento. Verifica la connessione e riprova, oppure scrivi liberamente senza aiuto.");
    } finally {
      setProductionHintLoading(false);
    }
  }

  const masteredCount = Object.values(vocabBox).filter((b) => b >= 5).length;
  const anySectionActive = view !== "home" || showTextSizePanel || showDevPanel;
  function navBtnStyle(borderColor, isActive) {
    return {
      background: isActive ? `${borderColor}33` : "none",
      border: `1px solid ${borderColor}`,
      borderRadius: 20,
      padding: "6px 8px",
      color: "#F0EAD8",
      fontSize: TEXT_SIZES.bodyLarge,
      lineHeight: 1.3,
      cursor: "pointer",
      opacity: !anySectionActive || isActive ? 1 : 0.35,
      transition: "opacity 0.15s ease, background 0.15s ease",
    };
  }

  return (
    <div
      className="matryoshka-bg"
      style={{
        fontFamily: "'PT Sans', sans-serif",
        background: "#0039A6",
        minHeight: "100vh",
        color: "#F0EAD8",
        position: "relative",
        zoom: textScale,
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }
        #root {
          overflow-x: hidden;
          width: 100%;
        }
        .display { font-family: 'PT Serif', serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes openDoll { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .doll-open { animation: openDoll 0.25s ease-out; }
        @keyframes dollWobble {
          0% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-6deg) scale(1.03); }
          30% { transform: rotate(5deg) scale(1.03); }
          45% { transform: rotate(-3deg) scale(1.01); }
          60% { transform: rotate(2deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .doll-wobble { animation: dollWobble 0.9s ease-in-out; transform-origin: 50% 85%; }
        /* Piccola oscillazione perenne e leggera per la matrioska della pagina di
           benvenuto — a differenza di doll-wobble (un impulso una tantum all'apertura),
           questa resta "viva" per tutto il tempo che l'utente ci sta sopra, senza mai
           distrarre dal testo (ampiezza minima, ritmo lento). */
        @keyframes dollBreathe {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-2deg) scale(1.015); }
        }
        .doll-breathe { animation: dollBreathe 3.2s ease-in-out infinite; transform-origin: 50% 85%; }
        /* Impilamento a cascata per la griglia matrioske dei livelli: ogni bambola
           entra con un lieve ritardo scalato (vedi animationDelay inline), dal più
           grande (C2) al più piccolo (A1), come se si annidassero una nell'altra. */
        @keyframes dollCascadeIn {
          from { transform: scale(0.7) translateY(14px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .doll-cascade-in { animation: dollCascadeIn 0.38s cubic-bezier(0.34, 1.4, 0.64, 1) backwards; }
        /* Brillio diagonale che attraversa le card statistiche in "Il tuo percorso" —
           un lampo UNA VOLTA sola all'apertura, sincronizzato con l'entrata a cascata
           delle card, non un loop continuo che distrarrebbe. */
        @keyframes statShimmer {
          from { transform: translateX(-120%) skewX(-20deg); opacity: 0; }
          40% { opacity: 0.5; }
          to { transform: translateX(220%) skewX(-20deg); opacity: 0; }
        }
        .stat-shimmer {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(240,234,216,0.25), transparent);
          animation: statShimmer 0.9s ease-out forwards;
          pointer-events: none;
        }
        /* Anello sonoro specifico per i pulsanti "Ascolta" (35 occorrenze in tutta
           l'app) — un cerchio che si espande dai bordi, distinto dall'onda generica
           già su ogni pulsante, per dare un feedback "acustico" al tocco. Selettore
           CSS puro sull'attributo aria-label: nessuna modifica al JSX in nessuno dei
           35 punti, zero rischio strutturale. */
        @keyframes soundRingPulse {
          from { box-shadow: 0 0 0 0 rgba(217,164,65,0.5); }
          to { box-shadow: 0 0 0 10px rgba(217,164,65,0); }
        }
        button[aria-label^="Ascolta"]:not(:disabled):active {
          animation: soundRingPulse 0.5s ease-out;
        }
        /* Piccolo "scatto" all'entrata per il lucchetto della schermata paywall —
           non un ciclo continuo (sarebbe fastidioso per un elemento sempre visibile
           mentre l'utente guarda il paywall), solo un breve movimento quando compare. */
        @keyframes lockSnapIn {
          0% { transform: scale(0.7) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .lock-snap-in { display: inline-block; animation: lockSnapIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
        /* Linea che "si disegna" tra le card dei giorni nel Programma — cresce
           verticalmente da 0 alla sua altezza finale invece di apparire già intera. */
        @keyframes programmaConnectorGrow {
          from { height: 0; }
          to { height: 12px; }
        }
        .programma-connector { animation: programmaConnectorGrow 0.3s ease-out; }
        /* Entrata del contenuto quando una flashcard viene "girata" — un breve
           schiacciamento verticale che simula il momento del capovolgimento, seguito
           dal contenuto che si assesta, invece di apparire di colpo. */
        @keyframes cardFlipIn {
          from { transform: scaleY(0.85); opacity: 0; }
          to { transform: scaleY(1); opacity: 1; }
        }
        .card-flip-in { animation: cardFlipIn 0.22s ease-out; transform-origin: 50% 0%; }
        /* Pulsare delicato sul badge "da ripassare": un lieve respiro di scala/ombra,
           per attirare l'attenzione senza essere fastidioso o distrarre dal resto. */
        @keyframes reviewBadgePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(193,84,60,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(193,84,60,0); }
        }
        .review-badge-pulse { animation: reviewBadgePulse 2.2s ease-in-out infinite; }
        /* Lampo dorato sul badge serie quando un congelamento viene consumato per
           proteggere la serie da un giorno saltato — rende visibile un evento che
           altrimenti passerebbe inosservato (il numero della serie sale comunque
           normalmente, senza questo lampo l'utente non capirebbe perché). */
        @keyframes freezeFlashGold {
          0%, 100% { background: transparent; }
          50% { background: rgba(217,164,65,0.35); }
        }
        .freeze-flash-gold { animation: freezeFlashGold 0.6s ease-in-out 3; }
        /* Leggero tremore della mascotte in header per il feedback "risposta
           sbagliata" — un piccolo scatto orizzontale, breve e non invadente, in
           aggiunta all'alone rosso già presente su mascotGlow==="wrong". */
        @keyframes mascotShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        .mascot-shake { animation: mascotShake 0.4s ease-in-out; }
        .doll-wobble.mascot-shake { animation: dollWobble 0.9s ease-in-out, mascotShake 0.4s ease-in-out; }
        .doll-breathe.mascot-shake { animation: dollBreathe 3.2s ease-in-out infinite, mascotShake 0.4s ease-in-out; }
        /* Lieve tremolio continuo sull'icona fiamma della serie, per farla sembrare
           viva invece che un'icona statica — scala e rotazione minime, mai vistose. */
        @keyframes flameFlicker {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.08) rotate(-3deg); }
          50% { transform: scale(0.96) rotate(2deg); }
          75% { transform: scale(1.05) rotate(-1deg); }
        }
        .flame-flicker { animation: flameFlicker 1.8s ease-in-out infinite; transform-origin: 50% 90%; }
        /* Fiamma più vivace per serie di 7+ giorni — stessa animazione base, ma con
           un'ampiezza leggermente maggiore, per dare un piccolo segnale visivo di
           "quanto è cresciuta" la costanza, senza introdurre un'animazione nuova. */
        @keyframes flameFlickerStrong {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.14) rotate(-5deg); }
          50% { transform: scale(0.94) rotate(3deg); }
          75% { transform: scale(1.1) rotate(-2deg); }
        }
        .flame-flicker-strong { animation: flameFlickerStrong 1.6s ease-in-out infinite; transform-origin: 50% 90%; }
        /* Lampo dorato che pulsa sui bordi dello schermo durante la celebrazione di
           livello completato — un tocco cerimonioso in più, discreto ma percepibile. */
        @keyframes celebrationBorderFlash {
          0%, 100% { box-shadow: inset 0 0 0px rgba(217,164,65,0); }
          50% { box-shadow: inset 0 0 60px rgba(217,164,65,0.55); }
        }
        .celebration-border-flash { animation: celebrationBorderFlash 1.6s ease-in-out 3; }
        /* Caduta dei coriandoli per il punteggio perfetto in un test — cadono con una
           leggera rotazione, sfumando verso la fine del percorso. */
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(540deg); opacity: 0; }
        }
        /* Scoppio di stelline quando si segna una flashcard come imparata — un
           piccolo premio localizzato, distinto dai coriandoli (che festeggiano un
           punteggio perfetto) e dalla celebrazione livello (traguardo più grande). */
        @keyframes sparkleBurst {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          40% { transform: translateY(-18px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-32px) scale(0.8); opacity: 0; }
        }
        /* Piccola vibrazione della notina musicale quando il sottofondo ambientale è
           attivo — richiama una corda pizzicata: oscillazione ampia iniziale che si
           smorza, poi si ripete a intervalli, invece di restare ferma. */
        @keyframes musicNoteVibrate {
          0%, 60%, 100% { transform: rotate(0deg); }
          5% { transform: rotate(-14deg); }
          15% { transform: rotate(10deg); }
          25% { transform: rotate(-6deg); }
          35% { transform: rotate(3deg); }
          45% { transform: rotate(-1deg); }
        }
        .music-note-vibrate { display: inline-block; animation: musicNoteVibrate 2.4s ease-out infinite; transform-origin: 50% 80%; }
        /* Rivelazione "a macchina da scrivere" del testo russo mentre una battuta di
           dialogo viene riprodotta ad alta voce: un velo si ritira da sinistra a destra
           man mano che la lettura procede, senza dover toccare il componente EditableSentence
           sottostante (che resta identico, solo temporaneamente coperto e poi svelato). */
        @keyframes typewriterReveal {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .typewriter-reveal { animation: typewriterReveal 1.1s steps(24, end) forwards; transform-origin: left; }
        /* Apertura di una lezione: invece della rotazione generica già usata per gli
           altri cambi di sezione, qui il contenuto "emerge dal centro" crescendo — come
           una bambola più piccola che esce da quella che la conteneva. */
        @keyframes lessonNestIn {
          from { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.02); opacity: 1; }
          to { transform: scale(1); opacity: 1; }
        }
        .lesson-nest-in { animation: lessonNestIn 0.32s cubic-bezier(0.34, 1.2, 0.64, 1); transform-origin: 50% 20%; }
        /* Puntini pulsanti per LoadingDots — un accenno di movimento continuo durante
           le generazioni IA, invece di un testo statico immobile. */
        @keyframes loadingDotPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
        /* Transizione tra sezioni che richiama l'apertura di una matrioska: una
           leggera rotazione + scala in entrata invece di un cambio di vista secco.
           Applicata al contenitore dell'intera vista attiva (vedi key={view}) — scatta
           solo quando si passa DAVVERO a una vista diversa, non ad ogni re-render. */
        @keyframes viewTransitionIn {
          from { transform: rotate(-4deg) scale(0.96); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .view-transition-in { animation: viewTransitionIn 0.28s ease-out; }
        .doll-wobble.doll-breathe { animation: dollWobble 0.9s ease-in-out, dollBreathe 3.2s ease-in-out infinite; }
        button { font-family: inherit; }
        /* Feedback tattile leggero su OGNI pulsante dell'app (non solo quelli con
           .btn-3d, che ha già il suo effetto più marcato) — un piccolo "schiacciamento"
           al tocco rende l'intera interfaccia più viva e reattiva, senza dover toccare
           i singoli componenti uno per uno. */
        button:not(:disabled):active {
          transform: scale(0.96);
        }
        /* Effetto "onda" al tocco, puramente CSS: un cerchio dorato che si espande
           dal centro del pulsante e sfuma, dando un feedback visivo in più oltre al
           semplice schiacciamento. Non segue il punto esatto del dito (richiederebbe
           un listener JS globale su ogni click dell'app, rischioso su questa scala) —
           un'approssimazione onesta ma sicura dello stesso effetto. */
        button {
          position: relative;
          overflow: hidden;
        }
        button::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(217,164,65,0.35);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        button:not(:disabled):active::after {
          animation: buttonRipple 0.45s ease-out;
        }
        @keyframes buttonRipple {
          from { width: 0; height: 0; opacity: 1; }
          to { width: 220%; height: 220%; opacity: 0; }
        }
        button {
          transition: transform 0.08s ease;
        }
        ::selection { background: #D9A441; color: #1B2430; }
        .btn-3d {
          box-shadow: 0 3px 0 rgba(0,0,0,0.35), 0 4px 6px rgba(0,0,0,0.25);
          transform: translateY(0);
          transition: transform 0.08s ease, box-shadow 0.08s ease;
        }
        .btn-3d:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2);
        }
        .magic-wand-btn {
          position: relative;
          background: linear-gradient(135deg, #2A1F4D 0%, #4A2F6D 50%, #2A1F4D 100%);
          border: 1px solid #B98FE0;
          border-radius: 10px;
          padding: 8px 12px;
          color: #E9D5FF;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(185, 143, 224, 0.35), inset 0 0 6px rgba(233, 213, 255, 0.15);
          transition: transform 0.15s ease, box-shadow 0.2s ease;
          overflow: visible;
        }
        .magic-wand-btn:not(:disabled):hover {
          box-shadow: 0 0 14px rgba(185, 143, 224, 0.6), inset 0 0 8px rgba(233, 213, 255, 0.25);
          transform: translateY(-1px) rotate(-4deg);
        }
        .magic-wand-btn:not(:disabled):active {
          transform: translateY(0) rotate(2deg) scale(0.94);
        }
        .magic-wand-btn:disabled {
          opacity: 0.35;
          box-shadow: none;
          cursor: default;
        }
        .magic-wand-btn::after {
          content: "✨";
          position: absolute;
          top: -6px;
          right: -4px;
          font-size: 11px;
          animation: magic-sparkle 1.8s ease-in-out infinite;
        }
        .magic-wand-btn:disabled::after {
          animation: none;
          opacity: 0;
        }
        @keyframes magic-sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.85) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(15deg); }
        }
        .flag-corner {
          position: relative;
        }
        .flag-corner::before,
        .flag-corner::after {
          content: "";
          position: absolute;
          bottom: 0;
          width: 34px;
          height: 34px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.85;
        }
        .flag-corner::before {
          left: 0;
          background: linear-gradient(225deg, #FFFFFF 0%, #FFFFFF 33%, #0039A6 33%, #0039A6 66%, #B5281C 66%, #B5281C 100%);
          clip-path: polygon(0 100%, 100% 100%, 0 0);
          border-radius: 0 0 0 18px;
        }
        .flag-corner::after {
          right: 0;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 33%, #0039A6 33%, #0039A6 66%, #B5281C 66%, #B5281C 100%);
          clip-path: polygon(100% 100%, 0 100%, 100% 0);
          border-radius: 0 0 18px 0;
        }
        .matryoshka-bg::before {
          content: "";
          position: fixed;
          top: -10%;
          bottom: -10%;
          left: 50%;
          width: 520px;
          max-width: 100vw;
          transform: translateX(-50%) scale(1.08);
          background:
            repeating-linear-gradient(
              112deg,
              rgba(255,255,255,0.14) 0px,
              rgba(255,255,255,0.14) 60px,
              rgba(0,0,0,0.10) 60px,
              rgba(0,0,0,0.10) 130px
            ),
            linear-gradient(158deg, #FFFFFF 6%, #0039A6 46%, #B5281C 88%);
          background-blend-mode: overlay;
          filter: blur(30px);
          opacity: 0.8;
          pointer-events: none;
          z-index: 0;
        }
        .matryoshka-bg::after {
          content: "";
          position: fixed;
          inset: 0;
          background-color: #0A1F4D;
          background-image: url("${MATRYOSHKA_PATTERN_URI}");
          background-repeat: repeat;
          background-size: 130px 170px;
          opacity: 0.22;
          pointer-events: none;
          z-index: 0;
        }
        /* margine di sicurezza per tacca/isola dinamica su iPhone — attivo solo dove il
           dispositivo lo richiede davvero (env() risulta 0 su desktop/Android normali) */
        header {
          padding-top: calc(26px + env(safe-area-inset-top, 0px)) !important;
        }
        /* Neve ambientale opzionale (❄️): ogni fiocco cade dall'alto verso il basso
           con una leggera oscillazione laterale, poi scompare e ricomincia in loop —
           puramente decorativo, mai un ostacolo al tocco (vedi pointer-events sotto). */
        @keyframes snowFall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% { transform: translateY(110vh) translateX(var(--drift, 20px)); opacity: 0; }
        }
        /* Pioggia di coriandoli, una tantum: cade e ruota, poi svanisce — usata per il
           traguardo settimanale della serie (vedi confettiBurst), si esaurisce da sola
           senza richiedere alcuna interazione dell'utente. */
        @keyframes confettiFall {
          0% { transform: translateY(-5vh) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(var(--spin, 360deg)); opacity: 0; }
        }
      `}</style>

      {confettiBurst && (
        <div
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 260, pointerEvents: "none", overflow: "hidden" }}
        >
          {CONFETTI_PARTICLES.map((c) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: `${c.left}%`,
                top: 0,
                width: c.size,
                height: c.size * 0.4,
                background: c.color,
                borderRadius: 2,
                "--drift": `${c.drift}px`,
                "--spin": `${c.spin}deg`,
                animation: `confettiFall ${c.duration}s ease-in ${c.delay}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      {snowOn && (
        <div
          aria-hidden="true"
          style={{ position: "fixed", inset: 0, zIndex: 250, pointerEvents: "none", overflow: "hidden" }}
        >
          {SNOWFLAKES.map((f) => (
            <div
              key={f.id}
              style={{
                position: "absolute",
                left: `${f.left}%`,
                top: 0,
                fontSize: f.size,
                color: "#F0EAD8",
                opacity: 0.85,
                "--drift": `${f.drift}px`,
                animation: `snowFall ${f.duration}s linear ${f.delay}s infinite`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {isOffline && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 102,
            background: "#C1543C",
            color: "#F0EAD8",
            textAlign: "center",
            padding: "calc(6px + env(safe-area-inset-top, 0px)) 12px 6px",
            fontSize: TEXT_SIZES.body,
            fontWeight: 700,
          }}
        >
          📡 Sei offline — i tuoi progressi restano salvati sul dispositivo e si sincronizzeranno da soli quando torni online.
        </div>
      )}

      {showFreezeNotice && (
        <div
          style={{
            position: "fixed",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 101,
            background: "#5B84B1",
            border: "1px solid #F0EAD8",
            borderRadius: 14,
            padding: "12px 20px",
            color: "#F0EAD8",
            fontWeight: 700,
            fontSize: TEXT_SIZES.emphasisLarge,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            maxWidth: "90vw",
          }}
        >
          ❄️ Serie salvata! Hai saltato un giorno, ma ho usato un congelamento — la tua costanza resta intatta.
        </div>
      )}

      {showOnboarding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            // Sfondo pieno e AUTONOMO, non trasparente: replica esattamente lo stesso
            // gradiente e motivo di matrioske della Home (vedi .matryoshka-bg qui sotto),
            // ma dipinto sul proprio livello opaco — così l'aspetto è identico, senza però
            // lasciar trasparire i pulsanti e i testi veri della Home dietro (che creavano
            // l'effetto di "doppia schermata sovrapposta").
            backgroundColor: "#0A1F4D",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-10%",
              bottom: "-10%",
              left: "50%",
              width: 520,
              maxWidth: "100vw",
              transform: "translateX(-50%) scale(1.08)",
              background:
                "repeating-linear-gradient(112deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 60px, rgba(0,0,0,0.10) 60px, rgba(0,0,0,0.10) 130px)," +
                "linear-gradient(158deg, #FFFFFF 6%, #0039A6 46%, #B5281C 88%)",
              backgroundBlendMode: "overlay",
              filter: "blur(30px)",
              opacity: 0.8,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${MATRYOSHKA_PATTERN_URI}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "130px 170px",
              opacity: 0.22,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img
            src={MATRYOSHKA_LABELED_ICON_URI}
            alt="Матрёшка Мариса"
            className={`doll-breathe${dollWobble ? " doll-wobble" : ""}`}
            style={{ width: 140, height: "auto", marginBottom: 16 }}
          />
          <h1 className="display" style={{ fontSize: TEXT_SIZES.sectionTitleXL, fontWeight: 700, marginBottom: 10 }}>
            Добро пожаловать!
          </h1>
          <p style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.75, marginBottom: 32, maxWidth: 340 }}>
            Benvenuto in Матрёшка Мариса. Una domanda veloce per iniziare bene:
          </p>
          <p style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700, marginBottom: 20 }}>
            Hai mai studiato russo prima?
          </p>

          <div style={{ marginBottom: 24 }}>
            {devUnlocked ? (
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.7 }}>✓ Accesso sviluppatore attivo</div>
            ) : !showOnboardingCodeInput ? (
              <button
                onClick={() => setShowOnboardingCodeInput(true)}
                style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.75, fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, cursor: "pointer" }}
              >
                Accesso sviluppatore
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={onboardingCodeValue}
                  onChange={(e) => { setOnboardingCodeValue(e.target.value.replace(/[^0-9]/g, "")); setOnboardingCodeError(false); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const ok = handleDevUnlock(onboardingCodeValue);
                      setOnboardingCodeError(!ok);
                    }
                  }}
                  placeholder="PIN numerico"
                  autoFocus
                  style={{
                    width: 180,
                    background: "#232E3D",
                    border: `1px solid ${onboardingCodeError ? "#C1543C" : "rgba(240,234,216,0.25)"}`,
                    borderRadius: 8,
                    padding: "7px 10px",
                    color: "#F0EAD8",
                    fontSize: TEXT_SIZES.body,
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => {
                    const ok = handleDevUnlock(onboardingCodeValue);
                    setOnboardingCodeError(!ok);
                  }}
                  style={{
                    background: "#4CAF50",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 26px",
                    color: "#FFFFFF",
                    fontSize: TEXT_SIZES.bodyLarge,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  OK
                </button>
                {onboardingCodeError && (
                  <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.tiny }}>PIN non valido.</div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }}>
            <button
              onClick={() => completeOnboarding("placement")}
              className="btn-3d"
              style={{
                background: "#D9A441",
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              Sì, un po' — fammi un test di piazzamento
            </button>
            <button
              onClick={() => completeOnboarding("beginner")}
              className="btn-3d"
              style={{
                background: "#7C8C6B",
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              No, parto da zero — portami alla prima lezione
            </button>
            <button
              onClick={() => completeOnboarding(null)}
              className="btn-3d"
              style={{
                background: "#5B84B1",
                border: "none",
                borderRadius: 12,
                padding: "12px 18px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              Sì, sto già imparando — esplora l'app da solo
            </button>
          </div>
          </div>
        </div>
      )}

      {levelCompleteCelebration && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            backgroundColor: "#0A1F4D",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
          onClick={() => setLevelCompleteCelebration(null)}
        >
          <div
            aria-hidden="true"
            className="celebration-border-flash"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url("${MATRYOSHKA_PATTERN_URI}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "130px 170px",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", height: 260, width: "100%", maxWidth: 320, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 20 }}>
            {[...LEVELS].reverse().map((lvl, i) => (
              <div
                key={lvl.id}
                className="doll-cascade-in"
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: lvl.size * 0.75,
                  height: lvl.size * 0.75 * 1.15,
                  borderRadius: "50% 50% 46% 46%",
                  background: lvl.color,
                  boxShadow: "inset 0 -12px 20px rgba(0,0,0,0.18)",
                  animationDelay: `${i * 0.14}s`,
                }}
              />
            ))}
          </div>
          <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 6 }}>
            Livello {levelCompleteCelebration} completato!
          </h2>
          <p style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.8, marginBottom: 28, maxWidth: 340 }}>
            {LEVELS.find((l) => l.id === levelCompleteCelebration)?.label} — hai finito tutte le lezioni di questo livello. Una bambola in più si è aperta.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playNavigationSound();
              setLevelCompleteCelebration(null);
            }}
            className="btn-3d"
            style={{
              background: "#D9A441",
              border: "none",
              borderRadius: 14,
              padding: "12px 32px",
              color: "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            Continua
          </button>
        </div>
      )}

      {showJourneySummary && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            backgroundColor: "#0A1F4D",
            overflow: "hidden auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
          onClick={() => setShowJourneySummary(false)}
          onScroll={handleJourneyScroll}
        >
          <div
            ref={journeyPatternRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-15%",
              left: 0,
              right: 0,
              bottom: "-15%",
              backgroundImage: `url("${MATRYOSHKA_PATTERN_URI}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "130px 170px",
              opacity: 0.18,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 380 }}>
            <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
              📊 Il tuo percorso
            </h2>
            <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 24 }}>
              Il quadro completo di quello che hai costruito finora
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: "🔥", label: "Giorni di serie", value: progress.streak, color: "#D9A441" },
                { icon: "📖", label: "Lezioni completate", value: progress.completed.length, color: "#5B84B1" },
                { icon: "🗂️", label: "Parole imparate a fondo", value: masteredCount, color: "#7C8C6B" },
                { icon: "✅", label: "Risposte facili", value: easyHardCounts.easy, color: "#7C8C6B" },
                { icon: "🔁", label: "Risposte da ripassare", value: easyHardCounts.hard, color: "#C1543C" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="doll-cascade-in"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "#232E3D",
                    border: "1px solid rgba(240,234,216,0.12)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="stat-shimmer"
                    style={{ animationDelay: `${i * 0.1 + 0.25}s` }}
                  />
                  <span style={{ fontSize: TEXT_SIZES.sectionTitle }}>{stat.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.65 }}>{stat.label}</div>
                  </div>
                  <div style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700, color: stat.color }}>
                    <AnimatedNumber value={stat.value} />
                  </div>
                </div>
              ))}
            </div>

            {(() => {
              const completedLevelsForShare = LEVELS.map((l) => l.id).filter((id) =>
                allLessonsFor(id).some((les) => progress.completed.includes(les.id))
              );
              const currentLevelForShare = completedLevelsForShare[completedLevelsForShare.length - 1] || null;
              return (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    playNavigationSound();
                    setShareCardLoading(true);
                    setShareCardError(null);
                    const result = await generateAndShareProgressCard({
                      streak: progress.streak,
                      lessonsCompleted: progress.completed.length,
                      wordsLearned: masteredCount,
                      level: currentLevelForShare,
                    });
                    setShareCardLoading(false);
                    if (!result.ok) setShareCardError("Non sono riuscita a condividere. Riprova.");
                    else if (result.dataUrl) setShareCardImageUrl(result.dataUrl);
                  }}
                  disabled={shareCardLoading}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 16,
                    background: "rgba(217,164,65,0.15)",
                    border: "1px solid rgba(217,164,65,0.4)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    color: "#D9A441",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.bodyLarge,
                    cursor: shareCardLoading ? "default" : "pointer",
                  }}
                >
                  {shareCardLoading ? <>Preparo l'immagine…<LoadingDots /></> : "📤 Condividi il tuo percorso"}
                </button>
              );
            })()}
            {shareCardError && (
              <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8 }}>{shareCardError}</div>
            )}

            {/* Traguardi: soglie calcolate sugli stessi dati reali già mostrati sopra,
                mai inventati. Uno badge colorato quando raggiunto, sfumato quando non
                ancora — dà un obiettivo concreto verso cui tendere, non solo un numero. */}
            <div style={{ marginTop: 20, marginBottom: 4, fontSize: TEXT_SIZES.body, opacity: 0.55, textAlign: "left" }}>Traguardi</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { icon: "🥉", label: "Prima lezione", current: progress.completed.length, target: 1 },
                { icon: "🥈", label: "10 lezioni", current: progress.completed.length, target: 10 },
                { icon: "🥇", label: "25 lezioni", current: progress.completed.length, target: 25 },
                { icon: "🔥", label: "7 giorni di fila", current: progress.streak, target: 7 },
                { icon: "💎", label: "30 giorni di fila", current: progress.streak, target: 30 },
                { icon: "📚", label: "100 parole", current: masteredCount, target: 100 },
                { icon: "💬", label: "10 scambi in chat", current: progress.conversationTurns || 0, target: 10 },
              ].map((badge, i) => {
                const done = badge.current >= badge.target;
                const pct = Math.min(100, Math.round((badge.current / badge.target) * 100));
                return (
                <div
                  key={badge.label}
                  className="doll-cascade-in"
                  style={{
                    animationDelay: `${0.5 + i * 0.06}s`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    background: done ? "rgba(217,164,65,0.15)" : "#1B2430",
                    border: done ? "1px solid rgba(217,164,65,0.4)" : "1px solid rgba(240,234,216,0.08)",
                    borderRadius: 10,
                    padding: "10px 6px",
                    opacity: done ? 1 : 0.4,
                  }}
                >
                  <span style={{ fontSize: TEXT_SIZES.subtitle }}>{badge.icon}</span>
                  <span style={{ fontSize: TEXT_SIZES.tiny, textAlign: "center", lineHeight: 1.2 }}>{badge.label}</span>
                  {!done && (
                    <div style={{ width: "100%", height: 3, background: "rgba(240,234,216,0.15)", borderRadius: 2, overflow: "hidden", marginTop: 2 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#D9A441", transition: "width 0.3s ease" }} />
                    </div>
                  )}
                </div>
                );
              })}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playNavigationSound();
                setShowJourneySummary(false);
              }}
              className="btn-3d"
              style={{
                marginTop: 24,
                background: "#D9A441",
                border: "none",
                borderRadius: 14,
                padding: "12px 32px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {shareCardImageUrl && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            backgroundColor: "rgba(6,21,48,0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShareCardImageUrl(null)}
        >
          <p style={{ color: "#F0EAD8", fontSize: TEXT_SIZES.body, opacity: 0.8, marginBottom: 12, textAlign: "center", maxWidth: 320 }}>
            Tieni premuto sull'immagine per salvarla o condividerla
          </p>
          <img
            src={shareCardImageUrl}
            alt="Il tuo percorso — immagine da condividere"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "90%", maxHeight: "70vh", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Un vero click utente su un link di download ha più probabilità di
                // funzionare anche in contesti sandboxati permissivi rispetto a un
                // link.click() programmatico automatico — ma resta solo un extra:
                // l'immagine sopra è già visibile e salvabile anche se questo fallisce.
                const link = document.createElement("a");
                link.href = shareCardImageUrl;
                link.download = "matryoshka-progresso.png";
                link.click();
              }}
              style={{
                background: "#D9A441",
                border: "none",
                borderRadius: 10,
                padding: "10px 24px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              ⬇️ Scarica
            </button>
            <button
              onClick={() => setShareCardImageUrl(null)}
              style={{
                background: "none",
                border: "1px solid rgba(240,234,216,0.4)",
                borderRadius: 10,
                padding: "10px 24px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
      <header
        style={{
          position: "relative",
          padding: "20px 20px 14px",
          textAlign: "center",
          background: "rgba(0,31,91,0.82)",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <img
          key={wobbleKey}
          src={MATRYOSHKA_LABELED_ICON_URI}
          alt="Матрёшка Мариса"
          className={`${dollWobble ? "doll-wobble " : ""}${mascotGlow === "wrong" ? "mascot-shake " : ""}${mascotThinking ? "doll-breathe" : ""}`.trim() || undefined}
          onClick={() => {
            setView("home");
            setActiveLesson(null);
            setActiveSector(null);
            setOpenLevel(null);
            setShowWelcome((s) => !s);
            setDollWobble(true);
            setWobbleKey((k) => k + 1);
            setTimeout(() => setDollWobble(false), 1000);
          }}
          style={{
            display: "block",
            margin: "0 auto",
            width: 130,
            height: "auto",
            cursor: "pointer",
            borderRadius: "50%",
            filter:
              mascotGlow === "correct"
                ? "drop-shadow(0 0 14px rgba(124,140,107,0.9))"
                : mascotGlow === "wrong"
                ? "drop-shadow(0 0 14px rgba(193,84,60,0.9))"
                : "none",
            transition: "filter 0.25s ease",
          }}
        />
        {mascotStreakSparkle && (
          <div aria-hidden="true" style={{ position: "absolute", top: 8, left: "50%", width: 140, height: 130, transform: "translateX(-50%)", pointerEvents: "none" }}>
            {["✨", "⭐", "✨"].map((s, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${20 + i * 30}%`,
                  top: `${10 + (i % 2) * 15}%`,
                  fontSize: TEXT_SIZES.subtitle,
                  animation: `sparkleBurst 0.75s ease-out ${i * 0.05}s`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
        <div
          className="display"
          style={{
            fontSize: TEXT_SIZES.cardTitle,
            fontWeight: 700,
            color: "#D9A441",
            marginTop: 8,
          }}
        >
          Матрёшка Мариса
        </div>
        <div
          className={showWelcome ? "display" : undefined}
          style={{
            fontSize: showWelcome ? TEXT_SIZES.emphasis : TEXT_SIZES.body,
            fontWeight: showWelcome ? 700 : 400,
            color: showWelcome ? "#D9A441" : "#F0EAD8",
            opacity: showWelcome ? 1 : 0.6,
            marginTop: 5,
          }}
        >
          {showWelcome ? "Добро пожаловать домой!" : "italiano → russo, un livello alla volta"}
        </div>
        <button
          onClick={() => {
            setView("home");
            setActiveLesson(null);
            setActiveSector(null);
            setOpenLevel(null);
          }}
          style={{
            marginTop: 10,
            background: "none",
            border: "1px solid rgba(240,234,216,0.3)",
            borderRadius: 20,
            padding: "6px 18px",
            color: "#F0EAD8",
            fontSize: TEXT_SIZES.bodyLarge,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🏠 Home
        </button>
        {view !== "placement" && (
        <>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            marginTop: 12,
            fontSize: TEXT_SIZES.bodyLarge,
          }}
        >
          <span className={freezeUsedFlash ? "freeze-flash-gold" : undefined} style={{ display: "flex", alignItems: "center", gap: 5, borderRadius: 14, padding: "2px 6px" }} title="Congelamenti disponibili questo mese: se salti un giorno, ne consumo uno invece di azzerare la serie">
            <Flame size={15} color="#D9A441" className={progress.streak >= 7 ? "flame-flicker-strong" : "flame-flicker"} /> <AnimatedNumber value={progress.streak} /> giorni
            {(progress.streakFreezes ?? 2) > 0 && (
              <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>❄️{progress.streakFreezes ?? 2}</span>
            )}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <BookOpen size={15} color="#5B84B1" /> {progress.completed.length} lezioni
          </span>
          <button
            onClick={() => {
              playNavigationSound();
              setShowJourneySummary(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "1px solid rgba(240,234,216,0.2)",
              borderRadius: 14,
              padding: "3px 10px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            📊 Il tuo percorso
          </button>
          {dueReviewCount > 0 && (
            <button
              onClick={() => {
                playNavigationSound();
                setActiveSector("pratica");
                setView("difficolta");
              }}
              className="review-badge-pulse"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(193,84,60,0.2)",
                border: "1px solid #C1543C",
                borderRadius: 14,
                padding: "3px 10px",
                color: "#C1543C",
                fontSize: TEXT_SIZES.bodyLarge,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📌 <AnimatedNumber value={dueReviewCount} /> da ripassare
            </button>
          )}
        </div>

        {weeklyBaseline && (() => {
          const newWords = Math.max(0, masteredCount - weeklyBaseline.masteredCountStart);
          const conversations = Math.max(0, (progress.conversationTurns || 0) - weeklyBaseline.conversationTurnsStart);
          const WORD_TARGET = 15;
          const CONV_TARGET = 5;
          return (
            <div style={{ width: "100%", maxWidth: 340, margin: "16px auto 0" }}>
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6, textAlign: "left" }}>
                🎯 Questa settimana
              </div>
              <div className="doll-cascade-in" style={{ display: "flex", gap: 10, background: "#232E3D", border: "1px solid rgba(91,132,177,0.3)", borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginBottom: 2 }}>Parole nuove</div>
                  <div style={{ fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, color: newWords >= WORD_TARGET ? "#7C8C6B" : "#F0EAD8" }}>
                    <AnimatedNumber value={newWords} />/{WORD_TARGET}
                  </div>
                </div>
                <div style={{ width: 1, background: "rgba(240,234,216,0.15)" }} />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginBottom: 2 }}>Scambi in chat</div>
                  <div style={{ fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, color: conversations >= CONV_TARGET ? "#7C8C6B" : "#F0EAD8" }}>
                    <AnimatedNumber value={conversations} />/{CONV_TARGET}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {inProgressPlans.length > 0 && (
          <div style={{ width: "100%", maxWidth: 340, margin: "16px auto 0" }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6, textAlign: "left" }}>
              ▶️ In svolgimento
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {inProgressPlans.map((p) => {
                const total = (p.plan || []).reduce((s, d) => s + (d.activities || []).length, 0);
                const doneCount = Object.values(p.done || {}).filter(Boolean).length;
                const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      playNavigationSound();
                      setPendingOpenPlanId(p.id);
                      setActiveSector(null);
                      setView("programma");
                    }}
                    className="doll-cascade-in"
                    style={{
                      textAlign: "left",
                      background: "#232E3D",
                      border: "1px solid rgba(217,164,65,0.3)",
                      borderRadius: 12,
                      padding: "10px 14px",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, color: "#F0EAD8" }}>{p.name}</span>
                      <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, color: "#F0EAD8" }}>{doneCount}/{total}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(240,234,216,0.1)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#D9A441", borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            marginTop: 10,
          }}
        >
          <button
            onClick={() => { playNavigationSound(); setView(view === "voce" ? "home" : "voce"); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: view === "voce" ? "rgba(217,164,65,0.2)" : "none",
              border: view === "voce" ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.2)",
              borderRadius: 16,
              padding: "3px 11px",
              color: "#D9A441",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            <Volume2 size={15} /> Voce
          </button>
          <button
            onClick={() => setShowTextSizePanel((s) => !s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: showTextSizePanel ? "rgba(217,164,65,0.2)" : "none",
              border: showTextSizePanel ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.2)",
              borderRadius: 16,
              padding: "3px 11px",
              color: "#D9A441",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            Aa
          </button>
          <button
            onClick={() => {
              toggleAmbientSound();
            }}
            aria-label={ambientSoundOn ? "Disattiva sottofondo musicale" : "Attiva sottofondo musicale"}
            title={ambientSoundOn ? "Disattiva sottofondo musicale" : "Attiva sottofondo musicale"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              background: ambientSoundOn ? "rgba(217,164,65,0.2)" : "none",
              border: ambientSoundOn ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.2)",
              borderRadius: "50%",
              padding: 0,
              color: "#D9A441",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            <span className={ambientSoundOn ? "music-note-vibrate" : undefined}>
              {ambientSoundOn ? "🎵" : "🔇"}
            </span>
          </button>
          <button
            onClick={() => setShowDevPanel((s) => !s)}
            aria-label={devUnlocked ? "Strumenti sviluppatore" : "Accesso sviluppatore"}
            title={devUnlocked ? "Strumenti sviluppatore" : "Accesso sviluppatore"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              height: 30,
              background: showDevPanel ? "rgba(217,164,65,0.2)" : "none",
              border: showDevPanel ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.2)",
              borderRadius: "50%",
              padding: 0,
              color: "#D9A441",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            🔧
          </button>
        </div>

        {showDevPanel && (
          <div
            style={{
              maxWidth: 340,
              margin: "12px auto 0",
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 10,
              padding: 14,
              textAlign: "center",
              fontSize: TEXT_SIZES.body,
            }}
          >
            <div style={{ opacity: 0.6, marginBottom: 10 }}>{devUnlocked ? "Strumenti sviluppatore" : "Accesso sviluppatore"}</div>
            {devUnlocked ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => {
                    // Rimette a "non fatto" solo il primo avvio: riporta subito la
                    // pagina di benvenuto in vista, senza aspettare la ricarica
                    // dell'app né dover cancellare a mano i dati del browser.
                    saveJSON("onboarding-done", false);
                    setShowOnboarding(true);
                    setShowDevPanel(false);
                    setView("home");
                    setActiveSector(null);
                  }}
                  style={{
                    background: "#1B2430",
                    border: "1px solid rgba(240,234,216,0.2)",
                    borderRadius: 8,
                    padding: "8px 16px",
                    color: "#F0EAD8",
                    fontSize: TEXT_SIZES.bodyLarge,
                    cursor: "pointer",
                  }}
                >
                  Rivedi pagina di benvenuto
                </button>
              </div>
            ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={devCodeValue}
                onChange={(e) => { setDevCodeValue(e.target.value.replace(/[^0-9]/g, "")); setDevCodeError(false); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const ok = handleDevUnlock(devCodeValue);
                    setDevCodeError(!ok);
                    if (ok) setShowDevPanel(false);
                  }
                }}
                placeholder="PIN numerico"
                autoFocus
                style={{
                  width: 180,
                  background: "#1B2430",
                  border: `1px solid ${devCodeError ? "#C1543C" : "rgba(240,234,216,0.25)"}`,
                  borderRadius: 8,
                  padding: "7px 10px",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.body,
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => {
                  const ok = handleDevUnlock(devCodeValue);
                  setDevCodeError(!ok);
                  if (ok) setShowDevPanel(false);
                }}
                style={{
                  background: "#4CAF50",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 26px",
                  color: "#FFFFFF",
                  fontSize: TEXT_SIZES.bodyLarge,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                OK
              </button>
              {devCodeError && (
                <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.tiny }}>PIN non valido.</div>
              )}
            </div>
            )}
          </div>
        )}

        {showTextSizePanel && (
          <div
            style={{
              maxWidth: 340,
              margin: "12px auto 0",
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 10,
              padding: 14,
              textAlign: "left",
              fontSize: TEXT_SIZES.body,
            }}
          >
            <div style={{ opacity: 0.6, marginBottom: 10 }}>Dimensione del testo — si applica a esercizi, frasi e parole in tutta l'app</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => updateTextScale(textScale - TEXT_SCALE_STEP)}
                disabled={textScale <= TEXT_SCALE_MIN}
                style={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: 8,
                  border: "1px solid rgba(240,234,216,0.2)",
                  background: "#1B2430",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.subtitle,
                  cursor: textScale <= TEXT_SCALE_MIN ? "default" : "pointer",
                  opacity: textScale <= TEXT_SCALE_MIN ? 0.35 : 1,
                }}
              >
                A−
              </button>
              <input
                type="range"
                min={TEXT_SCALE_MIN}
                max={TEXT_SCALE_MAX}
                step={TEXT_SCALE_STEP}
                value={textScale}
                onChange={(e) => updateTextScale(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <button
                onClick={() => updateTextScale(textScale + TEXT_SCALE_STEP)}
                disabled={textScale >= TEXT_SCALE_MAX}
                style={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: 8,
                  border: "1px solid rgba(240,234,216,0.2)",
                  background: "#1B2430",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.subtitleLarge,
                  cursor: textScale >= TEXT_SCALE_MAX ? "default" : "pointer",
                  opacity: textScale >= TEXT_SCALE_MAX ? 0.35 : 1,
                }}
              >
                A+
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <div style={{ opacity: 0.6, fontSize: TEXT_SIZES.small }}>{Math.round(textScale * 100)}%</div>
              {textScale !== 1 && (
                <button
                  onClick={() => updateTextScale(1)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#D9A441",
                    fontSize: TEXT_SIZES.small,
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Ripristina predefinito
                </button>
              )}
            </div>
            <div
              style={{
                marginTop: 12,
                padding: 10,
                background: "#1B2430",
                borderRadius: 8,
                textAlign: "center",
                fontSize: TEXT_SIZES.bodyLarge,
              }}
            >
              Anteprima: Я говорю́ по-ру́сски
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          <button
            onClick={() => {
              playNavigationSound();
              if (activeSector === "impara" && IMPARA_SUBVIEWS.includes(view)) {
                // una sottocategoria è aperta: prima torna alla griglia, non chiudere subito il settore
                setView("home");
              } else {
                setView("home");
                setActiveSector((s) => (s === "impara" ? null : "impara"));
              }
            }}
            className="btn-3d"
            style={{
              flex: 1,
              minWidth: 0,
              overflowWrap: "break-word",
              background: activeSector === "impara" && view !== "programma" ? "#5B84B1" : "#232E3D",
              border: "2px solid #5B84B1",
              borderRadius: 16,
              padding: "15px 4px",
              color: activeSector === "impara" && view !== "programma" ? "#1B2430" : "#F0EAD8",
              fontWeight: 700,
              fontSize: TEXT_SIZES.emphasis,
              cursor: "pointer",
            }}
          >
            📚 Impara
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.78, fontWeight: 600, marginTop: 2 }}>Учись</div>
          </button>
          <button
            onClick={() => {
              playNavigationSound();
              if (activeSector === "pratica" && PRATICA_SUBVIEWS.includes(view)) {
                setView("home");
              } else {
                setView("home");
                setActiveSector((s) => (s === "pratica" ? null : "pratica"));
              }
            }}
            className="btn-3d"
            style={{
              flex: 1,
              minWidth: 0,
              overflowWrap: "break-word",
              background: activeSector === "pratica" && view !== "programma" ? "#C1543C" : "#232E3D",
              border: "2px solid #C1543C",
              borderRadius: 16,
              padding: "15px 4px",
              color: activeSector === "pratica" && view !== "programma" ? "#1B2430" : "#F0EAD8",
              fontWeight: 700,
              fontSize: TEXT_SIZES.emphasis,
              cursor: "pointer",
            }}
          >
            🎯 Pratica
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.78, fontWeight: 600, marginTop: 2 }}>Практика</div>
          </button>
          <button
            onClick={() => {
              playNavigationSound();
              setActiveSector(null);
              setView((v) => (v === "programma" ? "home" : "programma"));
            }}
            className="btn-3d"
            style={{
              flex: 1,
              minWidth: 0,
              overflowWrap: "break-word",
              background: view === "programma" ? "#D9A441" : "#232E3D",
              border: "2px solid #D9A441",
              borderRadius: 16,
              padding: "15px 4px",
              color: view === "programma" ? "#1B2430" : "#F0EAD8",
              fontWeight: 700,
              fontSize: TEXT_SIZES.emphasis,
              cursor: "pointer",
            }}
          >
            🗓️ Programma
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.78, fontWeight: 600, marginTop: 2 }}>Программа</div>
          </button>
          <button
            onClick={() => {
              playNavigationSound();
              if (activeSector === "lezioni" && openLevel) {
                setOpenLevel(null);
              } else {
                setView("home");
                setActiveSector((s) => (s === "lezioni" ? null : "lezioni"));
              }
            }}
            className="btn-3d"
            style={{
              flex: 1,
              minWidth: 0,
              overflowWrap: "break-word",
              background: activeSector === "lezioni" ? "#7C8C6B" : "#232E3D",
              border: "2px solid #7C8C6B",
              borderRadius: 16,
              padding: "15px 4px",
              color: activeSector === "lezioni" ? "#1B2430" : "#F0EAD8",
              fontWeight: 700,
              fontSize: TEXT_SIZES.emphasis,
              cursor: "pointer",
            }}
          >
            📖 Lezioni
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.78, fontWeight: 600, marginTop: 2 }}>Уроки</div>
          </button>
        </div>

        {!activeSector && view !== "programma" && (
          <>
            {(() => {
              // Compagno di studio: un suggerimento intelligente, non un'altra
              // animazione — riusa dati già tracciati (dueReviewCount, streak,
              // completed), nessun nuovo sistema da mantenere. Priorità: ripasso
              // dovuto prima di tutto (protegge la memoria a lungo termine), poi
              // la serie a rischio (protegge la costanza), infine la prossima
              // lezione naturale (fa ripartire chi non sa da dove continuare).
              if (dueReviewCount > 0) {
                return (
                  <button
                    onClick={() => {
                      playNavigationSound();
                      setActiveSector("pratica");
                      setView("difficolta");
                    }}
                    className="btn-3d"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: 460,
                      margin: "14px auto 0",
                      background: "rgba(193,84,60,0.12)",
                      border: "1px solid rgba(193,84,60,0.4)",
                      borderRadius: 14,
                      padding: "12px 16px",
                      color: "#F0EAD8",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>
                      📌 Hai {dueReviewCount} {dueReviewCount === 1 ? "cosa" : "cose"} da ripassare oggi
                    </div>
                    <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginTop: 2 }}>
                      ~{Math.max(1, Math.round((dueReviewCount * 15) / 60))} min ora vale più di un'ora tra un mese →
                    </div>
                  </button>
                );
              }
              const todayIsDone = progress.lastActive === todayStr();
              if (progress.streak > 0 && !todayIsDone) {
                return (
                  <button
                    onClick={() => {
                      playNavigationSound();
                      setActiveSector("impara");
                    }}
                    className="btn-3d"
                    style={{
                      display: "block",
                      width: "100%",
                      maxWidth: 460,
                      margin: "14px auto 0",
                      background: "rgba(217,164,65,0.12)",
                      border: "1px solid rgba(217,164,65,0.4)",
                      borderRadius: 14,
                      padding: "12px 16px",
                      color: "#F0EAD8",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>
                      🔥 La tua serie di {progress.streak} giorni ti aspetta
                    </div>
                    <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginTop: 2 }}>
                      Non hai ancora studiato oggi — bastano pochi minuti →
                    </div>
                  </button>
                );
              }
              return null;
            })()}
            <p style={{ textAlign: "center", fontSize: TEXT_SIZES.bodyLarge, opacity: 0.55, marginTop: 14, marginBottom: 0 }}>
              👆 Scegli una categoria per vedere le sezioni disponibili
            </p>
            <div style={{ textAlign: "center", marginTop: 10, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => setView("search")}
                style={{
                  background: "rgba(91,132,177,0.12)",
                  border: "1px solid rgba(91,132,177,0.4)",
                  borderRadius: 22,
                  padding: "9px 18px",
                  color: "#5B84B1",
                  fontSize: TEXT_SIZES.bodyLarge,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🔍 Cerca vocabolario
              </button>
              <button
                onClick={() => setView("placement")}
                style={{
                  background: "rgba(217,164,65,0.12)",
                  border: "1px solid rgba(217,164,65,0.4)",
                  borderRadius: 22,
                  padding: "9px 18px",
                  color: "#D9A441",
                  fontSize: TEXT_SIZES.bodyLarge,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📋 Test di piazzamento
              </button>
              <button
                onClick={() => setView("mastery")}
                style={{
                  background: "rgba(154,107,158,0.12)",
                  border: "1px solid rgba(154,107,158,0.4)",
                  borderRadius: 22,
                  padding: "9px 18px",
                  color: "#9A6B9E",
                  fontSize: TEXT_SIZES.bodyLarge,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📊 Mappa di padronanza
              </button>
            </div>
          </>
        )}
        </>
        )}

        {activeSector === "impara" && !IMPARA_SUBVIEWS.includes(view) && (
          <div style={{ marginTop: 10, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            <button
              onClick={() => setShowPartiDelDiscorso((s) => !s)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                background: "rgba(240,234,216,0.08)",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: TEXT_SIZES.bodyLarge,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#F0EAD8",
                cursor: "pointer",
                marginBottom: showPartiDelDiscorso ? 8 : 14,
              }}
            >
              <span>📚 Parti del Discorso</span>
              <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.7 }}>{showPartiDelDiscorso ? "▲" : "▼"}</span>
            </button>

            {showPartiDelDiscorso && (
              <>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 6, textAlign: "center" }}>Variabili — si declinano per caso, genere o numero</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                justifyItems: "center",
                marginBottom: 14,
              }}
            >
              <button
                onClick={() => { playNavigationSound(); setView(view === "pronouns" ? "home" : "pronouns"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#5B84B1", view === "pronouns"), textAlign: "center", width: "100%" }}
              >
                👤 Pronomi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Местоимения</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "declensions" ? "home" : "declensions"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#9A6B9E", view === "declensions"), textAlign: "center", width: "100%" }}
              >
                📖 Nomi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Падежи</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "adjectives" ? "home" : "adjectives"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#9A6B9E", view === "adjectives"), textAlign: "center", width: "100%" }}
              >
                🎨 Aggettivi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Прилагательные</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "numerals" ? "home" : "numerals"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#D9A441", view === "numerals"), textAlign: "center", width: "100%", gridColumn: 2 }}
              >
                🔢 Numerale
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Числительное</div>
              </button>
            </div>

            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 6, textAlign: "center" }}>Verbo — si coniuga</div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <button
                onClick={() => { playNavigationSound(); setView(view === "verbs" ? "home" : "verbs"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#7C8C6B", view === "verbs"), textAlign: "center", minWidth: 140 }}
              >
                🗣️ Verbi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Глаголы</div>
              </button>
            </div>

            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 6, textAlign: "center" }}>Invariabili — non cambiano mai forma</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                justifyItems: "center",
                marginBottom: 20,
              }}
            >
              <button
                onClick={() => { playNavigationSound(); setView(view === "prepositions" ? "home" : "prepositions"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#C1543C", view === "prepositions"), textAlign: "center", width: "100%" }}
              >
                🔗 Preposizioni
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Предлоги</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "adverbs" ? "home" : "adverbs"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#7C8C6B", view === "adverbs"), textAlign: "center", width: "100%" }}
              >
                💫 Avverbio
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Наречие</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "conjunctions" ? "home" : "conjunctions"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#5B84B1", view === "conjunctions"), textAlign: "center", width: "100%" }}
              >
                🔗 Congiunzione
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Союз</div>
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button
                onClick={() => { playNavigationSound(); setView(view === "particles" ? "home" : "particles"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#9A6B9E", view === "particles"), textAlign: "center", flex: 1 }}
              >
                ✨ Particella
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Частица</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "interjections" ? "home" : "interjections"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#C1543C", view === "interjections"), textAlign: "center", flex: 1 }}
              >
                ❗ Interiezione
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Междометие</div>
              </button>
            </div>

              </>
            )}

            <button
              onClick={() => setShowPartiDellaFrase((s) => !s)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                background: "rgba(240,234,216,0.08)",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: TEXT_SIZES.bodyLarge,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: "#F0EAD8",
                cursor: "pointer",
                marginBottom: showPartiDellaFrase ? 8 : 0,
              }}
            >
              <span>🧩 Parti della Frase</span>
              <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.7 }}>{showPartiDellaFrase ? "▲" : "▼"}</span>
            </button>
            {showPartiDellaFrase && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => { playNavigationSound(); setView(view === "syntax" ? "home" : "syntax"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#D9A441", view === "syntax"), textAlign: "center", minWidth: 170 }}
              >
                🧩 Analisi frase
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Анализ предложения</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "insidie" ? "home" : "insidie"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#C1543C", view === "insidie"), textAlign: "center", minWidth: 170 }}
              >
                🇮🇹 Perché è così
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Логика русского языка</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "reggenza" ? "home" : "reggenza"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#9A6B9E", view === "reggenza"), textAlign: "center", minWidth: 170 }}
              >
                🔗 Reggenza dei casi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Управление падежами</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "comparativi" ? "home" : "comparativi"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#7C8C6B", view === "comparativi"), textAlign: "center", minWidth: 170 }}
              >
                📊 Comparativo e superlativo
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Сравнительная степень</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "participi" ? "home" : "participi"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#5B84B1", view === "participi"), textAlign: "center", minWidth: 170 }}
              >
                📜 Participi e gerundi
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Причастия и деепричастия</div>
              </button>
              <button
                onClick={() => { playNavigationSound(); setView(view === "condizionale" ? "home" : "condizionale"); }}
                className="btn-3d"
                style={{ ...navBtnStyle("#5B84B1", view === "condizionale"), textAlign: "center", minWidth: 170 }}
              >
                🔮 Condizionale (бы)
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Условное наклонение</div>
              </button>
            </div>
            )}
          </div>
        )}

        {activeSector === "pratica" && !PRATICA_SUBVIEWS.includes(view) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
              marginTop: 10,
              maxWidth: 420,
              marginLeft: "auto",
              marginRight: "auto",
              justifyItems: "center",
            }}
          >
            <button
              onClick={() => { playNavigationSound(); setView(view === "compose" ? "home" : "compose"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#C1543C", view === "compose"), textAlign: "center", width: "100%" }}
            >
              🧩 Componi
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Составь</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "difficolta" ? "home" : "difficolta"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#9A6B9E", view === "difficolta"), textAlign: "center", width: "100%" }}
            >
              🎯 Difficoltà
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Трудности</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "phrases" ? "home" : "phrases"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#5B84B1", view === "phrases"), textAlign: "center", width: "100%" }}
            >
              💬 Frasi
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Фразы</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "dialogues" ? "home" : "dialogues"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#7C8C6B", view === "dialogues"), textAlign: "center", width: "100%" }}
            >
              🎭 Dialoghi
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Диалоги</div>
            </button>
            <button
              onClick={() => {
                playNavigationSound();
                setView(view === "flashcards" ? "home" : "flashcards");
                setCardIndex(0);
                setFlipped(false);
              }}
              className="btn-3d"
              style={{ ...navBtnStyle("#7C8C6B", view === "flashcards"), textAlign: "center", width: "100%" }}
            >
              <Layers size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
              Carte ({masteredCount}/{deck.length})
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Карточки</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "session" ? "home" : "session"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#D9A441", view === "session"), textAlign: "center", width: "100%" }}
            >
              📅 Sessione
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Занятие</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "corsivo" ? "home" : "corsivo"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#9A6B9E", view === "corsivo"), textAlign: "center", width: "100%" }}
            >
              ✒️ Corsivo
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Курсив</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "conversazione" ? "home" : "conversazione"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#5B84B1", view === "conversazione"), textAlign: "center", width: "100%" }}
            >
              💬 Conversazione
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Разговор</div>
            </button>
            <button
              onClick={() => { playNavigationSound(); setView(view === "scrittura-tempo" ? "home" : "scrittura-tempo"); }}
              className="btn-3d"
              style={{ ...navBtnStyle("#C1543C", view === "scrittura-tempo"), textAlign: "center", width: "100%" }}
            >
              ⏱️ Scrittura a tempo
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginTop: 2, fontWeight: 600 }}>Письмо на время</div>
            </button>
          </div>
        )}

        {!premium.enabled && view !== "voce" && !showTextSizePanel && !showDevPanel && activeSector === "pratica" && !PRATICA_SUBVIEWS.includes(view) && (
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginTop: 8 }}>
            👆 Tocca "Voce" in alto per una pronuncia più naturale (voce premium disponibile)
          </p>
        )}

      </header>

      {!ready ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <img
            src={MATRYOSHKA_LABELED_ICON_URI}
            alt="Матрёшка Мариса"
            className="doll-breathe"
            style={{ width: 70, height: "auto", marginBottom: 14, opacity: 0.85 }}
          />
          <div style={{ opacity: 0.6, fontSize: TEXT_SIZES.body }}>Preparo la tua matrioska…</div>
        </div>
      ) : (
      <div key={view} className="view-transition-in">
      {view === "prepositions" ? (
        <PrepositionsView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customPrepositions={customPrepositions}
          prepGenLoading={prepGenLoading}
          prepGenError={prepGenError}
          onGeneratePreposition={generatePreposition}
          jumpTo={view === "prepositions" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "search" ? (
        <SearchView
          onBack={() => setView("home")}
          onJump={(r) => {
            const viewMap = { declensions: "declensions", adjectives: "adjectives", prepositions: "prepositions", verbs: "verbs" };
            setPendingJump({ level: r.level, packageIndex: r.index });
            setView(viewMap[r.section]);
          }}
          customNouns={customNouns}
          customAdjectives={customAdjectives}
          customPrepositions={customPrepositions}
          customVerbs={customVerbs}
          onCreatePackage={generateWordPackage}
          wordPackageLoading={wordPackageLoading}
          wordPackageError={wordPackageError}
        />
      ) : view === "mastery" ? (
        <MasteryMapView
          onBack={() => setView("home")}
          completed={progress.completed}
          allLessonsFor={allLessonsFor}
          learnedPhrasePackages={learnedPhrasePackages}
          learnedPackages={learnedPackages}
          masteredCount={masteredCount}
          vocabTotal={deck.length}
          progress={progress}
          dueReviewCount={dueReviewCount}
        />
      ) : view === "placement" ? (
        <PlacementTestView
          onFinish={(lvl) => {
            setOpenLevel(lvl);
            setView("home");
          }}
          onCancel={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
        />
      ) : view === "difficolta" ? (
        <DifficoltaView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} customErroriTipici={customErroriTipici} erroreGenLoading={erroreGenLoading} erroreGenError={erroreGenError} onGenerateErroreTipico={generateErroreTipico} />
      ) : view === "programma" ? (
        <ProgrammaView
          onBack={() => setView("home")}
          onNavigateSection={(activity) => {
            setPendingJump({ level: activity.level, packageIndex: activity.packageIndex });
            setView(activity.id);
          }}
          onStartGuided={startGuidedSession}
          currentFurthestLevel={openLevel}
          openPlanId={pendingOpenPlanId}
          onConsumeOpenPlanId={() => setPendingOpenPlanId(null)}
        />
      ) : view === "dialogues" ? (
        <DialoguesView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customDialogues={customDialogues}
          dialogueGenLoading={dialogueGenLoading}
          dialogueGenError={dialogueGenError}
          onGenerateDialogue={generateDialogue}
          jumpTo={view === "dialogues" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          customFiabe={customFiabe}
          fiabaGenLoading={fiabaGenLoading}
          fiabaGenError={fiabaGenError}
          onGenerateFiaba={generateFiaba}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "pronouns" ? (
        <PronounsView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customPronouns={customPronouns}
          pronounGenLoading={pronounGenLoading}
          pronounGenError={pronounGenError}
          onGeneratePronoun={generatePronoun}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "adverbs" ? (
        <SimplePosView
          onBack={() => setView("home")}
          categoryId="adverbs"
          title="Avverbio"
          subtitle="Parola invariabile che modifica un verbo, un aggettivo o un altro avverbio."
          data={ADVERBS}
          customData={customSimplePos.adverbs}
          genLoading={simplePosGenLoading}
          genError={simplePosGenError}
          onGenerate={generateSimplePosItem}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "numbers-practice" ? (
        <NumbersPracticeView
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          onBack={() => setView("numerals")}
          customNumbers={customNumbers}
          numberGenLoading={numberGenLoading}
          numberGenError={numberGenError}
          onGenerateNumber={generateCustomNumber}
          initialMode={numbersPracticeInitialMode}
        />
      ) : view === "numerals" ? (
        <SimplePosView
          onBack={() => setView("home")}
          categoryId="numerals"
          title="Numerale"
          subtitle="Indica quantità o ordine; alcuni reggono casi particolari del sostantivo che accompagnano."
          data={NUMERALS}
          customData={customSimplePos.numerals}
          genLoading={simplePosGenLoading}
          genError={simplePosGenError}
          onGenerate={generateSimplePosItem}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          extraButtons={[
            { label: "📖 Consulta 1-100", onClick: () => { setNumbersPracticeInitialMode("table"); setView("numbers-practice"); } },
            { label: "✍️ Scrivi", onClick: () => { setNumbersPracticeInitialMode("write"); setView("numbers-practice"); } },
          ]}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "conjunctions" ? (
        <SimplePosView
          onBack={() => setView("home")}
          categoryId="conjunctions"
          title="Congiunzione"
          subtitle="Collega parole, frasi o proposizioni tra loro."
          data={CONJUNCTIONS}
          customData={customSimplePos.conjunctions}
          genLoading={simplePosGenLoading}
          genError={simplePosGenError}
          onGenerate={generateSimplePosItem}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "particles" ? (
        <SimplePosView
          onBack={() => setView("home")}
          categoryId="particles"
          title="Particella"
          subtitle="Parola invariabile che aggiunge una sfumatura di significato o enfasi."
          data={PARTICLES}
          customData={customSimplePos.particles}
          genLoading={simplePosGenLoading}
          genError={simplePosGenError}
          onGenerate={generateSimplePosItem}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "interjections" ? (
        <SimplePosView
          onBack={() => setView("home")}
          categoryId="interjections"
          title="Interiezione"
          subtitle="Esprime un'emozione o richiama l'attenzione, spesso fuori dalla struttura della frase."
          data={INTERJECTIONS}
          customData={customSimplePos.interjections}
          genLoading={simplePosGenLoading}
          genError={simplePosGenError}
          onGenerate={generateSimplePosItem}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "syntax" ? (
        <AnalisiSintatticaView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customSyntax={customSyntax}
          syntaxGenLoading={syntaxGenLoading}
          syntaxGenError={syntaxGenError}
          onGenerateSyntax={generateSyntaxSentence}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "insidie" ? (
        <InsidieItalianiView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} />
      ) : view === "reggenza" ? (
        <ReggenzaCasiView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} customReggenza={customReggenza} genLoading={reggenzaGenLoading} genError={reggenzaGenError} onGenerate={generateReggenza} />
      ) : view === "voce" ? (
        <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
          <SectionBackButton onBack={() => setView("home")} />
          <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 14 }}>
            🔊 Impostazioni voce
          </h2>
            {!TTS_SUPPORTED ? (
              <div style={{ opacity: 0.6 }}>Il tuo browser non supporta la sintesi vocale.</div>
            ) : (
              <>
                {voiceOptions.length > 0 ? (
                  <>
                    <div style={{ opacity: 0.6, marginBottom: 4 }}>Voce russa</div>
                    <select
                      value={ttsSettings.voiceURI || ""}
                      onChange={(e) => updateTtsSettings({ voiceURI: e.target.value || null })}
                      style={{
                        width: "100%",
                        background: "#1B2430",
                        color: "#F0EAD8",
                        border: "1px solid rgba(240,234,216,0.2)",
                        borderRadius: 6,
                        padding: 6,
                        marginBottom: 10,
                        fontSize: TEXT_SIZES.body,
                      }}
                    >
                      <option value="">Automatica (migliore disponibile)</option>
                      {voiceOptions.map((v) => (
                        <option key={v.voiceURI} value={v.voiceURI}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <div style={{ opacity: 0.6, marginBottom: 8 }}>
                    Nessuna voce russa trovata sul dispositivo. Su Chrome o Edge di solito ce ne sono di più naturali
                    che su altri browser.
                  </div>
                )}
                <div style={{ opacity: 0.6, marginBottom: 4 }}>
                  Velocità: {ttsSettings.rate.toFixed(2)}×
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.15"
                  step="0.02"
                  value={ttsSettings.rate}
                  onChange={(e) => updateTtsSettings({ rate: parseFloat(e.target.value) })}
                  style={{ width: "100%" }}
                />
                <button
                  onClick={async () => {
                    setTestLoading(true);
                    setPremiumError(null);
                    await playAudio(
                      "Привет! Как поживаешь? Очень приятно с тобой познакомиться.",
                      { ttsSettings, premium },
                      (msg) => setPremiumError(msg)
                    );
                    setTestLoading(false);
                  }}
                  disabled={testLoading}
                  style={{
                    marginTop: 10,
                    background: "#5B84B1",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    color: "#1B2430",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.body,
                    cursor: "pointer",
                    opacity: testLoading ? 0.6 : 1,
                  }}
                >
                  {testLoading ? <>Genero l'audio…<LoadingDots /></> : "Prova la voce"}
                </button>
                <div style={{ opacity: 0.45, marginTop: 8, fontSize: TEXT_SIZES.body }}>
                  La qualità dipende dalle voci installate sul tuo dispositivo/browser: non è un vero madrelingua. Su
                  iOS, scaricare la voce russa "Enhanced/Premium" da Impostazioni → Accessibilità → Contenuto vocale
                  migliora molto. Su Android/Chrome, le voci "Google" sono di solito le migliori.
                </div>

                <div style={{ borderTop: "1px solid rgba(240,234,216,0.15)", marginTop: 14, paddingTop: 12 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: subscription.active ? "pointer" : "default",
                      opacity: subscription.active ? 1 : 0.55,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={premium.useNative}
                      disabled={!subscription.active}
                      onChange={(e) => updatePremium({ useNative: e.target.checked })}
                    />
                    <span style={{ fontSize: TEXT_SIZES.body, fontWeight: 700 }}>
                      Voce madrelingua inclusa {subscription.active ? "" : "(richiede l'abbonamento)"}
                    </span>
                  </label>
                  <div style={{ opacity: 0.6, marginTop: 4, marginBottom: 8 }}>
                    Nessuna chiave da procurarsi: una vera voce madrelingua russa, inclusa nel tuo abbonamento.
                  </div>
                  {!subscription.active && (
                    <button
                      onClick={() => setView("paywall")}
                      style={{
                        background: "none",
                        border: "1px solid #D9A441",
                        color: "#D9A441",
                        borderRadius: 8,
                        padding: "8px 14px",
                        fontSize: TEXT_SIZES.small,
                        fontWeight: 700,
                        cursor: "pointer",
                        marginBottom: 10,
                      }}
                    >
                      Sblocca con l'abbonamento
                    </button>
                  )}
                  {subscription.active && premium.useNative && (
                    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="native-voice-gender"
                          checked={premium.voiceGender !== "male"}
                          onChange={() => updatePremium({ voiceGender: "female" })}
                        />
                        <span style={{ fontSize: TEXT_SIZES.body }}>Voce femminile</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="native-voice-gender"
                          checked={premium.voiceGender === "male"}
                          onChange={() => updatePremium({ voiceGender: "male" })}
                        />
                        <span style={{ fontSize: TEXT_SIZES.body }}>Voce maschile</span>
                      </label>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid rgba(240,234,216,0.15)", marginTop: 14, paddingTop: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={premium.enabled}
                      onChange={(e) => updatePremium({ enabled: e.target.checked })}
                    />
                    <span style={{ fontSize: TEXT_SIZES.body, fontWeight: 700 }}>Voce premium (ElevenLabs) — davvero naturale</span>
                  </label>
                  <div style={{ opacity: 0.5, marginTop: 4, marginBottom: 8, fontSize: TEXT_SIZES.small }}>
                    In alternativa: usa la tua chiave ElevenLabs se preferisci non abbonarti.
                  </div>

                  {premium.enabled && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ opacity: 0.6, marginBottom: 4 }}>Chiave API ElevenLabs</div>
                      <input
                        type="password"
                        value={premium.apiKey}
                        onChange={(e) => updatePremium({ apiKey: e.target.value })}
                        placeholder="sk_..."
                        style={{
                          width: "100%",
                          background: "#1B2430",
                          color: "#F0EAD8",
                          border: "1px solid rgba(240,234,216,0.2)",
                          borderRadius: 6,
                          padding: 6,
                          marginBottom: 8,
                          fontSize: TEXT_SIZES.body,
                        }}
                      />
                      <div style={{ opacity: 0.6, marginBottom: 4 }}>Voce femminile — Voice ID</div>
                      <input
                        type="text"
                        value={premium.voiceId}
                        onChange={(e) => updatePremium({ voiceId: e.target.value })}
                        placeholder={ELEVENLABS_DEFAULT_VOICE}
                        style={{
                          width: "100%",
                          background: "#1B2430",
                          color: "#F0EAD8",
                          border: "1px solid rgba(240,234,216,0.2)",
                          borderRadius: 6,
                          padding: 6,
                          marginBottom: 8,
                          fontSize: TEXT_SIZES.body,
                        }}
                      />
                      <div style={{ opacity: 0.6, marginBottom: 4 }}>Voce maschile — Voice ID (opzionale)</div>
                      <input
                        type="text"
                        value={premium.voiceIdMale || ""}
                        onChange={(e) => updatePremium({ voiceIdMale: e.target.value })}
                        placeholder="incolla qui un Voice ID maschile"
                        style={{
                          width: "100%",
                          background: "#1B2430",
                          color: "#F0EAD8",
                          border: "1px solid rgba(240,234,216,0.2)",
                          borderRadius: 6,
                          padding: 6,
                          marginBottom: 8,
                          fontSize: TEXT_SIZES.body,
                        }}
                      />
                      {premiumError && (
                        <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.body, marginBottom: 8 }}>{premiumError}</div>
                      )}
                      <div style={{ opacity: 0.5, fontSize: TEXT_SIZES.body, lineHeight: 1.5 }}>
                        Per voci russe madrelingua non robotiche: apri la <strong>Voice Library</strong> sul sito
                        elevenlabs.io (non le voci di default, che sono soprattutto inglesi), filtra per lingua
                        "Russian", ascolta i campioni e aggiungi alla tua libreria una voce femminile e una maschile
                        che ti convincono. Poi copia il "Voice ID" di ciascuna (si trova nei tre puntini della voce,
                        "Copy Voice ID") e incollalo qui sopra. Nei Dialoghi con "Ascolta tutto", le due voci si
                        alterneranno automaticamente tra i due interlocutori.
                        <br /><br />
                        Richiede un account ElevenLabs (a pagamento oltre la soglia gratuita). La chiave resta salvata
                        solo nel tuo browser, ma viene inviata al server dell'app ad ogni riproduzione — non
                        direttamente a ElevenLabs, perché ElevenLabs stessa non permette di chiamare la sua API
                        direttamente da un browser (blocca la richiesta per motivi di sicurezza propri, indipendenti
                        da quest'app). Il server la inoltra subito a ElevenLabs e non la salva né la registra da
                        nessuna parte. Chiunque avesse accesso a questo browser potrebbe comunque leggerla: non è uno
                        storage pensato per segreti sensibili.
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid rgba(240,234,216,0.15)", marginTop: 14, paddingTop: 12 }}>
                  {/* ATTENZIONE: sostituisci con un vero indirizzo email prima di pubblicare l'app —
                      questo è un segnaposto, non un indirizzo reale che riceve posta. */}
                  <a
                    href="mailto:SOSTITUISCI-CON-EMAIL-VERA@tuodominio.it?subject=Segnalazione%20contenuto%20generato"
                    style={{ fontSize: TEXT_SIZES.body, color: "#F0EAD8", opacity: 0.55, textDecoration: "underline" }}
                  >
                    🚩 Segnala un problema con un esercizio o pacchetto generato dall'IA
                  </a>
                </div>
              </>
            )}
        </div>
      ) : view === "comparativi" ? (
        <ComparativiView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} customComparativi={customComparativi} genLoading={comparativiGenLoading} genError={comparativiGenError} onGenerate={generateComparativo} />
      ) : view === "participi" ? (
        <ParticipiGerundiView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} customParticipi={customParticipi} genLoading={participiGenLoading} genError={participiGenError} onGenerate={generateParticipio} />
      ) : view === "condizionale" ? (
        <CondizionaleView ttsSettings={ttsSettings} premium={effectivePremium} onBack={() => setView("home")} customCondizionale={customCondizionale} genLoading={condizionaleGenLoading} genError={condizionaleGenError} onGenerate={generateCondizionale} />
      ) : view === "adjectives" ? (
        <AdjectivesView
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          jumpTo={view === "adjectives" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          customAdjectives={customAdjectives}
          onBack={() => setView("home")}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "paywall" ? (
        <PaywallView
          onBack={() => setView("home")}
          onPurchaseComplete={() => {
            setSubscriptionFromStore((prev) => ({ ...prev, active: true }));
            setView("home");
          }}
          devUnlocked={devUnlocked}
          onDevUnlock={handleDevUnlock}
        />
      ) : view === "declensions" ? (
        <DeclensionsView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customNouns={customNouns}
          nounGenLoading={nounGenLoading}
          nounGenError={nounGenError}
          onGenerateNounSet={generateNounSet}
          jumpTo={view === "declensions" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "verbs" ? (
        <VerbsView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customVerbs={customVerbs}
          verbGenLoading={verbGenLoading}
          verbGenError={verbGenError}
          onGenerateVerb={generateVerb}
          jumpTo={view === "verbs" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "phrases" ? (
        <PhrasesView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customPhraseGroups={customPhraseGroups}
          phraseGenLoading={phraseGenLoading}
          phraseGenError={phraseGenError}
          onGeneratePhraseGroup={generatePhraseGroup}
          repeatFlags={repeatFlags}
          onToggleRepeatFlag={toggleRepeatFlag}
          learnedPhrasePackages={learnedPhrasePackages}
          onToggleLearnedPackage={toggleLearnedPhrasePackage}
          onRestartPackage={restartPhrasePackage}
          jumpTo={view === "phrases" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          phraseCaseTags={phraseCaseTags}
          phraseCaseTagLoading={phraseCaseTagLoading}
          phraseCaseTagError={phraseCaseTagError}
          onGeneratePhraseCaseTag={generatePhraseCaseTag}
          extraInterrogative={extraInterrogative}
          interrogativeGenLoading={interrogativeGenLoading}
          onGenerateInterrogative={generateInterrogative}
          allCasesExample={allCasesExample}
          allCasesGenLoading={allCasesGenLoading}
          onGenerateAllCasesExample={generateAllCasesExample}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "compose" ? (
        <ComposeView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          customComposeGroups={customComposeGroups}
          composeGenLoading={composeGenLoading}
          composeGenError={composeGenError}
          onGenerateComposeGroup={generateComposeGroup}
          jumpTo={view === "compose" ? pendingJump : null}
          onConsumeJump={() => setPendingJump(null)}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          phraseCaseTags={phraseCaseTags}
          phraseCaseTagLoading={phraseCaseTagLoading}
          phraseCaseTagError={phraseCaseTagError}
          onGeneratePhraseCaseTag={generatePhraseCaseTag}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "session" ? (
        <SessionView
          onBack={() => setView("home")}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          sessionLevel={sessionLevel}
          sessionSteps={sessionSteps}
          sessionIndex={sessionIndex}
          setSessionIndex={setSessionIndex}
          onGenerateSession={generateSession}
          onSaveSession={saveSession}
          sessionSaved={sessionSaved}
          onShowHistory={() => setView("session-history")}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "session-history" ? (
        <SessionHistoryView onBack={() => setView("session")} />
      ) : view === "corsivo" ? (
        <CursiveWritingView
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          onBack={() => setView("home")}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
          onBumpStreak={bumpStreak}
        />
      ) : view === "conversazione" ? (
        <ConversationView
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          onBack={() => setView("home")}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
          onBumpStreak={bumpStreak}
          onConversationTurn={bumpConversationTurns}
        />
      ) : view === "scrittura-tempo" ? (
        <TimedWritingView
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          onBack={() => setView("home")}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : view === "flashcards" ? (
        <FlashcardView
          card={filteredDeck[cardIndex % (filteredDeck.length || 1)]}
          flipped={flipped}
          setFlipped={setFlipped}
          onReview={reviewCard}
          onToggleMastered={toggleMastered}
          cardIsMastered={(() => {
            const c = filteredDeck[cardIndex % (filteredDeck.length || 1)];
            return c ? (vocabBox[c.key] || 1) >= 5 : false;
          })()}
          count={filteredDeck.length}
          learningCount={learningDeck.length}
          masteredCount={masteredDeck.length}
          fullDeck={deck}
          cardFilter={cardFilter}
          setCardFilter={setCardFilter}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          verbPairsDeck={verbPairsDeck}
          verbPairIndex={verbPairIndex}
          setVerbPairIndex={setVerbPairIndex}
          cardExamples={cardExamples}
          cardExampleLoading={cardExampleLoading}
          cardExampleError={cardExampleError}
          onGenerateCardExample={generateCardExample}
          easyHardCounts={easyHardCounts}
          learnedPackages={learnedPackages}
          onToggleLearnedPackage={toggleLearnedPackage}
          onMarkVerbPairDifficulty={markVerbPairDifficulty}
          onBack={() => setView("home")}
        />
      ) : activeLesson ? (
        <div key={activeLesson.id} className="lesson-nest-in">
        <LessonView
          key={activeLesson.id}
          lesson={activeLesson}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          showGloss={showGloss}
          setShowGloss={setShowGloss}
          quizPicked={quizPicked}
          setQuizPicked={setQuizPicked}
          answer={answer}
          setAnswer={setAnswer}
          feedback={feedback}
          feedbackLoading={feedbackLoading}
          onAskFeedback={() => requestFeedback(activeLesson)}
          productionHintLoading={productionHintLoading}
          productionHintError={productionHintError}
          onRequestProductionHint={() => requestProductionHint(activeLesson)}
          onSaveProgress={() => completeLesson(activeLesson.id)}
          onComplete={() => {
            completeLesson(activeLesson.id);
            setActiveLesson(null);
            setQuizPicked(null);
            setAnswer("");
            setFeedback(null);
            setShowGloss({});
          }}
          onBack={() => {
            setActiveLesson(null);
            setQuizPicked(null);
            setAnswer("");
            setFeedback(null);
            setShowGloss({});
          }}
        />
        </div>
      ) : testLevel ? (
        <TestView
          level={testLevel}
          onBack={() => setTestLevel(null)}
          ttsSettings={ttsSettings}
          premium={effectivePremium}
          onGoToDifficolta={() => {
            setTestLevel(null);
            setView("difficolta");
          }}
        />
      ) : activeSector === "lezioni" ? (
        <HomeView
          openLevel={openLevel}
          setOpenLevel={setOpenLevel}
          completed={progress.completed}
          started={progress.started}
          onOpenLesson={(l) => {
            setActiveLesson(l);
            setProgress((prev) => {
              if (prev.completed.includes(l.id) || prev.started.includes(l.id)) return prev;
              const next = { ...prev, started: [...prev.started, l.id] };
              saveJSON("progress", next);
              return next;
            });
          }}
          allLessonsFor={allLessonsFor}
          genLoading={genLoading}
          genError={genError}
          genSuccess={genSuccess}
          onGenerateOne={generateLesson}
          onGenerateBatch={generateBatch}
          onOpenTest={(lvl) => setTestLevel(lvl)}
          activeSector={activeSector}
          unlocked={subscription.active}
          onGoToPaywall={() => setView("paywall")}
        />
      ) : null}
      </div>
      )}
      </div>

      {guidedSession && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#1B2430",
            borderTop: "2px solid #D9A441",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 50,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
              Giorno {guidedSession.day} · {guidedSession.index + 1} di {guidedSession.activities.length}
            </div>
            <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {guidedSession.activities[guidedSession.index]?.label}
            </div>
          </div>
          <button
            onClick={exitGuidedSession}
            style={{ background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 8, padding: "8px 12px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
          >
            Esci
          </button>
          <button
            onClick={markGuidedDoneAndAdvance}
            style={{
              background: "#D9A441",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              color: "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {guidedSession.index + 1 >= guidedSession.activities.length ? "Prossima sessione →" : "Prossimo esercizio →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Home / matryoshka selector ----------

const LESSON_TOPICS = [
  "Persone e famiglia",
  "Casa",
  "Vita quotidiana",
  "Cibo e ristorante",
  "Lavoro",
  "Scuola e studio",
  "Tempo libero e hobby",
  "Sport e palestra",
  "Viaggi e trasporti",
  "Salute",
  "Città e società",
  "Cultura e lingua",
];

// ---------- Test di livello ----------

function TestView({ level, onBack, ttsSettings: _ttsSettings, premium, onGoToDifficolta }) {
  const allQuestions = LEVEL_TESTS[level] || [];
  const [depth, setDepth] = useState(null);
  // campiona casualmente "depth" domande dall'intero pacchetto (30 per livello), non sempre le prime N:
  // altrimenti rifacendo il test con la stessa profondità capitano sempre le stesse identiche domande.
  const rawQuestions = useMemo(() => {
    if (!depth) return [];
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, depth);
  }, [depth, level]);
  // mescola le opzioni di ogni domanda (nei dati la corretta è sempre la prima) una sola volta per sessione di test
  const questions = useMemo(() => {
    return rawQuestions.map((q) => {
      const opts = q.options.map((o, i) => ({ text: o, wasCorrect: i === q.correct }));
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return { ...q, options: opts.map((o) => o.text), correct: opts.findIndex((o) => o.wasCorrect) };
    });
  }, [depth, level]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [speedMult, setSpeedMult] = useState(1);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (finished && score === questions.length && questions.length > 0) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 2600);
      return () => clearTimeout(t);
    }
  }, [finished]);

  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    const wasCorrect = i === questions[index].correct;
    if (wasCorrect) setScore((s) => s + 1);
    else recordMistake("test", level, null, questions[index].question, questions[index].options[questions[index].correct], null);
    playFeedbackSound(wasCorrect);
  }

  function next() {
    if (index + 1 >= questions.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setAudioError(null);
    }
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
    setDepth(null);
  }

  async function playFullSentence(fullRu) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(fullRu, { ttsSettings, premium }, (msg) => setAudioError(msg));
    setAudioLoading(false);
  }

  if (!depth) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18, textAlign: "center" }}>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
          Test di livello {level}
        </h2>
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 24 }}>Quanto vuoi essere approfondito?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { n: 10, label: "Superficiale", desc: "10 esercizi — un assaggio veloce" },
            { n: 20, label: "Normale", desc: "20 esercizi — copertura equilibrata" },
            { n: 30, label: "Approfondito", desc: "30 esercizi — massima precisione" },
          ]
            .filter((opt) => allQuestions.length >= opt.n)
            .map((opt) => (
              <button
                key={opt.n}
                onClick={() => setDepth(opt.n)}
                style={{
                  background: "#232E3D",
                  border: "1px solid rgba(240,234,216,0.15)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  color: "#F0EAD8",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.emphasisLarge }}>{opt.label} — {opt.n} esercizi</div>
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 2 }}>{opt.desc}</div>
              </button>
            ))}
        </div>
        <button onClick={onBack} style={{ display: "block", margin: "20px auto 0", background: "none", border: "none", color: "#F0EAD8", opacity: 0.5, fontSize: TEXT_SIZES.body, cursor: "pointer" }}>
          Annulla
        </button>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <p style={{ opacity: 0.6, textAlign: "center" }}>Test non disponibile per questo livello.</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const feedback =
      pct >= 80
        ? "Ottimo! Conosci bene questo livello — potresti provare il successivo."
        : pct >= 50
        ? "Buon lavoro. Qualche punto da ripassare, ma sei sulla strada giusta."
        : "Ti conviene ripassare ancora un po' le lezioni di questo livello.";
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "40px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {showConfetti && <Confetti />}
        <div style={{ fontSize: TEXT_SIZES.hero2XL, marginBottom: 10 }}>📝</div>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, marginBottom: 6 }}>
          {score} / {questions.length}
        </h2>
        <p style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginBottom: 24 }}>{feedback}</p>
        {score < questions.length && (
          <button
            onClick={onGoToDifficolta}
            style={{
              width: "100%",
              background: "rgba(217,164,65,0.15)",
              border: "1px solid #D9A441",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            🎯 Esercitati sugli errori di questo test ({questions.length - score})
          </button>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            onClick={restart}
            style={{ background: "rgba(154,107,158,0.2)", border: "1px solid #9A6B9E", borderRadius: 10, padding: "10px 18px", color: "#9A6B9E", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
          >
            Rifai il test
          </button>
          <button
            onClick={onBack}
            style={{ background: "none", border: "1px solid rgba(240,234,216,0.3)", borderRadius: 10, padding: "10px 18px", color: "#F0EAD8", fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];
  const fullRu = question.question.replace("___", question.options[question.correct]);
  const revealed = picked !== null;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer", marginBottom: 10 }}>
        ← Indietro
      </button>
      <h2 className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, marginBottom: 4 }}>
        Test di livello {level}
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginBottom: 14 }}>
        Domanda {index + 1} di {questions.length}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 16,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
            reimposta
          </button>
        )}
      </div>

      <div style={{ height: 6, background: "#232E3D", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(index / questions.length) * 100}%`, background: "#9A6B9E", transition: "width 0.2s ease" }} />
      </div>

      <div key={index} className="lesson-nest-in" style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.1)", borderRadius: 14, padding: 18 }}>
        <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 14 }}>{question.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {question.options.map((opt, i) => {
            const isCorrect = i === question.correct;
            const isPicked = i === picked;
            let bg = "#1B2430";
            if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
            else if (revealed && isPicked && !isCorrect) bg = "rgba(193,84,60,0.35)";
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                style={{
                  background: bg,
                  border: "1px solid rgba(240,234,216,0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#F0EAD8",
                  textAlign: "left",
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: revealed ? "default" : "pointer",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(240,234,216,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.9 }}>{fullRu}</div>
              <button
                onClick={() => playFullSentence(fullRu)}
                disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta" title="Ascolta"
                style={{ ...iconBtnStyle, width: 30, height: 30, flexShrink: 0 }}
              >
                <Volume2 size={14} />
              </button>
            </div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, fontStyle: "italic", marginTop: 4 }}>{question.answer_it}</div>
            {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 4 }}>{audioError}</div>}
          </div>
        )}
      </div>

      {picked !== null && (
        <button
          onClick={next}
          style={{
            width: "100%",
            marginTop: 16,
            background: "#9A6B9E",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.emphasisLarge,
            cursor: "pointer",
          }}
        >
          {index + 1 >= questions.length ? "Vedi il risultato →" : "Avanti →"}
        </button>
      )}
    </div>
  );
}

function HomeView({
  openLevel,
  setOpenLevel,
  completed,
  started,
  onOpenLesson,
  allLessonsFor,
  genLoading,
  genError,
  genSuccess,
  onGenerateOne,
  onGenerateBatch,
  onOpenTest,
  activeSector,
  unlocked,
  onGoToPaywall,
}) {
  const [showTopicPicker, setShowTopicPicker] = useState(false);
  const [showToComplete, setShowToComplete] = useState(false);

  function pickTopic(topic) {
    setShowTopicPicker(false);
    onGenerateOne(openLevel, topic);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "10px 18px 60px", background: "rgba(0,31,91,0.82)", ...homeWatermarkStyle, borderRadius: 18 }}>
      {openLevel && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <button
            onClick={() => setOpenLevel(null)}
            title="Torna all'inizio"
            style={{
              background: "rgba(240,234,216,0.08)",
              border: "1px solid rgba(240,234,216,0.2)",
              borderRadius: 20,
              padding: "6px 16px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🏠 Torna all'inizio
          </button>
        </div>
      )}
      {activeSector === "lezioni" && (() => {
        const completedLevels = LEVELS.map((l) => l.id).filter((id) =>
          allLessonsFor(id).some((les) => completed.includes(les.id))
        );
        const currentLevel = completedLevels[completedLevels.length - 1] || "A1";
        const nextLesson = allLessonsFor(currentLevel).find((les) => !completed.includes(les.id));
        if (!nextLesson) return null;
        return (
          <button
            onClick={() => {
              playNavigationSound();
              onOpenLesson(nextLesson);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn-3d"
            style={{
              display: "block",
              width: "100%",
              maxWidth: 460,
              margin: "0 auto 14px",
              background: "rgba(91,132,177,0.12)",
              border: "1px solid rgba(91,132,177,0.4)",
              borderRadius: 14,
              padding: "12px 16px",
              color: "#F0EAD8",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>
              📖 Continua con: {nextLesson.title}
            </div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginTop: 2 }}>{nextLesson.subtitle} →</div>
          </button>
        );
      })()}

      {activeSector === "lezioni" && (() => {
        const toComplete = (started || [])
          .filter((id) => !completed.includes(id))
          .map((id) => {
            const levelId = (id.split("-")[0] || "").toUpperCase();
            return allLessonsFor(levelId).find((l) => l.id === id);
          })
          .filter(Boolean);
        if (toComplete.length === 0) return null;
        return (
          <button
            onClick={() => setShowToComplete(true)}
            className="btn-3d"
            style={{
              display: "block",
              width: "100%",
              maxWidth: 460,
              margin: "0 auto 14px",
              background: "rgba(217,164,65,0.1)",
              border: "1px solid rgba(217,164,65,0.35)",
              borderRadius: 14,
              padding: "10px 16px",
              color: "#D9A441",
              textAlign: "center",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            📑 Lezioni da completare ({toComplete.length})
          </button>
        );
      })()}

      {showToComplete && (() => {
        const toComplete = (started || [])
          .filter((id) => !completed.includes(id))
          .map((id) => {
            const levelId = (id.split("-")[0] || "").toUpperCase();
            return allLessonsFor(levelId).find((l) => l.id === id);
          })
          .filter(Boolean);
        return (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 130,
              backgroundColor: "rgba(6,21,48,0.95)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "60px 20px 20px",
              overflowY: "auto",
            }}
            onClick={() => setShowToComplete(false)}
          >
            <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, color: "#D9A441", marginBottom: 16 }}>
              📑 Lezioni da completare
            </h2>
            <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", gap: 10 }}>
              {toComplete.length === 0 ? (
                <div style={{ color: "#F0EAD8", opacity: 0.6, textAlign: "center" }}>
                  Nessuna lezione in sospeso — tutte quelle iniziate sono già completate.
                </div>
              ) : (
                toComplete.map((l) => (
                  <button
                    key={l.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowToComplete(false);
                      playNavigationSound();
                      onOpenLesson(l);
                    }}
                    className="btn-3d"
                    style={{
                      display: "block",
                      width: "100%",
                      background: "#232E3D",
                      border: "1px solid rgba(240,234,216,0.15)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      color: "#F0EAD8",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>{l.title}</div>
                    <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginTop: 2 }}>{l.subtitle} →</div>
                  </button>
                ))
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowToComplete(false); }}
              style={{
                marginTop: 20,
                background: "none",
                border: "1px solid rgba(240,234,216,0.4)",
                borderRadius: 10,
                padding: "10px 24px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              Chiudi
            </button>
          </div>
        );
      })()}

      {activeSector === "lezioni" && (
        <div style={{ position: "relative", height: 330, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 8, marginTop: openLevel ? 36 : 8 }}>
          {[...LEVELS].reverse().map((lvl, i) => (
            <div
              key={lvl.id}
              role="button"
              tabIndex={0}
              aria-label={`Livello ${lvl.id} — ${lvl.label}`}
              onClick={() => setOpenLevel(openLevel === lvl.id ? null : lvl.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              className="doll-cascade-in"
              style={{
                position: "absolute",
                bottom: 0,
                width: lvl.size,
                height: lvl.size * 1.15,
                borderRadius: "50% 50% 46% 46%",
                background: lvl.color,
                opacity: openLevel && openLevel !== lvl.id ? 0.35 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 12,
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                animationDelay: `${i * 0.08}s`,
                boxShadow: "inset 0 -14px 24px rgba(0,0,0,0.18)",
              }}
            >
              <div
                className="display"
                style={{
                  fontWeight: 700,
                  fontSize: lvl.size > 225 ? TEXT_SIZES.sectionTitle : lvl.size > 162 ? TEXT_SIZES.cardTitleMedium : lvl.size > 112 ? TEXT_SIZES.subtitle : TEXT_SIZES.body,
                  color: readableTextColor(lvl.color),
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {lvl.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {openLevel && (
        <p style={{ textAlign: "center", fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, color: LEVELS.find((l) => l.id === openLevel)?.color, marginBottom: 4 }}>
          {LEVELS.find((l) => l.id === openLevel)?.label}
        </p>
      )}

      {openLevel &&
        (() => {
          const lessonsForLevel = allLessonsFor(openLevel);
          const doneCount = lessonsForLevel.filter((l) => completed.includes(l.id)).length;
          const pct = lessonsForLevel.length ? Math.round((doneCount / lessonsForLevel.length) * 100) : 0;
          return (
            <div style={{ maxWidth: 260, margin: "0 auto 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 3 }}>
                <span>Progresso lezioni</span>
                <span>
                  {doneCount}/{lessonsForLevel.length} ({pct}%)
                </span>
              </div>
              <div style={{ height: 6, background: "#232E3D", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: LEVELS.find((l) => l.id === openLevel)?.color || "#D9A441",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          );
        })()}

      {activeSector === "lezioni" && (
        <p style={{ textAlign: "center", fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.55, marginBottom: 12 }}>
          Tocca una matrioska per aprire il suo livello
        </p>
      )}

      {openLevel && (
        <div className="doll-open">
          {!isLevelFree(openLevel) && !unlocked ? (
            <LevelLockWall levelId={openLevel} onUnlock={onGoToPaywall} />
          ) : LEVELS.find((l) => l.id === openLevel).ready ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.55 }}>
                  {allLessonsFor(openLevel).length} lezioni
                </span>
              </div>

              {(() => {
                const lessons = allLessonsFor(openLevel);
                const grouped = {};
                for (const lesson of lessons) {
                  const t = lesson.topic || "Altro";
                  if (!grouped[t]) grouped[t] = [];
                  grouped[t].push(lesson);
                }
                const orderedTopics = [...LESSON_TOPICS.filter((t) => grouped[t]), ...Object.keys(grouped).filter((t) => !LESSON_TOPICS.includes(t))];
                return orderedTopics.map((topic) => (
                  <div key={topic} style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, margin: "10px 0 6px" }}>
                      {topic}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {grouped[topic].map((lesson) => {
                        const done = completed.includes(lesson.id);
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onOpenLesson(lesson)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#232E3D",
                              border: "1px solid rgba(240,234,216,0.12)",
                              borderRadius: 12,
                              padding: "14px 16px",
                              color: "#F0EAD8",
                              textAlign: "left",
                              cursor: "pointer",
                            }}
                          >
                            <div>
                              <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>
                                {lesson.title}
                              </div>
                              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{lesson.subtitle}</div>
                            </div>
                            {done ? <Check size={18} color="#7C8C6B" /> : <ChevronRight size={18} opacity={0.5} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}

              {!showTopicPicker ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
                  <button
                    onClick={() => setShowTopicPicker(true)}
                    disabled={genLoading[openLevel]}
                    style={{
                      background: "rgba(217,164,65,0.15)",
                      border: "1px solid rgba(217,164,65,0.4)",
                      borderRadius: 10,
                      padding: "10px 20px",
                      color: "#D9A441",
                      fontSize: TEXT_SIZES.bodyLarge,
                      fontWeight: 700,
                      cursor: "pointer",
                      opacity: genLoading[openLevel] ? 0.5 : 1,
                    }}
                  >
                    {genLoading[openLevel] ? <>Genero…<LoadingDots /></> : "+ Genera nuova lezione"}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: "#232E3D",
                    border: "1px solid rgba(217,164,65,0.35)",
                    borderRadius: 12,
                    padding: 14,
                    marginTop: 6,
                  }}
                >
                  <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 10, textAlign: "center" }}>
                    Su quale argomento vuoi la nuova lezione?
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {LESSON_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => pickTopic(topic)}
                        style={{
                          background: "rgba(91,132,177,0.15)",
                          border: "1px solid rgba(91,132,177,0.4)",
                          borderRadius: 14,
                          padding: "6px 12px",
                          color: "#F0EAD8",
                          fontSize: TEXT_SIZES.body,
                          cursor: "pointer",
                        }}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                    <button
                      onClick={() => setShowTopicPicker(false)}
                      style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.5, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}
              {genSuccess[openLevel] && (
                <div style={{ fontSize: TEXT_SIZES.body, color: "#7C8C6B", textAlign: "center", fontWeight: 700 }}>
                  ✓ Lezione aggiunta: {genSuccess[openLevel]}
                </div>
              )}
              {genError[openLevel] && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center" }}>{genError[openLevel]}</div>
                  <button
                    onClick={() => onGenerateOne(openLevel)}
                    disabled={genLoading[openLevel]}
                    style={{
                      background: "none",
                      border: "1px solid #C1543C",
                      borderRadius: 8,
                      padding: "3px 10px",
                      color: "#C1543C",
                      fontSize: TEXT_SIZES.body,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🔄 Riprova
                  </button>
                </div>
              )}
              <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, textAlign: "center", marginTop: 2 }}>
                Ogni lezione è generata dall'IA e salvata per sempre — puoi generarne quante ne vuoi, senza limite.
              </p>

              <div style={{ borderTop: "1px solid rgba(240,234,216,0.12)", marginTop: 10, paddingTop: 14, display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => onOpenTest(openLevel)}
                  style={{
                    background: "rgba(154,107,158,0.15)",
                    border: "1px solid rgba(154,107,158,0.4)",
                    borderRadius: 10,
                    padding: "10px 20px",
                    color: "#9A6B9E",
                    fontSize: TEXT_SIZES.bodyLarge,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  📝 Test di livello
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 24,
                border: "1px dashed rgba(240,234,216,0.25)",
                borderRadius: 12,
                fontSize: TEXT_SIZES.bodyLarge,
                opacity: 0.6,
              }}
            >
              Contenuti in arrivo per il livello {openLevel}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Declensions reference ----------

function AdjectivesView({ ttsSettings, premium, jumpTo, onConsumeJump, learnedPackages, onToggleLearnedPackage, customAdjectives, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const adjs = [...(ADJECTIVES[level] || []), ...((customAdjectives && customAdjectives[level]) || [])];

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  const current = adjs[Math.min(packageIndex, Math.max(0, adjs.length - 1))];
  const isLast = packageIndex >= adjs.length - 1;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Aggettivi — concordanza totale
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Gli aggettivi cambiano genere, numero e caso insieme al sostantivo che accompagnano.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.bodyLarge,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : !adjs.length ? (
        <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>
          Contenuti in arrivo per il livello {level}.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button
              onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
              disabled={packageIndex === 0}
              style={pkgNavBtnStyle(packageIndex === 0)}
            >
              ◀
            </button>
            <PackageJumpInput index={packageIndex} total={adjs.length} onJump={setPackageIndex} />
            <button
              onClick={() => setPackageIndex((i) => Math.min(adjs.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <AdjectiveCard data={current} level={level} adjIndex={packageIndex} ttsSettings={ttsSettings} premium={premium} />
          <LearnedPackageButton sectionId="aggettivi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
        </>
      )}
    </div>
  );
}

function AdjectiveCard({ data, level, adjIndex, ttsSettings: _ttsSettings, premium }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [transformPicked, setTransformPicked] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  // mescola le opzioni del quiz "trasforma" (nei dati la corretta è sempre la prima)
  const shuffledTransform = useMemo(() => {
    const t = data.transform;
    if (!t) return null;
    const opts = t.options.map((o, i) => ({ text: o, wasCorrect: i === t.correct }));
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...t, options: opts.map((o) => o.text), correct: opts.findIndex((o) => o.wasCorrect) };
  }, [data.transform]);

  useEffect(() => {
    setTransformPicked(null);
  }, [data]);

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  function FormRow({ f, formKey }) {
    return (
      <div
        style={{
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.1)",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{f.label}</span>
          <span className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, color: "#D9A441" }}>
            {f.form} <span style={{ opacity: 0.6 }}>{f.noun}</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{f.example_ru}</div>
            <PronunciationHint text={f.example_ru} />
            <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{f.example_it}</div>
            {audioError[formKey] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError[formKey]}</div>}
          </div>
          <button
            onClick={() => play(formKey, f.example_ru)}
            disabled={audioLoading[formKey] || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta" title="Ascolta"
            style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
          >
            <Volume2 size={12} />
          </button>
        </div>
      </div>
    );
  }

  const t = shuffledTransform;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
            reimposta
          </button>
        )}
      </div>

      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, fontWeight: 700 }}>
            {data.word} <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
          </div>
          <button
            onClick={() => play("baseWord", data.word)}
            disabled={audioLoading.baseWord || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label={`Ascolta ${data.word}`} title={`Ascolta ${data.word}`}
            style={{ ...iconBtnStyle, width: 28, height: 28 }}
          >
            <Volume2 size={13} />
          </button>
        </div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
      </div>

      <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#5B84B1", marginBottom: 6 }}>
        Genere e numero
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {data.genderForms.map((f, i) => (
          <FormRow key={i} f={f} formKey={`${level}-${adjIndex}-g-${i}`} />
        ))}
      </div>

      <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#D9A441", marginBottom: 6 }}>
        Casi (maschile)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.caseForms.map((f, i) => (
          <FormRow key={i} f={f} formKey={`${level}-${adjIndex}-c-${i}`} />
        ))}
      </div>

      {t && (
        <div
          style={{
            marginTop: 16,
            background: "rgba(217,164,65,0.1)",
            border: "1px solid rgba(217,164,65,0.35)",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 8 }}>🔄 Trasforma la frase</div>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 4 }}>{t.promptRu}</div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 10, fontStyle: "italic" }}>{t.promptIt}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {t.options.map((opt, i) => {
              const isCorrect = i === t.correct;
              const revealed = transformPicked !== null;
              let bg = "#1B2430";
              if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
              else if (revealed && i === transformPicked && !isCorrect) bg = "rgba(193,84,60,0.35)";
              return (
                <button
                  key={i}
                  onClick={() => {
                    setTransformPicked(i);
                    const wasCorrect = i === t.correct;
                    playFeedbackSound(wasCorrect);
                    if (!wasCorrect) {
                      recordMistake("aggettivi", level, null, t.promptIt, t.options[t.correct], t.targetCase);
                    }
                  }}
                  disabled={revealed}
                  style={{
                    background: bg,
                    border: "1px solid rgba(240,234,216,0.12)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    color: "#F0EAD8",
                    textAlign: "left",
                    fontSize: TEXT_SIZES.bodyLarge,
                    cursor: revealed ? "default" : "pointer",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {transformPicked !== null && (
            <div style={{ marginTop: 12, background: "#1B2430", border: "1px solid rgba(217,164,65,0.3)", borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: TEXT_SIZES.small, fontWeight: 700, color: "#D9A441", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                {t.targetCase} — frase completa
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, flex: 1 }}>{t.fullRu}</div>
                <button
                  onClick={() => play("transform-full", t.fullRu)}
                  disabled={audioLoading["transform-full"] || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label="Ascolta la frase completa" title="Ascolta la frase completa"
                  style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0 }}
                >
                  <Volume2 size={13} />
                </button>
              </div>
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, fontStyle: "italic", marginTop: 4 }}>{t.fullIt}</div>
              {audioError["transform-full"] && (
                <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 4 }}>{audioError["transform-full"]}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PROGRAMMA_SECTIONS = [
  { id: "declensions", label: "📖 Nomi", minutes: 8 },
  { id: "verbs", label: "🗣️ Verbi", minutes: 10 },
  { id: "adjectives", label: "🎨 Aggettivi", minutes: 8 },
  { id: "pronouns", label: "👤 Pronomi", minutes: 6 },
  { id: "prepositions", label: "🔗 Preposizioni", minutes: 6 },
  { id: "phrases", label: "💬 Frasi", minutes: 8 },
  { id: "compose", label: "🧩 Componi", minutes: 8 },
  { id: "dialogues", label: "🎭 Dialoghi", minutes: 10 },
  { id: "flashcards", label: "📇 Carte", minutes: 5 },
];

// Calcola quante "unità" (pacchetti/coppie/gruppi) esistono DAVVERO per una sezione e un livello,
// leggendo direttamente le strutture dati reali invece di usare numeri fissi che invecchiano
// ogni volta che il contenuto viene ampliato: altrimenti il cursore avrebbe ricominciato a
// ripetere gli stessi esercizi molto prima di aver esaurito quelli davvero disponibili.
function getSectionUnitCount(sectionId, level) {
  switch (sectionId) {
    case "declensions":
      return DECLENSIONS[level]?.length || 1;
    case "verbs":
      return VERBS[level]?.length || 1;
    case "adjectives":
      return ADJECTIVES[level]?.length || 1;
    case "prepositions":
      return PREPOSITIONS[level]?.length || 1;
    case "phrases":
      return PHRASE_GROUPS[level]?.length || 1;
    case "compose":
      return COMPOSE_GROUPS[level]?.length || 1;
    case "dialogues":
      return DIALOGUES[level]?.length || 1;
    case "pronouns":
      return PRONOUNS?.length || 1;
    case "flashcards":
      // il mazzo di carte aggrega vocabolario da più fonti: usiamo una stima ampia e prudente
      return 60;
    default:
      return 9;
  }
}

function generateStudyPlan(minutesPerDay, daysPerWeek, level, startIdx, packageCursors) {
  const plan = [];
  let sectionIdx = startIdx || 0;
  const cursors = { ...packageCursors };
  for (let day = 1; day <= daysPerWeek; day++) {
    let remaining = minutesPerDay;
    const activities = [];
    let guard = 0;
    while (remaining >= 5 && guard < 20) {
      const section = PROGRAMMA_SECTIONS[sectionIdx % PROGRAMMA_SECTIONS.length];
      if (section.minutes <= remaining) {
        const unitCount = getSectionUnitCount(section.id, level);
        const packageIndex = (cursors[section.id] || 0) % unitCount;
        cursors[section.id] = (cursors[section.id] || 0) + 1;
        activities.push({ ...section, level, packageIndex });
        remaining -= section.minutes;
      } else {
        break;
      }
      sectionIdx++;
      guard++;
    }
    plan.push({ day, activities, totalMinutes: minutesPerDay - remaining });
  }
  return { plan, endIdx: sectionIdx, endCursors: cursors };
}

const SECTION_LABELS_MISTAKES = {
  verbi: "🗣️ Verbi",
  aggettivi: "🎨 Aggettivi",
  componi: "🧩 Componi",
  dialoghi: "🎭 Dialoghi",
  test: "📝 Test di livello",
  conversazione: "💬 Conversazione",
  "lezioni-come-si-dice": "📖 Come si dice",
  "carte-quiz": "🗂️ Carte",
  casi: "📖 Casi",
  frasi: "📝 Frasi",
  "lezioni-frase": "📖 Lezioni",
  "numerale-scrivi": "🔢 Numeri",
  preposizioni: "🔗 Preposizioni",
  "pronomi-frasi": "👤 Pronomi",
  sintassi: "📐 Sintassi",
  "produzione-scritta": "⏱️ Scrittura a tempo",
};

// Errori tipici che gli italiani commettono imparando il russo, per interferenza dalla
// lingua madre — diversi dalle "Insidie per italiani" (che spiegano concetti grammaticali):
// qui invece sono frasi SBAGLIATE realistiche + correzione, basate su fenomeni di
// interferenza documentati (falsi amici, calchi di preposizioni, genere grammaticale
// diverso, aspetto verbale, accento imprevedibile, ordine aggettivo-sostantivo).
const ERRORI_TIPICI_ITALIANI = [
  {
    title: "Falsi amici",
    wrong_ru: "Я иду́ в магази́н, что́бы купи́ть мате́рию.",
    wrong_it: "(errato, calco) Vado al magazzino per comprare la materia.",
    correct_ru: "Я иду́ в магази́н, что́бы купи́ть ткань.",
    correct_it: "Vado al negozio per comprare della stoffa.",
    explanation_it: "«Магази́н» assomiglia a \"magazzino\" ma significa semplicemente \"negozio\". «Мате́рия» esiste ma nel senso filosofico di \"materia\"; il tessuto si dice «ткань».",
  },
  {
    title: "Preposizioni calcate dall'italiano",
    wrong_ru: "Я ду́маю к тебе́.",
    wrong_it: "(errato, calco da \"penso a te\")",
    correct_ru: "Я ду́маю о тебе́.",
    correct_it: "Penso a te.",
    explanation_it: "In italiano si \"pensa A qualcuno\"; in russo il verbo ду́мать regge sempre «о» + prepositivo, mai «к». Le preposizioni russe non seguono la logica di quelle italiane, verbo per verbo vanno imparate a memoria.",
  },
  {
    title: "Aspetto verbale: sempre imperfettivo",
    wrong_ru: "Вчера́ я де́лал дома́шнее зада́ние и зако́нчил его́.",
    wrong_it: "(impreciso: suona come un'azione mai davvero completata)",
    correct_ru: "Вчера́ я сде́лал дома́шнее зада́ние.",
    correct_it: "Ieri ho fatto (completato) i compiti.",
    explanation_it: "Chi parla italiano tende a usare sempre l'imperfettivo perché \"suona come il passato prossimo\" a cui siamo abituati. Ma per un'azione conclusa con un risultato, il russo richiede il perfettivo — qui сде́лал, non де́лал.",
  },
  {
    title: "Genere grammaticale diverso",
    wrong_ru: "Мой пробле́ма реша́ется.",
    wrong_it: "(errato: пробле́ма è femminile, non maschile)",
    correct_ru: "Моя́ пробле́ма реша́ется.",
    correct_it: "Il mio problema si risolve.",
    explanation_it: "«Пробле́ма» finisce in -а come i femminili russi, ed è femminile — coerente con l'italiano \"la problema\"... ma non sempre le parole simili hanno lo stesso genere nelle due lingue: «го́сть» (ospite) è sempre maschile in russo, anche per un'ospite donna si usa spesso la forma al maschile o «го́стья» a parte.",
  },
  {
    title: "Accento tonico imprevedibile",
    wrong_ru: "за́мок e замо́к pronunciati allo stesso modo, senza attenzione all'accento",
    wrong_it: "(l'accento cambia il significato della parola)",
    correct_ru: "за́мок (castello) ≠ замо́к (lucchetto)",
    correct_it: "castello ≠ lucchetto — stessa scrittura, accento diverso",
    explanation_it: "In italiano l'accento è quasi sempre prevedibile (di solito sulla penultima sillaba). In russo è libero e imprevedibile, e può persino cambiare il significato della parola o spostarsi tra le forme dello stesso vocabolo — va imparato insieme a ogni parola nuova, non dedotto da una regola.",
  },
  {
    title: "Ordine aggettivo-sostantivo",
    wrong_ru: "кни́га интере́сная (come titolo/presentazione)",
    wrong_it: "(naturale in italiano: \"un libro interessante\")",
    correct_ru: "интере́сная кни́га",
    correct_it: "un libro interessante",
    explanation_it: "In italiano l'aggettivo spesso segue il sostantivo (\"libro interessante\"). In russo l'aggettivo attributivo precede quasi sempre il sostantivo: интере́сная кни́га, non кни́га интере́сная (quest'ultima forma esiste ma è predicativa: \"il libro È interessante\", tutt'altra cosa).",
  },
  {
    title: "Ты/вы non coincide sempre con tu/Lei",
    wrong_ru: "uso di «ты» con sconosciuti adulti, per abitudine al \"tu\" italiano informale",
    wrong_it: "(l'italiano usa il \"tu\" più liberamente del russo)",
    correct_ru: "Здра́вствуйте, вы не подска́жете...?",
    correct_it: "Buongiorno, non è che potrebbe indicarmi...?",
    explanation_it: "Il russo è generalmente più formale del confine italiano tra \"tu\" e \"Lei\": con sconosciuti adulti, negozianti, colleghi non stretti, si usa quasi sempre «вы» anche in situazioni dove un italiano passerebbe naturalmente al \"tu\".",
  },
  {
    title: "Genitivo di negazione dimenticato",
    wrong_ru: "У меня́ нет вре́мя.",
    wrong_it: "(errato: dopo нет il sostantivo va al genitivo)",
    correct_ru: "У меня́ нет вре́мени.",
    correct_it: "Non ho tempo.",
    explanation_it: "In italiano la negazione non cambia il caso del sostantivo. In russo, dopo «нет» (non c'è/non ho), il sostantivo va obbligatoriamente al genitivo: вре́мя diventa вре́мени, non resta al nominativo come farebbe pensare l'istinto italiano.",
  },
];

function DifficoltaView({ ttsSettings, premium, onBack, customErroriTipici, erroreGenLoading, erroreGenError, onGenerateErroreTipico }) {
  const [tab, setTab] = useState("mie"); // "mie" | "tipici"
  const [erroreIndex, setErroreIndex] = useState(0);
  const [erroreAudioLoading, setErroreAudioLoading] = useState(false);
  const [erroreAudioError, setErroreAudioError] = useState(null);
  const [queue, setQueue] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [errorInsights, setErrorInsights] = useState([]);

  async function playErrore(text) {
    setErroreAudioLoading(true);
    setErroreAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setErroreAudioError);
    setErroreAudioLoading(false);
  }

  useEffect(() => {
    (async () => {
      const q = await loadJSON("mistakes-queue", []);
      const now = Date.now();
      // solo le voci "dovute" oggi (la cui data di prossima revisione è già passata),
      // le più in ritardo per prime — niente più rimozione definitiva: le voci restano
      // nella coda per sempre, semplicemente con intervalli sempre più lunghi via via
      // che vengono ricordate correttamente più volte di seguito.
      const due = q.filter((m) => !m.nextReview || m.nextReview <= now);
      due.sort((a, b) => (a.nextReview || 0) - (b.nextReview || 0));
      setQueue(due);
      setTotalCount(q.length);
      // Insight sui pattern di errore: aggrega TUTTA la coda (non solo le voci
      // dovute oggi) per sezione, pesando ogni voce col numero di volte in cui è
      // stata risbagliata dopo un ripasso (lapses, già tracciato da scheduleReview)
      // — non solo quante voci esistono, ma quanto SPESSO si continua a sbagliarle.
      const bySection = {};
      for (const m of q) {
        const weight = 1 + (m.lapses || 0);
        bySection[m.section] = (bySection[m.section] || 0) + weight;
      }
      const insights = Object.entries(bySection)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([section, weight]) => ({ section, label: SECTION_LABELS_MISTAKES[section] || section, weight }));
      setErrorInsights(insights);
    })();
  }, []);

  async function play(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  async function markResult(knewIt) {
    const current = queue[index];
    const fullQueue = await loadJSON("mistakes-queue", []);
    const idx = fullQueue.findIndex((m) => m.id === current.id);
    if (idx >= 0) {
      scheduleReview(fullQueue[idx], knewIt);
      await saveJSON("mistakes-queue", fullQueue);
    }
    playFeedbackSound(knewIt);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  if (queue === null) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 18px", textAlign: "center", opacity: 0.6 }}>Carico…</div>
    );
  }

  const tabSwitcher = (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <button
        onClick={() => setTab("mie")}
        style={{
          flex: 1,
          background: tab === "mie" ? "#9A6B9E" : "#232E3D",
          border: "1px solid #9A6B9E",
          borderRadius: 10,
          padding: "8px 10px",
          color: tab === "mie" ? "#1B2430" : "#F0EAD8",
          fontWeight: tab === "mie" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        I miei errori
      </button>
      <button
        onClick={() => setTab("tipici")}
        style={{
          flex: 1,
          background: tab === "tipici" ? "#9A6B9E" : "#232E3D",
          border: "1px solid #9A6B9E",
          borderRadius: 10,
          padding: "8px 10px",
          color: tab === "tipici" ? "#1B2430" : "#F0EAD8",
          fontWeight: tab === "tipici" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        Errori tipici per italiani
      </button>
    </div>
  );

  if (tab === "tipici") {
    const allErrori = [...ERRORI_TIPICI_ITALIANI, ...(customErroriTipici || [])];
    const err = allErrori[erroreIndex];
    const isLast = erroreIndex === allErrori.length - 1;
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={onBack} />
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
          Le mie difficoltà
        </h2>
        {tabSwitcher}
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6 }}>
          {erroreIndex + 1} di {allErrori.length} — errori tipici per interferenza dall'italiano, con frase sbagliata e correzione.
        </p>
        <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 14, fontStyle: "italic" }}>
          Qui esempi pratici; per la spiegazione dei concetti dietro vedi "Impara → Perché è così" nella sezione Parti della Frase.
        </p>

        <div style={{ background: "rgba(154,107,158,0.12)", border: "1px solid rgba(154,107,158,0.35)", borderRadius: 12, padding: 18, marginBottom: 16 }}>
          <div style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700, marginBottom: 12 }}>{err.title}</div>

          <div style={{ background: "rgba(193,84,60,0.15)", border: "1px solid rgba(193,84,60,0.3)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.6, marginBottom: 3 }}>❌ Errore tipico</div>
            <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{err.wrong_ru}</div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, fontStyle: "italic", marginTop: 3 }}>{err.wrong_it}</div>
          </div>

          <div style={{ background: "rgba(124,140,107,0.15)", border: "1px solid rgba(124,140,107,0.3)", borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.6, marginBottom: 3 }}>✅ Corretto</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1 }}>{err.correct_ru}</div>
              <button
                onClick={() => playErrore(err.correct_ru)}
                disabled={erroreAudioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta" title="Ascolta"
                style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
              >
                <Volume2 size={12} />
              </button>
            </div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, fontStyle: "italic", marginTop: 3 }}>{err.correct_it}</div>
            {erroreAudioError && <div style={{ fontSize: TEXT_SIZES.tiny, color: "#C1543C", marginTop: 4 }}>{erroreAudioError}</div>}
          </div>

          <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.75, lineHeight: 1.5 }}>💡 {err.explanation_it}</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: isLast ? 10 : 0 }}>
          <button
            onClick={() => setErroreIndex((i) => Math.max(0, i - 1))}
            disabled={erroreIndex === 0}
            style={{ flex: 1, background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: erroreIndex === 0 ? "default" : "pointer", opacity: erroreIndex === 0 ? 0.4 : 1 }}
          >
            ← Precedente
          </button>
          <button
            onClick={() => setErroreIndex((i) => Math.min(allErrori.length - 1, i + 1))}
            disabled={isLast}
            style={{ flex: 1, background: "#9A6B9E", border: "none", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: isLast ? "default" : "pointer", opacity: isLast ? 0.4 : 1 }}
          >
            Successivo →
          </button>
        </div>

        {isLast && (
          <>
            <button
              onClick={onGenerateErroreTipico}
              disabled={erroreGenLoading}
              style={{
                width: "100%",
                marginTop: 10,
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.body,
                cursor: erroreGenLoading ? "default" : "pointer",
              }}
            >
              {erroreGenLoading ? "Cerco un altro errore tipico…" : "+ Genera un altro errore tipico"}
            </button>
            {erroreGenError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{erroreGenError}</div>}
          </>
        )}
      </div>
    );
  }

  const insightsBlock = tab === "mie" && errorInsights.length > 0 && (
    <div style={{ background: "#232E3D", border: "1px solid rgba(154,107,158,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 14, textAlign: "left" }}>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6 }}>📊 I tuoi punti deboli</div>
      {errorInsights.map((ins) => (
        <div key={ins.section} style={{ fontSize: TEXT_SIZES.body, marginBottom: 2 }}>
          {ins.label}
        </div>
      ))}
    </div>
  );

  if (queue.length === 0 || index >= queue.length) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={onBack} />
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 14 }}>
          Le mie difficoltà
        </h2>
        {tabSwitcher}
        {insightsBlock}
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: TEXT_SIZES.hero2XL, marginBottom: 10 }}>🎉</div>
          <p style={{ opacity: 0.7, fontSize: TEXT_SIZES.bodyLarge }}>
            {index >= queue.length && queue.length > 0
              ? "Hai ripassato tutto quello dovuto per oggi! Torna domani per il prossimo giro."
              : totalCount > 0
              ? `Niente da ripassare oggi. Hai ${totalCount} parole in memoria, programmate per tornare quando è il momento giusto — così le ricordi davvero.`
              : "Nessun errore da ripassare al momento — continua a esercitarti nelle altre sezioni e qui raccoglierò automaticamente ciò che sbagli."}
          </p>
        </div>
      </div>
    );
  }

  const current = queue[index];

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Le mie difficoltà
      </h2>
      {tabSwitcher}
      {insightsBlock}
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        {index + 1} di {queue.length} — raccolte automaticamente dai tuoi errori in tutta l'app
      </p>

      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 8 }}>
          {SECTION_LABELS_MISTAKES[current.section] || current.section} · {current.level}
        </div>
        <div style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 4 }}>{current.promptIt || current.promptRu}</div>

        {revealed && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(240,234,216,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div className="display" style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700, color: "#7C8C6B" }}>
                {current.answerRu}
              </div>
              <button
                onClick={() => play(current.answerRu)}
                disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta" title="Ascolta"
                style={{ ...iconBtnStyle, width: 26, height: 26 }}
              >
                <Volume2 size={12} />
              </button>
            </div>
            {current.answerIt && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>{current.answerIt}</div>}
            {(() => {
              const firstSeen = current.firstSeenAt || current.addedAt;
              const daysAgo = firstSeen ? Math.floor((Date.now() - firstSeen) / 86400000) : 0;
              if (daysAgo < 3) return null;
              const dateLabel = new Date(firstSeen).toLocaleDateString("it-IT", { day: "numeric", month: "long" });
              return (
                <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.55, marginTop: 8, fontStyle: "italic" }}>
                  💭 Te lo ricordi? La prima volta l'hai sbagliata il {dateLabel} — {daysAgo} giorni fa.
                </div>
              );
            })()}
            {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}
          </div>
        )}
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          style={{
            width: "100%",
            background: "#D9A441",
            border: "none",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.subtitle,
            cursor: "pointer",
          }}
        >
          Mostra la risposta
        </button>
      ) : (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => markResult(false)}
            style={{
              flex: 1,
              background: "rgba(193,84,60,0.2)",
              border: "1px solid #C1543C",
              borderRadius: 12,
              padding: "14px 10px",
              color: "#C1543C",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            😕 Ancora no
          </button>
          <button
            onClick={() => markResult(true)}
            style={{
              flex: 1,
              background: "rgba(124,140,107,0.2)",
              border: "1px solid #7C8C6B",
              borderRadius: 12,
              padding: "14px 10px",
              color: "#7C8C6B",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            ✓ La sapevo
          </button>
        </div>
      )}
    </div>
  );
}

// Classifica euristicamente una domanda del test per polarità (affermativa/negativa/interrogativa)
// e tempo (passato/presente/futuro), per poter campionare il test di piazzamento in modo bilanciato.
function classifyTestQuestion(q) {
  const text = q.question || "";
  const polarity = text.includes("?") ? "int" : / не | ни | нет /.test(` ${text} `) || /^Не /.test(text) ? "neg" : "aff";
  let tense = "present";
  if (/завтра|буду|будешь|будет|будем|будете|будут|послезавтра/i.test(text)) tense = "future";
  else if (/вчера|уже|был|была|было|были|прошлом|назад|[а-яё]л[аи]?\s|[а-яё]л\./i.test(text)) tense = "past";
  return { polarity, tense };
}

function buildPlacementQuestions(questionsPerLevel = 6) {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const qs = [];
  for (const l of levels) {
    const pool = LEVEL_TESTS[l] || [];
    const classified = pool.map((q, i) => ({ q, i, ...classifyTestQuestion(q) }));
    // Mescola PRIMA di classificare/selezionare — senza questo, ogni volta che si
    // rifà il test si ricevono ESATTAMENTE le stesse domande (solo le opzioni di
    // risposta cambiavano ordine). Il mescolamento avviene qui, non dopo, così la
    // logica di bilanciamento sotto sceglie comunque UNA domanda per ogni
    // combinazione polarità×tempo, ma non sempre la stessa.
    for (let i = classified.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [classified[i], classified[j]] = [classified[j], classified[i]];
    }
    const seenCombos = new Set();
    const picks = [];
    // 1° passaggio: prende avidamente una domanda per ogni combinazione polarità×tempo mai vista,
    // per garantire un vero bilanciamento tra affermative/negative/interrogative e passato/presente/futuro.
    for (const c of classified) {
      const combo = `${c.polarity}-${c.tense}`;
      if (!seenCombos.has(combo) && picks.length < questionsPerLevel) {
        seenCombos.add(combo);
        picks.push(c.q);
      }
    }
    // 2° passaggio: se non si sono trovate abbastanza combinazioni distinte, completa con altre
    // domande scelte a caso tra quelle non ancora usate, per aumentare comunque il volume
    // diagnostico senza ripetere sempre lo stesso sottoinsieme.
    if (picks.length < questionsPerLevel) {
      const remaining = classified.filter((c) => !picks.includes(c.q));
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      for (const c of remaining) {
        if (picks.length >= questionsPerLevel) break;
        picks.push(c.q);
      }
    }
    for (const q of picks) {
      const opts = q.options.map((o, i) => ({ text: o, wasCorrect: i === q.correct }));
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      qs.push({ ...q, level: l, options: opts.map((o) => o.text), correct: opts.findIndex((o) => o.wasCorrect) });
    }
  }
  return qs;
}

// Le tre modalità del test di piazzamento, sul modello dei test certificati reali (es.
// TELC/Goethe/DELE): non cambia la difficoltà delle singole domande — quella già sale
// naturalmente da A1 a C2 dentro ogni modalità — cambia quante domande vengono poste per
// ciascun livello, e quindi quanto è fine la diagnosi finale. "Veloce" dà un'indicazione
// di massima in pochi minuti; "Approfondito" replica la profondità di un vero test
// certificativo completo.
const PLACEMENT_MODES = [
  { id: "veloce", label: "Veloce", icon: "⚡", questionsPerLevel: 2, minutes: "3–5", description: "Un'indicazione rapida di massima." },
  { id: "medio", label: "Medio", icon: "⚖️", questionsPerLevel: 6, minutes: "10–15", description: "Il giusto equilibrio tra rapidità e precisione." },
  { id: "approfondito", label: "Approfondito", icon: "🎓", questionsPerLevel: 12, minutes: "25–30", description: "Diagnosi completa, come un vero test certificativo." },
];

const MASTERY_SECTIONS = [
  { id: "lezioni", label: "📚 Lezioni", color: "#5B84B1", base: 10 },
  { id: "casi", label: "📖 Casi", color: "#9A6B9E", base: 28 },
  { id: "verbi", label: "🗣️ Verbi", color: "#7C8C6B", base: 28 },
  { id: "aggettivi", label: "🎨 Aggettivi", color: "#9A6B9E", base: 7 },
  { id: "preposizioni", label: "🔗 Preposizioni", color: "#C1543C", base: 7 },
  { id: "frasi", label: "💬 Frasi", color: "#5B84B1", base: 28 },
  { id: "componi", label: "🧩 Componi", color: "#C1543C", base: 27 },
];

function searchVocabulary(query, customNouns, customAdjectives, customPrepositions, customVerbs) {
  if (!query || query.trim().length < 2) return [];
  const stripAccent = (s) => s.toLowerCase().replace(/\u0301/g, "");
  const q = stripAccent(query.trim());
  const results = [];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  for (const level of levels) {
    const nouns = [...(DECLENSIONS[level] || []), ...((customNouns && customNouns[level]) || [])];
    nouns.forEach((n, i) => {
      if (stripAccent(n.word).includes(q) || n.meaning_it.toLowerCase().includes(q)) {
        results.push({ section: "declensions", sectionLabel: "📖 Nomi", level, index: i, word: n.word, meaning: n.meaning_it });
      }
    });
    const adjs = [...(ADJECTIVES[level] || []), ...((customAdjectives && customAdjectives[level]) || [])];
    adjs.forEach((a, i) => {
      if (stripAccent(a.word).includes(q) || a.meaning_it.toLowerCase().includes(q)) {
        results.push({ section: "adjectives", sectionLabel: "🎨 Aggettivi", level, index: i, word: a.word, meaning: a.meaning_it });
      }
    });
    const preps = [...(PREPOSITIONS[level] || []), ...((customPrepositions && customPrepositions[level]) || [])];
    preps.forEach((p, i) => {
      if (stripAccent(p.word).includes(q) || p.meaning_it.toLowerCase().includes(q)) {
        results.push({ section: "prepositions", sectionLabel: "🔗 Preposizioni", level, index: i, word: p.word, meaning: p.meaning_it });
      }
    });
    const verbs = [...(VERBS[level] || []), ...((customVerbs && customVerbs[level]) || [])];
    verbs.forEach((v, i) => {
      const combined = stripAccent(`${v.imperfective.word} ${v.perfective.word} ${v.meaning_it}`);
      if (combined.includes(q)) {
        results.push({ section: "verbs", sectionLabel: "🗣️ Verbi", level, index: i, word: `${v.imperfective.word} / ${v.perfective.word}`, meaning: v.meaning_it });
      }
    });
  }
  return results.slice(0, 60);
}

function SearchView({ onJump, customNouns, customAdjectives, customPrepositions, customVerbs, onCreatePackage, wordPackageLoading, wordPackageError, onBack }) {
  const [query, setQuery] = useState("");
  const [created, setCreated] = useState(false);
  const results = useMemo(() => searchVocabulary(query, customNouns, customAdjectives, customPrepositions, customVerbs), [query, customNouns, customAdjectives, customPrepositions, customVerbs]);

  async function handleCreate() {
    setCreated(false);
    const dest = await onCreatePackage(query);
    if (dest) {
      setCreated(true);
      setTimeout(() => onJump(dest), 900);
    }
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Cerca vocabolario
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Cerca in russo o in italiano, tra Nomi, Verbi, Aggettivi e Preposizioni.
      </p>

      <input
        type="text"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Es. дом, casa, идти…"
        style={{
          width: "100%",
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.2)",
          borderRadius: 10,
          padding: "12px 14px",
          color: "#F0EAD8",
          fontSize: TEXT_SIZES.subtitle,
          marginBottom: 16,
          boxSizing: "border-box",
        }}
      />

      {query.trim().length >= 2 && (
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>
          {results.length} risultat{results.length === 1 ? "o" : "i"}
        </div>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div
          style={{
            background: "rgba(217,164,65,0.1)",
            border: "1px solid rgba(217,164,65,0.35)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, marginBottom: 10 }}>
            Nessun pacchetto trovato per "{query}". Posso crearne uno nuovo, categorizzandolo automaticamente.
          </p>
          <button
            onClick={handleCreate}
            disabled={wordPackageLoading || created}
            style={{
              background: created ? "rgba(124,140,107,0.2)" : "#D9A441",
              border: created ? "1px solid #7C8C6B" : "none",
              borderRadius: 10,
              padding: "10px 18px",
              color: created ? "#7C8C6B" : "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: wordPackageLoading || created ? "default" : "pointer",
            }}
          >
            {created ? "✓ Creato! Ti porto lì…" : wordPackageLoading ? <>Genero il pacchetto…<LoadingDots /></> : `✨ Crea un pacchetto per "${query}"`}
          </button>
          {wordPackageError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8 }}>{wordPackageError}</div>}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {results.map((r, i) => (
          <button
            key={i}
            onClick={() => onJump(r)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#F0EAD8",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div>
              <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>
                {r.word}
              </div>
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{r.meaning}</div>
            </div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, textAlign: "right" }}>
              {r.sectionLabel}
              <br />
              {r.level}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const RADAR_AXES = [
  { id: "lessico", label: "Lessico", color: "#D9A441" },
  { id: "grammatica", label: "Grammatica", color: "#7C8C6B" },
  { id: "frasi", label: "Frasi e dialoghi", color: "#9A6B9E" },
  { id: "lezioni", label: "Lezioni", color: "#5B84B1" },
  { id: "pronuncia", label: "Pronuncia/Ascolto", color: "#C1543C" },
  { id: "costanza", label: "Costanza", color: "#E8956B" },
];

function polarPoint(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function MasteryMapView({ completed, allLessonsFor, learnedPhrasePackages, learnedPackages, masteredCount, vocabTotal, onBack, progress, dueReviewCount }) {
  const [levelFilter, setLevelFilter] = useState("all");
  const [pronStats, setPronStats] = useState({ attempts: 0, totalScore: 0 });

  useEffect(() => {
    (async () => {
      const s = await loadJSON("pronunciation-stats", { attempts: 0, totalScore: 0 });
      setPronStats(s);
    })();
  }, []);

  const levelsToCount = levelFilter === "all" ? LEVELS.map((l) => l.id) : [levelFilter];

  function packagePct(sectionId, base) {
    let done = 0,
      total = 0;
    for (const lvl of levelsToCount) {
      const levelBase = typeof base === "function" ? base(lvl) : base;
      total += levelBase;
      for (let i = 0; i < levelBase; i++) if (learnedPackages[`${sectionId}-${lvl}-${i}`]) done++;
    }
    return total ? Math.round((done / total) * 100) : 0;
  }

  function phrasePct() {
    let done = 0,
      total = 0;
    for (const lvl of levelsToCount) {
      const groups = PHRASE_GROUPS[lvl] || [];
      total += groups.length;
      done += groups.filter((_, i) => learnedPhrasePackages[`${lvl}-${i}`]).length;
    }
    return total ? Math.round((done / total) * 100) : 0;
  }

  function lessonsPct() {
    let done = 0,
      total = 0;
    for (const lvl of levelsToCount) {
      const lessons = allLessonsFor(lvl);
      total += lessons.length;
      done += lessons.filter((l) => completed.includes(l.id)).length;
    }
    return total ? Math.round((done / total) * 100) : 0;
  }

  // Grammatica unisce verbi + casi + aggettivi in un unico punteggio — presi separatamente
  // sarebbero troppo granulari per una panoramica rapida, mentre insieme rappresentano
  // meglio "quanto conosci la struttura del russo" nel suo complesso.
  const grammaticaPct = Math.round((packagePct("verbi", 28) + packagePct("casi", 28) + packagePct("aggettivi", (lvl) => (lvl === "A2" ? 28 : 9))) / 3);
  // Frasi e dialoghi unisce componi + frasi + dialoghi — la pratica attiva di produzione,
  // distinta dalla conoscenza teorica (grammatica) e dal vocabolario isolato (lessico).
  const frasiEDialoghiPct = Math.round((packagePct("componi", 27) + phrasePct() + packagePct("dialoghi", 7)) / 3);
  // Costanza: normalizzata su un obiettivo di 14 giorni consecutivi — oltre non aggiunge
  // altro al grafico, ma resta comunque visibile nel numero esatto sotto.
  const costanzaPct = Math.min(100, Math.round(((progress?.streak || 0) / 14) * 100));

  const values = {
    lessico: vocabTotal ? Math.round((masteredCount / vocabTotal) * 100) : 0,
    grammatica: grammaticaPct,
    frasi: frasiEDialoghiPct,
    lezioni: lessonsPct(),
    pronuncia: pronStats.attempts ? Math.round((pronStats.totalScore / pronStats.attempts) * 100) : 0,
    costanza: costanzaPct,
  };

  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 105;
  const rings = [0.25, 0.5, 0.75, 1];

  const dataPoints = RADAR_AXES.map((ax, i) => {
    const angle = i * (360 / RADAR_AXES.length);
    const val = values[ax.id];
    const p = polarPoint(cx, cy, (val / 100) * maxR, angle);
    return { ...p, val, axis: ax };
  });
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Mappa di padronanza
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>Copertura del programma su 5 competenze chiave.</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
        <button
          onClick={() => setLevelFilter("all")}
          style={{
            background: levelFilter === "all" ? "#D9A441" : "#232E3D",
            border: "1px solid #D9A441",
            borderRadius: 16,
            padding: "5px 12px",
            color: levelFilter === "all" ? "#1B2430" : "#F0EAD8",
            fontWeight: levelFilter === "all" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          Tutti i livelli
        </button>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevelFilter(l.id)}
            style={{
              background: levelFilter === l.id ? l.color : "#232E3D",
              border: `1px solid ${l.color}`,
              borderRadius: 16,
              padding: "5px 12px",
              color: levelFilter === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: levelFilter === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: 320, display: "block", margin: "0 auto" }}>
        {rings.map((r, i) => {
          const pts = RADAR_AXES.map((_, ai) => {
            const angle = ai * (360 / RADAR_AXES.length);
            const p = polarPoint(cx, cy, r * maxR, angle);
            return `${p.x},${p.y}`;
          }).join(" ");
          return <polygon key={i} points={pts} fill="none" stroke="rgba(240,234,216,0.15)" strokeWidth="1" />;
        })}
        {RADAR_AXES.map((ax, i) => {
          const angle = i * (360 / RADAR_AXES.length);
          const p = polarPoint(cx, cy, maxR, angle);
          return <line key={ax.id} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(240,234,216,0.15)" strokeWidth="1" />;
        })}
        <polygon points={polygonPoints} fill="rgba(217,164,65,0.28)" stroke="#D9A441" strokeWidth="2" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={p.axis.color} />
        ))}
        {RADAR_AXES.map((ax, i) => {
          const angle = i * (360 / RADAR_AXES.length);
          const labelP = polarPoint(cx, cy, maxR + 26, angle);
          return (
            <text
              key={ax.id}
              x={labelP.x}
              y={labelP.y}
              fill="#F0EAD8"
              fontSize="10"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: "inherit" }}
            >
              {ax.label}
            </text>
          );
        })}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
        {RADAR_AXES.map((ax) => (
          <div key={ax.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: ax.color, flexShrink: 0 }} />
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, flex: 1 }}>{ax.label}</span>
            <span className="mono" style={{ fontSize: TEXT_SIZES.body, opacity: 0.85 }}>
              {values[ax.id]}%
            </span>
          </div>
        ))}
      </div>
      {values.pronuncia === 0 && (
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginTop: 10, textAlign: "center" }}>
          Il dato "Pronuncia/Ascolto" si popola man mano che usi il microfono nelle Carte/Lezioni o rispondi in "Solo Ascolto" nei Dialoghi.
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
        <div style={{ flex: 1, background: "#232E3D", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: TEXT_SIZES.cardTitle }}>🔥</div>
          <div className="mono" style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginTop: 2 }}>{progress?.streak || 0}</div>
          <div style={{ fontSize: TEXT_SIZES.micro, opacity: 0.6 }}>giorni di fila</div>
        </div>
        <div style={{ flex: 1, background: "#232E3D", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: TEXT_SIZES.cardTitle }}>❄️</div>
          <div className="mono" style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginTop: 2 }}>{progress?.streakFreezes ?? 2}</div>
          <div style={{ fontSize: TEXT_SIZES.micro, opacity: 0.6 }}>congelamenti</div>
        </div>
        <div style={{ flex: 1, background: "#232E3D", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
          <div style={{ fontSize: TEXT_SIZES.cardTitle }}>📌</div>
          <div className="mono" style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginTop: 2 }}>{dueReviewCount || 0}</div>
          <div style={{ fontSize: TEXT_SIZES.micro, opacity: 0.6 }}>da ripassare</div>
        </div>
      </div>
    </div>
  );
}

function PlacementTestView({ onFinish, onCancel, ttsSettings: _ttsSettings, premium }) {
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [scoresByLevel, setScoresByLevel] = useState({});
  const [suggestedLevel, setSuggestedLevel] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  function startTest(modeConfig) {
    setMode(modeConfig);
    setQuestions(buildPlacementQuestions(modeConfig.questionsPerLevel));
  }

  const current = questions ? questions[index] : null;
  const total = questions ? questions.length : 0;
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[current?.level] || _ttsSettings.rate) * speedMult };

  // Schermata di scelta: mostrata finché l'utente non ha selezionato una delle tre modalità.
  if (!mode) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18, textAlign: "center" }}>
        <div style={{ textAlign: "left" }}><SectionBackButton onBack={onCancel} /></div>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 8 }}>
          Test di piazzamento
        </h2>
        <p style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginBottom: 24, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
          Scegli quanto tempo vuoi dedicarci: più domande per livello significa una diagnosi più precisa, come nei test certificativi veri.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
          {PLACEMENT_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                playNavigationSound();
                startTest(m);
              }}
              className="btn-3d"
              style={{
                background: "#232E3D",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 14,
                padding: "14px 18px",
                color: "#F0EAD8",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: TEXT_SIZES.sectionTitle }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>{m.label}</div>
                  <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginTop: 2 }}>{m.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>{m.minutes} min</div>
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>{m.questionsPerLevel * 6} domande</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  async function playQuestionAudio() {
    setAudioLoading(true);
    setAudioError(null);
    // Sostituisce "___" con la risposta corretta prima di leggere — senza questo,
    // il sintetizzatore vocale "salta" il segnaposto invece di leggere la parola
    // mancante, esattamente il problema segnalato. Questo pulsante esiste solo
    // DOPO aver risposto (dentro {revealed && (...)}), quindi la risposta corretta
    // è sempre nota qui — stesso pattern già usato in TestView per lo stesso scopo.
    const fullRu = current.question.replace("___", current.options[current.correct]);
    await playAudio(fullRu, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    const wasCorrect = i === current.correct;
    playFeedbackSound(wasCorrect);
    setScoresByLevel((prev) => {
      const s = prev[current.level] || { right: 0, total: 0 };
      return { ...prev, [current.level]: { right: s.right + (wasCorrect ? 1 : 0), total: s.total + 1 } };
    });
  }

  function next() {
    if (index + 1 >= total) {
      finishTest();
      return;
    }
    setPicked(null);
    setIndex((i) => i + 1);
  }

  function finishTest() {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    let best = "A1";
    for (const l of levels) {
      const s = scoresByLevel[l];
      if (!s) break;
      if (s.right / s.total >= 0.6) {
        best = l;
      } else {
        break;
      }
    }
    setSuggestedLevel(best);
  }

  if (suggestedLevel) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18, textAlign: "center" }}>
        <div style={{ textAlign: "left" }}><SectionBackButton onBack={onCancel} /></div>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 18 }}>
          Risultato del test
        </h2>
        <div style={{ fontSize: TEXT_SIZES.hero2XL, marginBottom: 10 }}>🎯</div>
        <p style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.8, marginBottom: 6 }}>Ti consiglio di iniziare dal livello</p>
        <div className="display" style={{ fontSize: TEXT_SIZES.heroXL, fontWeight: 700, color: LEVELS.find((l) => l.id === suggestedLevel)?.color, marginBottom: 20 }}>
          {suggestedLevel}
        </div>
        <button
          onClick={() => onFinish(suggestedLevel)}
          style={{
            width: "100%",
            background: "#D9A441",
            border: "none",
            borderRadius: 12,
            padding: "14px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.subtitle,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          Inizia da {suggestedLevel}
        </button>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.6, fontSize: TEXT_SIZES.body, cursor: "pointer" }}>
          Torna alla Home senza scegliere
        </button>
      </div>
    );
  }

  const revealed = picked !== null;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onCancel} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Test di piazzamento
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Domanda {index + 1} di {total} — rispondi come meglio puoi, le domande diventano più difficili
      </p>
      <CefrThermometer level={current?.level} />

      <div
        key={index}
        className="lesson-nest-in"
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div className="mono" style={{ fontSize: TEXT_SIZES.subtitleLarge }}>{current.question}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correct;
          let bg = "#1B2430";
          if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
          else if (revealed && i === picked && !isCorrect) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                textAlign: "left",
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <>
          <div style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 600, opacity: 0.85, marginTop: 12, textAlign: "center" }}>{current.answer_it}</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginTop: 12,
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.12)",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <button
              onClick={playQuestionAudio}
              disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta" title="Ascolta"
              style={{ ...iconBtnStyle, width: 28, height: 28 }}
            >
              <Volume2 size={13} />
            </button>
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità:</span>
            <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
              🐢
            </button>
            <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
              {speedMult.toFixed(1)}×
            </span>
            <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
              🐇
            </button>
          </div>
          {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6, textAlign: "center" }}>{audioError}</div>}

          <button
            onClick={next}
            style={{
              width: "100%",
              marginTop: 14,
              background: "#D9A441",
              border: "none",
              borderRadius: 10,
              padding: "12px 16px",
              color: "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.emphasisLarge,
              cursor: "pointer",
            }}
          >
            {index + 1 >= total ? "Vedi il risultato →" : "Prossima domanda →"}
          </button>
        </>
      )}

      <button onClick={onCancel} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "#F0EAD8", opacity: 0.5, fontSize: TEXT_SIZES.body, cursor: "pointer" }}>
        Annulla
      </button>
    </div>
  );
}

function ProgrammaView({ onNavigateSection, onStartGuided, currentFurthestLevel, onBack, openPlanId, onConsumeOpenPlanId }) {
  const [level, setLevel] = useState(currentFurthestLevel || "A1");
  const [minutesPerDay, setMinutesPerDay] = useState(20);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [plan, setPlan] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [cursor, setCursor] = useState(0);
  const [packageCursors, setPackageCursors] = useState({});
  const [done, setDone] = useState({});
  const [savedPlans, setSavedPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [renamingActive, setRenamingActive] = useState(false); // mostra il campo per rinominare il piano appena creato
  const [planName, setPlanName] = useState("");

  useEffect(() => {
    (async () => {
      const c = await loadJSON("programma-cursor", 0);
      setCursor(c);
      const pc = await loadJSON("programma-package-cursors", {});
      setPackageCursors(pc);
      const plans = await loadJSON("programma-saved-plans", []);
      setSavedPlans(plans);
      const activeId = await loadJSON("programma-active-plan-id", null);
      setActivePlanId(activeId);
      const active = plans.find((p) => p.id === activeId);
      if (active) {
        setPlan(active.plan);
        setLevel(active.level);
        setMinutesPerDay(active.minutesPerDay);
        setDaysPerWeek(active.daysPerWeek);
        setDone(active.done || {});
        setExpandedDay(active.expandedDay ?? 1);
      }
    })();
  }, []);

  function persistActivePlan(updates) {
    setSavedPlans((prev) => {
      const next = prev.map((p) => (p.id === activePlanId ? { ...p, ...updates } : p));
      saveJSON("programma-saved-plans", next);
      return next;
    });
  }

  function toggleDone(day, i) {
    const key = `${day}-${i}`;
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persistActivePlan({ done: next });
      return next;
    });
  }

  function generate() {
    const { plan: p, endIdx, endCursors } = generateStudyPlan(minutesPerDay, daysPerWeek, level, cursor, packageCursors);
    setCursor(endIdx);
    saveJSON("programma-cursor", endIdx);
    setPackageCursors(endCursors);
    saveJSON("programma-package-cursors", endCursors);
    // il piano viene salvato SUBITO con un nome automatico: prima veniva mostrato solo un piccolo
    // riquadro "dai un nome al piano" senza alcuna anteprima del piano stesso, facile da ignorare —
    // risultato: l'utente pensava di aver creato il piano ma non lo trovava tra quelli salvati.
    const id = `plan-${Date.now()}`;
    const defaultName = `${level} · ${minutesPerDay} min · ${daysPerWeek}g`;
    const newPlan = { id, name: defaultName, plan: p, level, minutesPerDay, daysPerWeek, done: {}, expandedDay: 1, createdAt: Date.now() };
    setSavedPlans((prev) => {
      const next = [...prev, newPlan];
      saveJSON("programma-saved-plans", next);
      return next;
    });
    setActivePlanId(id);
    saveJSON("programma-active-plan-id", id);
    setPlan(p);
    setDone({});
    setExpandedDay(1);
    setPlanName(defaultName);
    setRenamingActive(true);
  }

  function confirmRenameActivePlan() {
    const name = planName.trim();
    if (!name || !activePlanId) {
      setRenamingActive(false);
      return;
    }
    setSavedPlans((prev) => {
      const next = prev.map((p) => (p.id === activePlanId ? { ...p, name } : p));
      saveJSON("programma-saved-plans", next);
      return next;
    });
    setRenamingActive(false);
  }

  function expandDay(day) {
    const next = expandedDay === day ? null : day;
    setExpandedDay(next);
    persistActivePlan({ expandedDay: next });
  }

  function openPlan(p) {
    setActivePlanId(p.id);
    saveJSON("programma-active-plan-id", p.id);
    setPlan(p.plan);
    setLevel(p.level);
    setMinutesPerDay(p.minutesPerDay);
    setDaysPerWeek(p.daysPerWeek);
    setDone(p.done || {});
    setExpandedDay(p.expandedDay ?? 1);
    setShowList(false);
  }

  useEffect(() => {
    // Apre il piano richiesto dalla card "In svolgimento" in Home — aspetta che
    // savedPlans sia già stato caricato dal proprio useEffect iniziale (altrimenti
    // la ricerca fallirebbe su un array ancora vuoto), poi consuma la richiesta
    // così non si riapre di nuovo se l'utente naviga altrove e ritorna qui.
    if (!openPlanId || savedPlans.length === 0) return;
    const target = savedPlans.find((p) => p.id === openPlanId);
    if (target) openPlan(target);
    onConsumeOpenPlanId?.();
  }, [openPlanId, savedPlans]);

  function deletePlan(id) {
    setSavedPlans((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveJSON("programma-saved-plans", next);
      return next;
    });
    if (id === activePlanId) {
      setActivePlanId(null);
      saveJSON("programma-active-plan-id", null);
      setPlan(null);
      setDone({});
    }
  }

  function restartProgression() {
    setCursor(0);
    setPackageCursors({});
    saveJSON("programma-cursor", 0);
    saveJSON("programma-package-cursors", {});
  }

  function planProgress(p) {
    const total = p.plan.reduce((s, d) => s + d.activities.length, 0);
    const doneCount = p.plan.reduce((s, d) => s + d.activities.filter((_, i) => (p.done || {})[`${d.day}-${i}`]).length, 0);
    return total ? Math.round((doneCount / total) * 100) : 0;
  }

  if (showList) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={() => setShowList(false)} />
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
          I miei piani
        </h2>
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 18 }}>Tutti i piani che hai salvato finora.</p>

        <button
          onClick={() => setShowList(false)}
          style={{ background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 10, padding: "8px 14px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer", marginBottom: 16 }}
        >
          ← Torna al piano attivo
        </button>

        {savedPlans.length === 0 ? (
          <p style={{ opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center", padding: 30 }}>Nessun piano salvato ancora.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {savedPlans.map((p) => (
              <div
                key={p.id}
                style={{
                  background: p.id === activePlanId ? "rgba(217,164,65,0.15)" : "#232E3D",
                  border: p.id === activePlanId ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.12)",
                  borderRadius: 12,
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.emphasisLarge }}>{p.name}</div>
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 2 }}>
                      {p.level} · {p.minutesPerDay} min/giorno · {p.daysPerWeek} giorni/settimana
                    </div>
                  </div>
                  {p.id === activePlanId && <span style={{ fontSize: TEXT_SIZES.body, color: "#D9A441", fontWeight: 700 }}>ATTIVO</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 6, background: "#1B2430", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${planProgress(p)}%`, background: "#7C8C6B", transition: "width 0.3s ease" }} />
                  </div>
                  <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{planProgress(p)}%</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => openPlan(p)}
                    disabled={p.id === activePlanId}
                    style={{
                      flex: 1,
                      background: p.id === activePlanId ? "rgba(124,140,107,0.15)" : "#D9A441",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 12px",
                      color: p.id === activePlanId ? "#7C8C6B" : "#1B2430",
                      fontWeight: 700,
                      fontSize: TEXT_SIZES.body,
                      cursor: p.id === activePlanId ? "default" : "pointer",
                    }}
                  >
                    {p.id === activePlanId ? "✓ Già aperto" : "Apri"}
                  </button>
                  <button
                    onClick={() => deletePlan(p.id)}
                    style={{ background: "none", border: "1px solid #C1543C", borderRadius: 8, padding: "8px 12px", color: "#C1543C", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
                  >
                    🗑 Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Il tuo programma
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 18 }}>
        Dimmi quanto tempo hai e genero un piano settimanale, alternando le sezioni.
      </p>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 6 }}>Livello</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              style={{
                background: level === l.id ? l.color : "#232E3D",
                border: "1px solid rgba(240,234,216,0.15)",
                borderRadius: 20,
                padding: "6px 14px",
                color: level === l.id ? "#1B2430" : "#F0EAD8",
                fontWeight: level === l.id ? 700 : 400,
                fontSize: TEXT_SIZES.bodyLarge,
                transition: "background 0.2s ease, color 0.2s ease",
                cursor: "pointer",
              }}
            >
              {l.id}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 6 }}>Minuti al giorno</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[10, 15, 20, 30, 45, 60].map((m) => (
            <button
              key={m}
              onClick={() => setMinutesPerDay(m)}
              style={{
                background: minutesPerDay === m ? "#D9A441" : "#232E3D",
                border: "1px solid rgba(240,234,216,0.15)",
                borderRadius: 20,
                padding: "6px 14px",
                color: minutesPerDay === m ? "#1B2430" : "#F0EAD8",
                fontWeight: minutesPerDay === m ? 700 : 400,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 6 }}>Giorni a settimana</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[3, 4, 5, 6, 7].map((d) => (
            <button
              key={d}
              onClick={() => setDaysPerWeek(d)}
              style={{
                background: daysPerWeek === d ? "#7C8C6B" : "#232E3D",
                border: "1px solid rgba(240,234,216,0.15)",
                borderRadius: 20,
                padding: "6px 14px",
                color: daysPerWeek === d ? "#1B2430" : "#F0EAD8",
                fontWeight: daysPerWeek === d ? 700 : 400,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        style={{
          width: "100%",
          background: "#D9A441",
          border: "none",
          borderRadius: 12,
          padding: "14px 16px",
          color: "#1B2430",
          fontWeight: 700,
          fontSize: TEXT_SIZES.subtitle,
          cursor: "pointer",
        }}
      >
        ✨ {cursor > 0 ? "Genera il prossimo blocco" : "Genera il mio programma"}
      </button>

      {renamingActive && (
        <div style={{ background: "#232E3D", border: "1px solid #D9A441", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 8 }}>✅ Piano salvato! Vuoi cambiargli nome?</div>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmRenameActivePlan();
            }}
            style={{
              width: "100%",
              background: "#1B2430",
              border: "1px solid rgba(240,234,216,0.2)",
              borderRadius: 8,
              padding: "10px 12px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.bodyLarge,
              marginBottom: 10,
              boxSizing: "border-box",
            }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={confirmRenameActivePlan}
              style={{ flex: 1, background: "#D9A441", border: "none", borderRadius: 8, padding: "10px 14px", color: "#1B2430", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
            >
              Salva nome
            </button>
            <button
              onClick={() => setRenamingActive(false)}
              style={{ background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 8, padding: "10px 14px", color: "#F0EAD8", fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
            >
              Va bene così
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, marginBottom: cursor === 0 ? 18 : 0, flexWrap: "wrap" }}>
        {cursor > 0 && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, margin: 0 }}>
              Ogni piano propone le sezioni non ancora viste.
            </p>
            <button
              onClick={restartProgression}
              style={{ background: "none", border: "none", color: "#C1543C", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline", marginTop: 4 }}
            >
              ↺ Ricomincia la sequenza dei contenuti
            </button>
          </div>
        )}
        <button
          onClick={() => setShowList(true)}
          style={{ background: "none", border: "1px solid rgba(154,107,158,0.4)", borderRadius: 20, padding: "6px 14px", color: "#9A6B9E", fontSize: TEXT_SIZES.body, fontWeight: 700, cursor: "pointer", height: "fit-content" }}
        >
          📋 I miei piani ({savedPlans.length})
        </button>
      </div>
      {cursor === 0 && !renamingActive && <div style={{ marginBottom: 8 }} />}

      {plan && (
        <div>
          <div style={{ fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, marginBottom: 4, textAlign: "center", color: "#D9A441" }}>
            {savedPlans.find((p) => p.id === activePlanId)?.name || "Piano"}
          </div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10, textAlign: "center" }}>
            {level} — {minutesPerDay} min/giorno, {daysPerWeek} giorni/settimana
          </div>
          {plan.map((d, dayIdx) => (
            <React.Fragment key={d.day}>
            <div
              style={{
                background: "#232E3D",
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 12,
                marginBottom: 8,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => expandDay(d.day)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "12px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#F0EAD8",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>
                  Giorno {d.day}
                  {d.activities.every((_, i) => done[`${d.day}-${i}`]) && d.activities.length > 0 && " ✅"}
                </span>
                <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
                  {d.activities.filter((_, i) => done[`${d.day}-${i}`]).length}/{d.activities.length} fatte · {d.totalMinutes} min
                </span>
              </button>
              {expandedDay === d.day && (
                <div style={{ padding: "0 14px 14px" }}>
                  {(() => {
                    const firstUndoneIdx = d.activities.findIndex((_, i) => !done[`${d.day}-${i}`]);
                    if (firstUndoneIdx === -1) return null;
                    return (
                      <button
                        onClick={() => onStartGuided(d.day, d.activities, firstUndoneIdx)}
                        style={{
                          width: "100%",
                          background: "#D9A441",
                          border: "none",
                          borderRadius: 10,
                          padding: "12px 14px",
                          color: "#1B2430",
                          fontWeight: 700,
                          fontSize: TEXT_SIZES.bodyLarge,
                          cursor: "pointer",
                          marginBottom: 10,
                        }}
                      >
                        ▶ {firstUndoneIdx === 0 ? "Inizia" : "Continua"} il Giorno {d.day}
                      </button>
                    );
                  })()}
                  {d.activities.map((a, i) => {
                    const key = `${d.day}-${i}`;
                    const isDone = !!done[key];
                    return (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <button
                          onClick={() => toggleDone(d.day, i)}
                          title={isDone ? "Segna come da fare" : "Segna come fatta"}
                          style={{
                            width: 26,
                            height: 26,
                            flexShrink: 0,
                            borderRadius: 6,
                            border: isDone ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.25)",
                            background: isDone ? "rgba(124,140,107,0.3)" : "none",
                            color: isDone ? "#7C8C6B" : "rgba(240,234,216,0.4)",
                            cursor: "pointer",
                            fontSize: TEXT_SIZES.bodyLarge,
                          }}
                        >
                          {isDone ? "✓" : ""}
                        </button>
                        <button
                          onClick={() => onNavigateSection(a)}
                          style={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#1B2430",
                            border: "1px solid rgba(240,234,216,0.1)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            color: isDone ? "rgba(240,234,216,0.45)" : "#F0EAD8",
                            fontSize: TEXT_SIZES.body,
                            cursor: "pointer",
                            textAlign: "left",
                            textDecoration: isDone ? "line-through" : "none",
                          }}
                        >
                          <span>{a.label}</span>
                          <span style={{ opacity: 0.6 }}>{a.minutes} min →</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {dayIdx < plan.length - 1 && (
              <div
                aria-hidden="true"
                className="programma-connector"
                style={{
                  width: 2,
                  marginLeft: 20,
                  background: d.activities.every((_, i) => done[`${d.day}-${i}`]) && d.activities.length > 0
                    ? "#7C8C6B"
                    : "rgba(240,234,216,0.15)",
                }}
              />
            )}
            </React.Fragment>
          ))}

          {(() => {
            // riepilogo degli argomenti coperti in tutto il programma generato, contando
            // quante attività di ciascuna sezione compaiono nei vari giorni — utile per
            // vedere a colpo d'occhio la distribuzione del piano prima di iniziarlo.
            const counts = {};
            for (const d of plan) {
              for (const a of d.activities) {
                counts[a.label] = (counts[a.label] || 0) + 1;
              }
            }
            const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
            if (!entries.length) return null;
            return (
              <div style={{ marginTop: 16, background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.6, marginBottom: 10 }}>
                  📋 Argomenti trattati in questo programma
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {entries.map(([label, count]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: TEXT_SIZES.body }}>
                      <span>{label}</span>
                      <span style={{ opacity: 0.6 }}>{count} {count === 1 ? "volta" : "volte"}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// Fiabe e racconti brevi: storia in russo divisa in paragrafi, ciascuno con pulsante
// audio e traduzione italiana subito sotto — pensata per far partire l'audio e leggere
// la traduzione mentre si ascolta, come richiesto. Generate via IA e salvate in permanenza,
// così ogni livello accumula col tempo una piccola libreria di racconti.
// Una fiaba pre-scritta per ciascun livello CEFR, così la sezione non parte mai vuota
// al primo utilizzo — l'utente può comunque generarne altre con l'IA, queste sono solo
// il punto di partenza garantito. Complessità crescente da A1 (presente, lessico base)
// a C2 (narrativa più letteraria, subordinate, lessico ricco).
const DEFAULT_FIABE = {
  A1: [{
    title_ru: "Кот и молоко́",
    title_it: "Il gatto e il latte",
    paragraphs: [
      { ru: "У меня́ есть кот. Его́ зову́т Пу́шик.", it: "Ho un gatto. Si chiama Pushik." },
      { ru: "Пу́шик лю́бит молоко́.", it: "Pushik ama il latte." },
      { ru: "Ка́ждое у́тро я даю́ ему́ молоко́.", it: "Ogni mattina gli do il latte." },
      { ru: "Пу́шик пьёт молоко́ и мурлы́чет.", it: "Pushik beve il latte e fa le fusa." },
      { ru: "По́сле э́того он спит на дива́не.", it: "Dopo questo dorme sul divano." },
      { ru: "Ве́чером Пу́шик игра́ет со мной.", it: "La sera Pushik gioca con me." },
      { ru: "Я о́чень люблю́ моего́ кота́.", it: "Amo molto il mio gatto." },
    ],
    questions: [
      { question: "Как зову́т кота́?", options: ["Пу́шик", "Му́рзик", "Ба́рсик"], correct: 0 },
      { question: "Что лю́бит кот?", options: ["ры́бу", "молоко́", "мя́со"], correct: 1 },
      { question: "Где спит кот по́сле молока́?", options: ["на крова́ти", "на полу́", "на дива́не"], correct: 2 },
    ],
  }],
  A2: [{
    title_ru: "Прогу́лка в па́рке",
    title_it: "Una passeggiata al parco",
    paragraphs: [
      { ru: "Вчера́ я гуля́л в па́рке.", it: "Ieri ho passeggiato nel parco." },
      { ru: "Пого́да была́ прекра́сная.", it: "Il tempo era bellissimo." },
      { ru: "Я ви́дел мно́го дете́й, кото́рые игра́ли.", it: "Ho visto molti bambini che giocavano." },
      { ru: "О́коло о́зера сиде́ли у́тки.", it: "Vicino al lago sedevano delle anatre." },
      { ru: "Я купи́л моро́женое и сел на скаме́йку.", it: "Ho comprato un gelato e mi sono seduto su una panchina." },
      { ru: "По́сле прогу́лки я верну́лся домо́й уста́лый, но дово́льный.", it: "Dopo la passeggiata sono tornato a casa stanco ma contento." },
    ],
    questions: [
      { question: "Кака́я была́ пого́да?", options: ["дождли́вая", "плоха́я", "прекра́сная"], correct: 2 },
      { question: "Что купи́л расска́зчик?", options: ["моро́женое", "ко́фе", "хлеб"], correct: 0 },
      { question: "Кто сиде́л о́коло о́зера?", options: ["ко́шки", "у́тки", "соба́ки"], correct: 1 },
    ],
  }],
  B1: [{
    title_ru: "Письмо́ от дру́га",
    title_it: "Una lettera da un amico",
    paragraphs: [
      { ru: "Вчера́ я получи́л письмо́ от ста́рого дру́га, кото́рого не ви́дел мно́го лет.", it: "Ieri ho ricevuto una lettera da un vecchio amico che non vedevo da molti anni." },
      { ru: "Он написа́л, что перее́хал в друго́й го́род и нашёл но́вую рабо́ту.", it: "Ha scritto che si è trasferito in un'altra città e ha trovato un nuovo lavoro." },
      { ru: "Я о́чень обра́довался, потому́ что ду́мал, что он забы́л обо мне.", it: "Mi sono rallegrato molto, perché pensavo che si fosse dimenticato di me." },
      { ru: "В письме́ он пригласи́л меня́ в го́сти на выходны́е.", it: "Nella lettera mi ha invitato a trovarlo nel weekend." },
      { ru: "Я реши́л отве́тить сра́зу и согласи́лся прие́хать.", it: "Ho deciso di rispondere subito e ho accettato di venire." },
      { ru: "Наде́юсь, что мы прия́тно проведём вре́мя вме́сте.", it: "Spero che passeremo del tempo piacevole insieme." },
    ],
    questions: [
      { question: "Что сде́лал друг?", options: ["жени́лся", "перее́хал в друго́й го́род", "уе́хал за грани́цу"], correct: 1 },
      { question: "На что пригласи́л друг?", options: ["на день рожде́ния", "на сва́дьбу", "в го́сти на выходны́е"], correct: 2 },
      { question: "Что почу́вствовал расска́зчик?", options: ["ра́дость", "грусть", "злость"], correct: 0 },
    ],
  }],
  B2: [{
    title_ru: "Стра́нный сосе́д",
    title_it: "Lo strano vicino",
    paragraphs: [
      { ru: "У меня́ появи́лся но́вый сосе́д, кото́рый ведёт себя́ дово́льно стра́нно.", it: "Mi è arrivato un nuovo vicino che si comporta in modo piuttosto strano." },
      { ru: "Он говори́т, что рабо́тает по ноча́м, поэ́тому днём всегда́ спит.", it: "Dice di lavorare di notte, perciò di giorno dorme sempre." },
      { ru: "Сосе́ди утвержда́ют, бу́дто ви́дели, как он разгова́ривает сам с собо́й в саду́.", it: "I vicini sostengono di averlo visto parlare da solo in giardino." },
      { ru: "Одна́жды он попроси́л меня́ присмотре́ть за его́ кварти́рой, пока́ он в отъе́зде.", it: "Una volta mi ha chiesto di badare al suo appartamento mentre era in viaggio." },
      { ru: "Я согласи́лся, хотя́ немно́го сомнева́лся, сто́ит ли ему́ доверя́ть.", it: "Ho accettato, anche se dubitavo un po' se fidarmi di lui." },
      { ru: "Тепе́рь я ду́маю, что он про́сто одино́кий челове́к, а не стра́нный.", it: "Ora penso che sia semplicemente un uomo solo, non strano." },
    ],
    questions: [
      { question: "Когда́ рабо́тает сосе́д?", options: ["по у́трам", "по ноча́м", "по выходны́м"], correct: 1 },
      { question: "О чём попроси́л сосе́д?", options: ["одолжи́ть де́нег", "присмотре́ть за кварти́рой", "помо́чь с перее́здом"], correct: 1 },
      { question: "Что тепе́рь ду́мает расска́зчик о сосе́де?", options: ["что он опа́сен", "что он вор", "что он про́сто одино́к"], correct: 2 },
    ],
  }],
  C1: [{
    title_ru: "Осе́нний ве́чер",
    title_it: "Una sera d'autunno",
    paragraphs: [
      { ru: "Осе́нний ве́чер опусти́лся на го́род ти́хо и незаме́тно, сло́вно кто-то накры́л у́лицы мя́гким се́рым платко́м.", it: "La sera d'autunno era scesa sulla città piano e impercettibile, come se qualcuno avesse coperto le strade con un morbido fazzoletto grigio." },
      { ru: "Ли́стья, кружа́сь, па́дали на мо́крый асфа́льт, и ка́ждый шаг сопровожда́лся ти́хим ше́лестом.", it: "Le foglie, roteando, cadevano sull'asfalto bagnato, e ogni passo era accompagnato da un sommesso fruscio." },
      { ru: "В о́кнах домо́в загора́лся свет, и мо́жно бы́ло предста́вить себе́ се́мьи, собра́вшиеся за у́жином.", it: "Nelle finestre delle case si accendeva la luce, e si potevano immaginare le famiglie riunite a cena." },
      { ru: "Она́ шла не спеша́, наслажда́ясь после́дними тёплыми дня́ми пе́ред настоя́щими холода́ми.", it: "Lei camminava senza fretta, godendosi gli ultimi giorni caldi prima del freddo vero." },
      { ru: "Мы́сли её блужда́ли где-то далеко́, ме́жду воспомина́ниями и наде́ждами на бу́дущее.", it: "I suoi pensieri vagavano lontano, tra ricordi e speranze per il futuro." },
      { ru: "Когда́ она́ дошла́ до до́ма, не́бо уже́ окра́силось в глубо́кий фиоле́товый цвет.", it: "Quando arrivò a casa, il cielo si era già colorato di un profondo viola." },
    ],
    questions: [
      { question: "Что де́лали ли́стья?", options: ["остава́лись на дере́вьях", "па́дали на мо́крый асфа́льт", "улета́ли высоко́"], correct: 1 },
      { question: "О чём ду́мала герои́ня?", options: ["о рабо́те", "о поку́пках", "о воспомина́ниях и наде́ждах"], correct: 2 },
      { question: "Каки́м ста́ло не́бо к ве́черу?", options: ["кра́сным", "фиоле́товым", "се́рым"], correct: 1 },
    ],
  }],
  C2: [{
    title_ru: "После́дний по́езд",
    title_it: "L'ultimo treno",
    paragraphs: [
      { ru: "Вокза́л был почти́ пуст, лишь не́сколько запозда́лых пассажи́ров броди́ли по перро́ну, погружённые в со́бственные забо́ты.", it: "La stazione era quasi vuota, solo alcuni passeggeri in ritardo vagavano sul marciapiede, immersi nei propri pensieri." },
      { ru: "Она́ взгляну́ла на часы́ и поняла́, что после́дний по́езд отправля́ется че́рез де́сять мину́т.", it: "Guardò l'orologio e capì che l'ultimo treno partiva tra dieci minuti." },
      { ru: "Всё внутри́ неё сжа́лось от мы́сли, что э́то, возмо́жно, после́дний шанс уе́хать сего́дня.", it: "Tutto dentro di lei si contrasse al pensiero che questa fosse forse l'ultima possibilità di partire oggi." },
      { ru: "Она́ побежа́ла, не обраща́я внима́ния на дождь, кото́рый уже́ успе́л промочи́ть её пальто́ наскво́зь.", it: "Corse, senza badare alla pioggia che aveva già bagnato il suo cappotto da parte a parte." },
      { ru: "Две́ри ваго́на начина́ли закрыва́ться, когда́ она́, задыха́ясь, всё-таки успе́ла запры́гнуть внутрь.", it: "Le porte del vagone iniziavano a chiudersi quando lei, senza fiato, riuscì comunque a saltare dentro." },
      { ru: "Усе́вшись у окна́, она́ улыбну́лась сама́ себе́: иногда́ сто́ит бежа́ть до са́мого конца́.", it: "Seduta vicino al finestrino, sorrise tra sé: a volte vale la pena correre fino alla fine." },
    ],
    questions: [
      { question: "Че́рез ско́лько мину́т отправля́лся по́езд?", options: ["че́рез пять мину́т", "че́рез де́сять мину́т", "че́рез час"], correct: 1 },
      { question: "Что происходи́ло с пого́дой?", options: ["шёл дождь", "бы́ло со́лнечно", "шёл снег"], correct: 0 },
      { question: "Успе́ла ли герои́ня на по́езд?", options: ["нет", "да", "не ска́зано"], correct: 1 },
    ],
  }],
};

function FiabeView({ level, customFiabe, fiabaGenLoading, fiabaGenError, onGenerateFiaba, ttsSettings, premium, speedMult = 1 }) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const stories = [...(DEFAULT_FIABE[level] || []), ...(customFiabe[level] || [])];
  const story = stories[Math.min(storyIndex, stories.length - 1)];

  const [playerState, setPlayerState] = useState("stopped"); // "stopped" | "playing" | "paused"
  const [currentLine, setCurrentLine] = useState(0);
  const paragraphRefs = useRef([]);
  useEffect(() => {
    // Stesso principio già usato in Dialoghi e nella storia delle Lezioni: segue il
    // paragrafo in riproduzione facendo scorrere la pagina, così con una fiaba lunga
    // non serve scorrere manualmente per tenere dietro alla voce.
    if (playerState === "playing") {
      paragraphRefs.current[currentLine]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentLine, playerState]);
  const playerStopRef = useRef(false);
  const playerPausedLineRef = useRef(0);
  const [quizPicked, setQuizPicked] = useState({});

  useEffect(() => {
    // cambiando racconto, ferma qualunque riproduzione in corso e azzera le risposte al quiz
    playerStopRef.current = true;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setPlayerState("stopped");
    playerPausedLineRef.current = 0;
    setQuizPicked({});
  }, [storyIndex, level]);

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings: { ...ttsSettings, rate: ttsSettings.rate * speedMult }, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  async function playWholeStory(startIndex = 0) {
    playerStopRef.current = false;
    setPlayerState("playing");
    for (let i = startIndex; i < story.paragraphs.length; i++) {
      if (playerStopRef.current) break;
      setCurrentLine(i);
      setAudioLoading((a) => ({ ...a, [`p-${i}`]: true }));
      await playAudio(story.paragraphs[i].ru, { ttsSettings: { ...ttsSettings, rate: ttsSettings.rate * speedMult }, premium }, (msg) => setAudioError((a) => ({ ...a, [`p-${i}`]: msg })));
      setAudioLoading((a) => ({ ...a, [`p-${i}`]: false }));
      if (playerStopRef.current) break;
      // aggiorna SUBITO all'indice successivo: se l'utente mette in pausa proprio durante
      // questa breve pausa tra un paragrafo e l'altro, "Riprendi" deve ripartire dal
      // paragrafo dopo, non ripetere quello appena finito.
      setCurrentLine(i + 1);
      await new Promise((r) => setTimeout(r, 450));
    }
    if (!playerStopRef.current) {
      setPlayerState("stopped");
      setCurrentLine(0);
    }
  }

  function pauseStory() {
    // come nei Dialoghi/Lezioni: il pausa/riprendi nativo della sintesi vocale è inaffidabile,
    // quindi fermiamo subito e ricordiamo il paragrafo da cui ripartire.
    playerPausedLineRef.current = currentLine;
    playerStopRef.current = true;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setPlayerState("paused");
  }

  function resumeStory() {
    playWholeStory(playerPausedLineRef.current || 0);
  }

  function stopStory() {
    playerStopRef.current = true;
    playerPausedLineRef.current = 0;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setPlayerState("stopped");
    setCurrentLine(0);
  }

  if (!stories.length) {
    return (
      <div>
        <div style={{ padding: 24, opacity: 0.6, fontSize: TEXT_SIZES.body, textAlign: "center", marginBottom: 12 }}>
          Nessuna fiaba ancora per il livello {level} — generane una qui sotto.
        </div>
        <button
          onClick={() => onGenerateFiaba(level)}
          disabled={fiabaGenLoading}
          style={{
            width: "100%",
            background: "rgba(217,164,65,0.15)",
            border: "1px solid rgba(217,164,65,0.4)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#D9A441",
            fontWeight: 700,
            fontSize: TEXT_SIZES.body,
            cursor: fiabaGenLoading ? "default" : "pointer",
          }}
        >
          {fiabaGenLoading ? "Scrivo una fiaba…" : "+ Genera una fiaba"}
        </button>
        {fiabaGenError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{fiabaGenError}</div>}
      </div>
    );
  }

  return (
    <div>
      {stories.length > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <button
            onClick={() => setStoryIndex((i) => Math.max(0, i - 1))}
            disabled={storyIndex === 0}
            style={{ ...iconBtnStyle, width: 26, height: 26, opacity: storyIndex === 0 ? 0.4 : 1 }}
          >
            ◀
          </button>
          <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>Racconto {storyIndex + 1} di {stories.length}</span>
          <button
            onClick={() => setStoryIndex((i) => Math.min(stories.length - 1, i + 1))}
            disabled={storyIndex === stories.length - 1}
            style={{ ...iconBtnStyle, width: 26, height: 26, opacity: storyIndex === stories.length - 1 ? 0.4 : 1 }}
          >
            ▶
          </button>
        </div>
      )}

      <div style={{ background: "#232E3D", border: "1px solid rgba(154,107,158,0.35)", borderRadius: 14, padding: 18, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.subtitleLarge, fontWeight: 700, flex: 1 }}>{story.title_ru}</div>
          <button
            onClick={() => play("title", story.title_ru)}
            disabled={audioLoading.title || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta il titolo" title="Ascolta il titolo"
            style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
          >
            <Volume2 size={12} />
          </button>
        </div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, fontStyle: "italic", marginBottom: 14 }}>{story.title_it}</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          {playerState === "stopped" && (
            <button
              onClick={() => playWholeStory()}
              disabled={!TTS_SUPPORTED && !premium?.enabled}
              style={{ background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.4)", borderRadius: 20, padding: "8px 18px", color: "#D9A441", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
            >
              ▶ Ascolta tutto
            </button>
          )}
          {playerState === "playing" && (
            <button
              onClick={pauseStory}
              style={{ background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.4)", borderRadius: 20, padding: "8px 18px", color: "#D9A441", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
            >
              ⏸ Pausa
            </button>
          )}
          {playerState === "paused" && (
            <button
              onClick={resumeStory}
              style={{ background: "rgba(217,164,65,0.15)", border: "1px solid rgba(217,164,65,0.4)", borderRadius: 20, padding: "8px 18px", color: "#D9A441", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
            >
              ▶ Riprendi
            </button>
          )}
          {playerState !== "stopped" && (
            <button
              onClick={stopStory}
              style={{ background: "rgba(193,84,60,0.2)", border: "1px solid #C1543C", borderRadius: 20, padding: "8px 18px", color: "#C1543C", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
            >
              ⏹ Stop
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {story.paragraphs.map((p, pi) => {
            const key = `p-${pi}`;
            const isCurrent = playerState !== "stopped" && currentLine === pi;
            return (
              <div
                key={pi}
                ref={(el) => (paragraphRefs.current[pi] = el)}
                style={{ background: isCurrent ? "rgba(217,164,65,0.15)" : "#1B2430", border: isCurrent ? "1px solid rgba(217,164,65,0.4)" : "1px solid transparent", borderRadius: 10, padding: 12 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1, lineHeight: 1.5 }}>{p.ru}</div>
                  <button
                    onClick={() => play(key, p.ru)}
                    disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                    aria-label="Ascolta" title="Ascolta"
                    style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
                <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, fontStyle: "italic", marginTop: 6 }}>{p.it}</div>
                {audioError[key] && <div style={{ fontSize: TEXT_SIZES.tiny, color: "#C1543C", marginTop: 4 }}>{audioError[key]}</div>}
              </div>
            );
          })}
        </div>

        {story.questions && story.questions.length > 0 && (
          <div style={{ marginTop: 18, borderTop: "1px solid rgba(240,234,216,0.12)", paddingTop: 14 }}>
            <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 10, opacity: 0.85 }}>📝 Hai capito il racconto?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {story.questions.map((q, qi) => {
                const picked = quizPicked[qi];
                const revealed = picked !== undefined;
                return (
                  <div key={qi} style={{ background: "#1B2430", borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: TEXT_SIZES.body, marginBottom: 8 }}>{q.question}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correct;
                        let bg = "#232E3D";
                        if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
                        else if (revealed && picked === oi && !isCorrect) bg = "rgba(193,84,60,0.35)";
                        return (
                          <button
                            key={oi}
                            onClick={() => {
                              if (revealed) return;
                              setQuizPicked((p) => ({ ...p, [qi]: oi }));
                              playFeedbackSound(isCorrect);
                            }}
                            disabled={revealed}
                            style={{ textAlign: "left", background: bg, border: "1px solid rgba(240,234,216,0.12)", borderRadius: 8, padding: "7px 10px", color: "#F0EAD8", fontSize: TEXT_SIZES.small, cursor: revealed ? "default" : "pointer" }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onGenerateFiaba(level)}
        disabled={fiabaGenLoading}
        style={{
          width: "100%",
          background: "rgba(217,164,65,0.15)",
          border: "1px solid rgba(217,164,65,0.4)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#D9A441",
          fontWeight: 700,
          fontSize: TEXT_SIZES.body,
          cursor: fiabaGenLoading ? "default" : "pointer",
        }}
      >
        {fiabaGenLoading ? "Scrivo una fiaba…" : "+ Genera un'altra fiaba"}
      </button>
      {fiabaGenError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{fiabaGenError}</div>}
    </div>
  );
}

function DialoguesView({ ttsSettings, premium, customDialogues, dialogueGenLoading, dialogueGenError, onGenerateDialogue, jumpTo, onConsumeJump, onBack, learnedPackages, onToggleLearnedPackage, customFiabe, fiabaGenLoading, fiabaGenError, onGenerateFiaba, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);
  const [mode, setMode] = useState("listen"); // sollevato qui (non dentro DialogueCard) così cambiare livello o pacchetto non fa perdere la modalità scelta, es. Fiabe
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const dialogues = [...DIALOGUES[level], ...(customDialogues[level] || [])];
  const prevCountRef = useRef(dialogues.length);

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (dialogues.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current);
    }
    prevCountRef.current = dialogues.length;
  }, [dialogues.length]);

  const current = dialogues[Math.min(packageIndex, Math.max(0, dialogues.length - 1))];
  const isLast = packageIndex >= dialogues.length - 1;
  const loading = dialogueGenLoading[level];
  const error = dialogueGenError[level];

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Dialoghi e conversazioni
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Ascolta un dialogo reale, poi mettiti nei panni di uno dei due parlanti e scegli tu cosa dire.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.bodyLarge,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      <LevelProgressBar sectionId="dialoghi" level={level} total={dialogues.length} learnedPackages={learnedPackages} />

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : !dialogues.length ? (
        <div style={{ padding: 24, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>
          Nessun dialogo ancora per il livello {level} — generane uno con l'IA qui sotto.
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
            <button
              onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
              disabled={packageIndex === 0}
              style={pkgNavBtnStyle(packageIndex === 0)}
            >
              ◀
            </button>
            <LearnedCircle sectionId="dialoghi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
            <PackageJumpInput index={packageIndex} total={dialogues.length} onJump={setPackageIndex} />
            <button
              onClick={() => setPackageIndex((i) => Math.min(dialogues.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <DialogueCard key={`${level}-${packageIndex}`} data={current} level={level} packageIndex={packageIndex} ttsSettings={ttsSettings} premium={premium} customFiabe={customFiabe} fiabaGenLoading={fiabaGenLoading} fiabaGenError={fiabaGenError} onGenerateFiaba={onGenerateFiaba} mode={mode} setMode={setMode} learnedPackages={learnedPackages} onToggleLearnedPackage={onToggleLearnedPackage} />
        </>
      )}

      {(!dialogues.length || isLast) && (
        <button
          onClick={() => onGenerateDialogue(level)}
          disabled={!!loading}
          style={{
            width: "100%",
            marginTop: 18,
            background: "rgba(217,164,65,0.15)",
            border: "1px solid rgba(217,164,65,0.4)",
            borderRadius: 10,
            padding: "12px 14px",
            color: "#D9A441",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? <>Genero…<LoadingDots /></> : "+ Nuovo pacchetto"}
        </button>
      )}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{error}</p>
          <button
            onClick={() => onGenerateDialogue(level)}
            disabled={!!loading}
            style={{
              background: "none",
              border: "1px solid #C1543C",
              borderRadius: 8,
              padding: "3px 10px",
              color: "#C1543C",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔄 Riprova
          </button>
        </div>
      )}
    </div>
  );
}

function DialogueCard({ data, level, packageIndex, ttsSettings: _ttsSettings, premium, customFiabe, fiabaGenLoading, fiabaGenError, onGenerateFiaba, mode, setMode, learnedPackages, onToggleLearnedPackage }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [turnIndex, setTurnIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [quizPicked, setQuizPicked] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const [hearingIndex, setHearingIndex] = useState(0);
  const [hearingPicked, setHearingPicked] = useState(null);
  const [playerState, setPlayerState] = useState("stopped"); // "stopped" | "playing" | "paused"
  const [playingLineIndex, setPlayingLineIndex] = useState(null);
  const playerStopRef = useRef(false);
  const pausedLineRef = useRef(0);
  const listenTopRef = useRef(null);
  const lineRefs = useRef([]);
  useEffect(() => {
    // Segue automaticamente la battuta in riproduzione, scorrendo la pagina così
    // resta visibile man mano che l'audio avanza — senza questo, con un dialogo
    // lungo l'utente doveva scorrere manualmente per tenere dietro alla voce.
    if (playingLineIndex !== null) {
      lineRefs.current[playingLineIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [playingLineIndex]);
  function scrollToDialogueTop() {
    listenTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  const hearingOptions = useMemo(() => {
    if (!data.lines.length) return [];
    return data.lines.map((line, i) => {
      const others = data.lines.filter((_, j) => j !== i).map((l) => l.it);
      const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 2);
      const options = [line.it, ...shuffledOthers].sort(() => Math.random() - 0.5);
      return { correctIt: line.it, options, correctIndex: options.indexOf(line.it) };
    });
  }, [data]);

  // mescola le opzioni di ogni turno del gioco di ruolo (nei dati la corretta è sempre la prima)
  const shuffledTurns = useMemo(() => {
    return data.turns.map((t) => {
      const opts = t.options.map((o) => ({ ...o, wasCorrect: o.correct }));
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      return { ...t, options: opts.map((o) => ({ ru: o.ru, it: o.it, correct: o.wasCorrect })) };
    });
  }, [data]);

  async function play(key, text, voiceIdOverride) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    const linePremium = premium.enabled && voiceIdOverride ? { ...premium, voiceId: voiceIdOverride } : premium;
    await playAudio(text, { ttsSettings, premium: linePremium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  async function playSequence(startIndex = 0) {
    // ogni avvio azzera il segnale di stop: usato sia da pausa che da stop per far terminare
    // in modo pulito un eventuale ciclo precedente ancora in esecuzione, evitando che due
    // riproduzioni vadano avanti contemporaneamente (causa delle frasi "lette tutte insieme").
    playerStopRef.current = false;
    setPlayerState("playing");
    // assegna la voce femminile al primo interlocutore distinto, quella maschile al secondo,
    // così se sono impostate entrambe l'ascolto alterna naturalmente i generi tra i parlanti.
    const distinctSpeakers = [];
    for (const line of data.lines) {
      if (line.speaker && !distinctSpeakers.includes(line.speaker)) distinctSpeakers.push(line.speaker);
    }
    const speakerVoiceMap = {};
    distinctSpeakers.forEach((sp, idx) => {
      speakerVoiceMap[sp] = idx % 2 === 0 ? premium.voiceId : (premium.voiceIdMale || premium.voiceId);
    });
    for (let i = startIndex; i < data.lines.length; i++) {
      if (playerStopRef.current) break;
      setPlayingLineIndex(i);
      const line = data.lines[i];
      await play(`line-${i}`, line.ru, line.speaker ? speakerVoiceMap[line.speaker] : null);
      if (playerStopRef.current) break;
      // breve pausa naturale tra una battuta e l'altra
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!playerStopRef.current) {
      setPlayerState("stopped");
      setPlayingLineIndex(null);
    }
  }

  function pauseSequence() {
    // ferma subito il ciclo in corso (come uno stop) ma ricorda da quale battuta ripartire
    pausedLineRef.current = playingLineIndex ?? 0;
    playerStopRef.current = true;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setPlayerState("paused");
  }

  function resumeSequence() {
    playSequence(pausedLineRef.current || 0);
  }

  function stopSequence() {
    playerStopRef.current = true;
    pausedLineRef.current = 0;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setPlayerState("stopped");
    setPlayingLineIndex(null);
  }

  function pickHearing(i) {
    if (hearingPicked !== null) return;
    setHearingPicked(i);
    const wasCorrect = i === hearingOptions[hearingIndex]?.correctIndex;
    playFeedbackSound(wasCorrect);
    recordPronunciationAttempt(wasCorrect ? 1 : 0);
    if (!wasCorrect) {
      recordMistake("dialoghi", level, data.lines[hearingIndex]?.ru, null, data.lines[hearingIndex]?.ru, hearingOptions[hearingIndex]?.correctIt);
    }
  }

  function nextHearing() {
    setHearingPicked(null);
    setHearingIndex((i) => Math.min(data.lines.length, i + 1));
  }

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    const wasCorrect = !!shuffledTurns[turnIndex]?.options[i]?.correct;
    playFeedbackSound(wasCorrect);
    if (!wasCorrect) {
      const correctOpt = shuffledTurns[turnIndex]?.options.find((o) => o.correct);
      if (correctOpt) recordMistake("dialoghi", level, shuffledTurns[turnIndex].otherLine.ru, shuffledTurns[turnIndex].otherLine.it, correctOpt.ru, correctOpt.it);
    }
  }

  function nextTurn() {
    setPicked(null);
    setTurnIndex((i) => Math.min(data.turns.length, i + 1));
  }

  function restartRoleplay() {
    setTurnIndex(0);
    setPicked(null);
    setQuizPicked(null);
  }

  const otherCharacter = data.characters.find((c) => c !== data.userRole);
  const roleplayDone = turnIndex >= data.turns.length;

  return (
    <div>
      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div className="display" style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700 }}>
          {data.title}
        </div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.65, marginTop: 4 }}>{data.subtitle}</div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginTop: 6 }}>
          {data.characters.join(" · ")}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
            reimposta
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode("listen")}
          style={{
            flex: 1,
            background: mode === "listen" ? "rgba(91,132,177,0.25)" : "#232E3D",
            border: mode === "listen" ? "1px solid #5B84B1" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "listen" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          🎧 Ascolta il dialogo
        </button>
        <button
          onClick={() => setMode("roleplay")}
          style={{
            flex: 1,
            background: mode === "roleplay" ? "rgba(217,164,65,0.25)" : "#232E3D",
            border: mode === "roleplay" ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "roleplay" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          🎭 Fai la tua parte
        </button>
        <button
          onClick={() => setMode("hearing")}
          style={{
            flex: 1,
            background: mode === "hearing" ? "rgba(124,140,107,0.25)" : "#232E3D",
            border: mode === "hearing" ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "hearing" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          👂 Solo ascolto
        </button>
        <button
          onClick={() => setMode("fiabe")}
          style={{
            flex: 1,
            background: mode === "fiabe" ? "rgba(154,107,158,0.25)" : "#232E3D",
            border: mode === "fiabe" ? "1px solid #9A6B9E" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "fiabe" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          📖 Fiabe e racconti
        </button>
      </div>

      {mode === "fiabe" && (
        <FiabeView level={level} customFiabe={customFiabe} fiabaGenLoading={fiabaGenLoading} fiabaGenError={fiabaGenError} onGenerateFiaba={onGenerateFiaba} ttsSettings={ttsSettings} premium={premium} speedMult={1} />
      )}

      {mode === "listen" && (
        <div ref={listenTopRef} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 4,
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.12)",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            {playerState !== "playing" ? (
              <button
                onClick={() => (playerState === "paused" ? resumeSequence() : playSequence())}
                disabled={!TTS_SUPPORTED && !premium?.enabled}
                title="Play"
                style={{ ...iconBtnStyle, width: 34, height: 34 }}
              >
                ▶
              </button>
            ) : (
              <button onClick={pauseSequence} title="Pausa" style={{ ...iconBtnStyle, width: 34, height: 34 }}>
                ⏸
              </button>
            )}
            <button onClick={stopSequence} disabled={playerState === "stopped"} title="Stop" style={{ ...iconBtnStyle, width: 34, height: 34 }}>
              ⏹
            </button>
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
              {playerState === "playing" && playingLineIndex !== null
                ? `Riproduzione battuta ${playingLineIndex + 1}/${data.lines.length}`
                : playerState === "paused"
                ? "In pausa"
                : "Ascolta l'intero dialogo"}
            </span>
          </div>
          {data.lines.map((l, i) => {
            const key = `line-${i}`;
            const isUser = l.speaker === data.userRole;
            const isPlaying = playingLineIndex === i;
            return (
              <div
                key={i}
                ref={(el) => (lineRefs.current[i] = el)}
                style={{
                  background: isPlaying ? "rgba(217,164,65,0.18)" : "#232E3D",
                  border: isPlaying ? "2px solid #D9A441" : `1px solid ${isUser ? "rgba(217,164,65,0.35)" : "rgba(91,132,177,0.35)"}`,
                  borderRadius: 12,
                  padding: isPlaying ? 11 : 12,
                  marginLeft: isUser ? 24 : 0,
                  marginRight: isUser ? 0 : 24,
                  transition: "background 0.2s ease, border 0.2s ease",
                }}
              >
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginBottom: 3, color: isUser ? "#D9A441" : "#5B84B1", fontWeight: 700 }}>
                  {isPlaying && "🔊 "}
                  {l.speaker}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <EditableSentence
                      storageKey={`dialogo-${level}-${data.title}-${i}`}
                      text={l.ru}
                      itText={l.it}
                      fontSize={16}
                    />
                    {isPlaying && (
                      <div
                        key={playingLineIndex}
                        aria-hidden="true"
                        className="typewriter-reveal"
                        style={{ position: "absolute", inset: 0, background: "rgba(217,164,65,0.18)", pointerEvents: "none" }}
                      />
                    )}
                    {audioError[key] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError[key]}</div>}
                  </div>
                  <button
                    onClick={() => play(key, l.ru)}
                    disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                    aria-label="Ascolta" title="Ascolta"
                    style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => {
                onToggleLearnedPackage(`dialoghi-${level}-${packageIndex}`);
              }}
              aria-label={learnedPackages[`dialoghi-${level}-${packageIndex}`] ? "Segna come da rifare" : "Segna come fatto"}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: learnedPackages[`dialoghi-${level}-${packageIndex}`] ? "rgba(124,140,107,0.25)" : "#232E3D",
                border: learnedPackages[`dialoghi-${level}-${packageIndex}`] ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.2)",
                borderRadius: 10,
                padding: "10px 0",
                color: learnedPackages[`dialoghi-${level}-${packageIndex}`] ? "#7C8C6B" : "#F0EAD8",
                fontWeight: learnedPackages[`dialoghi-${level}-${packageIndex}`] ? 700 : 400,
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
              }}
            >
              <Check size={16} />
              {learnedPackages[`dialoghi-${level}-${packageIndex}`] ? "Fatto" : "Segna come fatto"}
            </button>
            <button
              onClick={() => {
                scrollToDialogueTop();
              }}
              aria-label="Torna all'inizio del dialogo"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: "#232E3D",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 10,
                padding: "10px 0",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
              }}
            >
              ↑ Torna all'inizio
            </button>
          </div>
          <button
            onClick={() => {
              setMode("roleplay");
            }}
            aria-label="Vai a Fai la tua parte"
            style={{
              marginTop: 8,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "#D9A441",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              color: "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            Avanti <ChevronRight size={16} />
          </button>
        </div>
      )}

      {mode === "roleplay" && (
        <div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10, textAlign: "center" }}>
            Tu sei: <span style={{ color: "#D9A441", fontWeight: 700 }}>{data.userRole}</span> — rispondi a {otherCharacter}
          </div>

          {!roleplayDone ? (
            <>
              <div
                style={{
                  background: "#232E3D",
                  border: "1px solid rgba(91,132,177,0.35)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginBottom: 3, color: "#5B84B1", fontWeight: 700 }}>
                  {shuffledTurns[turnIndex].otherLine.speaker}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{shuffledTurns[turnIndex].otherLine.ru}</div>
                    <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{shuffledTurns[turnIndex].otherLine.it}</div>
                  </div>
                  <button
                    onClick={() => play(`turn-${turnIndex}`, shuffledTurns[turnIndex].otherLine.ru)}
                    disabled={audioLoading[`turn-${turnIndex}`] || (!TTS_SUPPORTED && !premium?.enabled)}
                    aria-label="Ascolta" title="Ascolta"
                    style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 8 }}>Cosa rispondi?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {shuffledTurns[turnIndex].options.map((opt, i) => {
                  const revealed = picked !== null;
                  let bg = "#1B2430";
                  if (revealed && opt.correct) bg = "rgba(124,140,107,0.35)";
                  else if (revealed && i === picked && !opt.correct) bg = "rgba(193,84,60,0.35)";
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={revealed}
                      style={{
                        background: bg,
                        border: "1px solid rgba(240,234,216,0.12)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        color: "#F0EAD8",
                        textAlign: "left",
                        fontSize: TEXT_SIZES.bodyLarge,
                        cursor: revealed ? "default" : "pointer",
                      }}
                    >
                      {opt.ru}
                      <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{opt.it}</div>
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <button
                  onClick={nextTurn}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    background: "#D9A441",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 16px",
                    color: "#1B2430",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.emphasisLarge,
                    cursor: "pointer",
                  }}
                >
                  {turnIndex + 1 >= data.turns.length ? "Vedi il quiz finale →" : "Avanti →"}
                </button>
              )}
            </>
          ) : (
            <div>
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10, textAlign: "center", fontWeight: 700 }}>
                🎉 Dialogo completato!
              </div>
              <div
                style={{
                  background: "rgba(217,164,65,0.1)",
                  border: "1px solid rgba(217,164,65,0.35)",
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 8 }}>📝 Quiz di comprensione</div>
                <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10 }}>{data.comprehension.question}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.comprehension.options.map((opt, i) => {
                    const revealed = quizPicked !== null;
                    let bg = "#1B2430";
                    if (revealed && i === data.comprehension.correct) bg = "rgba(124,140,107,0.35)";
                    else if (revealed && i === quizPicked) bg = "rgba(193,84,60,0.35)";
                    return (
                      <button
                        key={i}
                        onClick={() => setQuizPicked(i)}
                        disabled={revealed}
                        style={{
                          background: bg,
                          border: "1px solid rgba(240,234,216,0.12)",
                          borderRadius: 10,
                          padding: "10px 14px",
                          color: "#F0EAD8",
                          textAlign: "left",
                          fontSize: TEXT_SIZES.bodyLarge,
                          cursor: revealed ? "default" : "pointer",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={restartRoleplay}
                style={{
                  width: "100%",
                  background: "none",
                  border: "1px solid rgba(240,234,216,0.25)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.bodyLarge,
                  cursor: "pointer",
                }}
              >
                ↺ Ricomincia il gioco di ruolo
              </button>
              <button
                onClick={() => {
                  setMode("hearing");
                }}
                aria-label="Vai a Solo ascolto"
                style={{
                  marginTop: 8,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: "#D9A441",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 0",
                  color: "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.body,
                  cursor: "pointer",
                }}
              >
                Avanti <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {mode === "hearing" && (
        <div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10, textAlign: "center" }}>
            Ascolta la frase, senza leggerla: quale traduzione italiana corrisponde?
          </div>
          {hearingIndex >= data.lines.length ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 14, fontWeight: 700 }}>🎉 Ascolto completato!</div>
              <button
                onClick={() => {
                  setHearingIndex(0);
                  setHearingPicked(null);
                }}
                style={{
                  background: "rgba(124,140,107,0.2)",
                  border: "1px solid #7C8C6B",
                  borderRadius: 10,
                  padding: "10px 18px",
                  color: "#7C8C6B",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.bodyLarge,
                  cursor: "pointer",
                }}
              >
                ↺ Ricomincia
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  background: "#232E3D",
                  border: "1px solid rgba(124,140,107,0.35)",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 14,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>
                  Frase {hearingIndex + 1} di {data.lines.length} — {data.lines[hearingIndex].speaker}
                </div>
                <button
                  onClick={() => play(`hearing-${hearingIndex}`, data.lines[hearingIndex].ru)}
                  disabled={audioLoading[`hearing-${hearingIndex}`] || (!TTS_SUPPORTED && !premium?.enabled)}
                  style={{
                    background: "rgba(124,140,107,0.2)",
                    border: "2px solid #7C8C6B",
                    borderRadius: 30,
                    width: 60,
                    height: 60,
                    color: "#7C8C6B",
                    fontSize: TEXT_SIZES.cardTitleLarge,
                    cursor: "pointer",
                  }}
                  aria-label="Ascolta" title="Ascolta"
                >
                  🔊
                </button>
                {audioError[`hearing-${hearingIndex}`] && (
                  <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8 }}>{audioError[`hearing-${hearingIndex}`]}</div>
                )}
              </div>

              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 8, textAlign: "center" }}>Cosa significa?</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {hearingOptions[hearingIndex]?.options.map((optIt, i) => {
                  const revealed = hearingPicked !== null;
                  const isCorrect = i === hearingOptions[hearingIndex].correctIndex;
                  let bg = "#1B2430";
                  if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
                  else if (revealed && i === hearingPicked && !isCorrect) bg = "rgba(193,84,60,0.35)";
                  return (
                    <button
                      key={i}
                      onClick={() => pickHearing(i)}
                      disabled={revealed}
                      style={{
                        background: bg,
                        border: "1px solid rgba(240,234,216,0.12)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        color: "#F0EAD8",
                        textAlign: "left",
                        fontSize: TEXT_SIZES.bodyLarge,
                        cursor: revealed ? "default" : "pointer",
                      }}
                    >
                      {optIt}
                    </button>
                  );
                })}
              </div>

              {hearingPicked !== null && (
                <>
                  <div
                    style={{
                      marginTop: 12,
                      background: "rgba(124,140,107,0.1)",
                      border: "1px solid rgba(124,140,107,0.3)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginBottom: 3 }}>Trascrizione</div>
                    <div style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 600 }}>{data.lines[hearingIndex].ru}</div>
                    <PronunciationHint text={data.lines[hearingIndex].ru} style={{ textAlign: "center" }} />
                  </div>
                  <button
                    onClick={nextHearing}
                    style={{
                      width: "100%",
                      marginTop: 14,
                      background: "#7C8C6B",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 16px",
                      color: "#1B2430",
                      fontWeight: 700,
                      fontSize: TEXT_SIZES.emphasisLarge,
                      cursor: "pointer",
                    }}
                  >
                    {hearingIndex + 1 >= data.lines.length ? "Fine →" : "Prossima frase →"}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function PrepositionsView({ ttsSettings, premium, customPrepositions, prepGenLoading, prepGenError, onGeneratePreposition, jumpTo, onConsumeJump, learnedPackages, onToggleLearnedPackage, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const preps = [...PREPOSITIONS[level], ...(customPrepositions[level] || [])];
  const prevCountRef = useRef(preps.length);

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (preps.length > prevCountRef.current) setPackageIndex(prevCountRef.current);
    prevCountRef.current = preps.length;
  }, [preps.length]);

  const current = preps[Math.min(packageIndex, Math.max(0, preps.length - 1))];
  const isLast = packageIndex >= preps.length - 1;
  const loading = prepGenLoading[level];
  const error = prepGenError[level];

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Preposizioni
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Ogni preposizione russa regge uno o più casi specifici, spesso con significati diversi.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.bodyLarge,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : (
        <>
          {!preps.length ? (
            <div style={{ padding: 24, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>
              Nessuna preposizione ancora per il livello {level} — generane una con l'IA qui sotto.
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <button
                  onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
                  disabled={packageIndex === 0}
                  style={pkgNavBtnStyle(packageIndex === 0)}
                >
                  ◀
                </button>
                <PackageJumpInput index={packageIndex} total={preps.length} onJump={setPackageIndex} />
                <button
                  onClick={() => setPackageIndex((i) => Math.min(preps.length - 1, i + 1))}
                  disabled={isLast}
                  style={pkgNavBtnStyle(isLast)}
                >
                  ▶
                </button>
              </div>

              <PrepositionCard key={`${level}-${packageIndex}`} data={current} level={level} ttsSettings={ttsSettings} premium={premium} />
              <LearnedPackageButton sectionId="preposizioni" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
              <SituazionePrepQuiz prep={current} level={level} />
            </>
          )}

          {(!preps.length || isLast) && (
            <button
              onClick={() => onGeneratePreposition(level)}
              disabled={!!loading}
              style={{
                width: "100%",
                marginTop: 18,
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? <>Genero…<LoadingDots /></> : "+ Nuovo pacchetto"}
            </button>
          )}
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{error}</p>
              <button
                onClick={() => onGeneratePreposition(level)}
                disabled={!!loading}
                style={{ background: "none", border: "1px solid #C1543C", borderRadius: 8, padding: "3px 10px", color: "#C1543C", fontSize: TEXT_SIZES.body, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔄 Riprova
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PrepositionCard({ data, level, ttsSettings: _ttsSettings, premium }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const ttsSettings = { ..._ttsSettings, rate: LEVEL_RATE[level] || _ttsSettings.rate };

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  return (
    <div>
      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, fontWeight: 700 }}>
          {data.word} <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
        </div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
      </div>

      {data.usages.map((u, ui) => (
        <div key={ui} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#5B84B1", marginBottom: 2 }}>
            {u.caseGoverned}
          </div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 8, fontStyle: "italic" }}>{u.meaningNote}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Affermativa", ru: u.examples.aff.ru, it: u.examples.aff.it },
              { label: "Negativa", ru: u.examples.neg.ru, it: u.examples.neg.it },
              { label: "Interrogativa", ru: u.examples.int.ru, it: u.examples.int.it },
            ].map((ex, ei) => {
              const key = `${ui}-${ei}`;
              return (
                <div key={ei} style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.1)", borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 3 }}>{ex.label}</div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{ex.ru}</div>
                      <PronunciationHint text={ex.ru} />
                      <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{ex.it}</div>
                      {audioError[key] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError[key]}</div>}
                    </div>
                    <button
                      onClick={() => play(key, ex.ru)}
                      disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                      aria-label="Ascolta" title="Ascolta"
                      style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Componente unificato per le parti del discorso semplici (non declinabili):
// Avverbio, Numerale, Congiunzione, Particella, Interiezione ----------

function SimplePosCard({ data, level, ttsSettings: _ttsSettings, premium }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const ttsSettings = { ..._ttsSettings, rate: LEVEL_RATE[level] || _ttsSettings.rate };

  async function play(key, text) {
    if (text === "—") return;
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  const rows = [
    { label: "Affermativa", ru: data.examples.aff.ru, it: data.examples.aff.it },
    { label: "Negativa", ru: data.examples.neg.ru, it: data.examples.neg.it },
    { label: "Interrogativa", ru: data.examples.int.ru, it: data.examples.int.it },
  ].filter((r) => r.ru !== "—");

  return (
    <div>
      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, fontWeight: 700 }}>
          {data.word} <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
        </div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((ex, ei) => (
          <div key={ei} style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.1)", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 3 }}>{ex.label}</div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{ex.ru}</div>
                <PronunciationHint text={ex.ru} />
                <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{ex.it}</div>
                {audioError[ei] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError[ei]}</div>}
              </div>
              <button
                onClick={() => play(ei, ex.ru)}
                disabled={audioLoading[ei] || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta" title="Ascolta"
                style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
              >
                <Volume2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimplePosView({ categoryId, title, subtitle, data, customData, genLoading, genError, onGenerate, ttsSettings, premium, learnedPackages, onToggleLearnedPackage, extraButton, extraButtons, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);

  const items = [...(data[level] || []), ...((customData && customData[level]) || [])];
  const current = items[Math.min(packageIndex, Math.max(0, items.length - 1))];
  const isLast = packageIndex >= items.length - 1;
  const genKey = `${categoryId}-${level}`;
  const packageKey = `${categoryId}-${level}-${packageIndex}`;

  useEffect(() => {
    setPackageIndex(0);
  }, [level]);

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        {title}
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>{subtitle}</p>

      {extraButton && (
        <button
          onClick={extraButton.onClick}
          style={{
            width: "100%",
            background: "rgba(217,164,65,0.15)",
            border: "1px solid rgba(217,164,65,0.4)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#D9A441",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
            marginBottom: 16,
          }}
        >
          {extraButton.label}
        </button>
      )}

      {extraButtons && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {extraButtons.map((b, i) => (
            <button
              key={i}
              onClick={b.onClick}
              style={{
                flex: 1,
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: `1px solid ${l.color}`,
              borderRadius: 16,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : !items.length ? (
        <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>Nessun elemento disponibile per questo livello.</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button
              onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
              disabled={packageIndex === 0}
              style={pkgNavBtnStyle(packageIndex === 0)}
            >
              ◀
            </button>
            <PackageJumpInput index={packageIndex} total={items.length} onJump={setPackageIndex} />
            <button
              onClick={() => setPackageIndex((i) => Math.min(items.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <SimplePosCard data={current} level={level} ttsSettings={ttsSettings} premium={premium} />

          <LearnedPackageButton sectionId={categoryId} level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />

          <SituationalPosQuiz items={items} currentIndex={packageIndex} categoryId={categoryId} level={level} />

          {isLast && (
            <button
              onClick={() => onGenerate(categoryId, level)}
              disabled={genLoading?.[genKey]}
              style={{
                width: "100%",
                marginTop: 14,
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
                opacity: genLoading?.[genKey] ? 0.6 : 1,
              }}
            >
              {genLoading?.[genKey] ? <>Genero…<LoadingDots /></> : "+ Nuovo pacchetto"}
            </button>
          )}
          {genError?.[genKey] && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{genError[genKey]}</p>
              <button
                onClick={() => onGenerate(categoryId, level)}
                style={{ background: "none", border: "1px solid #C1543C", borderRadius: 8, padding: "3px 10px", color: "#C1543C", fontSize: TEXT_SIZES.body, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                🔄 Riprova
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Quiz situazionale: mostra il contesto italiano della parola corrente e chiede di scegliere
// quella corretta tra due parole della stessa lista — sullo stile del quiz aspettuale dei Verbi.
// Quiz situazionale per Casi: mostra la frase italiana di un caso a caso e chiede di scegliere
// la forma corretta del sostantivo tra quella del caso giusto e quella di un caso diverso.
function SituazioneCasiQuiz({ noun, level, ttsSettings, premium }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  useEffect(() => {
    setCaseIndex(Math.floor(Math.random() * (noun?.cases?.length || 1)));
    setPicked(null);
  }, [noun]);

  const safeCaseIndex = noun?.cases?.length ? Math.min(caseIndex, noun.cases.length - 1) : 0;
  const target = noun?.cases?.[safeCaseIndex];

  const distractorIdx = useMemo(() => {
    if (!noun?.cases || !target) return null;
    const others = noun.cases.map((_, i) => i).filter((i) => i !== safeCaseIndex && noun.cases[i].form !== target.form);
    return others.length ? others[Math.floor(Math.random() * others.length)] : null;
  }, [noun, safeCaseIndex]);

  const distractor = distractorIdx !== null ? noun.cases[distractorIdx] : null;

  const options = useMemo(() => {
    if (!target || !distractor) return [];
    return [
      { form: target.form, correct: true },
      { form: distractor.form, correct: false },
    ].sort(() => Math.random() - 0.5);
  }, [target, distractor]);

  if (!noun || !noun.cases || noun.cases.length < 2 || distractorIdx === null) return null;

  // frase russa con uno spazio al posto della forma corretta, così l'utente vede il contesto
  // completo (non solo le due parole in scelta) e capisce dove si inserisce la parola.
  const ruBlank = target.examples?.aff?.ru ? target.examples.aff.ru.replace(target.form, "____") : null;

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    playFeedbackSound(options[i].correct);
    if (!options[i].correct) {
      recordMistake("casi", level, null, `${target.examples.aff.it} (${target.case})`, target.form, null);
    }
  }

  async function playFullSentence() {
    if (!target.examples?.aff?.ru) return;
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(target.examples.aff.ru, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div style={{ marginTop: 14, background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Situazione — {target.case}</div>
      <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 8 }}>{target.examples.aff.it}</div>
      {ruBlank && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, background: "#1B2430", borderRadius: 8, padding: "8px 10px" }}>
          <div className="mono" style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1, opacity: 0.85 }}>{ruBlank}</div>
          <button
            onClick={playFullSentence}
            disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta la frase" title="Ascolta la frase"
            style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
          >
            <Volume2 size={12} />
          </button>
        </div>
      )}
      {audioError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginBottom: 8 }}>{audioError}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt, i) => {
          const revealed = picked !== null;
          let bg = "#1B2430";
          if (revealed && opt.correct) bg = "rgba(124,140,107,0.35)";
          else if (revealed && i === picked && !opt.correct) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                flex: 1,
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt.form}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz situazionale per Preposizioni: stesso principio, applicato alle reggenze di caso.
function SituazionePrepQuiz({ prep, level }) {
  const [usageIndex, setUsageIndex] = useState(0);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    setUsageIndex(Math.floor(Math.random() * (prep?.usages?.length || 1)));
    setPicked(null);
  }, [prep]);

  if (!prep || !prep.usages || !prep.usages.length) return null;
  // Clampato QUI (non solo nell'useEffect che lo assegna) perché React renderizza
  // con lo stato ancora vecchio PRIMA che l'useEffect sopra abbia la possibilità di
  // aggiornarlo per il nuovo "prep" — se il pacchetto precedente aveva più usi di
  // questo, quel render intermedio userebbe un indice fuori range e "target"
  // risulterebbe undefined, facendo crollare il componente all'accesso successivo.
  const safeIndex = Math.min(usageIndex, prep.usages.length - 1);
  const target = prep.usages[safeIndex];

  const distractorCase = useMemo(() => {
    const cases = ["Именительный", "Родительный", "Дательный", "Винительный", "Творительный", "Предложный"];
    const others = cases.filter((c) => c !== target.caseGoverned && !target.caseGoverned.includes(c));
    return others.length ? others[Math.floor(Math.random() * others.length)] : null;
  }, [target]);

  if (!distractorCase) return null;

  const options = useMemo(() => {
    return [
      { label: target.caseGoverned, correct: true },
      { label: distractorCase, correct: false },
    ].sort(() => Math.random() - 0.5);
  }, [target, distractorCase]);

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    playFeedbackSound(options[i].correct);
    if (!options[i].correct) {
      recordMistake("preposizioni", level, null, `${prep.word} + ? (${target.examples.aff.it})`, target.caseGoverned, null);
    }
  }

  return (
    <div style={{ marginTop: 14, background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Situazione — quale caso regge "{prep.word}"?</div>
      <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10 }}>{target.examples.aff.it}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt, i) => {
          const revealed = picked !== null;
          let bg = "#1B2430";
          if (revealed && opt.correct) bg = "rgba(124,140,107,0.35)";
          else if (revealed && i === picked && !opt.correct) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                flex: 1,
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quiz situazionale per Pronomi parte B: mostra la principale e chiede di scegliere
// il pronome/relativo corretto tra quello giusto e quello di un'altra frase dello stesso livello.
// Sezione dedicata: tabella completa dei numeri 1-20 + decine fino a 100,
// con modalità di consultazione e modalità "scrivi e memorizza".
function NumbersPracticeView({ ttsSettings, premium, onBack, customNumbers, numberGenLoading, numberGenError, onGenerateNumber, initialMode }) {
  const [mode, setMode] = useState(initialMode || "table"); // "table" | "write"
  const [customNumInput, setCustomNumInput] = useState("");
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  const allNumbers = useMemo(() => {
    return [...NUMBERS_TABLE, ...(customNumbers || [])].sort((a, b) => a.num - b.num);
  }, [customNumbers]);

  // --- modalità "scrivi e memorizza" ---
  const [current, setCurrent] = useState(() => NUMBERS_TABLE[Math.floor(Math.random() * NUMBERS_TABLE.length)]);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  // Le tessere-lettera sono "derivate" dal valore digitato, non da uno stato separato:
  // così digitare a mano e cliccare le tessere restano sempre sincronizzati, senza bisogno
  // di tracciare a parte quali lettere sono già state usate.
  const shuffledLetters = useMemo(() => {
    const letters = stripAccentMarks(current.ru).split("").map((ch, i) => ({ ch, id: i }));
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters;
  }, [current.ru]);

  function pressLetterTile(id, ch) {
    if (checked) return;
    setValue((v) => v + ch);
    setChecked(false);
  }

  function undoLastLetter() {
    if (checked) return;
    setValue((v) => v.slice(0, -1));
  }

  function wandNextLetter() {
    if (checked) return;
    const target = stripAccentMarks(current.ru);
    // stessa correzione delle altre bacchette: trova la prima lettera già scritta che non
    // corrisponde, tronca da lì e inserisce quella giusta, invece di aggiungere solo in coda.
    let firstWrong = value.length;
    for (let i = 0; i < value.length && i < target.length; i++) {
      if (value[i] !== target[i]) {
        firstWrong = i;
        break;
      }
    }
    if (firstWrong >= target.length) return;
    setValue(value.slice(0, firstWrong) + target[firstWrong]);
    setChecked(false);
  }

  function nextNumber() {
    setCurrent(allNumbers[Math.floor(Math.random() * allNumbers.length)]);
    setValue("");
    setChecked(false);
  }

  function verifyWrite() {
    setChecked(true);
    const wasCorrect = normalizeForTyping(value) === normalizeForTyping(current.ru);
    playFeedbackSound(wasCorrect);
    setScore((s) => ({ right: s.right + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    if (!wasCorrect) recordMistake("numerale-scrivi", null, null, String(current.num), current.ru, null);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", marginBottom: 10, padding: 0 }}>
        ← Torna a Numerale
      </button>
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Tutti i numeri
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>Da 1 a 20, poi le decine fino a 100.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode("table")}
          style={{
            flex: 1,
            background: mode === "table" ? "#D9A441" : "#232E3D",
            border: "none",
            borderRadius: 10,
            padding: "10px",
            color: mode === "table" ? "#1B2430" : "#F0EAD8",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
          }}
        >
          📋 Consulta
        </button>
        <button
          onClick={() => setMode("write")}
          style={{
            flex: 1,
            background: mode === "write" ? "#D9A441" : "#232E3D",
            border: "none",
            borderRadius: 10,
            padding: "10px",
            color: mode === "write" ? "#1B2430" : "#F0EAD8",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
          }}
        >
          ✏️ Scrivi e memorizza
        </button>
      </div>

      {mode === "table" ? (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
            {allNumbers.map((n) => (
              <div
                key={n.num}
                style={{
                  background: "#232E3D",
                  border: "1px solid rgba(240,234,216,0.12)",
                  borderRadius: 10,
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginRight: 8 }}>{n.num}</span>
                  <span style={{ fontSize: TEXT_SIZES.subtitle }}>{n.ru}</span>
                </div>
                <button
                  onClick={() => play(`n${n.num}`, n.ru)}
                  disabled={audioLoading[`n${n.num}`] || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label={`Ascolta ${n.ru}`}
                  style={{ ...iconBtnStyle, width: 26, height: 26 }}
                >
                  <Volume2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => onGenerateNumber()}
            disabled={numberGenLoading}
            style={{
              width: "100%",
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 10,
              padding: "12px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
              opacity: numberGenLoading ? 0.6 : 1,
            }}
          >
            {numberGenLoading ? <>Genero…<LoadingDots /></> : "+ Crea un nuovo numero"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(240,234,216,0.15)" }} />
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>oppure</span>
            <div style={{ flex: 1, height: 1, background: "rgba(240,234,216,0.15)" }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="number"
              value={customNumInput}
              onChange={(e) => setCustomNumInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customNumInput.trim() && !numberGenLoading) {
                  onGenerateNumber(parseInt(customNumInput, 10));
                  setCustomNumInput("");
                }
              }}
              placeholder="Scrivi un numero (es. 45, 500)…"
              style={{
                flex: 1,
                background: "#232E3D",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => {
                if (customNumInput.trim()) {
                  onGenerateNumber(parseInt(customNumInput, 10));
                  setCustomNumInput("");
                }
              }}
              disabled={numberGenLoading || !customNumInput.trim()}
              style={{
                background: "#D9A441",
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
                opacity: numberGenLoading || !customNumInput.trim() ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}
            >
              Aggiungi
            </button>
          </div>
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginTop: 6 }}>Scrivi il numero che vuoi imparare: te lo aggiungo e memorizzo automaticamente.</p>
          {numberGenError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8 }}>{numberGenError}</div>}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginBottom: 10, textAlign: "center" }}>
            Punteggio: {score.right} / {score.total}
          </div>
          <div
            style={{
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.12)",
              borderRadius: 14,
              padding: 24,
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            <div className="display" style={{ fontSize: TEXT_SIZES.heroMax, fontWeight: 700 }}>
              {current.num}
            </div>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setChecked(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !checked) verifyWrite();
            }}
            placeholder="Scrivi il numero in russo…"
            style={{
              width: "100%",
              background: "#232E3D",
              border: `1px solid ${checked ? (normalizeForTyping(value) === normalizeForTyping(current.ru) ? "#7C8C6B" : "#C1543C") : "rgba(240,234,216,0.2)"}`,
              borderRadius: 10,
              padding: "12px 14px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.subtitle,
              marginBottom: 10,
              boxSizing: "border-box",
            }}
          />

          <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, textAlign: "center", marginBottom: 8 }}>
            oppure componi cliccando le lettere
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 10 }}>
            {(() => {
              // segna come "usata" la prima tessera disponibile che corrisponde a ciascun
              // carattere già presente in value, in ordine — così digitare a mano e cliccare
              // le tessere restano sincronizzati senza stato separato da tracciare.
              const usedIds = new Set();
              for (const ch of value) {
                const match = shuffledLetters.find((l) => l.ch === ch && !usedIds.has(l.id));
                if (match) usedIds.add(match.id);
              }
              return shuffledLetters.map((l) => {
                const isUsed = usedIds.has(l.id);
                const isSpace = l.ch === " ";
                return (
                  <button
                    key={l.id}
                    onClick={() => pressLetterTile(l.id, l.ch)}
                    disabled={isUsed || checked}
                    style={{
                      minWidth: isSpace ? 20 : 34,
                      height: 34,
                      background: isUsed ? "rgba(240,234,216,0.05)" : "#232E3D",
                      border: `1px solid ${isUsed ? "rgba(240,234,216,0.08)" : "rgba(217,164,65,0.4)"}`,
                      borderRadius: 8,
                      color: isUsed ? "rgba(240,234,216,0.25)" : "#F0EAD8",
                      fontSize: TEXT_SIZES.subtitle,
                      fontWeight: 700,
                      cursor: isUsed || checked ? "default" : "pointer",
                      opacity: isUsed ? 0.4 : 1,
                    }}
                  >
                    {isSpace ? "␣" : l.ch}
                  </button>
                );
              });
            })()}
            <button
              onClick={undoLastLetter}
              disabled={checked || !value}
              title="Cancella l'ultima lettera"
              style={{
                minWidth: 34,
                height: 34,
                background: "rgba(193,84,60,0.15)",
                border: "1px solid rgba(193,84,60,0.4)",
                borderRadius: 8,
                color: "#C1543C",
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: checked || !value ? "default" : "pointer",
                opacity: checked || !value ? 0.4 : 1,
              }}
            >
              ⌫
            </button>
            <button
              onClick={wandNextLetter}
              disabled={checked || (value === stripAccentMarks(current.ru))}
              title="Bacchetta magica: inserisce la prossima lettera corretta"
              className="magic-wand-btn"
              style={{ minWidth: 34, height: 34, padding: 0, fontSize: TEXT_SIZES.emphasisLarge }}
            >
              🪄
            </button>
          </div>
          {checked && (
            <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10, color: normalizeForTyping(value) === normalizeForTyping(current.ru) ? "#7C8C6B" : "#C1543C" }}>
              {normalizeForTyping(value) === normalizeForTyping(current.ru) ? "Esatto! 🎉" : `Non proprio — la risposta era: "${current.ru}"`}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            {!checked ? (
              <button
                onClick={verifyWrite}
                disabled={!value.trim()}
                style={{
                  flex: 1,
                  background: "#7C8C6B",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  color: "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: value.trim() ? "pointer" : "default",
                  opacity: value.trim() ? 1 : 0.5,
                }}
              >
                Verifica
              </button>
            ) : (
              <button
                onClick={nextNumber}
                style={{
                  flex: 1,
                  background: "#D9A441",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px",
                  color: "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: "pointer",
                }}
              >
                Prossimo numero →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SituazionePronomiBQuiz({ sentences, currentIndex, level }) {
  const [picked, setPicked] = useState(null);
  const current = sentences[currentIndex];

  const distractor = useMemo(() => {
    const others = sentences.filter((_, i) => i !== currentIndex);
    return others.length ? others[Math.floor(Math.random() * others.length)] : null;
  }, [sentences, currentIndex]);

  useEffect(() => {
    setPicked(null);
  }, [currentIndex]);

  if (!current || !distractor) return null;

  const options = useMemo(() => {
    return [
      { text: current.pronoun, correct: true },
      { text: distractor.pronoun, correct: false },
    ].sort(() => Math.random() - 0.5);
  }, [current, distractor]);

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    playFeedbackSound(options[i].correct);
    if (!options[i].correct) {
      recordMistake("pronomi-frasi", level, null, `${current.main_it} ___`, current.pronoun, null);
    }
  }

  return (
    <div style={{ marginTop: 14, background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Situazione — quale pronome completa la frase?</div>
      <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10 }}>{current.main_it} ___ {current.sub_it}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt, i) => {
          const revealed = picked !== null;
          let bg = "#1B2430";
          if (revealed && opt.correct) bg = "rgba(124,140,107,0.35)";
          else if (revealed && i === picked && !opt.correct) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                flex: 1,
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SituationalPosQuiz({ items, currentIndex, categoryId, level }) {
  const [picked, setPicked] = useState(null);
  const current = items[currentIndex];

  const distractor = useMemo(() => {
    const others = items.filter((_, i) => i !== currentIndex && items[i].examples.aff.ru !== "—");
    return others.length ? others[Math.floor(Math.random() * others.length)] : null;
  }, [items, currentIndex]);

  useEffect(() => {
    setPicked(null);
  }, [currentIndex]);

  if (!current || !distractor || current.examples.aff.ru === "—") return null;

  const options = useMemo(() => {
    return [
      { word: current.word, correct: true },
      { word: distractor.word, correct: false },
    ].sort(() => Math.random() - 0.5);
  }, [current, distractor]);

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    playFeedbackSound(options[i].correct);
    if (!options[i].correct) {
      recordMistake(categoryId, level, null, current.examples.aff.it, current.word, null);
    }
  }

  return (
    <div style={{ marginTop: 14, background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Situazione</div>
      <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10 }}>{current.examples.aff.it}</div>
      <div style={{ display: "flex", gap: 8 }}>
        {options.map((opt, i) => {
          const revealed = picked !== null;
          let bg = "#1B2430";
          if (revealed && opt.correct) bg = "rgba(124,140,107,0.35)";
          else if (revealed && i === picked && !opt.correct) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={revealed}
              style={{
                flex: 1,
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt.word}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PronounsView({ ttsSettings, premium, customPronouns, pronounGenLoading, pronounGenError, onGeneratePronoun, learnedPackages, onToggleLearnedPackage, onBack, unlocked, onGoToPaywall }) {
  const [mode, setMode] = useState("all"); // "all" | "byLevel"
  const [packageIndex, setPackageIndex] = useState(0);
  const [level, setLevel] = useState("A1");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [bAudioLoading, setBAudioLoading] = useState(false);
  const [bAudioError, setBAudioError] = useState(null);

  async function playB(text) {
    setBAudioLoading(true);
    setBAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setBAudioError);
    setBAudioLoading(false);
  }

  const pronouns = [...PRONOUNS, ...customPronouns];
  const prevCountRef = useRef(pronouns.length);

  useEffect(() => {
    if (pronouns.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current); // salta al primo dei nuovi appena generati
    }
    prevCountRef.current = pronouns.length;
  }, [pronouns.length]);

  const current = pronouns[Math.min(packageIndex, Math.max(0, pronouns.length - 1))];
  const isLast = packageIndex >= pronouns.length - 1;

  const levelSentences = PRONOUN_SENTENCES[level] || [];
  const currentSentence = levelSentences[Math.min(sentenceIndex, levelSentences.length - 1)];

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Pronomi
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode("all")}
          style={{
            flex: 1,
            background: mode === "all" ? "rgba(154,107,158,0.25)" : "#232E3D",
            border: mode === "all" ? "1px solid #9A6B9E" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "all" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          A) Tutti i pronomi
        </button>
        <button
          onClick={() => setMode("byLevel")}
          style={{
            flex: 1,
            background: mode === "byLevel" ? "rgba(91,132,177,0.25)" : "#232E3D",
            border: mode === "byLevel" ? "1px solid #5B84B1" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "byLevel" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          B) Per livello
        </button>
      </div>

      {mode === "all" ? (
        <>
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 18 }}>
            I pronomi si declinano nei 6 casi, con frase affermativa, negativa e interrogativa per ognuno — servono fin dai primi passi, senza una vera progressione per livello.
          </p>

          {!pronouns.length ? (
            <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>Nessun pronome disponibile.</div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <button
                  onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
                  disabled={packageIndex === 0}
                  style={pkgNavBtnStyle(packageIndex === 0)}
                >
                  ◀
                </button>
                <PackageJumpInput index={packageIndex} total={pronouns.length} onJump={setPackageIndex} />
                <button
                  onClick={() => setPackageIndex((i) => Math.min(pronouns.length - 1, i + 1))}
                  disabled={isLast}
                  style={pkgNavBtnStyle(isLast)}
                >
                  ▶
                </button>
              </div>

              <NounCard data={current} level="A1" nounIndex={packageIndex} ttsSettings={ttsSettings} premium={premium} />
              <LearnedPackageButton sectionId="pronomi" level="A1" index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
              <SituazioneCasiQuiz noun={current} level="A1" ttsSettings={ttsSettings} premium={premium} />

              {isLast && (
                <button
                  onClick={() => onGeneratePronoun()}
                  disabled={pronounGenLoading}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    background: "rgba(217,164,65,0.15)",
                    border: "1px solid rgba(217,164,65,0.4)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    color: "#D9A441",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.bodyLarge,
                    cursor: "pointer",
                    opacity: pronounGenLoading ? 0.6 : 1,
                  }}
                >
                  {pronounGenLoading ? <>Genero…<LoadingDots /></> : "+ Nuovo pacchetto"}
                </button>
              )}
              {pronounGenError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{pronounGenError}</p>
                  <button
                    onClick={() => onGeneratePronoun()}
                    disabled={pronounGenLoading}
                    style={{
                      background: "none",
                      border: "1px solid #C1543C",
                      borderRadius: 8,
                      padding: "3px 10px",
                      color: "#C1543C",
                      fontSize: TEXT_SIZES.body,
                      fontWeight: 700,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    🔄 Riprova
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
            Frasi con proposizione principale e secondaria, di complessità crescente per livello.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLevel(l.id);
                  setSentenceIndex(0);
                }}
                style={{
                  background: level === l.id ? l.color : "#232E3D",
                  border: `1px solid ${l.color}`,
                  borderRadius: 16,
                  padding: "6px 14px",
                  color: level === l.id ? "#1B2430" : "#F0EAD8",
                  fontWeight: level === l.id ? 700 : 400,
                  fontSize: TEXT_SIZES.body,
                  cursor: "pointer",
                }}
              >
                {l.id}
              </button>
            ))}
          </div>

          {currentSentence && !isLevelFree(level) && !unlocked ? (
            <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
          ) : currentSentence && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <button
                  onClick={() => setSentenceIndex((i) => Math.max(0, i - 1))}
                  disabled={sentenceIndex === 0}
                  style={pkgNavBtnStyle(sentenceIndex === 0)}
                >
                  ◀
                </button>
                <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
                  {sentenceIndex + 1} di {levelSentences.length}
                </span>
                <button
                  onClick={() => setSentenceIndex((i) => Math.min(levelSentences.length - 1, i + 1))}
                  disabled={sentenceIndex >= levelSentences.length - 1}
                  style={pkgNavBtnStyle(sentenceIndex >= levelSentences.length - 1)}
                >
                  ▶
                </button>
              </div>

              <div style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 14, padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 14 }}>
                  <div className="mono" style={{ fontSize: TEXT_SIZES.subtitle, lineHeight: 1.5, textAlign: "center" }}>
                    <span style={{ color: "#5B84B1" }}>{currentSentence.main}</span>{" "}
                    <span style={{ color: "#D9A441", fontWeight: 700 }}>{currentSentence.sub}</span>
                  </div>
                  <button
                    onClick={() => playB(`${currentSentence.main} ${currentSentence.sub}`)}
                    disabled={bAudioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                    aria-label="Ascolta la frase" title="Ascolta la frase"
                    style={{ ...iconBtnStyle, width: 30, height: 30, flexShrink: 0 }}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <PronunciationHint text={`${currentSentence.main} ${currentSentence.sub}`} style={{ textAlign: "center", marginBottom: 10 }} />
                {bAudioError && (
                  <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", textAlign: "center", marginBottom: 10 }}>{bAudioError}</div>
                )}
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, textAlign: "center", marginBottom: 16 }}>
                  {currentSentence.main_it} {currentSentence.sub_it}
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: TEXT_SIZES.body }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ color: "#5B84B1", fontWeight: 700, marginBottom: 2 }}>Principale</div>
                    <div style={{ opacity: 0.75 }}>{currentSentence.main}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ color: "#D9A441", fontWeight: 700, marginBottom: 2 }}>Secondaria</div>
                    <div style={{ opacity: 0.75 }}>{currentSentence.sub}</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(240,234,216,0.1)", paddingTop: 10, fontSize: TEXT_SIZES.body, opacity: 0.7, textAlign: "center" }}>
                  <strong style={{ color: "#9A6B9E" }}>{currentSentence.pronoun}</strong> — {currentSentence.note_it}
                </div>
              </div>
              <LearnedPackageButton sectionId="pronomi-frasi" level={level} index={sentenceIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
              <SituazionePronomiBQuiz sentences={levelSentences} currentIndex={sentenceIndex} level={level} />
            </>
          )}
        </>
      )}
    </div>
  );
}

// Schermata di sblocco vera e propria: due opzioni (abbonamento annuale, acquisto
// "vita intera"), più il ripristino acquisti obbligatorio su iOS/Android. Nessuna
// chiamata bloccante: ogni pulsante gestisce il proprio stato di caricamento/errore
// senza congelare il resto della schermata.
function PaywallView({ onBack, onPurchaseComplete, devUnlocked, onDevUnlock }) {
  const [loadingPackage, setLoadingPackage] = useState(null); // null | "annual" | "lifetime" | "restore"
  const [error, setError] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [codeError, setCodeError] = useState(false);

  async function handlePurchase(packageId, key) {
    setLoadingPackage(key);
    setError(null);
    const result = await purchaseSubscriptionPackage(packageId);
    setLoadingPackage(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.active) {
      onPurchaseComplete();
    }
  }

  async function handleRestore() {
    setLoadingPackage("restore");
    setError(null);
    const result = await restorePurchases();
    setLoadingPackage(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.active) {
      onPurchaseComplete();
    } else {
      setError("Nessun acquisto precedente trovato per questo account.");
    }
  }

  function handleCodeSubmit() {
    const ok = onDevUnlock(codeValue);
    if (ok) {
      setCodeError(false);
      onPurchaseComplete();
    } else {
      setCodeError(true);
    }
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 440, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: TEXT_SIZES.hero2XL, marginBottom: 8 }}>🪆</div>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 6 }}>
          Sblocca tutto il russo
        </h2>
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.7 }}>
          Dal livello A2 al C2: casi, verbi, aggettivi, dialoghi, lezioni, frasi — e la voce
          madrelingua inclusa.
        </p>
      </div>

      <button
        onClick={() => handlePurchase(REVENUECAT_PACKAGE_ANNUAL, "annual")}
        disabled={loadingPackage !== null}
        style={{
          width: "100%",
          background: "#D9A441",
          color: "#1B2430",
          border: "none",
          borderRadius: 12,
          padding: "16px 20px",
          fontSize: TEXT_SIZES.emphasis,
          fontWeight: 700,
          cursor: loadingPackage ? "default" : "pointer",
          opacity: loadingPackage && loadingPackage !== "annual" ? 0.5 : 1,
          marginBottom: 12,
        }}
      >
        {loadingPackage === "annual" ? "Un momento…" : "Abbonamento annuale"}
      </button>

      <button
        onClick={() => handlePurchase(REVENUECAT_PACKAGE_LIFETIME, "lifetime")}
        disabled={loadingPackage !== null}
        style={{
          width: "100%",
          background: "none",
          color: "#F0EAD8",
          border: "1px solid rgba(240,234,216,0.3)",
          borderRadius: 12,
          padding: "16px 20px",
          fontSize: TEXT_SIZES.emphasis,
          fontWeight: 700,
          cursor: loadingPackage ? "default" : "pointer",
          opacity: loadingPackage && loadingPackage !== "lifetime" ? 0.5 : 1,
          marginBottom: 18,
        }}
      >
        {loadingPackage === "lifetime" ? "Un momento…" : "Acquisto unico — vita intera"}
      </button>

      {/* Disclosure obbligatoria (Apple Guideline 3.1.2 / Google Play Billing policy):
          durata e natura del rinnovo devono essere visibili qui, nella stessa schermata
          dei pulsanti d'acquisto — non basta averla solo nella privacy policy. */}
      <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.55, textAlign: "center", lineHeight: 1.5, marginTop: -4, marginBottom: 16 }}>
        L'abbonamento annuale si rinnova automaticamente al termine di ogni periodo di
        12 mesi, al prezzo mostrato sopra, salvo disattivazione almeno 24 ore prima del
        rinnovo nelle impostazioni del tuo account {" "}
        {typeof window !== "undefined" && window.Capacitor?.getPlatform?.() === "android" ? "Google Play" : "Apple"}.
        L'acquisto "vita intera" è un pagamento singolo, senza rinnovo. Continuando accetti i{" "}
        <a href={TERMS_OF_SERVICE_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#D9A441" }}>Termini di Servizio</a>
        {" "}e l'{" "}
        <a href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#D9A441" }}>Informativa sulla Privacy</a>.
      </p>

      {error && (
        <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.small, textAlign: "center", marginBottom: 14 }}>{error}</div>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleRestore}
          disabled={loadingPackage !== null}
          style={{
            background: "none",
            border: "none",
            color: "#D9A441",
            fontSize: TEXT_SIZES.small,
            fontWeight: 700,
            cursor: loadingPackage ? "default" : "pointer",
            textDecoration: "underline",
          }}
        >
          {loadingPackage === "restore" ? "Ripristino in corso…" : "Ho già un abbonamento — ripristina acquisti"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        {devUnlocked ? (
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.7 }}>✓ Sbloccato con codice di accesso</div>
        ) : !showCodeInput ? (
          <button
            onClick={() => setShowCodeInput(true)}
            style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.75, fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, cursor: "pointer" }}
          >
            Ho un codice di accesso
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={codeValue}
              onChange={(e) => { setCodeValue(e.target.value.replace(/[^0-9]/g, "")); setCodeError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") handleCodeSubmit(); }}
              placeholder="PIN numerico"
              style={{
                width: 220,
                background: "#232E3D",
                border: `1px solid ${codeError ? "#C1543C" : "rgba(240,234,216,0.25)"}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.body,
                textAlign: "center",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleCodeSubmit}
              style={{
                background: "#4CAF50",
                border: "none",
                borderRadius: 8,
                padding: "6px 22px",
                color: "#FFFFFF",
                fontSize: TEXT_SIZES.small,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              OK
            </button>
            {codeError && (
              <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.tiny }}>Codice non valido.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DeclensionsView({ ttsSettings, premium, customNouns, nounGenLoading, nounGenError, onGenerateNounSet, jumpTo, onConsumeJump, learnedPackages, onToggleLearnedPackage, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const nouns = [...DECLENSIONS[level], ...(customNouns[level] || [])];
  const loadingStage = nounGenLoading[level]; // null | "masc" | "fem" | "neu"
  const prevCountRef = useRef(nouns.length);

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (nouns.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current); // salta al primo dei nuovi appena generati
    }
    prevCountRef.current = nouns.length;
  }, [nouns.length]);

  const current = nouns[Math.min(packageIndex, nouns.length - 1)];
  const isLast = packageIndex >= nouns.length - 1;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Nomi: declinazioni per livello
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 4 }}>
        Un sostantivo diverso per livello, nei 6 casi, con frase affermativa, negativa e interrogativa per ognuno.
      </p>
      <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 14, fontStyle: "italic" }}>
        Qui i sostantivi organizzati per livello. Per capire QUALE caso usare con un verbo, vedi "Impara → Reggenza dei casi".
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.bodyLarge,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button
              onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
              disabled={packageIndex === 0}
              style={pkgNavBtnStyle(packageIndex === 0)}
            >
              ◀
            </button>
            <PackageJumpInput index={packageIndex} total={nouns.length} onJump={setPackageIndex} />
            <button
              onClick={() => setPackageIndex((i) => Math.min(nouns.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <NounCard data={current} level={level} nounIndex={packageIndex} ttsSettings={ttsSettings} premium={premium} />
          <LearnedPackageButton sectionId="casi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
          <SituazioneCasiQuiz noun={current} level={level} ttsSettings={ttsSettings} premium={premium} />

          {isLast && (
            <button
              onClick={() => onGenerateNounSet(level)}
              disabled={!!loadingStage}
              style={{
                width: "100%",
                marginTop: 18,
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
                opacity: loadingStage ? 0.6 : 1,
              }}
            >
              {loadingStage === "masc" && <>Genero il sostantivo maschile…<LoadingDots /></>}
              {loadingStage === "fem" && <>Genero il sostantivo femminile…<LoadingDots /></>}
              {loadingStage === "neu" && <>Genero il sostantivo neutro…<LoadingDots /></>}
              {!loadingStage && "+ Nuovo pacchetto (masch. · femm. · neutro)"}
            </button>
          )}
          {nounGenError[level] && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{nounGenError[level]}</p>
              <button
                onClick={() => onGenerateNounSet(level)}
                disabled={!!loadingStage}
                style={{
                  background: "none",
                  border: "1px solid #C1543C",
                  borderRadius: 8,
                  padding: "3px 10px",
                  color: "#C1543C",
                  fontSize: TEXT_SIZES.body,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🔄 Riprova
              </button>
            </div>
          )}
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, textAlign: "center", marginTop: 6 }}>
            Ogni tocco aggiunge un maschile, un femminile e un neutro nuovi, salvati per sempre a questo livello.
          </p>
        </>
      )}
    </div>
  );
}

function NounCard({ data, level, nounIndex, ttsSettings: _ttsSettings, premium }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [speedMult, setSpeedMult] = useState(1);
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
            reimposta
          </button>
        )}
      </div>

      <div
        style={{
          background: "rgba(154,107,158,0.12)",
          border: "1px solid rgba(154,107,158,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
          <div>
            <div className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, fontWeight: 700 }}>
              {data.word} <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
            </div>
            <PronunciationHint text={data.word} />
          </div>
          <button
            onClick={() => play("baseWord", data.word)}
            disabled={audioLoading.baseWord || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label={`Ascolta ${data.word}`} title={`Ascolta ${data.word}`}
            style={{ ...iconBtnStyle, width: 28, height: 28 }}
          >
            <Volume2 size={13} />
          </button>
        </div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.cases.map((c, i) => (
          <div
            key={i}
            style={{
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.1)",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
              <span className="display" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>
                {c.case} <span style={{ fontWeight: 400, opacity: 0.65, fontSize: TEXT_SIZES.bodyLarge }}>({CASE_INFO[c.case]?.name_it})</span>
              </span>
              <span className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, color: "#D9A441" }}>
                {c.form}
              </span>
            </div>
            <PronunciationHint text={c.form} style={{ textAlign: "right" }} />
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>
              Domanda: <span className="mono">{CASE_INFO[c.case]?.ru}</span> — <em>{CASE_INFO[c.case]?.it}</em>
            </div>

            {["aff", "neg", "int"].map((kind) => {
              const label = kind === "aff" ? "＋" : kind === "neg" ? "－" : "？";
              const ex2 = c.examples[kind];
              const key = `${level}-${nounIndex}-${i}-${kind}`;
              return (
                <div
                  key={kind}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "5px 0",
                    borderTop: kind !== "aff" ? "1px solid rgba(240,234,216,0.06)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: TEXT_SIZES.body,
                      opacity: 0.5,
                      width: 16,
                      flexShrink: 0,
                      textAlign: "center",
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: TEXT_SIZES.emphasisLarge }}>{ex2.ru}</div>
                    <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.75, fontStyle: "italic" }}>{ex2.it}</div>
                    {audioError[key] && (
                      <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 2 }}>
                        Voce premium non disponibile ({audioError[key]}), uso la voce di sistema.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => play(key, ex2.ru)}
                    disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                    aria-label="Ascolta"
                    style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                  >
                    <Volume2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Verbs reference ----------

function VerbsView({ ttsSettings, premium, customVerbs, verbGenLoading, verbGenError, onGenerateVerb, jumpTo, onConsumeJump, learnedPackages, onToggleLearnedPackage, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [packageIndex, setPackageIndex] = useState(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const verbs = [...VERBS[level], ...(customVerbs[level] || [])];
  const prevCountRef = useRef(verbs.length);

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (verbs.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current);
    }
    prevCountRef.current = verbs.length;
  }, [verbs.length]);

  const current = verbs[Math.min(packageIndex, verbs.length - 1)];
  const isLast = packageIndex >= verbs.length - 1;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Verbi per livello
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Un verbo diverso per livello, con le forme principali, un esempio per ciascuna, audio e prova di pronuncia.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLevel(l.id)}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              transition: "background 0.2s ease, color 0.2s ease",
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button
              onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
              disabled={packageIndex === 0}
              style={pkgNavBtnStyle(packageIndex === 0)}
            >
              ◀
            </button>
            <PackageJumpInput index={packageIndex} total={verbs.length} onJump={setPackageIndex} />
            <button
              onClick={() => setPackageIndex((i) => Math.min(verbs.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <VerbCard data={current} level={level} verbIndex={packageIndex} ttsSettings={ttsSettings} premium={premium} />
          <LearnedPackageButton sectionId="verbi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />

          {isLast && (
            <button
              onClick={() => onGenerateVerb(level)}
              disabled={verbGenLoading[level]}
              style={{
                width: "100%",
                marginTop: 18,
                background: "rgba(124,140,107,0.15)",
                border: "1px solid rgba(124,140,107,0.4)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#7C8C6B",
                fontWeight: 700,
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
                opacity: verbGenLoading[level] ? 0.6 : 1,
              }}
            >
              {verbGenLoading[level] ? <>Genero il verbo…<LoadingDots /></> : "+ Nuovo pacchetto (nuovo verbo)"}
            </button>
          )}
          {verbGenError[level] && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
              <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{verbGenError[level]}</p>
              <button
                onClick={() => onGenerateVerb(level)}
                disabled={verbGenLoading[level]}
                style={{
                  background: "none",
                  border: "1px solid #C1543C",
                  borderRadius: 8,
                  padding: "3px 10px",
                  color: "#C1543C",
                  fontSize: TEXT_SIZES.body,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🔄 Riprova
              </button>
            </div>
          )}
          <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, textAlign: "center", marginTop: 6 }}>
            Ogni verbo aggiunto si salva per sempre a questo livello.
          </p>
        </>
      )}
    </div>
  );
}

function VerbCard({ data, level, verbIndex, ttsSettings: _ttsSettings, premium }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [pron, setPron] = useState({});
  const [sqPicked, setSqPicked] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  // mescola le opzioni del quiz situazionale (nei dati la corretta è sempre la prima):
  // senza questo, cliccare sempre la prima opzione basterebbe per rispondere bene.
  const shuffledSituational = useMemo(() => {
    if (!data.situational) return null;
    const opts = data.situational.options.map((o, i) => ({ ...o, wasCorrect: i === data.situational.correct }));
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { prompt_it: data.situational.prompt_it, options: opts, correct: opts.findIndex((o) => o.wasCorrect) };
  }, [data.situational]);

  useEffect(() => {
    setSqPicked(null);
  }, [verbIndex]);

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  function FormRow({ f, formKey }) {
    const p = pron[formKey];
    return (
      <div
        style={{
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.1)",
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
          <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{f.label}</span>
          <span className="mono" style={{ fontSize: TEXT_SIZES.subtitle, color: "#D9A441" }}>{f.form}</span>
        </div>
        <PronunciationHint text={f.form} style={{ textAlign: "right", marginBottom: 6 }} />
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <EditableSentence storageKey={`verbo-${formKey}`} text={f.example_ru} itText={f.example_it} fontSize={16} />
            {audioError[formKey] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 2 }}>{audioError[formKey]}</div>}
            {p?.status === "listening" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>In ascolto…</div>}
            {p?.status === "denied" && (
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>
                Consenti l'uso del microfono per controllare la pronuncia.
              </div>
            )}
            {p?.status === "error" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>Non ho sentito bene, riprova.</div>}
            {p?.status === "done" && (
              <div
                style={{
                  fontSize: TEXT_SIZES.body,
                  marginTop: 4,
                  color: p.score >= 0.85 ? "#7C8C6B" : p.score >= 0.6 ? "#D9A441" : "#C1543C",
                }}
              >
                {p.score >= 0.85
                  ? "Ottima pronuncia! 🎉"
                  : p.score >= 0.6
                  ? `Quasi giusto — ho sentito: "${p.transcript}"`
                  : `Riprova, parlando più lentamente — ho sentito: "${p.transcript}"`}
              </div>
            )}
          </div>
          <button
            onClick={() => play(formKey, f.example_ru)}
            disabled={audioLoading[formKey] || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta" title="Ascolta"
            style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
          >
            <Volume2 size={12} />
          </button>
          <button
            onClick={() => startPronunciationCheck(f.example_ru, (u) => setPron((prev) => ({ ...prev, [formKey]: u })))}
            disabled={!SPEECH_RECOGNITION_SUPPORTED || p?.status === "listening"}
            title="Prova a pronunciare"
            aria-label="Prova a pronunciare"
            style={{
              ...iconBtnStyle,
              width: 26,
              height: 26,
              flexShrink: 0,
              background: p?.status === "listening" ? "rgba(193,84,60,0.4)" : iconBtnStyle.background,
            }}
          >
            <Mic size={12} />
          </button>
        </div>
      </div>
    );
  }

  // Nuovo formato: coppia aspettuale (imperfettivo + perfettivo)
  if (data.imperfective) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 14,
            background: "#232E3D",
            border: "1px solid rgba(240,234,216,0.12)",
            borderRadius: 10,
            padding: "6px 12px",
          }}
        >
          <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
          <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
            🐢
          </button>
          <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
            {speedMult.toFixed(1)}×
          </span>
          <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
            🐇
          </button>
          {speedMult !== 1 && (
            <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
              reimposta
            </button>
          )}
        </div>

        <div
          style={{
            background: "rgba(124,140,107,0.12)",
            border: "1px solid rgba(124,140,107,0.35)",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700 }}>
              {data.imperfective.word} <span style={{ opacity: 0.5, fontWeight: 400 }}>/</span> {data.perfective.word}{" "}
              <span style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => play("infWordImpf", data.imperfective.word)}
                disabled={audioLoading.infWordImpf || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label={`Ascolta ${data.imperfective.word}`} title={`Ascolta ${data.imperfective.word}`}
                style={{ ...iconBtnStyle, width: 28, height: 28 }}
              >
                <Volume2 size={13} />
              </button>
              <button
                onClick={() => play("infWordPerf", data.perfective.word)}
                disabled={audioLoading.infWordPerf || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label={`Ascolta ${data.perfective.word}`} title={`Ascolta ${data.perfective.word}`}
                style={{ ...iconBtnStyle, width: 28, height: 28 }}
              >
                <Volume2 size={13} />
              </button>
            </div>
          </div>
          <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
        </div>

        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#5B84B1", marginBottom: 6 }}>
          Imperfettivo — {data.imperfective.word}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {data.imperfective.forms.map((f, fi) => (
            <FormRow key={fi} f={f} formKey={`${level}-${verbIndex}-impf-${fi}`} />
          ))}
        </div>

        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#C1543C", marginBottom: 6 }}>
          Perfettivo — {data.perfective.word}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.perfective.forms.map((f, fi) => (
            <FormRow key={fi} f={f} formKey={`${level}-${verbIndex}-perf-${fi}`} />
          ))}
        </div>

        {shuffledSituational && (
          <div
            style={{
              marginTop: 16,
              background: "rgba(217,164,65,0.1)",
              border: "1px solid rgba(217,164,65,0.35)",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 8 }}>🎭 Situazione: quale aspetto useresti?</div>
            <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10 }}>{shuffledSituational.prompt_it}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {shuffledSituational.options.map((opt, i) => {
                const isCorrect = i === shuffledSituational.correct;
                const revealed = sqPicked !== null;
                let bg = "#1B2430";
                if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
                else if (revealed && i === sqPicked && !isCorrect) bg = "rgba(193,84,60,0.35)";
                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={revealed ? -1 : 0}
                    onClick={() => {
                      if (revealed) return;
                      setSqPicked(i);
                      const wasCorrect = i === shuffledSituational.correct;
                      playFeedbackSound(wasCorrect);
                      if (!wasCorrect) {
                        const correctOpt = shuffledSituational.options[shuffledSituational.correct];
                        recordMistake("verbi", level, null, shuffledSituational.prompt_it, correctOpt.ru, `(${correctOpt.aspect})`);
                      }
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !revealed) {
                        e.currentTarget.click();
                      }
                    }}
                    style={{
                      background: bg,
                      border: "1px solid rgba(240,234,216,0.12)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      color: "#F0EAD8",
                      textAlign: "left",
                      fontSize: TEXT_SIZES.bodyLarge,
                      cursor: revealed ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <span>
                      {opt.ru} <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>({opt.aspect})</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        play(`sq-${i}`, opt.ru);
                      }}
                      aria-label="Ascolta" title="Ascolta"
                      style={{ ...iconBtnStyle, width: 24, height: 24, flexShrink: 0 }}
                    >
                      <Volume2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Formato precedente: singolo verbo (livelli non ancora convertiti a coppie)
  return (
    <div>
      <div
        style={{
          background: "rgba(124,140,107,0.12)",
          border: "1px solid rgba(124,140,107,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div className="display" style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700 }}>
          {data.word} <span style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.6, fontWeight: 400 }}>({data.meaning_it})</span>
        </div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginTop: 2 }}>{data.aspect}</div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 6 }}>{data.note_it}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.forms.map((f, fi) => (
          <FormRow key={fi} f={f} formKey={`${level}-${verbIndex}-${fi}`} />
        ))}
      </div>
    </div>
  );
}

// ---------- Phrases reference ----------

function PhrasesView({
  ttsSettings,
  premium,
  customPhraseGroups,
  phraseGenLoading,
  phraseGenError,
  onGeneratePhraseGroup,
  repeatFlags,
  onToggleRepeatFlag,
  learnedPhrasePackages,
  onToggleLearnedPackage,
  onRestartPackage,
  jumpTo,
  onConsumeJump,
  onBack,
  phraseCaseTags,
  phraseCaseTagLoading,
  phraseCaseTagError,
  onGeneratePhraseCaseTag,
  extraInterrogative,
  interrogativeGenLoading,
  onGenerateInterrogative,
  allCasesExample,
  allCasesGenLoading,
  onGenerateAllCasesExample,
  unlocked,
  onGoToPaywall,
}) {
  const [level, setLevel] = useState("A1");
  const [showOnlyRepeat, setShowOnlyRepeat] = useState(false);
  const [packageIndex, setPackageIndex] = useState(0);
  const [speedMult, setSpeedMult] = useState(1);
  const [selectedGenCase, setSelectedGenCase] = useState(null);
  const isJumpingRef = useRef(false);

  const suggestedGenCase = leastRepresentedCase(
    [...PHRASE_GROUPS[level], ...(customPhraseGroups[level] || [])].flatMap((g) => g.phrases.map((p) => p.ru))
  );
  const effectiveGenCase = selectedGenCase || suggestedGenCase;

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const groups = [...PHRASE_GROUPS[level], ...(customPhraseGroups[level] || [])];
  const prevCountRef = useRef(groups.length);
  const packageKey = `${level}-${packageIndex}`;
  const isLearned = !!learnedPhrasePackages[packageKey];

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (groups.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current);
    }
    prevCountRef.current = groups.length;
  }, [groups.length]);

  const current = groups[Math.min(packageIndex, groups.length - 1)];
  const isLast = packageIndex >= groups.length - 1;
  const [mode, setMode] = useState("studia");

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Frasi per livello
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Gruppi di 5 frasi con la stessa struttura: ripetere il pattern aiuta a fissarlo in memoria.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setMode("studia")}
          style={{
            flex: 1,
            background: mode === "studia" ? "rgba(217,164,65,0.25)" : "#232E3D",
            border: mode === "studia" ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "studia" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          📖 Studia
        </button>
        <button
          onClick={() => setMode("scrivi")}
          style={{
            flex: 1,
            background: mode === "scrivi" ? "rgba(124,140,107,0.25)" : "#232E3D",
            border: mode === "scrivi" ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.15)",
            borderRadius: 10,
            padding: "10px 12px",
            color: "#F0EAD8",
            fontWeight: mode === "scrivi" ? 700 : 400,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          ✍️ Scrivi
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setLevel(l.id);
              setSelectedGenCase(null);
            }}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      <LevelProgressBar sectionId="frasi" level={level} total={groups.length} learnedPackages={learnedPhrasePackages} keyBuilder={(i) => `${level}-${i}`} />

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : (
        <>
      {mode === "studia" && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 12,
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.12)",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
            <button
              onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))}
              title="Più lento"
              style={{ ...iconBtnStyle, width: 28, height: 28 }}
            >
              🐢
            </button>
            <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 40, textAlign: "center" }}>
              {speedMult.toFixed(1)}×
            </span>
            <button
              onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))}
              title="Più veloce"
              style={{ ...iconBtnStyle, width: 28, height: 28 }}
            >
              🐇
            </button>
            {speedMult !== 1 && (
              <button
                onClick={() => setSpeedMult(1)}
                style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}
              >
                reimposta
              </button>
            )}
          </div>

          <button
            onClick={() => setShowOnlyRepeat((s) => !s)}
            style={{
              background: showOnlyRepeat ? "rgba(193,84,60,0.25)" : "#232E3D",
              border: showOnlyRepeat ? "1px solid #C1543C" : "1px solid rgba(240,234,216,0.15)",
              borderRadius: 10,
              padding: "8px 12px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.body,
              fontWeight: showOnlyRepeat ? 700 : 400,
              cursor: "pointer",
              marginBottom: 16,
            }}
          >
            🔁 {showOnlyRepeat ? "Mostro solo le frasi da ripetere" : "Mostra solo le frasi da ripetere"}
          </button>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 8 }}>
        <button
          onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
          disabled={packageIndex === 0}
          style={pkgNavBtnStyle(packageIndex === 0)}
        >
          ◀
        </button>
        <LearnedCircle customKey={packageKey} learnedPackages={learnedPhrasePackages} onToggle={onToggleLearnedPackage} />
        <PackageJumpInput index={packageIndex} total={groups.length} onJump={setPackageIndex} />
        <button
          onClick={() => setPackageIndex((i) => Math.min(groups.length - 1, i + 1))}
          disabled={isLast}
          style={pkgNavBtnStyle(isLast)}
        >
          ▶
        </button>
      </div>

      {mode === "studia" ? (
        <>
          <PhraseGroupCard
            data={current}
            level={level}
            groupIndex={packageIndex}
            ttsSettings={ttsSettings}
            premium={premium}
            speedMult={speedMult}
            repeatFlags={repeatFlags}
            onToggleRepeatFlag={onToggleRepeatFlag}
            showOnlyRepeat={showOnlyRepeat}
            phraseCaseTags={phraseCaseTags}
            phraseCaseTagLoading={phraseCaseTagLoading}
            phraseCaseTagError={phraseCaseTagError}
            onGeneratePhraseCaseTag={onGeneratePhraseCaseTag}
            extraInterrogative={extraInterrogative}
            interrogativeGenLoading={interrogativeGenLoading}
            onGenerateInterrogative={onGenerateInterrogative}
            allCasesExample={allCasesExample}
            allCasesGenLoading={allCasesGenLoading}
            onGenerateAllCasesExample={onGenerateAllCasesExample}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button
              onClick={() => onToggleLearnedPackage(packageKey)}
              style={{
                flex: 1,
                background: isLearned ? "rgba(124,140,107,0.25)" : "rgba(124,140,107,0.1)",
                border: isLearned ? "1px solid #7C8C6B" : "1px solid rgba(124,140,107,0.4)",
                borderRadius: 10,
                padding: "10px 14px",
                color: isLearned ? "#7C8C6B" : "#F0EAD8",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              {isLearned ? "✓ Imparato" : "Segna come imparato"}
            </button>
            <button
              onClick={() => onRestartPackage(packageKey)}
              style={{
                background: "none",
                border: "1px solid rgba(240,234,216,0.25)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#F0EAD8",
                opacity: 0.7,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              ↺ Ricomincia
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              onClick={() => setPackageIndex(0)}
              disabled={packageIndex === 0}
              style={{
                flex: 1,
                background: "none",
                border: "1px solid rgba(91,132,177,0.4)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#5B84B1",
                fontSize: TEXT_SIZES.body,
                fontWeight: 700,
                cursor: packageIndex === 0 ? "default" : "pointer",
                opacity: packageIndex === 0 ? 0.5 : 1,
              }}
            >
              ⏮ Inizio pacchetto
            </button>
            <button
              onClick={() => setPackageIndex((i) => Math.min(groups.length - 1, i + 1))}
              disabled={isLast}
              style={{
                flex: 1,
                background: "#5B84B1",
                border: "none",
                borderRadius: 10,
                padding: "10px 14px",
                color: "#1B2430",
                fontSize: TEXT_SIZES.body,
                fontWeight: 700,
                cursor: isLast ? "default" : "pointer",
                opacity: isLast ? 0.5 : 1,
              }}
            >
              Avanti →
            </button>
          </div>
        </>
      ) : (
        <FreeWriteGroupCard data={current} level={level} ttsSettings={ttsSettings} premium={premium} onFirstPackage={() => setPackageIndex(0)} onNextPackage={() => setPackageIndex((i) => Math.min(groups.length - 1, i + 1))} isFirstPackage={packageIndex === 0} isLastPackage={isLast} />
      )}

      {isLast && (
        <>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.6, marginBottom: 6, textAlign: "center" }}>
              Caso grammaticale per il nuovo pacchetto (suggerito: quello meno presente finora)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {ALL_CASES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedGenCase(c)}
                  style={{
                    fontSize: TEXT_SIZES.tiny,
                    fontWeight: 700,
                    background: effectiveGenCase === c ? CASE_COLORS[c] : "none",
                    color: effectiveGenCase === c ? "#1B2430" : CASE_COLORS[c],
                    border: `1px solid ${CASE_COLORS[c]}`,
                    borderRadius: 12,
                    padding: "3px 10px",
                    cursor: "pointer",
                  }}
                >
                  {c}{c === suggestedGenCase ? " ★" : ""}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onGeneratePhraseGroup(level, effectiveGenCase)}
            disabled={phraseGenLoading[level]}
            style={{
              width: "100%",
              marginTop: 10,
              background: "rgba(91,132,177,0.15)",
              border: "1px solid rgba(91,132,177,0.4)",
              borderRadius: 10,
              padding: "12px 14px",
              color: "#5B84B1",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              opacity: phraseGenLoading[level] ? 0.6 : 1,
            }}
          >
            {phraseGenLoading[level] ? <>Genero un nuovo pattern…<LoadingDots /></> : `+ Nuovo pacchetto (altre 5 frasi, ${effectiveGenCase})`}
          </button>
        </>
      )}
      {phraseGenError[level] && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{phraseGenError[level]}</p>
          <button
            onClick={() => onGeneratePhraseGroup(level, effectiveGenCase)}
            disabled={phraseGenLoading[level]}
            style={{
              background: "none",
              border: "1px solid #C1543C",
              borderRadius: 8,
              padding: "3px 10px",
              color: "#C1543C",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔄 Riprova
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// Confronto tollerante per l'esercizio di scrittura libera: ignora accenti tonici (difficili da digitare) oltre a maiuscole/punteggiatura.
function normalizeForTyping(s) {
  return normalizeText(s).replace(/\u0301/g, "").replace(/ё/g, "е");
}

function FreeWriteGroupCard({ data, level, ttsSettings: _ttsSettings, premium, onFirstPackage, onNextPackage, isFirstPackage, isLastPackage }) {
  const [speedMult, setSpeedMult] = useState(1);
  return (
    <div>
      <div
        style={{
          background: "rgba(91,132,177,0.12)",
          border: "1px solid rgba(91,132,177,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div className="mono" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>{data.pattern}</div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 4 }}>{data.pattern_it}</div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginTop: 8 }}>✍️ Scrivi la frase in russo, poi verifica.</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button
            onClick={() => setSpeedMult(1)}
            style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}
          >
            reimposta
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.phrases.map((ph, pi) => (
          <FreeWriteItem key={`${level}-${data.pattern}-${pi}`} itemKey={`${level}-${data.pattern}-${pi}`} phrase={ph} level={level} ttsSettings={_ttsSettings} premium={premium} speedMult={speedMult} />
        ))}
      </div>
      {(onFirstPackage || onNextPackage) && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            onClick={onFirstPackage}
            disabled={isFirstPackage}
            style={{
              flex: 1,
              background: "none",
              border: "1px solid rgba(91,132,177,0.4)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#5B84B1",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: isFirstPackage ? "default" : "pointer",
              opacity: isFirstPackage ? 0.5 : 1,
            }}
          >
            ⏮ Inizio pacchetto
          </button>
          <button
            onClick={onNextPackage}
            disabled={isLastPackage}
            style={{
              flex: 1,
              background: "#5B84B1",
              border: "none",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#1B2430",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: isLastPackage ? "default" : "pointer",
              opacity: isLastPackage ? 0.5 : 1,
            }}
          >
            Avanti →
          </button>
        </div>
      )}
    </div>
  );
}

function FreeWriteItem({ itemKey, phrase, level, ttsSettings: _ttsSettings, premium, speedMult = 1 }) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [loadedKey, setLoadedKey] = useState(null);
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  // ripristina la risposta scritta in precedenza per questa frase (persistenza tra sessioni)
  useEffect(() => {
    (async () => {
      const saved = await loadJSON(`scrivi-answer-${itemKey}`, null);
      if (saved) {
        setValue(saved.value || "");
        setChecked(!!saved.checked);
      } else {
        setValue("");
        setChecked(false);
      }
      setLoadedKey(itemKey);
    })();
  }, [itemKey]);

  const isCorrect = checked && normalizeForTyping(value) === normalizeForTyping(phrase.ru);

  function verify() {
    setChecked(true);
    saveJSON(`scrivi-answer-${itemKey}`, { value, checked: true });
    const wasCorrect = normalizeForTyping(value) === normalizeForTyping(phrase.ru);
    playFeedbackSound(wasCorrect);
    if (!wasCorrect) {
      recordMistake("frasi", level, null, phrase.it, phrase.ru, null);
    }
    // riproduzione automatica non appena la frase russa corretta compare sullo schermo
    play();
  }

  async function play() {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(phrase.ru, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  function wandNextWord() {
    if (checked) return;
    const targetWords = phrase.ru.split(" ");
    const typedWords = value.trim() ? value.trim().split(" ") : [];
    // trova la prima posizione dove la parola già scritta NON corrisponde a quella corretta
    // (confrontando senza badare ad accenti/maiuscole) — se una parola sbagliata è già
    // presente lì, va tolta e sostituita, non semplicemente aggiunta dopo.
    let firstWrong = typedWords.length;
    for (let i = 0; i < typedWords.length && i < targetWords.length; i++) {
      if (normalizeForTyping(typedWords[i]) !== normalizeForTyping(targetWords[i])) {
        firstWrong = i;
        break;
      }
    }
    if (firstWrong >= targetWords.length) return; // già tutto corretto fin dove scritto
    const correctSoFar = typedWords.slice(0, firstWrong);
    const newValue = [...correctSoFar, targetWords[firstWrong]].join(" ");
    setValue(newValue);
    saveJSON(`scrivi-answer-${itemKey}`, { value: newValue, checked: false });
  }

  if (loadedKey !== itemKey) return null; // evita di mostrare per un istante lo stato del pacchetto precedente

  return (
    <div
      style={{
        background: "#232E3D",
        border: "1px solid rgba(240,234,216,0.1)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ fontSize: TEXT_SIZES.emphasisLarge, marginBottom: 10 }}>{phrase.it}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (checked) {
            setChecked(false);
            saveJSON(`scrivi-answer-${itemKey}`, { value: e.target.value, checked: false });
          } else {
            saveJSON(`scrivi-answer-${itemKey}`, { value: e.target.value, checked: false });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) verify();
        }}
        placeholder="Scrivi qui in russo…"
        style={{
          width: "100%",
          background: "#1B2430",
          border: checked ? (isCorrect ? "1px solid #7C8C6B" : "1px solid #C1543C") : "1px solid rgba(240,234,216,0.2)",
          borderRadius: 8,
          padding: "10px 12px",
          color: "#F0EAD8",
          fontSize: TEXT_SIZES.emphasisLarge,
          marginBottom: 8,
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={verify}
          disabled={!value.trim()}
          style={{
            background: "#D9A441",
            border: "none",
            borderRadius: 8,
            padding: "7px 14px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.body,
            cursor: value.trim() ? "pointer" : "default",
            opacity: value.trim() ? 1 : 0.5,
          }}
        >
          Verifica
        </button>
        {!checked && (
          <button
            onClick={wandNextWord}
            disabled={value.trim().split(" ").length >= phrase.ru.split(" ").length && value.trim() !== ""}
            className="magic-wand-btn"
            title="Bacchetta magica: inserisce la prossima parola corretta"
            style={{ width: 34, height: 34, padding: 0, fontSize: TEXT_SIZES.emphasisLarge }}
          >
            🪄
          </button>
        )}
        {checked && (
          <button
            onClick={() => {
              setValue("");
              setChecked(false);
              saveJSON(`scrivi-answer-${itemKey}`, null);
            }}
            style={{ background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 8, padding: "7px 14px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
          >
            Riprova
          </button>
        )}
      </div>
      {checked && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(240,234,216,0.1)" }}>
          <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, color: isCorrect ? "#7C8C6B" : "#C1543C", marginBottom: 4 }}>
            {isCorrect ? "✓ Corretto!" : "✗ Non esatto"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: TEXT_SIZES.emphasisLarge }}>{phrase.ru}</span>
            <button onClick={play} disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)} aria-label="Ascolta" title="Ascolta" style={{ ...iconBtnStyle, width: 24, height: 24 }}>
              <Volume2 size={11} />
            </button>
          </div>
          {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 4 }}>{audioError}</div>}
        </div>
      )}
    </div>
  );
}

function PhraseGroupCard({ data, level, groupIndex, ttsSettings: _ttsSettings, premium, repeatFlags, onToggleRepeatFlag, showOnlyRepeat, speedMult = 1, phraseCaseTags, phraseCaseTagLoading, phraseCaseTagError, onGeneratePhraseCaseTag, extraInterrogative, interrogativeGenLoading, onGenerateInterrogative, allCasesExample, allCasesGenLoading, onGenerateAllCasesExample }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [pron, setPron] = useState({});
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  const visiblePhrases = data.phrases
    .map((ph, pi) => ({ ph, pi }))
    .filter(({ pi }) => !showOnlyRepeat || repeatFlags[`${level}-${groupIndex}-${pi}`]);

  if (showOnlyRepeat && visiblePhrases.length === 0) return null;

  const tagKey = `${level}-${groupIndex}`;
  const hasInterrogative = data.phrases.some((ph) => phraseType(ph.ru) === "int") || !!extraInterrogative?.[tagKey];
  const extraInt = extraInterrogative?.[tagKey];
  const casesEx = allCasesExample?.[tagKey];

  return (
    <div>
      <div
        style={{
          background: "rgba(91,132,177,0.12)",
          border: "1px solid rgba(91,132,177,0.35)",
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="mono" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700, flex: 1 }}>{data.pattern}</div>
          <button
            onClick={() => play("pattern", data.pattern)}
            disabled={audioLoading.pattern || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta" title="Ascolta"
            style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0 }}
          >
            <Volume2 size={13} />
          </button>
        </div>
        <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.78, marginTop: 4 }}>{data.pattern_it}</div>
        {audioError.pattern && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 4 }}>{audioError.pattern}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(() => {
          let lastType = null;
          return visiblePhrases.map(({ ph, pi }) => {
            const key = `${level}-${groupIndex}-${pi}`;
            const p = pron[key];
            const flagged = !!repeatFlags[key];
            const currentType = phraseType(ph.ru);
            const showHeader = currentType !== lastType;
            lastType = currentType;
            const t = PHRASE_TYPE_LABEL[currentType];
            return (
              <React.Fragment key={pi}>
                {showHeader && (
                  <div
                    style={{
                      fontSize: TEXT_SIZES.body,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: t.color,
                      marginTop: pi === visiblePhrases[0].pi ? 0 : 8,
                      marginBottom: 2,
                    }}
                  >
                    {t.text}
                  </div>
                )}
                <div
                  style={{
                    background: "#232E3D",
                    border: flagged ? "1px solid #C1543C" : "1px solid rgba(240,234,216,0.1)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <EditableSentence storageKey={`frase-${key}`} text={ph.ru} itText={ph.it} fontSize={16} />
                  {audioError[key] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 2 }}>{audioError[key]}</div>}
                  {p?.status === "listening" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>In ascolto…</div>}
                  {p?.status === "denied" && (
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>
                      Consenti l'uso del microfono per controllare la pronuncia.
                    </div>
                  )}
                  {p?.status === "error" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 4 }}>Non ho sentito bene, riprova.</div>}
                  {p?.status === "done" && (
                    <div
                      style={{
                        fontSize: TEXT_SIZES.body,
                        marginTop: 4,
                        color: p.score >= 0.85 ? "#7C8C6B" : p.score >= 0.6 ? "#D9A441" : "#C1543C",
                      }}
                    >
                      {p.score >= 0.85
                        ? "Ottima pronuncia! 🎉"
                        : p.score >= 0.6
                        ? `Quasi giusto — ho sentito: "${p.transcript}"`
                        : `Riprova, parlando più lentamente — ho sentito: "${p.transcript}"`}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => play(key, ph.ru)}
                  disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label="Ascolta" title="Ascolta"
                  style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                >
                  <Volume2 size={12} />
                </button>
                <button
                  onClick={() => startPronunciationCheck(ph.ru, (u) => setPron((prev) => ({ ...prev, [key]: u })))}
                  disabled={!SPEECH_RECOGNITION_SUPPORTED || p?.status === "listening"}
                  aria-label="Prova a pronunciare" title="Prova a pronunciare"
                  style={{
                    ...iconBtnStyle,
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    background: p?.status === "listening" ? "rgba(193,84,60,0.4)" : iconBtnStyle.background,
                  }}
                >
                  <Mic size={12} />
                </button>
                <button
                  onClick={() => onToggleRepeatFlag(key)}
                  title={flagged ? "Togli da 'da ripetere'" : "Segna come da ripetere"}
                  style={{
                    ...iconBtnStyle,
                    width: 26,
                    height: 26,
                    flexShrink: 0,
                    background: flagged ? "rgba(193,84,60,0.4)" : iconBtnStyle.background,
                  }}
                >
                  🔁
                </button>
              </div>
                </div>
              </React.Fragment>
            );
          });
        })()}
      </div>

      {!hasInterrogative ? (
        <button
          onClick={() => onGenerateInterrogative(tagKey, data.pattern, data.pattern_it)}
          disabled={interrogativeGenLoading === tagKey}
          style={{
            width: "100%",
            marginTop: 10,
            background: "rgba(91,132,177,0.15)",
            border: "1px solid rgba(91,132,177,0.4)",
            borderRadius: 10,
            padding: "9px 14px",
            color: "#5B84B1",
            fontWeight: 700,
            fontSize: TEXT_SIZES.small,
            cursor: interrogativeGenLoading === tagKey ? "default" : "pointer",
          }}
        >
          {interrogativeGenLoading === tagKey ? <>Genero una domanda…<LoadingDots /></> : "+ Genera una frase interrogativa"}
        </button>
      ) : (
        extraInt && (
          <div style={{ marginTop: 10, background: "#232E3D", border: "1px solid rgba(91,132,177,0.3)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: TEXT_SIZES.tiny, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#5B84B1", marginBottom: 4 }}>Interrogativa</div>
            <div style={{ fontSize: TEXT_SIZES.bodyLarge }}>{extraInt.ru}</div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, fontStyle: "italic", marginTop: 2 }}>{extraInt.it}</div>
          </div>
        )
      )}

      <div style={{ marginTop: 14, borderTop: "1px solid rgba(240,234,216,0.12)", paddingTop: 14 }}>
        <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, marginBottom: 8, opacity: 0.85 }}>📖 Esempio con tutti i casi</div>
        {!casesEx ? (
          <button
            onClick={() => onGenerateAllCasesExample(tagKey, data.pattern, data.pattern_it)}
            disabled={allCasesGenLoading === tagKey}
            style={{
              width: "100%",
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 10,
              padding: "9px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.small,
              cursor: allCasesGenLoading === tagKey ? "default" : "pointer",
            }}
          >
            {allCasesGenLoading === tagKey ? <>Genero l'esempio…<LoadingDots /></> : "+ Genera esempio con tutti i casi"}
          </button>
        ) : (
          <div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, marginBottom: 8 }}>
              «{casesEx.word}» — {casesEx.meaning_it}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {casesEx.cases.map((c, ci) => (
                <div key={ci} style={{ background: "#232E3D", borderRadius: 8, padding: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: TEXT_SIZES.tiny, fontWeight: 700, color: "#D9A441" }}>{c.case}</span>
                    <span className="mono" style={{ fontSize: TEXT_SIZES.body }}>{c.form}</span>
                  </div>
                  <div style={{ fontSize: TEXT_SIZES.small }}>{c.example_ru}</div>
                  <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.6, fontStyle: "italic" }}>{c.example_it}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Compose (IT -> RU sentence building) ----------

function ComposeView({ ttsSettings, premium, customComposeGroups, composeGenLoading, composeGenError, onGenerateComposeGroup, jumpTo, onConsumeJump, learnedPackages, onToggleLearnedPackage, onBack, phraseCaseTags, phraseCaseTagLoading, phraseCaseTagError, onGeneratePhraseCaseTag, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [speedMult, setSpeedMult] = useState(1);
  const [packageIndex, setPackageIndex] = useState(0);
  const [selectedGenCase, setSelectedGenCase] = useState(null);
  const isJumpingRef = useRef(false);

  const suggestedGenCase = leastRepresentedCase(
    [...COMPOSE_GROUPS[level], ...(customComposeGroups[level] || [])].flatMap((g) => g.items.map((i) => i.ru))
  );
  const effectiveGenCase = selectedGenCase || suggestedGenCase;

  useEffect(() => {
    if (jumpTo) {
      isJumpingRef.current = true;
      setLevel(jumpTo.level || "A1");
      setPackageIndex(jumpTo.packageIndex || 0);
      onConsumeJump();
    }
  }, [jumpTo]);

  const groups = [...COMPOSE_GROUPS[level], ...(customComposeGroups[level] || [])];
  const prevCountRef = useRef(groups.length);

  useEffect(() => {
    if (isJumpingRef.current) {
      isJumpingRef.current = false;
      return;
    }
    setPackageIndex(0);
  }, [level]);

  useEffect(() => {
    if (groups.length > prevCountRef.current) {
      setPackageIndex(prevCountRef.current);
    }
    prevCountRef.current = groups.length;
  }, [groups.length]);

  const current = groups[Math.min(packageIndex, groups.length - 1)];
  const isLast = packageIndex >= groups.length - 1;

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Componi la frase
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 4 }}>
        Leggi la frase in italiano e ricomponila in russo scegliendo le parole in ordine.
      </p>
      <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 14, fontStyle: "italic" }}>
        Libreria libera di frasi per tema e livello. Per esercizi legati a una lezione specifica, vedi "Costruisci la frase" dentro ogni lezione.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setLevel(l.id);
              setSelectedGenCase(null);
            }}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 20,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      <LevelProgressBar sectionId="componi" level={level} total={groups.length} learnedPackages={learnedPackages} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 18,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "8px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button
          onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))}
          title="Più lento"
          style={{ ...iconBtnStyle, width: 28, height: 28 }}
        >
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 40, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button
          onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))}
          title="Più veloce"
          style={{ ...iconBtnStyle, width: 28, height: 28 }}
        >
          🐇
        </button>
        {speedMult !== 1 && (
          <button
            onClick={() => setSpeedMult(1)}
            style={{
              background: "none",
              border: "none",
              color: "#D9A441",
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            reimposta
          </button>
        )}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : (
        <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button
          onClick={() => setPackageIndex((i) => Math.max(0, i - 1))}
          disabled={packageIndex === 0}
          style={pkgNavBtnStyle(packageIndex === 0)}
        >
          ◀
        </button>
        <PackageJumpInput index={packageIndex} total={groups.length} onJump={setPackageIndex} />
        <button
          onClick={() => setPackageIndex((i) => Math.min(groups.length - 1, i + 1))}
          disabled={isLast}
          style={pkgNavBtnStyle(isLast)}
        >
          ▶
        </button>
      </div>

      <div>
        <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <LearnedCircle sectionId="componi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />
          {current.theme}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {current.items.map((item, ii) => {
            const total = current.items.length;
            const third = Math.ceil(total / 3);
            const isGroupStart = total % 3 === 0 && (ii === 0 || ii === third || ii === third * 2);
            const groupLabel =
              total % 3 === 0
                ? ii < third
                  ? "Affermativa"
                  : ii < third * 2
                  ? "Negativa"
                  : "Interrogativa"
                : null;
            const groupColor = groupLabel === "Affermativa" ? "#5B84B1" : groupLabel === "Negativa" ? "#C1543C" : "#D9A441";
            return (
              <div key={`${level}-${packageIndex}-${ii}`}>
                {isGroupStart && (
                  <div
                    style={{
                      fontSize: TEXT_SIZES.body,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: groupColor,
                      marginBottom: 6,
                      marginTop: ii === 0 ? 0 : 6,
                      borderTop: ii === 0 ? "none" : "1px solid rgba(240,234,216,0.12)",
                      paddingTop: ii === 0 ? 0 : 12,
                    }}
                  >
                    {groupLabel}
                  </div>
                )}
                <ComposeItemCard
                  item={item}
                  level={level}
                  itemKey={`${level}-${packageIndex}-${ii}`}
                  ttsSettings={ttsSettings}
                  premium={premium}
                  speedMult={speedMult}
                />
                <div style={{ textAlign: "right", marginTop: 2 }}>
                  <PhraseCaseTag ru={item.ru} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LearnedPackageButton sectionId="componi" level={level} index={packageIndex} learnedPackages={learnedPackages} onToggle={onToggleLearnedPackage} />

      {isLast && (
        <>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.6, marginBottom: 6, textAlign: "center" }}>
              Caso grammaticale per il nuovo pacchetto (suggerito: quello meno presente finora)
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {ALL_CASES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedGenCase(c)}
                  style={{
                    fontSize: TEXT_SIZES.tiny,
                    fontWeight: 700,
                    background: effectiveGenCase === c ? CASE_COLORS[c] : "none",
                    color: effectiveGenCase === c ? "#1B2430" : CASE_COLORS[c],
                    border: `1px solid ${CASE_COLORS[c]}`,
                    borderRadius: 12,
                    padding: "3px 10px",
                    cursor: "pointer",
                  }}
                >
                  {c}{c === suggestedGenCase ? " ★" : ""}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onGenerateComposeGroup(level, effectiveGenCase)}
            disabled={composeGenLoading[level]}
            style={{
              width: "100%",
              marginTop: 10,
              background: "rgba(193,84,60,0.15)",
              border: "1px solid rgba(193,84,60,0.4)",
              borderRadius: 10,
              padding: "12px 14px",
              color: "#C1543C",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              opacity: composeGenLoading[level] ? 0.6 : 1,
            }}
          >
            {composeGenLoading[level] ? <>Genero nuove frasi…<LoadingDots /></> : `+ Nuovo pacchetto (nuovo argomento, ${effectiveGenCase})`}
          </button>
        </>
      )}
      {composeGenError[level] && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{composeGenError[level]}</p>
          <button
            onClick={() => onGenerateComposeGroup(level, effectiveGenCase)}
            disabled={composeGenLoading[level]}
            style={{
              background: "none",
              border: "1px solid #C1543C",
              borderRadius: 8,
              padding: "3px 10px",
              color: "#C1543C",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🔄 Riprova
          </button>
        </div>
      )}
        </>
      )}
    </div>
  );
}

function ComposeItemCard({ item, level, itemKey, ttsSettings: _ttsSettings, premium, speedMult = 1 }) {
  const [builderState, setBuilderState] = useState({ chosen: [], pool: shuffleOnce(item.tokens) });
  const [checked, setChecked] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const ttsSettings = { ..._ttsSettings, rate: (LEVEL_RATE[level] || _ttsSettings.rate) * speedMult };

  useEffect(() => {
    setBuilderState({ chosen: [], pool: shuffleOnce(item.tokens) });
    setChecked(false);
  }, [itemKey]);

  const isCorrect = normalizeText(builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(item.ru);

  return (
    <div
      style={{
        background: "#232E3D",
        border: "1px solid rgba(240,234,216,0.1)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ fontSize: TEXT_SIZES.emphasisLarge, marginBottom: 10 }}>{item.it}</div>

      <div
        onDragOver={(e) => {
          e.preventDefault(); // necessario perché il browser permetta il drop qui
          e.dataTransfer.dropEffect = "move";
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const idx = parseInt(e.dataTransfer.getData("text/plain"), 10);
          if (Number.isNaN(idx)) return;
          setChecked(false);
          setBuilderState((s) => {
            const pool = [...s.pool];
            const [tok] = pool.splice(idx, 1);
            if (!tok) return s; // indice non più valido: non fare nulla, non crashare
            return { chosen: [...s.chosen, tok], pool };
          });
        }}
        style={{
          minHeight: 40,
          border: `1px dashed ${dragOver ? "#D9A441" : "rgba(240,234,216,0.25)"}`,
          background: dragOver ? "rgba(217,164,65,0.08)" : "transparent",
          borderRadius: 10,
          padding: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 8,
          transition: "border-color 0.15s ease, background 0.15s ease",
        }}
      >
        {builderState.chosen.length === 0 && (
          <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.35 }}>Tocca o trascina le parole qui sotto in ordine…</span>
        )}
        {builderState.chosen.map((tok, idx) => (
          <button
            key={idx}
            onClick={() => {
              setChecked(false);
              setBuilderState((s) => {
                const chosen = [...s.chosen];
                const [removed] = chosen.splice(idx, 1);
                return { chosen, pool: [...s.pool, removed] };
              });
            }}
            style={{
              background: "rgba(91,132,177,0.3)",
              border: "1px solid rgba(91,132,177,0.5)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            {tok.t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {builderState.pool.map((tok, idx) => (
          <button
            key={idx}
            draggable
            onDragStart={(e) => {
              // Trascinamento aggiuntivo, non sostitutivo: onClick sotto resta
              // identico, quindi chi preferisce toccare le parole in sequenza
              // continua a farlo esattamente come prima — questo è solo un modo
              // in più per chi preferisce trascinare, specialmente su tablet.
              e.dataTransfer.setData("text/plain", String(idx));
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => {
              setChecked(false);
              setBuilderState((s) => {
                const pool = [...s.pool];
                pool.splice(idx, 1);
                return { chosen: [...s.chosen, tok], pool };
              });
            }}
            style={{
              background: "#1B2430",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 8,
              padding: "6px 10px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "grab",
            }}
          >
            {tok.t}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            setChecked(true);
            playFeedbackSound(isCorrect);
            if (!isCorrect) {
              recordMistake("componi", level, null, item.it, item.ru, null);
            }
          }}
          disabled={builderState.pool.length > 0}
          style={{
            background: "#7C8C6B",
            border: "none",
            borderRadius: 8,
            padding: "7px 14px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.body,
            cursor: builderState.pool.length > 0 ? "default" : "pointer",
            opacity: builderState.pool.length > 0 ? 0.5 : 1,
          }}
        >
          Verifica
        </button>
        <button
          onClick={() => {
            setBuilderState({ chosen: [], pool: shuffleOnce(item.tokens) });
            setChecked(false);
          }}
          style={{
            background: "none",
            border: "1px solid rgba(240,234,216,0.2)",
            borderRadius: 8,
            padding: "7px 14px",
            color: "#F0EAD8",
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
            opacity: 0.7,
          }}
        >
          Ricomincia
        </button>
        <button
          onClick={() => {
            setChecked(false);
            setBuilderState((s) => {
              // trova la prima posizione dove la tessera già messa NON è quella giusta
              // (il suo indice originale non corrisponde alla posizione che occupa) — se
              // c'è una tessera sbagliata lì, va tolta e rimessa nel mazzo, non ignorata.
              let firstWrong = s.chosen.length;
              for (let pos = 0; pos < s.chosen.length; pos++) {
                if (s.chosen[pos].i !== pos) {
                  firstWrong = pos;
                  break;
                }
              }
              const nextOriginalIndex = firstWrong;
              const wrongTiles = s.chosen.slice(firstWrong);
              const stillCorrect = s.chosen.slice(0, firstWrong);
              const poolWithWrongBack = [...s.pool, ...wrongTiles];
              const poolIdx = poolWithWrongBack.findIndex((t) => t.i === nextOriginalIndex);
              if (poolIdx === -1) return s;
              const pool = [...poolWithWrongBack];
              const [picked] = pool.splice(poolIdx, 1);
              return { chosen: [...stillCorrect, picked], pool };
            });
          }}
          disabled={builderState.pool.length === 0 && builderState.chosen.every((t, pos) => t.i === pos)}
          title="Bacchetta magica: inserisce la prossima parola corretta"
          className="magic-wand-btn"
        >
          🪄
        </button>
        <button
          onClick={async () => {
            setAudioLoading(true);
            setAudioError(null);
            await playAudio(item.ru, { ttsSettings, premium }, (msg) => setAudioError(msg));
            setAudioLoading(false);
          }}
          disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
          aria-label="Ascolta la frase corretta" title="Ascolta la frase corretta"
          style={{ ...iconBtnStyle, width: 32, height: 32 }}
        >
          <Volume2 size={13} />
        </button>
      </div>

      {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}

      {checked && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, color: isCorrect ? "#7C8C6B" : "#C1543C" }}>
            {isCorrect ? "Esatto! 🎉" : `Non proprio — la frase corretta è: "${item.ru}"`}
          </div>
          <PronunciationHint text={item.ru} />
        </div>
      )}
    </div>
  );
}

// ---------- Daily session ----------

function sessionStepLabel(step) {
  switch (step.type) {
    case "flashcard":
      return `🎴 ${step.card?.ru || "?"}`;
    case "phrase":
      return `💬 ${step.ru || "?"}`;
    case "compose":
      return `🧩 ${step.item?.ru || "?"}`;
    case "declension":
      return `📖 ${step.word || "?"} (${step.case || ""})`;
    case "verb":
      return `🗣️ ${step.word || "?"}`;
    default:
      return "?";
  }
}

// ---------- Scrivi in Corsivo ----------

function useCursiveFontAvailable() {
  const [available, setAvailable] = useState(null); // null = ancora in controllo
  useEffect(() => {
    let cancelled = false;
    if (typeof document === "undefined" || !document.fonts) {
      setAvailable(false);
      return;
    }
    (async () => {
      try {
        await document.fonts.load('italic 24px "PT Serif"');
        await new Promise((r) => setTimeout(r, 120));
        const ok = document.fonts.check('italic 24px "PT Serif"');
        if (!cancelled) setAvailable(ok);
      } catch {
        if (!cancelled) setAvailable(false);
      }
    })();
    // fallback di sicurezza: se il controllo non risponde entro 1.5s, considera il font assente
    const timer = setTimeout(() => {
      if (!cancelled) setAvailable((prev) => (prev === null ? false : prev));
    }, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  return available;
}

// Immagine SVG di riserva quando il font corsivo non è disponibile sul dispositivo:
// mostra comunque la parola in uno stile inclinato/manoscritto usando un font generico "cursive".
function CursiveFallbackImage({ text }) {
  const width = Math.max(160, text.length * 26);
  return (
    <svg viewBox={`0 0 ${width} 60`} width="100%" height="60" style={{ maxWidth: 320, display: "block", margin: "0 auto" }}>
      <text
        x={width / 2}
        y={40}
        textAnchor="middle"
        fontSize="30"
        fontStyle="italic"
        fontFamily="cursive, 'Comic Sans MS', sans-serif"
        fill="#F0EAD8"
      >
        {text}
      </text>
    </svg>
  );
}

// Partner di conversazione IA: a differenza di tutto il resto dell'app (dialoghi
// pre-scritti, quiz a risposta fissa), qui la risposta russa è generata al momento,
// diversa ogni volta, e reagisce davvero a quello che scrive lo studente — la prima
// funzionalità dell'app che offre un'esperienza non ripetibile identica due volte.
// Stesso schema di gating/generazione di CursiveWritingView (interamente IA, gated
// sull'intera funzione), stesso stile visivo, stessa funzione callClaudeJSON.
// Produzione scritta libera a tempo: un tema dato, un minuto per scrivere in russo
// senza aiuto, poi correzione IA — completa lo spazio tra "Componi" (guidato a scelta
// multipla) e la Conversazione (parlata): qui si allena la produzione libera SCRITTA.
function TimedWritingView({ ttsSettings: _ttsSettings, premium, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [topic, setTopic] = useState(null);
  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [phase, setPhase] = useState("pick"); // "pick" | "writing" | "done" | "result"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  function startWriting(chosenTopic) {
    playNavigationSound();
    setTopic(chosenTopic);
    setText("");
    setSecondsLeft(60);
    setResult(null);
    setError(null);
    setPhase("writing");
    // stesso principio già imparato sul sottofondo ambientale: la variabile che il
    // tick controlla va assegnata PRIMA di programmare il primo tick, non dopo —
    // altrimenti il controllo di sicurezza bloccherebbe silenziosamente la prima
    // esecuzione (o, come qui, servirebbe comunque per fermare il countdown al momento
    // giusto senza sovrapposizioni se il componente venisse rimontato rapidamente).
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (phase === "writing" && secondsLeft === 0) {
      finish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  useEffect(() => {
    // pulizia: ferma il timer se si abbandona la vista a metà scrittura, per non
    // lasciare un intervallo orfano che continua a girare in background.
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function finish() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase("done");
    if (!text.trim()) {
      setPhase("pick");
      setTopic(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua che corregge un breve testo scritto da uno studente italiano di livello ${level} (CEFR), sul tema "${topic}". Analizza SOLO il testo qui sotto, non aggiungere altro.

Testo dello studente:
"""
${text.trim()}
"""

Rispondi SOLO in questo formato, senza altro testo prima o dopo:
===JSON===
{"corrected_ru": "versione corretta del testo intero, minime modifiche necessarie", "feedback_it": "1-2 frasi di incoraggiamento e il punto principale da migliorare, in italiano", "main_error_ru": "la correzione più importante isolata come frase breve, o stringa vuota se il testo era già corretto"}
===END===`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.corrected_ru) throw new Error("Risposta non riuscita.");
      setResult(parsed);
      if (parsed.main_error_ru) {
        // stesso sistema di ripasso spaziato già usato per la Conversazione — un
        // errore trovato qui non deve sparire dopo questa sola sessione.
        recordMistake("produzione-scritta", level, text.trim(), null, parsed.main_error_ru, null);
      }
      setPhase("result");
    } catch (e) {
      setError("Non sono riuscita a correggere il testo. Verifica la connessione e riprova.");
      setPhase("result");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Scrittura a tempo
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10 }}>
        Un tema, un minuto, scrivi in russo senza aiuto — poi la correzione.
      </p>

      {!unlocked ? (
        <div style={{ border: "1px dashed rgba(217,164,65,0.4)", borderRadius: 14, padding: "28px 20px", textAlign: "center", background: "rgba(217,164,65,0.06)" }}>
          <div className="lock-snap-in" style={{ fontSize: TEXT_SIZES.hero, marginBottom: 10 }}>🔒</div>
          <div style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginBottom: 6 }}>Scrittura a tempo — abbonamento</div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 18, maxWidth: 340, marginInline: "auto" }}>
            La correzione IA della produzione libera fa parte dell'abbonamento.
          </div>
          <button onClick={onGoToPaywall} style={{ background: "#D9A441", border: "none", borderRadius: 10, padding: "10px 24px", color: "#1B2430", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}>
            Sblocca con l'abbonamento
          </button>
        </div>
      ) : phase === "pick" ? (
        <>
          <CefrThermometer level={level} />
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                style={{
                  background: level === l.id ? l.color : "#232E3D",
                  border: "1px solid rgba(240,234,216,0.15)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: level === l.id ? readableTextColor(l.color) : "#F0EAD8",
                  fontSize: TEXT_SIZES.small,
                  fontWeight: level === l.id ? 700 : 400,
                  transition: "background 0.2s ease, color 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {l.id}
              </button>
            ))}
          </div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10 }}>Scegli un tema:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CONTEXT_SUGGESTIONS.map((ctx) => (
              <button
                key={ctx}
                onClick={() => startWriting(ctx)}
                style={{ background: "rgba(91,132,177,0.15)", border: "1px solid rgba(91,132,177,0.4)", borderRadius: 10, padding: "8px 14px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
              >
                {ctx}
              </button>
            ))}
          </div>
        </>
      ) : phase === "writing" ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7 }}>Tema: <strong>{topic}</strong></div>
            <div
              style={{
                fontSize: TEXT_SIZES.emphasisLarge,
                fontWeight: 700,
                color: secondsLeft <= 10 ? "#C1543C" : "#D9A441",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {secondsLeft}s
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi in russo…"
            rows={6}
            style={{ width: "100%", background: "#232E3D", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 10, padding: 12, color: "#F0EAD8", fontSize: TEXT_SIZES.subtitle, resize: "vertical", marginBottom: 12 }}
          />
          <button
            onClick={finish}
            style={{ width: "100%", background: "#D9A441", border: "none", borderRadius: 10, padding: "12px 0", color: "#1B2430", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
          >
            Ho finito
          </button>
        </>
      ) : phase === "done" || loading ? (
        <div style={{ textAlign: "center", padding: 40, opacity: 0.6 }}>
          Correggo il tuo testo…<LoadingDots />
        </div>
      ) : (
        <>
          {error && <div style={{ color: "#C1543C", fontSize: TEXT_SIZES.body, marginBottom: 14 }}>{error}</div>}
          {result && (
            <>
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 4 }}>La tua versione corretta:</div>
              <div style={{ background: "#232E3D", border: "1px solid rgba(124,140,107,0.4)", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: TEXT_SIZES.subtitle }}>
                {result.corrected_ru}
              </div>
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.85, marginBottom: 20 }}>{result.feedback_it}</div>
            </>
          )}
          <button
            onClick={() => {
              playNavigationSound();
              setPhase("pick");
              setTopic(null);
              setText("");
            }}
            style={{ width: "100%", background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 10, padding: "12px 0", color: "#F0EAD8", fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
          >
            ↺ Un altro tema
          </button>
        </>
      )}
    </div>
  );
}

function ConversationView({ ttsSettings: _ttsSettings, premium, onBack, unlocked, onGoToPaywall, onBumpStreak, onConversationTurn }) {
  const [level, setLevel] = useState("A1");
  const [messages, setMessages] = useState([]); // {role: "user"|"assistant", ru, it, correction}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [reportedMessages, setReportedMessages] = useState({});
  const ttsSettings = { ..._ttsSettings, rate: LEVEL_RATE[level] || _ttsSettings.rate };
  useEffect(() => {
    // Avvisa la mascotte nell'header (componente separato in App) quando l'IA sta
    // "pensando" — stesso schema già usato per matryoshka-feedback: un evento
    // globale invece di passare stato attraverso il componente radice.
    window.dispatchEvent(new CustomEvent("matryoshka-thinking", { detail: { active: loading } }));
    return () => {
      if (loading) window.dispatchEvent(new CustomEvent("matryoshka-thinking", { detail: { active: false } }));
    };
  }, [loading]);

  async function startWithTopic(ctx) {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua che sta per iniziare una conversazione libera con uno studente italiano di livello ${level} (CEFR). Apri tu la conversazione parlando dell'argomento "${ctx}" — un saluto breve e una prima domanda o osservazione su quel tema, per invitare lo studente a rispondere.

Scrivi in russo con 1-2 frasi brevi, a un livello di difficoltà adatto a ${level}.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"reply_ru":"il tuo messaggio di apertura in russo","reply_it":"traduzione italiana"}`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.reply_ru) throw new Error("Non sono riuscita a iniziare la conversazione.");
      setMessages([{ role: "assistant", ru: parsed.reply_ru, it: parsed.reply_it || "" }]);
      onBumpStreak?.();
    } catch (e) {
      setError("Non sono riuscita a iniziare la conversazione. Verifica la connessione e riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    setError(null);
    const userMsg = { role: "user", ru: text };
    // Solo gli ultimi scambi recenti, non l'intera cronologia: senza questo limite,
    // una conversazione lunga farebbe crescere il prompt (e il costo di ogni singola
    // chiamata) senza limite, fino a rischiare di superare i token massimi accettati
    // dall'API. 10 messaggi (5 scambi circa) bastano per mantenere il filo del
    // discorso senza far crescere indefinitamente ogni richiesta.
    const recentMessages = messages.slice(-10);
    const historyText = recentMessages
      .map((m) => `${m.role === "user" ? "Studente" : "Insegnante"}: ${m.ru}`)
      .join("\n");
    try {
      const prompt = `Sei un'insegnante di russo madrelingua che chiacchiera liberamente con uno studente italiano di livello ${level} (CEFR). Questa è una vera conversazione, non un esercizio a risposta fissa: reagisci davvero a quello che scrive lo studente, fai domande di seguito, mantieni un tono caldo e naturale.

${historyText ? `Conversazione finora:\n${historyText}\n` : "(Questo è il primo messaggio della conversazione: saluta e chiedi qualcosa per iniziare.)"}
Lo studente ha appena scritto: "${text}"

Rispondi in russo con 1-2 frasi brevi, a un livello di difficoltà adatto a ${level}. Se il messaggio dello studente contiene un errore grammaticale o lessicale chiaro, forniscilo anche corretto — altrimenti lascia il campo vuoto.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"reply_ru":"la tua risposta in russo","reply_it":"traduzione italiana della tua risposta","correction_ru":"versione corretta del messaggio dello studente, o stringa vuota se non serve"}`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.reply_ru) throw new Error("Risposta non riuscita.");
      userMsg.correction = parsed.correction_ru || null;
      if (userMsg.correction) {
        // Alimenta lo stesso sistema di ripasso spaziato usato da tutti gli altri
        // errori nell'app — senza questo, un errore fatto in conversazione veniva
        // mostrato una volta e poi dimenticato, mentre ogni altro errore nell'app
        // ritorna nella coda "Difficoltà" finché non viene padroneggiato.
        recordMistake("conversazione", level, text, null, userMsg.correction, null);
      }
      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", ru: parsed.reply_ru, it: parsed.reply_it || "" },
      ]);
      setInput("");
      onBumpStreak?.();
      onConversationTurn?.();
    } catch (e) {
      // Sempre un messaggio fisso e comprensibile, mai il dettaglio tecnico
      // dell'errore interno (che potrebbe essere qualcosa come "JSON non valido…")
      // — stesso standard già stabilito altrove nell'app per gli errori IA.
      setError("Non sono riuscita a rispondere. Verifica la connessione e riprova.");
    } finally {
      setLoading(false);
    }
  }

  async function playLine(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Conversazione libera
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10 }}>
        Chiacchiera in russo: ogni risposta è generata al momento, mai la stessa due volte.
      </p>

      {!unlocked ? (
        <div
          style={{
            border: "1px dashed rgba(217,164,65,0.4)",
            borderRadius: 14,
            padding: "28px 20px",
            textAlign: "center",
            background: "rgba(217,164,65,0.06)",
          }}
        >
          <div className="lock-snap-in" style={{ fontSize: TEXT_SIZES.hero, marginBottom: 10 }}>🔒</div>
          <div style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginBottom: 6 }}>Conversazione libera — abbonamento</div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 18, maxWidth: 340, marginInline: "auto" }}>
            Ogni risposta qui è generata al momento: fa parte dell'abbonamento, senza limiti per
            livello.
          </div>
          <button
            onClick={onGoToPaywall}
            style={{
              background: "#D9A441",
              border: "none",
              borderRadius: 10,
              padding: "10px 24px",
              color: "#1B2430",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: "pointer",
            }}
          >
            Sblocca con l'abbonamento
          </button>
        </div>
      ) : (
        <>
          <CefrThermometer level={level} />
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                style={{
                  background: level === l.id ? l.color : "#232E3D",
                  border: "1px solid rgba(240,234,216,0.15)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: level === l.id ? readableTextColor(l.color) : "#F0EAD8",
                  fontSize: TEXT_SIZES.small,
                  fontWeight: level === l.id ? 700 : 400,
                  transition: "background 0.2s ease, color 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {l.id}
              </button>
            ))}
            {messages.length > 0 && (
              <button
                onClick={() => {
                  playNavigationSound();
                  setMessages([]);
                  setError(null);
                }}
                disabled={loading}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "1px solid rgba(240,234,216,0.15)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: "#F0EAD8",
                  opacity: loading ? 0.3 : 0.7,
                  fontSize: TEXT_SIZES.small,
                  cursor: loading ? "default" : "pointer",
                }}
              >
                ↺ Ricomincia
              </button>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, maxHeight: 420, overflowY: "auto" }}>
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ opacity: 0.5, fontSize: TEXT_SIZES.body, marginBottom: 10 }}>
                  Scrivi qualcosa in russo qui sotto per iniziare — anche solo "Привет!" — oppure scegli un argomento:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                  {CONTEXT_SUGGESTIONS.map((ctx) => (
                    <button
                      key={ctx}
                      onClick={() => {
                        playNavigationSound();
                        startWithTopic(ctx);
                      }}
                      style={{
                        background: "rgba(91,132,177,0.15)",
                        border: "1px solid rgba(91,132,177,0.4)",
                        borderRadius: 8,
                        padding: "5px 10px",
                        color: "#F0EAD8",
                        fontSize: TEXT_SIZES.small,
                        cursor: "pointer",
                      }}
                    >
                      {ctx}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    background: m.role === "user" ? "#5B84B1" : "#232E3D",
                    border: m.role === "assistant" ? "1px solid rgba(240,234,216,0.12)" : "none",
                    borderRadius: 12,
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: TEXT_SIZES.bodyLarge }}>{m.ru}</span>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => playLine(m.ru)}
                      disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                      aria-label="Ascolta"
                      title="Ascolta"
                      style={{ background: "none", border: "none", color: "#D9A441", cursor: "pointer", padding: 0, display: "flex" }}
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                  {m.role === "assistant" && !reportedMessages[i] && (
                    <button
                      onClick={async () => {
                        const queue = await loadJSON("reported-ai-messages", []);
                        queue.push({ text: m.ru, translation: m.it || null, reportedAt: Date.now() });
                        await saveJSON("reported-ai-messages", queue);
                        setReportedMessages((r) => ({ ...r, [i]: true }));
                      }}
                      aria-label="Segnala questa risposta come inappropriata"
                      title="Segnala come inappropriata"
                      style={{ background: "none", border: "none", color: "rgba(240,234,216,0.4)", cursor: "pointer", padding: 0, display: "flex" }}
                    >
                      🚩
                    </button>
                  )}
                  {m.role === "assistant" && reportedMessages[i] && (
                    <span style={{ fontSize: TEXT_SIZES.tiny, color: "#7C8C6B" }}>Segnalata</span>
                  )}
                </div>
                {m.role === "assistant" && m.it && (
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginTop: 2 }}>{m.it}</div>
                )}
                {m.role === "user" && m.correction && (
                  <div style={{ fontSize: TEXT_SIZES.small, color: "#D9A441", marginTop: 2, opacity: 0.85, display: "flex", alignItems: "center", gap: 5 }}>
                    <span>💡 forse meglio: {m.correction}</span>
                    <button
                      onClick={() => playLine(m.correction)}
                      disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                      aria-label="Ascolta la correzione"
                      title="Ascolta la correzione"
                      style={{ background: "none", border: "none", color: "#D9A441", cursor: "pointer", padding: 0, display: "flex", flexShrink: 0 }}
                    >
                      <Volume2 size={12} />
                    </button>
                    <span title="Salvata tra le difficoltà da ripassare" style={{ opacity: 0.6, fontSize: TEXT_SIZES.tiny, flexShrink: 0 }}>
                      📌
                    </span>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "flex-start", fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
                Sta scrivendo<LoadingDots />
              </div>
            )}
          </div>

          {audioError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginBottom: 8 }}>{audioError}</div>}
          {error && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginBottom: 8 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Scrivi in russo…"
              style={{
                flex: 1,
                background: "#1B2430",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 8,
                padding: "8px 10px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.bodyLarge,
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: "#D9A441",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                color: "#1B2430",
                fontWeight: 700,
                cursor: loading || !input.trim() ? "default" : "pointer",
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Invia
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CursiveWritingView({ ttsSettings: _ttsSettings, premium, onBack, unlocked, onGoToPaywall, onBumpStreak }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null); // { it, ru }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [cardImageUrl, setCardImageUrl] = useState(null);
  const [cardGenerating, setCardGenerating] = useState(false);
  const cursiveFontAvailable = useCursiveFontAvailable();
  const ttsSettings = { ..._ttsSettings, rate: (_ttsSettings?.rate || 0.92) * speedMult };

  function generateGreetingCard() {
    if (!result) return;
    setCardGenerating(true);
    // canvas renderizzato lato client: sfondo a tema con il tricolore sfumato ai bordi
    // (coerente con lo sfondo generale dell'app), frase russa in corsivo grande al centro,
    // traduzione italiana sotto — pensato per essere salvato e condiviso come un biglietto.
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setCardGenerating(false);
      return;
    }

    ctx.fillStyle = "#001F5B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "rgba(193,84,60,0.25)");
    grad.addColorStop(0.5, "rgba(240,234,216,0.12)");
    grad.addColorStop(1, "rgba(91,132,177,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#D9A441";
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.fillStyle = "#F0EAD8";
    ctx.textAlign = "center";

    ctx.font = "italic 64px Georgia, 'Times New Roman', serif";
    wrapCanvasText(ctx, result.ru, canvas.width / 2, canvas.height / 2 - 20, canvas.width - 160, 76);

    ctx.font = "28px Georgia, serif";
    ctx.globalAlpha = 0.7;
    ctx.fillText(result.it, canvas.width / 2, canvas.height - 90);
    ctx.globalAlpha = 1;

    ctx.font = "22px Georgia, serif";
    ctx.fillStyle = "#D9A441";
    ctx.fillText("Матрёшка Мариса", canvas.width / 2, canvas.height - 50);

    setCardImageUrl(canvas.toDataURL("image/png"));
    setCardGenerating(false);
  }

  async function playResult() {
    if (!result) return;
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(result.ru, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  async function translate() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Traduci in russo questa frase o parola italiana: "${input.trim()}".

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"ru":"traduzione russa naturale e corretta, con maiuscola iniziale se è l'inizio di una frase"}`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.ru) throw new Error("Traduzione non riuscita.");
      setResult({ it: input.trim(), ru: parsed.ru });
      setCardImageUrl(null);
      // Stessa attività di apprendimento genuina della Conversazione (scrittura
      // attiva + risposta IA in tempo reale) — deve contribuire alla serie allo
      // stesso modo, non solo le lezioni predefinite.
      onBumpStreak?.();
    } catch (e) {
      setError("Non sono riuscita a tradurre. Riprova.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Scrivi in corsivo
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 10 }}>
        Scrivi una parola o frase in italiano: te la mostro in russo stampatello e in corsivo.
      </p>

      {!unlocked ? (
        <div
          style={{
            border: "1px dashed rgba(217,164,65,0.4)",
            borderRadius: 14,
            padding: "28px 20px",
            textAlign: "center",
            background: "rgba(217,164,65,0.06)",
          }}
        >
          <div className="lock-snap-in" style={{ fontSize: TEXT_SIZES.hero, marginBottom: 10 }}>🔒</div>
          <div style={{ fontSize: TEXT_SIZES.emphasis, fontWeight: 700, marginBottom: 6 }}>Scrittura in corsivo — abbonamento</div>
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginBottom: 18, maxWidth: 340, marginInline: "auto" }}>
            Ogni traduzione qui è generata al momento: fa parte dell'abbonamento, senza limiti per
            livello.
          </div>
          <button
            onClick={onGoToPaywall}
            style={{
              background: "#D9A441",
              color: "#1B2430",
              border: "none",
              borderRadius: 10,
              padding: "12px 26px",
              fontSize: TEXT_SIZES.bodyLarge,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sblocca con l'abbonamento
          </button>
        </div>
      ) : (
        <>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {["Buongiorno, come stai?", "Grazie mille", "Dove si trova la stazione?", "Mi piace la musica", "Che ore sono?"].map((ex) => (
          <button
            key={ex}
            onClick={() => setInput(ex)}
            style={{
              background: "#232E3D",
              border: "1px solid rgba(240,234,216,0.15)",
              borderRadius: 16,
              padding: "5px 12px",
              color: "#F0EAD8",
              fontSize: TEXT_SIZES.body,
              opacity: 0.75,
              cursor: "pointer",
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) translate();
        }}
        placeholder="Es. Buongiorno, come stai?"
        style={{
          width: "100%",
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.2)",
          borderRadius: 10,
          padding: "12px 14px",
          color: "#F0EAD8",
          fontSize: TEXT_SIZES.subtitle,
          marginBottom: 12,
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={translate}
        disabled={!input.trim() || loading}
        style={{
          width: "100%",
          background: "#D9A441",
          border: "none",
          borderRadius: 10,
          padding: "12px 16px",
          color: "#1B2430",
          fontWeight: 700,
          fontSize: TEXT_SIZES.emphasisLarge,
          cursor: input.trim() && !loading ? "pointer" : "default",
          opacity: input.trim() && !loading ? 1 : 0.5,
          marginBottom: 16,
        }}
      >
        {loading ? "Traduco…" : "Traduci e mostra"}
      </button>

      {error && <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", marginBottom: 12 }}>{error}</p>}

      {result && (
        <div
          style={{
            background: "#232E3D",
            border: "1px solid rgba(240,234,216,0.15)",
            borderRadius: 14,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.7, marginBottom: 14 }}>{result.it}</div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 16,
              background: "#1B2430",
              border: "1px solid rgba(240,234,216,0.12)",
              borderRadius: 10,
              padding: "6px 12px",
            }}
          >
            <button
              onClick={playResult}
              disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta" title="Ascolta"
              style={{ ...iconBtnStyle, width: 28, height: 28 }}
            >
              <Volume2 size={13} />
            </button>
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità:</span>
            <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
              🐢
            </button>
            <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
              {speedMult.toFixed(1)}×
            </span>
            <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
              🐇
            </button>
            {speedMult !== 1 && (
              <button
                onClick={() => setSpeedMult(1)}
                style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}
              >
                reimposta
              </button>
            )}
          </div>
          {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginBottom: 12, textAlign: "center" }}>{audioError}</div>}

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Stampatello</div>
            <div className="display" style={{ fontSize: TEXT_SIZES.sectionTitleXL, fontWeight: 700 }}>
              {result.ru}
            </div>
            <PronunciationHint text={result.ru} />
          </div>

          <div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Corsivo</div>
            {cursiveFontAvailable === null ? (
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>Preparo il corsivo…</div>
            ) : cursiveFontAvailable ? (
              <div style={{ fontFamily: '"PT Serif", serif', fontStyle: "italic", fontSize: TEXT_SIZES.heroLarge, lineHeight: 1.3 }}>{result.ru}</div>
            ) : (
              <>
                <CursiveFallbackImage text={result.ru} />
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, marginTop: 4 }}>
                  (font corsivo non disponibile sul dispositivo — mostrata un'immagine)
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 20, borderTop: "1px solid rgba(240,234,216,0.12)", paddingTop: 16 }}>
            {!cardImageUrl ? (
              <button
                onClick={generateGreetingCard}
                disabled={cardGenerating}
                style={{
                  width: "100%",
                  background: "rgba(217,164,65,0.15)",
                  border: "1px solid rgba(217,164,65,0.4)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#D9A441",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.bodyLarge,
                  cursor: cardGenerating ? "default" : "pointer",
                }}
              >
                {cardGenerating ? "Preparo il biglietto…" : "🎨 Genera immagine biglietto"}
              </button>
            ) : (
              <div style={{ textAlign: "center" }}>
                <img src={cardImageUrl} alt="Biglietto" style={{ width: "100%", borderRadius: 10, marginBottom: 10 }} />
                <a
                  href={cardImageUrl}
                  download="matryoshka-biglietto.png"
                  style={{
                    display: "inline-block",
                    background: "#7C8C6B",
                    borderRadius: 10,
                    padding: "10px 18px",
                    color: "#F0EAD8",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.bodyLarge,
                    textDecoration: "none",
                  }}
                >
                  ⬇️ Scarica per condividere in chat
                </a>
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

// ---------- Analisi sintattica della frase (analisi logica) ----------

const SYNTAX_ROLES = [
  { id: "soggetto", label: "Soggetto", color: "#5B84B1" },
  { id: "predicato", label: "Predicato", color: "#C1543C" },
  { id: "oggetto", label: "Compl. Oggetto", color: "#D9A441" },
  { id: "attributo", label: "Attributo", color: "#9A6B9E" },
  { id: "circTempo", label: "Circ. Tempo", color: "#7C8C6B" },
  { id: "circLuogo", label: "Circ. Luogo", color: "#5B84B1" },
];
const SYNTAX_ROLE_MAP = Object.fromEntries(SYNTAX_ROLES.map((r) => [r.id, r]));

// Le principali "trappole" di interferenza per chi parla italiano e impara il russo:
// concetti dove l'istinto dell'italiano inganna, spiegati con un'analogia familiare
// invece di una semplice regola grammaticale astratta.
const INSIDIE_ITALIANI = [
  {
    title: "Niente articoli",
    subtitle_ru: "Нет артиклей",
    explanation_it:
      "In italiano diciamo sempre \"il libro\", \"una casa\". In russo gli articoli (il/la/un/una) semplicemente non esistono — non è che si omettono in certi casi, non ci sono proprio. \"Книга\" può voler dire \"il libro\", \"un libro\" o \"libro\" a seconda del contesto.",
    example_ru: "Кни́га на столе́.",
    example_it: "Il libro è sul tavolo. / Un libro è sul tavolo.",
    tip_it: "Non cercare di tradurre l'articolo: il contesto (e i casi) fanno il lavoro che in italiano fa l'articolo.",
  },
  {
    title: "\"Essere\" sparisce al presente",
    subtitle_ru: "«Быть» исчезает в настоящем",
    explanation_it:
      "In italiano \"io sono studente\" ha sempre il verbo essere. In russo, al presente, il verbo \"essere\" (быть) si omette quasi sempre: si accostano semplicemente soggetto e nome.",
    example_ru: "Я студе́нт.",
    example_it: "Io sono studente. (letteralmente: \"Io studente\")",
    tip_it: "Non tradurre parola per parola cercando un verbo \"essere\" al presente: spesso non c'è.",
  },
  {
    title: "Perché esistono i casi",
    subtitle_ru: "Почему существуют падежи",
    explanation_it:
      "In italiano usiamo le preposizioni per dire chi fa cosa a chi (\"do il libro A Maria\", \"vengo DA Roma\"). In russo, invece delle preposizioni, spesso è la PAROLA STESSA a cambiare finale (il caso). Non è un capriccio: è lo stesso lavoro che fanno le preposizioni italiane, solo fatto cambiando la fine della parola invece di aggiungerne una prima.",
    example_ru: "Я ви́жу кни́гу. (vs Я чита́ю кни́гу.)",
    example_it: "Vedo il libro. / Leggo il libro. — \"книгу\" cambia finale a seconda del ruolo nella frase.",
    tip_it: "Pensa al caso come a una preposizione italiana \"cucita\" dentro la parola, non come una complicazione in più.",
  },
  {
    title: "L'aspetto verbale (non ha equivalente in italiano)",
    subtitle_ru: "Вид глагола",
    explanation_it:
      "Questa è probabilmente la difficoltà più grande per un italofono. Ogni verbo russo ha DUE forme (aspetto imperfettivo e perfettivo) che non corrispondono a tempi verbali italiani, ma al fatto che l'azione sia vista come un PROCESSO/abitudine oppure come un evento COMPLETO e concluso. L'italiano non ha questa distinzione grammaticale: la ricava dal contesto o da avverbi (\"stavo leggendo\" vs \"ho letto\").",
    example_ru: "Я чита́л кни́гу. (processo) / Я прочита́л кни́гу. (completato)",
    example_it: "Stavo leggendo il libro. / Ho finito di leggere il libro.",
    tip_it: "Non cercare una regola meccanica: chiediti sempre \"sto descrivendo un processo o il fatto che sia FINITO?\"",
  },
  {
    title: "L'ordine delle parole è libero",
    subtitle_ru: "Свободный порядок слов",
    explanation_it:
      "In italiano l'ordine soggetto-verbo-oggetto è quasi obbligatorio per capire chi fa cosa. In russo, siccome sono i CASI a indicare i ruoli (non la posizione), l'ordine delle parole è molto più libero e serve soprattutto per l'enfasi — cosa viene messo all'inizio della frase è ciò su cui si vuole attirare l'attenzione.",
    example_ru: "Кни́гу чита́ет А́нна. (stessa frase di \"Анна читает книгу\", enfasi diversa)",
    example_it: "È IL LIBRO che Anna legge. (enfasi sull'oggetto, non sul soggetto)",
    tip_it: "Se l'ordine ti sembra \"strano\" in una frase russa, non è un errore: probabilmente cambia solo cosa viene enfatizzato.",
  },
  {
    title: "\"Avere\" non esiste come lo intendi tu",
    subtitle_ru: "«Иметь» — не совсем так, как ты думаешь",
    explanation_it:
      "In italiano \"ho un fratello\" usa il verbo avere. In russo la costruzione più comune è letteralmente \"presso di me c'è un fratello\" — il possesso si esprime con \"у меня есть\" (presso-me c'è), non con un verbo \"avere\" come soggetto attivo.",
    example_ru: "У меня́ есть брат.",
    example_it: "Ho un fratello. (letteralmente: \"Presso di me c'è un fratello\")",
    tip_it: "Il \"padrone\" della frase in russo non è chi possiede, ma la cosa posseduta — è lei il vero soggetto grammaticale.",
  },
  {
    title: "Gli aggettivi si declinano anche per caso",
    subtitle_ru: "Прилагательные склоняются и по падежам",
    explanation_it:
      "In italiano un aggettivo cambia solo per genere e numero (\"bello\"/\"bella\"/\"belli\"/\"belle\"). In russo un aggettivo cambia ANCHE in base al caso del sostantivo che accompagna — quindi lo stesso aggettivo può avere fino a dodici forme diverse a seconda di genere, numero e caso combinati.",
    example_ru: "но́вый дом / но́вого до́ма / но́вому до́му...",
    example_it: "una casa nuova / di una casa nuova / a una casa nuova... (in italiano l'aggettivo non cambia)",
    tip_it: "Non impararli come parole isolate: impara sempre aggettivo+sostantivo insieme nello stesso caso, così la forma giusta diventa naturale.",
  },
];

function InsidieItalianiView({ ttsSettings, premium, onBack }) {
  const [index, setIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const current = INSIDIE_ITALIANI[index];

  async function play(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Perché è così
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6 }}>
        {index + 1} di {INSIDIE_ITALIANI.length} — la logica dietro alle differenze tra russo e italiano, spiegata con un'analogia.
      </p>
      <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 16, fontStyle: "italic" }}>
        Qui i concetti spiegati; per esempi di frasi sbagliate e corrette vedi "Difficoltà → Errori tipici per italiani" in Pratica.
      </p>

      <div
        style={{
          background: "rgba(193,84,60,0.12)",
          border: "1px solid rgba(193,84,60,0.35)",
          borderRadius: 14,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: TEXT_SIZES.cardTitle, fontWeight: 700, marginBottom: 2 }}>{current.title}</div>
        <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.6, marginBottom: 14, fontStyle: "italic" }}>{current.subtitle_ru}</div>

        <p style={{ fontSize: TEXT_SIZES.emphasisLarge, lineHeight: 1.6, marginBottom: 16 }}>{current.explanation_it}</p>

        <div style={{ background: "#232E3D", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, color: "#D9A441", flex: 1 }}>
              {current.example_ru}
            </div>
            <button
              onClick={() => play(current.example_ru)}
              disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta" title="Ascolta"
              style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
            >
              <Volume2 size={12} />
            </button>
          </div>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginTop: 4, fontStyle: "italic" }}>{current.example_it}</div>
          <PronunciationHint text={current.example_ru} />
          {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}
        </div>

        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, display: "flex", gap: 6 }}>
          <span>💡</span>
          <span>{current.tip_it}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{
            flex: 1,
            background: "none",
            border: "1px solid rgba(240,234,216,0.2)",
            borderRadius: 10,
            padding: "12px",
            color: "#F0EAD8",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: index === 0 ? "default" : "pointer",
            opacity: index === 0 ? 0.4 : 1,
          }}
        >
          ← Precedente
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(INSIDIE_ITALIANI.length - 1, i + 1))}
          disabled={index === INSIDIE_ITALIANI.length - 1}
          style={{
            flex: 1,
            background: "#C1543C",
            border: "none",
            borderRadius: 10,
            padding: "12px",
            color: "#F0EAD8",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: index === INSIDIE_ITALIANI.length - 1 ? "default" : "pointer",
            opacity: index === INSIDIE_ITALIANI.length - 1 ? 0.4 : 1,
          }}
        >
          Successiva →
        </button>
      </div>
    </div>
  );
}

// Verbi comuni raggruppati per il caso che governano — in russo non esiste una regola
// generale che dica quale caso segue un verbo (a differenza delle preposizioni italiane
// che spesso lo suggeriscono): va imparato verbo per verbo. Qui i più frequenti,
// organizzati per caso in modo da vedere il pattern (es. i verbi di sentimento/desiderio
// spesso reggono il genitivo, i verbi di comunicazione spesso il dativo).
const REGGENZA_VERBI = [
  {
    case: "Genitivo",
    color: "#C1543C",
    verbs: [
      { word: "боя́ться", meaning_it: "temere", example_ru: "Она́ бои́тся темноты́.", example_it: "Lei ha paura del buio.", note_it: "I verbi di paura/timore reggono spesso il genitivo, senza preposizione." },
      { word: "избега́ть", meaning_it: "evitare", example_ru: "Он избега́ет пробле́м.", example_it: "Lui evita i problemi.", note_it: "\"Evitare qualcosa\" — il qualcosa va al genitivo." },
      { word: "жела́ть", meaning_it: "augurare/desiderare", example_ru: "Жела́ю тебе́ уда́чи.", example_it: "Ti auguro fortuna.", note_it: "Diverso da \"хоте́ть\" (volere), che regge l'accusativo." },
      { word: "достига́ть", meaning_it: "raggiungere", example_ru: "Она́ дости́гла успе́ха.", example_it: "Lei ha raggiunto il successo.", note_it: "Il risultato raggiunto è sempre al genitivo con questo verbo." },
    ],
  },
  {
    case: "Dativo",
    color: "#5B84B1",
    verbs: [
      { word: "помога́ть", meaning_it: "aiutare", example_ru: "Я помога́ю ма́ме.", example_it: "Aiuto la mamma.", note_it: "Attenzione: in italiano \"aiutare qualcuno\" è diretto, in russo è al dativo — non all'accusativo come ci si aspetterebbe." },
      { word: "звони́ть", meaning_it: "telefonare", example_ru: "Он звони́т дру́гу.", example_it: "Lui telefona a un amico.", note_it: "Come in italiano \"telefonare A qualcuno\" — qui coincide col dativo." },
      { word: "ве́рить", meaning_it: "credere", example_ru: "Я ве́рю тебе́.", example_it: "Ti credo.", note_it: "\"Credere a qualcuno\" — dativo, non accusativo." },
      { word: "сове́товать", meaning_it: "consigliare", example_ru: "Врач сове́тует пацие́нту отдохну́ть.", example_it: "Il medico consiglia al paziente di riposare.", note_it: "La persona consigliata è al dativo." },
      { word: "ра́доваться", meaning_it: "rallegrarsi di", example_ru: "Де́ти ра́дуются пода́ркам.", example_it: "I bambini si rallegrano dei regali.", note_it: "\"Rallegrarsi DI qualcosa\" in russo è al dativo, non con una preposizione come in italiano." },
    ],
  },
  {
    case: "Accusativo",
    color: "#D9A441",
    verbs: [
      { word: "ви́деть", meaning_it: "vedere", example_ru: "Я ви́жу дом.", example_it: "Vedo la casa.", note_it: "Il caso più \"prevedibile\": l'oggetto diretto, come in italiano." },
      { word: "люби́ть", meaning_it: "amare", example_ru: "Он лю́бит му́зыку.", example_it: "Lui ama la musica.", note_it: "Oggetto diretto classico." },
      { word: "жда́ть", meaning_it: "aspettare", example_ru: "Мы ждём по́езд.", example_it: "Aspettiamo il treno.", note_it: "Attenzione: con persone spesso si trova anche al genitivo (ждать друга/друга), una delle eccezioni note di questo verbo." },
    ],
  },
  {
    case: "Strumentale",
    color: "#7C8C6B",
    verbs: [
      { word: "занима́ться", meaning_it: "occuparsi di / praticare", example_ru: "Она́ занима́ется спо́ртом.", example_it: "Lei pratica sport.", note_it: "\"Occuparsi DI qualcosa\" — in russo lo strumentale, senza preposizione." },
      { word: "увлека́ться", meaning_it: "appassionarsi a", example_ru: "Он увлека́ется фотогра́фией.", example_it: "Lui si appassiona alla fotografia.", note_it: "Stesso schema di занима́ться." },
      { word: "горди́ться", meaning_it: "essere fiero di", example_ru: "Роди́тели горди́лись сы́ном.", example_it: "I genitori erano fieri del figlio.", note_it: "\"Essere fiero DI qualcuno\" — strumentale." },
      { word: "стать / станови́ться", meaning_it: "diventare", example_ru: "Он стал врачо́м.", example_it: "È diventato medico.", note_it: "La professione/qualità che si diventa va allo strumentale, non al nominativo come potrebbe sembrare naturale." },
    ],
  },
  {
    case: "Prepositivo",
    color: "#9A6B9E",
    verbs: [
      { word: "ду́мать о", meaning_it: "pensare a", example_ru: "Я ду́маю о тебе́.", example_it: "Penso a te.", note_it: "Con la preposizione \"о\" (di/su), il prepositivo è quasi automatico." },
      { word: "говори́ть о", meaning_it: "parlare di", example_ru: "Мы говори́м о рабо́те.", example_it: "Parliamo di lavoro.", note_it: "Stesso schema: \"о\" + prepositivo." },
      { word: "мечта́ть о", meaning_it: "sognare di", example_ru: "Она́ мечта́ет о пое́здке.", example_it: "Lei sogna un viaggio.", note_it: "\"Sognare DI qualcosa\" — о + prepositivo." },
    ],
  },
];

function ReggenzaCasiView({ ttsSettings, premium, onBack, customReggenza, genLoading, genError, onGenerate }) {
  const [activeCase, setActiveCase] = useState(REGGENZA_VERBI[0].case);
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  const baseGroup = REGGENZA_VERBI.find((g) => g.case === activeCase);
  const extraVerbs = (customReggenza || []).filter((v) => v.case === activeCase);
  const currentGroup = { ...baseGroup, verbs: [...baseGroup.verbs, ...extraVerbs] };

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Reggenza dei casi
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 4 }}>
        Ogni verbo russo "governa" un caso specifico per il suo complemento — non c'è una regola generale, va imparato verbo per verbo. Qui i più comuni, raggruppati per caso.
      </p>
      <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 14, fontStyle: "italic" }}>
        Per ripassare le declinazioni complete di un sostantivo, vedi "Impara → Nomi".
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {REGGENZA_VERBI.map((g) => (
          <button
            key={g.case}
            onClick={() => setActiveCase(g.case)}
            style={{
              background: activeCase === g.case ? g.color : "#232E3D",
              border: `1px solid ${g.color}`,
              borderRadius: 16,
              padding: "6px 14px",
              color: activeCase === g.case ? "#1B2430" : "#F0EAD8",
              fontWeight: activeCase === g.case ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            {g.case}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {currentGroup.verbs.map((v, i) => {
          const key = `${activeCase}-${i}`;
          return (
            <div
              key={i}
              style={{
                background: "#232E3D",
                border: `1px solid ${currentGroup.color}55`,
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 2 }}>
                <span className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, color: currentGroup.color, fontWeight: 700 }}>{v.word}</span>
                <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{v.meaning_it}</span>
              </div>
              <PronunciationHint text={v.word} style={{ marginBottom: 6 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1 }}>{v.example_ru}</div>
                <button
                  onClick={() => play(key, v.example_ru)}
                  disabled={audioLoading[key] || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label="Ascolta" title="Ascolta"
                  style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                >
                  <Volume2 size={12} />
                </button>
              </div>
              <PronunciationHint text={v.example_ru} />
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, fontStyle: "italic", marginBottom: 6 }}>{v.example_it}</div>
              {audioError[key] && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginBottom: 6 }}>{audioError[key]}</div>}
              <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.65, borderTop: "1px solid rgba(240,234,216,0.1)", paddingTop: 6, display: "flex", gap: 4 }}>
                <span>💡</span>
                <span>{v.note_it}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onGenerate}
        disabled={genLoading}
        style={{
          width: "100%",
          marginTop: 16,
          background: "rgba(217,164,65,0.15)",
          border: "1px solid rgba(217,164,65,0.4)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#D9A441",
          fontWeight: 700,
          fontSize: TEXT_SIZES.bodyLarge,
          cursor: genLoading ? "default" : "pointer",
        }}
      >
        {genLoading ? <>Genero un nuovo esempio…<LoadingDots /></> : "+ Genera un altro esempio"}
      </button>
      {genError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{genError}</div>}
    </div>
  );
}

// Formazione del comparativo e superlativo degli aggettivi russi. Due schemi possibili:
// quello sintetico (un solo suffisso, es. -ее) e quello analitico (более/самый + aggettivo),
// più alcuni aggettivi molto comuni che hanno forme irregolari da imparare a memoria.
const COMPARATIVI_AGGETTIVI = [
  { word: "краси́вый", meaning_it: "bello", comparative: "краси́вее", superlative: "са́мый краси́вый", irregular: false, example_ru: "Э́тот го́род краси́вее.", example_it: "Questa città è più bella.", example_superlative_ru: "Э́то са́мый краси́вый го́род в Росси́и.", example_superlative_it: "Questa è la città più bella della Russia." },
  { word: "у́мный", meaning_it: "intelligente", comparative: "умне́е", superlative: "са́мый у́мный", irregular: false, example_ru: "Она́ умне́е меня́.", example_it: "Lei è più intelligente di me.", example_superlative_ru: "Он са́мый у́мный студе́нт в кла́ссе.", example_superlative_it: "Lui è lo studente più intelligente della classe." },
  { word: "бы́стрый", meaning_it: "veloce", comparative: "быстре́е", superlative: "са́мый бы́стрый", irregular: false, example_ru: "Э́тот по́езд быстре́е.", example_it: "Questo treno è più veloce.", example_superlative_ru: "Э́то са́мый бы́стрый по́езд в стране́.", example_superlative_it: "Questo è il treno più veloce del paese." },
  { word: "интере́сный", meaning_it: "interessante", comparative: "интере́снее", superlative: "са́мый интере́сный", irregular: false, example_ru: "Кни́га интере́снее фи́льма.", example_it: "Il libro è più interessante del film.", example_superlative_ru: "Э́то са́мый интере́сный фи́льм го́да.", example_superlative_it: "Questo è il film più interessante dell'anno." },
  { word: "хоро́ший", meaning_it: "buono", comparative: "лу́чше", superlative: "лу́чший", irregular: true, example_ru: "Э́тот вариа́нт лу́чше.", example_it: "Questa opzione è migliore.", note_it: "Forma irregolare, non segue il suffisso -ее — va imparata a parte, come il nostro \"buono → migliore\".", example_superlative_ru: "Э́то лу́чший рестора́н в го́роде.", example_superlative_it: "Questo è il miglior ristorante della città." },
  { word: "плохо́й", meaning_it: "cattivo", comparative: "ху́же", superlative: "ху́дший", irregular: true, example_ru: "Пого́да сего́дня ху́же.", example_it: "Il tempo oggi è peggiore.", note_it: "Irregolare, come \"cattivo → peggiore\" in italiano.", example_superlative_ru: "Э́то ху́дший день в мое́й жи́зни.", example_superlative_it: "Questo è il peggior giorno della mia vita." },
  { word: "большо́й", meaning_it: "grande", comparative: "бо́льше", superlative: "са́мый большо́й", irregular: true, example_ru: "Э́тот дом бо́льше.", example_it: "Questa casa è più grande.", note_it: "Irregolare — \"бо́льше\" è anche la parola per \"di più\" in generale.", example_superlative_ru: "Э́то са́мый большо́й магази́н в го́роде.", example_superlative_it: "Questo è il negozio più grande della città." },
  { word: "ма́ленький", meaning_it: "piccolo", comparative: "ме́ньше", superlative: "са́мый ма́ленький", irregular: true, example_ru: "Моя́ ко́мната ме́ньше.", example_it: "La mia stanza è più piccola.", note_it: "Irregolare, come большо́й.", example_superlative_ru: "Э́то са́мый ма́ленький го́род в стране́.", example_superlative_it: "Questa è la città più piccola del paese." },
];

function ComparativiView({ ttsSettings, premium, onBack, customComparativi, genLoading, genError, onGenerate }) {
  const [index, setIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const allItems = [...COMPARATIVI_AGGETTIVI, ...(customComparativi || [])];
  const current = allItems[index];
  const isLast = index === allItems.length - 1;

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Comparativo e superlativo
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6 }}>
        La maggior parte degli aggettivi forma il comparativo aggiungendo il suffisso -ее alla radice (краси́вый → краси́вее). Il superlativo si forma quasi sempre con са́мый + l'aggettivo. Alcuni aggettivi molto comuni, come "buono" e "grande", hanno forme irregolari — proprio come in italiano.
      </p>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        {index + 1} di {allItems.length}
      </p>

      <div style={{ background: "#232E3D", border: `1px solid ${current.irregular ? "#C1543C55" : "rgba(240,234,216,0.12)"}`, borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="mono" style={{ fontSize: TEXT_SIZES.subtitle, color: "#D9A441", fontWeight: 700 }}>{current.word}</span>
            <button
              onClick={() => play("word", current.word)}
              disabled={audioLoading.word || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta la parola" title="Ascolta la parola"
              style={{ ...iconBtnStyle, width: 22, height: 22, flexShrink: 0 }}
            >
              <Volume2 size={11} />
            </button>
          </div>
          <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>{current.meaning_it}</span>
        </div>
        <PronunciationHint text={current.word} style={{ textAlign: "right", marginBottom: 10 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", background: "#1B2430", borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>Comparativo</span>
            <span className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, color: "#5B84B1" }}>{current.comparative}</span>
          </div>
          <PronunciationHint text={current.comparative} style={{ textAlign: "right" }} />
          <div style={{ display: "flex", justifyContent: "space-between", background: "#1B2430", borderRadius: 8, padding: "8px 12px" }}>
            <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>Superlativo</span>
            <span className="mono" style={{ fontSize: TEXT_SIZES.emphasisLarge, color: "#7C8C6B" }}>{current.superlative}</span>
          </div>
          <PronunciationHint text={current.superlative} style={{ textAlign: "right" }} />
        </div>

        {current.irregular && (
          <div style={{ fontSize: TEXT_SIZES.small, background: "rgba(193,84,60,0.15)", border: "1px solid rgba(193,84,60,0.3)", borderRadius: 8, padding: 8, marginBottom: 10, display: "flex", gap: 4 }}>
            <span>⚠️</span>
            <span>{current.note_it}</span>
          </div>
        )}

        <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 4 }}>Esempio — comparativo</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1 }}>{current.example_ru}</div>
          <button
            onClick={() => play("comp", current.example_ru)}
            disabled={audioLoading.comp || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta" title="Ascolta"
            style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
          >
            <Volume2 size={12} />
          </button>
        </div>
        <PronunciationHint text={current.example_ru} />
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, fontStyle: "italic", marginTop: 4 }}>{current.example_it}</div>
        {audioError.comp && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 4 }}>{audioError.comp}</div>}

        {current.example_superlative_ru && (
          <>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginTop: 12, marginBottom: 4 }}>Esempio — superlativo</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, flex: 1 }}>{current.example_superlative_ru}</div>
              <button
                onClick={() => play("superl", current.example_superlative_ru)}
                disabled={audioLoading.superl || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta" title="Ascolta"
                style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
              >
                <Volume2 size={12} />
              </button>
            </div>
            <PronunciationHint text={current.example_superlative_ru} />
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, fontStyle: "italic", marginTop: 4 }}>{current.example_superlative_it}</div>
            {audioError.superl && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 4 }}>{audioError.superl}</div>}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ flex: 1, background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}
        >
          ← Precedente
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(allItems.length - 1, i + 1))}
          disabled={isLast}
          style={{ flex: 1, background: "#9A6B9E", border: "none", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: isLast ? "default" : "pointer", opacity: isLast ? 0.4 : 1 }}
        >
          Successivo →
        </button>
      </div>

      {isLast && (
        <>
          <button
            onClick={onGenerate}
            disabled={genLoading}
            style={{
              width: "100%",
              marginTop: 12,
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: genLoading ? "default" : "pointer",
            }}
          >
            {genLoading ? <>Genero un nuovo esempio…<LoadingDots /></> : "+ Genera un altro esempio"}
          </button>
          {genError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{genError}</div>}
        </>
      )}
    </div>
  );
}

// Participio (причастие) e gerundio (деепричастие): due forme verbali avanzate (livello
// B2/C1) che il russo scritto/formale usa spesso al posto di una frase relativa o di una
// seconda proposizione — accorciano la frase, ma vanno riconosciute per poter leggere
// testi non elementari. Qui solo le forme più frequenti, con un esempio di trasformazione.
const PARTICIPI_GERUNDI = [
  {
    title: "Participio presente attivo",
    subtitle_ru: "Действительное причастие настоящего времени",
    explanation_it: "Sostituisce \"который\" + verbo al presente. Si forma con -ущий/-ющий (dai verbi di 1ª coniugazione) o -ащий/-ящий (dai verbi di 2ª coniugazione). Concorda in genere, numero e caso col sostantivo, come un aggettivo.",
    transform_before: "де́вушка, кото́рая чита́ет кни́гу",
    transform_after: "чита́ющая кни́гу де́вушка",
    transform_it: "la ragazza che sta leggendo un libro → la ragazza leggente un libro",
  },
  {
    title: "Participio passato attivo",
    subtitle_ru: "Действительное причастие прошедшего времени",
    explanation_it: "Sostituisce \"который\" + verbo al passato. Si forma con -вший (dalla radice dell'infinito) o -ший se la radice termina in consonante.",
    transform_before: "студе́нт, кото́рый прочита́л кни́гу",
    transform_after: "прочита́вший кни́гу студе́нт",
    transform_it: "lo studente che ha letto il libro → lo studente che-ha-letto il libro",
  },
  {
    title: "Participio passato passivo",
    subtitle_ru: "Страдательное причастие прошедшего времени",
    explanation_it: "Descrive qualcosa che ha SUBITO l'azione (non chi la compie). Si forma con -нный/-нная/-нное o -тый, a seconda del verbo. Molto comune: si usa anche in forma breve come aggettivo predicativo.",
    transform_before: "кни́га, кото́рую прочита́л студе́нт",
    transform_after: "прочи́танная студе́нтом кни́га",
    transform_it: "il libro che lo studente ha letto → il libro letto dallo studente",
  },
  {
    title: "Gerundio imperfettivo (azione simultanea)",
    subtitle_ru: "Деепричастие несовершенного вида",
    explanation_it: "Descrive un'azione che avviene NELLO STESSO MOMENTO dell'azione principale, senza un soggetto proprio (il soggetto è sempre quello della frase principale). Si forma con -я/-а dalla radice del presente.",
    transform_before: "Он идёт и чита́ет кни́гу.",
    transform_after: "Он идёт, чита́я кни́гу.",
    transform_it: "Lui cammina e legge un libro. → Lui cammina, leggendo un libro.",
  },
  {
    title: "Gerundio perfettivo (azione già compiuta)",
    subtitle_ru: "Деепричастие совершенного вида",
    explanation_it: "Descrive un'azione GIÀ COMPIUTA prima di quella principale. Si forma con -в/-вши dalla radice del passato perfettivo.",
    transform_before: "Он прочита́л кни́гу и вы́шел из до́ма.",
    transform_after: "Прочита́в кни́гу, он вы́шел из до́ма.",
    transform_it: "Ha letto il libro ed è uscito di casa. → Dopo aver letto il libro, è uscito di casa.",
  },
];

function ParticipiGerundiView({ ttsSettings, premium, onBack, customParticipi, genLoading, genError, onGenerate }) {
  const [index, setIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const allItems = [...PARTICIPI_GERUNDI, ...(customParticipi || [])];
  const current = allItems[index];
  const isLast = index === allItems.length - 1;

  async function play(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Participi e gerundi
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 16 }}>
        {index + 1} di {allItems.length} — argomento avanzato (B2/C1): forme che accorciano la frase al posto di una relativa o di una seconda proposizione.
      </p>

      <div style={{ background: "rgba(154,107,158,0.12)", border: "1px solid rgba(154,107,158,0.35)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: TEXT_SIZES.subtitleLarge, fontWeight: 700, marginBottom: 2 }}>{current.title}</div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14, fontStyle: "italic" }}>{current.subtitle_ru}</div>
        <p style={{ fontSize: TEXT_SIZES.bodyLarge, lineHeight: 1.6, marginBottom: 16 }}>{current.explanation_it}</p>

        <div style={{ background: "#232E3D", borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 4 }}>Prima (con "который" o due proposizioni)</div>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 10, opacity: 0.75 }}>{current.transform_before}</div>
          <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 4 }}>Dopo (con participio/gerundio)</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, color: "#D9A441", flex: 1 }}>{current.transform_after}</div>
            <button
              onClick={() => play(current.transform_after)}
              disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta" title="Ascolta"
              style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
            >
              <Volume2 size={12} />
            </button>
          </div>
          {audioError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}
          <PronunciationHint text={current.transform_after} />
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 8, fontStyle: "italic" }}>{current.transform_it}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ flex: 1, background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}
        >
          ← Precedente
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(allItems.length - 1, i + 1))}
          disabled={isLast}
          style={{ flex: 1, background: "#9A6B9E", border: "none", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: isLast ? "default" : "pointer", opacity: isLast ? 0.4 : 1 }}
        >
          Successivo →
        </button>
      </div>

      {isLast && (
        <>
          <button
            onClick={onGenerate}
            disabled={genLoading}
            style={{
              width: "100%",
              marginTop: 12,
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: genLoading ? "default" : "pointer",
            }}
          >
            {genLoading ? <>Genero un nuovo esempio…<LoadingDots /></> : "+ Genera un altro esempio"}
          </button>
          {genError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{genError}</div>}
        </>
      )}
    </div>
  );
}

// Il condizionale/congiuntivo russo non ha una coniugazione verbale propria come in
// italiano: si forma con la particella бы + il verbo al passato (che qui perde il suo
// significato temporale e serve solo a marcare l'ipotetico). La stessa costruzione copre
// sia "farei" sia "avrei fatto" — è il contesto a chiarire quale dei due si intende.
const CONDIZIONALE_CARDS = [
  {
    title: "Formazione base",
    subtitle_ru: "Образование условного наклонения",
    explanation_it: "бы + verbo al passato (che qui non indica il tempo, solo l'ipotetico). La stessa forma copre sia \"farei\" sia \"avrei fatto\" in italiano — non c'è una distinzione di tempo come nella nostra lingua, va capita dal contesto.",
    example_ru: "Он сде́лал бы э́то.",
    example_it: "Lui lo farebbe. / Lui lo avrebbe fatto.",
    tip_it: "Non cercare un tempo verbale diverso per \"avrei fatto\": in russo è la stessa identica forma di \"farei\".",
  },
  {
    title: "Periodo ipotetico irreale",
    subtitle_ru: "Нереальное условие",
    explanation_it: "Con \"е́сли бы\" (se + ipotetico), ENTRAMBE le proposizioni usano бы + passato — a differenza dell'italiano, che nella principale usa il condizionale e nella secondaria il congiuntivo (due forme diverse).",
    example_ru: "Е́сли бы я знал, я бы сказа́л.",
    example_it: "Se lo sapessi, te lo direi. / Se lo avessi saputo, te lo avrei detto.",
    tip_it: "In russo la particella бы compare due volte nella stessa frase: una nella condizione, una nella conseguenza.",
  },
  {
    title: "Desiderio attenuato",
    subtitle_ru: "Смягчённое желание",
    explanation_it: "\"Хоте́л бы\" (vorrei) è più cortese e attenuato di \"хочу́\" (voglio) — stessa logica del condizionale di cortesia in italiano.",
    example_ru: "Я хоте́л бы чай.",
    example_it: "Vorrei un tè.",
    tip_it: "Usa questa forma per ordinare al bar/ristorante — suona più educato del semplice хочу́.",
  },
  {
    title: "Consiglio attenuato",
    subtitle_ru: "Смягчённый совет",
    explanation_it: "\"Ты бы + passato\" è un modo colloquiale molto comune per dare un consiglio in modo indiretto, senza l'imperativo diretto.",
    example_ru: "Ты бы отдохну́л.",
    example_it: "Dovresti riposare. / Faresti bene a riposare.",
    tip_it: "Più gentile di un imperativo diretto (\"Отдохни́!\" — Riposa!).",
  },
  {
    title: "La posizione di бы è mobile",
    subtitle_ru: "Подвижная позиция «бы»",
    explanation_it: "A differenza di un suffisso verbale fisso, бы è una particella libera: può seguire il verbo o spostarsi altrove nella frase per dare enfasi a una parola diversa, restando comunque legata al senso condizionale di tutta la frase.",
    example_ru: "Я бы пошёл. / Пошёл бы я.",
    example_it: "Ci andrei. (due ordini di parole, stessa traduzione, enfasi leggermente diversa)",
    tip_it: "Non stupirti se vedi бы in punti diversi della frase — resta comunque riferita al verbo dell'ipotetico.",
  },
];

function CondizionaleView({ ttsSettings, premium, onBack, customCondizionale, genLoading, genError, onGenerate }) {
  const [index, setIndex] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const allItems = [...CONDIZIONALE_CARDS, ...(customCondizionale || [])];
  const current = allItems[index];
  const isLast = index === allItems.length - 1;

  async function play(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Condizionale (бы)
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 16 }}>
        {index + 1} di {allItems.length} — il russo non ha una coniugazione condizionale propria: usa la particella бы insieme al passato.
      </p>

      <div style={{ background: "rgba(91,132,177,0.12)", border: "1px solid rgba(91,132,177,0.35)", borderRadius: 14, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: TEXT_SIZES.subtitleLarge, fontWeight: 700, marginBottom: 2 }}>{current.title}</div>
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14, fontStyle: "italic" }}>{current.subtitle_ru}</div>
        <p style={{ fontSize: TEXT_SIZES.bodyLarge, lineHeight: 1.6, marginBottom: 16 }}>{current.explanation_it}</p>

        <div style={{ background: "#232E3D", borderRadius: 10, padding: 14, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.emphasisLarge, fontWeight: 700, color: "#5B84B1", flex: 1 }}>{current.example_ru}</div>
            <button
              onClick={() => play(current.example_ru)}
              disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
              aria-label="Ascolta" title="Ascolta"
              style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
            >
              <Volume2 size={12} />
            </button>
          </div>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginTop: 4, fontStyle: "italic" }}>{current.example_it}</div>
          <PronunciationHint text={current.example_ru} />
          {audioError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}
        </div>

        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, display: "flex", gap: 6 }}>
          <span>💡</span>
          <span>{current.tip_it}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          style={{ flex: 1, background: "none", border: "1px solid rgba(240,234,216,0.2)", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: index === 0 ? "default" : "pointer", opacity: index === 0 ? 0.4 : 1 }}
        >
          ← Precedente
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(allItems.length - 1, i + 1))}
          disabled={isLast}
          style={{ flex: 1, background: "#5B84B1", border: "none", borderRadius: 10, padding: 12, color: "#F0EAD8", fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge, cursor: isLast ? "default" : "pointer", opacity: isLast ? 0.4 : 1 }}
        >
          Successivo →
        </button>
      </div>

      {isLast && (
        <>
          <button
            onClick={onGenerate}
            disabled={genLoading}
            style={{
              width: "100%",
              marginTop: 12,
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.bodyLarge,
              cursor: genLoading ? "default" : "pointer",
            }}
          >
            {genLoading ? <>Genero un nuovo esempio…<LoadingDots /></> : "+ Genera un altro esempio"}
          </button>
          {genError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8, textAlign: "center" }}>{genError}</div>}
        </>
      )}
    </div>
  );
}

function AnalisiSintatticaView({ ttsSettings, premium, customSyntax, syntaxGenLoading, syntaxGenError, onGenerateSyntax, onBack, unlocked, onGoToPaywall }) {
  const [level, setLevel] = useState("A1");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [assignments, setAssignments] = useState({}); // chunkIndex -> roleId
  const [checked, setChecked] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const sentences = [...SYNTAX_SENTENCES[level], ...((customSyntax && customSyntax[level]) || [])];
  const current = sentences[Math.min(sentenceIndex, Math.max(0, sentences.length - 1))];
  const isLast = sentenceIndex >= sentences.length - 1;
  const tts = { ...ttsSettings, rate: LEVEL_RATE[level] || ttsSettings.rate };

  useEffect(() => {
    setAssignments({});
    setChecked(false);
    setSelectedRole(null);
  }, [level, sentenceIndex]);

  function assignRole(chunkIdx) {
    if (checked || !selectedRole) return;
    setAssignments((prev) => ({ ...prev, [chunkIdx]: selectedRole }));
  }

  async function verify() {
    setChecked(true);
    const allCorrect = current.chunks.every((c, i) => assignments[i] === c.role);
    playFeedbackSound(allCorrect);
    for (const [i, c] of current.chunks.entries()) {
      if (assignments[i] !== c.role) {
        await recordMistake("sintassi", level, null, `"${c.text}" in: ${current.it}`, SYNTAX_ROLE_MAP[c.role].label, null);
      }
    }
  }

  const allAssigned = current && current.chunks.every((_, i) => assignments[i]);
  const correctCount = current ? current.chunks.filter((c, i) => assignments[i] === c.role).length : 0;

  async function play() {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(current.ru, { ttsSettings: tts, premium }, setAudioError);
    setAudioLoading(false);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Analisi sintattica
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 14 }}>
        Scegli un ruolo, poi tocca la parte di frase corrispondente. Quando hai assegnato tutto, verifica.
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setLevel(l.id);
              setSentenceIndex(0);
            }}
            style={{
              background: level === l.id ? l.color : "#232E3D",
              border: `1px solid ${l.color}`,
              borderRadius: 16,
              padding: "6px 14px",
              color: level === l.id ? "#1B2430" : "#F0EAD8",
              fontWeight: level === l.id ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            {l.id}
          </button>
        ))}
      </div>

      {!isLevelFree(level) && !unlocked ? (
        <LevelLockWall levelId={level} onUnlock={onGoToPaywall} />
      ) : !current ? (
        <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>Nessuna frase disponibile.</div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <button
              onClick={() => setSentenceIndex((i) => Math.max(0, i - 1))}
              disabled={sentenceIndex === 0}
              style={pkgNavBtnStyle(sentenceIndex === 0)}
            >
              ◀
            </button>
            <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
              {sentenceIndex + 1} di {sentences.length}
            </span>
            <button
              onClick={() => setSentenceIndex((i) => Math.min(sentences.length - 1, i + 1))}
              disabled={isLast}
              style={pkgNavBtnStyle(isLast)}
            >
              ▶
            </button>
          </div>

          <div style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button onClick={play} disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)} aria-label="Ascolta" title="Ascolta" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
                <Volume2 size={12} />
              </button>
              <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>Ascolta la frase intera</span>
            </div>
            {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginBottom: 8 }}>{audioError}</div>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {current.chunks.map((c, i) => {
                const assignedRole = assignments[i];
                const roleInfo = assignedRole ? SYNTAX_ROLE_MAP[assignedRole] : null;
                const isCorrectChunk = checked && assignedRole === c.role;
                const isWrongChunk = checked && assignedRole && assignedRole !== c.role;
                return (
                  <button
                    key={i}
                    onClick={() => assignRole(i)}
                    disabled={checked}
                    style={{
                      background: roleInfo ? `${roleInfo.color}33` : "#1B2430",
                      border: isCorrectChunk
                        ? "2px solid #7C8C6B"
                        : isWrongChunk
                        ? "2px solid #C1543C"
                        : roleInfo
                        ? `1px solid ${roleInfo.color}`
                        : "1px solid rgba(240,234,216,0.2)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      color: "#F0EAD8",
                      fontSize: TEXT_SIZES.emphasisLarge,
                      cursor: checked ? "default" : "pointer",
                    }}
                  >
                    {c.text}
                    {roleInfo && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginTop: 2, color: roleInfo.color }}>{roleInfo.label}</div>}
                    {checked && isWrongChunk && (
                      <div style={{ fontSize: TEXT_SIZES.body, color: "#7C8C6B", marginTop: 2 }}>✓ {SYNTAX_ROLE_MAP[c.role].label}</div>
                    )}
                  </button>
                );
              })}
            </div>

            <PronunciationHint text={current.ru} style={{ textAlign: "center" }} />
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, fontStyle: "italic", textAlign: "center" }}>{current.it}</div>
          </div>

          {checked && (() => {
            // Diagramma visivo delle relazioni grammaticali: soggetto/predicato al
            // centro collegati da una freccia, gli altri ruoli assegnati correttamente
            // orbitano attorno con una linea sottile — non un albero sintattico
            // completo (troppo complesso per il livello dell'app), ma abbastanza per
            // rendere visibile la struttura invece di lasciarla solo scritta.
            const roleOrder = ["soggetto", "predicato", "oggetto", "attributo", "circTempo", "circLuogo"];
            const foundByRole = {};
            current.chunks.forEach((c, i) => {
              if (assignments[i] === c.role && !foundByRole[c.role]) foundByRole[c.role] = c.text;
            });
            const present = roleOrder.filter((r) => foundByRole[r]);
            if (present.length < 2) return null;
            const centerY = 60;
            const nodeGap = 100;
            const width = Math.max(280, present.length * nodeGap + 40);
            return (
              <div style={{ marginBottom: 16, overflowX: "auto" }}>
                <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 6, textAlign: "center" }}>Struttura della frase</div>
                <svg viewBox={`0 0 ${width} 110`} width={width} height="110" style={{ display: "block", margin: "0 auto" }}>
                  {present.slice(1).map((role, i) => {
                    const x1 = 20 + i * nodeGap + 45;
                    const x2 = 20 + (i + 1) * nodeGap + 45;
                    return (
                      <line
                        key={role}
                        x1={x1}
                        y1={centerY}
                        x2={x2}
                        y2={centerY}
                        stroke="rgba(240,234,216,0.35)"
                        strokeWidth="1.5"
                        markerEnd="url(#syntaxArrow)"
                      />
                    );
                  })}
                  <defs>
                    <marker id="syntaxArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6" fill="none" stroke="rgba(240,234,216,0.5)" strokeWidth="1.2" />
                    </marker>
                  </defs>
                  {present.map((role, i) => {
                    const cx = 20 + i * nodeGap + 45;
                    const roleInfo = SYNTAX_ROLE_MAP[role];
                    return (
                      <g key={role}>
                        <rect x={cx - 42} y={centerY - 22} width="84" height="44" rx="10" fill={roleInfo.color} opacity="0.85" />
                        <text x={cx} y={centerY - 5} textAnchor="middle" fontSize="11" fill="#1B2430" fontWeight="700">
                          {foundByRole[role].length > 12 ? foundByRole[role].slice(0, 11) + "…" : foundByRole[role]}
                        </text>
                        <text x={cx} y={centerY + 9} textAnchor="middle" fontSize="9" fill="#1B2430" opacity="0.75">
                          {roleInfo.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            );
          })()}

          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Scegli un ruolo, poi tocca una parte</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {SYNTAX_ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                disabled={checked}
                style={{
                  background: selectedRole === r.id ? r.color : "#232E3D",
                  border: `1px solid ${r.color}`,
                  borderRadius: 16,
                  padding: "7px 12px",
                  color: selectedRole === r.id ? "#1B2430" : "#F0EAD8",
                  fontWeight: selectedRole === r.id ? 700 : 400,
                  fontSize: TEXT_SIZES.body,
                  cursor: checked ? "default" : "pointer",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {!checked ? (
            <button
              onClick={verify}
              disabled={!allAssigned}
              style={{
                width: "100%",
                background: "#D9A441",
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.emphasisLarge,
                cursor: allAssigned ? "pointer" : "default",
                opacity: allAssigned ? 1 : 0.5,
              }}
            >
              Verifica
            </button>
          ) : (
            <>
              <div style={{ textAlign: "center", fontSize: TEXT_SIZES.bodyLarge, fontWeight: 700, marginBottom: 10, color: correctCount === current.chunks.length ? "#7C8C6B" : "#C1543C" }}>
                {correctCount} / {current.chunks.length} corrette
              </div>
              <button
                onClick={() => setSentenceIndex((i) => Math.min(sentences.length - 1, i + 1))}
                disabled={isLast}
                style={{
                  width: "100%",
                  background: "#7C8C6B",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 16px",
                  color: "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: isLast ? "default" : "pointer",
                  opacity: isLast ? 0.5 : 1,
                }}
              >
                {isLast ? "Ultima frase di questo livello" : "Prossima frase →"}
              </button>

              {isLast && (
                <button
                  onClick={() => onGenerateSyntax(level)}
                  disabled={syntaxGenLoading?.[level]}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    background: "rgba(217,164,65,0.15)",
                    border: "1px solid rgba(217,164,65,0.4)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    color: "#D9A441",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.bodyLarge,
                    cursor: "pointer",
                    opacity: syntaxGenLoading?.[level] ? 0.6 : 1,
                  }}
                >
                  {syntaxGenLoading?.[level] ? <>Genero…<LoadingDots /></> : "+ Nuova frase"}
                </button>
              )}
              {syntaxGenError?.[level] && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 8 }}>
                  <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", textAlign: "center", margin: 0 }}>{syntaxGenError[level]}</p>
                  <button
                    onClick={() => onGenerateSyntax(level)}
                    style={{ background: "none", border: "1px solid #C1543C", borderRadius: 8, padding: "3px 10px", color: "#C1543C", fontSize: TEXT_SIZES.body, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    🔄 Riprova
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function SessionHistoryView({ onBack }) {
  const [history, setHistory] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      const h = await loadJSON("session-history", []);
      setHistory(h);
    })();
  }, []);

  async function removeEntry(id) {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    await saveJSON("session-history", next);
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
        Storico sessioni
      </h2>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 16 }}>Le sessioni che hai salvato in passato.</p>

      <button
        onClick={onBack}
        style={{ background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 10, padding: "8px 14px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer", marginBottom: 16 }}
      >
        ← Torna alla sessione
      </button>

      {history === null ? (
        <p style={{ opacity: 0.6, textAlign: "center", padding: 30 }}>Carico…</p>
      ) : history.length === 0 ? (
        <p style={{ opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center", padding: 30 }}>Nessuna sessione salvata ancora.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((h) => (
            <div key={h.id} style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.12)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: TEXT_SIZES.bodyLarge }}>
                    Livello {h.level} · {h.steps.length} esercizi
                  </div>
                  <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.55, marginTop: 2 }}>{new Date(h.completedAt).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                    style={{ background: "none", border: "1px solid rgba(91,132,177,0.4)", borderRadius: 8, padding: "6px 10px", color: "#5B84B1", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
                  >
                    {expandedId === h.id ? "Chiudi" : "Consulta"}
                  </button>
                  <button
                    onClick={() => removeEntry(h.id)}
                    style={{ background: "none", border: "1px solid #C1543C", borderRadius: 8, padding: "6px 10px", color: "#C1543C", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
                  >
                    🗑
                  </button>
                </div>
              </div>
              {expandedId === h.id && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(240,234,216,0.1)", display: "flex", flexDirection: "column", gap: 6 }}>
                  {h.steps.map((s, i) => (
                    <div key={i} style={{ fontSize: TEXT_SIZES.body, opacity: 0.8 }}>
                      {sessionStepLabel(s)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SessionView({ ttsSettings: _ttsSettings, premium, sessionLevel, sessionSteps, sessionIndex, setSessionIndex, onGenerateSession, onSaveSession, sessionSaved, onShowHistory, onBack, unlocked, onGoToPaywall }) {
  const [flipped, setFlipped] = useState(false);
  const [builderState, setBuilderState] = useState(null);
  const [checked, setChecked] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [pron, setPron] = useState(null);

  const step = sessionSteps[sessionIndex];
  const ttsSettings = { ..._ttsSettings, rate: LEVEL_RATE[sessionLevel] || _ttsSettings.rate };

  useEffect(() => {
    setFlipped(false);
    setChecked(false);
    setPron(null);
    setAudioError(null);
    if (step?.type === "compose") {
      setBuilderState({ chosen: [], pool: shuffleOnce(step.item.tokens) });
    } else {
      setBuilderState(null);
    }
  }, [sessionIndex, step?.type]);

  async function play(text) {
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError(msg));
    setAudioLoading(false);
  }

  if (!sessionLevel || !sessionSteps.length) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={onBack} />
        <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, marginBottom: 4 }}>
          Sessione giornaliera
        </h2>
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 16 }}>
          Un piccolo allenamento misto: qualche carta, una frase, una declinazione, un verbo — pescati da tutte le
          sezioni. Scegli un livello per iniziare.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {LEVELS.map((l) => {
            const locked = !isLevelFree(l.id) && !unlocked;
            return (
              <button
                key={l.id}
                onClick={() => (locked ? onGoToPaywall() : onGenerateSession(l.id))}
                style={{
                  background: locked ? "#232E3D" : l.color,
                  border: locked ? "1px solid rgba(217,164,65,0.4)" : "none",
                  borderRadius: 20,
                  padding: "8px 16px",
                  color: locked ? "#D9A441" : "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.bodyLarge,
                  cursor: "pointer",
                }}
              >
                {locked ? "🔒 " : ""}{l.id}
              </button>
            );
          })}
        </div>
        <button
          onClick={onShowHistory}
          style={{ display: "block", margin: "16px auto 0", background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 10, padding: "8px 16px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
        >
          📜 Storico sessioni
        </button>
      </div>
    );
  }

  if (sessionIndex >= sessionSteps.length) {
    return (
      <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "40px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18, textAlign: "center" }}>
        <div style={{ fontSize: TEXT_SIZES.hero2XL, marginBottom: 10 }}>🎉</div>
        <h2 className="display" style={{ fontSize: TEXT_SIZES.cardTitleLarge, marginBottom: 8 }}>
          Sessione completata!
        </h2>
        <p style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.7, marginBottom: 24 }}>
          Hai finito l'allenamento di oggi per il livello {sessionLevel}.
        </p>
        <button
          onClick={() => onGenerateSession(sessionLevel)}
          style={{
            background: "#D9A441",
            border: "none",
            borderRadius: 10,
            padding: "12px 20px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.emphasisLarge,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          + Nuova sessione ({sessionLevel})
        </button>
        <div>
          <button
            onClick={() => onSaveSession(sessionLevel, sessionSteps)}
            disabled={sessionSaved}
            style={{
              background: sessionSaved ? "rgba(124,140,107,0.15)" : "none",
              border: sessionSaved ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.25)",
              borderRadius: 10,
              padding: "10px 18px",
              color: sessionSaved ? "#7C8C6B" : "#F0EAD8",
              fontSize: TEXT_SIZES.body,
              fontWeight: 700,
              cursor: sessionSaved ? "default" : "pointer",
              marginRight: 8,
            }}
          >
            {sessionSaved ? "✓ Sessione salvata" : "💾 Salva questa sessione"}
          </button>
          <button
            onClick={onShowHistory}
            style={{ background: "none", border: "1px solid rgba(240,234,216,0.25)", borderRadius: 10, padding: "10px 18px", color: "#F0EAD8", fontSize: TEXT_SIZES.body, cursor: "pointer" }}
          >
            📜 Storico
          </button>
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => onGenerateSession(l.id)}
              style={{
                background: l.id === sessionLevel ? l.color : "#232E3D",
                border: "1px solid rgba(240,234,216,0.15)",
                borderRadius: 20,
                padding: "6px 12px",
                color: l.id === sessionLevel ? "#1B2430" : "#F0EAD8",
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
              }}
            >
              {l.id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const progressPct = Math.round((sessionIndex / sessionSteps.length) * 100);

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
          Passo {sessionIndex + 1} di {sessionSteps.length} · livello {sessionLevel}
        </span>
      </div>
      <div style={{ height: 6, background: "#232E3D", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progressPct}%`, background: "#D9A441", transition: "width 0.2s ease" }} />
      </div>

      <div style={{ background: "#232E3D", border: "1px solid rgba(240,234,216,0.1)", borderRadius: 14, padding: 18, minHeight: 160 }}>
        {step.type === "flashcard" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>📇 VOCABOLARIO</div>
            <div
              role="button"
              tabIndex={0}
              aria-label={flipped ? "Nascondi la traduzione" : "Mostra la traduzione"}
              onClick={() => setFlipped((f) => !f)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <div className="display" style={{ fontSize: TEXT_SIZES.sectionTitle }}>{step.card.ru}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  play(step.card.ru);
                }}
                disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta"
                style={{ ...iconBtnStyle, width: 28, height: 28 }}
              >
                <Volume2 size={14} />
              </button>
            </div>
            {flipped ? (
              <>
                <div className="mono" style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 10 }}>{step.card.translit}</div>
                <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.85, marginTop: 4 }}>{step.card.it}</div>
              </>
            ) : (
              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, marginTop: 10 }}>Tocca la parola per la traduzione</div>
            )}
          </div>
        )}

        {step.type === "phrase" && (
          <div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>💬 FRASE</div>
            <div className="mono" style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 6 }}>{step.pattern}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: TEXT_SIZES.emphasisLarge, flex: 1 }}>{step.ru}</div>
              <button
                onClick={() => play(step.ru)}
                disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta"
                style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0 }}
              >
                <Volume2 size={14} />
              </button>
              <button
                onClick={() => startPronunciationCheck(step.ru, (u) => setPron(u))}
                disabled={!SPEECH_RECOGNITION_SUPPORTED || pron?.status === "listening"}
                aria-label="Prova a pronunciare" title="Prova a pronunciare"
                style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0, background: pron?.status === "listening" ? "rgba(193,84,60,0.4)" : iconBtnStyle.background }}
              >
                <Mic size={14} />
              </button>
            </div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.75, fontStyle: "italic", marginTop: 4 }}>{step.it}</div>
            {pron?.status === "done" && (
              <div style={{ fontSize: TEXT_SIZES.body, marginTop: 6, color: pron.score >= 0.85 ? "#7C8C6B" : pron.score >= 0.6 ? "#D9A441" : "#C1543C" }}>
                {pron.score >= 0.85 ? "Ottima pronuncia! 🎉" : `Ho sentito: "${pron.transcript}"`}
              </div>
            )}
          </div>
        )}

        {step.type === "compose" && builderState && (
          <div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>🧩 COMPONI</div>
            <div style={{ fontSize: TEXT_SIZES.emphasisLarge, marginBottom: 10 }}>{step.item.it}</div>
            <div style={{ minHeight: 40, border: "1px dashed rgba(240,234,216,0.25)", borderRadius: 10, padding: 8, display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {builderState.chosen.length === 0 && <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.35 }}>Tocca le parole in ordine…</span>}
              {builderState.chosen.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChecked(false);
                    setBuilderState((s) => {
                      const chosen = [...s.chosen];
                      const [removed] = chosen.splice(idx, 1);
                      return { chosen, pool: [...s.pool, removed] };
                    });
                  }}
                  style={{ background: "rgba(91,132,177,0.3)", border: "1px solid rgba(91,132,177,0.5)", borderRadius: 8, padding: "6px 10px", color: "#F0EAD8", fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
                >
                  {tok.t}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {builderState.pool.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChecked(false);
                    setBuilderState((s) => {
                      const pool = [...s.pool];
                      pool.splice(idx, 1);
                      return { chosen: [...s.chosen, tok], pool };
                    });
                  }}
                  style={{ background: "#1B2430", border: "1px solid rgba(240,234,216,0.15)", borderRadius: 8, padding: "6px 10px", color: "#F0EAD8", fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer" }}
                >
                  {tok.t}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setChecked(true)}
                disabled={builderState.pool.length > 0}
                style={{ background: "#7C8C6B", border: "none", borderRadius: 8, padding: "7px 14px", color: "#1B2430", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: builderState.pool.length > 0 ? "default" : "pointer", opacity: builderState.pool.length > 0 ? 0.5 : 1 }}
              >
                Verifica
              </button>
              <button
                onClick={() => play(step.item.ru)}
                disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
                aria-label="Ascolta"
                style={{ ...iconBtnStyle, width: 32, height: 32 }}
              >
                <Volume2 size={13} />
              </button>
            </div>
            {checked && (
              <div style={{ marginTop: 10, fontSize: TEXT_SIZES.bodyLarge, color: normalizeText(builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(step.item.ru) ? "#7C8C6B" : "#C1543C" }}>
                {normalizeText(builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(step.item.ru)
                  ? "Esatto! 🎉"
                  : `Non proprio — la frase corretta è: "${step.item.ru}"`}
              </div>
            )}
          </div>
        )}

        {step.type === "declension" && (
          <div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>📖 CASO</div>
            <div style={{ marginBottom: 8 }}>
              <span className="display" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>{step.word}</span>
              <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}> ({step.meaning_it})</span>
            </div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 8 }}>
              {step.case} <span className="mono" style={{ color: "#D9A441" }}>{step.form}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, fontSize: TEXT_SIZES.emphasisLarge }}>{step.example.ru}</div>
              <button onClick={() => play(step.example.ru)} disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)} aria-label="Ascolta" style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0 }}>
                <Volume2 size={14} />
              </button>
            </div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, fontStyle: "italic", marginTop: 4 }}>{step.example.it}</div>
          </div>
        )}

        {step.type === "verb" && (
          <div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>🗣️ VERBO</div>
            <div style={{ marginBottom: 8 }}>
              <span className="display" style={{ fontSize: TEXT_SIZES.subtitle, fontWeight: 700 }}>{step.word}</span>
              <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}> ({step.meaning_it})</span>
            </div>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginBottom: 8 }}>
              {step.label} <span className="mono" style={{ color: "#D9A441" }}>{step.form}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, fontSize: TEXT_SIZES.emphasisLarge }}>{step.example_ru}</div>
              <button onClick={() => play(step.example_ru)} disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)} aria-label="Ascolta" style={{ ...iconBtnStyle, width: 28, height: 28, flexShrink: 0 }}>
                <Volume2 size={14} />
              </button>
            </div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, fontStyle: "italic", marginTop: 4 }}>{step.example_it}</div>
          </div>
        )}

        {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 8 }}>{audioError}</div>}
      </div>

      <button
        onClick={() => setSessionIndex((i) => i + 1)}
        style={{
          width: "100%",
          marginTop: 16,
          background: "#D9A441",
          border: "none",
          borderRadius: 10,
          padding: "12px 16px",
          color: "#1B2430",
          fontWeight: 700,
          fontSize: TEXT_SIZES.emphasisLarge,
          cursor: "pointer",
        }}
      >
        {sessionIndex === sessionSteps.length - 1 ? "Finisci sessione →" : "Avanti →"}
      </button>
    </div>
  );
}

// ---------- Lesson view ----------

function LessonView({
  lesson,
  ttsSettings: _ttsSettings,
  premium,
  showGloss,
  setShowGloss,
  quizPicked,
  setQuizPicked,
  answer,
  setAnswer,
  feedback,
  feedbackLoading,
  onAskFeedback,
  productionHintLoading,
  productionHintError,
  onRequestProductionHint,
  onComplete,
  onSaveProgress,
  onBack,
}) {
  const [speedMult, setSpeedMult] = useState(1);
  const ttsSettings = { ..._ttsSettings, rate: rateForLevel(lesson.id, _ttsSettings.rate) * speedMult };
  // Traccia SOLO se ogni parte è stata completata automaticamente dal pulsante
  // "Completa lezione" invece che dall'utente — serve a colorarla diversamente.
  // Copre gli esercizi SEMPRE presenti nella lezione base (quiz finale, la frase
  // originale da costruire, gli esercizi di traduzione, il primo esercizio di
  // grammatica) e le traduzioni della storia (mostra/nascondi, non un vero
  // giusto/sbagliato). Non copre: gli esercizi "extra" generati su richiesta
  // esplicita dell'utente (grammatica extra, frasi extra, "come si dice") — non ha
  // senso completare contenuto che l'utente non ha nemmeno aperto — né la domanda
  // di scrittura libera finale, che non ha un'unica risposta corretta da inserire.
  const [autoFilledQuiz, setAutoFilledQuiz] = useState(false);
  const [autoFilledBuilder, setAutoFilledBuilder] = useState(false);
  const [autoFilledDrills, setAutoFilledDrills] = useState({});
  const [autoFilledGrammar, setAutoFilledGrammar] = useState(false);
  const [pendingExit, setPendingExit] = useState(false);
  const [storyPlayerState, setStoryPlayerState] = useState("stopped"); // "stopped" | "playing" | "paused"
  const [currentStoryLine, setCurrentStoryLine] = useState(0);
  const storyLineRefs = useRef([]);
  useEffect(() => {
    // Segue la battuta in riproduzione facendo scorrere la pagina, stesso principio
    // già usato nei Dialoghi — senza questo, con una storia lunga bisognava scorrere
    // manualmente per tenere dietro alla voce.
    if (storyPlayerState === "playing") {
      storyLineRefs.current[currentStoryLine]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStoryLine, storyPlayerState]);
  const storyStopRef = useRef(false);
  const storyPausedLineRef = useRef(0);

  async function playWholeStory(startIndex = 0) {
    storyStopRef.current = false;
    setStoryPlayerState("playing");
    // assegna la voce femminile al primo interlocutore distinto incontrato nel dialogo,
    // quella maschile al secondo — così, se sono impostate entrambe, l'ascolto alterna
    // naturalmente i generi tra i due parlanti invece di usare sempre la stessa voce.
    const distinctSpeakers = [];
    for (const line of fullStory) {
      if (line.speaker && !distinctSpeakers.includes(line.speaker)) distinctSpeakers.push(line.speaker);
    }
    const speakerVoiceMap = {};
    distinctSpeakers.forEach((sp, idx) => {
      speakerVoiceMap[sp] = idx % 2 === 0 ? premium.voiceId : (premium.voiceIdMale || premium.voiceId);
    });
    for (let i = startIndex; i < fullStory.length; i++) {
      if (storyStopRef.current) break;
      setCurrentStoryLine(i);
      setAudioLoading((a) => ({ ...a, [i]: true }));
      const line = fullStory[i];
      const linePremium =
        premium.enabled && line.speaker && speakerVoiceMap[line.speaker]
          ? { ...premium, voiceId: speakerVoiceMap[line.speaker] }
          : premium;
      await playAudio(line.ru, { ttsSettings, premium: linePremium }, (msg) => setAudioError((a) => ({ ...a, [i]: msg })));
      setAudioLoading((a) => ({ ...a, [i]: false }));
      if (storyStopRef.current) break;
      // stesso motivo della correzione in FiabeView: se la pausa avviene proprio in questo
      // intervallo, deve riprendere dalla battuta successiva, non ripetere quella finita.
      setCurrentStoryLine(i + 1);
      await new Promise((r) => setTimeout(r, 500));
    }
    if (!storyStopRef.current) {
      setStoryPlayerState("stopped");
    }
  }

  function pauseWholeStory() {
    // ferma subito il ciclo in corso (come uno stop) ma ricorda da quale battuta ripartire:
    // il pausa/riprendi nativo della sintesi vocale del browser è inaffidabile, quindi il
    // controllo è gestito interamente qui, come già fatto per i Dialoghi in Pratica.
    storyPausedLineRef.current = currentStoryLine;
    storyStopRef.current = true;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setStoryPlayerState("paused");
  }

  function resumeWholeStory() {
    playWholeStory(storyPausedLineRef.current || 0);
  }

  function stopWholeStory() {
    storyStopRef.current = true;
    storyPausedLineRef.current = 0;
    if (TTS_SUPPORTED) window.speechSynthesis.cancel();
    setStoryPlayerState("stopped");
  }
  const [grammarPicked, setGrammarPicked] = useState({});
  const [grammarExtraExercises, setGrammarExtraExercises] = useState([]);
  const [grammarAltLoading, setGrammarAltLoading] = useState(false);
  const [grammarAltError, setGrammarAltError] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await loadJSON(`grammar-extra-${lesson.id}`, []);
      setGrammarExtraExercises(saved);
      setGrammarPicked({});
      const savedStory = await loadJSON(`story-extra-${lesson.id}`, []);
      setStoryExtraLines(savedStory);
    })();
  }, [lesson.id]);
  const [storyExtraLines, setStoryExtraLines] = useState([]);
  const [storyAltLoading, setStoryAltLoading] = useState(false);
  const [storyAltError, setStoryAltError] = useState(null);
  const fullStory = [...lesson.story, ...storyExtraLines];

  async function generateExtraStoryLine() {
    setStoryAltLoading(true);
    setStoryAltError(null);
    try {
      const isLast = fullStory.length === 6; // diventerà la 7ª e ultima battuta
      const speakers = [...new Set(fullStory.map((l) => l.speaker).filter(Boolean))];
      const lastSpeaker = fullStory[fullStory.length - 1]?.speaker;
      const nextSpeaker = speakers.find((s) => s !== lastSpeaker) || speakers[0] || "Персонаж";
      const transcript = fullStory.map((l) => `${l.speaker ? l.speaker + ": " : ""}${l.ru}`).join("\n");
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Ecco un dialogo/racconto già scritto per una lezione di livello ${lesson.id ? levelFromId(lesson.id) : "A1"}:

${transcript}

Scrivi UNA nuova battuta che continua naturalmente questo dialogo, pronunciata da "${nextSpeaker}".${isLast ? " Questa è l'ULTIMA battuta del dialogo: deve essere una risposta che lo conclude in modo naturale, non una domanda aperta." : ""}

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"speaker":"${nextSpeaker}","ru":"la battuta in russo con accenti (U+0301)","it":"la traduzione italiana"}`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.ru) throw new Error("Struttura incompleta.");
      setStoryExtraLines((prev) => {
        const next = [...prev, parsed];
        saveJSON(`story-extra-${lesson.id}`, next);
        return next;
      });
    } catch (e) {
      setStoryAltError("Non sono riuscita a generare la battuta successiva.");
    } finally {
      setStoryAltLoading(false);
    }
  }

  const [editingStoryLine, setEditingStoryLine] = useState(null);
  const [storyEdits, setStoryEdits] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        lesson.story.map((_, i) => loadJSON(`frase-modificata-lezione-${lesson.id}-${i}`, null))
      );
      if (cancelled) return;
      const map = {};
      entries.forEach((val, i) => {
        if (val != null) map[i] = val;
      });
      setStoryEdits(map);
    })();
    return () => {
      cancelled = true;
    };
  }, [lesson.id]);

  async function generateAlternativeGrammarExercise() {
    setGrammarAltLoading(true);
    setGrammarAltError(null);
    try {
      const existingTemplates = [lesson.grammar.exercise.template, ...grammarExtraExercises.map((e) => e.template)];
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Per una lezione di livello ${lesson.id ? levelFromId(lesson.id) : "A1"}, la regola grammaticale è: "${lesson.grammar.pattern}" — ${lesson.grammar.explanation_it}

Crea UN NUOVO esercizio a scelta multipla alternativo che eserciti la stessa regola, diverso da questi già presenti: ${existingTemplates.map((t) => `"${t}"`).join(", ")}.

IMPORTANTE — indica anche il tempo verbale e il caso grammaticale principale coinvolti nella frase completa.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"template":"frase con uno spazio ___ da completare, in italiano o mista","options":["opzione1","opzione2","opzione3"],"correct":0,"full_ru":"la frase completa e corretta in russo con accenti (U+0301)","full_it":"la traduzione italiana della frase completa","tempo":"tempo verbale, es. Presente/Passato/Futuro","caso":"caso grammaticale principale coinvolto"}`;
      const parsed = await callClaudeJSON(prompt);
      if (!parsed.template || !parsed.options || parsed.options.length < 2) throw new Error("Struttura incompleta.");
      setGrammarExtraExercises((prev) => {
        const next = [...prev, parsed];
        saveJSON(`grammar-extra-${lesson.id}`, next);
        return next;
      });
    } catch (e) {
      setGrammarAltError("Non sono riuscita a generare un'alternativa.");
    } finally {
      setGrammarAltLoading(false);
    }
  }
  const [pron, setPron] = useState({});
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const [drillRevealed, setDrillRevealed] = useState({});
  const [howToSayPicked, setHowToSayPicked] = useState({});
  const howToSayQuestions = useMemo(() => {
    const vocab = lesson.vocab || [];
    if (vocab.length < 2) return [];
    const targets = vocab.slice(0, 3);
    return targets.map((target) => {
      const others = vocab.filter((v) => v.ru !== target.ru);
      const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 2);
      const options = [target, ...shuffledOthers].sort(() => Math.random() - 0.5);
      return { target, options };
    });
  }, [lesson.id]);
  const [drillValues, setDrillValues] = useState({});
  const [drillChecked, setDrillChecked] = useState({});
  // Traccia quali drill hanno già ricevuto l'aiuto "bacchetta magica" (prima parola
  // suggerita), solo per dare un piccolo segnale visivo di "già usato" — non blocca
  // comunque l'uso ripetuto, è solo un aiuto facoltativo come quello della produzione libera.
  const [drillHintUsed, setDrillHintUsed] = useState({});
  const [buildExtraSentences, setBuildExtraSentences] = useState([]);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const allBuildSentences = [lesson.sentenceBuilder, ...buildExtraSentences].filter(Boolean);
  const currentSentence = allBuildSentences[Math.min(sentenceIdx, allBuildSentences.length - 1)];
  const [builderState, setBuilderState] = useState({ chosen: [], pool: shuffleOnce(lesson.sentenceBuilder?.tokens) });
  const [builderChecked, setBuilderChecked] = useState(false);
  const [manualCorrectionMode, setManualCorrectionMode] = useState(false);
  const [manualText, setManualText] = useState("");

  useEffect(() => {
    setBuilderState({ chosen: [], pool: shuffleOnce(currentSentence?.tokens) });
    setBuilderChecked(false);
    setManualCorrectionMode(false);
    setManualText("");
  }, [sentenceIdx, buildExtraSentences.length]);

  const [newSentenceLoading, setNewSentenceLoading] = useState(false);
  const [newSentenceError, setNewSentenceError] = useState(null);
  const [lastTopicUsed, setLastTopicUsed] = useState("");
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  const [vocabDetails, setVocabDetails] = useState({});
  const [vocabDetailsLoading, setVocabDetailsLoading] = useState({});
  const [vocabDetailsError, setVocabDetailsError] = useState({});
  const [vocabOpen, setVocabOpen] = useState({});

  async function toggleVocabDetails(v, i) {
    setVocabOpen((s) => ({ ...s, [i]: !s[i] }));
    if (vocabDetails[i] || vocabDetailsLoading[i]) return;
    setVocabDetailsLoading((s) => ({ ...s, [i]: true }));
    setVocabDetailsError((s) => ({ ...s, [i]: null }));
    try {
      const storageKey = `vocab-detail:${lesson.id}:${v.ru}`;
      const cached = await loadJSON(storageKey, null);
      if (cached) {
        setVocabDetails((s) => ({ ...s, [i]: cached }));
        return;
      }
      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Analizza questa parola/espressione russa presa da una lezione: "${v.ru}" (traslitterazione: ${v.translit}, traduzione: ${v.it}).

Determina la categoria grammaticale ed elenca le forme rilevanti:
- Se è un sostantivo o aggettivo: indica il genere (maschile/femminile/neutro/plurale) e dai la declinazione nei 6 casi (singolare), con UN breve esempio di frase per ciascun caso.
- Se è un verbo: indica l'aspetto (perfettivo/imperfettivo) e dai le forme principali (presente o futuro alla 1a persona, passato, imperativo), con un breve esempio per ciascuna.
- Se è invariabile (avverbio, particella, congiunzione, interiezione): dillo chiaramente e dai 2-3 esempi d'uso in contesti diversi al posto delle forme.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"type":"sostantivo","gender":"maschile","note_it":"breve nota grammaticale in italiano, 1 frase","forms":[{"label":"Nominativo","form":"...","example_ru":"...","example_it":"..."}]}

Il campo "type" deve essere uno tra: sostantivo, aggettivo, verbo, invariabile. Il campo "gender" va con null se non applicabile (es. per verbi o parole invariabili). IMPORTANTE — accento tonico: nel campo "form" di ogni voce, segna la sillaba accentata con il carattere Unicode U+0301 subito dopo la vocale accentata (non serve per parole di una sola sillaba, e non va messo dentro le frasi di esempio).`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.type || !parsed.forms) {
        throw new Error("Struttura incompleta.");
      }
      setVocabDetails((s) => ({ ...s, [i]: parsed }));
      saveJSON(storageKey, parsed);
    } catch (e) {
      setVocabDetailsError((s) => ({ ...s, [i]: "Non sono riuscita a caricare i dettagli." }));
    } finally {
      setVocabDetailsLoading((s) => ({ ...s, [i]: false }));
    }
  }

  async function getNewSentence(topic) {
    setNewSentenceLoading(true);
    setNewSentenceError(null);
    setLastTopicUsed(topic || "");
    try {
      const vocabList = lesson.vocab.map((v) => v.ru).join(", ");
      const topicLine = topic && topic.trim()
        ? `L'argomento richiesto dallo studente è: "${topic.trim()}". Usa quell'argomento, restando comunque al livello adatto alla lezione.`
        : `Scegli tu un argomento coerente con questa lezione (vocabolario: ${vocabList}; argomento della lezione: ${lesson.title} — ${lesson.subtitle}).`;

      const prompt = `Sei un'insegnante di russo madrelingua per studenti italiani. Crea UNA nuova frase russa breve (5-9 parole), diversa da tutte queste già usate: ${allBuildSentences.map((s) => `"${s?.answer || ""}"`).join(", ")}.

${topicLine}

Poi scegli UN sostantivo chiave della frase (al singolare) e forniscine la declinazione completa nei 6 casi russi.

${JSON_FORMAT_INSTRUCTIONS}

Struttura richiesta:
{"instruction_it":"Metti le parole in ordine.","tokens":["...parole della frase in ordine sparso..."],"answer":"la frase corretta completa, con maiuscola iniziale e punteggiatura finale","answer_it":"traduzione italiana della frase","declension":{"word":"forma base al nominativo","meaning_it":"traduzione italiana","cases":[{"case":"Именительный","meaning_it":"chi? cosa?","form":"..."},{"case":"Родительный","meaning_it":"di chi? di cosa?","form":"..."},{"case":"Дательный","meaning_it":"a chi? a cosa?","form":"..."},{"case":"Винительный","meaning_it":"chi? cosa? (oggetto)","form":"..."},{"case":"Творительный","meaning_it":"con chi? con cosa?","form":"..."},{"case":"Предложный","meaning_it":"di chi/cosa (con о/в/на)","form":"..."}]}}`;

      const parsed = await callClaudeJSON(prompt);
      if (!parsed.tokens || !parsed.answer) {
        throw new Error("Struttura incompleta.");
      }
      setBuildExtraSentences((prev) => {
        const next = [...prev, parsed];
        setSentenceIdx(next.length); // l'indice 0 è la frase base, quindi la nuova è a next.length
        return next;
      });
      setShowTopicInput(false);
      setTopicInput("");
    } catch (e) {
      setNewSentenceError("Non sono riuscita a generare una nuova frase.");
    } finally {
      setNewSentenceLoading(false);
    }
  }

  return (
    <div className="flag-corner" style={{ maxWidth: 480, margin: "0 auto", padding: "4px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: "#F0EAD8", opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, cursor: "pointer", marginBottom: 10 }}
      >
        ← Indietro
      </button>

      <h2 className="display" style={{ fontSize: TEXT_SIZES.sectionTitleLarge, marginBottom: 2 }}>
        {lesson.title}
      </h2>
      <p style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.6, marginBottom: 18 }}>{lesson.subtitle}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          marginBottom: 14,
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.12)",
          borderRadius: 10,
          padding: "6px 12px",
        }}
      >
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
        <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐢
        </button>
        <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
          {speedMult.toFixed(1)}×
        </span>
        <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
          🐇
        </button>
        {speedMult !== 1 && (
          <button onClick={() => setSpeedMult(1)} style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}>
            reimposta
          </button>
        )}
      </div>

      {!SPEECH_RECOGNITION_SUPPORTED && (
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginBottom: 10 }}>
          Il riconoscimento vocale non è supportato in questo browser: potrai comunque ascoltare, ma non controllare la pronuncia.
        </p>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
        {storyPlayerState === "stopped" && (
          <button
            onClick={() => playWholeStory()}
            disabled={!TTS_SUPPORTED && !premium?.enabled}
            style={{
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 20,
              padding: "8px 18px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            🔊 Ascolta tutto il dialogo
          </button>
        )}
        {storyPlayerState === "playing" && (
          <button
            onClick={pauseWholeStory}
            style={{
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 20,
              padding: "8px 18px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            ⏸ Pausa
          </button>
        )}
        {storyPlayerState === "paused" && (
          <button
            onClick={resumeWholeStory}
            style={{
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 20,
              padding: "8px 18px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            ▶ Riprendi
          </button>
        )}
        {storyPlayerState !== "stopped" && (
          <button
            onClick={stopWholeStory}
            style={{
              background: "rgba(193,84,60,0.2)",
              border: "1px solid #C1543C",
              borderRadius: 20,
              padding: "8px 18px",
              color: "#C1543C",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            ⏹ Ferma
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
        {fullStory.map((line, i) => {
          const p = pron[i];
          const editKey = `lezione-${lesson.id}-${i}`;
          return (
            <div
              key={i}
              ref={(el) => (storyLineRefs.current[i] = el)}
              style={{
                background: "#232E3D",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                {editingStoryLine === i ? (
                  <div style={{ flex: 1 }}>
                    <EditableSentence
                      storageKey={editKey}
                      text={storyEdits[i] || line.ru}
                      fontSize={17}
                      onSaved={(newText) => {
                        setStoryEdits((s) => ({ ...s, [i]: newText }));
                        setEditingStoryLine(null);
                      }}
                    />
                  </div>
                ) : (
                  <div onClick={() => setShowGloss((g) => ({ ...g, [i]: !g[i] }))} style={{ cursor: "pointer", flex: 1 }}>
                    <div style={{ fontSize: TEXT_SIZES.emphasisLarge }}>{storyEdits[i] || line.ru}</div>
                    <PronunciationHint text={storyEdits[i] || line.ru} />
                    {showGloss[i] && (
                      <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.75, marginTop: 4, fontStyle: "italic" }}>{line.it}</div>
                    )}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => setEditingStoryLine(editingStoryLine === i ? null : i)}
                    title="Modifica questa frase"
                    style={iconBtnStyle}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => setShowGloss((g) => ({ ...g, [i]: !g[i] }))}
                    aria-label="Mostra traduzione" title="Mostra traduzione"
                    style={{
                      ...iconBtnStyle,
                      background: showGloss[i] ? "rgba(217,164,65,0.3)" : iconBtnStyle.background,
                    }}
                  >
                    <Languages size={15} />
                  </button>
                  <button
                    onClick={async () => {
                      setAudioLoading((a) => ({ ...a, [i]: true }));
                      setAudioError((a) => ({ ...a, [i]: null }));
                      await playAudio(storyEdits[i] || line.ru, { ttsSettings, premium }, (msg) =>
                        setAudioError((a) => ({ ...a, [i]: msg }))
                      );
                      setAudioLoading((a) => ({ ...a, [i]: false }));
                    }}
                    disabled={!TTS_SUPPORTED && !premium?.enabled}
                    aria-label="Ascolta" title="Ascolta"
                    style={iconBtnStyle}
                  >
                    <Volume2 size={15} />
                  </button>
                  <button
                    onClick={() => startPronunciationCheck(line.ru, (u) => setPron((prev) => ({ ...prev, [i]: u })))}
                    disabled={!SPEECH_RECOGNITION_SUPPORTED || p?.status === "listening"}
                    aria-label="Prova a pronunciare" title="Prova a pronunciare"
                    style={{
                      ...iconBtnStyle,
                      background: p?.status === "listening" ? "rgba(193,84,60,0.4)" : iconBtnStyle.background,
                    }}
                  >
                    <Mic size={15} />
                  </button>
                </div>
              </div>

              {audioLoading[i] && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginTop: 6 }}>Genero l'audio…<LoadingDots /></div>}
              {audioError[i] && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{audioError[i]}</div>}

              {p?.status === "listening" && (
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 6 }}>In ascolto…</div>
              )}
              {p?.status === "denied" && (
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 6 }}>
                  Devi consentire l'uso del microfono al browser per controllare la pronuncia.
                </div>
              )}
              {p?.status === "error" && (
                <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 6 }}>Non ho sentito bene, riprova.</div>
              )}
              {p?.status === "done" && (
                <div
                  style={{
                    fontSize: TEXT_SIZES.body,
                    marginTop: 6,
                    color: p.score >= 0.85 ? "#7C8C6B" : p.score >= 0.6 ? "#D9A441" : "#C1543C",
                  }}
                >
                  {p.score >= 0.85
                    ? "Ottima pronuncia! 🎉"
                    : p.score >= 0.6
                    ? `Quasi giusto — ho sentito: "${p.transcript}"`
                    : `Riprova, parlando più lentamente — ho sentito: "${p.transcript}"`}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.4, marginTop: 0, marginBottom: 12 }}>
        Tocca una riga per la traduzione · 🔊 per ascoltare · 🎤 per provare a pronunciarla
      </p>

      {fullStory.length < 7 && (
        <div style={{ marginBottom: 22 }}>
          <button
            onClick={generateExtraStoryLine}
            disabled={storyAltLoading}
            style={{
              background: "rgba(217,164,65,0.15)",
              border: "1px solid rgba(217,164,65,0.4)",
              borderRadius: 8,
              padding: "8px 14px",
              color: "#D9A441",
              fontWeight: 700,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
              opacity: storyAltLoading ? 0.6 : 1,
            }}
          >
            {storyAltLoading ? <>Genero…<LoadingDots /></> : `+ Genera un'altra battuta (${fullStory.length + 1}/7)`}
          </button>
          {storyAltError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{storyAltError}</div>}
        </div>
      )}

      {lesson.grammar && (
        <div style={{ marginBottom: 24 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
            Grammatica
          </div>
          <div
            style={{
              background: "rgba(124,140,107,0.1)",
            border: "1px solid rgba(124,140,107,0.3)",
            borderRadius: 10,
            padding: 14,
            marginBottom: 10,
          }}
        >
          <div className="mono" style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.85, marginBottom: 6 }}>
            {lesson.grammar.pattern}
          </div>
          <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginBottom: 8 }}>{lesson.grammar.explanation_it}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {lesson.grammar.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.9 }}>
                · {ex}
              </div>
            ))}
          </div>
        </div>

        {(() => {
          // frase originale (indice 0, senza tempo/caso perché scritta a mano prima di
          // questa funzionalità) + tutte le frasi generate via IA (con tempo/caso), fino
          // a un totale di 7 — ciascuna con la propria scelta indipendente e persistente.
          const allExercises = [lesson.grammar.exercise, ...grammarExtraExercises];
          return allExercises.map((ex, idx) => {
            const picked = grammarPicked[idx] ?? null;
            const revealed = picked !== null;
            return (
              <div key={idx} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: idx < allExercises.length - 1 ? "1px solid rgba(240,234,216,0.08)" : "none" }}>
                {(ex.tempo || ex.caso) && (
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 4 }}>
                    {ex.tempo}{ex.tempo && ex.caso ? " · " : ""}{ex.caso}
                  </div>
                )}
                <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.7, marginBottom: 6 }}>{ex.template}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ex.options.map((opt, i) => {
                    const isThisPicked = picked === i;
                    const isCorrect = i === ex.correct;
                    const isAutoFilled = idx === 0 && autoFilledGrammar;
                    let bg = "#232E3D";
                    if (revealed && isAutoFilled && isCorrect) bg = "rgba(217,164,65,0.3)";
                    else if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
                    else if (revealed && isThisPicked && !isCorrect) bg = "rgba(193,84,60,0.35)";
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setGrammarPicked((p) => ({ ...p, [idx]: i }));
                          playFeedbackSound(i === ex.correct);
                        }}
                        disabled={revealed}
                        style={{
                          background: bg,
                          border: "1px solid rgba(240,234,216,0.12)",
                          borderRadius: 8,
                          padding: "7px 12px",
                          color: isAutoFilled && isCorrect ? "#D9A441" : "#F0EAD8",
                          fontSize: TEXT_SIZES.bodyLarge,
                          cursor: revealed ? "default" : "pointer",
                        }}
                      >
                        {opt}
                        {isAutoFilled && isCorrect && <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.7 }}> auto</span>}
                      </button>
                    );
                  })}
                </div>
                {revealed && ex.full_ru && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={async () => {
                          setAudioLoading((a) => ({ ...a, [`grammarEx${idx}`]: true }));
                          setAudioError((a) => ({ ...a, [`grammarEx${idx}`]: null }));
                          await playAudio(ex.full_ru, { ttsSettings, premium }, (msg) =>
                            setAudioError((a) => ({ ...a, [`grammarEx${idx}`]: msg }))
                          );
                          setAudioLoading((a) => ({ ...a, [`grammarEx${idx}`]: false }));
                        }}
                        disabled={audioLoading[`grammarEx${idx}`] || (!TTS_SUPPORTED && !premium?.enabled)}
                        aria-label="Ascolta" title="Ascolta"
                        style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                      >
                        <Volume2 size={12} />
                      </button>
                      <span style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{ex.full_it}</span>
                    </div>
                    <PronunciationHint text={ex.full_ru} />
                  </div>
                )}
              </div>
            );
          });
        })()}

        {grammarExtraExercises.length + 1 < 7 && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={generateAlternativeGrammarExercise}
              disabled={grammarAltLoading}
              style={{
                background: "rgba(217,164,65,0.15)",
                border: "1px solid rgba(217,164,65,0.4)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#D9A441",
                fontWeight: 700,
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
                opacity: grammarAltLoading ? 0.6 : 1,
              }}
            >
              {grammarAltLoading ? <>Genero…<LoadingDots /></> : `+ Genera un'altra frase (${grammarExtraExercises.length + 1}/7)`}
            </button>
            {grammarAltError && (
              <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", marginTop: 6 }}>{grammarAltError}</div>
            )}
          </div>
        )}
      </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
          Vocabolario
        </div>
        <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.45, marginTop: -4, marginBottom: 10 }}>
          Tocca una parola per vedere genere/tipo e le sue forme, con un esempio per ciascuna.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.vocab.map((v, i) => (
            <div key={i}>
              <button
                onClick={() => toggleVocabDetails(v, i)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "rgba(217,164,65,0.12)",
                  border: "1px solid rgba(217,164,65,0.35)",
                  borderRadius: vocabOpen[i] ? "12px 12px 0 0" : 20,
                  padding: "6px 12px",
                  fontSize: TEXT_SIZES.bodyLarge,
                  color: "#F0EAD8",
                  cursor: "pointer",
                }}
              >
                <span>{v.ru}</span>
                <span className="mono" style={{ opacity: 0.5, marginLeft: 6 }}>
                  {v.translit}
                </span>
                <span style={{ opacity: 0.7, marginLeft: 6 }}>· {v.it}</span>
                <span style={{ opacity: 0.4, marginLeft: 6, fontSize: TEXT_SIZES.body }}>{vocabOpen[i] ? "▲" : "▼"}</span>
              </button>

              {vocabOpen[i] && (
                <div
                  style={{
                    background: "#232E3D",
                    border: "1px solid rgba(217,164,65,0.25)",
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    padding: 12,
                  }}
                >
                  {vocabDetailsLoading[i] && (
                    <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>Analizzo la parola…</div>
                  )}
                  {vocabDetailsError[i] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{vocabDetailsError[i]}</div>
                      <button
                        onClick={() => toggleVocabDetails(v, i)}
                        style={{
                          background: "none",
                          border: "1px solid #C1543C",
                          borderRadius: 8,
                          padding: "3px 10px",
                          color: "#C1543C",
                          fontSize: TEXT_SIZES.body,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🔄 Riprova
                      </button>
                    </div>
                  )}
                  {vocabDetails[i] && (
                    <>
                      <div style={{ fontSize: TEXT_SIZES.body, marginBottom: 8 }}>
                        <span style={{ fontWeight: 700 }}>
                          {vocabDetails[i].type}
                          {vocabDetails[i].gender ? ` · ${vocabDetails[i].gender}` : ""}
                        </span>
                        {vocabDetails[i].note_it && (
                          <span style={{ opacity: 0.6 }}> — {vocabDetails[i].note_it}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {vocabDetails[i].forms.map((f, fi) => {
                          const audioKey = `vocabform-${i}-${fi}`;
                          return (
                            <div key={fi} style={{ borderTop: fi > 0 ? "1px solid rgba(240,234,216,0.08)" : "none", paddingTop: fi > 0 ? 8 : 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.55 }}>{f.label}</span>
                                <span className="mono" style={{ fontSize: TEXT_SIZES.bodyLarge, color: "#D9A441" }}>{f.form}</span>
                              </div>
                              {f.example_ru && (
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 2 }}>
                                  <div style={{ flex: 1, fontSize: TEXT_SIZES.body }}>
                                    {f.example_ru}
                                    <span style={{ opacity: 0.55, fontStyle: "italic" }}> — {f.example_it}</span>
                                  </div>
                                  <button
                                    onClick={async () => {
                                      setAudioLoading((a) => ({ ...a, [audioKey]: true }));
                                      setAudioError((a) => ({ ...a, [audioKey]: null }));
                                      await playAudio(f.example_ru, { ttsSettings, premium }, (msg) =>
                                        setAudioError((a) => ({ ...a, [audioKey]: msg }))
                                      );
                                      setAudioLoading((a) => ({ ...a, [audioKey]: false }));
                                    }}
                                    disabled={audioLoading[audioKey] || (!TTS_SUPPORTED && !premium?.enabled)}
                                    aria-label="Ascolta" title="Ascolta"
                                    style={{ ...iconBtnStyle, width: 24, height: 24, flexShrink: 0 }}
                                  >
                                    <Volume2 size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {howToSayQuestions.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
            Come si dice
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {howToSayQuestions.map((q, qi) => {
              const picked = howToSayPicked[qi];
              const revealed = picked !== undefined;
              return (
                <div
                  key={qi}
                  style={{
                    background: "#232E3D",
                    border: "1px solid rgba(240,234,216,0.1)",
                    borderRadius: 10,
                    padding: 12,
                  }}
                >
                  <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 8 }}>
                    Come si dice <strong>"{q.target.it}"</strong> in russo?
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {q.options.map((opt, oi) => {
                      const isCorrect = opt.ru === q.target.ru;
                      let bg = "#1B2430";
                      if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
                      else if (revealed && picked === oi && !isCorrect) bg = "rgba(193,84,60,0.35)";
                      const audioKey = `howToSay${qi}-${oi}`;
                      return (
                        <div key={oi} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => {
                              if (revealed) return;
                              setHowToSayPicked((p) => ({ ...p, [qi]: oi }));
                              playFeedbackSound(isCorrect);
                              if (!isCorrect) recordMistake("lezioni-come-si-dice", null, null, q.target.it, q.target.ru, null);
                            }}
                            disabled={revealed}
                            style={{
                              flex: 1,
                              textAlign: "left",
                              background: bg,
                              border: "1px solid rgba(240,234,216,0.12)",
                              borderRadius: 8,
                              padding: "8px 10px",
                              color: "#F0EAD8",
                              fontSize: TEXT_SIZES.bodyLarge,
                              cursor: revealed ? "default" : "pointer",
                            }}
                          >
                            {opt.ru}
                          </button>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              setAudioLoading((a) => ({ ...a, [audioKey]: true }));
                              setAudioError((a) => ({ ...a, [audioKey]: null }));
                              await playAudio(opt.ru, { ttsSettings, premium }, (msg) =>
                                setAudioError((a) => ({ ...a, [audioKey]: msg }))
                              );
                              setAudioLoading((a) => ({ ...a, [audioKey]: false }));
                            }}
                            disabled={audioLoading[audioKey] || (!TTS_SUPPORTED && !premium?.enabled)}
                            aria-label="Ascolta" title="Ascolta"
                            style={{ ...iconBtnStyle, width: 30, height: 30, flexShrink: 0 }}
                          >
                            <Volume2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {Object.keys(audioError)
                    .filter((k) => k.startsWith(`howToSay${qi}-`) && audioError[k])
                    .map((k) => (
                      <div key={k} style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 4 }}>
                        {audioError[k]}
                      </div>
                    ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {currentSentence && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.85 }}>
              Costruisci la frase
            </div>
            {allBuildSentences.length < 6 && (
              <button
                onClick={() => setShowTopicInput((s) => !s)}
                disabled={newSentenceLoading}
                style={{
                  background: "none",
                  border: "1px solid rgba(217,164,65,0.4)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: "#D9A441",
                  fontSize: TEXT_SIZES.body,
                  cursor: "pointer",
                  opacity: newSentenceLoading ? 0.5 : 1,
                }}
              >
                {newSentenceLoading ? <>Genero…<LoadingDots /></> : `+ Genera un'altra frase (${allBuildSentences.length}/6)`}
              </button>
            )}
          </div>
          <p style={{ fontSize: TEXT_SIZES.tiny, opacity: 0.45, marginBottom: 10, fontStyle: "italic" }}>
            Frasi legate al tema di questa lezione. Per una libreria più ampia per livello, vedi "Pratica → Componi".
          </p>

          {allBuildSentences.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
              <button
                onClick={() => setSentenceIdx((i) => Math.max(0, i - 1))}
                disabled={sentenceIdx === 0}
                style={{ ...iconBtnStyle, width: 26, height: 26, opacity: sentenceIdx === 0 ? 0.4 : 1 }}
              >
                ◀
              </button>
              <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.6 }}>Frase {sentenceIdx + 1} di {allBuildSentences.length}</span>
              <button
                onClick={() => setSentenceIdx((i) => Math.min(allBuildSentences.length - 1, i + 1))}
                disabled={sentenceIdx === allBuildSentences.length - 1}
                style={{ ...iconBtnStyle, width: 26, height: 26, opacity: sentenceIdx === allBuildSentences.length - 1 ? 0.4 : 1 }}
              >
                ▶
              </button>
            </div>
          )}

          {showTopicInput && !newSentenceLoading && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 10,
                background: "#232E3D",
                border: "1px solid rgba(217,164,65,0.3)",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") getNewSentence(topicInput);
                  }}
                  placeholder="Che contesto vuoi? (es. al lavoro, in viaggio…)"
                  style={{
                    flex: 1,
                    background: "#1B2430",
                    color: "#F0EAD8",
                    border: "1px solid rgba(240,234,216,0.2)",
                    borderRadius: 6,
                    padding: "6px 8px",
                    fontSize: TEXT_SIZES.bodyLarge,
                  }}
                />
                <button
                  onClick={() => getNewSentence(topicInput)}
                  style={{
                    background: "#D9A441",
                    border: "none",
                    borderRadius: 6,
                    padding: "0 12px",
                    color: "#1B2430",
                    fontWeight: 700,
                    fontSize: TEXT_SIZES.body,
                    cursor: "pointer",
                  }}
                >
                  Genera
                </button>
                <button
                  onClick={() => getNewSentence(null)}
                  title="Lascia scegliere all'IA"
                  style={{
                    background: "none",
                    border: "1px solid rgba(240,234,216,0.2)",
                    borderRadius: 6,
                    padding: "0 10px",
                    color: "#F0EAD8",
                    fontSize: TEXT_SIZES.body,
                    cursor: "pointer",
                    opacity: 0.7,
                  }}
                >
                  Sorprendimi
                </button>
              </div>

              <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>Oppure scegli un contesto:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {CONTEXT_SUGGESTIONS.map((ctx) => (
                  <button
                    key={ctx}
                    onClick={() => {
                      setTopicInput(ctx);
                      getNewSentence(ctx);
                    }}
                    style={{
                      background: "rgba(91,132,177,0.15)",
                      border: "1px solid rgba(91,132,177,0.4)",
                      borderRadius: 14,
                      padding: "4px 10px",
                      color: "#F0EAD8",
                      fontSize: TEXT_SIZES.body,
                      cursor: "pointer",
                    }}
                  >
                    {ctx}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, marginBottom: 10 }}>{currentSentence.instruction_it}</p>
          {newSentenceError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <p style={{ fontSize: TEXT_SIZES.body, color: "#C1543C", margin: 0 }}>{newSentenceError}</p>
              <button
                onClick={() => getNewSentence(lastTopicUsed)}
                disabled={newSentenceLoading}
                style={{
                  background: "none",
                  border: "1px solid #C1543C",
                  borderRadius: 8,
                  padding: "3px 10px",
                  color: "#C1543C",
                  fontSize: TEXT_SIZES.body,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🔄 Riprova
              </button>
            </div>
          )}

          <div
            style={{
              minHeight: 42,
              border: "1px dashed rgba(240,234,216,0.25)",
              borderRadius: 10,
              padding: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 10,
            }}
          >
            {builderState.chosen.length === 0 && (
              <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.35 }}>Tocca le parole qui sotto in ordine…</span>
            )}
            {builderState.chosen.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBuilderChecked(false);
                  setAutoFilledBuilder(false);
                  setBuilderState((s) => {
                    const chosen = [...s.chosen];
                    const [removed] = chosen.splice(idx, 1);
                    return { chosen, pool: [...s.pool, removed] };
                  });
                }}
                style={{
                  background: autoFilledBuilder ? "rgba(217,164,65,0.3)" : "rgba(91,132,177,0.3)",
                  border: `1px solid ${autoFilledBuilder ? "#D9A441" : "rgba(91,132,177,0.5)"}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: autoFilledBuilder ? "#D9A441" : "#F0EAD8",
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: "pointer",
                }}
              >
                {item.t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {builderState.pool.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBuilderChecked(false);
                  setBuilderState((s) => {
                    const pool = [...s.pool];
                    pool.splice(idx, 1);
                    return { chosen: [...s.chosen, item], pool };
                  });
                }}
                style={{
                  background: "#232E3D",
                  border: "1px solid rgba(240,234,216,0.15)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.emphasisLarge,
                  cursor: "pointer",
                }}
              >
                {item.t}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setBuilderChecked(false);
                setBuilderState((s) => {
                  const answerWords = currentSentence.answer.split(" ");
                  // Trova la prima posizione dove la tessera già messa NON corrisponde
                  // (per CONTENUTO normalizzato, non per indice originale) alla parola
                  // attesa in quella posizione della risposta. Prima si usava l'indice
                  // "i" conservato dallo shuffle (posizione nell'array tokens originale)
                  // assumendo che tokens[] fosse salvato nell'ordine della risposta — ma
                  // in alcune frasi dei dati non è così (tokens[] è già in un ordine
                  // sparso indipendente), rendendo quell'indice inaffidabile. Confrontare
                  // il contenuto vero della tessera con la parola attesa è corretto in
                  // ogni caso, indipendentemente da come sono salvati i dati.
                  let firstWrong = s.chosen.length;
                  for (let pos = 0; pos < s.chosen.length; pos++) {
                    if (normalizeText(s.chosen[pos].t) !== normalizeText(answerWords[pos] || "")) {
                      firstWrong = pos;
                      break;
                    }
                  }
                  const targetWord = answerWords[firstWrong];
                  if (targetWord === undefined) return s;
                  const wrongTiles = s.chosen.slice(firstWrong);
                  const stillCorrect = s.chosen.slice(0, firstWrong);
                  const poolWithWrongBack = [...s.pool, ...wrongTiles];
                  // Confronto normalizzato (minuscolo, senza punteggiatura) invece che
                  // esatto: le tessere possono avere maiuscole o punteggiatura leggermente
                  // diverse dalla frase "answer" di riferimento (es. tessera "старый"
                  // minuscola ma nella frase corretta è "Старый" a inizio frase).
                  const poolIdx = poolWithWrongBack.findIndex((t) => normalizeText(t.t) === normalizeText(targetWord));
                  if (poolIdx === -1) return s;
                  const pool = [...poolWithWrongBack];
                  const [picked] = pool.splice(poolIdx, 1);
                  return { chosen: [...stillCorrect, picked], pool };
                });
              }}
              disabled={builderState.pool.length === 0 && builderState.chosen.every((t, pos) => t.i === pos)}
              title="Bacchetta magica: inserisce la prossima parola corretta"
              className="magic-wand-btn"
            >
              🪄
            </button>
            <button
              onClick={() => {
                setBuilderChecked(true);
                const wasCorrect = normalizeText(builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(currentSentence.answer);
                playFeedbackSound(wasCorrect);
                if (!wasCorrect) {
                  recordMistake("lezioni-frase", levelFromId(lesson.id), null, currentSentence.answer_it || "", currentSentence.answer, null);
                }
              }}
              disabled={builderState.pool.length > 0}
              style={{
                background: "#7C8C6B",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#1B2430",
                fontWeight: 700,
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: builderState.pool.length > 0 ? "default" : "pointer",
                opacity: builderState.pool.length > 0 ? 0.5 : 1,
              }}
            >
              Verifica
            </button>
            <button
              onClick={() => {
                setBuilderState({ chosen: [], pool: shuffleOnce(currentSentence.tokens) });
                setBuilderChecked(false);
              }}
              style={{
                background: "none",
                border: "1px solid rgba(240,234,216,0.2)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
                opacity: 0.7,
              }}
            >
              Ricomincia
            </button>
            <button
              onClick={() => {
                setManualText(builderState.chosen.map((c) => c.t).join(" "));
                setManualCorrectionMode((m) => !m);
                setBuilderChecked(false);
              }}
              style={{
                background: manualCorrectionMode ? "rgba(217,164,65,0.2)" : "none",
                border: manualCorrectionMode ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.2)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#D9A441",
                fontSize: TEXT_SIZES.bodyLarge,
                cursor: "pointer",
              }}
            >
              ✏️ Correggi
            </button>
          </div>

          {manualCorrectionMode && (
            <div style={{ marginTop: 10 }}>
              <input
                type="text"
                value={manualText}
                onChange={(e) => {
                  setManualText(e.target.value);
                  setBuilderChecked(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setBuilderChecked(true);
                    const wasCorrect = normalizeText(manualText) === normalizeText(currentSentence.answer);
                    playFeedbackSound(wasCorrect);
                    if (!wasCorrect) recordMistake("lezioni-frase", levelFromId(lesson.id), null, currentSentence.answer_it || "", currentSentence.answer, null);
                  }
                }}
                placeholder="Scrivi qui la frase corretta in russo…"
                style={{
                  width: "100%",
                  background: "#232E3D",
                  border: "1px solid rgba(240,234,216,0.2)",
                  borderRadius: 8,
                  padding: "10px 12px",
                  color: "#F0EAD8",
                  fontSize: TEXT_SIZES.emphasisLarge,
                  marginBottom: 8,
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => {
                  setBuilderChecked(true);
                  const wasCorrect = normalizeText(manualText) === normalizeText(currentSentence.answer);
                  playFeedbackSound(wasCorrect);
                  if (!wasCorrect) recordMistake("lezioni-frase", levelFromId(lesson.id), null, currentSentence.answer_it || "", currentSentence.answer, null);
                }}
                style={{
                  background: "#D9A441",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 14px",
                  color: "#1B2430",
                  fontWeight: 700,
                  fontSize: TEXT_SIZES.bodyLarge,
                  cursor: "pointer",
                }}
              >
                Verifica correzione
              </button>
            </div>
          )}

          {builderChecked && (
            <div
              style={{
                marginTop: 10,
                fontSize: TEXT_SIZES.bodyLarge,
                color:
                  normalizeText(manualCorrectionMode ? manualText : builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(currentSentence.answer)
                    ? "#7C8C6B"
                    : "#C1543C",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>
                  {normalizeText(manualCorrectionMode ? manualText : builderState.chosen.map((c) => c.t).join(" ")) === normalizeText(currentSentence.answer)
                    ? "Esatto! 🎉"
                    : `Non proprio — la frase corretta è: "${currentSentence.answer}"`}
                </span>
                <button
                  onClick={async () => {
                    setAudioLoading((a) => ({ ...a, sentenceCheck: true }));
                    setAudioError((a) => ({ ...a, sentenceCheck: null }));
                    await playAudio(currentSentence.answer, { ttsSettings, premium }, (msg) =>
                      setAudioError((a) => ({ ...a, sentenceCheck: msg }))
                    );
                    setAudioLoading((a) => ({ ...a, sentenceCheck: false }));
                  }}
                  disabled={audioLoading.sentenceCheck || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label="Ascolta" title="Ascolta"
                  style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                >
                  <Volume2 size={12} />
                </button>
              </div>
              {currentSentence.answer_it && (
                <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic", marginTop: 3 }}>
                  {currentSentence.answer_it}
                </div>
              )}
            </div>
          )}

          {currentSentence.declension && (
            <div
              style={{
                marginTop: 14,
                background: "rgba(154,107,158,0.1)",
                border: "1px solid rgba(154,107,158,0.3)",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: TEXT_SIZES.bodyLarge, marginBottom: 8 }}>
                Declinazione di{" "}
                <span className="display" style={{ fontWeight: 700 }}>
                  {currentSentence.declension.word}
                </span>{" "}
                <span style={{ opacity: 0.6 }}>({currentSentence.declension.meaning_it})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {currentSentence.declension.cases.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: TEXT_SIZES.body,
                      padding: "4px 0",
                      borderBottom: i < currentSentence.declension.cases.length - 1 ? "1px solid rgba(240,234,216,0.08)" : "none",
                    }}
                  >
                    <span style={{ opacity: 0.65 }}>
                      {c.case} <span style={{ opacity: 0.5 }}>({c.meaning_it})</span>
                    </span>
                    <span style={{ fontWeight: 700 }}>{c.form}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
          {lesson.quiz.question}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lesson.quiz.options.map((opt, i) => {
            const picked = quizPicked === i;
            const isCorrect = i === lesson.quiz.correct;
            const revealed = quizPicked !== null;
            let bg = "#232E3D";
            if (revealed && autoFilledQuiz && isCorrect) bg = "rgba(217,164,65,0.3)";
            else if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
            else if (revealed && picked && !isCorrect) bg = "rgba(193,84,60,0.35)";
            return (
              <button
                key={i}
                onClick={() => {
                  setQuizPicked(i);
                  setAutoFilledQuiz(false);
                }}
                style={{
                  background: bg,
                  border: "1px solid rgba(240,234,216,0.12)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: revealed && autoFilledQuiz && isCorrect ? "#D9A441" : "#F0EAD8",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {opt}
                {revealed && autoFilledQuiz && isCorrect && <span style={{ fontSize: TEXT_SIZES.small, opacity: 0.7 }}>auto</span>}
                {revealed && !autoFilledQuiz && isCorrect && <Check size={16} color="#7C8C6B" />}
                {revealed && picked && !isCorrect && <X size={16} color="#C1543C" />}
              </button>
            );
          })}
        </div>

        {lesson.translationDrills && (
          <div style={{ marginTop: 20 }}>
            <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
              Traduci al volo
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lesson.translationDrills.map((d, i) => {
                const value = drillValues[i] || "";
                const checked = !!drillChecked[i];
                const isCorrect = checked && normalizeForTyping(value) === normalizeForTyping(d.answer_ru);
                const isAutoFilled = !!autoFilledDrills[i];
                const letters = stripAccentMarks(d.answer_ru).split("").map((ch, li) => ({ ch, id: li }));
                const usedIds = new Set();
                for (const ch of value) {
                  const match = letters.find((l) => l.ch === ch && !usedIds.has(l.id));
                  if (match) usedIds.add(match.id);
                }
                return (
                  <div
                    key={i}
                    style={{
                      background: "#232E3D",
                      border: `1px solid ${isAutoFilled ? "#D9A441" : checked ? (isCorrect ? "#7C8C6B" : "#C1543C") : "rgba(240,234,216,0.1)"}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                    }}
                  >
                    <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.85, marginBottom: 8 }}>{d.prompt_it}</div>
                    {isAutoFilled && <div style={{ fontSize: TEXT_SIZES.small, color: "#D9A441", marginBottom: 4 }}>completato automaticamente</div>}
                    <input
                      type="text"
                      value={value}
                      disabled={checked}
                      onChange={(e) => setDrillValues((v) => ({ ...v, [i]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !checked) setDrillChecked((c) => ({ ...c, [i]: true }));
                      }}
                      placeholder="Scrivi o componi con le lettere…"
                      style={{
                        width: "100%",
                        background: "#1B2430",
                        border: "1px solid rgba(240,234,216,0.15)",
                        borderRadius: 8,
                        padding: "8px 10px",
                        color: "#F0EAD8",
                        fontSize: TEXT_SIZES.bodyLarge,
                        marginBottom: 8,
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                      {letters.map((l) => {
                        const isUsed = usedIds.has(l.id);
                        return (
                          <button
                            key={l.id}
                            onClick={() => !checked && setDrillValues((v) => ({ ...v, [i]: (v[i] || "") + l.ch }))}
                            disabled={isUsed || checked}
                            style={{
                              minWidth: l.ch === " " ? 16 : 28,
                              height: 28,
                              background: isUsed ? "rgba(240,234,216,0.05)" : "#1B2430",
                              border: `1px solid ${isUsed ? "rgba(240,234,216,0.08)" : "rgba(217,164,65,0.4)"}`,
                              borderRadius: 6,
                              color: isUsed ? "rgba(240,234,216,0.25)" : "#F0EAD8",
                              fontSize: TEXT_SIZES.bodyLarge,
                              fontWeight: 700,
                              cursor: isUsed || checked ? "default" : "pointer",
                              opacity: isUsed ? 0.4 : 1,
                            }}
                          >
                            {l.ch === " " ? "␣" : l.ch}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => !checked && setDrillValues((v) => ({ ...v, [i]: (v[i] || "").slice(0, -1) }))}
                        disabled={checked || !value}
                        title="Cancella l'ultima lettera"
                        style={{
                          minWidth: 28,
                          height: 28,
                          background: "rgba(193,84,60,0.15)",
                          border: "1px solid rgba(193,84,60,0.4)",
                          borderRadius: 6,
                          color: "#C1543C",
                          fontSize: TEXT_SIZES.bodyLarge,
                          cursor: checked || !value ? "default" : "pointer",
                          opacity: checked || !value ? 0.4 : 1,
                        }}
                      >
                        ⌫
                      </button>
                    </div>
                    {!checked ? (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                          onClick={() => {
                            setDrillChecked((c) => ({ ...c, [i]: true }));
                            playFeedbackSound(normalizeForTyping(value) === normalizeForTyping(d.answer_ru));
                          }}
                          disabled={!value.trim()}
                          style={{
                            background: "#D9A441",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 14px",
                            color: "#1B2430",
                            fontWeight: 700,
                            fontSize: TEXT_SIZES.body,
                            cursor: value.trim() ? "pointer" : "default",
                            opacity: value.trim() ? 1 : 0.5,
                          }}
                        >
                          Verifica
                        </button>
                        <button
                          onClick={() => {
                            // Aggiunge una parola alla volta (non l'intera risposta): un aiuto
                            // parziale, stesso spirito della bacchetta magica già presente
                            // nell'esercizio di produzione libera più sotto. Se quello che
                            // l'utente ha scritto finora non corrisponde all'inizio della
                            // risposta corretta, l'aiuto lo corregge fino a quel punto e
                            // aggiunge la parola successiva, invece di limitarsi ad
                            // aggiungere in coda a un testo già sbagliato.
                            const words = d.answer_ru.split(" ");
                            let matchedWords = 0;
                            while (
                              matchedWords < words.length &&
                              normalizeForTyping(value).startsWith(
                                normalizeForTyping(words.slice(0, matchedWords + 1).join(" "))
                              )
                            ) {
                              matchedWords++;
                            }
                            const nextValue = words.slice(0, Math.min(matchedWords + 1, words.length)).join(" ");
                            setDrillValues((v) => ({ ...v, [i]: nextValue }));
                            setDrillHintUsed((h) => ({ ...h, [i]: true }));
                            playNavigationSound();
                          }}
                          disabled={normalizeForTyping(value) === normalizeForTyping(d.answer_ru)}
                          title="Suggerisci la prossima parola"
                          style={{
                            background: "rgba(217,164,65,0.12)",
                            border: "1px solid rgba(217,164,65,0.35)",
                            borderRadius: 6,
                            padding: "6px 10px",
                            color: "#D9A441",
                            fontSize: TEXT_SIZES.body,
                            cursor: normalizeForTyping(value) === normalizeForTyping(d.answer_ru) ? "default" : "pointer",
                            opacity: normalizeForTyping(value) === normalizeForTyping(d.answer_ru) ? 0.4 : 1,
                          }}
                        >
                          🪄
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: TEXT_SIZES.emphasisLarge, color: isCorrect ? "#7C8C6B" : "#C1543C" }}>{d.answer_ru}</span>
                        <button
                          onClick={async () => {
                            setAudioLoading((a) => ({ ...a, [`drill${i}`]: true }));
                            setAudioError((a) => ({ ...a, [`drill${i}`]: null }));
                            await playAudio(d.answer_ru, { ttsSettings, premium }, (msg) =>
                              setAudioError((a) => ({ ...a, [`drill${i}`]: msg }))
                            );
                            setAudioLoading((a) => ({ ...a, [`drill${i}`]: false }));
                          }}
                          disabled={audioLoading[`drill${i}`] || (!TTS_SUPPORTED && !premium?.enabled)}
                          aria-label="Ascolta" title="Ascolta"
                          style={{ ...iconBtnStyle, width: 24, height: 24, flexShrink: 0 }}
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="display" style={{ fontSize: TEXT_SIZES.subtitle, marginBottom: 8, opacity: 0.85 }}>
          <Sparkles size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
          {lesson.production}
        </div>
        <button
          onClick={onRequestProductionHint}
          disabled={productionHintLoading}
          style={{
            background: "rgba(217,164,65,0.12)",
            border: "1px solid rgba(217,164,65,0.35)",
            borderRadius: 8,
            padding: "5px 12px",
            color: "#D9A441",
            fontSize: TEXT_SIZES.small,
            cursor: productionHintLoading ? "default" : "pointer",
            marginBottom: 8,
          }}
        >
          {productionHintLoading ? <>Preparo un aiuto…<LoadingDots /></> : "🪄 Proponi l'inizio della frase"}
        </button>
        {productionHintError && (
          <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginBottom: 8 }}>
            ⚠️ {productionHintError}
          </div>
        )}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Scrivi in russo…"
          rows={3}
          style={{
            width: "100%",
            background: "#232E3D",
            border: "1px solid rgba(240,234,216,0.2)",
            borderRadius: 10,
            padding: 12,
            color: "#F0EAD8",
            fontSize: TEXT_SIZES.subtitle,
            resize: "vertical",
          }}
        />
        <button
          onClick={onAskFeedback}
          disabled={!answer.trim() || feedbackLoading}
          style={{
            marginTop: 8,
            background: "#5B84B1",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: answer.trim() ? "pointer" : "default",
            opacity: !answer.trim() || feedbackLoading ? 0.5 : 1,
          }}
        >
          {feedbackLoading ? "Correggo…" : "Correggi la mia frase"}
        </button>

        {feedback && (
          <div
            style={{
              marginTop: 12,
              background: "rgba(91,132,177,0.12)",
              border: "1px solid rgba(91,132,177,0.35)",
              borderRadius: 10,
              padding: 14,
            }}
          >
            {feedback.corrected && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: TEXT_SIZES.emphasisLarge }}>{feedback.corrected}</span>
                <button
                  onClick={async () => {
                    setAudioLoading((a) => ({ ...a, feedbackCorrected: true }));
                    setAudioError((a) => ({ ...a, feedbackCorrected: null }));
                    await playAudio(feedback.corrected, { ttsSettings, premium }, (msg) =>
                      setAudioError((a) => ({ ...a, feedbackCorrected: msg }))
                    );
                    setAudioLoading((a) => ({ ...a, feedbackCorrected: false }));
                  }}
                  disabled={audioLoading.feedbackCorrected || (!TTS_SUPPORTED && !premium?.enabled)}
                  aria-label="Ascolta" title="Ascolta"
                  style={{ ...iconBtnStyle, width: 26, height: 26, flexShrink: 0 }}
                >
                  <Volume2 size={12} />
                </button>
              </div>
            )}
            <div style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.75, marginBottom: 4 }}>{feedback.note_it}</div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.75, fontStyle: "italic" }}>{feedback.encouragement_it}</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            background: "none",
            border: "1px solid rgba(240,234,216,0.25)",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#F0EAD8",
            opacity: 0.7,
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
          }}
        >
          Esci senza completare
        </button>
        <button
          onClick={() => {
            if (!pendingExit) {
              // Il progresso va salvato SUBITO qui, non solo al secondo click
              // ("Esci") — se l'utente esce in un altro modo dopo questo primo
              // click (es. "← Indietro"), il salvataggio non deve dipendere da
              // quel secondo passaggio: era esattamente il bug segnalato
              // dall'utente ("i progressi non vengono ancora salvati").
              onSaveProgress();
              // Primo click: completa SOLO ciò che l'utente non ha ancora risposto —
              // una risposta già data dall'utente (giusta o sbagliata) non viene mai
              // sovrascritta, così il colore "automatico" appare solo dove serve
              // davvero e non nasconde un errore genuino dell'utente.
              if (quizPicked === null) {
                setQuizPicked(lesson.quiz.correct);
                setAutoFilledQuiz(true);
              }
              if (currentSentence && !builderChecked) {
                const answerWords = currentSentence.answer.split(" ");
                const allTiles = [...builderState.chosen, ...builderState.pool];
                const orderedChosen = [];
                const remaining = [...allTiles];
                for (const word of answerWords) {
                  const idx = remaining.findIndex((t) => normalizeText(t.t) === normalizeText(word));
                  if (idx === -1) continue; // tessera mancante: lascia il resto come sta, non crasha
                  orderedChosen.push(remaining.splice(idx, 1)[0]);
                }
                setBuilderState({ chosen: orderedChosen, pool: remaining });
                setBuilderChecked(true);
                setAutoFilledBuilder(true);
              }
              if (lesson.translationDrills) {
                setDrillValues((v) => {
                  const next = { ...v };
                  lesson.translationDrills.forEach((d, i) => {
                    if (!drillChecked[i]) next[i] = d.answer_ru;
                  });
                  return next;
                });
                setDrillChecked((c) => {
                  const next = { ...c };
                  lesson.translationDrills.forEach((d, i) => {
                    if (!c[i]) next[i] = true;
                  });
                  return next;
                });
                setAutoFilledDrills((af) => {
                  const next = { ...af };
                  lesson.translationDrills.forEach((d, i) => {
                    if (!drillChecked[i]) next[i] = true;
                  });
                  return next;
                });
              }
              if (lesson.grammar && grammarPicked[0] == null) {
                setGrammarPicked((p) => ({ ...p, 0: lesson.grammar.exercise.correct }));
                setAutoFilledGrammar(true);
              }
              if (lesson.story.length > 0) {
                setShowGloss((g) => {
                  const next = { ...g };
                  lesson.story.forEach((_, i) => {
                    next[i] = true;
                  });
                  return next;
                });
              }
              playNavigationSound();
              setPendingExit(true);
            } else {
              onComplete();
            }
          }}
          style={{
            flex: 2,
            background: "#D9A441",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.emphasisLarge,
            cursor: "pointer",
          }}
        >
          {pendingExit ? "Esci" : "Completa lezione"}
        </button>
      </div>
      {pendingExit && (autoFilledQuiz || autoFilledBuilder || Object.keys(autoFilledDrills).length > 0 || autoFilledGrammar) && (
        <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6, marginTop: 10, textAlign: "center" }}>
          Ho completato io le parti che non avevi ancora risposto (in <span style={{ color: "#D9A441" }}>arancione</span>) — le tue risposte restano come le hai date.
        </div>
      )}
    </div>
  );
}

// ---------- Flashcards ----------

function VerbPairFlashcard({ pair, flipped, setFlipped, onNext, onPrev, ttsSettings: _ttsSettings, premium, isLearned, onToggleLearned, onSetDifficulty }) {
  const [audioLoading, setAudioLoading] = useState({});
  const [audioError, setAudioError] = useState({});
  const ttsSettings = { ..._ttsSettings, rate: LEVEL_RATE[pair.level] || _ttsSettings.rate };

  async function play(key, text) {
    setAudioLoading((a) => ({ ...a, [key]: true }));
    setAudioError((a) => ({ ...a, [key]: null }));
    await playAudio(text, { ttsSettings, premium }, (msg) => setAudioError((a) => ({ ...a, [key]: msg })));
    setAudioLoading((a) => ({ ...a, [key]: false }));
  }

  const impfEx = pair.imperfective.forms[0];
  const perfEx = pair.perfective.forms[0];

  return (
    <div>
      <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, textAlign: "center", marginBottom: 10 }}>Livello {pair.level}</div>
      <div
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Nascondi la traduzione" : "Mostra la traduzione"}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        style={{
          background: "#232E3D",
          border: "1px solid rgba(154,107,158,0.4)",
          borderRadius: 16,
          padding: 24,
          minHeight: 220,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {!flipped ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 10 }}>Tocca per rivelare le due forme aspettuali</div>
            <div className="display" style={{ fontSize: TEXT_SIZES.sectionTitle, fontWeight: 700 }}>{pair.meaning_it}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#5B84B1", marginBottom: 4 }}>
                Imperfettivo
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="display" style={{ fontSize: TEXT_SIZES.subtitleLarge, fontWeight: 700 }}>{pair.imperfective.word}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    play("impf", impfEx.example_ru);
                  }}
                  disabled={audioLoading.impf || (!TTS_SUPPORTED && !premium?.enabled)}
                  style={{ ...iconBtnStyle, width: 26, height: 26 }}
                  aria-label="Ascolta" title="Ascolta"
                >
                  <Volume2 size={12} />
                </button>
              </div>
              <div style={{ fontSize: TEXT_SIZES.body, marginTop: 2 }}>{impfEx.example_ru}</div>
              <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{impfEx.example_it}</div>
              {audioError.impf && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError.impf}</div>}
            </div>

            <div style={{ borderTop: "1px solid rgba(240,234,216,0.12)", paddingTop: 12 }}>
              <div style={{ fontSize: TEXT_SIZES.body, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#C1543C", marginBottom: 4 }}>
                Perfettivo
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="display" style={{ fontSize: TEXT_SIZES.subtitleLarge, fontWeight: 700 }}>{pair.perfective.word}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    play("perf", perfEx.example_ru);
                  }}
                  disabled={audioLoading.perf || (!TTS_SUPPORTED && !premium?.enabled)}
                  style={{ ...iconBtnStyle, width: 26, height: 26 }}
                  aria-label="Ascolta" title="Ascolta"
                >
                  <Volume2 size={12} />
                </button>
              </div>
              <div style={{ fontSize: TEXT_SIZES.body, marginTop: 2 }}>{perfEx.example_ru}</div>
              <div style={{ fontSize: TEXT_SIZES.emphasisLarge, opacity: 0.75, fontStyle: "italic" }}>{perfEx.example_it}</div>
              {audioError.perf && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError.perf}</div>}
            </div>
            <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.4, textAlign: "center" }}>Tocca di nuovo per tornare al significato</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onSetDifficulty && onSetDifficulty("hard")}
          style={{ flex: 1, background: "rgba(193,84,60,0.15)", border: "1px solid rgba(193,84,60,0.4)", borderRadius: 10, padding: "10px 8px", color: "#C1543C", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
        >
          😣 Difficile
        </button>
        <button
          onClick={() => onToggleLearned && onToggleLearned()}
          style={{
            flex: 1,
            background: isLearned ? "rgba(124,140,107,0.25)" : "rgba(124,140,107,0.1)",
            border: isLearned ? "1px solid #7C8C6B" : "1px solid rgba(124,140,107,0.4)",
            borderRadius: 10,
            padding: "10px 8px",
            color: "#7C8C6B",
            fontWeight: 700,
            fontSize: TEXT_SIZES.body,
            cursor: "pointer",
          }}
        >
          {isLearned ? "✓ Imparato" : "Segna imparato"}
        </button>
        <button
          onClick={() => onSetDifficulty && onSetDifficulty("easy")}
          style={{ flex: 1, background: "rgba(124,140,107,0.15)", border: "1px solid rgba(124,140,107,0.4)", borderRadius: 10, padding: "10px 8px", color: "#7C8C6B", fontWeight: 700, fontSize: TEXT_SIZES.body, cursor: "pointer" }}
        >
          😊 Facile
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button onClick={onPrev} style={{ ...pkgNavBtnStyle(false), flex: "0 0 auto" }}>
          ◀
        </button>
        <button
          onClick={onNext}
          style={{
            flex: 1,
            background: "rgba(154,107,158,0.2)",
            border: "1px solid #9A6B9E",
            borderRadius: 10,
            color: "#9A6B9E",
            fontWeight: 700,
            fontSize: TEXT_SIZES.bodyLarge,
            cursor: "pointer",
          }}
        >
          Prossima coppia →
        </button>
        <button onClick={onNext} style={{ ...pkgNavBtnStyle(false), flex: "0 0 auto" }}>
          ▶
        </button>
      </div>
    </div>
  );
}

// Quiz rapido a scelta multipla: riconoscimento veloce invece del solito "gira la carta" —
// una tecnica diversa e più dinamica, buona per consolidare parole già viste in altre
// modalità. Tiene un conteggio di serie corrette nella sessione corrente (non persistente,
// pensato come stimolo immediato, non come un'altra metrica di padronanza da salvare).
function QuizRapidoView({ deck, ttsSettings, premium }) {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  function nextQuestion() {
    if (deck.length < 4) return;
    const card = deck[Math.floor(Math.random() * deck.length)];
    const others = deck.filter((c) => c.key !== card.key);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [card.it, ...shuffledOthers.map((c) => c.it)].sort(() => Math.random() - 0.5);
    setCurrent(card);
    setOptions(opts);
    setPicked(null);
  }

  useEffect(() => {
    nextQuestion();
  }, [deck.length]);

  async function play() {
    if (!current) return;
    setAudioLoading(true);
    setAudioError(null);
    await playAudio(stripParentheticalForAudio(current.ru), { ttsSettings, premium }, setAudioError);
    setAudioLoading(false);
  }

  function pick(opt) {
    if (picked !== null || !current) return;
    setPicked(opt);
    const correct = opt === current.it;
    playFeedbackSound(correct);
    if (correct) {
      setStreak((s) => {
        const next = s + 1;
        setBest((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
      recordMistake("carte-quiz", null, null, current.it, current.ru, null);
    }
  }

  if (deck.length < 4) {
    return <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.body, textAlign: "center" }}>Servono almeno 4 parole in vocabolario per il quiz rapido.</div>;
  }

  if (!current) return null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 14, fontSize: TEXT_SIZES.small, opacity: 0.7 }}>
        <span>🔥 Serie: {streak}</span>
        <span>🏆 Record: {best}</span>
      </div>

      <div style={{ background: "#232E3D", border: "1px solid rgba(217,164,65,0.35)", borderRadius: 14, padding: 20, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.5, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Cosa significa?</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.sectionTitleLarge, fontWeight: 700 }}>{current.ru}</div>
          <button
            onClick={play}
            disabled={audioLoading || (!TTS_SUPPORTED && !premium?.enabled)}
            aria-label="Ascolta" title="Ascolta"
            style={{ ...iconBtnStyle, width: 28, height: 28 }}
          >
            <Volume2 size={13} />
          </button>
        </div>
        {audioError && <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 6 }}>{audioError}</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {options.map((opt, i) => {
          const revealed = picked !== null;
          const isCorrect = opt === current.it;
          let bg = "#232E3D";
          if (revealed && isCorrect) bg = "rgba(124,140,107,0.35)";
          else if (revealed && opt === picked && !isCorrect) bg = "rgba(193,84,60,0.35)";
          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              disabled={revealed}
              style={{
                background: bg,
                border: "1px solid rgba(240,234,216,0.12)",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#F0EAD8",
                fontSize: TEXT_SIZES.emphasis,
                textAlign: "left",
                cursor: revealed ? "default" : "pointer",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <button
          onClick={nextQuestion}
          style={{
            width: "100%",
            background: "#D9A441",
            border: "none",
            borderRadius: 10,
            padding: "12px 16px",
            color: "#1B2430",
            fontWeight: 700,
            fontSize: TEXT_SIZES.emphasis,
            cursor: "pointer",
          }}
        >
          Prossima domanda →
        </button>
      )}
    </div>
  );
}

function FlashcardView({
  card,
  flipped,
  setFlipped,
  onReview,
  onToggleMastered,
  cardIsMastered,
  count,
  learningCount,
  masteredCount,
  fullDeck,
  cardFilter,
  setCardFilter,
  ttsSettings: _ttsSettings,
  premium,
  verbPairsDeck,
  verbPairIndex,
  setVerbPairIndex,
  easyHardCounts,
  learnedPackages,
  onToggleLearnedPackage,
  onMarkVerbPairDifficulty,
  cardExamples,
  cardExampleLoading,
  cardExampleError,
  onGenerateCardExample,
  onBack,
}) {
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [pron, setPron] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const [verbPairLevel, setVerbPairLevel] = useState("all");
  const [showSparkle, setShowSparkle] = useState(false);
  useEffect(() => {
    setPron(null);
  }, [card?.ru]);

  const speedBar = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        marginBottom: 14,
        background: "#232E3D",
        border: "1px solid rgba(240,234,216,0.12)",
        borderRadius: 10,
        padding: "6px 12px",
      }}
    >
      <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Velocità audio:</span>
      <button onClick={() => setSpeedMult((m) => Math.max(0.6, +(m - 0.1).toFixed(2)))} title="Più lento" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
        🐢
      </button>
      <span className="mono" style={{ fontSize: TEXT_SIZES.body, minWidth: 34, textAlign: "center" }}>
        {speedMult.toFixed(1)}×
      </span>
      <button onClick={() => setSpeedMult((m) => Math.min(1.6, +(m + 0.1).toFixed(2)))} title="Più veloce" style={{ ...iconBtnStyle, width: 26, height: 26 }}>
        🐇
      </button>
      {speedMult !== 1 && (
        <button
          onClick={() => setSpeedMult(1)}
          style={{ background: "none", border: "none", color: "#D9A441", fontSize: TEXT_SIZES.body, cursor: "pointer", textDecoration: "underline" }}
        >
          reimposta
        </button>
      )}
      {easyHardCounts && (
        <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.7, marginLeft: 8, borderLeft: "1px solid rgba(240,234,216,0.15)", paddingLeft: 10 }}>
          😊 {easyHardCounts.easy || 0} · 😣 {easyHardCounts.hard || 0}
        </span>
      )}
    </div>
  );

  const filterBar = (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <button
        onClick={() => setCardFilter("learning")}
        style={{
          flex: 1,
          background: cardFilter === "learning" ? "rgba(217,164,65,0.25)" : "#232E3D",
          border: cardFilter === "learning" ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.15)",
          borderRadius: 10,
          padding: "8px 10px",
          color: "#F0EAD8",
          fontWeight: cardFilter === "learning" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        📖 Da imparare ({learningCount})
      </button>
      <button
        onClick={() => setCardFilter("mastered")}
        style={{
          flex: 1,
          background: cardFilter === "mastered" ? "rgba(124,140,107,0.25)" : "#232E3D",
          border: cardFilter === "mastered" ? "1px solid #7C8C6B" : "1px solid rgba(240,234,216,0.15)",
          borderRadius: 10,
          padding: "8px 10px",
          color: "#F0EAD8",
          fontWeight: cardFilter === "mastered" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        ✅ Imparate ({masteredCount})
      </button>
      <button
        onClick={() => setCardFilter("verbpairs")}
        style={{
          flex: 1,
          background: cardFilter === "verbpairs" ? "rgba(154,107,158,0.25)" : "#232E3D",
          border: cardFilter === "verbpairs" ? "1px solid #9A6B9E" : "1px solid rgba(240,234,216,0.15)",
          borderRadius: 10,
          padding: "8px 10px",
          color: "#F0EAD8",
          fontWeight: cardFilter === "verbpairs" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        🔁 Coppie di verbi ({verbPairsDeck.length})
      </button>
      <button
        onClick={() => setCardFilter("quiz")}
        style={{
          flex: 1,
          background: cardFilter === "quiz" ? "rgba(217,164,65,0.25)" : "#232E3D",
          border: cardFilter === "quiz" ? "1px solid #D9A441" : "1px solid rgba(240,234,216,0.15)",
          borderRadius: 10,
          padding: "8px 10px",
          color: "#F0EAD8",
          fontWeight: cardFilter === "quiz" ? 700 : 400,
          fontSize: TEXT_SIZES.body,
          cursor: "pointer",
        }}
      >
        ⚡ Quiz rapido
      </button>
    </div>
  );

  if (cardFilter === "quiz") {
    return <QuizRapidoView deck={fullDeck} ttsSettings={_ttsSettings} premium={premium} />;
  }

  if (cardFilter === "verbpairs") {
    const filteredPairs = verbPairLevel === "all" ? verbPairsDeck : verbPairsDeck.filter((p) => p.level === verbPairLevel);
    const pair = filteredPairs[verbPairIndex % (filteredPairs.length || 1)];
    return (
      <div className="flag-corner" style={{ maxWidth: 420, margin: "0 auto", padding: "20px 18px 60px", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={onBack} />
        {filterBar}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 14 }}>
          <button
            onClick={() => {
              setVerbPairLevel("all");
              setVerbPairIndex(0);
            }}
            style={{
              background: verbPairLevel === "all" ? "#9A6B9E" : "#232E3D",
              border: "1px solid #9A6B9E",
              borderRadius: 16,
              padding: "5px 12px",
              color: verbPairLevel === "all" ? "#1B2430" : "#F0EAD8",
              fontWeight: verbPairLevel === "all" ? 700 : 400,
              fontSize: TEXT_SIZES.body,
              cursor: "pointer",
            }}
          >
            Tutti
          </button>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setVerbPairLevel(l.id);
                setVerbPairIndex(0);
              }}
              style={{
                background: verbPairLevel === l.id ? l.color : "#232E3D",
                border: `1px solid ${l.color}`,
                borderRadius: 16,
                padding: "5px 12px",
                color: verbPairLevel === l.id ? "#1B2430" : "#F0EAD8",
                fontWeight: verbPairLevel === l.id ? 700 : 400,
                fontSize: TEXT_SIZES.body,
                cursor: "pointer",
              }}
            >
              {l.id}
            </button>
          ))}
        </div>
        {!pair ? (
          <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge, textAlign: "center" }}>Nessuna coppia di verbi disponibile.</div>
        ) : (
          <>
            {speedBar}
            <VerbPairFlashcard
              pair={pair}
              flipped={flipped}
              setFlipped={setFlipped}
              onNext={() => {
                setFlipped(false);
                setVerbPairIndex((i) => i + 1);
              }}
              onPrev={() => {
                setFlipped(false);
                setVerbPairIndex((i) => Math.max(0, i - 1));
              }}
              ttsSettings={{ ..._ttsSettings, rate: _ttsSettings.rate * speedMult }}
              premium={premium}
              isLearned={!!learnedPackages?.[`verbpairs-${pair.level}-${pair.imperfective.word}`]}
              onToggleLearned={() => onToggleLearnedPackage(`verbpairs-${pair.level}-${pair.imperfective.word}`)}
              onSetDifficulty={onMarkVerbPairDifficulty}
            />
          </>
        )}
      </div>
    );
  }

  if (!card) {
    return (
      <div className="flag-corner" style={{ maxWidth: 420, margin: "0 auto", padding: "20px 18px 60px", textAlign: "center", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
        <SectionBackButton onBack={onBack} />
        {learningCount === 0 && masteredCount === 0 ? (
          <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge }}>Completa qualche lezione per sbloccare le carte.</div>
        ) : (
          <>
            {filterBar}
            <div style={{ padding: 40, opacity: 0.6, fontSize: TEXT_SIZES.bodyLarge }}>
              {cardFilter === "mastered"
                ? "Non hai ancora parole segnate come imparate. Rivedile in \"Da imparare\" e tocca \"Facile\" quando le sai bene."
                : "Hai imparato tutte le parole di questo gruppo! 🎉 Completa altre lezioni per sbloccarne di nuove."}
            </div>
          </>
        )}
      </div>
    );
  }
  const cardLessonId = card.key ? card.key.split(":")[0] : null;
  const ttsSettings = { ..._ttsSettings, rate: rateForLevel(cardLessonId, _ttsSettings.rate) * speedMult };
  return (
    <div className="flag-corner" style={{ maxWidth: 420, margin: "0 auto", padding: "20px 18px 60px", textAlign: "center", background: "rgba(0,31,91,0.82)", ...sectionWatermarkStyle, borderRadius: 18 }}>
      <SectionBackButton onBack={onBack} />
      {filterBar}
      {speedBar}
      <p style={{ fontSize: TEXT_SIZES.body, opacity: 0.5, marginBottom: 16 }}>{count} parole in questo gruppo</p>
      <div
        role="button"
        tabIndex={0}
        aria-label={flipped ? "Nascondi la traduzione" : "Mostra la traduzione"}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        style={{
          background: "#232E3D",
          border: "1px solid rgba(240,234,216,0.15)",
          borderRadius: 16,
          padding: "50px 20px",
          cursor: "pointer",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="display" style={{ fontSize: TEXT_SIZES.sectionTitleXL }}>{card.ru}</div>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setAudioLoading(true);
              setAudioError(null);
              await playAudio(stripParentheticalForAudio(card.ru), { ttsSettings, premium }, (msg) => setAudioError(msg));
              setAudioLoading(false);
            }}
            disabled={!TTS_SUPPORTED && !premium?.enabled}
            style={{ ...iconBtnStyle, width: 28, height: 28 }}
            aria-label="Ascolta" title="Ascolta"
          >
            <Volume2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              startPronunciationCheck(stripParentheticalForAudio(card.ru), (u) => setPron(u));
            }}
            disabled={!SPEECH_RECOGNITION_SUPPORTED || pron?.status === "listening"}
            aria-label="Prova a pronunciare" title="Prova a pronunciare"
            style={{
              ...iconBtnStyle,
              width: 28,
              height: 28,
              background: pron?.status === "listening" ? "rgba(193,84,60,0.4)" : iconBtnStyle.background,
            }}
          >
            <Mic size={14} />
          </button>
        </div>
        <PronunciationHint text={card.ru} />
        {audioLoading && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.5 }}>Genero l'audio…<LoadingDots /></div>}
        {audioError && <div style={{ fontSize: TEXT_SIZES.body, color: "#C1543C" }}>{audioError}</div>}
        {pron?.status === "listening" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>In ascolto…</div>}
        {pron?.status === "denied" && (
          <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>
            Devi consentire l'uso del microfono al browser per controllare la pronuncia.
          </div>
        )}
        {pron?.status === "error" && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.6 }}>Non ho sentito bene, riprova.</div>}
        {pron?.status === "done" && (
          <div
            style={{
              fontSize: TEXT_SIZES.body,
              marginTop: 2,
              color: pron.score >= 0.85 ? "#7C8C6B" : pron.score >= 0.6 ? "#D9A441" : "#C1543C",
            }}
          >
            {pron.score >= 0.85
              ? "Ottima pronuncia! 🎉"
              : pron.score >= 0.6
              ? `Quasi giusto — ho sentito: "${pron.transcript}"`
              : `Riprova, parlando più lentamente — ho sentito: "${pron.transcript}"`}
          </div>
        )}
        {flipped && (
          <div className="card-flip-in">
            <div className="mono" style={{ fontSize: TEXT_SIZES.bodyLarge, opacity: 0.6 }}>{card.translit || transliterateForItalians(card.ru)}</div>
            <div style={{ fontSize: TEXT_SIZES.subtitle, opacity: 0.8, marginTop: 6 }}>{card.it}</div>
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 10, width: "100%" }}>
              {cardExamples?.[card.key] ? (
                <div style={{ background: "#1B2430", borderRadius: 10, padding: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <span style={{ fontSize: TEXT_SIZES.bodyLarge }}>{cardExamples[card.key].example_ru}</span>
                    <button
                      onClick={async () => {
                        setAudioLoading(true);
                        setAudioError(null);
                        await playAudio(stripParentheticalForAudio(cardExamples[card.key].example_ru), { ttsSettings, premium }, (msg) => setAudioError(msg));
                        setAudioLoading(false);
                      }}
                      disabled={!TTS_SUPPORTED && !premium?.enabled}
                      style={{ ...iconBtnStyle, width: 24, height: 24, flexShrink: 0 }}
                      aria-label="Ascolta la frase" title="Ascolta la frase"
                    >
                      <Volume2 size={11} />
                    </button>
                  </div>
                  <div style={{ fontSize: TEXT_SIZES.small, opacity: 0.6, fontStyle: "italic", marginTop: 3 }}>{cardExamples[card.key].example_it}</div>
                </div>
              ) : (
                <button
                  onClick={() => onGenerateCardExample && onGenerateCardExample(card)}
                  disabled={cardExampleLoading === card.key}
                  style={{
                    background: "rgba(217,164,65,0.12)",
                    border: "1px solid rgba(217,164,65,0.35)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: "#D9A441",
                    fontSize: TEXT_SIZES.small,
                    cursor: cardExampleLoading === card.key ? "default" : "pointer",
                  }}
                >
                  {cardExampleLoading === card.key ? <>Genero una frase esempio…<LoadingDots /></> : "+ Frase esempio"}
                </button>
              )}
              {cardExampleError && cardExampleLoading !== card.key && (
                <div style={{ fontSize: TEXT_SIZES.small, color: "#C1543C", marginTop: 4 }}>{cardExampleError}</div>
              )}
            </div>
          </div>
        )}
        {!flipped && <div style={{ fontSize: TEXT_SIZES.body, opacity: 0.4 }}>Tocca per girare</div>}
      </div>

      <div style={{ position: "relative", marginTop: 14 }}>
      <button
        onClick={() => {
          // Lo scoppio di stelline scatta SOLO quando si segna la carta come
          // imparata (non quando la si toglie da quello stato) — festeggiare la
          // rimozione non avrebbe senso.
          if (!cardIsMastered) {
            setShowSparkle(true);
            setTimeout(() => setShowSparkle(false), 700);
          }
          onToggleMastered();
        }}
        style={{
          width: "100%",
          background: cardIsMastered ? "rgba(124,140,107,0.25)" : "rgba(217,164,65,0.15)",
          border: cardIsMastered ? "1px solid #7C8C6B" : "1px solid rgba(217,164,65,0.4)",
          borderRadius: 10,
          padding: "10px 14px",
          color: cardIsMastered ? "#7C8C6B" : "#D9A441",
          fontWeight: 700,
          fontSize: TEXT_SIZES.bodyLarge,
          cursor: "pointer",
        }}
      >
        {cardIsMastered ? "✓ Imparata — tocca per rimetterla tra quelle da imparare" : "Segna come Imparata ✓"}
      </button>
        {showSparkle && (
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {["✨", "⭐", "✨", "⭐", "✨", "⭐"].map((s, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: `${15 + i * 14}%`,
                  top: "50%",
                  fontSize: TEXT_SIZES.emphasis,
                  animation: `sparkleBurst 0.65s ease-out ${i * 0.03}s`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {flipped && (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={() => onReview(-1)} style={btnStyle("#C1543C")}>Difficile</button>
          <button onClick={() => onReview(1)} style={btnStyle("#5B84B1")}>Bene</button>
          <button onClick={() => onReview(2)} style={btnStyle("#7C8C6B")}>Facile</button>
        </div>
      )}
    </div>
  );
}

const iconBtnStyle = {
  background: "rgba(240,234,216,0.08)",
  border: "1px solid rgba(240,234,216,0.15)",
  borderRadius: 8,
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#F0EAD8",
  cursor: "pointer",
};

// Pulsante "indietro" locale, usato vicino al titolo di ogni sottosezione — riporta alla
// griglia della macro-sezione (Impara/Pratica) invece di dover usare il pulsante Home globale
// in cima allo schermo, molto più lontano quando si è in fondo a un esercizio lungo.
// Piccola etichetta "caso grammaticale (+ tipo di domanda)" per una frase — se non ancora
// generata mostra un pulsante compatto, altrimenti l'etichetta stessa, salvata in permanenza
// così non va rigenerata ad ogni visita della stessa frase.
// Mappatura colore-caso condivisa con "Reggenza dei casi", per coerenza visiva in tutta l'app.
const CASE_COLORS = {
  Nominativo: "#F0EAD8",
  Genitivo: "#C1543C",
  Dativo: "#5B84B1",
  Accusativo: "#D9A441",
  Strumentale: "#7C8C6B",
  Prepositivo: "#9A6B9E",
};

// Individua il caso grammaticale (e, se è una domanda, il tipo) analizzando la frase russa
// direttamente qui, senza alcuna chiamata di rete: funziona sempre, anche offline o se il
// servizio di generazione non è raggiungibile — la scelta più affidabile per un dato che
// deve essere sempre visibile insieme alla frase, non un extra opzionale.
const ALL_CASES = ["Nominativo", "Genitivo", "Dativo", "Accusativo", "Strumentale", "Prepositivo"];

// Analizza un elenco di frasi russe e restituisce il caso grammaticale meno rappresentato
// tra quelle — usato per suggerire (e richiedere) il caso di un nuovo pacchetto generato,
// così le nuove aggiunte spingono verso un equilibrio invece di accumularsi tutte sullo
// stesso caso già sovra-rappresentato.
function leastRepresentedCase(phrases) {
  const counts = Object.fromEntries(ALL_CASES.map((c) => [c, 0]));
  for (const ru of phrases) {
    const { case: c } = detectRussianCase(ru);
    counts[c] = (counts[c] || 0) + 1;
  }
  return ALL_CASES.reduce((min, c) => (counts[c] < counts[min] ? c : min), ALL_CASES[0]);
}

function detectRussianCase(ru) {
  if (!ru) return { case: "Nominativo", questionType: "" };
  // IMPORTANTE: \b nelle regex JavaScript riconosce solo l'alfabeto latino come "carattere
  // di parola" — con il cirillico non funziona affatto (nessun confine viene mai rilevato).
  // Per questo qui NON si usano regex con \b: la frase viene spezzata in parole vere e
  // ciascuna viene confrontata per uguaglianza esatta, l'unico modo affidabile in russo.
  const words = stripAccentMarks(ru.toLowerCase())
    .replace(/[.,!?;:"'«»—]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const has = (...targets) => words.some((w) => targets.includes(w));
  // per i verbi, confronta per RADICE (non forma esatta): copre automaticamente tutte le
  // coniugazioni (io/tu/lui/noi/voi/loro) invece di dover elencare ogni forma a mano.
  const hasStem = (...stems) => words.some((w) => stems.some((s) => w.startsWith(s)));

  let questionType = "";
  if (ru.trim().endsWith("?")) {
    if (has("кто")) questionType = "Chi";
    else if (has("куда")) questionType = "Dove (verso dove)";
    else if (has("где")) questionType = "Dove";
    else if (has("когда")) questionType = "Quando";
    else if (has("почему", "зачем")) questionType = "Perché";
    else if (has("как")) questionType = "Come";
    else if (has("сколько")) questionType = "Quanto";
    else if (has("что")) questionType = "Che cosa";
  }

  // genitivo di negazione: "нет/не было" + sostantivo → sempre genitivo, controllo prioritario
  if (has("нет") || (has("не") && has("было"))) return { case: "Genitivo", questionType };
  if (has("боюсь", "боишься", "боится", "боимся", "боитесь", "боятся")) return { case: "Genitivo", questionType };
  if (hasStem("достиг", "достигл", "избега")) return { case: "Genitivo", questionType };

  // preposizioni che reggono sempre (o quasi sempre) un caso specifico.
  if (has("без", "для", "до", "из", "от", "у", "около", "кроме", "вместо", "среди", "после")) return { case: "Genitivo", questionType };
  if (has("к", "ко")) return { case: "Dativo", questionType };
  // verbi specifici che reggono il dativo (chiamare, aiutare, credere, consigliare, ecc.)
  // controllati QUI, prima delle preposizioni generiche come "с" — così, se una frase ha
  // sia un verbo del genere sia una frase secondaria con "с" (es. "aiuta ai passeggeri CON
  // disabilità"), il caso insegnato dal verbo principale ha la priorità. Se in più la frase
  // contiene anche "с"/"со" (strumentale), vengono indicati ENTRAMBI i casi presenti, invece
  // di nasconderne uno: la frase ha davvero due complementi in due casi diversi.
  if (has("по") && (has("погоде", "моде"))) return { case: "Dativo", questionType };
  const dativoVerb = hasStem("звон", "помог", "помож", "совету", "скуча", "последова") || has(
      "верю", "веришь", "верит", "верим", "верите", "верят",
      "следую", "следуешь", "следует", "следуем", "следуете", "следуют",
      "поддаюсь", "поддаёшься", "поддаётся", "поддаёмся", "поддаётесь", "поддаются",
      "доверяю", "доверяешь", "доверяет", "доверяем", "доверяете", "доверяют",
      "желаю", "желаешь", "желает", "желаем", "желаете", "желают",
      "принадлежу", "принадлежишь", "принадлежит", "принадлежим", "принадлежите", "принадлежат",
      "подчиняюсь", "подчиняешься", "подчиняется", "подчиняемся", "подчиняетесь", "подчиняются",
      "уступаю", "уступаешь", "уступает", "уступаем", "уступаете", "уступают"
    );
  if (dativoVerb) {
    if (has("с", "со")) return { case: "Dativo + Strumentale", questionType };
    return { case: "Dativo", questionType };
  }
  // "рад/ра́да/ра́ды за" (felice per, contento per) è un'eccezione: "за" qui regge
  // l'accusativo, non lo strumentale come nel resto dei casi con questa preposizione —
  // controllo prioritario prima del trigger generico "за".
  if (has("рад", "рада", "рады") && has("за")) return { case: "Accusativo", questionType };
  if (has("с", "со", "над", "под", "перед", "между", "за")) return { case: "Strumentale", questionType };
  if (has("о", "об", "обо", "при")) return { case: "Prepositivo", questionType };
  // "в"/"на" indicano il prepositivo (stato in luogo) salvo un verbo di moto nelle vicinanze,
  // nel qual caso indicano l'accusativo (moto a luogo) — controllo approssimato ma utile.
  if (has("в", "на")) {
    const motionVerb = has(
      "иду", "идёшь", "идёт", "идём", "идёте", "идут",
      "еду", "едешь", "едет", "едем", "едете", "едут",
      "пойду", "пойдёшь", "пойдёт", "пойдём", "пойдёте", "пойдут",
      "поеду", "поедешь", "поедет", "поедем", "поедете", "поедут",
      "пошёл", "пошла", "пошли",
      "поехал", "поехала", "поехали",
      "приеду", "приедешь", "приедет", "приедем", "приедете", "приедут",
      "приехал", "приехала", "приехали",
      "ходил", "ходила", "ходили"
    );
    return { case: motionVerb ? "Accusativo" : "Prepositivo", questionType };
  }

  // verbi comuni che reggono lo strumentale SENZA preposizione (appassionarsi di, occuparsi
  // di, interessarsi a, lavorare-come, diventare) — stessa logica per radice.
  if (has("картой", "наличными")) return { case: "Strumentale", questionType };
  if (hasStem("увлека", "занима", "интересу", "явля", "станов", "риску") || has(
      "горжусь", "гордишься", "гордится", "гордимся", "гордитесь", "гордятся",
      "пользуюсь", "пользуешься", "пользуется", "пользуемся", "пользуетесь", "пользуются",
      "руковожу", "руководишь", "руководит", "руководим", "руководите", "руководят",
      "владею", "владеешь", "владеет", "владеем", "владеете", "владеют",
      "восхищаюсь", "восхищаешься", "восхищается", "восхищаемся", "восхищаетесь", "восхищаются"
    )) return { case: "Strumentale", questionType };
  if (has("делюсь", "делишься", "делится", "делимся", "делитесь", "делятся")) return { case: "Strumentale", questionType };
  if (words.includes("работаю") || words.includes("работает") || words.includes("работаешь") || words.includes("работаем") || words.includes("работаете") || words.includes("работают")) {
    // "lavoro come X" è strumentale solo se seguito da una professione, non da un avverbio
    // di tempo/luogo — controllo approssimato: se NON c'è una preposizione dopo, assumiamo
    // il caso professione+strumentale (il pattern più comune per questo verbo a scuola).
    if (!has("в", "на", "с", "по", "над", "до", "из", "от")) return { case: "Strumentale", questionType };
  }

  // nessuna preposizione: se c'è un verbo transitivo comune, il complemento è quasi sempre
  // all'accusativo (l'oggetto diretto); altrimenti nominativo (soggetto, o frase con
  // "быть"/aggettivo predicativo). Controllato per radice per coprire tutte le persone.
  // "быть/бывать" + aggettivo predicativo regge spesso lo strumentale in russo (es. "статья
  // не бывает нейтральной") — controllo: verbo essere presente + ultima parola con una
  // desinenza tipica dell'aggettivo strumentale.
  if (hasStem("был", "быва") || (has("себя") && hasStem("чувству"))) {
    const lastWord = words[words.length - 1] || "";
    if (/(ым|им|ой|ей)$/.test(lastWord) && lastWord.length > 3) {
      return { case: "Strumentale", questionType };
    }
  }

  const transitiveVerb = hasStem(
      "любл", "люб", "чита", "пиш", "дела",
      "зна", "покупа", "есть", "куп",
      "пригла", "игнори", "понима", "получ", "нашл", "наход", "найд",
      "убира", "забы", "вспомн", "планир", "готов", "принима", "изуча", "коллекционир"
    ) || has(
      "вижу", "видишь", "видит", "видим", "видите", "видят",
      "решил", "решила", "решили", "решаю", "решаешь", "решает", "решаем", "решаете", "решают",
      "ем", "ешь", "ест", "едим", "едите", "едят",
      "пью", "пьёшь", "пьёт", "пьём", "пьёте", "пьют",
      "беру", "берёшь", "берёт", "берём", "берёте", "берут",
      "хочу", "хочешь", "хочет", "хотим", "хотите", "хотят",
      "помню", "помнишь", "помнит", "помним", "помните", "помнят",
      "улавливаю", "улавливаешь", "улавливает", "улавливаем", "улавливаете", "улавливают",
      "ношу", "носишь", "носит", "носим", "носите", "носят",
      "закажу", "закажешь", "закажет", "закажем", "закажете", "закажут",
      "мою", "моешь", "моет", "моем", "моете", "моют",
      "стираю", "стираешь", "стирает", "стираем", "стираете", "стирают",
      "глажу", "гладишь", "гладит", "гладим", "гладите", "гладят"
    );
  return { case: transitiveVerb ? "Accusativo" : "Nominativo", questionType };
}

function PhraseCaseTag({ ru }) {
  const { case: caseName, questionType } = detectRussianCase(ru);
  // se il caso è composto (es. "Dativo + Strumentale", quando la frase ha davvero due
  // complementi in due casi diversi), il colore usato è quello del caso principale
  // (il primo), così il tag resta leggibile invece di ricadere sul colore di riserva.
  const primaryCase = caseName.split(" + ")[0];
  const color = CASE_COLORS[primaryCase] || "#F0EAD8";
  return (
    <span style={{ fontSize: TEXT_SIZES.tiny, fontWeight: 700, color, whiteSpace: "nowrap" }}>
      {caseName}{questionType ? ` · ${questionType}` : ""}
    </span>
  );
}

function SectionBackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      style={{
        background: "none",
        border: "none",
        color: "#D9A441",
        fontSize: TEXT_SIZES.body,
        fontWeight: 700,
        cursor: "pointer",
        padding: 0,
        marginBottom: 6,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      ← Indietro
    </button>
  );
}

function pkgNavBtnStyle(disabled) {
  return {
    background: "rgba(217,164,65,0.22)",
    border: "2px solid #D9A441",
    borderRadius: 12,
    width: 52,
    height: 52,
    fontSize: TEXT_SIZES.cardTitleLarge,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#D9A441",
    fontWeight: 700,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.3 : 1,
    flexShrink: 0,
  };
}

// Piccolo pallino grigio/verde da mettere vicino al nome di un pacchetto, cliccabile
// per segnarlo come imparato senza dover scorrere fino al pulsante testuale in fondo —
// usa la stessa chiave/stato di LearnedPackageButton, così restano sempre sincronizzati.
function LearnedCircle({ sectionId, level, index, learnedPackages, onToggle, size = 14, customKey }) {
  const key = customKey || `${sectionId}-${level}-${index}`;
  const isLearned = !!learnedPackages[key];
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle(key);
      }}
      title={isLearned ? "Imparato — tocca per segnare come da ripassare" : "Non ancora imparato — tocca per segnare come imparato"}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isLearned ? "#7C8C6B" : "#8A8A8A",
        border: "none",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
}

// Barra + percentuale di pacchetti imparati per un dato livello, da mostrare subito
// sotto i pulsanti A1/A2/B1... di ogni sezione. Calcola da solo quanti pacchetti sono
// segnati come imparati su quel livello, usando lo stesso learnedPackages condiviso.
function LevelProgressBar({ sectionId, level, total, learnedPackages, keyBuilder }) {
  if (!total) return null;
  let done = 0;
  for (let i = 0; i < total; i++) {
    const key = keyBuilder ? keyBuilder(i) : `${sectionId}-${level}-${i}`;
    if (learnedPackages[key]) done++;
  }
  const pct = Math.round((done / total) * 100);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: TEXT_SIZES.small, opacity: 0.6, marginBottom: 4 }}>
        <span>Imparati in {level}</span>
        <span>{done}/{total} ({pct}%)</span>
      </div>
      <div style={{ height: 6, background: "rgba(240,234,216,0.1)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#7C8C6B", borderRadius: 3, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

// Mostra "Pacchetto [X] di Y" con X modificabile: si può scrivere direttamente
// il numero del pacchetto a cui saltare, invece di avanzare uno alla volta.
function LearnedPackageButton({ sectionId, level, index, learnedPackages, onToggle }) {
  const key = `${sectionId}-${level}-${index}`;
  const isLearned = !!learnedPackages[key];
  return (
    <button
      onClick={() => onToggle(key)}
      style={{
        width: "100%",
        marginTop: 14,
        background: isLearned ? "rgba(124,140,107,0.25)" : "rgba(124,140,107,0.1)",
        border: isLearned ? "1px solid #7C8C6B" : "1px solid rgba(124,140,107,0.4)",
        borderRadius: 10,
        padding: "10px 14px",
        color: isLearned ? "#7C8C6B" : "#F0EAD8",
        fontWeight: 700,
        fontSize: TEXT_SIZES.bodyLarge,
        cursor: "pointer",
      }}
    >
      {isLearned ? "✓ Imparato" : "Segna come imparato"}
    </button>
  );
}

function PackageJumpInput({ index, total, onJump }) {
  const [inputVal, setInputVal] = useState(String(index + 1));

  useEffect(() => {
    setInputVal(String(index + 1));
  }, [index]);

  function commit() {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1 && n <= total) {
      onJump(n - 1);
    } else {
      setInputVal(String(index + 1));
    }
  }

  return (
    <span style={{ fontSize: TEXT_SIZES.body, opacity: 0.75, display: "flex", alignItems: "center", gap: 5 }}>
      Pacchetto{" "}
      <input
        type="number"
        inputMode="numeric"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
            e.target.blur();
          }
        }}
        min={1}
        max={total}
        style={{
          width: 42,
          background: "#1B2430",
          border: "1px solid rgba(217,164,65,0.5)",
          borderRadius: 6,
          color: "#D9A441",
          fontWeight: 700,
          fontSize: TEXT_SIZES.body,
          textAlign: "center",
          padding: "3px 2px",
        }}
      />{" "}
      di {total}
    </span>
  );
}

function btnStyle(color) {
  return {
    flex: 1,
    background: color,
    border: "none",
    borderRadius: 10,
    padding: "10px 0",
    color: "#1B2430",
    fontWeight: 700,
    fontSize: TEXT_SIZES.bodyLarge,
    cursor: "pointer",
  };
}
