@echo off
chcp 65001 >nul 2>&1
title موقع تفسير الأحلام — تشغيل محلي
echo.
echo ============================================
echo   موقع تفسير الأحلام — تشغيل محلي
echo ============================================
echo.

cd /d "%~dp0"

echo   جاري تشغيل الخادم على http://localhost:8080
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Server.ps1" -Port 8080 -Root "%~dp0"

pause
