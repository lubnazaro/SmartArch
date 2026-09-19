#!/usr/bin/env bash
set -euo pipefail

DATA_DIR="${DATA_DIR:-/data}"
mkdir -p "$DATA_DIR/uploads" public/uploads

# Persist uploads on the volume
if [ ! -L public/uploads ] && [ -d public/uploads ]; then
  # Copy any baked-in files once, then prefer the volume
  cp -n public/uploads/.gitignore "$DATA_DIR/uploads/" 2>/dev/null || true
fi
rm -rf public/uploads
ln -sfn "$DATA_DIR/uploads" public/uploads

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
