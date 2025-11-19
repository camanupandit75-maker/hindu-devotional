#!/bin/bash

# DevotionalAI Service Status Checker

echo "🔍 Checking DevotionalAI Services..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PostgreSQL Check
echo -n "PostgreSQL: "
if pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
    echo "   Start with: brew services start postgresql (macOS)"
    echo "   Or: sudo systemctl start postgresql (Linux)"
fi

# Redis Check
echo -n "Redis: "
if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
    echo "   Start with: brew services start redis (macOS)"
    echo "   Or: sudo systemctl start redis-server (Linux)"
fi

# Backend API Check
echo -n "Backend API (port 8000): "
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
    echo "   URL: http://localhost:8000"
    echo "   Docs: http://localhost:8000/docs"
else
    echo -e "${RED}❌ Not running${NC}"
    echo "   Start with: cd devotional-ai/backend && uvicorn app.main:app --reload"
fi

# Frontend Check
echo -n "Frontend (port 3000): "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
    echo "   URL: http://localhost:3000"
else
    echo -e "${RED}❌ Not running${NC}"
    echo "   Start with: npm run dev"
fi

# Celery Worker Check
echo -n "Celery Worker: "
if ps aux | grep "celery.*worker" | grep -v grep > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
    echo "   Start with: cd devotional-ai/backend && celery -A app.workers.celery_app worker --loglevel=info"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check environment files
echo "📁 Environment Files:"
if [ -f ".env.local" ]; then
    echo -e "   ${GREEN}✅ .env.local exists${NC}"
    API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d '=' -f2)
    echo "   API URL: $API_URL"
else
    echo -e "   ${YELLOW}⚠️  .env.local not found${NC}"
    echo "   Create with: echo 'NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1' > .env.local"
fi

if [ -f "devotional-ai/backend/.env" ]; then
    echo -e "   ${GREEN}✅ backend/.env exists${NC}"
else
    echo -e "   ${YELLOW}⚠️  backend/.env not found${NC}"
    echo "   Copy from: devotional-ai/backend/.env.example"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Summary
ALL_RUNNING=true

if ! pg_isready > /dev/null 2>&1; then ALL_RUNNING=false; fi
if ! redis-cli ping > /dev/null 2>&1; then ALL_RUNNING=false; fi
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then ALL_RUNNING=false; fi
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then ALL_RUNNING=false; fi
if ! ps aux | grep "celery.*worker" | grep -v grep > /dev/null 2>&1; then ALL_RUNNING=false; fi

if [ "$ALL_RUNNING" = true ]; then
    echo -e "${GREEN}✅ All services are running!${NC}"
    echo ""
    echo "Ready to test:"
    echo "  • Frontend: http://localhost:3000"
    echo "  • Backend API: http://localhost:8000"
    echo "  • API Docs: http://localhost:8000/docs"
else
    echo -e "${YELLOW}⚠️  Some services are not running${NC}"
    echo "   See above for details on how to start each service"
fi

