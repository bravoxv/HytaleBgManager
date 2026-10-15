@echo off
setlocal
cd /d "%~dp0"
title Hytale BG Manager Launcher

echo ========================================================
echo               Hytale BG Manager Launcher
echo ========================================================
echo Carpeta: %CD%
echo.

:: 1. Agregar rutas tipicas de Node al PATH de esta sesion
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%SystemRoot%\System32\WindowsPowerShell\v1.0\;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LocalAppData%\Programs\node;%AppData%\npm;%PATH%"

:: 2. Probar si node y npm funcionan
node -v >nul 2>nul
if %ERRORLEVEL% equ 0 goto node_available

:: Si no esta en PATH, revisar rutas fijas
if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
    goto node_available
)
if exist "%LocalAppData%\Programs\node\node.exe" (
    set "PATH=%LocalAppData%\Programs\node;%PATH%"
    goto node_available
)

:: 3. Si no existe Node.js, descargarlo e instalarlo
echo [AVISO] Node.js no esta instalado en este equipo.
echo Hytale BG Manager requiere Node.js para funcionar.
echo.
echo Descargando el instalador oficial de Node.js LTS...
echo.

where curl.exe >nul 2>nul
if %ERRORLEVEL% equ 0 goto download_curl

:download_ps
echo [1/2] Descargando instalador con PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $w = New-Object System.Net.WebClient; $w.DownloadFile('https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi', 'node_installer.msi')"
goto check_download

:download_curl
echo [1/2] Descargando instalador con curl...
curl.exe -# -L -o "node_installer.msi" "https://nodejs.org/dist/v22.12.0/node-v22.12.0-x64.msi"

:check_download
if exist "node_installer.msi" goto run_installer

echo.
echo [ERROR] No se pudo descargar el instalador automaticamente.
echo Abriendo navegador en https://nodejs.org/ para descarga manual...
start https://nodejs.org/
echo.
echo Instala Node.js y luego vuelve a ejecutar este archivo.
pause
exit /b 1

:run_installer
echo.
echo ========================================================
echo [2/2] Abriendo instalador de Node.js...
echo Completa los pasos del asistente en pantalla.
echo ========================================================
echo.
start /wait msiexec /i node_installer.msi
if exist "node_installer.msi" del "node_installer.msi" >nul 2>&1

:: Refrescar PATH tras la instalacion
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"

node -v >nul 2>nul
if %ERRORLEVEL% equ 0 goto node_available

echo.
echo ========================================================
echo [OK] Node.js instalado.
echo Por favor, CIERRA esta ventana y vuelve a hacer doble clic
echo en 'start.bat' para que Windows recargue las variables.
echo ========================================================
echo.
pause
exit /b 0

:node_available
echo [OK] Node.js detectado:
call node -v
call npm -v
echo.

:: 4. Verificar dependencias
if not exist "node_modules" goto install_deps
if not exist "node_modules\electron" goto install_deps
if not exist "node_modules\express" goto install_deps
goto check_electron

:install_deps
echo ========================================================
echo Instalando dependencias del proyecto...
echo Esto solo se hace la primera vez. Por favor espera...
echo ========================================================
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al ejecutar npm install.
    pause
    exit /b 1
)
echo.
echo [OK] Dependencias instaladas con exito.
echo.

:check_electron
if exist "node_modules\electron\dist\electron.exe" goto launch_app
echo ========================================================
echo Verificando binarios de Electron...
echo ========================================================
call npx electron install
if not exist "node_modules\electron\dist\electron.exe" (
    call npm install electron --save-dev
)

:launch_app
echo ========================================================
echo Iniciando Hytale BG Manager...
echo ========================================================
echo.

:: Cerrar procesos residuales previos que pudieran bloquear puertos o archivos de sesion
taskkill /F /IM electron.exe >nul 2>&1

if exist "node_modules\electron\dist\electron.exe" (
    "node_modules\electron\dist\electron.exe" .
) else (
    call npx electron .
)

set "APP_EXIT=%ERRORLEVEL%"
echo.
echo La aplicacion ha finalizado.
echo.
pause
