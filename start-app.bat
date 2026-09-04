@echo off
title SmartStudy AI Launcher
echo ===================================================
echo Starting SmartStudy AI (Laravel API + React Web)
echo ===================================================

:: 1. Detect PHP from PATH or Laragon
set "PHP_CMD=php"
where php >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe" (
        set "PHP_CMD=C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe"
    ) else (
        echo [ERROR] PHP was not found in PATH or Laragon default folder.
        echo Please ensure Laragon is installed or run via Laragon Terminal.
        pause
        exit /b 1
    )
)

echo [1/2] Starting Laravel API backend on http://127.0.0.1:8000 ...
start "SmartStudy API (Laravel)" cmd /k "cd /d "%~dp0apps\api-laravel" && "%PHP_CMD%" artisan serve --port=8000"

echo [2/2] Starting React Web Frontend on http://localhost:5173 ...
start "SmartStudy Web (React)" cmd /k "cd /d "%~dp0apps\web" && npm run dev"

echo.
echo ===================================================
echo Services launching:
echo   - Web App:     http://localhost:5173
echo   - Laravel API: http://127.0.0.1:8000
echo ===================================================
echo Opening web app in 3 seconds...
timeout /t 3 >nul
start http://localhost:5173
