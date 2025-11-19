#!/bin/bash

# DevotionalAI Backend Startup Script

echo "🚀 Starting DevotionalAI Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/.installed
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✏️  Please edit .env with your configuration before continuing."
    exit 1
fi

echo "✅ Environment ready!"
echo ""
echo "Starting FastAPI server on http://localhost:8000"
echo "API docs available at http://localhost:8000/docs"
echo ""
echo "To start Celery worker, run in another terminal:"
echo "  celery -A app.workers.celery_app worker --loglevel=info"
echo ""

uvicorn app.main:app --reload --port 8000

