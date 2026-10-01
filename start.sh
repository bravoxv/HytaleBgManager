#!/bin/bash

# Hytale Background Manager - Lanzador para Linux / macOS

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Instálalo ejecutando:"
    echo "  Ubuntu/Debian: sudo apt install nodejs npm"
    echo "  Arch Linux:    sudo pacman -S nodejs npm"
    echo "  Fedora:        sudo dnf install nodejs npm"
    exit 1
fi

# Instalar dependencias silenciosamente si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias de Node.js..."
    npm install --only=production
fi

# Crear acceso directo .desktop en el Escritorio de Linux si existe el directorio
DESKTOP_DIR="$HOME/Desktop"
if [ ! -d "$DESKTOP_DIR" ] && [ -d "$HOME/Escritorio" ]; then
    DESKTOP_DIR="$HOME/Escritorio"
fi

if [ -d "$DESKTOP_DIR" ]; then
    SHORTCUT_FILE="$DESKTOP_DIR/HytaleBgManager.desktop"
    cat <<EOF > "$SHORTCUT_FILE"
[Desktop Entry]
Version=1.0
Type=Application
Name=Hytale BG Manager
Comment=Personalizador del menú principal de Hytale
Exec=/bin/bash "$SCRIPT_DIR/start.sh"
Path=$SCRIPT_DIR
Terminal=false
Categories=Game;Utility;
EOF
    chmod +x "$SHORTCUT_FILE"
    # Marcar como ejecutable de confianza en entornos GNOME/KDE si es posible
    gio set "$SHORTCUT_FILE" metadata::trusted true 2>/dev/null || true
fi

# Iniciar servidor Node.js en segundo plano desvinculado de la terminal (nohup)
nohup node server.js >/dev/null 2>&1 &

echo "🚀 Hytale BG Manager iniciado en segundo plano."
