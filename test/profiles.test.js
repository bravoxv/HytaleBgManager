const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createServer } = require('../server.js');

(async () => {
  const configPath = path.join(__dirname, '..', 'config.json');
  const originalConfig = fs.readFileSync(configPath, 'utf8');
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hytale-bg-profile-'));

  const version = 'pre-release';
  const gameDir = path.join(tempRoot, version, 'package', 'game', 'latest');
  const texturesDir = path.join(gameDir, 'Client', 'Data', 'Shared', 'UI', 'Textures', 'BackgroundImages');
  const gameContentDir = path.join(gameDir, 'Client', 'Data', 'Game');
  fs.mkdirSync(texturesDir, { recursive: true });
  fs.mkdirSync(gameContentDir, { recursive: true });
  fs.mkdirSync(path.join(gameContentDir, 'Interface', 'MainMenu'), { recursive: true });
  fs.writeFileSync(path.join(gameContentDir, 'MainMenuBackgrounds.json'), JSON.stringify({ Groups: [{ Backgrounds: [] }] }));
  fs.writeFileSync(path.join(gameContentDir, 'Interface', 'MainMenu', 'NewsTilesCarousel.ui'), 'news');
  fs.writeFileSync(path.join(gameContentDir, 'Interface', 'MainMenu', 'HomePage.ui'), 'home');
  fs.writeFileSync(path.join(texturesDir, 'LoadingScreen.png'), 'PNG-1');
  fs.writeFileSync(path.join(texturesDir, 'LoadingScreen_UW.png'), 'PNG-2');

  fs.writeFileSync(configPath, JSON.stringify({
    customHytalePath: tempRoot,
    resolvedPaths: null,
    lastKnownVersionHashes: {},
    _hashAlgorithmVersion: 2,
    userCustomizations: {},
    imagesSourcePath: null
  }, null, 2));

  const server = createServer(43123, () => {
    fetch('http://127.0.0.1:43123/api/config?version=pre-release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Groups: [{
          Backgrounds: [{
            Image: 'Textures/BackgroundImages/LoadingScreen.png',
            BlurredImage: 'Textures/BackgroundImages/LoadingScreen_UW.png',
            Vfx: []
          }]
        }]
      })
    }).then(async (res) => {
      try {
        const body = await res.json();
        const profileDir = path.join(__dirname, '..', 'user-profiles', version, 'BackgroundImages');
        const main = path.join(profileDir, 'LoadingScreen.png');
        const blurred = path.join(profileDir, 'LoadingScreen_UW.png');

        try {
          assert.equal(res.status, 200, `Expected HTTP 200, got ${res.status}: ${JSON.stringify(body)}`);
          assert.equal(body.success, true, `Unexpected API result: ${JSON.stringify(body)}`);
          assert.ok(fs.existsSync(main), 'Main profile PNG was not copied to the profile folder.');
          assert.ok(fs.existsSync(blurred), 'Blurred profile PNG was not copied to the profile folder.');
          console.log('PASS: profile PNGs are persisted with the custom profile.');
        } finally {
          fs.writeFileSync(configPath, originalConfig);
          try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (e) {}
          try { fs.rmSync(path.join(__dirname, '..', 'user-profiles', version), { recursive: true, force: true }); } catch (e) {}
          server.close(() => process.exit(0));
        }
      } catch (err) {
        fs.writeFileSync(configPath, originalConfig);
        try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (e) {}
        try { fs.rmSync(path.join(__dirname, '..', 'user-profiles', version), { recursive: true, force: true }); } catch (e) {}
        console.error('FAIL:', err.message);
        process.exit(1);
      }
    }).catch((err) => {
      fs.writeFileSync(configPath, originalConfig);
      try { fs.rmSync(tempRoot, { recursive: true, force: true }); } catch (e) {}
      try { fs.rmSync(path.join(__dirname, '..', 'user-profiles', version), { recursive: true, force: true }); } catch (e) {}
      console.error('FAIL:', err.message);
      process.exit(1);
    });
  });
})();
