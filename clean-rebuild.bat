@echo off
chcp 65001 >nul
cls

echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              JaiKod.com - Clean ^& Rebuild                  ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo [WARNING] สคริปต์นี้จะลบ:
echo   - โฟลเดอร์ .next (build cache)
echo   - โฟลเดอร์ node_modules (dependencies)
echo.
echo กด Ctrl+C เพื่อยกเลิก หรือ
pause
echo.

echo ════════════════════════════════════════════════════════════
echo.
echo [STEP 1/3] กำลังลบโฟลเดอร์ .next...
echo.

if exist ".next\" (
    rmdir /s /q ".next"
    echo [SUCCESS] ลบโฟลเดอร์ .next เรียบร้อยแล้ว
) else (
    echo [INFO] ไม่พบโฟลเดอร์ .next
)

echo.
echo [STEP 2/3] กำลังลบโฟลเดอร์ node_modules...
echo.

if exist "node_modules\" (
    echo [INFO] กำลังลบ... (อาจใช้เวลาสักครู่)
    rmdir /s /q "node_modules"
    echo [SUCCESS] ลบโฟลเดอร์ node_modules เรียบร้อยแล้ว
) else (
    echo [INFO] ไม่พบโฟลเดอร์ node_modules
)

echo.
echo [STEP 3/3] กำลังติดตั้ง dependencies ใหม่...
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] การติดตั้ง dependencies ล้มเหลว
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo [SUCCESS] ล้างข้อมูลและติดตั้งใหม่เรียบร้อยแล้ว!
echo.
echo [INFO] คุณสามารถรันโปรแกรมได้โดย:
echo   - ดับเบิลคลิก start.bat
echo.
echo ════════════════════════════════════════════════════════════
echo.

pause
