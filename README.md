# 🎮 Hytale Main Menu Background Editor

Herramienta multiplataforma (Windows, Linux y macOS) para personalizar el fondo del menú principal de Hytale, controlar el personaje (**AvatarPreview**), la tarjeta de noticias (**NewsTilesCarousel**) y efectos visuales de partículas (VFX).

---

## 🚀 Cómo ejecutar (100% Código Fuente Abierto - 0% Falsos Positivos)

Para garantizar la máxima seguridad y compatibilidad total con **Linux**, **macOS** y **Windows**, la aplicación se ejecuta directamente desde el código fuente sin empaquetadores sospechosos ni ejecutables `.exe` sin firmar.

### 🐧 En Linux / 🍎 macOS:

1. **Requisito**: Tener instalado Node.js (v16 o superior).
   - **Ubuntu/Debian**: `sudo apt install nodejs npm`
   - **Arch Linux**: `sudo pacman -S nodejs npm`
   - **Fedora**: `sudo dnf install nodejs npm`

2. **Ejecutar**:
   Abre una terminal en la carpeta del proyecto y ejecuta:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   *Se abrirá automáticamente la interfaz web en tu navegador predeterminado (`http://127.0.0.1:4785`).*

---

### 🪟 En Windows:

1. **Requisito**: Tener instalado [Node.js](https://nodejs.org/).
2. Haz doble clic en `start.bat` o ejecuta en la consola:
   ```cmd
   start.bat
   ```

---

## 🔒 Seguridad y Privacidad

- **100% Transparente**: Todo el código fuente es visible en JavaScript plano (`server.js`, `client.js`).
- **Aislado en Localhost**: El servidor escucha exclusivamente en `127.0.0.1:4785` para evitar cualquier acceso remoto.
- **Sin Instaladores de Terceros**: Sin ejecutables comprimidos o empaquetados que disparen falsos positivos en VirusTotal.

---

## ✨ Características

- 🖼️ **Imágenes de Fondo**: Cambia la imagen principal y desenfocada (`BackgroundImages`).
- 🧍 **Control del Personaje (`HomePage.ui`)**: Oculta o mueve vertical/horizontalmente el modelo del Avatar.
- 📰 **Noticias Transparentes (`NewsTilesCarousel.ui`)**: Alterna visibilidad del panel de noticias.
- ✨ **Partículas VFX**: Añade o ajusta efectos 3D en pantalla.
