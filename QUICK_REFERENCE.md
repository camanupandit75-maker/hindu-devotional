# Quick Reference Card - DevotionalAI

## 🚀 Start All Services

### Automated (Recommended):
```bash
./start-all.sh
```

### Manual (5 Terminals):

**Terminal 1 - PostgreSQL:**
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

## ✅ Check Service Status

```bash
./check-services.sh
```

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🧪 Quick Test Flow

1. **Register**: http://localhost:3000/auth/register
   - Email: `test@example.com`
   - Password: `TestPassword123!`

2. **Generate**: http://localhost:3000/generate
   - Enter mantra: `ॐ नमो भगवते वासुदेवाय`
   - Select: Sanskrit → Devotional → Aryan Voice
   - Click "Generate Mantra"

3. **Dashboard**: http://localhost:3000/dashboard
   - View your generations

## 🔧 Common Commands

### Database:
```bash
# Connect
psql -U devotional_user -d devotional_ai

# Check users
SELECT * FROM users;

# Check generations
SELECT * FROM generations ORDER BY created_at DESC LIMIT 5;
```

### Redis:
```bash
# Test connection
redis-cli ping

# Check keys
redis-cli keys "*"
```

### Backend:
```bash
# Check logs
tail -f /tmp/devotional-backend.log

# Test API
curl http://localhost:8000/health
```

### Frontend:
```bash
# Check logs
tail -f /tmp/devotional-frontend.log

# Build
npm run build
```

## 🐛 Quick Fixes

**Port in use:**
```bash
lsof -i :8000  # Find process
kill -9 <PID>  # Kill process
```

**Clear localStorage:**
- DevTools → Application → Local Storage → Clear

**Reset database:**
```bash
psql -U devotional_user -d devotional_ai
DROP TABLE generations CASCADE;
DROP TABLE users CASCADE;
\q
alembic upgrade head
```

## 📚 Full Guides

- **Complete Setup**: `COMPLETE_SETUP_GUIDE.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Connection Guide**: `CONNECTION_GUIDE.md`
- **Integration Summary**: `INTEGRATION_SUMMARY.md`

