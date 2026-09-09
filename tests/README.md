# Test di verifica — Матрёшка Мариса

Due script indipendenti dal resto del progetto (dipendenze proprie, non toccano `client/node_modules`).

## Installazione (una sola volta)

```bash
cd tests
npm install
```

## Esecuzione

```bash
npm test              # esegue entrambi i test in sequenza
npm run test:data     # solo verifica dati (veloce, ~1 secondo)
npm run test:ui       # solo verifica navigazione UI (compila l'app al volo, ~10 secondi)
```

## Cosa verificano

**`data-integrity-test.mjs`** — legge `client/src/App.jsx` e controlla:
- Lezioni: 60 totali, ognuna con 6 righe di dialogo
- Dialoghi: 42 totali (7 per livello), ogni risposta corretta dei turni di ruolo corrisponde davvero a una battuta del dialogo
- Tutte le sezioni grammaticali (Casi, Verbi, Aggettivi, Preposizioni, Avverbio, Numerale, Congiunzione, Particella, Interiezione, Analisi sintattica): almeno 9 pacchetti per livello
- Regola grammaticale russa delle 7 lettere (dopo г к х ж ч ш щ mai "ы")

Non dipende da numeri di riga: individua ogni blocco dati contando le parentesi, quindi resta valido anche se il file cresce.

**`ui-smoke-test.mjs`** — monta l'app in un browser simulato (jsdom) e verifica che tutte le sezioni principali (Impara, Pratica, e i collegamenti da Home) si aprano senza errori.

## Quando usarli

Dopo ogni modifica a `App.jsx`, specialmente se riguarda contenuto grammaticale o dialoghi: `npm test` in pochi secondi conferma che non ci siano regressioni prima di consegnare.
