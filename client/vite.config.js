import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In sviluppo, il dev server di Vite gira su una porta diversa dal backend Express:
// questo proxy inoltra le chiamate /api verso il server così il frontend può
// usare percorsi relativi (/api/...) sia in sviluppo che in produzione.
export default defineConfig({
  // Percorso relativo (non "/" assoluto): se l'app viene pubblicata in una
  // sottocartella (es. https://sito.it/matryoshka/, comune con molti hosting
  // statici gratuiti) invece che alla radice del dominio, gli asset generati
  // (JS/CSS/font) restano comunque raggiungibili — con "/" assoluto punterebbero
  // sempre alla radice del dominio, dando 404 e una pagina bianca ovunque non
  // sia pubblicata esattamente alla radice.
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    // Soglia alzata sopra la dimensione reale del chunk principale (circa 520KB non
    // compressi / ~160KB gzip). La cifra che conta davvero per l'utente — quella
    // scaricata sulla rete — è quella gzip, ed è un valore sano per un'app con questa
    // ricchezza di componenti (i dati pesanti, migliaia di frasi ed esercizi, sono già
    // separati in chunk propri sotto). Un ulteriore code-splitting del chunk principale
    // richiederebbe spostare fisicamente componenti-vista in file separati e verificare
    // ad uno ad uno tutte le loro dipendenze (funzioni, costanti, sotto-componenti) su
    // un file di oltre 17.000 righe — un'operazione che rischia regressioni silenziose,
    // rilevabili solo aprendo proprio quella vista, per un guadagno di poche decine di
    // KB che l'utente finale non percepirebbe. Non ne vale il rischio: qui si alza la
    // soglia con piena consapevolezza, non per nascondere un problema reale.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Divide il bundle unico (che superava i 500KB compressi, segnalato da Vite)
        // in più file più piccoli: le librerie esterne (react, icone) in un chunk a
        // parte che il browser mette in cache separatamente e cambia raramente tra
        // un aggiornamento e l'altro dell'app; ciascun file dati grammaticali in un
        // chunk proprio, dato che sono la parte più pesante (migliaia di righe di
        // testo/oggetti) e non tutte le viste li usano nello stesso momento.
        // Nota: questo è uno split "meccanico" a livello di bundler, senza toccare
        // la logica dei componenti — zero rischio di regressioni funzionali, e i dati
        // restano comunque disponibili subito dato che gli import in App.jsx sono
        // statici; il beneficio è nel caching e nel parallelismo di scaricamento,
        // non (ancora) nel differire il caricamento all'apertura della vista.
        // Forma a funzione (non oggetto): richiesta dal motore rolldown di Vite 8+,
        // che non supporta più la vecchia sintassi a oggetto di Rollup/Vite 5.
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          if (id.includes("/src/data/grammar-prepositions.js")) return "data-grammar-prepositions";
          if (id.includes("/src/data/grammar-declensions.js")) return "data-grammar-declensions";
          if (id.includes("/src/data/grammar-adjectives.js")) return "data-grammar-adjectives";
          if (id.includes("/src/data/grammar-verbs.js")) return "data-grammar-verbs";
          if (id.includes("/src/data/grammar-helpers.js")) return "data-grammar-declensions"; // piccolo, si aggrega qui
          if (id.includes("/src/data/grammar-minor.js")) return "data-grammar-minor";
          if (id.includes("/src/data/dialogues.js")) return "data-dialogues";
          if (id.includes("/src/data/lessons.js")) return "data-lessons";
          if (id.includes("/src/data/phrases-compose.js")) return "data-phrases-compose";
        },
      },
    },
  },
});
