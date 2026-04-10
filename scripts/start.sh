#!/bin/sh

# Garante que o diretório do banco SQLite existe
if [ -n "$DATABASE_URL" ]; then
  DB_FILE=$(echo "$DATABASE_URL" | sed 's|^file:||')
  DB_DIR=$(dirname "$DB_FILE")
  mkdir -p "$DB_DIR"
  echo "→ Diretório do banco: $DB_DIR"
else
  echo "⚠ DATABASE_URL não definida — o banco de dados não funcionará"
fi

echo "→ Executando migrações Prisma (timeout 60s)..."
timeout 60 ./node_modules/.bin/prisma migrate deploy || echo "⚠ Migrações falharam ou excederam timeout — continuando inicialização"

echo "→ Iniciando Next.js na porta ${PORT:-3000}..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}"
