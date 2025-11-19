# Complete Setup Guide - DevotionalAI Full Stack

This guide walks you through setting up and running the entire DevotionalAI platform from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- ✅ Python 3.11+ installed
- ✅ Node.js 18+ installed
- ✅ PostgreSQL 15+ installed
- ✅ Redis 7+ installed
- ✅ Git installed

---

## Step 1: Start PostgreSQL Database

### Check if PostgreSQL is installed:
```bash
which psql
postgres --version
```

### Start PostgreSQL:

**macOS (using Homebrew):**
```bash
# Start PostgreSQL service
brew services start postgresql@15

# Or if using different version
brew services start postgresql

# Verify it's running
brew services list | grep postgresql
```

**Linux (Ubuntu/Debian):**
```bash
# Start PostgreSQL service
sudo systemctl start postgresql

# Enable to start on boot (optional)
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

**Windows:**
```bash
# Start PostgreSQL service
net start postgresql-x64-15

# Or use Services GUI: Services → PostgreSQL → Start
```

### Create Database:
```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL prompt, create database:
CREATE DATABASE devotional_ai;
CREATE USER devotional_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE devotional_ai TO devotional_user;
\q
```

### Verify Database:
```bash
# Test connection
psql -U devotional_user -d devotional_ai -c "SELECT version();"
```

---

## Step 2: Start Redis

### Check if Redis is installed:
```bash
which redis-server
redis-server --version
```

### Start Redis:

**macOS (using Homebrew):**
```bash
# Start Redis service
brew services start redis

# Verify it's running
brew services list | grep redis

# Test connection
redis-cli ping
# Should return: PONG
```

**Linux (Ubuntu/Debian):**
```bash
# Start Redis service
sudo systemctl start redis-server

# Enable to start on boot (optional)
sudo systemctl enable redis-server

# Check status
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

**Windows:**
```bash
# Download Redis for Windows or use WSL
# Or use Docker:
docker run -d -p 6379:6379 redis:7-alpine
```

### Verify Redis is Running:
```bash
redis-cli ping
# Expected output: PONG
```

---

## Step 3: Setup and Start Backend

### 3.1 Navigate to Backend Directory:
```bash
cd devotional-ai/backend
```

### 3.2 Create Virtual Environment:
```bash
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows:
venv\Scripts\activate
```

### 3.3 Install Dependencies:
```bash
pip install -r requirements.txt
```

### 3.4 Configure Environment:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
# Required values:
# - DATABASE_URL=postgresql://devotional_user:your_password@localhost:5432/devotional_ai
# - REDIS_URL=redis://localhost:6379/0
# - SECRET_KEY=your-secret-key-here (generate with: openssl rand -hex 32)
# - CELERY_BROKER_URL=redis://localhost:6379/0
# - CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

**Generate Secret Key:**
```bash
openssl rand -hex 32
```

### 3.5 Run Database Migrations:
```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 3.6 Start Backend Server:
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### 3.7 Verify Backend is Running:
```bash
# In another terminal, test health endpoint
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy"}
```

**Or visit in browser:**
- API Root: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## Step 4: Start Celery Worker

### 4.1 Open New Terminal:
Keep the backend server running in the previous terminal, open a new one.

### 4.2 Navigate to Backend:
```bash
cd devotional-ai/backend
```

### 4.3 Activate Virtual Environment:
```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

### 4.4 Start Celery Worker:
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

**Expected Output:**
```
[tasks]
  . generate_tts_audio

[2024-01-XX XX:XX:XX,XXX: INFO/MainProcess] Connected to redis://localhost:6379/0
[2024-01-XX XX:XX:XX,XXX: INFO/MainProcess] celery@hostname ready.
```

### 4.5 Verify Celery is Working:
The worker should be connected to Redis and ready to process tasks.

---

## Step 5: Setup and Start Frontend

### 5.1 Navigate to Project Root:
```bash
# From backend directory, go to root
cd ../..
# Or if starting fresh:
cd "/Users/shwetapandit/hindu devotional"
```

