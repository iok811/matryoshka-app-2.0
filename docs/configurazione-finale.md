# Configurazione finale prima della pubblicazione

Questo è l'UNICO file da seguire per compilare tutto ciò che resta prima di
inviare l'app agli store. Ogni voce dice esattamente dove si trova nel
codice, cosa metterci, e da dove prenderlo.

## 1. URL del backend (obbligatorio — senza questo, IA e voce premium non funzionano su un vero dispositivo)

**File**: `client/src/App.jsx`, riga 251

```js
const API_BASE = "";
```

**Perché conta**: questo valore vuoto è corretto SOLO in sviluppo locale
(dove il proxy di Vite inoltra `/api` a `localhost:3001`). Un'app Capacitor
pubblicata gira come app nativa su un dominio virtuale locale, mai sullo
stesso dominio del backend reale — con questo valore ancora vuoto, ogni
chiamata a generazione lezioni, conversazione IA e voce madrelingua premium
fallirebbe silenziosamente su un vero dispositivo (mostrando "verifica la
connessione" anche con rete perfetta), indipendentemente da quanto sia
verificato il resto dell'app.

**Da dove prenderlo**: l'URL pubblico completo di dove hai (o avrai)
deployato la cartella `server/` — ad esempio `https://tuo-nome.onrender.com`
se usi Render, o l'equivalente del tuo hosting. Sostituisci `""` con quella
stringa, tra virgolette, senza slash finale.

## 2. Chiavi RevenueCat (abbonamenti)

**File**: `client/src/App.jsx`, righe 527-528

```js
const REVENUECAT_API_KEY_IOS = "REPLACE_WITH_REVENUECAT_IOS_PUBLIC_KEY";
const REVENUECAT_API_KEY_ANDROID = "REPLACE_WITH_REVENUECAT_ANDROID_PUBLIC_KEY";
```

**Da dove prenderle**: dashboard RevenueCat (app.revenuecat.com) → Project
settings → API keys. Sono chiavi **pubbliche** (non segrete), una per
piattaforma. Serve un account RevenueCat collegato ai prodotti creati in
App Store Connect e Play Console.

**Finché restano `REPLACE_WITH_`**: l'app funziona normalmente, ma gli
acquisti risultano sempre "non disponibili" — nessun crash, comportamento
già gestito (vedi riga 592, `apiKey.startsWith("REPLACE_WITH_")`).

## 3. URL Termini di Servizio e Privacy Policy

**File**: `client/src/App.jsx`, righe 540-541

```js
const TERMS_OF_SERVICE_URL = "REPLACE_WITH_TERMS_URL";
const PRIVACY_POLICY_URL = "REPLACE_WITH_PRIVACY_POLICY_URL";
```

**Da dove prenderli**: devono essere URL **pubblici e stabili**, raggiungibili
da chiunque senza login. Passi pratici:
1. Il testo della Privacy Policy è già pronto in `docs/privacy-policy.md` —
   va solo pubblicato online (es. una pagina sul tuo sito, o un servizio
   gratuito come GitHub Pages).
2. Il testo dei Termini di Servizio è ora pronto anche lui, in
   `docs/termini-di-servizio.md` — stessa via di pubblicazione della
   Privacy Policy. Prima di pubblicarlo, conferma la sezione 9 (legge
   applicabile) — è l'unico punto che dipende da una scelta specifica
   sulla tua situazione, non assunta per certo nel testo.
3. Incolla i due URL finali in queste due righe.

**Perché conta**: questi link sono mostrati **direttamente nella schermata
del paywall**, vicino ai pulsanti d'acquisto — Apple verifica che siano
raggiungibili durante la revisione, non solo che esistano.

## 4. Privacy Manifest iOS — passaggio in Xcode

**File già creato**: `client/ios/App/App/PrivacyInfo.xcprivacy` (nessuna
modifica di testo necessaria per le tre categorie già dichiarate — ma
contiene una nota su tre plugin, incluso il più recente `@capacitor/share`,
la cui necessità di dichiarazione non è confermata con certezza dalla
documentazione ufficiale reperibile: riverifica con l'estensione VS Code di
Ionic o Xcode stesso prima della sottomissione).

**Cosa fare**: aprire il progetto (`client/ios/App/App.xcworkspace`) in Xcode
e verificare che il file compaia nel navigatore del progetto, dentro il
target "App". Se non compare (perché creato da fuori Xcode), trascinarlo
nella cartella del progetto con "Copy items if needed" e la checkbox del
target "App" spuntata.

**Perché conta**: senza questo file incluso nel target, App Store Connect
rifiuta automaticamente la build in fase di validazione — prima ancora
della revisione umana.

## 5. Email di contatto nella Privacy Policy

**File**: `docs/privacy-policy.md`, riga 56

```
Per domande su questa informativa o per richiedere la cancellazione dei tuoi dati, scrivi a: **[inserisci qui il tuo indirizzo email di contatto]**
```

**Perché conta**: Apple richiede esplicitamente "published contact information so users can easily reach you" per app con contenuto generato da IA — un requisito distinto da quello sui Termini/Privacy Policy del punto 3. Questo segnaposto vive in un file di documentazione, non in `App.jsx`, quindi **non viene rilevato dal comando `grep "REPLACE_WITH_"` già usato per verificare gli altri punti** — controllalo separatamente prima di pubblicare la pagina.

**Da dove prenderla**: una qualsiasi email che controlli davvero e a cui risponderai (anche una casella dedicata tipo `supporto@tuodominio.it`).

## 6. Account sviluppatore

Non c'è nulla da scrivere nel codice per questo punto — sono account che
solo tu puoi creare:
- **Apple Developer Program**: 99$/anno, richiesto per pubblicare su App Store.
- **Google Play Console**: quota di registrazione una tantum, richiesta per
  pubblicare su Google Play.

---

## Come verificare di aver finito

Dopo aver compilato i punti 2 e 3, esegui questo comando dalla cartella
`client/` — se non stampa nulla, sei a posto per quei due:

```bash
grep -n "REPLACE_WITH_" src/App.jsx
```

Per il punto 1 (`API_BASE`), verifica separatamente che non sia più una
stringa vuota:

```bash
grep -n 'const API_BASE = ""' src/App.jsx
```

Se questo comando non stampa nulla, hai già inserito un URL — controlla solo
che sia quello giusto.

Per il punto 5 (email di contatto), dalla cartella `docs/`:

```bash
grep -n "inserisci qui" privacy-policy.md
```

Se non stampa nulla, hai già inserito l'email.

