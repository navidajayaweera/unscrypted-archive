#!/bin/sh
set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  ARCHIVE SYSTEM — PROTOCOL UNsCRYPTED  ║"
echo "╚══════════════════════════════════════╝"
echo ""

# ── Run migrations (safe to run every time) ──────────────────────
echo "[ARCHIVE] Applying database migrations..."
node_modules/.bin/prisma migrate deploy
echo "[ARCHIVE] Migrations OK"

# ── Seed only if DB is empty ─────────────────────────────────────
echo "[ARCHIVE] Checking seed status..."
ROW_COUNT=$(node -e "
const Database = require('better-sqlite3');
const path = process.env.DATABASE_URL.replace('file:./', '');
try {
  const db = new Database('/app/' + path);
  const r  = db.prepare('SELECT COUNT(*) as n FROM Tutorial').get();
  console.log(r.n);
  db.close();
} catch(e) {
  console.log('0');
}
")

if [ "$ROW_COUNT" = "0" ]; then
  echo "[ARCHIVE] Empty database — running seed..."
  node_modules/.bin/tsx prisma/seed.ts
  echo "[ARCHIVE] Seed complete"
else
  echo "[ARCHIVE] Database already has data ($ROW_COUNT tutorials) — skipping seed"
fi

# ── Start Next.js ─────────────────────────────────────────────────
echo "[ARCHIVE] Starting server on port ${PORT:-3000}..."
echo ""

exec node_modules/.bin/next start -p "${PORT:-3000}"
