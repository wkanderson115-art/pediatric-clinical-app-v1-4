@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo [儿科临床药典 V0.3] 正在检查 Python 环境...
where python >nul 2>nul
if errorlevel 1 (
 echo 未找到 Python，请先从 https://www.python.org/downloads/ 安装 Python 3.10 或更高版本，并勾选 Add python.exe to PATH。
 pause
 exit /b 1
)
python -m pip install -r requirements.txt
if errorlevel 1 (
 echo Python 依赖安装失败。请检查网络及 Python 环境。
 pause
 exit /b 1
)
echo 启动本地调试服务 http://127.0.0.1:8000/
start "" "http://127.0.0.1:8000/"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
pause
