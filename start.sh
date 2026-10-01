#!/usr/bin/env bash
# Hytale BG Manager — Lanzador Linux / macOS
cd "$(dirname "$0")"

APP_PORT=4785

# ──────────────────────────────────────────────────────────────────────────────
# Deteccion de WSL 1 (Electron no soporta WSL 1 — sin display grafico)
# ──────────────────────────────────────────────────────────────────────────────
IS_WSL=0
WSL_VERSION=0
if grep -qi microsoft /proc/version 2>/dev/null; then
    IS_WSL=1
    if uname -r 2>/dev/null | grep -qi "WSL2\|microsoft.*wsl2" || \
       grep -qi "WSL2" /proc/version 2>/dev/null || \
       [ -e /run/WSL ]; then
        WSL_VERSION=2
    else
        WSL_VERSION=1
    fi
fi

if [ "$WSL_VERSION" -eq 1 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║  ⚠  WSL 1 detectado — Electron no tiene soporte grafico   ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║                                                            ║"
    echo "║  [1] Abrir en el navegador de Windows  (recomendado)      ║"
    echo "║      La app funciona igual: editar fondos, VFX, avatares  ║"
    echo "║      Solo el boton 'Abrir Carpeta' no estara disponible.  ║"
    echo "║                                                            ║"
    echo "║  [2] Actualizar a WSL 2  (requiere reiniciar)             ║"
    echo "║      Ver instrucciones y cerrar este script.              ║"
    echo "║                                                            ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    read -p "  Elige una opcion [1/2]: " wsl_choice

    case "$wsl_choice" in
        2)
            echo ""
            echo "════════════════════════════════════════════════════════════"
            echo "  Para actualizar WSL 1 a WSL 2:"
            echo "  Abre PowerShell en Windows como Administrador y ejecuta:"
            echo ""
            echo "      wsl --set-version Ubuntu 2"
            echo ""
            echo "  Luego reinicia Ubuntu y vuelve a ejecutar ./start.sh"
            echo "════════════════════════════════════════════════════════════"
            echo ""
            exit 0
            ;;
        *)
            # Opcion 1 (o cualquier otra tecla): modo navegador
            echo ""
            echo "  Iniciando servidor en http://localhost:${APP_PORT} ..."
            echo ""

            # Instalar dependencias si faltan (sin set -e para no abortar)
            if [ ! -d "node_modules" ]; then
                echo "  Instalando dependencias, espera..."
                npm install
            fi

            # Lanzar el servidor Express en segundo plano
            node -e "require('./server').createServer(${APP_PORT}, () => {
                console.log('Servidor listo en http://localhost:${APP_PORT}');
            });" &
            SERVER_PID=$!

            # Esperar a que el servidor arranque
            echo "  Esperando que el servidor arranque..."
            for i in $(seq 1 15); do
                sleep 1
                if curl -sf "http://localhost:${APP_PORT}" > /dev/null 2>&1; then
                    break
                fi
            done

            # Abrir el navegador de Windows desde WSL
            echo "  Abriendo navegador..."
            if cmd.exe /c start "http://localhost:${APP_PORT}" 2>/dev/null; then
                echo "  Navegador abierto."
            else
                # Fallback: explorer.exe
                explorer.exe "http://localhost:${APP_PORT}" 2>/dev/null || true
                echo "  Si no se abrio, ve manualmente a: http://localhost:${APP_PORT}"
            fi

            echo ""
            echo "  App corriendo en http://localhost:${APP_PORT}"
            echo "  Presiona Ctrl+C para cerrar el servidor."
            echo ""

            # Esperar a que el servidor termine
            wait $SERVER_PID
            exit 0
            ;;
    esac
fi

# ──────────────────────────────────────────────────────────────────────────────
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

# Comprobar version minima de Node.js (v16+)
if command -v node &> /dev/null; then
    NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        echo ""
        echo "========================================================"
        echo "ERROR: Se requiere Node.js v16 o superior."
        echo "Version actual detectada: $(node -v)"
        echo "Por favor actualiza Node.js desde: https://nodejs.org/"
        echo "========================================================"
        echo ""
        exit 1
    fi
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
fi

npm start
