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
        toastAvatarApplied: "¡Configuración del personaje guardada y aplicada!",
        hytaleFolderTitle: "Carpeta de Instalación de Hytale",
        hytaleFolderHelp: "Selecciona o introduce la carpeta donde tienes instalado Hytale. El programa buscará automáticamente los archivos necesarios para su funcionamiento (MainMenuBackgrounds.json, BackgroundImages, etc.).",
        scanFilesBtn: "🔍 Buscar Archivos",
        filesDetectedLabel: "Archivos necesarios detectados:",
        toastUpdateSynced: "⚡ ¡Actualización de Hytale detectada! Personalizaciones resincronizadas automáticamente.",
        confirmClearTitle: "¿Eliminar la ruta guardada?",
        confirmClearMsg: "Se eliminará la carpeta de instalación de Hytale configurada. Tendrás que volver a seleccionarla.\n\n¿Deseas continuar?",
        toastClearPath: "Ruta eliminada. Selecciona una nueva carpeta de Hytale.",
        updateAvailable: "⬆️ Actualización disponible",
        updateApply: "Aplicar actualización",
        updateApplying: "Aplicando...",
        updateDone: "Actualización aplicada",
        updateAlreadyLatest: "Ya tenías la última versión.",
        updateDownload: "Descargar ZIP",
        restoreOriginalsBtn: "🔄 Restaurar archivos originales del juego",
        restoreOriginalsConfirm: "¿Salió una nueva versión de Hytale?\n\nEste botón devuelve los archivos del juego a su estado original para que el launcher no los detecte como corruptos al actualizar.\n\nDespués de actualizar Hytale, abrí esta app y guardá los cambios para volver a aplicar tu personalización.\n\n¿Continuar?",
        restoreOriginalsOk: "✅ Archivos del juego restaurados. Ahora podés actualizar Hytale sin problemas.",
        restoreOriginalsError: "Error al restaurar los archivos del juego."
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
        avatarStatusVisible: "Visible", avatarStatusHidden: "Hidden (Width/Height: 0)",
        hytaleFolderTitle: "Hytale Installation Folder",
        hytaleFolderHelp: "Select or enter the folder where Hytale is installed. The tool will automatically locate required files (MainMenuBackgrounds.json, BackgroundImages, etc.).",
        scanFilesBtn: "🔍 Scan Files",
        filesDetectedLabel: "Required files detected:",
        toastUpdateSynced: "⚡ Hytale update detected! Customizations re-applied automatically.",
        confirmClearTitle: "Remove saved path?",
        confirmClearMsg: "The configured Hytale installation folder will be removed. You will need to select it again.\n\nDo you want to continue?",
        toastClearPath: "Path removed. Select your Hytale installation folder again.",
        updateAvailable: "⬆️ Update available",
        updateApply: "Apply update",
        updateApplying: "Applying...",
        updateDone: "Update applied",
        updateAlreadyLatest: "You already have the latest version.",
        updateDownload: "Download ZIP",
        restoreOriginalsBtn: "🔄 Restore original game files",
        restoreOriginalsConfirm: "Is a new version of Hytale available?\n\nThis button restores the game files to their original state so the launcher doesn't detect them as corrupted during the update.\n\nAfter updating Hytale, open this app and save your changes to re-apply your customization.\n\nContinue?",
        restoreOriginalsOk: "✅ Game files restored. You can now update Hytale without issues.",
        restoreOriginalsError: "Error restoring game files."
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
        avatarSectionHelp: "Ocultar ou mover o personaje no menu principal (HomePage.ui).",
        avatarPosTop: "Posição Vertical (Top):", avatarPosLeft: "Posição Horizontal (Left):",
        avatarApply: "✅ Aplicar Posição do Personagem", avatarStatusText: "Estado:",
        avatarStatusVisible: "Visível", avatarStatusHidden: "Oculto (Width/Height: 0)",
        hytaleFolderTitle: "Pasta de Instalação do Hytale",
        hytaleFolderHelp: "Selecione ou insira a pasta onde o Hytale está instalado. O programa buscará automaticamente os arquivos necessários (MainMenuBackgrounds.json, BackgroundImages, etc.).",
        scanFilesBtn: "🔍 Procurar Arquivos",
        filesDetectedLabel: "Arquivos necessários detectados:",
        toastUpdateSynced: "⚡ Atualização do Hytale detectada! Personalizações reaplicadas automaticamente.",
        confirmClearTitle: "Remover caminho salvo?",
        confirmClearMsg: "A pasta de instalação do Hytale configurada será removida. Você precisará selecioná-la novamente.\n\nDeseja continuar?",
        toastClearPath: "Caminho removido. Selecione a pasta de instalação do Hytale novamente.",
        updateAvailable: "⬆️ Atualização disponível",
        updateApply: "Aplicar atualização",
        updateApplying: "Aplicando...",
        updateDone: "Atualização aplicada",
        updateAlreadyLatest: "Você já tem a última versão.",
        updateDownload: "Baixar ZIP",
        restoreOriginalsBtn: "🔄 Restaurar arquivos originais do jogo",
        restoreOriginalsConfirm: "Uma nova versão do Hytale foi lançada?\n\nEste botão restaura os arquivos do jogo ao estado original para que o launcher não os detecte como corrompidos ao atualizar.\n\nApós atualizar o Hytale, abra este app e salve as alterações para reaplicar sua personalização.\n\nContinuar?",
        restoreOriginalsOk: "✅ Arquivos do jogo restaurados. Agora você pode atualizar o Hytale sem problemas.",
        restoreOriginalsError: "Erro ao restaurar os arquivos do jogo."
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
const btnRestoreOriginals = document.getElementById('btn-restore-originals');
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

