@echo off
REM ========================================
REM JaiKod Development Server - Quick Start
REM ========================================

echo.
echo ========================================
echo   JaiKod Development Server
echo   Starting...
echo ========================================
echo.

REM Change to project directory
cd /d C:\xampp\htdocs\jaikod

REM Check if node_modules exists
if not exist "node_modules" (
    echo [!] node_modules not found!
    echo [*] Installing dependencies...
    call npm install
    echo.
)

REM Start development server
echo [*] Starting Next.js development server...
echo [*] Server will be available at: http://localhost:3000
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start npm dev server
call npm run dev

REM If server stops, pause to see any errors
pause
