const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const multer = require('multer');

const app = express();
const PORT = 4785;

// Exportar función para que Electron la use como servidor integrado
function createServer(port, onReady) {
  const p = port || PORT;
  return app.listen(p, '127.0.0.1', () => {
    console.log(`Servidor Express iniciado en http://127.0.0.1:${p}`);
    if (typeof onReady === 'function') onReady();
  });
}

module.exports = { createServer };

app.use(cors());
app.use(express.json());

const publicPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(process.cwd(), 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  const filePath = path.join(publicPath, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('index.html no encontrado');
  }
});

app.get('/linux', (req, res) => {
  const linuxPath = path.join(publicPath, 'linux.html');
  if (fs.existsSync(linuxPath)) {
    res.sendFile(linuxPath);
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

app.get('/windows', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Endpoint de estado/ping (Electron gestiona el ciclo de vida de la app)
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'pong' });
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
  if (!fs.existsSync(installBase)) return ['pre-release'];
  try {
    const dirs = fs.readdirSync(installBase, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return dirs.length > 0 ? dirs : ['pre-release'];
  } catch (e) {
    return ['pre-release'];
  }
}

function getPathsForVersion(ver) {
  const safeVer = ver || 'pre-release';
  const cfg = loadConfig();

  // 1. Si el usuario escaneó y encontró archivos → usar los paths exactos guardados
  if (cfg.resolvedPaths && cfg.resolvedPaths.jsonPath) {
    const rp = cfg.resolvedPaths;
    return {
      jsonPath:         rp.jsonPath         || '',
      texturesDir:      rp.texturesDir      || '',
      newsCarouselPath: rp.newsCarouselPath  || '',
      homePagePath:     rp.homePagePath      || '',
    };
  }

  // 2. Si el usuario eligió una carpeta custom (aunque no tenga archivos),
  //    usar ESA carpeta como base y NO caer al AppData del sistema.
  //    Así el usuario controla siempre qué carpeta está activa.
  if (cfg.customHytalePath) {
    const base = cfg.customHytalePath;
    return {
      jsonPath:         path.join(base, 'MainMenuBackgrounds.json'),
      texturesDir:      path.join(base, 'BackgroundImages'),
      newsCarouselPath: path.join(base, 'NewsTilesCarousel.ui'),
      homePagePath:     path.join(base, 'HomePage.ui'),
    };
  }

  // 3. Sin carpeta custom: usar la ruta estándar del launcher de Hytale
  const installBase = getHytaleInstallBase();
  let jsonPath         = path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json');
  let texturesDir      = path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
  let newsCarouselPath = path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'NewsTilesCarousel.ui');
  let homePagePath     = path.join(installBase, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'HomePage.ui');

  // Búsqueda recursiva si no existen en ruta estándar
  if (!fs.existsSync(jsonPath) && fs.existsSync(installBase)) {
    const found = findHytaleFilesRecursively(installBase);
    if (found && found.jsonPath) {
      if (found.jsonPath)         jsonPath = found.jsonPath;
      if (found.texturesDir)      texturesDir = found.texturesDir;
      if (found.newsCarouselPath) newsCarouselPath = found.newsCarouselPath;
      if (found.homePagePath)     homePagePath = found.homePagePath;
    }
  }

  return { jsonPath, texturesDir, newsCarouselPath, homePagePath };
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

    fs.writeFileSync(homePagePath, content, 'utf8');
    res.json({ success: true, visible: isVisible, top: newTop, left: newLeft });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// APIs
app.get('/api/versions', (req, res) => {
  res.json({ success: true, versions: getVersions() });
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

    const targetContent = visible ? DEFAULT_NEWS_UI : INVISIBLE_ZERO_NEWS_UI;
    fs.writeFileSync(newsCarouselPath, targetContent, 'utf8');

    res.json({ success: true, visible });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/config', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { jsonPath } = getPathsForVersion(version);
  try {
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf8');
      res.json({ success: true, data: JSON.parse(data), version });
    } else {
      res.json({
        success: true,
        data: { Groups: [{ Backgrounds: [] }] },
        version,
        isNewFile: true
      });
    }
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post('/api/config', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { jsonPath } = getPathsForVersion(version);
  try {
    const dir = path.dirname(jsonPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(req.body, null, 2), 'utf8');
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

  const openCmd = process.platform === 'win32' ? `explorer "${texturesDir}"` :
                  process.platform === 'darwin' ? `open "${texturesDir}"` :
                  `xdg-open "${texturesDir}"`;

  exec(openCmd, (err) => {
    if (err) console.error('Error al abrir carpeta:', err);
  });
  res.json({ success: true });
});

// Obtener la ruta actual configurada de Hytale y estado de archivos
app.get('/api/hytale-path', (req, res) => {
  const cfg = loadConfig();
  const currentPath = cfg.customHytalePath || getHytaleInstallBase();
  const found = cfg.resolvedPaths && cfg.resolvedPaths.jsonPath
    ? cfg.resolvedPaths
    : findHytaleFilesRecursively(currentPath);

  res.json({
    success: true,
    currentPath,
    customPath: cfg.customHytalePath || null,
    platform: process.platform,
    isLinux: process.platform === 'linux',
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    exists: fs.existsSync(currentPath),
    filesDetected: !!(found && found.jsonPath),
    details: found
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

  // Guardar ruta base y, si encontró archivos, los paths exactos para todos los endpoints
  const configToSave = { customHytalePath: targetPath };
  if (found && found.jsonPath) {
    configToSave.resolvedPaths = {
      jsonPath:         found.jsonPath,
      texturesDir:      found.texturesDir || '',
      newsCarouselPath: found.newsCarouselPath || '',
      homePagePath:     found.homePagePath || '',
    };
  } else {
    configToSave.resolvedPaths = null;
  }
  saveConfig(configToSave);

  res.json({
    success: true,
    path: targetPath,
    filesDetected: !!(found && found.jsonPath),
    details: found || {},
    versions: getVersions()
  });
});

// Abrir la interfaz GUI de Linux bajo demanda
app.post('/api/open-linux-gui', (req, res) => {
  const guiScript = path.join(__dirname, 'linux_gui.py');
  if (fs.existsSync(guiScript)) {
    exec('python3 linux_gui.py', (err) => {
      if (err) console.error('Error al ejecutar linux_gui.py:', err);
    });
    res.json({ success: true, message: 'GUI iniciada' });
  } else {
    res.json({ success: false, error: 'linux_gui.py no encontrado' });
  }
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
  storage, fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.png') {
      return cb(new Error('Solo se permiten archivos PNG'));
    }
    cb(null, true);
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.json({ success: false, error: 'No se recibió archivo' });
  res.json({ success: true, fileName: req.file.filename });
});



