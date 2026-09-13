import express from "express";

const router = express.Router();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Due voci multilingua premade di ElevenLabs, già verificate nel resto del progetto
// come compatibili con il russo tramite il modello eleven_multilingual_v2 (vedi
// ELEVENLABS_DEFAULT_VOICE in App.jsx, che usa la stessa voce femminile "Rachel").
// Se in futuro vuoi voci diverse, sostituisci semplicemente questi due ID — sono
// gli unici due punti da cambiare, il resto del codice non li presuppone fissi.
const NATIVE_VOICE_IDS = {
  female: "21m00Tcm4TlvDq8ikWAM", // "Rachel"
  male: "TxGEqnHWrfWFTfGW9XjX", // "Josh"
};

// Voce madrelingua inclusa nell'abbonamento: usa la chiave ElevenLabs del SERVER
// (mai quella dell'utente, mai esposta al client) — a differenza della "voce premium"
// esistente dove l'utente porta la propria chiave. Il controllo se l'utente ha
// davvero diritto a questa voce (abbonamento attivo) resta lato client tramite
// RevenueCat; qui il server si fida della richiesta ma non spende nulla se manca
// la chiave configurata, quindi il costo reale è comunque sotto il tuo controllo
// diretto (puoi anche mettere qui un controllo aggiuntivo lato server in futuro,
// es. verificando un token RevenueCat, se vuoi una seconda barriera).
router.post("/tts/native", async (req, res) => {
  if (!ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: { message: "ELEVENLABS_API_KEY non configurata sul server (vedi .env)." } });
  }
  const { text, gender } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: { message: "Campo 'text' mancante o non valido." } });
  }
  const voiceId = NATIVE_VOICE_IDS[gender === "male" ? "male" : "female"];
  try {
    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });
    if (!upstream.ok) {
      const errBody = await upstream.text().catch(() => "");
      return res.status(upstream.status).json({ error: { message: `Errore ElevenLabs (${upstream.status}): ${errBody.slice(0, 300)}` } });
    }
    res.setHeader("Content-Type", "audio/mpeg");
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (e) {
    res.status(502).json({ error: { message: "Impossibile contattare ElevenLabs: " + e.message } });
  }
});

// Voce premium con chiave PROPRIA dell'utente (non quella del server): a differenza
// di /tts/native sopra, qui la chiave e il Voice ID arrivano nel corpo della
// richiesta, inseriti dall'utente stesso nelle impostazioni dell'app.
//
// Questo endpoint esiste perché ElevenLabs non permette di chiamare la sua API
// direttamente dal browser: verificato che restituisce "blocked by CORS policy —
// no 'Access-Control-Allow-Origin' header", indipendentemente da chiave o voce
// usate. Il client faceva prima la chiamata direttamente a elevenlabs.io e
// falliva sempre con "Failed to fetch" — un problema strutturale del progetto,
// non una configurazione sbagliata dell'utente. Passando dal server (chiamata
// server-a-server, dove CORS non si applica) il problema sparisce.
//
// La chiave dell'utente transita per questo server ad ogni richiesta ma non
// viene mai salvata né loggata qui — solo inoltrata a ElevenLabs e scartata.
router.post("/tts/premium", async (req, res) => {
  const { text, apiKey, voiceId } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: { message: "Campo 'text' mancante o non valido." } });
  }
  if (!apiKey || typeof apiKey !== "string") {
    return res.status(400).json({ error: { message: "Chiave API ElevenLabs mancante." } });
  }
  const resolvedVoiceId = voiceId && typeof voiceId === "string" ? voiceId : NATIVE_VOICE_IDS.female;
  try {
    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.3, use_speaker_boost: true },
      }),
    });
    if (!upstream.ok) {
      const errBody = await upstream.text().catch(() => "");
      const msg = upstream.status === 401 ? "Chiave API non valida." : `Errore ElevenLabs (${upstream.status}): ${errBody.slice(0, 300)}`;
      return res.status(upstream.status).json({ error: { message: msg } });
    }
    res.setHeader("Content-Type", "audio/mpeg");
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (e) {
    res.status(502).json({ error: { message: "Impossibile contattare ElevenLabs: " + e.message } });
  }
});

export default router;
