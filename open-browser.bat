@echo off
chcp 65001 >nul

echo กำลังเปิดเบราว์เซอร์...
start http://localhost:3000

echo.
echo [INFO] เปิดเบราว์เซอร์ที่ http://localhost:3000
echo [INFO] ถ้าเซิร์ฟเวอร์ยังไม่ได้เริ่มต้น กรุณารัน start.bat ก่อน
echo.

timeout /t 3 >nul
