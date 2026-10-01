@echo off
:: Hytale BG Manager — Lanzador Windows
cd /d "%~dp0"
echo Directorio: %CD%
echo.

:: Comprobar si Node.js / npm esta disponible
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    :: Intentar rutas comunes de instalacion de Node.js por si no esta en el PATH
    if exist "%ProgramFiles%\nodejs\npm.cmd" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
    ) else if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
    ) else if exist "%LocalAppData%\Programs\node\npm.cmd" (
        set "PATH=%LocalAppData%\Programs\node;%PATH%"
    )
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo ERROR: Node.js / npm no esta instalado en esta PC.
    echo.
    echo Hytale BG Manager necesita Node.js para ejecutarse.
    echo Descargalo e instalalo desde: https://nodejs.org/
    echo ========================================================
    echo.
    echo Abriendo la pagina de descarga de Node.js...
    start https://nodejs.org/
    echo.
    pause
    exit /b 1
)

:: Instalar dependencias la primera vez
if not exist node_modules (
    echo Instalando dependencias, espera...
    call npm install
)

:: Verificar electron
if not exist "node_modules\electron\dist\electron.exe" (
    echo ERROR: electron.exe no encontrado en node_modules\electron\dist\
    echo Intentando reinstalar...
    call npm install electron --save-dev
)

echo Lanzando Hytale BG Manager...
echo.

"node_modules\electron\dist\electron.exe" . > launch_log.txt 2>&1
set EXIT=%ERRORLEVEL%

echo.
echo === LOG DE INICIO ===
type launch_log.txt
echo.
echo Codigo de salida: %EXIT%
echo.
pause
