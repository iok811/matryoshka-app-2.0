import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import claudeRouter from "./claude.js";
import ttsRouter from "./tts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// In produzione, servi il frontend dallo stesso dominio: niente CORS da configurare.
// In sviluppo (Vite su un'altra porta), permetti richieste cross-origin dal dev server.
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// NOTA: le vecchie rotte /api/storage sono state rimosse. I progressi utente ora
// vivono sul dispositivo (Filesystem su Capacitor nativo, localStorage nel browser),
// mai sul server — sia per restare coerenti con quanto dichiarato al revisore Apple
// (offline-capable, dati locali), sia perché la versione precedente salvava tutti
// gli utenti sotto un unico USER_ID="local", facendo collidere i dati di persone
// diverse in produzione. Questo server resta solo il proxy per le chiamate Claude
// (generazione di pacchetti/lezioni IA), l'unica funzione che ha davvero bisogno
// di un server.
app.use("/api", claudeRouter);
app.use("/api", ttsRouter);

// Serve il frontend compilato (dopo `npm run build` nella cartella client)
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Matryoshka server in ascolto su http://localhost:${PORT}`);
});
// Alcune generazioni IA (specialmente lezioni complete) possono richiedere più
// tempo: estendiamo il timeout del server oltre il default di Node (2 minuti
// invece di ~poche decine di secondi) per non tagliare richieste legittime.
server.timeout = 120000;
server.headersTimeout = 125000;
