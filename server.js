const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = 4785;

// Resultado del chequeo de versión al arrancar (accesible via /api/startup-status)
let _startupCheckResult = null;

// Chequeo de versión al arrancar el servidor: se llama una sola vez cuando Express está listo.
// Detecta actualizaciones del juego ANTES de que el usuario abra el navegador.
function startupVersionCheck() {
  try {
    console.log('[Startup] Iniciando chequeo de versiones...');

    // 1. Migrar hashes viejos: el algoritmo de hash cambió (antes usaba los archivos
    //    gestionados, ahora usa la carpeta del juego). Si hay hashes guardados con el
    //    método anterior, limpiarlos para que en esta corrida se registren correctamente.
    const cfg = loadConfig();
    if (cfg._hashAlgorithmVersion !== 2) {
      console.log('[Startup] Migrando hashes de versión anterior (algoritmo v1 -> v2)...');
      saveConfig({ lastKnownVersionHashes: {}, _hashAlgorithmVersion: 2 });
    }

    // 2. Obtener todas las versiones disponibles y chequear cada una
    const versions = getVersions();
    const results = {};
    for (const ver of versions) {
      try {
        const r = checkAndHandleVersionUpdate(ver);
        results[ver] = r;
        if (r.updated) {
          console.log(`[Startup] ¡Actualización detectada en ${ver}! Personalizaciones reaplicadas: ${r.reapplied}`);
        } else if (r.firstRun) {
          console.log(`[Startup] Primera detección de ${ver}: hash registrado y backups guardados.`);
        } else if (r.detected) {
          console.log(`[Startup] Versión ${ver}: sin cambios detectados.`);
        } else {
          console.log(`[Startup] Versión ${ver}: archivos no accesibles (${r.reason || 'sin ruta válida'}).`);
        }
      } catch (e) {
        console.error(`[Startup] Error al chequear versión ${ver}:`, e);
        results[ver] = { detected: false, error: e.message };
      }
    }

    _startupCheckResult = {
      checkedAt: new Date().toISOString(),
      versions: results,
      updatesDetected: Object.values(results).some(r => r.updated)
    };
    console.log('[Startup] Chequeo completado.', _startupCheckResult);
  } catch (e) {
    console.error('[Startup] Error general en startupVersionCheck:', e);
    _startupCheckResult = { error: e.message, checkedAt: new Date().toISOString() };
  }
}

// Exportar función para que Electron la use como servidor integrado
function createServer(port, onReady) {
  const p = port || PORT;
  return app.listen(p, '127.0.0.1', () => {
    console.log(`Servidor Express iniciado en http://127.0.0.1:${p}`);
    // Ejecutar chequeo de versión ANTES de abrir la ventana del navegador
    startupVersionCheck();
    if (typeof onReady === 'function') onReady();
  });
}

module.exports = { createServer, startupVersionCheck };

const allowedOrigins = [`http://127.0.0.1:${PORT}`, `http://localhost:${PORT}`];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (mismo origen / navegadores / Electron) o en la lista permitida
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Acceso no permitido por política CORS'));
  }
}));
app.use(express.json());

const publicPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(process.cwd(), 'public');

app.use(express.static(publicPath));

app.get(['/', '/linux', '/windows'], (req, res) => {
  const filePath = path.join(publicPath, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('index.html no encontrado');
  }
});

// Endpoint de estado/ping (Electron gestiona el ciclo de vida de la app)
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
});

// Devuelve el resultado del chequeo de versión que ocurrió al arrancar el servidor.
// El cliente lo consulta una vez al cargar para saber si hubo actualizaciones detectadas
// antes de que el usuario abriera el navegador.
app.get('/api/startup-status', (req, res) => {
  res.json({ success: true, startup: _startupCheckResult });
});

const os = require('os');

function getConfigFile() {
  return path.join(__dirname, 'config.json');
}

