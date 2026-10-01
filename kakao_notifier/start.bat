@echo off
title Kakao Notifier
cls
echo [1/2] Checking Python packages...
pip install -r requirements.txt --quiet

echo [2/2] Starting Server on http://localhost:5000 ...
python api_server.py
pause
