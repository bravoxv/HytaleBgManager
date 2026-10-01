#!/bin/bash

# Hytale Background Manager - Script de inicio para Linux / macOS

# Ir al directorio del script
cd "$(dirname "$0")"

echo "🎮 Iniciando Hytale BG Manager..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado en este sistema."
    echo "Por favor instálalo ejecutando en tu terminal:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Arch Linux:    sudo pacman -S nodejs npm"
    echo "  Fedora:        sudo dnf install nodejs"
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Node.js..."
    npm install --only=production
fi

# Iniciar el servidor
node server.js