function loadConfig() {
  try {
    const cfgPath = getConfigFile();
    if (fs.existsSync(cfgPath)) {
      return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error al leer config.json:', e);
  }
  return {};
}

function saveConfig(data) {
  try {
    const cfgPath = getConfigFile();
    const current = loadConfig();
    const merged = { ...current, ...data };
    fs.writeFileSync(cfgPath, JSON.stringify(merged, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error al guardar config.json:', e);
    return false;
  }
}

// ── Sistema de Respaldos de Originales y Detección Reactiva de Versión ───────
function getBackupsDir() {
  const dir = path.join(__dirname, 'backups');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Guarda una copia del archivo original sin modificar si aún no existe backup.
// Solo escribe UNA VEZ: si ya existe el .original, no lo pisa (protege el estado limpio del juego).
function ensureOriginalBackup(originalFilePath, identifier) {
  try {
    if (!originalFilePath || !fs.existsSync(originalFilePath)) return false;
    const bDir = getBackupsDir();
    const backupFile = path.join(bDir, `${identifier}.original`);
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(originalFilePath, backupFile);
      console.log(`[Backup] Original guardado: ${identifier}.original`);
      return true;
    }
    return false; // Ya existía, no se sobreescribió
  } catch (e) {
    console.error(`[Backup] Error al respaldar ${identifier}:`, e);
    return false;
  }
}

// Sobreescribe el backup con la versión actual del archivo (usar SOLO cuando el juego se actualiza,
// después de haber restaurado primero el archivo original).
function forceOriginalBackup(originalFilePath, identifier) {
  try {
    if (!originalFilePath || !fs.existsSync(originalFilePath)) return false;
    const bDir = getBackupsDir();
    const backupFile = path.join(bDir, `${identifier}.original`);
    fs.copyFileSync(originalFilePath, backupFile);
    console.log(`[Backup] Original actualizado (versión nueva del juego): ${identifier}.original`);
    return true;
  } catch (e) {
    console.error(`[Backup] Error al actualizar backup ${identifier}:`, e);
    return false;
  }
}

// Restaura un archivo a su copia original guardada (si existe).
function restoreFromBackup(identifier, targetFilePath) {
  try {
    const bDir = getBackupsDir();
    const backupFile = path.join(bDir, `${identifier}.original`);
    if (!fs.existsSync(backupFile)) return false;
    const dir = path.dirname(targetFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(backupFile, targetFilePath);
    console.log(`[Backup] Restaurado: ${identifier}.original -> ${targetFilePath}`);
    return true;
  } catch (e) {
    console.error(`[Backup] Error al restaurar ${identifier}:`, e);
    return false;
  }
}

// Calcula el hash de la CARPETA del juego (no de los archivos que nosotros modificamos).
// Hashea nombres + tamaños de los archivos directos de la carpeta Client/Data/Game/,
// excluyendo los archivos que HytaleBgManager modifica para evitar falsos positivos.
const MANAGED_FILES = new Set(['MainMenuBackgrounds.json', 'NewsTilesCarousel.ui', 'HomePage.ui']);

function computeGameVersionHash(paths) {
  try {
    // Estrategia 1: hashear el directorio que contiene los archivos del juego
    // usando archivos que NO modificamos nosotros.
    if (paths.jsonPath) {
      const gameDir = path.dirname(paths.jsonPath); // .../Client/Data/Game
      if (fs.existsSync(gameDir)) {
        const hash = crypto.createHash('sha256');
        let count = 0;
        try {
          const entries = fs.readdirSync(gameDir, { withFileTypes: true });
          for (const entry of entries) {
            if (MANAGED_FILES.has(entry.name)) continue; // Ignorar archivos que nosotros escribimos
            if (entry.isFile()) {
              const fpath = path.join(gameDir, entry.name);
              const stat = fs.statSync(fpath);
              hash.update(`${entry.name}:${stat.size}:${stat.mtimeMs}`);
              count++;
            } else if (entry.isDirectory()) {
              // Incluir subcarpetas (nombre + mtime) pero sin entrar recursivamente
              const stat = fs.statSync(path.join(gameDir, entry.name));
              hash.update(`dir:${entry.name}:${stat.mtimeMs}`);
              count++;
            }
          }
        } catch (e) { /* sin permisos: continuar */ }

        if (count > 0) {
          // También incluir el directorio Client/ padre como ancla de versión
          try {
            const clientDir = path.dirname(path.dirname(gameDir)); // .../Client
            if (fs.existsSync(clientDir)) {
              const cStat = fs.statSync(clientDir);
              hash.update(`client:${cStat.mtimeMs}`);
            }
          } catch (e) { /* ignorar */ }
          return hash.digest('hex').substring(0, 16);
        }
      }
    }

    // Estrategia 2 (fallback): hashear la carpeta raíz de la versión
    // usando solo el mtime de directorios de primer nivel.
    const dirsToCheck = [
      paths.jsonPath && path.dirname(path.dirname(path.dirname(paths.jsonPath))), // Client/
      paths.homePagePath && path.dirname(path.dirname(paths.homePagePath)),        // MainMenu/../
    ].filter(Boolean);

    for (const dir of dirsToCheck) {
      if (fs.existsSync(dir)) {
        const hash = crypto.createHash('sha256');
        const stat = fs.statSync(dir);
        hash.update(`${dir}:${stat.mtimeMs}`);
        return hash.digest('hex').substring(0, 16);
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

// Guarda la personalización elegida por el usuario por separado en config.json
function saveUserCustomization(version, customizationData) {
  const cfg = loadConfig();
  const customs = cfg.userCustomizations || {};
  customs[version] = {
    ...(customs[version] || {}),
    ...customizationData,
    updatedAt: new Date().toISOString()
  };
  saveConfig({ userCustomizations: customs });
}

// Re-aplica las configuraciones del usuario sobre los archivos del juego.
// PRE-CONDICIÓN: los archivos del juego ya deben estar en su estado original
// (sea porque nunca fueron modificados o porque se llamó restoreFromBackup antes).
function applyCustomizationToGame(version) {
  const cfg = loadConfig();
  const custom = (cfg.userCustomizations && cfg.userCustomizations[version]) || null;
  if (!custom) return { applied: false, reason: 'Sin personalización guardada' };

  const paths = getPathsForVersion(version);
  let changed = false;

  // 1. Re-aplicar MainMenuBackgrounds.json
  if (custom.bgConfig && paths.jsonPath) {
    try {
      const dir = path.dirname(paths.jsonPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(paths.jsonPath, JSON.stringify(custom.bgConfig, null, 2), 'utf8');
      changed = true;
    } catch (e) {
      console.error('[Sync] Error al aplicar bgConfig:', e);
    }
  }

  // 2. Re-aplicar News Carousel (.ui)
  if (custom.newsVisible !== undefined && paths.newsCarouselPath) {
    try {
      const dir = path.dirname(paths.newsCarouselPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const targetContent = custom.newsVisible ? DEFAULT_NEWS_UI : INVISIBLE_ZERO_NEWS_UI;
      fs.writeFileSync(paths.newsCarouselPath, targetContent, 'utf8');
      changed = true;
    } catch (e) {
      console.error('[Sync] Error al aplicar newsVisible:', e);
    }
  }

  // 3. Re-aplicar Avatar Preview (.ui): leer archivo limpio del juego y aplicar parche
  if (custom.avatarConfig && paths.homePagePath && fs.existsSync(paths.homePagePath)) {
    try {
      let content = fs.readFileSync(paths.homePagePath, 'utf8');
      const isVisible = custom.avatarConfig.visible !== false;
      const newTop = custom.avatarConfig.top ?? 320;
      const newLeft = custom.avatarConfig.left ?? 0;

      let newBlock = '';
      if (!isVisible) {
        newBlock = `PlayerPreviewComponent #AvatarPreview {\n  Visible: false;\n  Anchor: (Top: 0, Left: -9999, Width: 0, Height: 0);\n}`;
      } else {
        const leftStr = newLeft !== 0 ? `Left: ${newLeft}, ` : '';
        newBlock = `PlayerPreviewComponent #AvatarPreview {\n  Visible: true;\n  Anchor: (${leftStr}Top: ${newTop}, Width: 420, Height: 640);\n}`;
      }

      const regex = /PlayerPreviewComponent\s+#AvatarPreview\s*\{[\s\S]*?\}/;
      if (regex.test(content)) {
        content = content.replace(regex, newBlock);
      } else {
        content += `\n\n${newBlock}\n`;
      }
      fs.writeFileSync(paths.homePagePath, content, 'utf8');
      changed = true;
    } catch (e) {
      console.error('[Sync] Error al aplicar avatarConfig:', e);
    }
  }

  return { applied: changed };
}

// Chequeo Reactivo de versión del juego.
// Compara el hash de la CARPETA del juego (no de los archivos modificados) contra el último registrado.
// Si cambió → nueva versión real del juego detectada:
//   1. Restaurar archivos a su estado original guardado (para que el instalador no los vea corruptos)
//   2. Guardar nuevos backups de esos archivos limpios de la versión recién instalada
//   3. Re-aplicar la personalización del usuario sobre los nuevos archivos
function checkAndHandleVersionUpdate(version) {
  const paths = getPathsForVersion(version);
  const currentHash = computeGameVersionHash(paths);
  if (!currentHash) {
    return { detected: false, updated: false, reason: 'Archivos no accesibles' };
  }

  const cfg = loadConfig();
  const vHashes = cfg.lastKnownVersionHashes || {};
  const lastHash = vHashes[version];

  if (!lastHash) {
    // Primera vez que se detecta esta versión: registrar hash y respaldar originales
    vHashes[version] = currentHash;
    saveConfig({ lastKnownVersionHashes: vHashes });
    ensureOriginalBackup(paths.jsonPath,         `${version}_MainMenuBackgrounds.json`);
    ensureOriginalBackup(paths.newsCarouselPath,  `${version}_NewsTilesCarousel.ui`);
    ensureOriginalBackup(paths.homePagePath,      `${version}_HomePage.ui`);
    return { detected: true, updated: false, firstRun: true };
  }

  if (lastHash !== currentHash) {
    console.log(`[Actualización detectada] Versión ${version} cambió (${lastHash} -> ${currentHash})`);

    // PASO 1: Restaurar archivos a su estado original ANTES de respaldar los nuevos.
    // Esto garantiza que, si el instalador vuelve a correr, encuentre archivos intactos.
    const restoredJson  = restoreFromBackup(`${version}_MainMenuBackgrounds.json`, paths.jsonPath);
    const restoredNews  = restoreFromBackup(`${version}_NewsTilesCarousel.ui`,      paths.newsCarouselPath);
    const restoredHome  = restoreFromBackup(`${version}_HomePage.ui`,               paths.homePagePath);

    // PASO 2: Ahora que los archivos están en estado limpio, respaldar la nueva versión del juego.
    // Se usa forceOriginalBackup para pisar el backup anterior con el recién instalado.
    forceOriginalBackup(paths.jsonPath,        `${version}_MainMenuBackgrounds.json`);
    forceOriginalBackup(paths.newsCarouselPath, `${version}_NewsTilesCarousel.ui`);
    forceOriginalBackup(paths.homePagePath,     `${version}_HomePage.ui`);

    // PASO 3: Re-aplicar la personalización guardada sobre los nuevos archivos del juego.
    const syncRes = applyCustomizationToGame(version);

    // Registrar el nuevo hash de la carpeta (ya incluye los cambios del usuario)
    const newHashAfter = computeGameVersionHash(paths);
    if (newHashAfter) {
      vHashes[version] = newHashAfter;
      saveConfig({ lastKnownVersionHashes: vHashes });
    }

    return {
      detected: true,
      updated: true,
      previousHash: lastHash,
      newHash: newHashAfter || currentHash,
      restored: { json: restoredJson, news: restoredNews, home: restoredHome },
      reapplied: syncRes.applied
    };
  }

  return { detected: true, updated: false };
}

// Búsqueda recursiva para encontrar los archivos requeridos de Hytale
function findHytaleFilesRecursively(startDir, maxDepth = 12) {
  if (!fs.existsSync(startDir)) return null;

  const results = {
    jsonPath: null,
    texturesDir: null,
    newsCarouselPath: null,
    homePagePath: null,
    installBase: null,
  };

  function traverse(currentDir, currentDepth) {
    if (currentDepth > maxDepth) return;
    let entries = [];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch (e) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isFile()) {
        if (entry.name === 'MainMenuBackgrounds.json' && !results.jsonPath) {
          results.jsonPath = fullPath;
        } else if (entry.name === 'NewsTilesCarousel.ui' && !results.newsCarouselPath) {
          results.newsCarouselPath = fullPath;
        } else if (entry.name === 'HomePage.ui' && !results.homePagePath) {
          results.homePagePath = fullPath;
        }
      } else if (entry.isDirectory()) {
        if (entry.name === 'BackgroundImages' && !results.texturesDir) {
          results.texturesDir = fullPath;
        }
        traverse(fullPath, currentDepth + 1);
      }
    }
  }

  traverse(startDir, 0);

  // Si encontramos al menos MainMenuBackgrounds.json o BackgroundImages
  if (results.jsonPath) {
    // Si no encontró texturesDir pero tenemos jsonPath, buscar la ruta relativa común
    if (!results.texturesDir) {
      const gameDir = path.dirname(results.jsonPath); // .../Client/Data/Game
      const clientDir = path.dirname(path.dirname(gameDir)); // .../Client
      const candidateTextures = path.join(clientDir, 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
      if (fs.existsSync(candidateTextures)) {
        results.texturesDir = candidateTextures;
      }
    }
    return results;
  }

  return null;
}

function getHytaleInstallBase() {
  const config = loadConfig();
  if (config.customHytalePath && fs.existsSync(config.customHytalePath)) {
    return config.customHytalePath;
  }

  // 1. Priorizar el directorio actual donde se ejecutó el .bat / .sh y carpetas cercanas
  const currentDir = process.cwd();
  const scriptDir = __dirname;
  const portableCandidates = [
    path.join(currentDir, 'Hytale'),
    path.join(currentDir, 'install'),
    path.join(currentDir, 'game'),
    currentDir,
    path.join(scriptDir, '..', 'Hytale'),
    path.join(scriptDir, '..', 'install'),
    path.join(scriptDir, '..')
  ];

  for (const cand of portableCandidates) {
    if (fs.existsSync(cand)) {
      // Si tiene estructura directa de juego o subcarpetas pre-release / release
      if (fs.existsSync(path.join(cand, 'pre-release')) || 
          fs.existsSync(path.join(cand, 'release')) ||
          fs.existsSync(path.join(cand, 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json'))) {
        return cand;
      }
    }
  }

  // 2. Si no está en el directorio del .bat/.sh, buscar en las rutas estándar por sistema operativo
  const home = os.homedir();
  if (process.platform === 'win32') {
    return path.join(process.env.APPDATA || path.join(home, 'AppData', 'Roaming'), 'Hytale', 'install');
  } else if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'Hytale', 'install');
  } else {
    // Linux y otros UNIX: ~/.local/share/Hytale/install o ~/.config/Hytale/install
    const localShare = path.join(home, '.local', 'share', 'Hytale', 'install');
    if (fs.existsSync(localShare)) return localShare;
    const localConfig = path.join(home, '.config', 'Hytale', 'install');
    if (fs.existsSync(localConfig)) return localConfig;
    const localShareBase = path.join(home, '.local', 'share', 'Hytale');
    if (fs.existsSync(localShareBase)) return localShareBase;
    return localShare;
  }
}

function getVersions() {
  const installBase = getHytaleInstallBase();
  const defaultVersions = ['pre-release', 'release'];
  const ignoredNames = new Set(['.keys', 'data', 'install', 'webview2', 'logs', 'cache', 'temp', 'tmp']);

  if (!fs.existsSync(installBase)) return defaultVersions;
  try {
    const dirs = fs.readdirSync(installBase, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('.') && !ignoredNames.has(name.toLowerCase()));

    // Asegurar que al menos pre-release y release estén presentes
    const combined = Array.from(new Set([...dirs, ...defaultVersions]));
    return combined.length > 0 ? combined : defaultVersions;
  } catch (e) {
    return defaultVersions;
  }
}

function getPathsForVersion(ver) {
  const safeVer = ver || 'pre-release';
  const cfg = loadConfig();

  // 1. Si no hay carpeta custom o estamos buscando según versión seleccionada en installBase:
  const baseDir = cfg.customHytalePath || getHytaleInstallBase();

  // Candidatos de estructura para la versión solicitada (deben contener el nombre de la versión):
  const versionFolderCandidates = [
    path.join(baseDir, safeVer, 'package', 'game', 'latest'),
    path.join(baseDir, safeVer),
    path.join(baseDir, 'install', safeVer, 'package', 'game', 'latest'),
    path.join(baseDir, 'install', safeVer),
    path.join(getHytaleInstallBase(), safeVer, 'package', 'game', 'latest'),
    path.join(getHytaleInstallBase(), safeVer)
  ];

  for (const cand of versionFolderCandidates) {
    if (fs.existsSync(cand)) {
      const standardJson = path.join(cand, 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json');
      if (fs.existsSync(standardJson)) {
        return {
          jsonPath: standardJson,
          texturesDir: path.join(cand, 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages'),
          newsCarouselPath: path.join(cand, 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'NewsTilesCarousel.ui'),
          homePagePath: path.join(cand, 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'HomePage.ui'),
        };
      }
      // Búsqueda recursiva dentro de la carpeta exclusiva de esa versión
      const foundInCand = findHytaleFilesRecursively(cand, 6);
      if (foundInCand && foundInCand.jsonPath) {
        return {
          jsonPath: foundInCand.jsonPath,
          texturesDir: foundInCand.texturesDir || '',
          newsCarouselPath: foundInCand.newsCarouselPath || '',
          homePagePath: foundInCand.homePagePath || '',
        };
      }
    }
  }

  // Si el usuario escaneó y guardó rutas directas
  if (cfg.resolvedPaths && cfg.resolvedPaths.jsonPath && safeVer === 'pre-release') {
    const rp = cfg.resolvedPaths;
    return {
      jsonPath:         rp.jsonPath         || '',
      texturesDir:      rp.texturesDir      || '',
      newsCarouselPath: rp.newsCarouselPath  || '',
      homePagePath:     rp.homePagePath      || '',
    };
  }

  // Fallback estándar si nada existe
  const installBase = getHytaleInstallBase();
  return {
    jsonPath:         path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json'),
    texturesDir:      path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages'),
    newsCarouselPath: path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'NewsTilesCarousel.ui'),
    homePagePath:     path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'HomePage.ui'),
  };
}

// Plantilla por defecto (Original / Default)
const DEFAULT_NEWS_UI = `$Common = "../Common.ui";
$Sounds = "../Sounds.ui";

@CardWidth = 504;
@CardHeight = 467;
@ImageHeight = 233;

Group #Carousel {
  Anchor: (Right: 59, Bottom: 200, Width: @CardWidth, Height: @CardHeight);

  Group #Card {
    Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
    Background: (TexturePath: "EAContainer.png", Border: 8);
    LayoutMode: Top;
    Padding: (Bottom: 50);

    Group #ImageArea {
      Anchor: (Height: @ImageHeight, Top: -15);
      MaskTexturePath: "NewsTileImageMask.png";

      Group #ImagePlaceholder {
        Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
        Background: #2a2f36ff;
      }

      Group #Image {
        Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
      }

      Group #BottomFade {
        Anchor: (Left: 0, Right: 0, Bottom: 0, Height: 72);
        Background: "NewsTileBottomFade.png";
      }
    }

    Label #Title {
      Style: (FontName: "Secondary", FontSize: 22, RenderBold: true, RenderUppercase: true, TextColor: #ffffff(0.95), HorizontalAlignment: Center);
      Padding: (Top: 12, Horizontal: 32);
    }

    Group {
      Anchor: (Height: 7, Width: 441, Top: 8, Bottom: 14);
      Background: "EADivider.png";
    }

    Label #Body {
      Style: (FontSize: 18, Wrap: true, TextColor: #ffffff(0.82), HorizontalAlignment: Center);
      Padding: (Horizontal: 32);
    }
  }

  Group #DotsContainer {
    Anchor: (Height: 10, Bottom: 16, Left: 0, Right: 0);
    LayoutMode: Center;
    Visible: false;
  }

  Button #ClickOverlay {
    Visible: false;
    Anchor: (Left: 0, Right: 0, Top: -15, Height: @ImageHeight);
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: #ffffff(0.06)),
      Pressed: (Background: #ffffff(0.10)),
      Sounds: $Sounds.@ButtonsLight
    );
  }

  Button #PrevButton {
    Visible: false;
    Anchor: (Width: 70, Height: @CardHeight, Top: 0, Left: 0);
    TooltipText: %client.mainMenu.newsTiles.prevButton.tooltip;
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: PatchStyle(TexturePath: "NewsTileNavGradientLeft.png", Color: #ffffff(0.70))),
      Pressed: (Background: PatchStyle(TexturePath: "NewsTileNavGradientLeft.png", Color: #ffffff(1.0))),
      Sounds: $Sounds.@ButtonsLight
    );

    LayoutMode: CenterMiddle;

    Group {
      Anchor: (Width: 18, Height: 24);
      Background: "NewsTileArrowLeft.png";
    }
  }

  Button #NextButton {
    Visible: false;
    Anchor: (Width: 70, Height: @CardHeight, Top: 0, Right: 0);
    TooltipText: %client.mainMenu.newsTiles.nextButton.tooltip;
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: PatchStyle(TexturePath: "NewsTileNavGradientRight.png", Color: #ffffff(0.70))),
      Pressed: (Background: PatchStyle(TexturePath: "NewsTileNavGradientRight.png", Color: #ffffff(1.0))),
      Sounds: $Sounds.@ButtonsLight
    );

    LayoutMode: CenterMiddle;

    Group {
      Anchor: (Width: 18, Height: 24);
      Background: "NewsTileArrowRight.png";
    }
  }
}
`;

// Plantilla Invisible / Oculto en 0
const INVISIBLE_ZERO_NEWS_UI = `$Common = "../Common.ui";
$Sounds = "../Sounds.ui";

@CardWidth = 0;
@CardHeight = 0;
@ImageHeight = 0;

Group #Carousel {
  Anchor: (Right: 0, Bottom: 0, Width: 0, Height: 0);

  Group #Card {
    Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
    LayoutMode: Top;

    Group #ImageArea {
      Anchor: (Height: 0, Top: 0);

      Group #ImagePlaceholder {
        Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
      }

      Group #Image {
        Anchor: (Left: 0, Right: 0, Top: 0, Bottom: 0);
      }

      Group #BottomFade {
        Anchor: (Left: 0, Right: 0, Bottom: 0, Height: 0);
      }
    }

    Label #Title {
      Style: (FontName: "Secondary", FontSize: 0, RenderBold: false, RenderUppercase: false, TextColor: #ffffff(0.0), HorizontalAlignment: Center);
      Text: "";
    }

    Group {
      Anchor: (Height: 0, Width: 0, Top: 0, Bottom: 0);
    }

    Label #Body {
      Style: (FontSize: 0, Wrap: false, TextColor: #ffffff(0.0), HorizontalAlignment: Center);
      Text: "";
    }
  }

  Group #DotsContainer {
    Anchor: (Height: 0, Bottom: 0, Left: 0, Right: 0);
    LayoutMode: Center;
  }

  Button #ClickOverlay {
    Anchor: (Left: 0, Right: 0, Top: 0, Height: 0);
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: #ffffff(0)),
      Pressed: (Background: #ffffff(0)),
      Sounds: ()
    );
  }

  Button #PrevButton {
    Anchor: (Width: 0, Height: 0, Top: 0, Left: 0);
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: #ffffff(0)),
      Pressed: (Background: #ffffff(0)),
      Sounds: ()
    );

    LayoutMode: CenterMiddle;

    Group {
      Anchor: (Width: 0, Height: 0);
    }
  }

  Button #NextButton {
    Anchor: (Width: 0, Height: 0, Top: 0, Right: 0);
    Style: (
      Default: (Background: #ffffff(0)),
      Hovered: (Background: #ffffff(0)),
      Pressed: (Background: #ffffff(0)),
      Sounds: ()
    );

    LayoutMode: CenterMiddle;

    Group {
      Anchor: (Width: 0, Height: 0);
    }
  }
}
`;

// ── Avatar / HomePage API ──────────────────────────────────────────────────
// GET: devuelve la config actual del #AvatarPreview (visible, top, left, width, height)
app.get('/api/avatar-status', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { homePagePath } = getPathsForVersion(version);
  try {
    if (!fs.existsSync(homePagePath)) {
      return res.json({ success: true, visible: true, top: 320, left: 0 });
    }
    const content = fs.readFileSync(homePagePath, 'utf8');
    const blockMatch = content.match(/PlayerPreviewComponent\s+#AvatarPreview\s*\{([\s\S]*?)\}/);
    let top = 320, left = 0, visible = true;
    if (blockMatch) {
      const blockStr = blockMatch[1];
      if (/Visible:\s*false/i.test(blockStr)) {
        visible = false;
      }
      const topM = blockStr.match(/Top:\s*(-?\d+)/);
      const leftM = blockStr.match(/Left:\s*(-?\d+)/);
      const widthM = blockStr.match(/Width:\s*(\d+)/);
      if (topM && visible) top = parseInt(topM[1]);
      if (leftM && visible) left = parseInt(leftM[1]);
      if (widthM && parseInt(widthM[1]) === 0) visible = false;
    }
    res.json({ success: true, visible, top, left });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// POST: modifica posición o visibilidad del #AvatarPreview en HomePage.ui
app.post('/api/avatar-status', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { homePagePath } = getPathsForVersion(version);
  const { visible, top, left } = req.body;
  try {
    if (!fs.existsSync(homePagePath)) {
      return res.json({ success: false, error: 'HomePage.ui no encontrado' });
    }
    let content = fs.readFileSync(homePagePath, 'utf8');
    const isVisible = visible !== false;
    const newTop = top ?? 320;
    const newLeft = left ?? 0;

    let newBlock = '';
    if (!isVisible) {
      newBlock = `PlayerPreviewComponent #AvatarPreview {\n  Visible: false;\n  Anchor: (Top: 0, Left: -9999, Width: 0, Height: 0);\n}`;
    } else {
      const leftStr = newLeft !== 0 ? `Left: ${newLeft}, ` : '';
      newBlock = `PlayerPreviewComponent #AvatarPreview {\n  Visible: true;\n  Anchor: (${leftStr}Top: ${newTop}, Width: 420, Height: 640);\n}`;
    }

    // Reemplazar o insertar el bloque AvatarPreview
    const regex = /PlayerPreviewComponent\s+#AvatarPreview\s*\{[\s\S]*?\}/;
    if (regex.test(content)) {
      content = content.replace(regex, newBlock);
    } else {
      content += `\n\n${newBlock}\n`;
    }

    ensureOriginalBackup(homePagePath, `${version}_HomePage.ui`);
    fs.writeFileSync(homePagePath, content, 'utf8');

    // Guardar personalización del usuario separada en config.json
    saveUserCustomization(version, { avatarConfig: { visible: isVisible, top: newTop, left: newLeft } });

    // Nota: NO se actualiza lastKnownVersionHashes aquí.
    // El hash trackea la carpeta del juego (archivos que no modificamos), no nuestras escrituras.

    res.json({ success: true, visible: isVisible, top: newTop, left: newLeft });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// APIs
app.get('/api/versions', (req, res) => {
  res.json({ success: true, versions: getVersions() });
});

// Endpoint de chequeo y sincronización reactiva de versión
app.get('/api/check-version', (req, res) => {
  const version = req.query.version || 'pre-release';
  try {
    const checkResult = checkAndHandleVersionUpdate(version);
    res.json({ success: true, version, ...checkResult });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/news-status', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { newsCarouselPath } = getPathsForVersion(version);
  try {
    if (!fs.existsSync(newsCarouselPath)) {
      return res.json({ success: true, visible: true, exists: false });
    }
    const content = fs.readFileSync(newsCarouselPath, 'utf8');
    const isZeroInvisible = /@CardWidth\s*=\s*0|Width:\s*0,\s*Height:\s*0/i.test(content);
    res.json({ success: true, visible: !isZeroInvisible, exists: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/news-status', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { visible } = req.body;
  const { newsCarouselPath } = getPathsForVersion(version);
  try {
    const dir = path.dirname(newsCarouselPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    ensureOriginalBackup(newsCarouselPath, `${version}_NewsTilesCarousel.ui`);

    const targetContent = visible ? DEFAULT_NEWS_UI : INVISIBLE_ZERO_NEWS_UI;
    fs.writeFileSync(newsCarouselPath, targetContent, 'utf8');

    // Guardar personalización del usuario separada en config.json
    saveUserCustomization(version, { newsVisible: visible });

    // Nota: NO se actualiza lastKnownVersionHashes aquí.
    // El hash trackea la carpeta del juego (archivos que no modificamos), no nuestras escrituras.

    res.json({ success: true, visible });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/config', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { jsonPath } = getPathsForVersion(version);
  try {
    const paths = getPathsForVersion(version);
    const fileExists = fs.existsSync(paths.jsonPath);
    if (fileExists) {
      const data = fs.readFileSync(paths.jsonPath, 'utf8');
      res.json({ success: true, data: JSON.parse(data), version, fileExists: true, paths });
    } else {
      res.json({
        success: true,
        data: { Groups: [{ Backgrounds: [] }] },
        version,
        isNewFile: true,
        fileExists: false,
        paths
      });
    }
  } catch (err) {
    res.json({ success: false, error: err.message, fileExists: false });
  }
});

app.post('/api/config', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { jsonPath } = getPathsForVersion(version);
  try {
    const dir = path.dirname(jsonPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    ensureOriginalBackup(jsonPath, `${version}_MainMenuBackgrounds.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(req.body, null, 2), 'utf8');

    // Guardar personalización del usuario separada en config.json
    saveUserCustomization(version, { bgConfig: req.body });

    // Nota: NO se actualiza lastKnownVersionHashes aquí.
    // El hash trackea la carpeta del juego (archivos que no modificamos), no nuestras escrituras.

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/textures', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { texturesDir } = getPathsForVersion(version);
  try {
    if (!fs.existsSync(texturesDir)) return res.json({ success: true, files: [] });
    const files = fs.readdirSync(texturesDir).filter(f => f.toLowerCase().endsWith('.png'));
    res.json({ success: true, files });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/open-folder', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { texturesDir } = getPathsForVersion(version);
  if (!fs.existsSync(texturesDir)) fs.mkdirSync(texturesDir, { recursive: true });

  let child;
  if (process.platform === 'win32') {
    child = spawn('explorer.exe', [texturesDir], { detached: true, stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    child = spawn('open', [texturesDir], { detached: true, stdio: 'ignore' });
  } else {
    child = spawn('xdg-open', [texturesDir], { detached: true, stdio: 'ignore' });
  }

  child.on('error', (err) => {
    console.error('Error al abrir carpeta:', err);
  });
  child.unref();

  res.json({ success: true });
});

// Obtener la ruta actual configurada de Hytale y estado de archivos
app.get('/api/hytale-path', (req, res) => {
  const version = req.query.version || 'pre-release';
  const cfg = loadConfig();
  const currentPath = cfg.customHytalePath || getHytaleInstallBase();
  const paths = getPathsForVersion(version);
  const jsonExists = !!(paths.jsonPath && fs.existsSync(paths.jsonPath));
  const texturesExists = !!(paths.texturesDir && fs.existsSync(paths.texturesDir));
  const newsExists = !!(paths.newsCarouselPath && fs.existsSync(paths.newsCarouselPath));
  const homeExists = !!(paths.homePagePath && fs.existsSync(paths.homePagePath));

  res.json({
    success: true,
    currentPath,
    customPath: cfg.customHytalePath || null,
    version,
    platform: process.platform,
    isLinux: process.platform === 'linux',
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    exists: fs.existsSync(currentPath),
    filesDetected: jsonExists,
    details: {
      jsonPath: jsonExists ? paths.jsonPath : null,
      texturesDir: texturesExists ? paths.texturesDir : null,
      newsCarouselPath: newsExists ? paths.newsCarouselPath : null,
      homePagePath: homeExists ? paths.homePagePath : null,
    }
  });
});

// Limpiar la ruta guardada y volver al estado sin configuración
app.delete('/api/hytale-path', (req, res) => {
  saveConfig({ customHytalePath: null, resolvedPaths: null });
  res.json({ success: true, message: 'Ruta limpiada correctamente' });
});

// Endpoint de diagnóstico: muestra qué encontró y qué no
app.get('/api/debug-path', (req, res) => {
  const targetPath = req.query.path || getHytaleInstallBase();
  const exists = fs.existsSync(targetPath);
  let entries = [];
  if (exists) {
    try { entries = fs.readdirSync(targetPath).slice(0, 30); } catch(e) {}
  }
  const found = exists ? findHytaleFilesRecursively(targetPath) : null;
  res.json({
    targetPath, exists,
    topLevelEntries: entries,
    searchResult: found,
    filesDetected: !!(found && found.jsonPath)
  });
});

// Guardar nueva ruta de Hytale y buscar archivos
app.post('/api/hytale-path', (req, res) => {
  let targetPath = (req.body.path || '').trim();
  if (!targetPath) {
    return res.json({ success: false, error: 'La ruta no puede estar vacía' });
  }

  // Expandir tilde en Linux / macOS
  if (targetPath.startsWith('~/') || targetPath === '~') {
    targetPath = path.join(os.homedir(), targetPath.slice(targetPath === '~' ? 1 : 2));
  }

  if (!fs.existsSync(targetPath)) {
    return res.json({ success: false, error: 'La carpeta especificada no existe en el sistema' });
  }

  // Buscar archivos dentro de la ruta (búsqueda recursiva profunda)
  let found = findHytaleFilesRecursively(targetPath);

  // Si no encontró en la raíz, intentar buscar en cada subcarpeta de primer nivel
  if (!found || !found.jsonPath) {
    try {
      const subDirs = fs.readdirSync(targetPath, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => path.join(targetPath, e.name));
      for (const sub of subDirs) {
        const subFound = findHytaleFilesRecursively(sub);
        if (subFound && subFound.jsonPath) { found = subFound; break; }
      }
    } catch(e) {}
  }

  // Guardar ruta base configurada
  const configToSave = { customHytalePath: targetPath, resolvedPaths: null };
  saveConfig(configToSave);

  const reqVersion = req.query.version || req.body.version || 'pre-release';
  const verPaths = getPathsForVersion(reqVersion);
  const jsonExists = !!(verPaths.jsonPath && fs.existsSync(verPaths.jsonPath));
  const texturesExists = !!(verPaths.texturesDir && fs.existsSync(verPaths.texturesDir));
  const newsExists = !!(verPaths.newsCarouselPath && fs.existsSync(verPaths.newsCarouselPath));
  const homeExists = !!(verPaths.homePagePath && fs.existsSync(verPaths.homePagePath));

  res.json({
    success: true,
    path: targetPath,
    version: reqVersion,
    filesDetected: jsonExists,
    details: {
      jsonPath: jsonExists ? verPaths.jsonPath : null,
      texturesDir: texturesExists ? verPaths.texturesDir : null,
      newsCarouselPath: newsExists ? verPaths.newsCarouselPath : null,
      homePagePath: homeExists ? verPaths.homePagePath : null,
    },
    versions: getVersions()
  });
});

// Upload PNG image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const version = req.query.version || 'pre-release';
    const { texturesDir } = getPathsForVersion(version);
    if (!fs.existsSync(texturesDir)) fs.mkdirSync(texturesDir, { recursive: true });
    cb(null, texturesDir);
  },
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Limitar a 25 MB máximo
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.png') {
      return cb(new Error('Solo se permiten archivos con extensión .png'));
    }
    cb(null, true);
  }
});

// Firma estándar PNG (primeros 8 bytes: 89 50 4E 47 0D 0A 1A 0A)
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.json({ success: false, error: 'No se recibió archivo' });

  // Validar cabecera real (magic bytes) para asegurar que el contenido es un PNG auténtico
  try {
    const fd = fs.openSync(req.file.path, 'r');
    const header = Buffer.alloc(8);
    fs.readSync(fd, header, 0, 8, 0);
    fs.closeSync(fd);

    if (!header.equals(PNG_MAGIC)) {
      // Eliminar el archivo si no es un PNG real
      fs.unlinkSync(req.file.path);
      return res.json({ success: false, error: 'El archivo subido no es una imagen PNG válida (firma inválida)' });
    }
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.json({ success: false, error: 'Error al verificar la integridad del archivo subido' });
  }

  res.json({ success: true, fileName: req.file.filename });
});

// ── Auto-actualizacion desde GitHub ──────────────────────────────────────────
// Lee el commit local desde package.json (campo "commit") y lo compara con
// el HEAD actual del repo en GitHub. No requiere git instalado en el usuario.
const _pkg = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')); }
  catch (e) { return {}; }
})();

const GITHUB_REPO    = _pkg.githubRepo || 'bravoxv/HytaleBgManager';
const LOCAL_COMMIT   = _pkg.commit     || null;
const APP_VERSION    = _pkg.version    || '?';
const GITHUB_URL     = `https://github.com/${GITHUB_REPO}`;

app.get('/api/check-app-update', (req, res) => {
  const https = require('https');

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${GITHUB_REPO}/commits/main`,
    method: 'GET',
    headers: {
      'User-Agent': 'HytaleBgManager-UpdateCheck',
      'Accept':     'application/vnd.github.v3+json'
    },
    timeout: 8000
  };

  const request = https.request(options, (r) => {
    let data = '';
    r.on('data', c => { data += c; });
    r.on('end', () => {
      try {
        const body = JSON.parse(data);
        if (r.statusCode !== 200 || !body.sha) {
          return res.json({
            success: false,
            error: 'GitHub respondio con status ' + r.statusCode,
            currentVersion: APP_VERSION,
            currentCommit: LOCAL_COMMIT
          });
        }
        const latestCommit  = body.sha;
        const latestShort   = latestCommit.substring(0, 7);
        const localShort    = LOCAL_COMMIT ? LOCAL_COMMIT.substring(0, 7) : null;
        const hasUpdate     = LOCAL_COMMIT ? latestCommit !== LOCAL_COMMIT : false;
        const commitMessage = body.commit && body.commit.message ? body.commit.message.split('\n')[0] : null;
        const commitDate    = body.commit && body.commit.author  ? body.commit.author.date : null;

        res.json({
          success:        true,
          hasUpdate,
          currentVersion: APP_VERSION,
          currentCommit:  LOCAL_COMMIT,
          currentShort:   localShort,
          latestCommit,
          latestShort,
          commitMessage,
          commitDate,
          githubUrl:   GITHUB_URL,
          downloadUrl: `${GITHUB_URL}/archive/refs/heads/main.zip`
        });
      } catch (e) {
        res.json({ success: false, error: 'Respuesta invalida de GitHub', currentVersion: APP_VERSION });
      }
    });
  });

  request.on('error', (err) => {
    res.json({ success: false, error: err.message, currentVersion: APP_VERSION, currentCommit: LOCAL_COMMIT });
  });
  request.on('timeout', () => {
    request.destroy();
    res.json({ success: false, error: 'Timeout al conectar con GitHub', currentVersion: APP_VERSION });
  });
  request.end();
});
