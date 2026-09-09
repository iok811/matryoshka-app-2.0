// Verifica strutturale dei dati grammaticali di App.jsx.
// Non dipende da numeri di riga fissi: individua ogni blocco `const NOME = { ... }`
// o `const NOME = [ ... ]` contando le parentesi, quindi resta valido anche
// se il file cresce o l'ordine dei blocchi cambia.
//
// Uso:  node tests/data-integrity-test.mjs
// Serve Node.js con supporto ai moduli ES (Node 18+).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_PATH = path.join(__dirname, "..", "client", "src", "App.jsx");
const DATA_DIR = path.join(__dirname, "..", "client", "src", "data");

// I dati e le funzioni helper possono ormai vivere in App.jsx oppure in uno dei moduli
// estratti sotto client/src/data/. Concateniamo tutte le fonti per cercare i blocchi
// ovunque si trovino, così il test resta valido indipendentemente da come è organizzato il codice.
function readAllSources() {
  let combined = fs.readFileSync(APP_PATH, "utf-8");
  if (fs.existsSync(DATA_DIR)) {
    for (const file of fs.readdirSync(DATA_DIR)) {
      if (file.endsWith(".js")) {
        combined += "\n\n" + fs.readFileSync(path.join(DATA_DIR, file), "utf-8").replace(/^export /gm, "");
      }
    }
  }
  return combined;
}
const source = readAllSources();

// Estrae il testo di un blocco top-level `const NOME = {` oppure `const NOME = [`,
// includendo la riga di apertura, fino alla chiusura bilanciata corrispondente.
function extractBlock(name) {
  const re = new RegExp(`^const ${name} = ([\\{\\[])`, "m");
  const m = re.exec(source);
  if (!m) return null;
  const openChar = m[1];
  const closeChar = openChar === "{" ? "}" : "]";
  let i = m.index + m[0].length;
  let depth = 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === openChar) depth++;
    else if (source[i] === closeChar) depth--;
    i++;
  }
  return source.slice(m.index, i) + (openChar === "{" ? ";" : ";");
}

// Alcuni blocchi dati usano funzioni "helper" (es. ex(), dlLine(), af(), adj()...)
// definite altrove nel file. Le estraiamo automaticamente cercandole per nome.
function extractHelper(name) {
  const re = new RegExp(`^function ${name}\\(`, "m");
  const m = re.exec(source);
  if (!m) return null;
  let i = source.indexOf("{", m.index);
  let depth = 1;
  i++;
  while (depth > 0 && i < source.length) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") depth--;
    i++;
  }
  return source.slice(m.index, i);
}

// Mappa: nome del blocco dati -> helper di cui ha bisogno per essere valutato standalone.
const BLOCKS = {
  PREPOSITIONS: ["ex", "prep"],
  DIALOGUES: ["ex", "dlLine", "dlTurn", "dlOpt", "dialogue"],
  DECLENSIONS: ["ex"],
  ADJECTIVES: ["ex", "vf", "af", "adj"],
  VERBS: ["ex", "vf", "af", "vbPair", "sq"],
  PHRASE_GROUPS: ["pg"],
  COMPOSE_GROUPS: ["cf"],
  PRONOUNS: ["ex"],
  LESSONS: [],
  ADVERBS: [],
  NUMERALS: [],
  CONJUNCTIONS: [],
  PARTICLES: [],
  INTERJECTIONS: [],
  SYNTAX_SENTENCES: [],
  PRONOUN_SENTENCES: [],
  LEVEL_TESTS: [],
  NUMBERS_TABLE: [],
};

let problems = 0;
function fail(msg) {
  console.log("  ❌ " + msg);
  problems++;
}
function ok(msg) {
  console.log("  ✅ " + msg);
}

