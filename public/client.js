let currentConfig = { Groups: [{ Backgrounds: [] }] };
let currentVersion = 'pre-release';
let currentLang = 'es';
let selectedPreviewParticle = 0;

const translations = {
    es: {
        versionLabel: "Versión:", openTexturesFolder: "📁 Abrir Carpeta Texturas",
        editingBackground: "Editor de Fondo de Menú", saveChanges: "💾 Guardar Cambios",
        backgroundImagesTitle: "🖼️ Imágenes del Fondo", importPng: "⬆️ Importar PNG",
        pngHelpText: "Solo se permiten archivos .png. Se copian automáticamente a BackgroundImages de la versión seleccionada.",
        mainImageLabel: "Imagen Principal (Image):", blurredImageLabel: "Imagen Desenfocada (BlurredImage):",
        selectFromFolder: "-- Seleccionar --",
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
        restoreOriginalsError: "Error al restaurar los archivos del juego.",
        imagesSourceTitle: "Carpeta de mis imágenes PNG",
        imagesSourceHelp: "Guardá tus PNGs en una carpeta propia fuera del juego. La app los copiará a BackgroundImages cuando sea necesario — si Hytale los borra al actualizar, hacé clic en Aplicar imágenes para restaurarlos sin tener que subirlos de nuevo.",
        imagesSourceSaveBtn: "💾 Guardar y aplicar",
        imagesSourceApplyBtn: "▶️ Aplicar imágenes",
        imagesSourceRemoveBtn: "🗑️ Quitar del juego",
        imagesSourceRemoveTitle: "Elimina del juego solo las imágenes que están en tu carpeta (no borra las originales de Hytale)",
        imagesSourceRemoveConfirm: "¿Eliminar del juego las imágenes de tu carpeta?\n\nSolo se borrarán los archivos que vos pusiste (los que están en tu carpeta fuente).\nLas imágenes originales de Hytale NO se verán afectadas.\n\n¿Continuar?",
        imagesSourceRemoveDone: "imagen(es) eliminada(s) del juego.",
        imagesSourceGearTitle: "Cambiar carpeta de imágenes",
        helpBtnLabel: "❓ Ayuda",
        helpBtnTitle: "¿Ves un error de validación en Hytale? Haz clic para ver cómo solucionarlo",
        previewBtnLabel: "Preview", previewBtnTitle: "Previsualizar el fondo y las partículas",
        previewTitle: "Vista previa del menú", previewNoImage: "Selecciona una imagen PNG para ver el fondo.",
        previewLoading: "Cargando imagen...", previewImageUnavailable: "No se pudo cargar esta imagen. Comprueba que exista en BackgroundImages.",
        previewParticlesTitle: "Partículas", previewNoParticles: "Agrega una partícula para editarla en la vista previa.",
        restoreOriginalsTooltip: "¿Salió una nueva versión de Hytale? Usá este botón ANTES de actualizar para devolver los archivos del juego a su estado original. Así el launcher no los detecta como corruptos y la actualización sale sin problemas.",
        clearPathTitle: "Limpiar ruta guardada",
        openFolderTitle: "Abrir carpeta de texturas BackgroundImages",
        refreshPresetsTitle: "Actualizar lista de imágenes disponibles",
        refreshPresetsBtn: "🔄 Actualizar",
        refreshPresetsDone: "✅ Actualizado",
        badgeTextures: "Carpeta BackgroundImages",
        statusChecking: "Comprobando...",
        statusFilesFound: "✅ ¡Archivos necesarios encontrados!",
        statusFilesNotFound: "⚠️ Archivos de Hytale no detectados en esta versión o ruta.",
        statusScanning: "⏳ Buscando archivos recursivamente...",
        helpModalTitle: "¿El juego muestra un error de validación?",
        helpModalSubtitle: "/ Game file validation failed?",
        helpModalOpt1Title: "✅ Opción 1 — Desde esta app (recomendado)",
        helpModalOpt1Desc: "Hacé clic en el botón <strong>🔄 Restaurar archivos originales del juego</strong> que está arriba en esta pantalla.",
        helpModalOpt2Title: "🔁 Opción 2 — Desde el launcher de Hytale (si la opción 1 no funciona)",
        helpModalOpt2Step1: "Abrí el launcher de Hytale",
        helpModalOpt2Step2: "Andá a <strong>Configuración → Manage Versions</strong>",
        helpModalOpt2Step3: "Buscá tu versión instalada <em>(ej: pre-release / release)</em>",
        helpModalOpt2Step4: "Hacé clic en <strong style=\"color:#f87171;\">UNINSTALL</strong> / Desinstalar",
        helpModalOpt2Step5: "Volvé a instalar la versión desde el launcher",
        helpModalOpt2Step6: "Abrí esta app y guardá tus cambios para volver a personalizar",
        helpModalRestoreBtn: "🔄 Restaurar archivos originales ahora",
        profilesBtnLabel: "⚙️ Perfiles",
        profilesModalTitle: "Administrador de Perfiles",
        profilesModalSubtitle: "Controla el perfil original oficial del juego (snapshot limpio) y tu perfil personalizado con partículas, imágenes y configuraciones.",
        profileOriginalTitle: "Perfil Original (Hytale Oficial)",
        profileOriginalDesc: "Snapshot de los archivos limpios del equipo de Hytale (MainMenuBackgrounds.json, carrusel y home). Úsalo cuando salga una nueva versión con nuevas imágenes y partículas para guardarla como versión original oficial.",
        profileCustomTitle: "Perfil Personalizado del Usuario",
        profileCustomDesc: "Contiene todas tus partículas 3D, imágenes personalizadas, visibilidad de noticias y posición del personaje. Puedes volver a ponerlas en el juego en cualquier momento con un solo clic.",
        warnSaveOriginalFirst: "⚠️ Debes ir a Perfiles y guardar primero la configuración original del juego antes de guardar tus cambios personalizados."
    },
    en: {
        versionLabel: "Version:", openTexturesFolder: "📁 Open Textures Folder",
        editingBackground: "Menu Background Editor", saveChanges: "💾 Save Changes",
        backgroundImagesTitle: "🖼️ Background Images", importPng: "⬆️ Import PNG",
        pngHelpText: "Only .png files allowed. Automatically copied to BackgroundImages for selected version.",
        mainImageLabel: "Main Image (Image):", blurredImageLabel: "Blurred Image (BlurredImage):",
        selectFromFolder: "-- Select --",
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
        avatarApply: "✅ Apply Character Position", avatarReset: "↺ Default", avatarStatusText: "Status:",
        avatarStatusVisible: "Visible", avatarStatusHidden: "Hidden (Width/Height: 0)",
        toastAvatarApplied: "Character configuration saved and applied!",
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
        restoreOriginalsError: "Error restoring game files.",
        imagesSourceTitle: "My PNG Images Folder",
        imagesSourceHelp: "Store your PNGs in a personal folder outside the game. The app will copy them to BackgroundImages when needed — if Hytale removes them after an update, click Apply Images to restore them without re-uploading.",
        imagesSourceSaveBtn: "💾 Save and apply",
        imagesSourceApplyBtn: "▶️ Apply images",
        imagesSourceRemoveBtn: "🗑️ Remove from game",
        imagesSourceRemoveTitle: "Removes from game only images in your folder (does not touch original Hytale images)",
        imagesSourceRemoveConfirm: "Remove images in your folder from the game?\n\nOnly files you added (from your source folder) will be deleted.\nOriginal Hytale images will NOT be affected.\n\nContinue?",
        imagesSourceRemoveDone: "image(s) removed from game.",
        imagesSourceGearTitle: "Change images folder",
        helpBtnLabel: "❓ Help",
        helpBtnTitle: "Seeing a validation error in Hytale? Click to see how to fix it",
        previewBtnLabel: "Preview", previewBtnTitle: "Preview the background and particles",
        previewTitle: "Menu preview", previewNoImage: "Select a PNG image to preview the background.",
        previewLoading: "Loading image...", previewImageUnavailable: "This image could not be loaded. Check that it exists in BackgroundImages.",
        previewParticlesTitle: "Particles", previewNoParticles: "Add a particle to edit it in the preview.",
        restoreOriginalsTooltip: "New Hytale version available? Use this button BEFORE updating to restore original game files so the launcher doesn't flag them as corrupted.",
        clearPathTitle: "Clear saved path",
        openFolderTitle: "Open BackgroundImages texture folder",
        refreshPresetsTitle: "Refresh available images list",
        refreshPresetsBtn: "🔄 Refresh",
        refreshPresetsDone: "✅ Refreshed",
        badgeTextures: "BackgroundImages Folder",
        statusChecking: "Checking...",
        statusFilesFound: "✅ Required files found!",
        statusFilesNotFound: "⚠️ Hytale files not detected in this version or path.",
        statusScanning: "⏳ Scanning files recursively...",
        helpModalTitle: "Is the game showing a validation error?",
        helpModalSubtitle: "/ Game file validation failed?",
        helpModalOpt1Title: "✅ Option 1 — From this app (recommended)",
        helpModalOpt1Desc: "Click the <strong>🔄 Restore original game files</strong> button at the top of this screen.",
        helpModalOpt2Title: "🔁 Option 2 — From the Hytale launcher (if option 1 fails)",
        helpModalOpt2Step1: "Open the Hytale launcher",
        helpModalOpt2Step2: "Go to <strong>Settings → Manage Versions</strong>",
        helpModalOpt2Step3: "Find your installed version <em>(e.g., pre-release / release)</em>",
        helpModalOpt2Step4: "Click <strong style=\"color:#f87171;\">UNINSTALL</strong>",
        helpModalOpt2Step5: "Reinstall the version from the launcher",
        helpModalOpt2Step6: "Open this app and save your changes to customize again",
        helpModalRestoreBtn: "🔄 Restore original files now",
        profilesBtnLabel: "⚙️ Profiles",
        profilesModalTitle: "Profiles Manager",
        profilesModalSubtitle: "Manage the official clean game snapshot and your custom profile containing particles, images and layout settings.",
        profileOriginalTitle: "Original Profile (Official Hytale)",
        profileOriginalDesc: "Clean snapshot of official Hytale files (MainMenuBackgrounds.json, carousel, and home). When a new game update arrives with new images and particles from the Hytale team, save it as the new original official version.",
        profileCustomTitle: "Custom User Profile",
        profileCustomDesc: "Holds all your 3D particles, custom images, and character settings. Re-apply them back to the game anytime with one click.",
        warnSaveOriginalFirst: "⚠️ Please go to Profiles and save the clean original game configuration before saving your customizations."
    },
    pt: {
        versionLabel: "Versão:", openTexturesFolder: "📁 Abrir Pasta de Texturas",
        editingBackground: "Editor de Fundo do Menu", saveChanges: "💾 Salvar",
        backgroundImagesTitle: "🖼️ Imagens de Fundo", importPng: "⬆️ Importar PNG",
        pngHelpText: "Apenas arquivos .png. Copiados automaticamente para BackgroundImages da versão seleccionada.",
        mainImageLabel: "Imagem Principal (Image):", blurredImageLabel: "Imagem Desfocada (BlurredImage):",
        selectFromFolder: "-- Selecionar --",
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
        avatarApply: "✅ Aplicar Posição do Personagem", avatarReset: "↺ Padrão", avatarStatusText: "Estado:",
        avatarStatusVisible: "Visível", avatarStatusHidden: "Oculto (Width/Height: 0)",
        toastAvatarApplied: "Configuração do personagem salva e aplicada!",
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
        restoreOriginalsError: "Erro ao restaurar os arquivos do jogo.",
        imagesSourceTitle: "Minha pasta de imagens PNG",
        imagesSourceHelp: "Guarde seus PNGs em uma pasta pessoal fora do jogo. O app os copiará para BackgroundImages quando necessário — se o Hytale os remover ao atualizar, clique em Aplicar imagens para restaurá-los sem precisar reenviá-los.",
        imagesSourceSaveBtn: "💾 Salvar e aplicar",
        imagesSourceApplyBtn: "▶️ Aplicar imagens",
        imagesSourceRemoveBtn: "🗑️ Remover do jogo",
        imagesSourceRemoveTitle: "Remove do jogo apenas as imagens da sua pasta (não afeta as originais do Hytale)",
        imagesSourceRemoveConfirm: "Remover do jogo as imagens da sua pasta?\n\nApenas os arquivos adicionados por você serão excluídos.\nAs imagens originais do Hytale NÃO serão afetadas.\n\nContinuar?",
        imagesSourceRemoveDone: "imagem(ns) removida(s) do jogo.",
        imagesSourceGearTitle: "Alterar pasta de imagens",
        helpBtnLabel: "❓ Ajuda",
        helpBtnTitle: "Vendo um erro de validação no Hytale? Clique para ver como resolver",
        previewBtnLabel: "Prévia", previewBtnTitle: "Visualizar o fundo e as partículas",
        previewTitle: "Prévia do menu", previewNoImage: "Selecione uma imagem PNG para visualizar o fundo.",
        previewLoading: "Carregando imagem...", previewImageUnavailable: "Não foi possível carregar esta imagem. Verifique se ela existe em BackgroundImages.",
        previewParticlesTitle: "Partículas", previewNoParticles: "Adicione uma partícula para editá-la na prévia.",
        restoreOriginalsTooltip: "Saiu uma nova versão do Hytale? Use este botão ANTES de atualizar para restaurar os arquivos originais e evitar erros no launcher.",
        clearPathTitle: "Limpar caminho salvo",
        openFolderTitle: "Abrir pasta de texturas BackgroundImages",
        refreshPresetsTitle: "Atualizar lista de imagens disponibles",
        refreshPresetsBtn: "🔄 Atualizar",
        refreshPresetsDone: "✅ Atualizado",
        badgeTextures: "Pasta BackgroundImages",
        statusChecking: "Verificando...",
        statusFilesFound: "✅ Arquivos necessários encontrados!",
        statusFilesNotFound: "⚠️ Arquivos do Hytale não detectados nesta versão ou caminho.",
        statusScanning: "⏳ Procurando arquivos recursivamente...",
        helpModalTitle: "O jogo mostra um erro de validação?",
        helpModalSubtitle: "/ Game file validation failed?",
        helpModalOpt1Title: "✅ Opção 1 — A partir deste app (recomendado)",
        helpModalOpt1Desc: "Clique no botão <strong>🔄 Restaurar arquivos originais do jogo</strong> no topo desta tela.",
        helpModalOpt2Title: "🔁 Opção 2 — Pelo inicializador do Hytale (se a opção 1 não funcionar)",
        helpModalOpt2Step1: "Abra o inicializador do Hytale",
        helpModalOpt2Step2: "Vá em <strong>Configurações → Manage Versions</strong>",
        helpModalOpt2Step3: "Encontre sua versão instalada <em>(ex: pre-release / release)</em>",
        helpModalOpt2Step4: "Clique em <strong style=\"color:#f87171;\">UNINSTALL</strong> / Desinstalar",
        helpModalOpt2Step5: "Reinstale a versão a partir do inicializador",
        helpModalOpt2Step6: "Abra este aplicativo e salve suas alterações para personalizar novamente",
        helpModalRestoreBtn: "🔄 Restaurar arquivos originais agora",
        profilesBtnLabel: "⚙️ Perfis",
        profilesModalTitle: "Gerenciador de Perfis",
        profilesModalSubtitle: "Controle o snapshot limpo oficial do jogo e seu perfil personalizado com partículas, imagens e configurações.",
        profileOriginalTitle: "Perfil Original (Oficial Hytale)",
        profileOriginalDesc: "Snapshot dos arquivos limpos da equipe Hytale (MainMenuBackgrounds.json, carrossel e home). Quando sair uma nova versão com novas imagens e partículas da equipe Hytale, salve-a como nova versão original oficial.",
        profileCustomTitle: "Perfil Personalizado do Usuário",
        profileCustomDesc: "Contém todas as suas partículas 3D, imagens personalizadas, visibilidade de notícias e posição do personagem. Reaplique tudo no jogo a qualquer momento com um clique.",
        warnSaveOriginalFirst: "⚠️ Você deve ir em Perfis e salvar primeiro a configuração original do juego antes de salvar suas personalizações."
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
const btnSaveOriginalProfile = document.getElementById('btn-save-original-profile');
const btnSaveCustomProfile = document.getElementById('btn-save-custom-profile');
const btnApplyCustomProfile = document.getElementById('btn-apply-custom-profile');
const btnOpenPreview = document.getElementById('btn-open-preview');
const previewModal = document.getElementById('modal-preview');
const previewCanvas = document.getElementById('preview-canvas');
const previewImage = document.getElementById('preview-bg-image');
const previewPlaceholder = document.getElementById('preview-placeholder');
const previewParticleList = document.getElementById('preview-particle-list');
const previewInspector = document.getElementById('preview-inspector');
const previewEmptySelection = document.getElementById('preview-empty-selection');
const btnPreviewAddParticle = document.getElementById('btn-preview-add-particle');
const btnAddVfx = document.getElementById('btn-add-vfx');
const btnApplyVfx = document.getElementById('btn-apply-vfx');
const vfxListEl = document.getElementById('vfx-list');
const toastEl = document.getElementById('toast');


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
    document.addEventListener('click', handleOriginalLockedIntercept, true);
    document.addEventListener('mousedown', handleOriginalLockedIntercept, true);
    await loadVersions();
    await checkGameVersionUpdate();
    await loadData();
    await loadAvatarStatus();
    await refreshTexturePresets();
    await refreshProfileStatus();
    updateLanguageUI();
    checkAppUpdate(); // No bloqueante — corre en background

    versionSelect.addEventListener('change', async e => {
        currentVersion = e.target.value;
        await checkGameVersionUpdate();
        const dataRes = await loadData();
        await loadAvatarStatus();
        await refreshTexturePresets();
        await refreshProfileStatus();
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

    btnSaveAll.addEventListener('click', async () => {
        await saveConfig();
        await refreshProfileStatus();
    });
    btnOpenFolder.addEventListener('click', () => fetch(`/api/open-folder?version=${encodeURIComponent(currentVersion)}`, { method: 'POST' }));
    btnAddVfx.addEventListener('click', addVfxEffect);
    btnApplyVfx.addEventListener('click', applyVfxChanges);

    const btnRefreshPresets = document.getElementById('btn-refresh-presets');
    if (btnRefreshPresets) {
        btnRefreshPresets.addEventListener('click', async () => {
            const t = translations[currentLang] || translations['es'];
            const original = t.refreshPresetsBtn || '🔄 Actualizar';
            btnRefreshPresets.disabled = true;
            btnRefreshPresets.textContent = '⏳';
            await refreshTexturePresets();
            btnRefreshPresets.textContent = t.refreshPresetsDone || '✅ Actualizado';
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
                    showToast(t.restoreOriginalsOk || '✅ Archivos originales restaurados.');

                    // Recargar toda la interfaz para reflejar el estado limpio original
                    await loadData();
                    await loadAvatarStatus();

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

    if (btnSaveOriginalProfile) {
        btnSaveOriginalProfile.addEventListener('click', async () => {
            const confirmed = confirm('¿Guardar el perfil original limpio de esta versión? Esto actualiza el snapshot base para esta instalación.');
            if (!confirmed) return;
            btnSaveOriginalProfile.disabled = true;
            btnSaveOriginalProfile.textContent = '⏳ Guardando...';
            try {
                const res = await fetch(`/api/save-original-profile?version=${encodeURIComponent(currentVersion)}`, { method: 'POST' }).then(r => r.json());
                btnSaveOriginalProfile.disabled = false;
                btnSaveOriginalProfile.textContent = res.success ? '✅ Perfil original guardado' : '💾 Guardar perfil original';
                showToast(res.success ? `✅ Perfil original guardado para ${currentVersion}.` : `❌ ${res.error || 'No se pudo guardar el perfil original.'}`, !res.success);
                await refreshProfileStatus();
            } catch (e) {
                btnSaveOriginalProfile.disabled = false;
                btnSaveOriginalProfile.textContent = '💾 Guardar perfil original';
                showToast('❌ Error de conexión al guardar el perfil original.', true);
            }
        });
    }

    if (btnSaveCustomProfile) {
        btnSaveCustomProfile.addEventListener('click', async () => {
            updateCurrentBgFromInputs();
            btnSaveCustomProfile.disabled = true;
            btnSaveCustomProfile.textContent = '⏳ Guardando...';
            try {
                // Primero asegurar que los cambios actuales se hayan guardado en los archivos si hay cambios pendientes
                const saveRes = await saveConfig();
                if (saveRes && saveRes.requireOriginalFirst) {
                    btnSaveCustomProfile.disabled = false;
                    btnSaveCustomProfile.textContent = '💾 Guardar configuración de perfil personalizado';
                    return;
                }
                const res = await fetch(`/api/save-custom-profile?version=${encodeURIComponent(currentVersion)}`, { method: 'POST' }).then(r => r.json());
                btnSaveCustomProfile.disabled = false;
                btnSaveCustomProfile.textContent = res.success ? '✅ Perfil personalizado guardado' : '💾 Guardar configuración de perfil personalizado';
                showToast(res.success ? `✅ Configuración de perfil personalizado guardada (${res.vfxCount || 0} partículas, ${res.images?.length || 0} imágenes).` : `❌ ${res.error || 'Error al guardar.'}`, !res.success);
                await refreshProfileStatus();
            } catch (e) {
                btnSaveCustomProfile.disabled = false;
                btnSaveCustomProfile.textContent = '💾 Guardar configuración de perfil personalizado';
                showToast('❌ Error de conexión al guardar el perfil personalizado.', true);
            }
        });
    }

    if (btnApplyCustomProfile) {
        btnApplyCustomProfile.addEventListener('click', async () => {
            btnApplyCustomProfile.disabled = true;
            btnApplyCustomProfile.textContent = '⏳ Aplicando...';
            try {
                const res = await fetch(`/api/apply-custom-profile?version=${encodeURIComponent(currentVersion)}`, { method: 'POST' }).then(r => r.json());
                btnApplyCustomProfile.disabled = false;
                btnApplyCustomProfile.textContent = res.success ? '✅ Perfil personalizado aplicado' : '🔁 Aplicar perfil personalizado';
                showToast(res.success ? `✅ Perfil personalizado reaplicado en ${currentVersion}.` : `❌ ${res.error || 'No hay perfil personalizado guardado.'}`, !res.success);
                if (res.success) {
                    await loadData();
                    await loadAvatarStatus();
                    await refreshTexturePresets();
                }
                await refreshProfileStatus();
            } catch (e) {
                btnApplyCustomProfile.disabled = false;
                btnApplyCustomProfile.textContent = '🔁 Aplicar perfil personalizado';
                showToast('❌ Error de conexión al reaplicar el perfil personalizado.', true);
            }
        });
    }

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
    initPreviewModal();
    initProfilesConfigModal();
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
            const t = translations[currentLang] || translations['es'];
            const confirmed = confirm(
                t.imagesSourceRemoveConfirm ||
                ('¿Eliminar del juego las imágenes de tu carpeta?\n\n' +
                'Solo se borrarán los archivos que vos pusiste (los que están en tu carpeta fuente).\n' +
                'Las imágenes originales de Hytale NO se verán afectadas.\n\n' +
                '¿Continuar?')
            );
            if (!confirmed) return;

            removeBtn.disabled = true;
            removeBtn.textContent = '⏳...';
            applyMsg.classList.add('hidden');

            try {
                const res = await fetch(`/api/remove-images-from-source?version=${encodeURIComponent(currentVersion)}`, {
                    method: 'POST'
                }).then(r => r.json());

                removeBtn.disabled = false;
                removeBtn.textContent = t.imagesSourceRemoveBtn || '🗑️ Quitar del juego';

                if (res.success) {
                    const cnt = res.removed ? res.removed.length : 0;
                    applyMsg.textContent = `🗑️ ${cnt} ` + (t.imagesSourceRemoveDone || 'imagen(es) eliminada(s) del juego.') + (res.notFound && res.notFound.length > 0 ? ` (${res.notFound.length})` : '');
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
                removeBtn.textContent = t.imagesSourceRemoveBtn || '🗑️ Quitar del juego';
                applyMsg.textContent = '❌ ' + (t.toastError || 'Error');
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

// ── Modal de Configuración de Perfiles (Original y Personalizado) ───────────────
function initProfilesConfigModal() {
    const modal = document.getElementById('modal-profiles-config');
    const openBtn = document.getElementById('btn-open-profiles-modal');
    const closeBtn = document.getElementById('modal-profiles-close');
    const okBtn = document.getElementById('modal-profiles-ok');
    if (!modal || !openBtn) return;

    function openModal() {
        modal.style.display = 'flex';
        refreshProfileStatus();
    }
    function closeModal() {
        modal.style.display = 'none';
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });
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
    const t = translations[currentLang] || translations['es'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!t[key]) return;
        if (el.tagName === 'INPUT' && el.placeholder !== undefined) el.placeholder = t[key];
        else if (el.tagName === 'OPTION') el.textContent = t[key];
        else el.innerHTML = t[key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (t[key]) el.title = t[key];
    });
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
    const t = translations[currentLang] || translations['es'];
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
    const t = translations[currentLang] || translations['es'];
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
    renderPreviewScene();
}

function updateCurrentBgFromInputs() {
    const bg = getActiveBg();
    if (!bg) return;
    bg.Image = imgNameInput.value.trim();
    bg.BlurredImage = blurredInput.value.trim();
    renderPreviewScene();
}

function renderVfxList(vfxArray) {
    const t = translations[currentLang] || translations['es'];
    vfxListEl.innerHTML = '';
    if (!vfxArray.length) {
        vfxListEl.innerHTML = `<p class="help-text" style="text-align:center;margin:15px 0;">${t.noVfxYet}</p>`;
        selectedPreviewParticle = 0;
        renderPreviewScene();
        return;
    }
    selectedPreviewParticle = Math.min(selectedPreviewParticle, vfxArray.length - 1);
    vfxArray.forEach((vfx, idx) => {
        const card = document.createElement('div');
        card.className = 'vfx-card' + (isOriginalLocked ? ' original-locked' : '');
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
                selectedPreviewParticle = idx;
                renderPreviewScene();
            });
        });
        card.addEventListener('click', () => {
            selectedPreviewParticle = idx;
            renderPreviewScene();
        });
        card.querySelector('.btn-icon-danger').addEventListener('click', () => {
            vfxArray.splice(idx, 1);
            selectedPreviewParticle = Math.min(selectedPreviewParticle, vfxArray.length - 1);
            renderVfxList(vfxArray);
        });
        vfxListEl.appendChild(card);
    });
    renderPreviewScene();
}

function addVfxEffect() {
    const bg = getActiveBg();
    if (!bg) return;
    if (!bg.Vfx) bg.Vfx = [];
    bg.Vfx.push({ SystemId: "Fireflies_GS", X: 0.5, Y: 0.5, Z: 10.0, Scale: 1.0 });
    selectedPreviewParticle = bg.Vfx.length - 1;
    renderVfxList(bg.Vfx);
}

function initPreviewModal() {
    const closeButton = document.getElementById('btn-close-preview');
    const previewResizeObserver = new ResizeObserver(renderPreviewScene);
    previewResizeObserver.observe(previewCanvas);
    const openModal = () => {
        previewModal.style.display = 'flex';
        renderPreviewScene();
    };
    const closeModal = () => { previewModal.style.display = 'none'; };

    btnOpenPreview.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    btnPreviewAddParticle.addEventListener('click', addVfxEffect);
    previewModal.addEventListener('click', event => {
        if (event.target === previewModal) closeModal();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && previewModal.style.display === 'flex') closeModal();
    });

    previewInspector.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', () => {
            const bg = getActiveBg();
            const vfx = bg && bg.Vfx && bg.Vfx[selectedPreviewParticle];
            if (!vfx) return;
            const field = input.dataset.field;
            const isNum = input.type === 'number' || input.type === 'range';
            const val = isNum ? (parseFloat(input.value) || 0) : input.value;
            vfx[field] = val;

            // Sincronizar pares (slider <-> number) dentro del inspector
            previewInspector.querySelectorAll(`[data-field="${field}"]`).forEach(peer => {
                if (peer !== input) peer.value = input.value;
            });

            // Actualizar etiqueta badge si existe
            const valBadge = document.getElementById(`preview-${field.toLowerCase()}-val`);
            if (valBadge && isNum) {
                valBadge.textContent = Number(val).toFixed(field === 'X' || field === 'Y' ? 3 : 1);
            }

            // Sincronizar con la tarjeta de la lista principal
            const cardInput = vfxListEl.querySelectorAll('.vfx-card')[selectedPreviewParticle]
                ?.querySelector(`[data-field="${field}"]`);
            if (cardInput && cardInput !== input) cardInput.value = input.value;
            renderPreviewScene();
        });
    });
}

