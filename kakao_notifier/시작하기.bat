@echo off
title Kakao Notifier
cls
echo [1/2] Checking Python packages...
pip install flask flask-cors pyperclip pywin32 pillow --quiet

echo [2/2] Starting Server on http://localhost:5000 ...
start http://localhost:5000

echo.
echo ===================================================
echo   Kakao Notifier Server is running on port 5000
echo   Keep this window open while using the app!
echo ===================================================
echo.

python api_server.py
pause
