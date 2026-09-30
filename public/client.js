let currentConfig = { Groups: [{ Backgrounds: [] }] };
let currentVersion = 'pre-release';
let currentLang = 'es';

const translations = {
    es: {
        versionLabel: "Versión:", openTexturesFolder: "📁 Abrir Carpeta Texturas",
        editingBackground: "Editor de Fondo de Menú", saveChanges: "💾 Guardar Cambios",
        backgroundImagesTitle: "🖼️ Imágenes del Fondo", importPng: "⬆️ Importar PNG",
        pngHelpText: "Solo se permiten archivos .png. Se copian automáticamente a BackgroundImages de la versión seleccionada.",
        mainImageLabel: "Imagen Principal (Image):", blurredImageLabel: "Imagen Desenfocada (BlurredImage):",
        selectFromFolder: "-- Seleccionar --",
        newsSectionTitle: "📰 Tarjetas de Noticias (NewsTilesCarousel)",
        newsSectionHelp: "Oculta o muestra el panel de noticias transparente en el menú principal.",
        newsStatusText: "Estado en configuración UI:", newsStatusVisible: "true (Visible)", newsStatusHidden: "false (Invisible / Oculto)",
        vfxTitle: "✨ Efectos de Partículas (VFX)", vfxGuideLink: "🌐 Guía OrbisHytale",
        applyVfxChanges: "✅ Aplicar Partículas", addParticle: "+ Agregar Partícula",
        vfxHelpText: "Añade efectos visuales 3D especificando nombre, posición y escala.",
        vfxNameLabel: "Nombre del Efecto (SystemId)", posXLabel: "X", posYLabel: "Y", posZLabel: "Z", scaleLabel: "Escala",
        noVfxYet: "No hay efectos aún. Haz clic en '+ Agregar Partícula'.",
        toastSaved: "¡Configuración guardada con éxito!", toastVfxApplied: "¡Partículas aplicadas y guardadas!",
        toastUploading: "Subiendo imagen...", toastUploaded: "guardada en BackgroundImages", toastError: "Error",
        toastVersionLoaded: "Cargada versión: ",
        avatarSectionTitle: "🧍 Personaje del Menú (AvatarPreview)",
        avatarSectionHelp: "Oculta o mueve el personaje en el menú principal (HomePage.ui).",
        avatarPosTop: "Posición Vertical (Top):", avatarPosLeft: "Posición Horizontal (Left):",
        avatarApply: "✅ Aplicar Posición del Personaje", avatarReset: "↺ Por Defecto", avatarStatusText: "Estado:",
        avatarStatusVisible: "Visible", avatarStatusHidden: "Oculto (Visible: false)",
        toastAvatarApplied: "¡Configuración del personaje guardada y aplicada!"
    },
    en: {
        versionLabel: "Version:", openTexturesFolder: "📁 Open Textures Folder",
        editingBackground: "Menu Background Editor", saveChanges: "💾 Save Changes",
        backgroundImagesTitle: "🖼️ Background Images", importPng: "⬆️ Import PNG",
        pngHelpText: "Only .png files allowed. Automatically copied to BackgroundImages for selected version.",
        mainImageLabel: "Main Image (Image):", blurredImageLabel: "Blurred Image (BlurredImage):",
        selectFromFolder: "-- Select --",
        newsSectionTitle: "📰 News Carousel (NewsTilesCarousel)",
        newsSectionHelp: "Hide or show the transparent news panel on the main menu.",
        newsStatusText: "UI Config status:", newsStatusVisible: "true (Visible)", newsStatusHidden: "false (Invisible / Hidden)",
        vfxTitle: "✨ Particle Effects (VFX)", vfxGuideLink: "🌐 OrbisHytale Guide",
        applyVfxChanges: "✅ Apply Particles", addParticle: "+ Add Particle",
        vfxHelpText: "Add 3D visual effects specifying name, position and scale.",
        vfxNameLabel: "Effect Name (SystemId)", posXLabel: "X", posYLabel: "Y", posZLabel: "Z", scaleLabel: "Scale",
        noVfxYet: "No effects yet. Click '+ Add Particle'.",
        toastSaved: "Configuration saved successfully!", toastVfxApplied: "Particles applied and saved!",
        toastUploading: "Uploading image...", toastUploaded: "saved into BackgroundImages", toastError: "Error",
        toastVersionLoaded: "Loaded version: ",
        avatarSectionTitle: "🧍 Menu Character (AvatarPreview)",
        avatarSectionHelp: "Hide or move the character on the main menu (HomePage.ui).",
        avatarPosTop: "Vertical Position (Top):", avatarPosLeft: "Horizontal Position (Left):",
        avatarApply: "✅ Apply Character Position", avatarStatusText: "Status:",
        avatarStatusVisible: "Visible", avatarStatusHidden: "Hidden (Width/Height: 0)"
    },
    pt: {
        versionLabel: "Versão:", openTexturesFolder: "📁 Abrir Pasta de Texturas",
        editingBackground: "Editor de Fundo do Menu", saveChanges: "💾 Salvar",
        backgroundImagesTitle: "🖼️ Imagens de Fundo", importPng: "⬆️ Importar PNG",
        pngHelpText: "Apenas arquivos .png. Copiados automaticamente para BackgroundImages da versão seleccionada.",
        mainImageLabel: "Imagem Principal (Image):", blurredImageLabel: "Imagem Desfocada (BlurredImage):",
        selectFromFolder: "-- Selecionar --",
        newsSectionTitle: "📰 Cartões de Notícias (NewsTilesCarousel)",
        newsSectionHelp: "Ocular ou mostrar o painel transparente de notícias no menu principal.",
        newsStatusText: "Estado da config UI:", newsStatusVisible: "true (Visível)", newsStatusHidden: "false (Invisível / Oculto)",
        vfxTitle: "✨ Efeitos de Partículas (VFX)", vfxGuideLink: "🌐 Guia OrbisHytale",
        applyVfxChanges: "✅ Aplicar Partículas", addParticle: "+ Adicionar Partícula",
        vfxHelpText: "Adicione efeitos 3D especificando nome, posição e escala.",
        vfxNameLabel: "Nome do Efeito (SystemId)", posXLabel: "X", posYLabel: "Y", posZLabel: "Z", scaleLabel: "Escala",
        noVfxYet: "Nenhum efeito ainda. Clique em '+ Adicionar Partícula'.",
        toastSaved: "Configuração salva com sucesso!", toastVfxApplied: "Partículas aplicadas e salvas!",
        toastUploading: "Enviando imagem...", toastUploaded: "salvo em BackgroundImages", toastError: "Erro",
        toastVersionLoaded: "Versão carregada: ",
        avatarSectionTitle: "🧍 Personagem do Menu (AvatarPreview)",
        avatarSectionHelp: "Ocultar ou mover o personagem no menu principal (HomePage.ui).",
        avatarPosTop: "Posição Vertical (Top):", avatarPosLeft: "Posição Horizontal (Left):",
        avatarApply: "✅ Aplicar Posição do Personagem", avatarStatusText: "Estado:",
        avatarStatusVisible: "Visível", avatarStatusHidden: "Oculto (Width/Height: 0)"
    }
};

