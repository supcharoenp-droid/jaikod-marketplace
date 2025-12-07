@echo off
REM ========================================
REM JaiKod - Complete Startup Script
REM Start Server + Open Admin Tests
REM ========================================

echo.
echo ========================================
echo   JaiKod - Complete Startup
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

REM Start development server in a new window
echo [*] Starting Development Server...
start "JaiKod Dev Server" cmd /k "cd /d C:\xampp\htdocs\jaikod && npm run dev"

REM Wait for server to start
echo [*] Waiting for server to start...
timeout /t 10 /nobreak >nul

REM Open admin test pages
echo [*] Opening Admin Test Pages...
echo.

start http://localhost:3000/test-admin
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/dashboard
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/users
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/sellers

echo.
echo ========================================
echo   Startup Complete!
echo ========================================
echo.
echo   Server:     Running in separate window
echo   URL:        http://localhost:3000
echo   Admin Test: http://localhost:3000/test-admin
echo.
echo   To stop server: Close the "JaiKod Dev Server" window
echo.

pause
