#!/usr/bin/env bash
set -euo pipefail

DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR/uploads" public

# Persist uploads on the volume. The app writes to $DATA_DIR/uploads and
# serves via /uploads/[...path] (Next does not pick up new public/ files
# after boot). Keep the public/uploads symlink for local tooling / fallback.
if [ ! -L public/uploads ] && [ -d public/uploads ]; then
  cp -n public/uploads/.gitignore "$DATA_DIR/uploads/" 2>/dev/null || true
  # Migrate any files that landed in the image layer before the volume link
  cp -an public/uploads/. "$DATA_DIR/uploads/" 2>/dev/null || true
fi
rm -rf public/uploads
ln -sfn "$DATA_DIR/uploads" public/uploads
export DATA_DIR

export DATABASE_URL="${DATABASE_URL:-file:${DATA_DIR}/smartarch.db}"
export AUTH_URL="${AUTH_URL:-http://127.0.0.1:3847}"
export NEXTAUTH_URL="${NEXTAUTH_URL:-$AUTH_URL}"

if [ -z "${AUTH_SECRET:-}" ]; then
  echo "AUTH_SECRET is required in production."
  exit 1
fi

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding defaults (safe to re-run)..."
npx tsx prisma/seed.ts

echo "Starting Smart Arch on port ${PORT:-3847}..."
exec node server.js