// El servidor se mantiene activo mientras se use la aplicación

// Consulta el resultado del chequeo de versión que ya corrió al arrancar el servidor.
// Si el servidor detectó y reaplicó actualizaciones, muestra el toast y recarga datos.
// Si el servidor no pudo chequear (archivos no disponibles aún), hace el chequeo ahora.
async function checkGameVersionUpdate() {
    try {
        // 1. Consultar primero si el servidor ya hizo el chequeo al arrancar
        const startupRes = await fetch('/api/startup-status').then(r => r.json()).catch(() => null);
        if (startupRes && startupRes.success && startupRes.startup) {
            const startup = startupRes.startup;
            // Si el arranque detectó actualizaciones → recargar UI y avisar
            if (startup.updatesDetected) {
                showToast(translations[currentLang].toastUpdateSynced || '⚡ ¡Actualización de Hytale detectada! Personalizaciones reaplicadas.');
                await loadData();
                await loadNewsStatus();
                await loadAvatarStatus();
                await refreshTexturePresets();
                return; // El servidor ya manejó todo, no hace falta re-chequear
            }

            // Si el arranque chequeó esta versión y no hubo cambios → no re-chequear
            const vResult = startup.versions && startup.versions[currentVersion];
            if (vResult && vResult.detected && !vResult.updated) {
                return; // Sin cambios detectados al arrancar, nada que hacer
            }
        }

        // 2. Fallback: chequear directamente (útil si los archivos no estaban disponibles al arrancar
        //    — ej: usuario configuró la ruta después de arrancar, o primera corrida sin ruta)
        const res = await fetch(`/api/check-version?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
        if (res.success && res.updated && res.reapplied) {
            showToast(translations[currentLang].toastUpdateSynced || '⚡ ¡Actualización detectada! Personalización reaplicada.');
            await loadData();
            await loadNewsStatus();
            await loadAvatarStatus();
            await refreshTexturePresets();
        }
    } catch (e) {
        console.error('Error al chequear versión de juego:', e);
    }
}

// Consulta GitHub en background y muestra la banda de actualización si hay versión nueva.
// No bloquea la carga de la app — se llama sin await al final de init().
async function checkAppUpdate() {
    try {
        const res = await fetch('/api/check-app-update').then(r => r.json()).catch(() => null);
        if (!res || !res.success || !res.hasUpdate) return;

        const banner   = document.getElementById('update-banner');
        const title    = document.getElementById('update-banner-title');
        const desc     = document.getElementById('update-banner-desc');
        const link     = document.getElementById('update-banner-link');
        const btnLabel = document.getElementById('update-btn-label');
        const closeBtn = document.getElementById('update-banner-close');
        if (!banner) return;

        const t = translations[currentLang] || translations['es'];
        if (title)    title.textContent = t.updateAvailable || '⬆️ Actualización disponible';
        if (btnLabel) btnLabel.textContent = t.updateApply || 'Aplicar actualización';

        // Descripción: archivos cambiados + mensaje + fecha
        let descText = '';
        if (res.changedFilesCount != null) descText += `${res.changedFilesCount} archivo(s) cambiado(s). `;
        if (res.commitMessage) descText += res.commitMessage;
        if (res.latestShort)   descText += ` (${res.latestShort})`;
        if (desc) desc.textContent = descText;

        // Quitar el href — el botón ahora aplica la actualización in-place
        if (link) {
            link.removeAttribute('href');
            link.style.cursor = 'pointer';

            link.addEventListener('click', async (e) => {
                e.preventDefault();
                if (link.dataset.applying === '1') return;
                link.dataset.applying = '1';
                if (btnLabel) btnLabel.textContent = t.updateApplying || 'Aplicando...';
                link.style.opacity = '0.7';
                if (desc) desc.textContent = 'Descargando y aplicando archivos...';

                try {
                    const upRes = await fetch('/api/apply-update', { method: 'POST' }).then(r => r.json());

                    if (!upRes.success) {
                        if (desc) desc.textContent = 'Error: ' + upRes.error;
                        if (btnLabel) btnLabel.textContent = t.updateApply || 'Reintentar';
                        link.style.opacity = '1';
                        delete link.dataset.applying;
                        return;
                    }

                    // Éxito
                    const count = upRes.applied ? upRes.applied.length : 0;
                    if (title) {
                        title.textContent = '✅ ' + (t.updateDone || 'Actualización aplicada');
                        title.style.color = '#34d399';
                    }

                    if (upRes.alreadyUpToDate) {
                        if (desc) desc.textContent = t.updateAlreadyLatest || 'Ya tenías la última versión.';
                        link.classList.add('hidden');
                    } else if (count > 0) {
                        // Siempre ofrecer reiniciar: cambios en public/ (JS/CSS/HTML) también requieren reload
                        if (desc) desc.textContent = `${count} archivo(s) actualizado(s). Reiniciá la app para aplicar los cambios.`;
                        if (btnLabel) btnLabel.textContent = '🔄 Reiniciar ahora';
                        link.style.opacity = '1';
                        link.dataset.applying = 'restart';
                        link.addEventListener('click', (e) => { e.preventDefault(); location.reload(); }, { once: true });
                    } else {
                        if (desc) desc.textContent = 'No hubo cambios que aplicar.';
                        link.classList.add('hidden');
                    }
                } catch (err) {
                    if (desc) desc.textContent = 'Error de conexión al aplicar actualización.';
                    if (btnLabel) btnLabel.textContent = t.updateApply || 'Reintentar';
                    link.style.opacity = '1';
                    delete link.dataset.applying;
                }
            }, { once: true });
        }

        // Mostrar banda con animación
        banner.classList.remove('hidden');

        // Botón cerrar
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                banner.style.animation = 'bannerSlideDown 0.25s ease reverse forwards';
                setTimeout(() => banner.classList.add('hidden'), 250);
            }, { once: true });
        }
    } catch (e) {
        console.log('[Update] No se pudo verificar actualizaciones:', e.message);
    }
}


async function init() {
    fetch('/api/ping').catch(() => {});
    await loadVersions();
    await checkGameVersionUpdate();
    await loadData();
    await loadNewsStatus();
    await loadAvatarStatus();
    await refreshTexturePresets();
    updateLanguageUI();
    checkAppUpdate(); // No bloqueante — corre en background

    versionSelect.addEventListener('change', async e => {
        currentVersion = e.target.value;
        await checkGameVersionUpdate();
        const dataRes = await loadData();
        await loadNewsStatus();
        await loadAvatarStatus();
        await refreshTexturePresets();
        await checkLinuxHytaleStatus();
        
        if (dataRes && dataRes.fileExists === false) {
            if (currentVersion === 'release') {
                showToast('❌ Archivos no encontrados en la versión "release". Fíjate si aparecen en "pre-release".', true);
                if (linuxStatusSummary) {
                    linuxStatusSummary.textContent = '❌ Sin archivos en "release". Prueba seleccionando "pre-release".';
                    linuxStatusSummary.style.color = '#ef4444';
                }
            } else {
                showToast(`⚠️ No se encontraron archivos para la versión "${currentVersion}".`, true);
            }
        } else {
            showToast(translations[currentLang].toastVersionLoaded + currentVersion);
        }
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

    const btnRefreshPresets = document.getElementById('btn-refresh-presets');
    if (btnRefreshPresets) {
        btnRefreshPresets.addEventListener('click', async () => {
            const original = btnRefreshPresets.textContent;
            btnRefreshPresets.disabled = true;
            btnRefreshPresets.textContent = '⏳';
            await refreshTexturePresets();
            btnRefreshPresets.textContent = '✅ Actualizado';
            setTimeout(() => {
                btnRefreshPresets.textContent = original;
                btnRefreshPresets.disabled = false;
            }, 1500);
        });
    }

    if (btnRestoreOriginals) {
        btnRestoreOriginals.addEventListener('click', async () => {
            const t = translations[currentLang] || translations['es'];
            const confirmed = confirm(
                (t.restoreOriginalsConfirm || 'Esto restaurará los archivos del juego a su estado original.\n\nDespués de actualizar Hytale, abrí esta app y guardá los cambios para volver a aplicar tu personalización.\n\n¿Continuar?')
            );
            if (!confirmed) return;

            btnRestoreOriginals.disabled = true;
            btnRestoreOriginals.textContent = '⏳ Restaurando...';

            try {
                const res = await fetch('/api/restore-originals', { method: 'POST' }).then(r => r.json());
                if (res.success) {
                    btnRestoreOriginals.textContent = '✅ Archivos restaurados';
                    btnRestoreOriginals.classList.add('restored');
                    showToast(t.restoreOriginalsOk || '✅ Archivos originales restaurados. Ahora podés abrir el launcher de Hytale y actualizar sin problemas.');
                    // Volver al estado normal después de unos segundos
                    setTimeout(() => {
                        btnRestoreOriginals.disabled = false;
                        btnRestoreOriginals.classList.remove('restored');
                        const label = t.restoreOriginalsBtn || '🔄 Restaurar archivos originales del juego';
                        btnRestoreOriginals.textContent = label;
                    }, 5000);
                } else {
                    btnRestoreOriginals.disabled = false;
                    btnRestoreOriginals.textContent = '🛡️ Preparar para actualizar';
                    showToast((t.restoreOriginalsError || 'Error al restaurar: ') + (res.error || ''), true);
                }
            } catch (e) {
                btnRestoreOriginals.disabled = false;
                btnRestoreOriginals.textContent = '🛡️ Preparar para actualizar';
                showToast(t.restoreOriginalsError || 'Error de conexión al restaurar archivos.', true);
            }
        });
    }

    chkNewsVisible.addEventListener('change', toggleNewsVisibility);
    chkAvatarVisible.addEventListener('change', applyAvatarChanges);
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

    // Inicializar el card de carpeta de imágenes
    await loadImagesSourceCard();

    // Inicializar modal de ayuda para error de validación
    initHelpValidationModal();
}

// ── Card de Carpeta de Imágenes PNG del usuario ────────────────────────────
async function loadImagesSourceCard() {
    const setupDiv      = document.getElementById('images-source-setup');
    const configuredDiv = document.getElementById('images-source-configured');
    const inputEl       = document.getElementById('images-source-input');
    const pathDisplay   = document.getElementById('images-source-path-display');
    const countBadge    = document.getElementById('images-source-count-badge');
    const gearBtn       = document.getElementById('btn-images-source-gear');
    const saveBtn       = document.getElementById('btn-images-source-save');
    const applyBtn      = document.getElementById('btn-images-source-apply');
    const setupMsg      = document.getElementById('images-source-setup-msg');
    const applyMsg      = document.getElementById('images-source-apply-msg');
    if (!setupDiv) return;

    function showSetup(prefill) {
        setupDiv.classList.remove('hidden');
        configuredDiv.classList.add('hidden');
        gearBtn.classList.add('hidden');
        countBadge.classList.add('hidden');
        if (prefill) inputEl.value = prefill;
        setupMsg.classList.add('hidden');
        setupMsg.textContent = '';
    }

    function showConfigured(sourcePath, fileCount) {
        setupDiv.classList.add('hidden');
        configuredDiv.classList.remove('hidden');
        pathDisplay.textContent = sourcePath;
        gearBtn.classList.remove('hidden');
        if (fileCount !== null && fileCount !== undefined) {
            countBadge.textContent = `${fileCount} PNG${fileCount !== 1 ? 's' : ''}`;
            countBadge.classList.remove('hidden');
        }
        applyMsg.classList.add('hidden');
        applyMsg.textContent = '';
    }

    // Cargar estado inicial
    try {
        const res = await fetch('/api/images-source-path').then(r => r.json());
        if (res.success && res.sourcePath) {
            showConfigured(res.sourcePath, res.fileCount);
        } else {
            showSetup();
        }
    } catch (e) {
        showSetup();
    }

    // Botón engranaje: volver al modo setup
    gearBtn.addEventListener('click', () => showSetup(pathDisplay.textContent));

    // Botón Guardar y aplicar
    saveBtn.addEventListener('click', async () => {
        const val = (inputEl.value || '').trim();
        if (!val) {
            setupMsg.textContent = '⚠️ Ingresá una ruta válida.';
            setupMsg.style.color = '#f87171';
            setupMsg.classList.remove('hidden');
            return;
        }
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Guardando...';
        try {
            const res = await fetch('/api/images-source-path', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourcePath: val })
            }).then(r => r.json());

            if (!res.success) {
                setupMsg.textContent = '❌ ' + res.error;
                setupMsg.style.color = '#f87171';
                setupMsg.classList.remove('hidden');
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 Guardar y aplicar';
                return;
            }

            // Guardado OK → aplicar automáticamente
            const applyRes = await fetch(`/api/apply-images-from-source?version=${encodeURIComponent(currentVersion)}`, {
                method: 'POST'
            }).then(r => r.json());

            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Guardar y aplicar';
            showConfigured(res.sourcePath, res.fileCount);

            if (applyRes.success) {
                showToast(`✅ ${applyRes.copied.length} imagen(es) copiada(s) a Hytale.`);
                // Refrescar presets de imágenes
                await loadData();
            } else {
                applyMsg.textContent = '⚠️ Carpeta guardada pero no se pudo aplicar: ' + applyRes.error;
                applyMsg.style.color = '#f59e0b';
                applyMsg.classList.remove('hidden');
            }
        } catch (e) {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Guardar y aplicar';
            setupMsg.textContent = '❌ Error de conexión.';
            setupMsg.style.color = '#f87171';
            setupMsg.classList.remove('hidden');
        }
    });

    // Botón Aplicar imágenes (cuando ya está configurado)
    applyBtn.addEventListener('click', async () => {
        applyBtn.disabled = true;
        applyBtn.textContent = '⏳ Aplicando...';
        applyMsg.classList.add('hidden');
        try {
            const res = await fetch(`/api/apply-images-from-source?version=${encodeURIComponent(currentVersion)}`, {
                method: 'POST'
            }).then(r => r.json());

            applyBtn.disabled = false;
            applyBtn.textContent = '▶️ Aplicar imágenes';

            if (res.success) {
                const cnt = res.copied ? res.copied.length : 0;
                const failCnt = res.failed ? res.failed.length : 0;
                applyMsg.textContent = `✅ ${cnt} imagen(es) copiada(s)` + (failCnt > 0 ? ` (${failCnt} fallida(s))` : '') + '.';
                applyMsg.style.color = '#34d399';
                applyMsg.classList.remove('hidden');
                if (cnt > 0) await loadData(); // refresca presets
            } else {
                applyMsg.textContent = '❌ ' + res.error;
                applyMsg.style.color = '#f87171';
                applyMsg.classList.remove('hidden');
            }
        } catch (e) {
            applyBtn.disabled = false;
            applyBtn.textContent = '▶️ Aplicar imágenes';
            applyMsg.textContent = '❌ Error de conexión.';
            applyMsg.style.color = '#f87171';
            applyMsg.classList.remove('hidden');
        }
    });

    // Botón Quitar del juego (borrado inteligente: solo los archivos de la carpeta del usuario)
    const removeBtn = document.getElementById('btn-images-source-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
            const confirmed = confirm(
                '¿Eliminar del juego las imágenes de tu carpeta?\n\n' +
                'Solo se borrarán los archivos que vos pusiste (los que están en tu carpeta fuente).\n' +
                'Las imágenes originales de Hytale NO se verán afectadas.\n\n' +
                '¿Continuar?'
            );
            if (!confirmed) return;

            removeBtn.disabled = true;
            removeBtn.textContent = '⏳ Quitando...';
            applyMsg.classList.add('hidden');

            try {
                const res = await fetch(`/api/remove-images-from-source?version=${encodeURIComponent(currentVersion)}`, {
                    method: 'POST'
                }).then(r => r.json());

                removeBtn.disabled = false;
                removeBtn.textContent = '🗑️ Quitar del juego';

                if (res.success) {
                    const cnt = res.removed ? res.removed.length : 0;
                    applyMsg.textContent = `🗑️ ${cnt} imagen(es) eliminada(s) del juego.` + (res.notFound && res.notFound.length > 0 ? ` (${res.notFound.length} ya no estaban)` : '');
                    applyMsg.style.color = cnt > 0 ? '#f87171' : '#94a3b8';
                    applyMsg.classList.remove('hidden');
                    if (cnt > 0) await refreshTexturePresets();
                } else {
                    applyMsg.textContent = '❌ ' + res.error;
                    applyMsg.style.color = '#f87171';
                    applyMsg.classList.remove('hidden');
                }
            } catch (e) {
                removeBtn.disabled = false;
                removeBtn.textContent = '🗑️ Quitar del juego';
                applyMsg.textContent = '❌ Error de conexión.';
                applyMsg.style.color = '#f87171';
                applyMsg.classList.remove('hidden');
            }
        });
    }
}

// ── Modal de ayuda: error de validación de Hytale ─────────────────────────────
function initHelpValidationModal() {
    const modal   = document.getElementById('modal-help-validation');
    const openBtn = document.getElementById('btn-help-validation');
    const closeBtn= document.getElementById('modal-help-close');
    const restoreBtn = document.getElementById('modal-help-restore-btn');
    if (!modal || !openBtn) return;

    function openModal()  { modal.style.display = 'flex'; }
    function closeModal() { modal.style.display = 'none'; }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del panel
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // Botón de restaurar dentro del modal — llama al mismo flujo del botón principal
    if (restoreBtn) {
        restoreBtn.addEventListener('click', async () => {
            closeModal();
            const btn = document.getElementById('btn-restore-originals');
            if (btn) btn.click();
        });
    }
}

async function loadVersions() {
    const res = await fetch('/api/versions').then(r => r.json());
    const prevVersion = currentVersion || (versionSelect ? versionSelect.value : null);
    versionSelect.innerHTML = '';
    let availableVersions = ['pre-release', 'release'];
    if (res.success && res.versions.length) {
        availableVersions = res.versions;
    }
    availableVersions.forEach(v => {
        versionSelect.appendChild(new Option(v, v));
    });
    // Si la versión previamente seleccionada aún está disponible, mantenerla
    if (prevVersion && availableVersions.includes(prevVersion)) {
        currentVersion = prevVersion;
        versionSelect.value = prevVersion;
    } else {
        currentVersion = availableVersions[0];
        versionSelect.value = availableVersions[0];
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
    if (controls) {
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
    try {
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
            if (res.paths) {
                updateFileBadges(res.fileExists, res.paths);
            }
            return res;
        } else {
            showToast('Error: ' + res.error, true);
            return res;
        }
    } catch(err) {
        showToast('Error de conexión al cargar datos', true);
        return { success: false, fileExists: false };
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
    clearTimeout(toastEl._timeout);
    clearTimeout(toastEl._hideTimeout);

    // Forzar reinicio de animación quitando el elemento del DOM brevemente
    toastEl.className = 'toast hidden';
    toastEl.textContent = msg;

    // Pequeño delay para que el navegador note el cambio y relanzar animación
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toastEl.className = `toast${isError ? ' error' : ''}`;

            // Iniciar fade-out después de 4 segundos
            toastEl._timeout = setTimeout(() => {
                toastEl.classList.add('hiding');
                // Ocultar del todo tras la animación de salida (0.3s)
                toastEl._hideTimeout = setTimeout(() => {
                    toastEl.className = 'toast hidden';
                }, 320);
            }, 4000);
        });
    });
}

// --- Interfaz de Linux: Selección de Carpeta y Búsqueda de Archivos ---
const linuxFolderInput = document.getElementById('linux-folder-input');
const btnLinuxScan = document.getElementById('btn-linux-scan');
const linuxStatusSummary = document.getElementById('linux-status-summary');
const badgeJson = document.getElementById('badge-json');
const badgeTextures = document.getElementById('badge-textures');
const badgeNews = document.getElementById('badge-news');
const badgeHomepage = document.getElementById('badge-homepage');

function updateFileBadges(detected, details = {}) {
    if (!badgeJson) return;

    function setBadge(el, name, found) {
        if (!el) return;
        if (found) {
            el.innerHTML = `✅ ${name}`;
            el.style.background = 'rgba(16, 185, 129, 0.15)';
            el.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            el.style.color = '#34d399';
        } else {
            el.innerHTML = `❌ ${name}`;
            el.style.background = 'rgba(239, 68, 68, 0.12)';
            el.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            el.style.color = '#f87171';
        }
    }

    const hasJson = !!(details.jsonPath && (details.jsonPathExists !== undefined ? details.jsonPathExists : (typeof details.jsonPath === 'string' && !details.jsonPath.includes('undefined'))));
    const hasTextures = !!(details.texturesDir && (details.texturesDirExists !== undefined ? details.texturesDirExists : true));
    const hasNews = !!(details.newsCarouselPath && (details.newsCarouselPathExists !== undefined ? details.newsCarouselPathExists : true));
    const hasHome = !!(details.homePagePath && (details.homePagePathExists !== undefined ? details.homePagePathExists : true));

    setBadge(badgeJson, 'MainMenuBackgrounds.json', hasJson && detected);
    setBadge(badgeTextures, 'Carpeta BackgroundImages', hasTextures && detected);
    setBadge(badgeNews, 'NewsTilesCarousel.ui', hasNews && detected);
    setBadge(badgeHomepage, 'HomePage.ui', hasHome && detected);

    if (linuxStatusSummary) {
        if (detected && hasJson) {
            linuxStatusSummary.textContent = '✅ ¡Archivos necesarios encontrados!';
            linuxStatusSummary.style.color = '#10b981';
        } else {
            linuxStatusSummary.textContent = '⚠️ Archivos de Hytale no detectados en esta versión o ruta.';
            linuxStatusSummary.style.color = '#f59e0b';
        }
    }
}

async function checkLinuxHytaleStatus() {
    if (!linuxFolderInput) return;
    try {
        const res = await fetch(`/api/hytale-path?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
        if (res.success) {
            linuxFolderInput.value = res.customPath || res.currentPath || '';
            updateFileBadges(res.filesDetected, res.details || {});
            
            const badge = document.getElementById('platform-badge');
            if (badge) {
                if (res.isLinux) {
                    badge.textContent = 'Linux';
                    if (!linuxFolderInput.value) linuxFolderInput.placeholder = 'Ej: ~/.local/share/Hytale/install o ~/.config/Hytale';
                } else if (res.isMac) {
                    badge.textContent = 'macOS';
                    if (!linuxFolderInput.value) linuxFolderInput.placeholder = 'Ej: ~/Library/Application Support/Hytale/install';
                } else {
                    badge.textContent = 'Windows';
                    if (!linuxFolderInput.value) linuxFolderInput.placeholder = 'Ej: C:\\Users\\TuUsuario\\AppData\\Roaming\\Hytale\\install';
                }
            }
        }
    } catch (e) {
        console.error('Error al consultar ruta de Hytale:', e);
    }
}

async function performLinuxPathSearch(pathValue) {
    const p = (pathValue || (linuxFolderInput ? linuxFolderInput.value : '')).trim();
    if (!p) {
        showToast('Ingresa una ruta para buscar', true);
        return;
    }

    if (linuxStatusSummary) {
        linuxStatusSummary.textContent = '⏳ Buscando archivos recursivamente...';
        linuxStatusSummary.style.color = '#38bdf8';
    }

    try {
        const res = await fetch(`/api/hytale-path?version=${encodeURIComponent(currentVersion)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: p, version: currentVersion })
        }).then(r => r.json());

        if (res.success) {
            if (linuxFolderInput) linuxFolderInput.value = res.path;
            await reloadAllData();
            await checkLinuxHytaleStatus();
            if (res.filesDetected) {
                showToast('¡Archivos de Hytale localizados con éxito!');
            } else {
                showToast('Ruta guardada, pero faltan algunos archivos en esta versión', true);
            }
        } else {
            if (linuxStatusSummary) {
                linuxStatusSummary.textContent = `❌ ${res.error}`;
                linuxStatusSummary.style.color = '#ef4444';
            }
            showToast(res.error, true);
        }
    } catch (err) {
        showToast('Error de conexión al buscar archivos', true);
    }
}

if (btnLinuxScan) {
    btnLinuxScan.addEventListener('click', () => performLinuxPathSearch());
}

if (linuxFolderInput) {
    linuxFolderInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performLinuxPathSearch();
        }
    });
}


// Botón limpiar ruta: borra la configuración guardada y resetea los badges
const btnClearPath = document.getElementById('btn-clear-path');
if (btnClearPath) {
    btnClearPath.addEventListener('click', async () => {
        const t = translations[currentLang] || translations['es'];
        const msg = (t.confirmClearTitle ? t.confirmClearTitle + '\n\n' : '') +
            (t.confirmClearMsg || '¿Deseas eliminar la ruta guardada de Hytale? Tendrás que volver a seleccionarla.');
        if (!window.confirm(msg)) return;
        try {
            await fetch('/api/hytale-path', { method: 'DELETE' });
            if (linuxFolderInput) linuxFolderInput.value = '';
            updateFileBadges(false, {});
            if (linuxStatusSummary) {
                linuxStatusSummary.textContent = '⚠️ Sin carpeta configurada.';
                linuxStatusSummary.style.color = '#f59e0b';
            }
            showToast(t.toastClearPath || 'Ruta limpiada. Selecciona una nueva carpeta.');
        } catch(e) {
            showToast((t.toastError || 'Error') + ' al limpiar la ruta', true);
        }
    });
}

async function reloadAllData() {
    await loadVersions();
    await loadData();
    await loadNewsStatus();
    await loadAvatarStatus();
    await refreshTexturePresets();
}

checkLinuxHytaleStatus();
init();



