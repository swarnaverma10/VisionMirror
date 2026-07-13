@echo off
REM ============================================================
REM  VisionMirror — Start CatVTON (Gradio app)
REM  Run this in a separate terminal BEFORE starting the backend.
REM ============================================================

echo Starting CatVTON Gradio server on http://localhost:7860 ...
echo.

cd /d "%~dp0"

REM Activate the virtual environment
call venv\Scripts\activate.bat

REM Start real CatVTON app.py
python app.py

pause
