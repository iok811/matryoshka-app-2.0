import pg from "pg";

const { Pool } = pg;

const DB_CONFIGURED = !!process.env.DATABASE_URL;

if (!DB_CONFIGURED) {
  console.warn(
    "ATTENZIONE: DATABASE_URL non configurata — lo storage non funzionerà finché non la imposti. " +
      "Il server parte comunque, ma le richieste di storage risponderanno con un errore chiaro. Vedi .env.example."
  );
}

// Il pool viene creato solo se DATABASE_URL è presente: altrimenti pg tenterebbe
// comunque di connettersi a localhost:5432, facendo crashare il processo all'avvio
// (era questo il bug: il server non partiva mai senza un database configurato).
const pool = DB_CONFIGURED
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Neon (e la maggior parte dei Postgres gestiti in cloud) richiede SSL.
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
    })
  : null;

// Crea la tabella al primo avvio, se non esiste già — ma senza bloccare il boot del
// server né farlo crashare: se il database non è raggiungibile (credenziali sbagliate,
// problema di rete transitorio, ecc.) il server resta comunque in ascolto e riprova
// implicitamente alla prossima query reale.
let tableReady = false;
async function ensureTable() {
  if (tableReady || !pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS storage (
      user_id TEXT NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, key)
    );
  `);
  tableReady = true;
}
if (pool) {
  ensureTable().catch((e) => {
    console.error("Impossibile preparare la tabella storage all'avvio (si riproverà alla prossima richiesta):", e.message);
  });
}

function requireDb() {
  if (!pool) {
    throw new Error(
      "Database non configurato: manca la variabile d'ambiente DATABASE_URL. Vedi .env.example per come impostarla."
    );
  }
}

// Stesso contratto di prima (window.storage / la versione SQLite): get/set/delete/list.
// user_id è sempre "local" per un'app a singolo utente; se in futuro aggiungi
// account multipli, sostituiscilo con l'id dell'utente autenticato.
export async function storageGet(userId, key) {
  requireDb();
  await ensureTable();
  const { rows } = await pool.query(
    "SELECT value FROM storage WHERE user_id = $1 AND key = $2",
    [userId, key]
  );
  return rows[0] ? { key, value: rows[0].value } : null;
}

export async function storageSet(userId, key, value) {
  requireDb();
  await ensureTable();
  await pool.query(
    `INSERT INTO storage (user_id, key, value, updated_at) VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    [userId, key, value]
  );
  return { key, value };
}

export async function storageDelete(userId, key) {
  requireDb();
  await ensureTable();
  await pool.query("DELETE FROM storage WHERE user_id = $1 AND key = $2", [userId, key]);
  return { key, deleted: true };
}

export async function storageList(userId, prefix = "") {
  requireDb();
  await ensureTable();
  const { rows } = await pool.query(
    "SELECT key FROM storage WHERE user_id = $1 AND key LIKE $2",
    [userId, `${prefix}%`]
  );
  return { keys: rows.map((r) => r.key) };
}

export default pool;
