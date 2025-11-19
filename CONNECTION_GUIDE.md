# Frontend-Backend Connection Guide

## ✅ What's Been Connected

### 1. Environment Configuration
- ✅ Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`
- ✅ API client reads from environment variable

### 2. API Client (`lib/api-client.ts`)
- ✅ Created complete API client with authentication
- ✅ Handles JWT tokens automatically
- ✅ Methods for:
  - `register()` - User registration
  - `login()` - User login
  - `createGeneration()` - Create new TTS generation
  - `getGenerations()` - List user's generations
  - `getGeneration(id)` - Get specific generation

### 3. Frontend Pages Updated
- ✅ **Login Page** (`app/auth/login/page.tsx`)
  - Calls backend API
  - Stores tokens in localStorage
  - Handles errors gracefully

- ✅ **Register Page** (`app/auth/register/page.tsx`)
  - Calls backend API
  - Stores tokens in localStorage
  - Validates password match

- ✅ **Generate Page** (`app/generate/page.tsx`)
  - Creates generation via API
  - Polls for completion status
  - Shows real-time progress

- ✅ **Dashboard Page** (`app/dashboard/page.tsx`)
  - Fetches generations from API
  - Transforms API response to frontend format
  - Shows loading state
  - Falls back to mock data if API fails

### 4. Backend CORS
- ✅ Already configured in `devotional-ai/backend/app/main.py`
- ✅ Allows `http://localhost:3000`
- ✅ Allows credentials and all methods

### 5. Backend Login Fix
- ✅ Updated login endpoint to accept POST body instead of query params
- ✅ Matches frontend API client expectations

## 🚀 How to Run Both Servers

### Option 1: Use the Script (Recommended)
```bash
./run-dev.sh
```

This will:
- Start backend on port 8000
- Start frontend on port 3000
- Show logs and URLs
- Handle cleanup on Ctrl+C

### Option 2: Manual (Two Terminals)

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

## 🧪 Testing the Full Flow

### 1. Register a User
1. Go to http://localhost:3000/auth/register
2. Fill in name, email, password
3. Click "Create Account"
4. ✅ Token should be stored in localStorage
5. ✅ Should redirect to dashboard

### 2. Login
1. Go to http://localhost:3000/auth/login
2. Enter email and password
3. Click "Sign In"
4. ✅ Token should be stored
5. ✅ Should redirect to dashboard

### 3. Create TTS Generation
1. Go to http://localhost:3000/generate
2. Complete all 4 steps:
   - Enter mantra text
   - Select language
   - Choose voice style
   - Pick voice
3. Click "Generate Mantra"
4. ✅ Should show progress
5. ✅ Should poll for completion
6. ✅ Should redirect to generation details when done

### 4. View Generations
1. Go to http://localhost:3000/dashboard
2. ✅ Should see your generations
3. ✅ Should show status (pending/processing/completed)
4. ✅ Click on generation to see details

## 🔍 Debugging

### Check Backend Logs
```bash
tail -f /tmp/devotional-backend.log
```

### Check Frontend Logs
```bash
tail -f /tmp/devotional-frontend.log
```

### Check Browser Console
- Open DevTools (F12)
- Check Network tab for API calls
- Check Console for errors
- Check Application > Local Storage for tokens

### Common Issues

1. **CORS Errors**
   - Make sure backend CORS includes `http://localhost:3000`
   - Check backend is running on port 8000

2. **401 Unauthorized**
   - Check if token exists in localStorage
   - Token might be expired (30 minutes)
   - Try logging in again

3. **Connection Refused**
   - Make sure backend is running
   - Check port 8000 is not in use
   - Verify `.env.local` has correct API URL

4. **Generation Not Completing**
   - Check Celery worker is running
   - Check Redis is running
   - Check backend logs for errors

## 📋 Prerequisites

Before running, make sure you have:

1. **Backend Setup:**
   - PostgreSQL running
   - Redis running
   - Python 3.11+ installed
   - Virtual environment created
   - Dependencies installed
   - `.env` file configured

2. **Frontend Setup:**
   - Node.js 18+ installed
   - Dependencies installed (`npm install`)
   - `.env.local` file created

3. **Database:**
   - Run migrations: `alembic upgrade head`
   - Database should be created

4. **Celery Worker (for async tasks):**
   ```bash
   cd devotional-ai/backend
   source venv/bin/activate
   celery -A app.workers.celery_app worker --loglevel=info
   ```

## 🎯 Next Steps

1. **Add User Profile API** - Fetch user data from backend
2. **Add Refresh Token** - Implement token refresh logic
3. **Add Error Boundaries** - Better error handling
4. **Add Loading States** - Better UX during API calls
5. **Add Real-time Updates** - WebSocket for generation status

## 📝 API Endpoints Used

- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/generations/` - Create generation
- `GET /api/v1/generations/` - List generations
- `GET /api/v1/generations/{id}` - Get generation

All endpoints require authentication except register/login.