### 5.2 Verify Environment File:
```bash
# Check if .env.local exists
cat .env.local

# Should contain:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# If it doesn't exist, create it:
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
```

### 5.3 Install Dependencies (if not already done):
```bash
npm install
```

### 5.4 Start Frontend Server:
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

### 5.5 Verify Frontend is Running:
Open browser: http://localhost:3000

You should see the DevotionalAI landing page.

---

## Step 6: Complete User Flow Testing

### 6.1 Register a New User

1. **Open Browser:**
   - Go to: http://localhost:3000/auth/register

2. **Fill Registration Form:**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`

3. **Submit Form:**
   - Click "Create Account"
   - Should see success toast
   - Should redirect to dashboard

4. **Verify in Browser DevTools:**
   - Open DevTools (F12)
   - Go to Application → Local Storage
   - Should see:
     - `access_token`: JWT token
     - `refresh_token`: JWT token

5. **Verify in Backend Logs:**
   - Check backend terminal
   - Should see: `POST /api/v1/auth/register 201`

6. **Verify in Database:**
   ```bash
   psql -U devotional_user -d devotional_ai
   SELECT id, email, full_name, subscription_tier FROM users;
   \q
   ```

### 6.2 Login (Optional - Test Login Flow)

1. **Logout (if needed):**
   - Clear localStorage or use incognito window

2. **Go to Login Page:**
   - http://localhost:3000/auth/login

3. **Enter Credentials:**
   - Email: `test@example.com`
   - Password: `TestPassword123!`

4. **Submit:**
   - Click "Sign In"
   - Should redirect to dashboard
   - Tokens should be in localStorage

### 6.3 Create a TTS Generation

1. **Navigate to Generate Page:**
   - Go to: http://localhost:3000/generate
   - Or click "Generate Mantra" from dashboard

2. **Step 1 - Enter Mantra:**
   - Enter text: `ॐ नमो भगवते वासुदेवाय`
   - Click "Next"

3. **Step 2 - Select Language:**
   - Choose: `Sanskrit`
   - Click "Next"

4. **Step 3 - Choose Voice Style:**
   - Select: `Devotional`
   - Click "Next"

5. **Step 4 - Select Voice:**
   - Choose: `Aryan Voice`
   - Click "Generate Mantra"

6. **Monitor Progress:**
   - Should see progress bar
   - Status should change: Pending → Processing → Completed
   - Check backend logs for Celery task execution
   - Check Celery worker logs for processing

7. **Verify in Backend:**
   ```bash
   # Check backend terminal for:
   # POST /api/v1/generations/ 201
   
   # Check Celery worker terminal for:
   # [INFO] Task generate_tts_audio[xxx] received
   # [INFO] Task generate_tts_audio[xxx] succeeded
   ```

8. **Verify in Database:**
   ```bash
   psql -U devotional_user -d devotional_ai
   SELECT id, status, input_text, audio_url FROM generations ORDER BY created_at DESC LIMIT 1;
   \q
   ```

9. **Completion:**
   - Should redirect to generation details page
   - Should show audio player (if generation completed)
   - Should show download options

### 6.4 View Generations in Dashboard

1. **Go to Dashboard:**
   - http://localhost:3000/dashboard

2. **Verify Data:**
   - Should see your generation in "Recent Generations"
   - Should show correct status badge
   - Should show mantra text, language, voice style

3. **Click on Generation:**
   - Should navigate to generation details page
   - Should show all generation information
   - Should show audio/video if available

### 6.5 View Generation Details

1. **From Dashboard:**
   - Click on any generation

2. **Verify Details Page:**
   - Should show mantra text
   - Should show language, voice style, voice
   - Should show status badge
   - Should show creation time
   - Should show audio player if completed

3. **Test Audio Player:**
   - If generation is completed and has audio_url
   - Play button should work
   - Progress bar should update

---

## 🔍 Troubleshooting

### Database Connection Issues

**Error: "connection refused"**
```bash
# Check PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql     # Linux

