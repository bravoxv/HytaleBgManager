const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../server.js');

(async () => {
  const configPath = path.join(__dirname, '..', 'config.json');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hytale-bg-restore-'));

  const version = 'pre-release';
  const gameDir = path.join(tempRoot, version, 'package', 'game', 'latest');
  const texturesDir = path.join(gameDir, 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
  const gameContentDir = path.join(gameDir, 'Client', 'Data', 'Game');
  fs.mkdirSync(texturesDir, { recursive: true });
  fs.mkdirSync(gameContentDir, { recursive: true });
  fs.mkdirSync(path.join(gameContentDir, 'Interface', 'MainMenu'), { recursive: true });

  // Archivo original de Hytale con imagen oficial Breach.png y BreachBlurred.png
  const defaultBgConfig = {
    Groups: [{
      Backgrounds: [{
        Image: 'Textures/BackgroundImages/Breach.png',
        BlurredImage: 'Textures/BackgroundImages/BreachBlurred.png',
        Vfx: []
      }]
    }]
  };

  fs.writeFileSync(path.join(gameContentDir, 'MainMenuBackgrounds.json'), JSON.stringify(defaultBgConfig, null, 2));
  fs.writeFileSync(path.join(gameContentDir, 'Interface', 'MainMenu', 'NewsTilesCarousel.ui'), 'news-original');
  fs.writeFileSync(path.join(gameContentDir, 'Interface', 'MainMenu', 'HomePage.ui'), 'home-original');
  
  // En Textures colocamos las oficiales y una personalizada del usuario
  fs.writeFileSync(path.join(texturesDir, 'Breach.png'), 'ORIGINAL-BREACH');
  fs.writeFileSync(path.join(texturesDir, 'BreachBlurred.png'), 'ORIGINAL-BLURRED');
  fs.writeFileSync(path.join(texturesDir, 'CustomUserImage.png'), 'USER-CUSTOM');

  fs.writeFileSync(configPath, JSON.stringify({
    customHytalePath: tempRoot,
    resolvedPaths: null,
    lastKnownVersionHashes: {},
    _hashAlgorithmVersion: 2,
    userCustomizations: {
      'pre-release': {
        bgConfig: {
          Groups: [{
            Backgrounds: [{
              Image: 'Textures/BackgroundImages/CustomUserImage.png',
              BlurredImage: 'Textures/BackgroundImages/BreachBlurred.png',
              Vfx: []
            }]
          }]
        }
      }
    },
    imagesSourcePath: null
  }, null, 2));

  const server = createServer(43124, async () => {
    try {
      // 1. Guardar perfil original (debe respaldar archivos e imágenes predeterminadas)
      const saveOrigRes = await fetch('http://127.0.0.1:43124/api/save-original-profile?version=pre-release', { method: 'POST' }).then(r => r.json());
      assert.equal(saveOrigRes.success, true, 'save-original-profile failed');

      // 2. Simular que el usuario borró o alteró una imagen predeterminada en Textures
      fs.unlinkSync(path.join(texturesDir, 'Breach.png'));
      assert.ok(!fs.existsSync(path.join(texturesDir, 'Breach.png')), 'Breach.png should be deleted before restore');

      // 3. Ejecutar POST /api/restore-originals
      const restoreRes = await fetch('http://127.0.0.1:43124/api/restore-originals', { method: 'POST' }).then(r => r.json());
      assert.equal(restoreRes.success, true, 'restore-originals failed');

      // 4. Verificaciones críticas:
      // a) La imagen personalizada del usuario DEBE haberse borrado
      assert.ok(!fs.existsSync(path.join(texturesDir, 'CustomUserImage.png')), 'CustomUserImage.png should have been removed from Textures');
      
      // b) La imagen original Breach.png DEBE existir (restaurada desde el backup)
      assert.ok(fs.existsSync(path.join(texturesDir, 'Breach.png')), 'Default Breach.png MUST NOT be deleted and MUST be restored');
      assert.equal(fs.readFileSync(path.join(texturesDir, 'Breach.png'), 'utf8'), 'ORIGINAL-BREACH');

      // c) La imagen original borrosa BreachBlurred.png DEBE conservarse intacta
      assert.ok(fs.existsSync(path.join(texturesDir, 'BreachBlurred.png')), 'Default BreachBlurred.png MUST NOT be deleted');

      console.log('PASS: restore-originals restores and protects default game images.');
    } catch (err) {
      console.error('FAIL:', err);
      process.exitCode = 1;
    } finally {
      fs.writeFileSync(configPath, originalConfig);
      try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (_) {}
      try { fs.rmSync(path.join(__dirname, '..', 'backups', 'original-images', 'pre-release'), { recursive: true, force: true }); } catch (_) {}
      server.close();
    }
  });
})();
