#!/bin/bash

# Image to PDF Backend - Quick Start Script

echo "🚀 Starting Image to PDF Backend Setup..."

# Check Python version
echo "📋 Checking Python version..."
python3 --version

# Navigate to python directory
cd python

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run the application
echo "🌐 Starting Flask application..."
echo "📍 Server will be available at http://localhost:5005"
echo "🔍 Health check: http://localhost:5005/health"
echo ""

gunicorn --config gunicorn.conf.py app:app
