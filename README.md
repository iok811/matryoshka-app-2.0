# Матрёшка Мариса

App per imparare il russo (italiano → russo), pensata per la pubblicazione su App
Store e Google Play, con due livelli gratuiti (A1 e A2) e un abbonamento
(annuale o "vita intera") per i livelli B1-C2, gestito tramite RevenueCat.

## Struttura

```
matryoshka-app/
  server/     backend Express — solo proxy per le chiamate IA (Claude, ElevenLabs).
              Non salva mai i progressi degli utenti: nessun database richiesto.
  client/     frontend React (Vite) + Capacitor per le build native iOS/Android
  tests/      suite di test automatici (integrità dati + regressione UI)
  docs/       documentazione pronta per la pubblicazione sugli store
```

## Dove vivono i dati dell'utente

**Sul dispositivo, mai su un server**: progressi, lezioni completate, pacchetti
generati e impostazioni sono salvati tramite `@capacitor/filesystem` nelle build
native, o `localStorage` se l'app gira in un browser normale. Il server non ha
un database e non lo richiede — la sua unica funzione è fare da proxy verso i
servizi IA (Claude per la generazione di contenuti, ElevenLabs per la voce
madrelingua inclusa nell'abbonamento), usando chiavi che restano lato server e
non vengono mai esposte al client.

## 1. Ottieni le chiavi API necessarie

- **Anthropic** (per la generazione di lezioni/esercizi): crea un account su
  https://console.anthropic.com, vai su **API Keys** e creane una. È un account
  separato da un eventuale abbonamento Claude.ai — l'uso dell'API si paga a
  consumo (puoi impostare un tetto di spesa in console).
- **ElevenLabs** (per la voce madrelingua inclusa nell'abbonamento): crea un
  account su https://elevenlabs.io e copia la tua API key dalle impostazioni
  dell'account.

## 2. Configura il server

```bash
cd server
npm install
cp .env.example .env
# apri .env e incolla:
#   ANTHROPIC_API_KEY=sk-ant-...
#   ELEVENLABS_API_KEY=...
```

## 3. Configura l'abbonamento (RevenueCat)

1. Crea un account su https://www.revenuecat.com
2. Crea un progetto, e al suo interno un **entitlement** chiamato `premium`
3. Crea i due prodotti (abbonamento annuale + acquisto "vita intera") in App
   Store Connect / Google Play Console, poi collegali come pacchetti
   `$rc_annual` / `$rc_lifetime` nell'offerta RevenueCat, entrambi legati
   all'entitlement `premium`
4. Copia le due chiavi pubbliche (iOS e Android) da RevenueCat e sostituiscile
   in `client/src/App.jsx` al posto di `REVENUECAT_API_KEY_IOS` /
   `REVENUECAT_API_KEY_ANDROID` (cerca `REPLACE_WITH_` nel file)

Senza queste chiavi l'app funziona comunque: l'abbonamento risulta semplicemente
sempre "non attivo" invece di andare in errore, quindi puoi sviluppare e
testare il resto senza fretta di configurare questa parte.

## 4. Avvia in sviluppo (due terminali)

```bash
# terminale 1
cd server
npm run dev

# terminale 2
cd client
npm run dev
```

Apri http://localhost:5173 — il frontend Vite inoltra automaticamente le
chiamate `/api/...` al server su `localhost:3001`.

## 5. Build per il web (facoltativo, utile per test rapidi)

```bash
cd client
npm run build
cd ../server
npm start
```

Apri http://localhost:3001 — il server ora serve anche il frontend compilato
dalla cartella `client/dist`, tutto da un solo processo. Utile per un test
rapido da browser, ma **non è il percorso di pubblicazione principale**: per
quello vedi il punto successivo.

## 6. Build nativa per App Store / Google Play

```bash
cd client
npm install
npm run build
npx cap sync
npx cap open ios       # apre Xcode
npx cap open android    # apre Android Studio
```

Da lì, segui la documentazione già pronta in `docs/`:

- `docs/note-revisore-e-permessi.md` — note per il revisore Apple, permessi da
  dichiarare, checklist finale prima dell'invio
- `docs/guida-google-play.md` — passaggi equivalenti per Google Play
- `docs/app-store-scheda.md` — testi pronti per la scheda dello store
- `docs/privacy-policy.md` — informativa privacy da pubblicare su un URL
  pubblico e collegare in App Store Connect
- `docs/termini-di-servizio.md` — termini di servizio, stessa via di
  pubblicazione della privacy policy
- `docs/mappa-freemium.md` — la logica di cosa è gratuito (A1 e A2) e cosa
  richiede l'abbonamento (B1-C2), già implementata nel codice

## Test automatici

```bash
cd tests
npm install
node data-integrity-test.mjs   # verifica il contenuto didattico (lezioni, dialoghi, grammatica)
node ui-smoke-test.mjs         # verifica che l'app si monti e le sezioni principali si aprano
```

Da eseguire dopo ogni modifica a `client/src/App.jsx` o ai file in
`client/src/data/`.

## Se in futuro vuoi il sync tra dispositivi

Oggi i progressi restano solo sul dispositivo per scelta (più semplice, più
in linea con quanto dichiarato nella privacy policy, nessun costo di database
da sostenere). Se in futuro vorrai aggiungere il sync tra dispositivi per gli
utenti abbonati, `server/db.js` contiene già un'implementazione funzionante
per un database Postgres esterno (es. [Neon](https://neon.tech), piano
gratuito) — oggi non importata da nessuna parte, ma pronta da ricollegare a
`server/index.js` se deciderai di aggiungere questa funzione.