// Elements
const versionSelect = document.getElementById('version-select');
const langSelect = document.getElementById('lang-select');
const btnOpenFolder = document.getElementById('btn-open-folder');
const imgNameInput = document.getElementById('img-name');
const blurredInput = document.getElementById('blurred-img-name');
const selectImgPreset = document.getElementById('select-img-preset');
const selectBlurPreset = document.getElementById('select-blurred-preset');
const fileUpload = document.getElementById('file-upload');
const btnSaveAll = document.getElementById('btn-save-all');
const btnAddVfx = document.getElementById('btn-add-vfx');
const btnApplyVfx = document.getElementById('btn-apply-vfx');
const vfxListEl = document.getElementById('vfx-list');
const toastEl = document.getElementById('toast');

const chkNewsVisible = document.getElementById('chk-news-visible');
const newsStatusLabel = document.getElementById('news-status-label');

const chkAvatarVisible = document.getElementById('chk-avatar-visible');
const avatarStatusLabel = document.getElementById('avatar-status-label');
const avatarTopSlider = document.getElementById('avatar-top');
const avatarTopNum = document.getElementById('avatar-top-num');
const avatarLeftSlider = document.getElementById('avatar-left');
const avatarLeftNum = document.getElementById('avatar-left-num');
const btnApplyAvatar = document.getElementById('btn-apply-avatar');
const btnResetAvatar = document.getElementById('btn-reset-avatar');

