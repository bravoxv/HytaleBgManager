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
app.use(express.static(path.join(__dirname, 'public')));

const APPDATA = process.env.APPDATA ||
    (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.config');

const INSTALL_BASE_DIR = path.join(APPDATA, 'Hytale', 'install');

// Helper to get available versions (e.g. ['pre-release', 'release'])
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

// Helper to get paths for a specific version
function getPathsForVersion(ver) {
    const safeVer = ver || 'pre-release';
    const jsonPath = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Game', 'MainMenuBackgrounds.json');
    const texturesDir = path.join(INSTALL_BASE_DIR, safeVer, 'package', 'game', 'latest', 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
    return { jsonPath, texturesDir };
}

// APIs
app.get('/api/versions', (req, res) => {
    res.json({ success: true, versions: getVersions() });
});

app.get('/api/config', (req, res) => {
    const version = req.query.version || 'pre-release';
    const { jsonPath } = getPathsForVersion(version);
    try {
        if (fs.existsSync(jsonPath)) {
            const data = fs.readFileSync(jsonPath, 'utf8');
            res.json({ success: true, data: JSON.parse(data), version });
        } else {
            // Return empty default structure if file does not exist yet for this version
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

// Upload PNG image to textures folder for selected version
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

// Start server
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
