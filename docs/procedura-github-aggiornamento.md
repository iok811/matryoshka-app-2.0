# Procedura GitHub — aggiornare l'app già online

Due parti diverse dell'app si aggiornano in modo diverso: il **backend**
(`server/`, già deployato da qualche parte tipo Render) si aggiorna
automaticamente ad ogni push, una volta collegato. L'**app mobile**
(quella su App Store/Google Play) no — GitHub non pubblica mai
automaticamente su Apple o Google, serve sempre un passaggio manuale.
Questo documento copre entrambe.

## Se non hai ancora un repository GitHub per questo progetto

1. Su github.com, crea un nuovo repository (può restare privato).
2. Dalla cartella `matryoshka-app/` (quella con `client/`, `server/`,
   `docs/`), esegui:
   ```
   git init
   git add .
   git commit -m "Prima versione"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/NOME-REPO.git
   git push -u origin main
   ```
3. Il file `.gitignore` già presente esclude `node_modules/`, `dist/`,
   `.env` e le cartelle generate di iOS/Android — non li vedrai nel
   repository, ed è corretto così: sono file pesanti che si rigenerano da
   soli (`npm install`, `npx vite build`, `npx cap sync`).

## Se il repository esiste già (caso più probabile se l'app è "già là")

Prima di modificare qualunque cosa, assicurati di avere l'ultima versione:
```
git pull
```

## Flusso per aggiornare il backend (server/)

Se il backend è collegato a un servizio con deploy automatico (Render,
Railway, Fly.io e simili funzionano tutti allo stesso modo): quel
servizio è configurato per "ascoltare" un branch del tuo repository
(di solito `main`) e ricostruire da solo ad ogni push su quel branch.

1. Modifica i file dentro `server/`.
2. ```
   git add server/
   git commit -m "Descrizione della modifica"
   git push
   ```
3. Il servizio di hosting rileva il push e ricostruisce da solo — di
   solito ci vogliono da 1 a 5 minuti. Controlla il pannello del
   servizio (es. la dashboard di Render) per vedere il log del deploy
   e confermare che sia andato a buon fine, non solo che il push sia
   partito.

**Nota importante**: se non hai ancora collegato il repository al
servizio di hosting, quel collegamento va fatto una volta sola dal
pannello del servizio stesso (di solito una voce "Connect repository"
o simile) — non è qualcosa che si fa da riga di comando.

## Flusso per aggiornare l'app mobile (client/)

Qui non esiste un "push e si aggiorna da solo" — un aggiornamento reale
sull'app che gli utenti hanno installato richiede sempre:

1. Modifica i file dentro `client/src/`.
2. ```
   git add client/
   git commit -m "Descrizione della modifica"
   git push
   ```
   Questo salva la modifica su GitHub, ma **non** la porta agli utenti.
3. Sul tuo computer (o dove hai Xcode/Android Studio installati):
   ```
   git pull
   cd client
   npm install
   npx vite build
   npx cap sync
   ```
4. Apri il progetto nativo (`npx cap open ios` o `npx cap open android`)
   e da lì crea una nuova build, aumenta il numero di versione, e invia
   l'aggiornamento tramite App Store Connect / Google Play Console —
   esattamente come la prima pubblicazione, non è mai automatico.

## Cosa NON serve rifare ad ogni aggiornamento

- Le chiavi/segnaposto già configurati (`API_BASE`, RevenueCat, Termini/
  Privacy) restano validi tra un aggiornamento e l'altro — non vanno
  reinseriti, a meno che tu non li stia specificamente cambiando.
- Il Privacy Manifest (`PrivacyInfo.xcprivacy`) va ricontrollato solo se
  l'aggiornamento introduce un nuovo permesso di sistema o una nuova
  libreria che ne richiede uno (vedi `docs/note-revisore-e-permessi.md`).

## Prima di ogni push, dalla cartella `client/`

```
npx vite build
cd ../tests && node data-integrity-test.mjs && node ui-smoke-test.mjs
```
Se uno dei due fallisce, il problema va risolto prima del push — non
dopo.
