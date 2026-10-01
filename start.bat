@echo off
:: Hytale BG Manager — Lanzador Windows
cd /d "%~dp0"

if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

:: Crear acceso directo en el Escritorio
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=[Environment]::GetFolderPath('Desktop');$s=(New-Object -ComObject WScript.Shell).CreateShortcut(\"$d\Hytale BG Manager.lnk\");$s.TargetPath='%~dp0start.bat';$s.WorkingDirectory='%~dp0';$s.Description='Hytale BG Manager';$s.Save()" 2>nul

npm start
