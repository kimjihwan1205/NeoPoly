@echo off
chcp 65001 > nul
title NeoPoly Local Server
cd /d "%~dp0"

echo.
echo ====== NeoPoly local server ======
echo Project folder: %cd%
echo.

if not exist ".\npm.cmd" (
  echo [ERROR] npm.cmd was not found.
  echo This file must be inside the NeoPoly-main folder.
  pause
  exit /b 1
)

echo Open this address in your browser after the server starts:
echo http://localhost:3000/
echo.
echo To stop the server, press Ctrl + C in this window.
echo.

.\npm.cmd run dev
pause
