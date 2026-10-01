@echo off
title Hytale BG Manager
cd /d "%~dp0"
echo 🎮 Iniciando Hytale BG Manager...
if not exist node_modules (
    echo 📦 Instalando dependencias necesarias...
    call npm install --only=production
)
node server.js
