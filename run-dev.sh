#!/bin/bash

# DevotionalAI - Run Both Servers
# This script starts both backend and frontend servers

echo "🚀 Starting DevotionalAI Development Servers..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null
}

# Check if ports are available
if check_port 8000; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use (Backend)${NC}"
    echo "   Please stop the existing process or use a different port"
fi

if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (Frontend)${NC}"
    echo "   Please stop the existing process or use a different port"
fi

echo ""
echo -e "${BLUE}📦 Starting Backend (FastAPI on port 8000)...${NC}"
cd devotional-ai/backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/.installed" ]; then
    echo "Installing backend dependencies..."
    pip install -r requirements.txt > /dev/null 2>&1
    touch venv/.installed
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Please create it from .env.example${NC}"
    echo "   Backend may not work without proper configuration"
fi

# Start backend in background
echo -e "${GREEN}✅ Backend starting...${NC}"
uvicorn app.main:app --reload --port 8000 > /tmp/devotional-backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Go back to root
cd ../..

echo ""
echo -e "${BLUE}🎨 Starting Frontend (Next.js on port 3000)...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo -e "${GREEN}✅ Frontend starting...${NC}"
npm run dev > /tmp/devotional-frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Both servers are starting!${NC}"
echo ""
echo -e "${BLUE}📍 URLs:${NC}"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "   Backend:   tail -f /tmp/devotional-backend.log"
echo "   Frontend:  tail -f /tmp/devotional-frontend.log"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait

