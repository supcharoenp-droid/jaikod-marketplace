@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         JaiKod.com - Production Build ^& Start              ║
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

REM ตรวจสอบว่ามี node_modules หรือไม่
if not exist "node_modules\" (
    echo [INFO] กำลังติดตั้ง dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] การติดตั้ง dependencies ล้มเหลว
        pause
        exit /b 1
    )
    echo.
)

REM ตรวจสอบว่ามีไฟล์ .env.local หรือไม่
if not exist ".env.local" (
    echo [WARNING] ไม่พบไฟล์ .env.local
    if exist ".env.example" (
        echo [INFO] กำลังคัดลอกจาก .env.example...
        copy .env.example .env.local >nul
        echo [WARNING] กรุณาแก้ไขไฟล์ .env.local ให้ถูกต้องก่อนใช้งาน
        pause
    )
)

echo ════════════════════════════════════════════════════════════
echo.
echo [STEP 1/2] กำลัง Build โปรเจกต์...
echo.
echo ════════════════════════════════════════════════════════════
echo.

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] การ Build ล้มเหลว
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo [SUCCESS] Build สำเร็จ!
echo.
echo [STEP 2/2] กำลังเริ่มต้นเซิร์ฟเวอร์ Production...
echo [INFO] เปิดเบราว์เซอร์ที่: http://localhost:3000
echo.
echo กด Ctrl+C เพื่อหยุดเซิร์ฟเวอร์
echo.
echo ════════════════════════════════════════════════════════════
echo.

call npm run start

pause
