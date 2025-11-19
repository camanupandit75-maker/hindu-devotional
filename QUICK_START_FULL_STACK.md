# Quick Start - Full Stack DevotionalAI

## 🚀 Running Both Servers

### Option 1: Automated Script (Easiest)
```bash
./run-dev.sh
```

This will:
- Start backend on port 8000
- Start frontend on port 3000
- Show helpful logs and URLs
- Handle cleanup on Ctrl+C

### Option 2: Manual (3 Terminals)

**Terminal 1 - Backend:**
```bash
cd devotional-ai/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Celery Worker (for async generation):**
```bash
cd devotional-ai/backend
source venv/bin/activate
celery -A app.workers.celery_app worker --loglevel=info
```

## ✅ Prerequisites

Before starting, ensure:

1. **PostgreSQL** is running
   ```bash
   # Check if running
   pg_isready
   ```

2. **Redis** is running
   ```bash
   # Check if running
   redis-cli ping
   ```

3. **Backend Environment** is configured
   ```bash
   cd devotional-ai/backend
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Database Migrations** are applied
   ```bash
   cd devotional-ai/backend
   source venv/bin/activate
   alembic upgrade head
   ```

5. **Frontend Environment** is configured
   ```bash
   # .env.local should exist with:
   # NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

## 🧪 Test the Connection

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

2. **Check Frontend:**
   - Open http://localhost:3000
   - Should see landing page

3. **Test Registration:**
   - Go to http://localhost:3000/auth/register
   - Create account
   - Check browser console for API calls
   - Check localStorage for tokens

4. **Test Login:**
   - Go to http://localhost:3000/auth/login
   - Sign in
   - Should redirect to dashboard

5. **Test Generation:**
   - Go to http://localhost:3000/generate
   - Complete form
   - Create generation
   - Should poll for status

## 🔍 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Check .env file exists and has correct values
- Check port 8000 is not in use

### Frontend won't start
- Check Node.js version (18+)
- Run `npm install`
- Check port 3000 is not in use

### CORS errors
- Backend CORS is already configured
- Make sure backend is on port 8000
- Make sure frontend is on port 3000

### 401 Unauthorized
- Check token exists in localStorage
- Token might be expired (30 min default)
- Try logging in again

### Generation not completing
- Check Celery worker is running
- Check Redis is running
- Check backend logs for errors

## 📊 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📝 Next Steps

1. Set up your database (PostgreSQL)
2. Configure environment variables
3. Run migrations
4. Start all services
5. Test the full flow!

For detailed setup, see `CONNECTION_GUIDE.md` and `INTEGRATION_SUMMARY.md`

