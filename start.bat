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
    echo AVISO: Node.js no esta instalado en este equipo.
    echo Hytale BG Manager lo necesita para poder funcionar.
    echo ========================================================
    echo.
    set /p "INSTALL_CHOICE=Deseas descargar e instalar Node.js ahora mismo? (s/n): "
    if /i "%INSTALL_CHOICE%"=="s" (
        echo.
        echo Intentando instalar Node.js automaticamente...
        
        :: 1. Probar con winget si esta disponible en Windows 10/11
        where winget >nul 2>nul
        if %ERRORLEVEL% equ 0 (
            echo Descargando e instalando con winget, por favor espera...
            winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements --silent
        ) else (
            :: 2. Descargar instalador oficial MSI via curl o powershell
            echo Descargando instalador de Node.js...
            powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi', 'node_installer.msi')"
            if exist node_installer.msi (
                echo Instalando Node.js... Completa el asistente en pantalla.
                msiexec /i node_installer.msi
                del node_installer.msi >nul 2>&1
            ) else (
                echo No se pudo descargar el instalador automaticamente.
                echo Puedes descargarlo manualmente desde: https://nodejs.org/
                pause
                exit /b 1
            )
        )

        :: Refrescar variables de entorno de la sesion
        if exist "%ProgramFiles%\nodejs\npm.cmd" (
            set "PATH=%ProgramFiles%\nodejs;%PATH%"
        ) else if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
            set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
        )

        where npm >nul 2>nul
        if %ERRORLEVEL% equ 0 (
            echo.
            echo Node.js instalado con exito! Continuando con el inicio...
            echo.
        ) else (
            echo.
            echo Node.js ha sido instalado. Por favor cierra esta ventana
            echo y vuelve a abrir 'start.bat' para aplicar los cambios del sistema.
            echo.
            pause
            exit /b 0
        )
    ) else (
        echo.
        echo Operacion cancelada por el usuario.
        echo.
        pause
        exit /b 1
    )
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