window.addEventListener('beforeunload', () => {
    navigator.sendBeacon('/api/shutdown');
});

async function init() {
    await loadVersions();
    await loadData();
    await loadNewsStatus();
    await loadAvatarStatus();
    await refreshTexturePresets();
    updateLanguageUI();

    versionSelect.addEventListener('change', async e => {
        currentVersion = e.target.value;
        await loadData();
        await loadNewsStatus();
        await loadAvatarStatus();
        await refreshTexturePresets();
        showToast(translations[currentLang].toastVersionLoaded + currentVersion);
    });

    langSelect.addEventListener('change', e => {
        currentLang = e.target.value;
        updateLanguageUI();
        renderForm();
    });

    btnSaveAll.addEventListener('click', saveConfig);
    btnOpenFolder.addEventListener('click', () => fetch(`/api/open-folder?version=${encodeURIComponent(currentVersion)}`, { method: 'POST' }));
    btnAddVfx.addEventListener('click', addVfxEffect);
    btnApplyVfx.addEventListener('click', applyVfxChanges);

    chkNewsVisible.addEventListener('change', toggleNewsVisibility);
    chkAvatarVisible.addEventListener('change', () => updateAvatarPositionControlsVisibility());
    btnApplyAvatar.addEventListener('click', applyAvatarChanges);
    if (btnResetAvatar) btnResetAvatar.addEventListener('click', resetAvatarDefault);

    // Sincronizar slider <-> número para Top
    avatarTopSlider.addEventListener('input', () => { avatarTopNum.value = avatarTopSlider.value; });
    avatarTopNum.addEventListener('input', () => { avatarTopSlider.value = avatarTopNum.value; });
    // Sincronizar slider <-> número para Left
    avatarLeftSlider.addEventListener('input', () => { avatarLeftNum.value = avatarLeftSlider.value; });
    avatarLeftNum.addEventListener('input', () => { avatarLeftSlider.value = avatarLeftNum.value; });

    fileUpload.addEventListener('change', handleFileUpload);

    selectImgPreset.addEventListener('change', e => {
        if (e.target.value) { imgNameInput.value = `Textures/BackgroundImages/${e.target.value}`; updateCurrentBgFromInputs(); }
    });
    selectBlurPreset.addEventListener('change', e => {
        if (e.target.value) { blurredInput.value = `Textures/BackgroundImages/${e.target.value}`; updateCurrentBgFromInputs(); }
    });

    imgNameInput.addEventListener('input', updateCurrentBgFromInputs);
    blurredInput.addEventListener('input', updateCurrentBgFromInputs);
}

async function loadVersions() {
    const res = await fetch('/api/versions').then(r => r.json());
    versionSelect.innerHTML = '';
    if (res.success && res.versions.length) {
        res.versions.forEach(v => {
            versionSelect.appendChild(new Option(v, v));
        });
        currentVersion = res.versions[0];
    } else {
        versionSelect.appendChild(new Option('pre-release', 'pre-release'));
        versionSelect.appendChild(new Option('release', 'release'));
        currentVersion = 'pre-release';
    }
}

function updateLanguageUI() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!t[key]) return;
        if ((el.tagName === 'INPUT') && el.placeholder !== undefined) el.placeholder = t[key];
        else el.textContent = t[key];
    });
    updateNewsLabel(chkNewsVisible.checked);
}

async function loadNewsStatus() {
    const res = await fetch(`/api/news-status?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
    if (res.success) {
        chkNewsVisible.checked = res.visible;
        updateNewsLabel(res.visible);
    }
}

function updateNewsLabel(isVisible) {
    const t = translations[currentLang];
    if (isVisible) {
        newsStatusLabel.textContent = t.newsStatusVisible;
        newsStatusLabel.style.color = '#10b981';
    } else {
        newsStatusLabel.textContent = t.newsStatusHidden;
        newsStatusLabel.style.color = '#ef4444';
    }
}

async function toggleNewsVisibility() {
    const isVisible = chkNewsVisible.checked;
    updateNewsLabel(isVisible);
    const res = await fetch(`/api/news-status?version=${encodeURIComponent(currentVersion)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: isVisible })
    }).then(r => r.json());

    if (!res.success) {
        showToast('Error: ' + res.error, true);
    }
}

