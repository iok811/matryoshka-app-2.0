import express from "express";

const router = express.Router();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

router.post("/claude", async (req, res) => {
  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: { message: "ANTHROPIC_API_KEY non configurata sul server (vedi .env)." } });
  }

  const { prompt, max_tokens } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: { message: "Campo 'prompt' mancante o non valido." } });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        // Nessun vincolo artificiale a 1000: puoi generare contenuti più lunghi in una sola chiamata.
        max_tokens: max_tokens && Number.isFinite(max_tokens) ? Math.min(max_tokens, 4096) : 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data.error || { message: `Errore HTTP ${upstream.status}` } });
    }
    res.json(data);
  } catch (e) {
    res.status(502).json({ error: { message: "Impossibile contattare l'API Anthropic: " + e.message } });
  }
});

export default router;
