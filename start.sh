#!/usr/bin/env bash
# Hytale BG Manager — Lanzador Linux / macOS
set -e
cd "$(dirname "$0")"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
fi

npm start