async function loadBlock(name) {
  const helperNames = BLOCKS[name];
  const helperCode = helperNames.map((h) => extractHelper(h)).filter(Boolean).join("\n\n");
  const blockCode = extractBlock(name);
  if (!blockCode) return null;
  const moduleCode = `${helperCode}\n\n${blockCode}\nexport default ${name};`;
  const tmpFile = path.join(__dirname, `.tmp-${name}.mjs`);
  fs.writeFileSync(tmpFile, moduleCode, "utf-8");
  try {
    const mod = await import(`file://${tmpFile}?t=${Math.random()}`);
    return mod.default;
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

async function main() {
  console.log("=== Verifica integrità dati — Матрёшка Мариса ===\n");

  // --- LESSONS: 6 livelli x 10 lezioni, dialogo di 6 righe ciascuna ---
  console.log("LESSONS:");
  const LESSONS = await loadBlock("LESSONS");
  if (!LESSONS) fail("blocco non trovato");
  else {
    let total = 0;
    for (const lvl of LEVELS) {
      const arr = LESSONS[lvl] || [];
      total += arr.length;
      for (const lesson of arr) {
        if (lesson.story.length !== 6) fail(`${lvl}/${lesson.id}: dialogo con ${lesson.story.length} righe (atteso 6)`);
      }
    }
    if (total === 60) ok(`60 lezioni totali (10 per livello)`);
    else fail(`${total} lezioni totali (atteso 60)`);
  }

  // --- DIALOGUES: 6 livelli x 7 dialoghi, ogni turno deve avere una risposta corretta corrispondente ---
  console.log("\nDIALOGUES:");
  const DIALOGUES = await loadBlock("DIALOGUES");
  if (!DIALOGUES) fail("blocco non trovato");
  else {
    let total = 0, mismatches = 0;
    for (const lvl of LEVELS) {
      const arr = DIALOGUES[lvl] || [];
      total += arr.length;
      if (arr.length !== 7) fail(`${lvl}: ${arr.length} dialoghi (atteso 7)`);
      for (const d of arr) {
        for (const t of d.turns) {
          const correct = t.options.find((o) => o.correct);
          if (!correct || !d.lines.some((l) => l.speaker === d.userRole && l.ru === correct.ru)) {
            fail(`${lvl}/${d.title}: risposta corretta di un turno non corrisponde a nessuna riga`);
            mismatches++;
          }
        }
      }
    }
    if (total === 42 && mismatches === 0) ok(`42 dialoghi totali, tutte le risposte corrette verificate`);
  }

  // --- Sezioni "9+ pacchetti per livello" con struttura word/examples ---
  console.log("\nSezioni semplici (Avverbio, Numerale, Congiunzione, Particella, Interiezione):");
  for (const name of ["ADVERBS", "NUMERALS", "CONJUNCTIONS", "PARTICLES", "INTERJECTIONS"]) {
    const data = await loadBlock(name);
    if (!data) { fail(`${name}: blocco non trovato`); continue; }
    let allGood = true;
    for (const lvl of LEVELS) {
      const n = (data[lvl] || []).length;
      if (n < 9) { fail(`${name} ${lvl}: solo ${n} pacchetti (atteso almeno 9)`); allGood = false; }
    }
    if (allGood) ok(`${name}: tutti i livelli con almeno 9 pacchetti`);
  }

  // --- Casi, Verbi, Aggettivi, Preposizioni ---
  console.log("\nCasi / Verbi / Aggettivi / Preposizioni:");
  const DECLENSIONS = await loadBlock("DECLENSIONS");
  if (DECLENSIONS) {
    let allGood = true;
    for (const lvl of LEVELS) if ((DECLENSIONS[lvl] || []).length < 9) { fail(`Casi ${lvl}: sotto 9 pacchetti`); allGood = false; }
    if (allGood) ok("Casi: tutti i livelli con almeno 9 pacchetti");
  } else fail("Casi: blocco non trovato");

  const VERBS = await loadBlock("VERBS");
  if (VERBS) {
    let allGood = true;
    for (const lvl of LEVELS) if ((VERBS[lvl] || []).length < 9) { fail(`Verbi ${lvl}: sotto 9 pacchetti`); allGood = false; }
    if (allGood) ok("Verbi: tutti i livelli con almeno 9 pacchetti");
  } else fail("Verbi: blocco non trovato");

  const ADJECTIVES = await loadBlock("ADJECTIVES");
  if (ADJECTIVES) {
    let allGood = true;
    for (const lvl of LEVELS) if ((ADJECTIVES[lvl] || []).length < 9) { fail(`Aggettivi ${lvl}: sotto 9 pacchetti`); allGood = false; }
    if (allGood) ok("Aggettivi: tutti i livelli con almeno 9 pacchetti");
  } else fail("Aggettivi: blocco non trovato");

  const PREPOSITIONS = await loadBlock("PREPOSITIONS");
  if (PREPOSITIONS) {
    let allGood = true;
    for (const lvl of LEVELS) if ((PREPOSITIONS[lvl] || []).length < 9) { fail(`Preposizioni ${lvl}: sotto 9 pacchetti`); allGood = false; }
    if (allGood) ok("Preposizioni: tutti i livelli con almeno 9 pacchetti");
  } else fail("Preposizioni: blocco non trovato");

  // --- Analisi sintattica ---
  console.log("\nAnalisi sintattica:");
  const SYNTAX_SENTENCES = await loadBlock("SYNTAX_SENTENCES");
  if (SYNTAX_SENTENCES) {
    let allGood = true;
    for (const lvl of LEVELS) {
      const arr = SYNTAX_SENTENCES[lvl] || [];
      if (arr.length < 9) { fail(`${lvl}: solo ${arr.length} frasi (atteso almeno 9)`); allGood = false; }
      for (const s of arr) {
        for (const c of s.chunks) {
          if (!s.ru.includes(c.text)) { fail(`${lvl}: chunk "${c.text}" non contenuto nella frase`); allGood = false; }
        }
      }
    }
    if (allGood) ok("Tutti i livelli con almeno 9 frasi, tutti i chunk verificati");
  } else fail("blocco non trovato");

  // --- Regola grammaticale russa delle 7 lettere: dopo г к х ж ч ш щ mai "ы", sempre "и" ---
  console.log("\nRegola delle 7 lettere (г к х ж ч ш щ + и, mai + ы):");
  const violations = source.match(/(?:г|к|х|ж|ч|ш|щ)ы[а-яё"]*"/g) || [];
  if (violations.length === 0) ok("Nessuna violazione trovata in tutto il file");
  else fail(`${violations.length} possibili violazioni trovate: ${violations.slice(0, 5).join(", ")}`);

  console.log(`\n=== Risultato: ${problems === 0 ? "✅ TUTTO OK" : `❌ ${problems} PROBLEMI TROVATI`} ===`);
  process.exit(problems === 0 ? 0 : 1);
}

main();
