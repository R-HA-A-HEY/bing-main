@echo off
chcp 65001 >nul
title API Launcher

echo ===================================================
echo   FastAPI 全棧伺服器自動化啟動腳本
echo ===================================================
echo.

:: ---------------------------------------------------
:: 檢查並自動下載安裝 Ollama 軟體本體
:: ---------------------------------------------------
where ollama >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [提示] 偵測到未安裝 Ollama，正在為您自動下載安裝檔...
    curl -L "https://ollama.com/download/OllamaSetup.exe" -o "OllamaSetup.exe"
    
    echo 正在自動執行安裝程序，請在彈出視窗完成安裝...
    start /wait OllamaSetup.exe
    
    del OllamaSetup.exe
    echo Ollama 安裝完成！
)

:: ---------------------------------------------------
:: 0. 檢查並自動啟動 Ollama 服務與拉取模型
:: ---------------------------------------------------
echo [0/3] 檢查 Ollama 本地 AI 服務...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo Ollama 服務已在背景執行中。
) else (
    echo 正在啟動 Ollama 服務...
    start "" ollama serve
    timeout /t 3 >nul
)

:: 自動拉取/更新目標模型
echo 正在確認 Ollama 模型 (qwen2.5:7b)...
ollama pull
echo.

:: 1. 檢查並自動建立 .venv 虛擬環境
if not exist ".venv" (
    echo [1/3] 偵測到未建立虛擬環境，正在建立 .venv...
    python -m venv .venv
    if errorlevel 1 (
        echo [錯誤] 建立虛擬環境失敗，請確認已安裝 Python！
        pause
        exit /b
    )
    
    echo [2/3] 正在安裝專案所需套件...
    call .\.venv\Scripts\activate.bat
    .\.venv\Scripts\python.exe -m pip install fastapi uvicorn google-genai pydantic python-dotenv sqlalchemy ollama
    echo 套件安裝完成！
) else (
    echo [1/3] 已偵測到 .venv 虛擬環境，直接啟用...
    call .\.venv\Scripts\activate.bat
)

echo.
echo [2/3] 設定 Windows 防火牆放行 Port 8000...
powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"New-NetFirewallRule -DisplayName ''FastAPI Web AI'' -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue\"' -Verb RunAs"

echo.
echo ===================================================
echo [3/3] 正在啟動 FastAPI 伺服器...
echo 網頁與 API 網址: http://127.0.0.1:8000
echo 按 Ctrl + C 可關閉伺服器並自動清理防火牆規則
echo ===================================================
echo.

:: 自動開啟瀏覽器進入網頁
explorer "http://127.0.0.1:8000"

:: 使用 python -m uvicorn 模組方式啟動，相容性更高
.\.venv\Scripts\python.exe -m uvicorn api:api --host 0.0.0.0 --port 8000 --reload

:: ===================================================
:: 伺服器關閉後的清理邏輯（按下 Ctrl + C 後執行）
:: ===================================================
echo.
echo 正在清理並移除 Windows 防火牆規則...
powershell -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -Command \"Remove-NetFirewallRule -DisplayName ''FastAPI Web AI'' -ErrorAction SilentlyContinue\"' -Verb RunAs"

echo 正在關閉 Ollama 本地 AI 服務...
taskkill /F /IM ollama.exe /T >nul 2>&1
taskkill /F /IM "ollama app.exe" /T >nul 2>&1

echo 伺服器與 Ollama 已成功關閉與復原！
pause