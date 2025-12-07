@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║           JaiKod.com - Install Dependencies                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM ตรวจสอบว่ามี Node.js หรือไม่
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] ไม่พบ Node.js กรุณาติดตั้ง Node.js ก่อนใช้งาน
    echo ดาวน์โหลดได้ที่: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js Version:
node --version
echo.
echo [INFO] npm Version:
npm --version
echo.

echo ════════════════════════════════════════════════════════════
echo.
echo [INFO] กำลังติดตั้ง dependencies...
echo [INFO] กรุณารอสักครู่...
echo.
echo ════════════════════════════════════════════════════════════
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] การติดตั้ง dependencies ล้มเหลว
    echo [INFO] ลองรันคำสั่งนี้แทน: npm install --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo [SUCCESS] ติดตั้ง dependencies เรียบร้อยแล้ว!
echo.
echo [INFO] คุณสามารถรันโปรแกรมได้โดย:
echo   - ดับเบิลคลิก start.bat (Development Mode)
echo   - ดับเบิลคลิก start-production.bat (Production Mode)
echo.
echo ════════════════════════════════════════════════════════════
echo.

pause
