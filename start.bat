@echo off
setlocal
cd /d "%~dp0"
title Hytale BG Manager Launcher

echo ========================================================
echo               Hytale BG Manager Launcher
echo ========================================================
echo Carpeta: %CD%
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

:: 3. Si no existe Node.js, descargarlo con curl nativo o powershell
if "%NODE_EXISTS%"=="0" (
    echo [AVISO] Node.js no esta instalado en este equipo.
    echo Hytale BG Manager requiere Node.js para funcionar.
    echo.
    echo Descargando el instalador oficial de Node.js LTS...
    echo.

    set "DOWNLOADED=0"
    
    where curl.exe >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        echo [1/2] Descargando instalador con curl...
        curl.exe -# -L -o "node_installer.msi" "https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi"
        if exist "node_installer.msi" set "DOWNLOADED=1"
    )

    if "%DOWNLOADED%"=="0" (
        echo [1/2] Descargando instalador con PowerShell...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi', 'node_installer.msi')"
        if exist "node_installer.msi" set "DOWNLOADED=1"
    )

    if not exist "node_installer.msi" (
        echo.
        echo [ERROR] No se pudo descargar el instalador automaticamente.
        echo Abriendo navegador en https://nodejs.org/ para que lo descargues manualmente...
        start https://nodejs.org/
        echo.
        echo Instala Node.js y luego vuelve a ejecutar este archivo.
        pause
        exit /b 1
    )

    echo.
    echo ========================================================
    echo [2/2] Abriendo instalador de Node.js...
    echo Sigue los pasos del asistente hasta completar la instalacion.
    echo ========================================================
    echo.
    start /wait msiexec /i node_installer.msi
    if exist "node_installer.msi" del "node_installer.msi" >nul 2>&1

    set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"

    echo.
    echo ========================================================
    echo Node.js instalado con exito!
    echo ========================================================
    echo.
)

echo [OK] Verificando herramientas de Node:
call node -v
call npm -v
echo.

:: 4. Verificar e instalar dependencias si faltan
set "NEED_INSTALL=0"
if not exist "node_modules" set "NEED_INSTALL=1"
if not exist "node_modules\electron" set "NEED_INSTALL=1"
if not exist "node_modules\express" set "NEED_INSTALL=1"

if "%NEED_INSTALL%"=="1" (
    echo ========================================================
    echo Instalando librerias del proyecto (npm install)...
    echo Esto solo se hace la primera vez. Por favor espera...
    echo ========================================================
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] Hubo un problema instalando las dependencias.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencias instaladas correctamente.
    echo.
)

:: 5. Comprobar binario de Electron
if not exist "node_modules\electron\dist\electron.exe" (
    echo ========================================================
    echo Verificando binarios de Electron...
    echo ========================================================
    call npx electron install
    if not exist "node_modules\electron\dist\electron.exe" (
        call npm install electron --save-dev
    )
)

:: 6. Iniciar la aplicacion (esperar a que la ventana de Electron termine)
echo ========================================================
echo Iniciando Hytale BG Manager...
echo ========================================================
echo.

if exist "node_modules\electron\dist\electron.exe" (
    call "node_modules\electron\dist\electron.exe" .
) else (
    call npx electron .
)

set "APP_EXIT=%ERRORLEVEL%"
echo.
echo La aplicacion ha finalizado (Codigo: %APP_EXIT%).
echo.
pause
