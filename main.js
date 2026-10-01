const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const { createServer } = require('./server');

const PORT = 4785;
let mainWindow = null;
let serverInstance = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 680,
    title: 'Hytale – Main Menu Background Editor',
    icon: path.join(__dirname, 'app.ico'),
    backgroundColor: '#0f1117',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Sin barra de menú — ventana limpia de app nativa
    autoHideMenuBar: true,
  });

  // Eliminar la barra de menú completamente en todas las plataformas
  Menu.setApplicationMenu(null);

  // Cargar la interfaz desde el servidor Express interno
  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);

  // Abrir links externos en el navegador del sistema, no dentro de la app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Iniciar servidor Express integrado, y cuando esté listo abrir la ventana
  serverInstance = createServer(PORT, () => {
    createWindow();
  });

  // En macOS, volver a abrir la ventana si se hace clic en el ícono del dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Cerrar el servidor Express al cerrar la app
app.on('window-all-closed', () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Servidor Express cerrado.');
    });
  }
  // En macOS la app sigue en el dock hasta que el usuario la cierra explícitamente
  if (process.platform !== 'darwin') app.quit();
});
