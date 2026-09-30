const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const PORT = 4785;

app.use(cors());
app.use(express.json());

const publicPath = fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : path.join(process.cwd(), 'public');

app.use(express.static(publicPath));

app.get('/', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html no encontrado');
  }
});

// Endpoint para cerrar el proceso del servidor limpiamente cuando se cierra la ventana del navegador
app.post('/api/shutdown', (req, res) => {
  res.json({ success: true, message: 'Cerrando HytaleBgServer...' });
  setTimeout(() => {
    process.exit(0);
  }, 400);
});

const APPDATA = process.env.APPDATA ||
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.config');

const INSTALL_BASE_DIR = path.join(APPDATA, 'Hytale', 'install');

function getVersions() {
  if (!fs.existsSync(INSTALL_BASE_DIR)) return ['pre-release'];
  try {
    const dirs = fs.readdirSync(INSTALL_BASE_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return dirs.length > 0 ? dirs : ['pre-release'];
  } catch (e) {
    return ['pre-release'];
  }
}

function getPathsForVersion(ver) {
  const safeVer = ver || 'pre-release';
  const jsonPath = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json');
  const texturesDir = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
  const newsCarouselPath = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'NewsTilesCarousel.ui');
  const homePagePath = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'Interface', 'MainMenu', 'HomePage.ui');
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
      return res.json({ success: true, visible: true, top: 320, left: 0, width: 420, height: 640 });
    }
    const content = fs.readFileSync(homePagePath, 'utf8');
    // Leer valores actuales del anchor del AvatarPreview
    const anchorMatch = content.match(/PlayerPreviewComponent\s+#AvatarPreview\s*\{\s*Anchor:\s*\(([^)]+)\)/);
    let top = 320, left = 0, width = 420, height = 640;
    if (anchorMatch) {
      const anchorStr = anchorMatch[1];
      const topM = anchorStr.match(/Top:\s*(-?\d+)/);
      const leftM = anchorStr.match(/Left:\s*(-?\d+)/);
      const widthM = anchorStr.match(/Width:\s*(\d+)/);
      const heightM = anchorStr.match(/Height:\s*(\d+)/);
      if (topM) top = parseInt(topM[1]);
      if (leftM) left = parseInt(leftM[1]);
      if (widthM) width = parseInt(widthM[1]);
      if (heightM) height = parseInt(heightM[1]);
    }
    // Está oculto si Width o Height es 0
    const visible = width > 0 && height > 0;
    res.json({ success: true, visible, top, left, width, height });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// POST: modifica posición o visibilidad del #AvatarPreview en HomePage.ui
app.post('/api/avatar-status', (req, res) => {
  const version = req.query.version || 'pre-release';
  const { homePagePath } = getPathsForVersion(version);
  const { visible, top, left, width, height } = req.body;
  try {
    if (!fs.existsSync(homePagePath)) {
      return res.json({ success: false, error: 'HomePage.ui no encontrado' });
    }
    let content = fs.readFileSync(homePagePath, 'utf8');
    const newTop = top ?? 320;
    const newLeft = left ?? 0;
    const newWidth = visible === false ? 0 : (width ?? 420);
    const newHeight = visible === false ? 0 : (height ?? 640);
    // Reemplazar el Anchor del AvatarPreview
    const leftPart = newLeft !== 0 ? `, Left: ${newLeft}` : ``;
    const newAnchor = `Anchor: (Top: ${newTop}${leftPart}, Width: ${newWidth}, Height: ${newHeight})`;
    content = content.replace(
      /PlayerPreviewComponent\s+#AvatarPreview\s*\{\s*Anchor:\s*\([^)]+\)/,
      `PlayerPreviewComponent #AvatarPreview {\n  ${newAnchor}`
    );
    fs.writeFileSync(homePagePath, content, 'utf8');
    res.json({ success: true, visible: visible !== false, top: newTop, left: newLeft, width: newWidth, height: newHeight });
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
  exec(`explorer "${texturesDir}"`);
  res.json({ success: true });
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

app.listen(PORT, () => {
  const appUrl = `http://localhost:${PORT}`;
  console.log(`Servidor iniciado: ${appUrl}`);

  const candidates = [
    `"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --app=${appUrl} --window-size=1200,850 --window-position=100,50`,
    `"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe" --app=${appUrl} --window-size=1200,850`,
    `"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --app=${appUrl} --window-size=1200,850`,
    `"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --app=${appUrl} --window-size=1200,850`,
    `"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe" --app=${appUrl} --window-size=1200,850`,
  ];

  function tryLaunch(index) {
    if (index >= candidates.length) {
      exec(`start ${appUrl}`);
      return;
    }
    const cmd = candidates[index];
    const exePath = cmd.split('"')[1];
    if (fs.existsSync(exePath)) {
      exec(cmd, (err) => {
        if (err) tryLaunch(index + 1);
      });
    } else {
      tryLaunch(index + 1);
    }
  }

  tryLaunch(0);
});