async function loadAvatarStatus() {
    const res = await fetch(`/api/avatar-status?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
    if (res.success) {
        chkAvatarVisible.checked = res.visible;
        avatarTopSlider.value = res.top;
        avatarTopNum.value = res.top;
        avatarLeftSlider.value = res.left;
        avatarLeftNum.value = res.left;
        updateAvatarLabel(res.visible, res.top, res.left);
        updateAvatarPositionControlsVisibility();
    }
}

function updateAvatarLabel(isVisible, top, left) {
    const t = translations[currentLang];
    if (isVisible) {
        avatarStatusLabel.textContent = `${t.avatarStatusVisible} (Top: ${top}, Left: ${left})`;
        avatarStatusLabel.style.color = '#10b981';
    } else {
        avatarStatusLabel.textContent = t.avatarStatusHidden;
        avatarStatusLabel.style.color = '#ef4444';
    }
}

function updateAvatarPositionControlsVisibility() {
    const controls = document.getElementById('avatar-position-controls');
    const btn = document.getElementById('btn-apply-avatar');
    if (!chkAvatarVisible.checked) {
        controls.style.opacity = '0.4';
        controls.style.pointerEvents = 'none';
    } else {
        controls.style.opacity = '1';
        controls.style.pointerEvents = 'auto';
    }
}

async function applyAvatarChanges() {
    const isVisible = chkAvatarVisible.checked;
    const top = parseInt(avatarTopNum.value) || 320;
    const left = parseInt(avatarLeftNum.value) || 0;
    const res = await fetch(`/api/avatar-status?version=${encodeURIComponent(currentVersion)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: isVisible, top, left })
    }).then(r => r.json());
    if (res.success) {
        updateAvatarLabel(isVisible, top, left);
        showToast(translations[currentLang].toastAvatarApplied || translations[currentLang].toastSaved);
    } else {
        showToast('Error: ' + res.error, true);
    }
}

async function resetAvatarDefault() {
    chkAvatarVisible.checked = true;
    avatarTopSlider.value = 320;
    avatarTopNum.value = 320;
    avatarLeftSlider.value = 0;
    avatarLeftNum.value = 0;
    updateAvatarPositionControlsVisibility();
    await applyAvatarChanges();
}

