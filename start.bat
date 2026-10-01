@echo off
:: Hytale BG Manager - Lanzador Oculto para Windows
cd /d "%~dp0"

:: Si no existen dependencias, instalarlas visiblemente la primera vez
if not exist node_modules (
    echo Instalando dependencias de Hytale BG Manager...
    call npm install --only=production
)

:: Iniciar el servidor Node.js en segundo plano (sin ventana CMD abierta)
start "" /B nodew.exe server.js 2>nul
if errorlevel 1 (
    start "" /B node server.js
)

:: Crear acceso directo en el Escritorio si no existe
powershell -NoProfile -ExecutionPolicy Bypass -Command "$desktop = [Environment]::GetFolderPath('Desktop'); $s = (New-Object -ComObject WScript.Shell).CreateShortcut(\"$desktop\\Hytale BG Manager.lnk\"); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"\"\"' + $PSScriptRoot + '\\start.vbs\"\"\"'; $s.WorkingDirectory = $PSScriptRoot; $s.Description = 'Hytale Main Menu Background Editor'; $s.Save()" 2>nul
