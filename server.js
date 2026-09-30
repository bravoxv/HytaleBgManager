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
    return { jsonPath, texturesDir, newsCarouselPath };
}

// APIs
app.get('/api/versions', (req, res) => {
    res.json({ success: true, versions: getVersions() });
});

// API de Noticias / UI Carousel Status
app.get('/api/news-status', (req, res) => {
    const version = req.query.version || 'pre-release';
    const { newsCarouselPath } = getPathsForVersion(version);
    try {
        if (!fs.existsSync(newsCarouselPath)) {
            return res.json({ success: true, visible: true, exists: false });
        }
        const content = fs.readFileSync(newsCarouselPath, 'utf8');
        // Si contiene la propiedad Visible: false en Group #Carousel, las noticias están ocultas
        const isHidden = /Group\s+#Carousel\s*\{[\s\S]*?Visible\s*:\s*false/i.test(content);
        res.json({ success: true, visible: !isHidden, exists: true });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

app.post('/api/news-status', (req, res) => {
    const version = req.query.version || 'pre-release';
    const { visible } = req.body; // true = visible, false = oculta (transparente/invisible)
    const { newsCarouselPath } = getPathsForVersion(version);
    try {
        if (!fs.existsSync(newsCarouselPath)) {
            return res.json({ success: false, error: 'El archivo NewsTilesCarousel.ui no existe en esta versión.' });
        }
        let content = fs.readFileSync(newsCarouselPath, 'utf8');

        if (visible === false) {
            // Ocultar e invisibilizar las noticias en el archivo .ui
            if (/Group\s+#Carousel\s*\{[\s\S]*?Visible\s*:/i.test(content)) {
                content = content.replace(/(Group\s+#Carousel\s*\{[\s\S]*?Visible\s*:\s*)(true|false)/i, '$1false');
            } else {
                content = content.replace(/(Group\s+#Carousel\s*\{)/i, '$1\n  Visible: false;');
            }
        } else {
            // Mostrar de nuevo las noticias
            if (/Group\s+#Carousel\s*\{[\s\S]*?Visible\s*:\s*false/i.test(content)) {
                content = content.replace(/(Group\s+#Carousel\s*\{[\s\S]*?Visible\s*:\s*)false/i, '$1true');
            }
        }

        fs.writeFileSync(newsCarouselPath, content, 'utf8');
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
