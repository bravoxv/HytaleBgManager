@echo off
:: Hytale BG Manager - Lanzador para Windows (Sin .exe adicionales)
cd /d "%~dp0"

:: Si no existen dependencias de Node.js, instalarlas la primera vez
if not exist node_modules (
    echo Instalando dependencias necesarias...
    call npm install --only=production
)

:: Crear acceso directo en el Escritorio apuntando a start.vbs
powershell -NoProfile -ExecutionPolicy Bypass -Command "$desktop = [Environment]::GetFolderPath('Desktop'); $s = (New-Object -ComObject WScript.Shell).CreateShortcut(\"$desktop\\Hytale BG Manager.lnk\"); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"\"\"' + $PSScriptRoot + '\\start.vbs\"\"\"'; $s.WorkingDirectory = $PSScriptRoot; $s.Description = 'Hytale Main Menu Background Editor'; $s.Save()" 2>nul

:: Iniciar el servidor Node.js directamente usando node estándar
start "" /B node server.js
