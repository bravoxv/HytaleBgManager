# 🎮 Hytale Main Menu Background Editor

Herramienta multiplataforma (**Windows**, **Linux** y **macOS**) para personalizar el fondo del menú principal de Hytale, controlar la posición y visibilidad del personaje (**AvatarPreview**), la tarjeta de noticias (**NewsTilesCarousel**), efectos visuales de partículas (VFX), y gestionar imágenes PNG personalizadas con copias de seguridad automáticas.

---

## ✨ Características Principales

- 🖼️ **Personalización del Fondo**: Cambia la imagen principal y la imagen desenfocada (`BackgroundImages`).
- 🗂️ **Carpeta de Imágenes Propia (Persistencia ante Actualizaciones)**: Guarda tus PNGs en tu propia carpeta externa; la aplicación los sincroniza con Hytale y permite aplicarlos o removerlos en un clic.
- 🧍 **Control del Personaje (`HomePage.ui`)**: Oculta o reposiciona libremente el modelo 3D del Avatar mediante controles deslizantes e numéricos (Top / Left).
- 📰 **Noticias Transparentes (`NewsTilesCarousel.ui`)**: Muestra u oculta el panel de noticias del menú principal.
- ✨ **Efectos de Partículas (VFX)**: Agrega, escala y ubica partículas 3D en los ejes X, Y y Z en tiempo real.
- 🔄 **Restauración y Respaldo Inteligente**: Restaura los archivos originales del juego antes de actualizar para evitar que el launcher marque errores de validación.
- 🌐 **Soporte Multilingüe (i18n)**: Interfaz completa en **Español**, **Inglés** y **Portugués**.
- ⬆️ **Auto-Actualizador Integrado**: Notificación y aplicación de actualizaciones directamente desde GitHub.

---

## 🚀 Cómo ejecutar (100% Código Fuente Abierto - 0% Falsos Positivos)

Para garantizar la máxima seguridad y compatibilidad total con **Linux**, **macOS** y **Windows**, la aplicación se ejecuta directamente desde el código fuente sin empaquetadores sospechosos ni binarios `.exe` cerrados.

### 🪟 En Windows:

1. **Requisito**: Tener instalado [Node.js](https://nodejs.org/) (v16 o superior).
2. Haz doble clic en **`start.bat`**.
   - El script comprobará las dependencias necesarias (`node_modules`) y arrancará la aplicación mediante Electron.
   - Podrás visualizar el registro de inicio y detalles en la consola mientras se abre la ventana.

---

### 🐧 En Linux / 🍎 macOS:

1. **Requisito**: Tener instalado Node.js (v16 o superior).
   - **Ubuntu/Debian**: `sudo apt install nodejs npm`
   - **Arch Linux**: `sudo pacman -S nodejs npm`
   - **Fedora**: `sudo dnf install nodejs npm`
   - **macOS** (Homebrew): `brew install node` (o descargar el instalador oficial).

2. **Ejecutar**:
   Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   - El script verificará Node.js, instalará las dependencias si faltan y lanzará la aplicación con `npm start`.

---

## 🔒 Seguridad y Privacidad

- **100% Transparente**: Todo el código fuente es visible en JavaScript plano (`server.js`, `client.js`, `main.js`).
- **Aislado en Localhost**: El servidor local escucha exclusivamente en `127.0.0.1:4785` para evitar accesos externos.
- **Sin binarios opacos ni empaquetadores de terceros**.