function renderPreviewScene() {
    if (!previewCanvas || !previewModal) return;
    const t = translations[currentLang] || translations.es;
    const bg = getActiveBg();
    const imagePath = bg && bg.Image ? bg.Image.split(/[\\/]/).pop() : '';
    const imageUrl = imagePath
        ? `/api/texture-file?version=${encodeURIComponent(currentVersion)}&file=${encodeURIComponent(imagePath)}`
        : '';

    if (imageUrl && previewImage.complete && !previewImage.naturalWidth) {
        previewPlaceholder.textContent = t.previewImageUnavailable;
    } else if (!imageUrl) {
        previewPlaceholder.textContent = t.previewNoImage;
    } else if (!previewImage.complete) {
        previewPlaceholder.textContent = t.previewLoading;
    }

    if (previewImage.dataset.src !== imageUrl) {
        previewImage.dataset.src = imageUrl;
        previewImage.onload = () => {
            previewPlaceholder.classList.add('hidden');
            renderPreviewScene();
        };
        previewImage.onerror = () => {
            previewPlaceholder.textContent = (translations[currentLang] || translations.es).previewImageUnavailable;
            previewPlaceholder.classList.remove('hidden');
        };
        if (imageUrl) previewImage.src = imageUrl;
        else previewImage.removeAttribute('src');
    }

    const particles = bg && Array.isArray(bg.Vfx) ? bg.Vfx : [];
    const canvasWidth = previewCanvas.clientWidth;
    const canvasHeight = previewCanvas.clientHeight;
    const sourceWidth = previewImage.naturalWidth || canvasWidth;
    const sourceHeight = previewImage.naturalHeight || canvasHeight;
    const fitScale = canvasWidth && canvasHeight && sourceWidth && sourceHeight
        ? Math.min(canvasWidth / sourceWidth, canvasHeight / sourceHeight)
        : 0;
    const imageWidth = sourceWidth * fitScale;
    const imageHeight = sourceHeight * fitScale;
    const imageLeft = (canvasWidth - imageWidth) / 2;
    const imageTop = (canvasHeight - imageHeight) / 2;
    previewCanvas.querySelectorAll('.particle-marker-box').forEach(marker => marker.remove());
    previewParticleList.innerHTML = '';
    if (!particles.length) {
        previewParticleList.innerHTML = `<p class="preview-empty-selection">${translations[currentLang].previewNoParticles}</p>`;
        previewInspector.classList.add('hidden');
        previewEmptySelection.classList.remove('hidden');
        return;
    }

    selectedPreviewParticle = Math.max(0, Math.min(selectedPreviewParticle, particles.length - 1));
    previewInspector.classList.remove('hidden');
    previewEmptySelection.classList.add('hidden');

    particles.forEach((particle, index) => {
        const x = Number.isFinite(Number(particle.X)) ? Number(particle.X) : 0.5;
        const y = Number.isFinite(Number(particle.Y)) ? Number(particle.Y) : 0.5;
        const z = Number.isFinite(Number(particle.Z)) ? Number(particle.Z) : 10;
        const scale = Number.isFinite(Number(particle.Scale)) ? Math.abs(Number(particle.Scale)) : 1;
        const depthFactor = Math.min(1.8, Math.max(0.35, 10 / Math.max(Math.abs(z), 0.1)));
        const width = Math.min(42, Math.max(7, scale * depthFactor * 18));
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = `particle-marker-box${index === selectedPreviewParticle ? ' selected' : ''}`;
        marker.style.left = `${imageLeft + Math.max(0, Math.min(1, x)) * imageWidth}px`;
        marker.style.top = `${imageTop + Math.max(0, Math.min(1, y)) * imageHeight}px`;
        marker.style.width = `${imageWidth * width / 100}px`;
        marker.style.aspectRatio = '1.4 / 1';
        marker.setAttribute('aria-label', particle.SystemId || `Particle ${index + 1}`);
        const markerLabel = document.createElement('span');
        markerLabel.className = 'particle-marker-tag';
        markerLabel.textContent = particle.SystemId || `Particle ${index + 1}`;
        marker.appendChild(markerLabel);

        // Arrastre directo de la partícula en el canvas
        let isDraggingMarker = false;
        marker.addEventListener('pointerdown', e => {
            e.stopPropagation();
            selectedPreviewParticle = index;
            isDraggingMarker = true;
            marker.setPointerCapture(e.pointerId);
            renderPreviewScene();
        });

        marker.addEventListener('pointermove', e => {
            if (!isDraggingMarker) return;
            e.stopPropagation();
            const canvasRect = previewCanvas.getBoundingClientRect();
            const relX = (e.clientX - canvasRect.left - imageLeft) / imageWidth;
            const relY = (e.clientY - canvasRect.top - imageTop) / imageHeight;
            const clampedX = Math.round(Math.max(0, Math.min(1, relX)) * 1000) / 1000;
            const clampedY = Math.round(Math.max(0, Math.min(1, relY)) * 1000) / 1000;

            particle.X = clampedX;
            particle.Y = clampedY;

            // Actualizar inputs del inspector
            const xRange = document.getElementById('preview-x-range');
            const xNum = document.getElementById('preview-x');
            const yRange = document.getElementById('preview-y-range');
            const yNum = document.getElementById('preview-y');
            const xBadge = document.getElementById('preview-x-val');
            const yBadge = document.getElementById('preview-y-val');
            if (xRange) xRange.value = clampedX;
            if (xNum) xNum.value = clampedX;
            if (yRange) yRange.value = clampedY;
            if (yNum) yNum.value = clampedY;
            if (xBadge) xBadge.textContent = clampedX.toFixed(3);
            if (yBadge) yBadge.textContent = clampedY.toFixed(3);

            // Posición directa del marker
            marker.style.left = `${imageLeft + clampedX * imageWidth}px`;
            marker.style.top = `${imageTop + clampedY * imageHeight}px`;

            // Sincronizar inputs en la lista principal
            const cardX = vfxListEl.querySelectorAll('.vfx-card')[index]?.querySelector('[data-field="X"]');
            const cardY = vfxListEl.querySelectorAll('.vfx-card')[index]?.querySelector('[data-field="Y"]');
            if (cardX) cardX.value = clampedX;
            if (cardY) cardY.value = clampedY;
        });

        const stopDragging = e => {
            if (isDraggingMarker) {
                isDraggingMarker = false;
                try { marker.releasePointerCapture(e.pointerId); } catch (_) {}
                renderPreviewScene();
            }
        };
        marker.addEventListener('pointerup', stopDragging);
        marker.addEventListener('pointercancel', stopDragging);

        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedPreviewParticle = index;
            renderPreviewScene();
        });
        previewCanvas.appendChild(marker);

        const listItem = document.createElement('button');
        listItem.type = 'button';
        listItem.className = `preview-particle-item${index === selectedPreviewParticle ? ' selected' : ''}`;
        const title = document.createElement('span');
        title.className = 'preview-particle-title';
        const name = document.createElement('span');
        name.textContent = particle.SystemId || `Particle ${index + 1}`;
        title.appendChild(name);
        const details = document.createElement('span');
        details.className = 'preview-particle-details';
        details.innerHTML = `<span><strong>X:</strong> ${Number(x).toFixed(3)}</span><span><strong>Y:</strong> ${Number(y).toFixed(3)}</span><span><strong>Z:</strong> ${Number(z).toFixed(1)}</span><span><strong>Esc:</strong> ${Number(particle.Scale ?? 1).toFixed(1)}</span>`;
        listItem.append(title, details);
        listItem.addEventListener('click', () => {
            selectedPreviewParticle = index;
            renderPreviewScene();
        });
        previewParticleList.appendChild(listItem);
    });

    const selected = particles[selectedPreviewParticle];
    if (selected) {
        previewInspector.querySelectorAll('[data-field]').forEach(input => {
            if (document.activeElement !== input) {
                input.value = selected[input.dataset.field] ?? (input.dataset.field === 'Scale' ? 1 : 0);
            }
        });
        ['X', 'Y', 'Z', 'Scale'].forEach(field => {
            const badge = document.getElementById(`preview-${field.toLowerCase()}-val`);
            if (badge && selected[field] !== undefined) {
                badge.textContent = Number(selected[field]).toFixed(field === 'X' || field === 'Y' ? 3 : 1);
            }
        });
    }
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
    const t = translations[currentLang] || translations['es'];
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

