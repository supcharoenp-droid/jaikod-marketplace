@echo off
REM ========================================
REM JaiKod - Open Admin Test Pages
REM ========================================

echo.
echo ========================================
echo   JaiKod - Opening Admin Test Pages
echo ========================================
echo.

REM Wait a moment for server to be ready
timeout /t 3 /nobreak >nul

echo [*] Opening Admin Test Pages in Browser...
echo.

REM Open all admin test pages
start http://localhost:3000/test-admin
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/dashboard
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/users
timeout /t 1 /nobreak >nul

start http://localhost:3000/test-admin/sellers
timeout /t 1 /nobreak >nul

echo.
echo ========================================
echo   All Admin Test Pages Opened!
echo ========================================
echo.
echo   Landing:    http://localhost:3000/test-admin
echo   Dashboard:  http://localhost:3000/test-admin/dashboard
echo   Users:      http://localhost:3000/test-admin/users
echo   Sellers:    http://localhost:3000/test-admin/sellers
echo.

pause
