import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

/* ------------------------------------------------------------------ *
 * Shared entries store, backed by Neon Postgres.
 * This is the ONE source of truth both Till & Nicola read from, so the
 * app stays in sync across their two phones.
 *
 *   GET    /api/entries          -> all entries (newest first)
 *   POST   /api/entries          -> create { id, user, category, note, createdAt }
 *   DELETE /api/entries?id=...    -> remove one
 * ------------------------------------------------------------------ */

const USERS = new Set(["till", "nicola"]);
const CATEGORIES = new Set([
  "grow",
  "health",
  "creative",
  "connect",
  "peaceful",
]);

const connectionString = process.env.DATABASE_URL;
const sql = connectionString ? neon(connectionString) : null;

let tableReady: Promise<void> | null = null;
function ensureTable() {
  if (!sql) throw new Error("DATABASE_URL is not configured");
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS entries (
          id          text PRIMARY KEY,
          user_id     text NOT NULL,
          category    text NOT NULL,
          note        text NOT NULL,
          created_at  bigint NOT NULL
        )
      `;
    })().catch((e) => {
      tableReady = null; // allow a retry on the next request
      throw e;
    });
  }
  return tableReady;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  try {
    await ensureTable();

    if (req.method === "GET") {
      const rows = (await sql!`
        SELECT id, user_id, category, note, created_at
        FROM entries
        ORDER BY created_at DESC
        LIMIT 1000
      `) as Array<Record<string, unknown>>;

      res.status(200).json(
        rows.map((r) => ({
          id: r.id,
          user: r.user_id,
          category: r.category,
          note: r.note,
          createdAt: Number(r.created_at),
        })),
      );
      return;
    }

    if (req.method === "POST") {
      const body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {};
      const id = String(body.id ?? "").slice(0, 64);
      const user = String(body.user ?? "");
      const category = String(body.category ?? "");
      const note = String(body.note ?? "").trim().slice(0, 280);
      const createdAt = Number(body.createdAt) || Date.now();

      if (!id || !USERS.has(user) || !CATEGORIES.has(category) || !note) {
        res.status(400).json({ error: "Invalid entry" });
        return;
      }

      await sql!`
        INSERT INTO entries (id, user_id, category, note, created_at)
        VALUES (${id}, ${user}, ${category}, ${note}, ${createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
      res.status(201).json({ id, user, category, note, createdAt });
      return;
    }

    if (req.method === "DELETE") {
      const id = String(req.query.id ?? "");
      if (!id) {
        res.status(400).json({ error: "Missing id" });
        return;
      }
      await sql!`DELETE FROM entries WHERE id = ${id}`;
      res.status(200).json({ ok: true });
      return;
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[api/entries]", err);
    res.status(500).json({ error: "Server error" });
  }
}