async function checkOriginalSavedBeforeCustomizing() {
    try {
        const res = await fetch(`/api/profiles/status?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
        if (res && res.success) {
            if (!res.originalSaved || res.needsOriginalSnapshot) {
                const t = translations[currentLang] || translations['es'];
                const msg = t.warnSaveOriginalFirst || '⚠️ Debes ir a Perfiles y guardar primero la configuración original del juego antes de guardar tus cambios personalizados.';
                showToast(msg, true);

                // Abrir automáticamente el modal de Perfiles para que el usuario pueda guardarlo de inmediato
                const modal = document.getElementById('modal-profiles-config');
                if (modal) {
                    modal.style.display = 'flex';
                    await refreshProfileStatus();
                }
                return false;
            }
        }
    } catch (_) {}
    return true;
}

async function saveConfig() {
    updateCurrentBgFromInputs();
    const canSave = await checkOriginalSavedBeforeCustomizing();
    if (!canSave) {
        return { success: false, requireOriginalFirst: true };
    }

    const res = await fetch(`/api/config?version=${encodeURIComponent(currentVersion)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentConfig)
    }).then(r => r.json());

    if (!res.success && res.requireOriginalFirst) {
        const t = translations[currentLang] || translations['es'];
        showToast(t.warnSaveOriginalFirst || res.error, true);
        const modal = document.getElementById('modal-profiles-config');
        if (modal) {
            modal.style.display = 'flex';
            await refreshProfileStatus();
        }
        return res;
    }

    showToast(res.success ? translations[currentLang].toastSaved : `Error: ${res.error}`, !res.success);
    return res;
}

