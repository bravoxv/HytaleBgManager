@echo off
:: Hytale BG Manager — Lanzador Windows
cd /d "%~dp0"

:: Instalar dependencias la primera vez
if not exist node_modules (
    echo Instalando dependencias, espera un momento...
    npm install
    echo.
)

:: Crear acceso directo en el Escritorio apuntando al electron.exe directamente
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d=[Environment]::GetFolderPath('Desktop');" ^
  "$s=(New-Object -ComObject WScript.Shell).CreateShortcut($d + '\Hytale BG Manager.lnk');" ^
  "$s.TargetPath='%~dp0node_modules\electron\dist\electron.exe';" ^
  "$s.Arguments='.';" ^
  "$s.WorkingDirectory='%~dp0';" ^
  "$s.Description='Hytale BG Manager';" ^
  "$s.IconLocation='%~dp0app.ico';" ^
  "$s.Save()"

:: Lanzar electron directamente
"%~dp0node_modules\electron\dist\electron.exe" .
