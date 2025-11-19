#!/bin/bash

# DevotionalAI - Start All Services
# This script starts all required services for DevotionalAI

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting DevotionalAI Services...${NC}"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists python3; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

if ! command_exists psql; then
    echo -e "${YELLOW}⚠️  PostgreSQL not found (or not in PATH)${NC}"
fi

if ! command_exists redis-cli; then
    echo -e "${YELLOW}⚠️  Redis not found (or not in PATH)${NC}"
fi

echo ""

# Step 1: PostgreSQL
echo -e "${BLUE}1️⃣  Starting PostgreSQL...${NC}"
if command_exists brew; then
    if brew services list | grep -q "postgresql.*started"; then
        echo -e "${GREEN}   ✅ PostgreSQL already running${NC}"
    else
        echo "   Starting PostgreSQL..."
        brew services start postgresql@15 2>/dev/null || brew services start postgresql 2>/dev/null || echo -e "${YELLOW}   ⚠️  Please start PostgreSQL manually${NC}"
    fi
elif command_exists systemctl; then
    if sudo systemctl is-active --quiet postgresql; then
        echo -e "${GREEN}   ✅ PostgreSQL already running${NC}"
    else
        echo "   Starting PostgreSQL..."
        sudo systemctl start postgresql || echo -e "${YELLOW}   ⚠️  Please start PostgreSQL manually${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  Please start PostgreSQL manually${NC}"
fi

sleep 2

# Step 2: Redis
echo -e "${BLUE}2️⃣  Starting Redis...${NC}"
if command_exists brew; then
    if brew services list | grep -q "redis.*started"; then
        echo -e "${GREEN}   ✅ Redis already running${NC}"
    else
        echo "   Starting Redis..."
        brew services start redis 2>/dev/null || echo -e "${YELLOW}   ⚠️  Please start Redis manually${NC}"
    fi
elif command_exists systemctl; then
    if sudo systemctl is-active --quiet redis-server; then
        echo -e "${GREEN}   ✅ Redis already running${NC}"
    else
        echo "   Starting Redis..."
        sudo systemctl start redis-server || echo -e "${YELLOW}   ⚠️  Please start Redis manually${NC}"
    fi
else
    echo -e "${YELLOW}   ⚠️  Please start Redis manually${NC}"
fi

sleep 2

# Step 3: Backend
echo -e "${BLUE}3️⃣  Starting Backend (FastAPI)...${NC}"
if port_in_use 8000; then
    echo -e "${YELLOW}   ⚠️  Port 8000 already in use${NC}"
else
    cd devotional-ai/backend
    
    if [ ! -d "venv" ]; then
        echo "   Creating virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    if [ ! -f "venv/.installed" ]; then
        echo "   Installing dependencies..."
        pip install -r requirements.txt > /dev/null 2>&1
        touch venv/.installed
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}   ⚠️  .env file not found. Please create it from .env.example${NC}"
    fi
    
    echo "   Starting FastAPI server..."
    uvicorn app.main:app --reload --port 8000 > /tmp/devotional-backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}   ✅ Backend starting (PID: $BACKEND_PID)${NC}"
    
    cd ../..
fi

sleep 3

# Step 4: Celery Worker
echo -e "${BLUE}4️⃣  Starting Celery Worker...${NC}"
if ps aux | grep "celery.*worker" | grep -v grep > /dev/null 2>&1; then
    echo -e "${YELLOW}   ⚠️  Celery worker already running${NC}"
else
    cd devotional-ai/backend
    source venv/bin/activate
    celery -A app.workers.celery_app worker --loglevel=info > /tmp/devotional-celery.log 2>&1 &
    CELERY_PID=$!
    echo -e "${GREEN}   ✅ Celery worker starting (PID: $CELERY_PID)${NC}"
    cd ../..
fi

sleep 2

# Step 5: Frontend
echo -e "${BLUE}5️⃣  Starting Frontend (Next.js)...${NC}"
if port_in_use 3000; then
    echo -e "${YELLOW}   ⚠️  Port 3000 already in use${NC}"
else
    if [ ! -d "node_modules" ]; then
        echo "   Installing dependencies..."
        npm install > /dev/null 2>&1
    fi
    
    if [ ! -f ".env.local" ]; then
        echo "   Creating .env.local..."
        echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
    fi
    
    echo "   Starting Next.js server..."
    npm run dev > /tmp/devotional-frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}   ✅ Frontend starting (PID: $FRONTEND_PID)${NC}"
fi

sleep 3

# Summary
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ All services are starting!${NC}"
echo ""
echo -e "${BLUE}📍 Service URLs:${NC}"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo "   Health:    http://localhost:8000/health"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "   Backend:   tail -f /tmp/devotional-backend.log"
echo "   Celery:    tail -f /tmp/devotional-celery.log"
echo "   Frontend:  tail -f /tmp/devotional-frontend.log"
echo ""
echo -e "${BLUE}🔍 Check Status:${NC}"
echo "   ./check-services.sh"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Wait for user interrupt
wait

