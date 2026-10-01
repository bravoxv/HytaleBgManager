@echo off
:: Hytale BG Manager — Lanzador Windows
cd /d "%~dp0"
echo Directorio: %CD%
echo.

:: Instalar dependencias la primera vez
if not exist node_modules (
    echo Instalando dependencias, espera...
    npm install
)

:: Verificar electron
if not exist "node_modules\electron\dist\electron.exe" (
    echo ERROR: electron.exe no encontrado en node_modules\electron\dist\
    echo Intentando reinstalar...
    npm install electron --save-dev
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
