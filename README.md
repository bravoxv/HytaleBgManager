# 🎮 Hytale Main Menu Background Editor

Herramienta multiplataforma (**Windows**, **Linux** y **macOS**) para personalizar el fondo del menú principal de Hytale, controlar el personaje (**AvatarPreview**), la tarjeta de noticias (**NewsTilesCarousel**) y efectos visuales de partículas (VFX).

---

## 🚀 Cómo ejecutar (100% Código Fuente Abierto - 0% Falsos Positivos)

Para garantizar la máxima seguridad y compatibilidad total con **Linux**, **macOS** y **Windows**, la aplicación se ejecuta directamente desde el código fuente sin empaquetadores sospechosos ni binarios `.exe` sin firmar.

### 🪟 En Windows:

1. **Requisito**: Tener instalado [Node.js](https://nodejs.org/) (v16 o superior). Si no está instalado, el script intentará ayudarte a descargarlo/instalarlo automáticamente.
2. Haz doble clic en **`start.bat`**.
   - El script comprobará las dependencias necesarias (`node_modules`) y arrancará la aplicación mediante Electron en primer plano.
   - Podrás visualizar el registro de inicio y los detalles en la consola mientras se abre la ventana de la aplicación.

---

### 🐧 En Linux / 🍎 macOS:

1. **Requisito**: Tener instalado Node.js (v16 o superior).
   - **Ubuntu/Debian**: `sudo apt install nodejs npm`
   - **Arch Linux**: `sudo pacman -S nodejs npm`
   - **Fedora**: `sudo dnf install nodejs npm`
   - **macOS** (Homebrew): `brew install node` (o descargar el instalador `.pkg` oficial).

2. **Ejecutar**:
   Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   - El script verificará Node.js, instalará las dependencias si faltan y lanzará la aplicación con `npm start`.
   - Se abrirá la interfaz de la aplicación y la consola permanecerá activa mostrando los logs del proceso.

---

## 🔒 Seguridad y Privacidad

- **100% Transparente**: Todo el código fuente es visible en JavaScript plano (`server.js`, `client.js`).
- **Aislado en Localhost**: El servidor escucha exclusivamente en `127.0.0.1:4785` para evitar cualquier acceso remoto.
- **Sin falsos positivos**: Cero binarios de terceros empaquetados.

---

## ✨ Características

- 🖼️ **Imágenes de Fondo**: Cambia la imagen principal y desenfocada (`BackgroundImages`).
- 🧍 **Control del Personaje (`HomePage.ui`)**: Oculta o mueve vertical/horizontalmente el modelo del Avatar.
- 📰 **Noticias Transparentes (`NewsTilesCarousel.ui`)**: Alterna visibilidad del panel de noticias.
- ✨ **Partículas VFX**: Añade o ajusta efectos 3D en pantalla.