async function refreshProfileStatus() {
    try {
        const res = await fetch(`/api/profiles/status?version=${encodeURIComponent(currentVersion)}`).then(r => r.json());
        if (!res || !res.success) return;

        const origBadge = document.getElementById('profile-original-status-badge');
        const origDetails = document.getElementById('profile-original-details');
        const custBadge = document.getElementById('profile-custom-status-badge');
        const custDetails = document.getElementById('profile-custom-details');

        // Snapshot original
        if (origBadge) {
            if (res.needsOriginalSnapshot) {
                origBadge.textContent = '⚡ Nueva versión detectada';
                origBadge.style.background = 'rgba(245,158,11,0.2)';
                origBadge.style.color = '#fbbf24';
                origBadge.style.borderColor = 'rgba(245,158,11,0.4)';
            } else if (res.originalSaved) {
                origBadge.textContent = '✅ Original oficial guardado';
                origBadge.style.background = 'rgba(56,189,248,0.2)';
                origBadge.style.color = '#38bdf8';
                origBadge.style.borderColor = 'rgba(56,189,248,0.4)';
            } else {
                origBadge.textContent = '⚠️ Sin snapshot original';
                origBadge.style.background = 'rgba(239,68,68,0.2)';
                origBadge.style.color = '#f87171';
                origBadge.style.borderColor = 'rgba(239,68,68,0.4)';
            }
        }

        if (origDetails) {
            if (res.needsOriginalSnapshot) {
                origDetails.innerHTML = `<strong style="color:#fbbf24;">¡Atención!</strong> Se detectó una nueva versión instalada del juego con archivos limpios actualizados. Dale a <strong>"Guardar esta nueva versión como original"</strong> para fijarla como la versión base oficial.`;
            } else if (res.originalSaved) {
                const dateStr = res.originalDetails && res.originalDetails.savedAt ? new Date(res.originalDetails.savedAt).toLocaleString() : 'Previamente';
                const fileList = res.originalDetails && res.originalDetails.files ? res.originalDetails.files.join(', ') : 'Archivos base';
                origDetails.innerHTML = `Snapshot base guardado el: <strong>${dateStr}</strong><br><span style="color:#94a3b8; font-size:0.75rem;">Archivos respaldados: ${fileList}</span>`;
            } else {
                origDetails.textContent = 'Aún no se ha respaldado la copia original oficial para esta versión.';
            }
        }

        if (btnSaveOriginalProfile) {
            btnSaveOriginalProfile.disabled = !res.canSaveOriginal;
            btnSaveOriginalProfile.textContent = res.needsOriginalSnapshot
                ? '💾 Guardar esta nueva versión como original'
                : (res.originalSaved ? '💾 Actualizar snapshot original' : '💾 Guardar versión como original');
        }

        // Perfil personalizado
        if (custBadge) {
            if (res.hasCustomProfile) {
                custBadge.textContent = '✅ Perfil personalizado activo';
                custBadge.style.background = 'rgba(16,185,129,0.2)';
                custBadge.style.color = '#34d399';
                custBadge.style.borderColor = 'rgba(16,185,129,0.4)';
            } else {
                custBadge.textContent = '⚪ Sin personalización previa';
                custBadge.style.background = 'rgba(148,163,184,0.2)';
                custBadge.style.color = '#94a3b8';
                custBadge.style.borderColor = 'rgba(148,163,184,0.3)';
            }
        }

        if (custDetails) {
            if (res.hasCustomProfile && res.customDetails) {
                const dateStr = res.customDetails.updatedAt ? new Date(res.customDetails.updatedAt).toLocaleString() : 'Guardado recientemente';
                const imgs = res.customDetails.images && res.customDetails.images.length ? res.customDetails.images.join(', ') : 'Ninguna';
                custDetails.innerHTML = `Última personalización: <strong>${dateStr}</strong><br>` +
                    `✨ <strong>Partículas:</strong> ${res.customDetails.vfxCount} efecto(s) &nbsp;|&nbsp; ` +
                    `🖼️ <strong>Imágenes:</strong> ${res.customDetails.imagesCount} PNG(s) (${imgs})`;
            } else {
                custDetails.textContent = 'Modifica el fondo o añade partículas en el editor y guarda los cambios para crear tu perfil personalizado.';
            }
        }

        if (btnApplyCustomProfile) {
            btnApplyCustomProfile.disabled = !res.hasCustomProfile;
            btnApplyCustomProfile.textContent = res.hasCustomProfile
                ? '🔁 Volver a poner mi personalización (Partículas e Imágenes)'
                : '🔒 Sin perfil personalizado guardado';
        }

        // Bloquear/desbloquear controles de personalización si no hay snapshot original oficial
        applyOriginalLockUI(!res.originalSaved || res.needsOriginalSnapshot);
    } catch (e) {
        console.error('Error al consultar el estado de perfiles:', e);
    }
}

