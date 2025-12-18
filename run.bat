@echo off
chcp 65001 >nul
TITLE JaiKod Dev Server

echo [*] Starting JaiKod System...
cd /d "%~dp0"

if not exist "node_modules" (
    echo [!] Installing dependencies...
    call npm install
)

echo [*] Opening browser...
start "" /B cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:3000"

echo [*] Running npm run dev...
npm run dev

pause
