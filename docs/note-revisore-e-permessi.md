# Note per il revisore Apple e permessi — pronti da incollare

## Note per il revisore (campo "App Review Information → Notes" in App Store Connect)

Testo in inglese, come richiesto da Apple per questo campo:

```
This app requires no account or sign-in to use its core learning features — all lessons, exercises, and progress tracking work immediately after install, fully offline-capable (progress is stored locally on-device, either via the Capacitor Filesystem API on iOS/Android or localStorage in a browser context — never on our servers).

The free tier (levels A1 and A2) is fully usable with no payment. Levels B1 through C2 require an auto-renewable subscription, offered as either an annual plan or a one-time lifetime purchase, both configured through RevenueCat/StoreKit. A "Restore Purchases" option is available in the paywall screen.

Three features connect to third-party or first-party backend services:

1. Native premium voice (Settings → Voice → "Voce madrelingua inclusa"): included with an active subscription, this streams text-to-speech audio (male or female Russian voice) through the app's own backend, which holds its own ElevenLabs API key — the user does not need to provide one. Without a subscription, the app falls back to the device's built-in text-to-speech, so it is fully usable without this feature.

2. Bring-your-own-key premium voice (Settings → Voice, below the native option): if the user enters their own ElevenLabs API key instead, the app sends text directly from the device to elevenlabs.io. Fully optional, and unrelated to the subscription.

3. AI-generated exercise packages: users can optionally generate additional practice content beyond the pre-written material. This uses the app's own backend (not a user-supplied key) and requires an active subscription; it is not required to use the app.

To review the core app: open it, and the onboarding flow offers a placement test, a beginner path, or direct exploration. All A1 and A2 content is accessible without any account or payment. To review the subscription flow, open Settings → Voice and tap "Sblocca con l'abbonamento", or open any B1+ section — both lead to the paywall (annual / lifetime / restore purchases).

If you'd like to test the subscription or the native voice feature specifically, [inserisci qui un account sandbox RevenueCat/App Store di test se vuoi fornirne uno, altrimenti cancella questa frase].
```

---

## Permessi da dichiarare in `Info.plist` (Xcode → target App → Info)

Apple richiede una spiegazione testuale per ogni permesso hardware richiesto. Da aggiungere/verificare in Xcode:

| Chiave | Testo da inserire (italiano, mostrato all'utente al momento della richiesta) |
|---|---|
| `NSMicrophoneUsageDescription` | Il microfono viene usato solo per il controllo di pronuncia: confronta ciò che dici con il testo russo da imparare. Nessuna registrazione viene salvata o inviata altrove. |
| `NSSpeechRecognitionUsageDescription` | Il riconoscimento vocale viene usato solo per valutare la tua pronuncia durante gli esercizi, in locale sul dispositivo. |

Il permesso per le notifiche (`UNUserNotificationCenter`) non richiede una voce in Info.plist — Capacitor/iOS mostrano automaticamente la richiesta di sistema quando l'app chiama `LocalNotifications.requestPermissions()` (già implementato nel codice).

---

## Etichetta privacy (App Privacy) in App Store Connect — guida alle risposte

Il questionario chiede, per ogni categoria di dati, se viene raccolta e come viene usata. Risposte suggerite per questa app:

| Categoria | Raccolta? | Collegata all'identità? | Usata per tracciamento? |
|---|---|---|---|
| Contenuti utente (progressi, risposte agli esercizi) | No (solo locale sul dispositivo, mai su un server) | — | No |
| Identificativi (email, se mai aggiungi un account) | Solo se implementi un account in futuro | Sì | No |
| Dati di utilizzo | Sì (locale, per il funzionamento dell'app) | No | No |
| Posizione | No | — | — |
| Contatti | No | — | — |
| Dati finanziari (cronologia acquisti/abbonamento) | Sì, tramite RevenueCat/StoreKit/Play Billing per gestire l'abbonamento | Sì (necessario per verificare l'acquisto) | No |
| Identificativo pubblicitario (IDFA) | No | — | — |

**"Usata per tracciamento" va sempre No** per questa app: nessun dato viene condiviso con reti pubblicitarie o data broker. I dati di acquisto passano da RevenueCat solo per verificare l'abbonamento, non per profilazione pubblicitaria.

---

## Checklist finale prima dell'invio

- [ ] **Chiavi RevenueCat reali inserite** in `client/src/App.jsx` (`REVENUECAT_API_KEY_IOS`, `REVENUECAT_API_KEY_ANDROID`) al posto dei segnaposto `REPLACE_WITH_...`
- [ ] **Prodotti creati** in App Store Connect / Google Play Console: abbonamento annuale + acquisto una tantum "vita intera", collegati come pacchetti `$rc_annual` / `$rc_lifetime` nel dashboard RevenueCat
- [ ] **Entitlement "premium" configurato** in RevenueCat, collegato a entrambi i prodotti sopra
- [ ] **`ELEVENLABS_API_KEY` reale impostata** come variabile d'ambiente sul server (per la voce madrelingua inclusa nell'abbonamento) — vedi `server/.env.example`
- [ ] Privacy Policy pubblicata su un URL pubblico stabile (aggiornata per menzionare l'abbonamento — vedi `docs/privacy-policy.md`)
- [ ] URL inserito in App Store Connect
- [ ] Etichetta privacy compilata (tabella sopra, aggiornata per i dati finanziari dell'abbonamento)
- [ ] Icona e splash screen presenti in Xcode (già generati e sincronizzati in questo progetto)
- [ ] `NSMicrophoneUsageDescription` e `NSSpeechRecognitionUsageDescription` aggiunti in Info.plist
- [ ] Note per il revisore incollate (sopra)
- [ ] Screenshot dell'app catturati su almeno un iPhone reale o simulatore, nelle dimensioni richieste da App Store Connect al momento della sottomissione — includi almeno una schermata del paywall, come richiesto da Apple per le app con abbonamento
- [ ] Testato su un iPhone fisico almeno una volta (tastiera cirillica, microfono, notifiche, safe-area, **e un acquisto sandbox completo incluso il ripristino**)
- [ ] Account Apple Developer attivo (99 $/anno)

---

## Motivi di rifiuto più comuni — checklist di rinforzo

Oltre alla checklist sopra, questi sono i motivi di rifiuto più frequenti in assoluto per app come questa (abbonamento + WebView incapsulata). Verificali uno per uno prima di inviare.

### ⚠️ Appena aggiunto nel codice, MA richiede il tuo intervento
- [ ] **Disclosure obbligatoria sull'abbonamento** (Apple Guideline 3.1.2 / Google Play Billing policy): il testo con durata, rinnovo automatico e link a Termini/Privacy è ora mostrato **direttamente nella schermata del paywall**, vicino ai pulsanti d'acquisto (non bastava averlo solo nella privacy policy — è uno dei motivi di rifiuto più comuni in assoluto per app con abbonamento). **Devi però sostituire** `TERMS_OF_SERVICE_URL` e `PRIVACY_POLICY_URL` in cima a `client/src/App.jsx` con gli URL reali, pubblicati e raggiungibili, altrimenti i link risulteranno rotti in fase di revisione.
- [ ] Se non hai già dei Termini di Servizio (EULA) tuoi, puoi usare l'**EULA standard di Apple** (Apple lo fornisce gratuitamente, si applica automaticamente se non ne alleghi uno tuo — ma va comunque linkato esplicitamente nel paywall come sopra; il testo standard è consultabile da App Store Connect → Contratti, tasse e servizi bancari, oppure cerca "Apple's Standard EULA" nella loro documentazione per sviluppatori).

### ⚠️ Rischio reale, non tecnico ma di business — verificalo di persona
- [ ] **Il PIN di sblocco sviluppatore** (`DEV_UNLOCK_CODE` in `client/src/App.jsx`) **sblocca realmente l'intero abbonamento a pagamento**, non solo strumenti interni — è una scelta deliberata già prevista nel codice ("un PIN che scegli tu, cambialo con qualsiasi sequenza preferisci"), utile per testare/mostrare l'app sul tuo dispositivo senza un vero acquisto. Ma se questo PIN venisse mai scoperto da altri e condiviso pubblicamente, chiunque potrebbe ottenere l'abbonamento gratis, aggirando l'intero modello di monetizzazione — ed è anche il tipo di "funzionalità nascosta non documentata" che le linee guida Apple vietano esplicitamente (Guideline 2.3.1) se mai notata in revisione. **Cambia il PIN di default prima di pubblicare** (è stato usato ripetutamente nei test di questa conversazione, quindi va considerato come già visto).

### Guideline 1.2 — Meccanismo di segnalazione per contenuto generato da IA
- [x] **Implementato**: ogni risposta della Conversazione IA ha ora un pulsante 🚩 "Segnala come inappropriata" accanto al pulsante di ascolto. Le segnalazioni si salvano localmente (testo, traduzione, timestamp) in `reported-ai-messages` — non c'è ancora un pannello di revisione dedicato, ma il meccanismo richiesto da Apple ("a mechanism to report offensive content") è presente e funzionante. Se in futuro il volume di utenti lo giustifica, questi dati locali possono essere sincronizzati con un vero sistema di moderazione lato server.

### Guideline 4.2 — Funzionalità minima (il motivo più comune di rifiuto per app basate su WebView)
Apple rifiuta sistematicamente le app che sembrano "solo un sito web incapsulato". Questa app è già ragionevolmente al sicuro perché:
- Non richiede connessione internet per le funzioni principali (lezioni, esercizi, ripetizione dilazionata — tutto offline)
- Usa funzionalità native reali: notifiche locali, microfono/riconoscimento vocale, storage su filesystem nativo
- Non è semplicemente una pagina web ridipinta: ha navigazione, animazioni e interazioni pensate per touch

Se il revisore dovesse comunque sollevare un dubbio su questo punto, la risposta pronta è: "The app works fully offline for all core learning content; network access is used only for the optional AI-generated content and premium voice features, both clearly optional and gated behind an active subscription" (già presente nelle note per il revisore sopra, ma utile ripeterlo in caso di appello).

### Metadati e schermata di presentazione
- [ ] **Ogni screenshot deve rappresentare fedelmente il comportamento reale dell'app** — non usare mockup con testo/funzionalità che non esistono davvero. Cattura schermate vere dall'app compilata, non render grafici.
- [ ] La descrizione non deve menzionare altre piattaforme ("disponibile anche su Android") nel testo per l'App Store, e viceversa
- [ ] Nessun riferimento a "beta" o "in sviluppo" nei metadati pubblici

### Account e cancellazione dati
- [ ] Dato che l'app **non richiede account**, la clausola Apple 5.1.1(v) (obbligo di permettere la cancellazione dell'account dall'interno dell'app) **non si applica** — ma se in futuro aggiungi un sistema di account, ricordati di implementarla da subito, è un motivo di rifiuto automatico.

### Google Play — Data Safety Form
Equivalente Android dell'etichetta privacy Apple già coperta sopra. Compila la sezione "Data safety" in Play Console con le stesse risposte della tabella "Etichetta privacy" qui sopra (nessuna raccolta dati collegata all'identità, nessun tracciamento pubblicitario, dati d'acquisto gestiti da RevenueCat/Play Billing).

### Target API level (solo Google Play)
- [ ] Verifica che `android/app/build.gradle` punti al `targetSdkVersion` più recente richiesto da Google al momento della pubblicazione (Google aggiorna questo requisito periodicamente — controlla la pagina "Target API level requirements" in Play Console prima di inviare, dato che questo progetto potrebbe essere stato generato prima dell'ultimo aggiornamento del requisito).

### App Tracking Transparency (solo iOS)
- [ ] Questa app **non necessita** del prompt ATT (`AppTrackingTransparency`) perché non fa alcun tracciamento cross-app o cross-sito — nessuna azione richiesta, ma se un revisore lo chiede, la risposta pronta è: "This app does not track users across apps or websites owned by other companies; no ATT prompt is needed."

---

## Rinforzo qualità/sicurezza/conformità — ulteriore giro di controlli

### ⚠️ Appena aggiunto, MA richiede un tuo passaggio manuale in Xcode
- [ ] **Privacy Manifest iOS** (`ios/App/App/PrivacyInfo.xcprivacy`): creato e già presente nella cartella del progetto, dichiara le "Required Reason API" usate dai plugin installati (Filesystem → timestamp file; Local Notifications/core Capacitor → UserDefaults). **Obbligatorio dal 2024**: senza questo file (o se non registrato nel target), App Store Connect **rifiuta automaticamente la build in fase di validazione**, prima ancora della revisione umana. Devi aprire il progetto in Xcode e trascinare il file nel target App (con "Copy items if needed" e la checkbox del target spuntata), se Xcode non lo rileva già automaticamente dalla cartella.

### ✅ Corretto direttamente nel codice/progetto
- [x] **Export compliance** (`ITSAppUsesNonExemptEncryption` in Info.plist): impostato a `false` (l'app usa solo HTTPS/TLS standard, nessuna crittografia proprietaria). Evita la domanda manuale che App Store Connect pone ad ogni singola submission se questa chiave manca.
- [x] **Rilevamento connessione più affidabile**: il plugin nativo `@capacitor/network` era installato ma mai usato — il codice si affidava solo a `navigator.onLine`, notoriamente inaffidabile dentro una WebView iOS/Android (spesso riporta "online" anche senza vera connettività). Ora l'app usa il plugin nativo quando disponibile, con lo stesso fallback di prima per l'anteprima/browser.

### Verificato, già a posto
- [x] Nessun `dangerouslySetInnerHTML`, `eval()` o `new Function()` nel codice — nessun vettore XSS di questo tipo.
- [x] Nessuna chiave/segreto hardcoded rilevato nel client o nel server.
- [x] `ErrorBoundary` React presente e correttamente montato attorno a tutta l'app (`main.jsx`) — un crash in un singolo componente non porta a schermo bianco, mostra un fallback a tema con rassicurazione sui progressi salvati.
- [x] Nessun `console.log` di debug residuo in `App.jsx`.
- [x] Permessi Android già minimali e giustificati (Internet, microfono, notifiche) — nessun permesso superfluo da segnalare in fase di revisione Google Play.