// Bloquea o desbloquea controles de personalización hasta que se guarde la versión original
let isOriginalLocked = false;
function applyOriginalLockUI(locked) {
    isOriginalLocked = locked;
    const lockableElements = [
        btnOpenPreview,
        btnSaveAll,
        document.querySelector('label[for="file-upload"]'),
        document.getElementById('btn-images-source-save'),
        document.getElementById('btn-images-source-apply'),
        document.getElementById('btn-images-source-remove'),
        selectImgPreset,
        selectBlurPreset,
        imgNameInput,
        blurredInput,
        chkAvatarVisible,
        avatarTopSlider,
        avatarTopNum,
        avatarLeftSlider,
        avatarLeftNum,
        btnApplyAvatar,
        btnResetAvatar,
        btnAddVfx,
        btnApplyVfx
    ].filter(Boolean);

    lockableElements.forEach(el => {
        if (locked) {
            el.classList.add('original-locked');
            if ('disabled' in el && el.tagName !== 'LABEL') {
                el.setAttribute('data-lock-disabled', 'true');
            }
        } else {
            el.classList.remove('original-locked');
            el.removeAttribute('data-lock-disabled');
        }
    });

    const vfxCards = vfxListEl ? vfxListEl.querySelectorAll('.vfx-card') : [];
    vfxCards.forEach(card => {
        if (locked) card.classList.add('original-locked');
        else card.classList.remove('original-locked');
    });
}

