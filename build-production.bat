@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              JaiKod - Production Build                     ║
echo ║                                                            ║
╚════════════════════════════════════════════════════════════╝
echo.

echo [STEP 1/5] ลบโฟลเดอร์ .next (Build Cache)...
echo.

if exist ".next\" (
    rmdir /s /q ".next"
    echo [SUCCESS] ลบโฟลเดอร์ .next เรียบร้อยแล้ว
) else (
    echo [INFO] ไม่พบโฟลเดอร์ .next
)

echo.
echo [STEP 2/5] ลบไฟล์ทดสอบที่ไม่จำเป็น...
echo.

if exist "src\app\test-ai\" (
    rmdir /s /q "src\app\test-ai"
    echo [SUCCESS] ลบ test-ai แล้ว
)

if exist "src\app\sell-with-ai\" (
    rmdir /s /q "src\app\sell-with-ai"
    echo [SUCCESS] ลบ sell-with-ai แล้ว
)

echo.
echo [STEP 3/5] ตรวจสอบ Environment Variables...
echo.

if not exist ".env.local" (
    echo [WARNING] ไม่พบไฟล์ .env.local
    echo [INFO] กรุณาสร้างไฟล์ .env.local จาก .env.example
    pause
    exit /b 1
)

echo [SUCCESS] พบไฟล์ .env.local

echo.
echo [STEP 4/5] Build Production...
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build ล้มเหลว
    echo [INFO] กรุณาตรวจสอบ Error ด้านบนและแก้ไข
    pause
    exit /b 1
)

echo.
echo [STEP 5/5] ทดสอบ Production Build...
echo.

echo [INFO] กำลังเริ่ม Production Server...
echo [INFO] เปิดเบราว์เซอร์ไปที่ http://localhost:3000
echo [INFO] กด Ctrl+C เพื่อหยุด Server
echo.

call npm run start

pause
