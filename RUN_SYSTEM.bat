@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul

TITLE JaiKod System Runner

REM ===================================================
REM   JaiKod - System Runner Script
REM ===================================================

echo.
echo ===================================================
echo   JaiKod System Runner
echo   [1] Start Development Server (npm run dev)
echo   [2] Build & Start Production (npm run build & start)
echo   [3] Install Dependencies (npm install)
echo ===================================================
echo.

set /p choice="Select an option (default 1): "
if "%choice%"=="" set choice=1

echo.
cd /d "%~dp0"

REM ===================================================
REM   Option 3: Install
REM ===================================================
if "%choice%"=="3" (
    echo [*] Installing dependencies...
    call npm install
    echo.
    echo [*] Done. Press any key to exit.
    pause >nul
    exit /b
)

REM Check node_modules for Run options
if not exist "node_modules" (
    echo [!] node_modules not found. Auto-installing...
    call npm install
    echo.
)

REM Check Environment Variables
if not exist ".env.local" (
    if exist ".env" (
        echo [!] Warning: .env.local not found. Using .env
    ) else if exist ".env.example" (
        echo [!] Warning: .env.local not found. Creating from .env.example...
        copy .env.example .env.local >nul
        echo [*] Created .env.local
    )
)

REM ===================================================
REM   Option 2: Production
REM ===================================================
if "%choice%"=="2" (
    echo [*] Building project...
    call npm run build
    if !errorlevel! neq 0 (
        echo [!] Build failed.
        pause
        exit /b
    )
    echo.
    echo [*] Starting Production Server...
    
    start "" /B cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"
    
    call npm run start
    pause
    exit /b
)

REM ===================================================
REM   Option 1: Development (Default)
REM ===================================================
echo [*] Cleaning Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
)

echo [*] Starting Development Server...
echo [*] Browser will open in 5 seconds...

REM Open browser in background after 5 sec
start "" /B cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"

call npm run dev

if %errorlevel% neq 0 (
    echo [!] Server crushed or stopped with error.
    pause
)