function handleOriginalLockedIntercept(e) {
    if (!isOriginalLocked) return false;
    const target = e.target;
    // Si el clic fue dentro o sobre un elemento bloqueado (pero no dentro del modal de perfiles)
    if (target.closest('#modal-profiles-config') || target.closest('#btn-open-profiles-modal') || target.closest('#version-select') || target.closest('#lang-select')) {
        return false;
    }
    const lockedEl = target.closest('.original-locked');
    if (lockedEl) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const t = translations[currentLang] || translations['es'];
        showToast(t.warnSaveOriginalFirst || '⚠️ Debes ir a Perfiles y guardar primero la configuración original del juego antes de guardar tus personalizaciones.', true);
        const modal = document.getElementById('modal-profiles-config');
        if (modal) {
            modal.style.display = 'flex';
            refreshProfileStatus();
        }
        return true;
    }
    return false;
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
const badgeHomepage = document.getElementById('badge-homepage');

function updateFileBadges(detected, details = {}) {
    if (!badgeJson) return;
    const t = translations[currentLang] || translations['es'];

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
    const hasHome = !!(details.homePagePath && (details.homePagePathExists !== undefined ? details.homePagePathExists : true));

    setBadge(badgeJson, 'MainMenuBackgrounds.json', hasJson && detected);
    setBadge(badgeTextures, t.badgeTextures || 'Carpeta BackgroundImages', hasTextures && detected);
    setBadge(badgeHomepage, 'HomePage.ui', hasHome && detected);

    if (linuxStatusSummary) {
        if (detected && hasJson) {
            linuxStatusSummary.textContent = t.statusFilesFound || '✅ ¡Archivos necesarios encontrados!';
            linuxStatusSummary.style.color = '#10b981';
        } else {
            linuxStatusSummary.textContent = t.statusFilesNotFound || '⚠️ Archivos de Hytale no detectados en esta versión o ruta.';
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
    const t = translations[currentLang] || translations['es'];
    const p = (pathValue || (linuxFolderInput ? linuxFolderInput.value : '')).trim();
    if (!p) {
        showToast('Ingresa una ruta para buscar', true);
        return;
    }

    if (linuxStatusSummary) {
        linuxStatusSummary.textContent = t.statusScanning || '⏳ Buscando archivos recursivamente...';
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
    await loadAvatarStatus();
    await refreshTexturePresets();
}

checkLinuxHytaleStatus();
init();