async function loadData() {
    const res = await fetch(`/api/config?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
    if (res.success) {
        currentConfig = res.data;
        if (!currentConfig.Groups) currentConfig.Groups = [{ Backgrounds: [] }];
        if (!currentConfig.Groups.length) currentConfig.Groups.push({ Backgrounds: [] });
        if (!currentConfig.Groups[0].Backgrounds.length) {
            currentConfig.Groups[0].Backgrounds.push({
                Image: "Textures/BackgroundImages/banner.png",
                BlurredImage: "Textures/BackgroundImages/bannerBlurred.png",
                Vfx: []
            });
        }
        renderForm();
    } else {
        showToast('Error: ' + res.error, true);
    }
}

async function refreshTexturePresets() {
    const res = await fetch(`/api/textures?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
    if (!res.success) return;
    const t = translations[currentLang];
    const emptyOpt = `<option value="">${t.selectFromFolder}</option>`;
    selectImgPreset.innerHTML = emptyOpt;
    selectBlurPreset.innerHTML = emptyOpt;
    res.files.forEach(f => {
        selectImgPreset.appendChild(new Option(f, f));
        selectBlurPreset.appendChild(new Option(f, f));
    });
}

function getActiveBg() {
    if (!currentConfig.Groups || !currentConfig.Groups[0] || !currentConfig.Groups[0].Backgrounds) {
        return null;
    }
    return currentConfig.Groups[0].Backgrounds[0];
}

function renderForm() {
    const bg = getActiveBg();
    if (!bg) return;
    imgNameInput.value = bg.Image || '';
    blurredInput.value = bg.BlurredImage || '';
    renderVfxList(bg.Vfx || []);
}

function updateCurrentBgFromInputs() {
    const bg = getActiveBg();
    if (!bg) return;
    bg.Image = imgNameInput.value.trim();
    bg.BlurredImage = blurredInput.value.trim();
}

function renderVfxList(vfxArray) {
    const t = translations[currentLang];
    vfxListEl.innerHTML = '';
    if (!vfxArray.length) {
        vfxListEl.innerHTML = `<p class="help-text" style="text-align:center;margin:15px 0;">${t.noVfxYet}</p>`;
        return;
    }
    vfxArray.forEach((vfx, idx) => {
        const card = document.createElement('div');
        card.className = 'vfx-card';
        card.innerHTML = `
      <div class="vfx-row">
        <div class="vfx-input-group">
          <label>${t.vfxNameLabel}</label>
          <input type="text" data-field="SystemId" value="${vfx.SystemId || ''}" placeholder="Fireflies_GS">
        </div>
        <div class="vfx-input-group">
          <label>${t.posXLabel}</label>
          <input type="number" step="0.01" data-field="X" value="${vfx.X ?? 0.5}">
        </div>
        <div class="vfx-input-group">
          <label>${t.posYLabel}</label>
          <input type="number" step="0.01" data-field="Y" value="${vfx.Y ?? 0.5}">
        </div>
        <div class="vfx-input-group">
          <label>${t.posZLabel}</label>
          <input type="number" step="0.1" data-field="Z" value="${vfx.Z ?? 10.0}">
        </div>
        <div class="vfx-input-group">
          <label>${t.scaleLabel}</label>
          <input type="number" step="0.1" data-field="Scale" value="${vfx.Scale ?? 1.0}">
        </div>
        <button class="btn-icon-danger" title="Eliminar">&times;</button>
      </div>`;

        card.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', e => {
                const field = e.target.getAttribute('data-field');
                vfxArray[idx][field] = e.target.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
            });
        });
        card.querySelector('.btn-icon-danger').addEventListener('click', () => {
            vfxArray.splice(idx, 1);
            renderVfxList(vfxArray);
        });
        vfxListEl.appendChild(card);
    });
}

function addVfxEffect() {
    const bg = getActiveBg();
    if (!bg) return;
    if (!bg.Vfx) bg.Vfx = [];
    bg.Vfx.push({ SystemId: "Fireflies_GS", X: 0.5, Y: 0.5, Z: 10.0, Scale: 1.0 });
    renderVfxList(bg.Vfx);
}

async function applyVfxChanges() {
    await saveConfig();
    showToast(translations[currentLang].toastVfxApplied);
}

async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.png')) {
        showToast('Solo archivos PNG permitidos', true);
        fileUpload.value = '';
        return;
    }
    const t = translations[currentLang];
    showToast(t.toastUploading);

    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`/api/upload?version=${encodeURIComponent(currentVersion)}`, { method: 'POST', body: formData }).then(r => r.json());
    fileUpload.value = '';

    if (res.success) {
        showToast(`${res.fileName} – ${t.toastUploaded}`);
        await refreshTexturePresets();
        const rel = `Textures/BackgroundImages/${res.fileName}`;
        if (!imgNameInput.value) imgNameInput.value = rel;
        else if (!blurredInput.value) blurredInput.value = rel;
        updateCurrentBgFromInputs();
    } else {
        showToast(`${t.toastError}: ${res.error}`, true);
    }
}

async function saveConfig() {
    updateCurrentBgFromInputs();
    const res = await fetch(`/api/config?version=${encodeURIComponent(currentVersion)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentConfig)
    }).then(r => r.json());
    showToast(res.success ? translations[currentLang].toastSaved : `Error: ${res.error}`, !res.success);
}

function showToast(msg, isError = false) {
    toastEl.textContent = msg;
    toastEl.className = `toast${isError ? ' error' : ''}`;
    clearTimeout(toastEl._timeout);
    toastEl._timeout = setTimeout(() => { toastEl.className = 'toast hidden'; }, 3500);
}

init();
