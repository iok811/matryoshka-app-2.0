# Guida Google Play — differenze e passi specifici rispetto ad Apple

Questa guida presume che tu abbia già letto la guida App Store: qui copro **solo cosa cambia** per Google Play, non ripeto le parti identiche (contenuto, qualità, ecc.).

---

## La buona notizia: qui non serve un Mac

A differenza di Xcode, il progetto Android **si può compilare da Linux o Windows**. Il progetto è già stato creato e configurato in questo lavoro (cartella `android/` nel progetto) — ti manca solo l'ultimo passo pratico: scaricare Android Studio (o gli Android SDK command-line tools) sul tuo computer e lanciare la build da lì, dato che da questo ambiente di lavoro remoto non riesco a scaricare i tool Android (bloccati dalla rete disponibile qui, stesso tipo di limite di Xcode ma per un motivo diverso: qui manca l'accesso ai server Google, non manca un Mac).

**Cosa fare tu, in pratica:**
1. Installa [Android Studio](https://developer.android.com/studio) sul tuo computer (Windows, Mac o Linux — qui è più flessibile di Apple)
2. Apri la cartella `android/` del progetto con Android Studio
3. Lascia che scarichi da solo Gradle e l'SDK Android (la prima volta ci vuole qualche minuto)
4. Build → Generate Signed Bundle/APK

---

## 1. Account sviluppatore: molto più economico

| | Apple | Google |
|---|---|---|
| Costo | 99 $/anno | **25 $ una tantum** (mai più, per sempre) |
| Verifica identità | 24h-2 settimane | Di solito qualche ora, a volte giorni |

Iscriviti su [play.google.com/console/signup](https://play.google.com/console/signup).

---

## 2. Firma dell'app: un concetto che Apple non ha

Google richiede di **firmare digitalmente** ogni build con una chiave che generi tu (un "keystore"). A differenza di Apple (che gestisce i certificati per te tramite Xcode), qui la responsabilità è tua:

```bash
keytool -genkey -v -keystore matryoshka-release.keystore -alias matryoshka -keyalg RSA -keysize 2048 -validity 10000
```

**Conserva questo file e la password in un posto sicuro, con un backup.** Se lo perdi, non potrai più pubblicare aggiornamenti alla stessa app — dovresti creare una scheda completamente nuova, perdendo recensioni e cronologia. Google offre anche "Play App Signing" (Google gestisce la chiave di firma finale per te, tu tieni solo una chiave di upload) — **consigliato**, riduce il rischio di questo problema specifico.

---

## 3. Formato del pacchetto: AAB, non APK

Google richiede il formato **Android App Bundle (.aab)**, non il vecchio .apk, per le nuove pubblicazioni. Android Studio lo genera automaticamente con "Generate Signed Bundle" — non serve fare nulla di diverso, solo sapere che è quello il formato giusto da caricare.

---

## 4. "Data Safety" — l'equivalente Google dell'etichetta privacy di Apple

Stesso concetto, modulo diverso. In Play Console → **Politiche → Sicurezza dei dati**, dichiara (stessa logica di quanto già scritto per Apple):

| Categoria | Risposta per questa app |
|---|---|
| L'app raccoglie o condivide dati utente? | Sì (progressi salvati) |
| Tipo di dati | "Attività app" (progressi, cronologia esercizi) |
| I dati sono condivisi con terzi? | No, tranne il testo inviato a ElevenLabs se l'utente attiva volontariamente la voce premium (spiegalo comunque, per trasparenza) |
| I dati sono crittografati in transito? | Sì (HTTPS) |
| L'utente può richiedere la cancellazione? | Sì, tramite l'email di contatto nella Privacy Policy |

Usa lo stesso testo della Privacy Policy già scritta per Apple — l'URL richiesto è identico, va inserito anche qui.

---

## 5. Il rifiuto più comune su Google Play: permessi "non giustificati"

Google è molto attento se un permesso richiesto (es. `RECORD_AUDIO`) non è chiaramente collegato a una funzione visibile nell'app. Dato che il microfono serve **solo** per il controllo di pronuncia (una funzione reale e visibile), non c'è un problema di fondo — ma assicurati che la richiesta del permesso avvenga **quando l'utente preme il pulsante del microfono**, non all'apertura dell'app: è già così nel codice attuale, verificalo comunque al primo test su dispositivo reale.

---

## 6. Scheda Google Play — testi (puoi riusare quasi tutto da Apple)

- **Titolo**: stesso di Apple, ma Google permette fino a 50 caratteri (più margine di Apple)
- **Descrizione breve** (80 caratteri): "Il corso di russo pensato per chi parla italiano — dall'A1 al C2"
- **Descrizione completa** (4000 caratteri): stessa descrizione già scritta per Apple, funziona identica qui
- **Categoria**: Istruzione
- **Screenshot**: dimensioni diverse da Apple — Google li genera automaticamente da un dispositivo/emulatore Android quando fai lo screenshot da lì, non serve prepararli a dimensioni fisse come su Apple

---

## 7. Revisione: più veloce, ma occhio ai controlli automatici

La revisione umana di Google è tipicamente **più rapida** di Apple (spesso poche ore per un primo invio, a volte fino a un paio di giorni), ma il primo controllo è **automatizzato**: se il target API level è troppo basso, o mancano dichiarazioni sui permessi, viene bloccato *prima* che un umano la guardi — è già tutto a posto in questo progetto (target API 36, permessi dichiarati), ma vale la pena saperlo.

---

## Riepilogo: cosa è già pronto, cosa manca

| Cosa | Stato |
|---|---|
| Progetto Android (Capacitor) creato e sincronizzato | ✅ Fatto |
| Permessi (microfono, notifiche) dichiarati nel manifest | ✅ Fatto |
| Gestione del permesso microfono nella WebView (necessaria solo su Android) | ✅ Fatto |
| Icone adattive (tutte le densità) | ✅ Fatto |
| Splash screen (chiaro/scuro, tutte le densità) | ✅ Fatto |
| Target API level 36 (già conforme al nuovo requisito 2026) | ✅ Fatto |
| Compilazione vera del bundle .aab | ❌ Richiede Android Studio sul tuo computer |
| Keystore di firma | ❌ Da generare tu, con backup sicuro |
| Account Google Play Console | ❌ Da creare (25 $ una tantum) |
| Modulo "Sicurezza dei dati" in Play Console | ❌ Da compilare (guida sopra, riusa il testo della Privacy Policy) |
| Test su un dispositivo Android reale | ❌ Da fare |
