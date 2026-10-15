@echo off
setlocal
cd /d "%~dp0"
title Hytale BG Manager Launcher

echo ========================================================
echo               Hytale BG Manager Launcher
echo ========================================================
echo Carpeta del proyecto: %CD%
echo.

:: 1. Incluir rutas de Node.js por defecto en PATH de la sesion
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0\;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LocalAppData%\Programs\node;%AppData%\npm;%PATH%"

:: 2. Verificar si Node.js y npm ya estan disponibles
set "NODE_EXISTS=0"
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    where npm >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "NODE_EXISTS=1"
    )
)

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

:: 3. Si no existe Node.js, descargarlo con curl nativo o powershell en una sola linea
if "%NODE_EXISTS%"=="0" (
    echo [AVISO] Node.js no esta instalado en tu PC.
    echo Hytale BG Manager requiere Node.js para descargar librerias y ejecutarse.
    echo.
    echo Descargando el instalador oficial de Node.js LTS...
    echo.

    set "DOWNLOADED=0"
    
    :: Metodo A: Usar curl.exe (incluido de forma nativa en Windows 10 y 11)
    where curl >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo Usando curl para descargar...
        curl.exe -# -L -o "node_installer.msi" "https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi"
        if exist "node_installer.msi" set "DOWNLOADED=1"
    )

    :: Metodo B: PowerShell si curl no estuviera disponible
    if "%DOWNLOADED%"=="0" (
        echo Usando PowerShell para descargar...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi', 'node_installer.msi')"
        if exist "node_installer.msi" set "DOWNLOADED=1"
    )

    if not exist "node_installer.msi" (
        echo.
        echo [ERROR] No se pudo descargar el instalador automaticamente.
        echo Abriendo navegador en la pagina oficial de Node.js...
        start https://nodejs.org/
        echo.
        echo Instala Node.js y luego vuelve a abrir este archivo.
        pause
        exit /b 1
    )

    echo.
    echo ========================================================
    echo Abriendo instalador de Node.js...
    echo Sigue los pasos del asistente hasta completar la instalacion.
    echo ========================================================
    echo.
    start /wait msiexec /i node_installer.msi
    if exist "node_installer.msi" del "node_installer.msi" >nul 2>&1

    set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"

    echo.
    echo ========================================================
    echo Node.js instalado!
    echo IMPORTANTE: Cierra esta ventana y vuelve a ejecutar 'start.bat'
    echo para que Windows actualice las variables del sistema.
    echo ========================================================
    echo.
    pause
    exit /b 0
)

echo [OK] Node.js detectado:
node -v
npm -v
echo.

:: 4. Verificar e instalar dependencias con npm si faltan
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
if not exist "node_modules\electron" set "NEED_INSTALL=1"
if not exist "node_modules\express" set "NEED_INSTALL=1"

if "%NEED_INSTALL%"=="1" (
    echo ========================================================
    echo Instalando librerias del proyecto (npm install)...
    echo Esto puede tardar 1 o 2 minutos, por favor espera...
    echo ========================================================
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Fallo al instalar dependencias con npm.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas.
    echo.
)

:: 5. Comprobar ejecutable de Electron
if not exist "node_modules\electron\dist\electron.exe" (
    echo ========================================================
    echo Descargando Electron...
    echo ========================================================
    call npx electron install
    if not exist "node_modules\electron\dist\electron.exe" (
        call npm install electron --save-dev
    )
)

:: 6. Iniciar aplicacion
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
    echo [AVISO] La aplicacion finalizo con codigo: %APP_EXIT%
    pause
)
