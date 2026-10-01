#!/usr/bin/env bash
# Hytale BG Manager — Lanzador Linux / macOS
set -e
cd "$(dirname "$0")"

# Comprobar si Node.js y npm estan instalados
if ! command -v npm &> /dev/null; then
    echo ""
    echo "========================================================"
    echo "AVISO: Node.js / npm no esta instalado en este sistema."
    echo "Hytale BG Manager lo necesita para poder funcionar."
    echo "========================================================"
    echo ""
    read -p "Deseas descargar e instalar Node.js ahora mismo? (s/n): " choice
    case "$choice" in 
      s|S|y|Y )
        echo ""
        echo "Instalando Node.js..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS: Homebrew
            if command -v brew &> /dev/null; then
                brew install node
            else
                echo "Descargando instalador de Node.js para macOS..."
                curl -o node_pkg.pkg https://nodejs.org/dist/v20.18.0/node-v20.18.0.pkg
                sudo installer -pkg node_pkg.pkg -target /
                rm -f node_pkg.pkg
            fi
        else
            # Linux: Deteccion de gestor de paquetes
            if command -v apt-get &> /dev/null; then
                echo "Usando apt..."
                sudo apt-get update && sudo apt-get install -y nodejs npm
            elif command -v dnf &> /dev/null; then
                echo "Usando dnf..."
                sudo dnf install -y nodejs npm
            elif command -v pacman &> /dev/null; then
                echo "Usando pacman..."
                sudo pacman -Sy --noconfirm nodejs npm
            elif command -v zypper &> /dev/null; then
                echo "Usando zypper..."
                sudo zypper install -y nodejs npm
            else
                echo "No se detecto un gestor de paquetes soportado automaticamente."
                echo "Por favor instala Node.js manualmente desde: https://nodejs.org/"
                exit 1
            fi
        fi
        ;;
      * )
        echo "Operacion cancelada."
        exit 1
        ;;
    esac
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
fi

npm start
