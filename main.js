const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');
const os = require('os');
const { createServer, PORT } = require('./server');

// 1. Deshabilitar aceleración GPU para garantizar compatibilidad total en cualquier Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-software-rasterizer');

// 2. Control de instancia única: nunca permitir más de un Electron ejecutándose a la vez
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
  process.exit(0);
}

// 3. Ubicar la caché en TEMP para eliminar para siempre los errores de "Acceso denegado (0x5)"
try {
  const sessionDataPath = path.join(os.tmpdir(), 'hytale-bg-manager-data');
  app.setPath('userData', sessionDataPath);
} catch (e) {
  console.error('[Electron] Error al configurar userData path:', e);
}

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
    autoHideMenuBar: true,
  });

  Menu.setApplicationMenu(null);

  // Atajo F12 para diagnóstico en vivo
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Reintento automático si el servidor Express todavía estaba iniciando
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.warn(`[Electron] Reintentando carga de interfaz (${errorCode}: ${errorDescription})...`);
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
      }
    }, 1000);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('[Electron] Interfaz cargada y lista.');
  });

  // Cargar URL del servidor Express
  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.whenReady().then(() => {
  serverInstance = createServer(PORT, () => {
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  const doExit = () => {
    if (process.platform !== 'darwin') {
      app.quit();
      process.exit(0);
    }
  };

  if (serverInstance) {
    try {
      serverInstance.close(() => {
        doExit();
      });
    } catch (e) {
      doExit();
    }
    setTimeout(() => doExit(), 1500);
  } else {
    doExit();
  }
});
