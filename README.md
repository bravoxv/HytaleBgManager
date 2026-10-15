# 🎮 Hytale Main Menu Background Editor

Herramienta multiplataforma (**Windows**, **Linux** y **macOS**) para personalizar el fondo del menú principal de Hytale, controlar la posición y visibilidad del personaje (**AvatarPreview**), la tarjeta de noticias (**NewsTilesCarousel**), efectos visuales de partículas (VFX) con vista previa interactiva, y gestionar imágenes PNG personalizadas con copias de seguridad automáticas y sistema de perfiles.

---

## ✨ Características Principales

- 🖼️ **Personalización del Fondo**: Cambia la imagen principal y la imagen desenfocada (`BackgroundImages`).
- 👁️ **Vista Previa Interactiva en Tiempo Real**:
  - Visualiza cómo se verá el fondo y la superposición de partículas.
  - **Arrastre interactivo**: Mueve cualquier partícula directamente sobre el lienzo usando el ratón.
  - **Paneles redimensionables**: Ajusta el ancho de la barra lateral del inspector y la altura de la lista de partículas arrastrando los divisores.
  - Inspector detallado con sliders de precisión para X, Y, Z (profundidad) y Escala.
- 🗂️ **Gestión de Texturas y Persistencia**: Guarda tus PNGs en tu propia carpeta externa; la aplicación los sincroniza con Hytale y permite aplicarlos o removerlos en un clic.
- 🧍 **Control del Personaje (`HomePage.ui`)**: Oculta o reposiciona libremente el modelo 3D del Avatar mediante controles deslizantes y numéricos (Top / Left).
- 📰 **Noticias Transparentes (`NewsTilesCarousel.ui`)**: Muestra u oculta el panel de noticias del menú principal.
- 💾 **Sistema de Perfiles Seguro**:
  - Respaldo de la configuración oficial limpia del juego (*Original*).
  - Perfil personalizado (*Custom*) con todas tus configuraciones listas para aplicar o restaurar.
- 🔄 **Restauración y Respaldo Inteligente**: Restaura los archivos originales del juego antes de actualizar para evitar que el launcher marque errores de validación.
- 🌐 **Soporte Multilingüe (i18n)**: Interfaz completa en **Español**, **Inglés** y **Portugués**.
- ⬆️ **Auto-Actualizador Integrado**: Notificación y comprobación de nuevas versiones directamente desde GitHub.

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

- **100% Transparente**: Todo el código fuente es visible en JavaScript plano ([`server.js`](file:///c:/Users/Administrator/HytaleBgManager/server.js), [`client.js`](file:///c:/Users/Administrator/HytaleBgManager/public/client.js), [`main.js`](file:///c:/Users/Administrator/HytaleBgManager/main.js)).
- **Aislado en Localhost**: El servidor local escucha exclusivamente en `127.0.0.1:4785` para evitar accesos externos.
- **Sin binarios opacos ni empaquetadores de terceros**.
