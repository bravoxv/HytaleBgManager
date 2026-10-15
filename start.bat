@echo off
setlocal enabledelayedexpansion
:: Hytale BG Manager — Lanzador Windows
cd /d "%~dp0"
title Hytale BG Manager

echo ========================================================
echo               Hytale BG Manager Launcher
echo ========================================================
echo Directorio: %CD%
echo.

:: 1. Asegurar rutas habituales en el PATH de la sesion
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0\;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LocalAppData%\Programs\node;%AppData%\npm;%PATH%"

:: 2. Comprobar si Node.js y npm estan disponibles
set "NODE_OK=0"
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    where npm >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "NODE_OK=1"
    )
)

:: Si no se encuentran en PATH, buscar rutas tipicas fijas
if "!NODE_OK!"=="0" (
    if exist "%ProgramFiles%\nodejs\node.exe" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
        set "NODE_OK=1"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
        set "NODE_OK=1"
    ) else if exist "%LocalAppData%\Programs\node\node.exe" (
        set "PATH=%LocalAppData%\Programs\node;%PATH%"
        set "NODE_OK=1"
    )
)

:: Si sigue sin encontrarse, solicitar e instalar Node.js automaticamente
if "!NODE_OK!"=="0" (
    echo [!] Node.js no se encuentra instalado en este equipo.
    echo     Hytale BG Manager lo necesita para descargar librerias y ejecutarse.
    echo.
    echo Deseas descargarlo e instalarlo automaticamente ahora?
    set "INST_NODE=S"
    set /p "INST_NODE=[S] Si  /  [N] No (Enter para Si): "
    if /i "!INST_NODE!"=="N" (
        echo.
        echo No se puede continuar sin Node.js.
        echo Puedes instalarlo tu mismo desde: https://nodejs.org/
        echo.
        pause
        exit /b 1
    )

    echo.
    echo ========================================================
    echo Descargando e instalando Node.js LTS...
    echo ========================================================

    where winget >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo Usando Windows Package Manager (winget)...
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
    ) else (
        echo Descargando instalador oficial de Node.js via PowerShell...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $wc = New-Object System.Net.WebClient; $wc.DownloadFile('https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi', 'node_installer.msi')"
        if exist node_installer.msi (
            echo Ejecutando instalador... Sigue los pasos en pantalla.
            msiexec /i node_installer.msi /passive
            del node_installer.msi >nul 2>&1
        ) else (
            echo No se pudo descargar automaticamente. Abriendo pagina oficial...
            start https://nodejs.org/
            pause
            exit /b 1
        )
    )

    :: Recargar rutas tipicas tras la instalacion
    set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"
    where node >nul 2>nul
    if %ERRORLEVEL% neq 0 (
        echo.
        echo ========================================================
        echo [OK] Node.js se ha instalado correctamente.
        echo Por favor, CIERRA esta ventana y vuelve a hacer doble clic
        echo en 'start.bat' para que Windows reconozca los cambios.
        echo ========================================================
        echo.
        pause
        exit /b 0
    )
)

echo [OK] Node.js detectado:
node -v
npm -v
echo.

:: 3. Verificar e instalar dependencias si faltan
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
if not exist "node_modules\electron" set "NEED_INSTALL=1"
if not exist "node_modules\express" set "NEED_INSTALL=1"

if "!NEED_INSTALL!"=="1" (
    echo ========================================================
    echo Instalando dependencias necesarias (npm install)...
    echo Esto puede tardar 1 o 2 minutos en la primera ejecucion.
    echo ========================================================
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Hubo un problema al instalar las dependencias con npm.
        pause
        exit /b %ERRORLEVEL%
    )
    echo.
)

:: 4. Verificar ejecutable de Electron
if not exist "node_modules\electron\dist\electron.exe" (
    echo Reparando binarios de Electron...
    call npx electron install
    if not exist "node_modules\electron\dist\electron.exe" (
        call npm install electron --save-dev
    )
)

:: 5. Iniciar la aplicacion
echo ========================================================
echo Iniciando Hytale BG Manager...
echo ========================================================
echo.

if exist "node_modules\electron\dist\electron.exe" (
    start "" "node_modules\electron\dist\electron.exe" .
) else (
    call npx electron .
)

set EXIT=%ERRORLEVEL%
if %EXIT% neq 0 (
    echo.
    echo [AVISO] La aplicacion finalizo con codigo de salida: %EXIT%
    pause
)
