@echo off
setlocal
cd /d "%~dp0"
title Hytale BG Manager Launcher

echo ========================================================
echo               Hytale BG Manager Launcher
echo ========================================================
echo Carpeta del proyecto: %CD%
echo.

:: 1. Incluir rutas estandar en el PATH por si Windows no las tiene en la sesion actual
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0\;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LocalAppData%\Programs\node;%AppData%\npm;%PATH%"

:: 2. Comprobar si Node.js y npm estan accesibles
set "NODE_EXISTS=0"
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    where npm >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "NODE_EXISTS=1"
    )
)

:: Revisar ubicaciones fisicas habituales de node.exe si 'where' fallo
if "%NODE_EXISTS%"=="0" (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
        set "NODE_EXISTS=1"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
        set "NODE_EXISTS=1"
    ) else if exist "%LocalAppData%\Programs\node\node.exe" (
        set "PATH=%LocalAppData%\Programs\node;%PATH%"
        set "NODE_EXISTS=1"
    )
)

:: 3. Si no existe Node.js, descargarlo mostrando barra de progreso real y lanzar instalador con GUI
if "%NODE_EXISTS%"=="0" (
    echo [AVISO] Node.js no esta instalado en tu PC.
    echo Hytale BG Manager requiere Node.js para descargar sus librerias y ejecutarse.
    echo.
    echo Descargando el instalador oficial de Node.js LTS...
    echo (Por favor espera mientras se descarga el archivo)
    echo.

    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "$ProgressPreference = 'Continue'; ^
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; ^
        $url = 'https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi'; ^
        $output = 'node_installer.msi'; ^
        Write-Host 'Descargando desde: ' $url; ^
        try { ^
            Invoke-WebRequest -Uri $url -OutFile $output; ^
            Write-Host 'Descarga finalizada con exito.' -ForegroundColor Green; ^
        } catch { ^
            Write-Host 'Error al descargar: ' $_.Exception.Message -ForegroundColor Red; ^
            exit 1; ^
        }"

    if not exist "node_installer.msi" (
        echo.
        echo [ERROR] No se pudo descargar el instalador automaticamente.
        echo Abriendo el navegador para que lo descargues manualmente...
        start https://nodejs.org/
        echo.
        echo Una vez instalado Node.js, vuelve a abrir start.bat.
        pause
        exit /b 1
    )

    echo.
    echo ========================================================
    echo Iniciando el instalador de Node.js...
    echo Completa la instalacion en la ventana que aparecera.
    echo IMPORTANTE: Deja marcadas las casillas por defecto (Add to PATH).
    echo ========================================================
    echo.
    
    :: Ejecutar instalador interactivo para que el usuario vea el progreso y dé permisos de administrador si lo pide
    start /wait msiexec /i node_installer.msi
    if exist "node_installer.msi" del "node_installer.msi" >nul 2>&1

    :: Actualizar PATH local
    set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"

    echo.
    echo ========================================================
    echo Node.js ha sido instalado.
    echo Por favor, CIERRA esta ventana y haz doble clic en 'start.bat'
    echo nuevamente para que Windows cargue los nuevos permisos.
    echo ========================================================
    echo.
    pause
    exit /b 0
)

echo [OK] Node.js detectado:
node -v
npm -v
echo.

:: 4. Verificar dependencias e instalar con npm mostrando progreso en vivo
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
if not exist "node_modules\electron" set "NEED_INSTALL=1"
if not exist "node_modules\express" set "NEED_INSTALL=1"

if "%NEED_INSTALL%"=="1" (
    echo ========================================================
    echo Instalando librerias y dependencias (npm install)...
    echo Mostrando progreso en pantalla, por favor espera...
    echo ========================================================
    echo.
    call npm install --progress=true --loglevel=info
    if errorlevel 1 (
        echo.
        echo [ERROR] Hubo un fallo al ejecutar npm install.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas correctamente.
    echo.
)

:: 5. Comprobar que el ejecutable de Electron este presente
if not exist "node_modules\electron\dist\electron.exe" (
    echo ========================================================
    echo Descargando binario de Electron para Windows...
    echo ========================================================
    call npx electron install
    if not exist "node_modules\electron\dist\electron.exe" (
        call npm install electron --save-dev
    )
)

:: 6. Iniciar la aplicacion y mantener la ventana abierta si ocurre algun error
echo ========================================================
echo Iniciando Hytale BG Manager...
echo ========================================================
echo.

if exist "node_modules\electron\dist\electron.exe" (
    "node_modules\electron\dist\electron.exe" .
) else (
    call npx electron .
)

set "APP_EXIT=%ERRORLEVEL%"
if %APP_EXIT% neq 0 (
    echo.
    echo [AVISO] La aplicacion se cerro con codigo de salida: %APP_EXIT%
    echo Presiona una tecla para salir.
    pause
)