# Check connection string in .env
# Should be: postgresql://user:password@localhost:5432/dbname
```

**Error: "database does not exist"**
```bash
# Create database
psql -U postgres
CREATE DATABASE devotional_ai;
\q
```

### Redis Connection Issues

**Error: "Connection refused"**
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# If not, start Redis
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux
```

### Backend Issues

**Error: "Module not found"**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: "DATABASE_URL not set"**
```bash
# Check .env file exists
ls -la .env

# Verify .env has DATABASE_URL
cat .env | grep DATABASE_URL
```

**Error: "Port 8000 already in use"**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Frontend Issues

**Error: "Cannot connect to API"**
```bash
# Check .env.local exists
cat .env.local

# Verify backend is running
curl http://localhost:8000/health

# Check CORS in backend logs
```

**Error: "401 Unauthorized"**
```bash
# Check localStorage has token
# In browser DevTools: Application → Local Storage
# Should see: access_token

# If not, login again
```

### Celery Issues

**Error: "No module named 'app'"**
```bash
# Make sure you're in backend directory
cd devotional-ai/backend

# Make sure virtual environment is activated
source venv/bin/activate
```

**Error: "Connection to Redis failed"**
```bash
# Check Redis is running
redis-cli ping

# Check REDIS_URL in .env
cat .env | grep REDIS
```

**Tasks not processing:**
```bash
# Check Celery worker is running
# Should see: celery@hostname ready

# Check worker logs for errors
# Look for task execution messages
```

---

## 📊 Service Status Check

### Quick Status Check Script:
```bash
#!/bin/bash
echo "=== Service Status ==="
echo ""
echo "PostgreSQL:"
pg_isready && echo "✅ Running" || echo "❌ Not running"
echo ""
echo "Redis:"
redis-cli ping > /dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"
echo ""
echo "Backend API:"
curl -s http://localhost:8000/health > /dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"
echo ""
echo "Frontend:"
curl -s http://localhost:3000 > /dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"
echo ""
echo "Celery Worker:"
ps aux | grep "celery.*worker" | grep -v grep > /dev/null 2>&1 && echo "✅ Running" || echo "❌ Not running"
```

---

## 🎯 Quick Reference Commands

### Start Everything (in order):

**Terminal 1 - Database:**
```bash
brew services start postgresql  # macOS
# or
sudo systemctl start postgresql  # Linux
```

**Terminal 2 - Redis:**
```bash
brew services start redis  # macOS
# or
sudo systemctl start redis-server  # Linux
```

**Terminal 3 - Backend:**
```bash
cd devotional-ai/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 4 - Celery:**
```bash
cd devotional-ai/backend
source venv/bin/activate
celery -A app.workers.celery_app worker --loglevel=info
```

**Terminal 5 - Frontend:**
```bash
npm run dev
```

### Stop Everything:

```bash
# Stop Frontend: Ctrl+C in frontend terminal
# Stop Celery: Ctrl+C in Celery terminal
# Stop Backend: Ctrl+C in backend terminal
# Stop Redis: brew services stop redis  # macOS
# Stop PostgreSQL: brew services stop postgresql  # macOS
```

---

## ✅ Success Checklist

After completing all steps, you should have:

- ✅ PostgreSQL running and database created
- ✅ Redis running and accessible
- ✅ Backend API running on port 8000
- ✅ Celery worker running and connected
- ✅ Frontend running on port 3000
- ✅ User registered successfully
- ✅ User logged in successfully
- ✅ Generation created and processing
- ✅ Generation completed with audio
- ✅ Dashboard showing generations
- ✅ Generation details page working

---

## 🚀 Next Steps

Once everything is working:

1. **Add More Features:**
   - User profile management
   - Subscription management
   - Payment integration
   - Video generation

2. **Production Deployment:**
   - Set up production database
   - Configure production environment
   - Deploy to cloud (Vercel, Railway, etc.)
   - Set up CI/CD

3. **Monitoring:**
   - Add logging
   - Set up error tracking
   - Monitor performance

---

**Need Help?** Check the troubleshooting section or see `CONNECTION_GUIDE.md` for more details.

