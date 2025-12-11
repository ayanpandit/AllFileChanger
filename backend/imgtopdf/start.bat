@echo off
REM Image to PDF Backend - Windows Quick Start Script

echo 🚀 Starting Image to PDF Backend Setup...

REM Check Python version
echo 📋 Checking Python version...
python --version

REM Navigate to python directory
cd python

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 🔧 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Run the application
echo 🌐 Starting Flask application...
echo 📍 Server will be available at http://localhost:5005
echo 🔍 Health check: http://localhost:5005/health
echo.

gunicorn --config gunicorn.conf.py app:app
