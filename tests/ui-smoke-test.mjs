// Test di regressione UI: monta l'app in un DOM simulato (jsdom) e verifica
// che le sezioni principali si aprano tutte senza errori.
//
// Uso:  node tests/ui-smoke-test.mjs
// Richiede una build già pronta come modulo ESM: lo script la genera da solo
// con esbuild, quindi basta eseguirlo — non serve preparare nulla a mano.
//
// Nota: questo test copre la navigazione, non ogni singola funzionalità
// interattiva (quella verificata caso per caso durante lo sviluppo). Serve
// come rete di sicurezza minima per capire in fretta se una modifica ha
// rotto qualcosa di strutturale nell'app.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, "..", "client");
const BUNDLE_PATH = path.join(__dirname, ".tmp-app-bundle.mjs");

console.log("Compilo App.jsx con esbuild (solo per il test, non tocca la build reale)...");
execSync(
  `npx --yes esbuild src/App.jsx --bundle --format=esm --platform=browser --external:react --external:react-dom --external:lucide-react --loader:.jsx=jsx --outfile=${BUNDLE_PATH}`,
  { cwd: CLIENT_DIR, stdio: "inherit" }
);

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: "https://example.com",
  pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
try {
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
} catch {}
window.storage = {
  async get() { return null; },
  async set(k, v) { return { key: k, value: v }; },
  async delete() { return {}; },
  async list() { return { keys: [] }; },
};
window.speechSynthesis = { getVoices: () => [], speak: () => {}, cancel: () => {}, addEventListener() {}, removeEventListener() {} };
window.SpeechSynthesisUtterance = function (t) { this.text = t; };
window.fetch = globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ content: [] }) });

const React = await import("react");
const { createRoot } = await import("react-dom/client");
const { act } = await import("react-dom/test-utils");
const App = (await import(`file://${BUNDLE_PATH}?t=` + Math.random())).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => {
  root.render(React.createElement(App));
  await new Promise((r) => setTimeout(r, 30));
});

function click(el) {
  el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
}
function findButton(text) {
  return [...document.querySelectorAll("button")].find((b) => b.textContent.includes(text));
}
async function clickButton(text) {
  const b = findButton(text);
  if (!b) return false;
  await act(async () => {
    click(b);
    await new Promise((r) => setTimeout(r, 10));
  });
  return true;
}
async function goHome() {
  await clickButton("Home");
}

let problems = 0;
function check(label, condition) {
  console.log(`  ${condition ? "✅" : "❌"} ${label}`);
  if (!condition) problems++;
}

console.log("\n=== Test di regressione UI — Матрёшка Мариса ===\n");

check("App montata", document.body.innerHTML.includes("Матрёшка"));

console.log("\nImpara:");
await clickButton("Impara");
const partiDelDiscorsoItems = ["Pronomi", "Nomi", "Verbi", "Aggettivi", "Preposizioni", "Avverbio", "Numerale", "Congiunzione", "Particella", "Interiezione"];
const partiDellaFraseItems = ["Analisi frase"];
async function ensureExpanded(sectionLabel) {
  // lo stato di apertura/chiusura persiste a livello di App e non si resetta tornando a
  // Home, quindi controlliamo se è già aperta guardando la freccia (▲=aperta, ▼=chiusa)
  // prima di cliccare, invece di alternare stato ad ogni click.
  const btn = findButton(sectionLabel);
  if (btn && btn.textContent.includes("▼")) {
    await clickButton(sectionLabel);
  }
}
for (const name of [...partiDelDiscorsoItems, ...partiDellaFraseItems]) {
  if (partiDelDiscorsoItems.includes(name)) await ensureExpanded("Parti del Discorso");
  else await ensureExpanded("Parti della Frase");
  const opened = await clickButton(name);
  check(`${name} si apre`, opened && !document.body.innerHTML.includes("undefined"));
  await goHome();
  await clickButton("Impara");
}

console.log("\nPratica:");
await goHome();
await clickButton("Pratica");
for (const name of ["Componi", "Difficoltà", "Frasi", "Dialoghi", "Carte", "Sessione", "Corsivo"]) {
  const opened = await clickButton(name);
  check(`${name} si apre`, opened && !document.body.innerHTML.includes("undefined"));
  await goHome();
  await clickButton("Pratica");
}

console.log("\nAltre sezioni da Home:");
await goHome();
check("Cerca vocabolario presente", !!findButton("Cerca vocabolario"));
check("Test di piazzamento presente", !!findButton("piazzamento"));
check("Mappa di padronanza presente", !!findButton("padronanza"));
check("Programma presente", !!findButton("Programma"));

fs.unlinkSync(BUNDLE_PATH);

console.log(`\n=== Risultato: ${problems === 0 ? "✅ TUTTO OK" : `❌ ${problems} PROBLEMI TROVATI`} ===`);
process.exit(problems === 0 ? 0 : 1);
