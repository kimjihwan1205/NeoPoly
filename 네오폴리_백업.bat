@echo off
chcp 65001 > nul
title NeoPoly GitHub Backup
cd /d "%~dp0"

set "GIT_EXE=%~dp0..\tools\mingit\cmd\git.exe"

echo.
echo ====== NeoPoly GitHub backup ======
echo Project folder: %cd%
echo.

if not exist "%GIT_EXE%" (
  echo [ERROR] Git executable was not found.
  echo Expected path: %GIT_EXE%
  pause
  exit /b 1
)

if not exist ".git" (
  echo [ERROR] This folder is not a Git repository.
  echo Please run this file inside the NeoPoly-main folder.
  pause
  exit /b 1
)

:: 1. Create timestamp
set CURRENT_DATE=%date% %time%

:: 2. Show current changes
echo.
echo ====== Changed files ======
"%GIT_EXE%" status --short

:: 3. Stage all changed files
"%GIT_EXE%" add .

:: 4. Check whether there is anything to commit
"%GIT_EXE%" diff --cached --quiet
if %errorlevel%==0 (
  echo.
  echo Nothing to backup.
  echo Already up to date.
  pause
  exit /b 0
)

:: 5. Commit with timestamp
"%GIT_EXE%" commit -m "Auto backup: %CURRENT_DATE%"
if errorlevel 1 (
  echo.
  echo [ERROR] Commit failed.
  pause
  exit /b 1
)

:: 6. Pull remote changes safely before push
"%GIT_EXE%" pull --rebase origin main
if errorlevel 1 (
  echo.
  echo [ERROR] Pull failed or merge conflict occurred.
  echo Please ask Codex to fix the conflict.
  pause
  exit /b 1
)

:: 7. Push to GitHub
"%GIT_EXE%" push origin main
if errorlevel 1 (
  echo.
  echo [ERROR] GitHub upload failed.
  pause
  exit /b 1
)

echo.
echo ====== Backup complete ======
pause
