# DevotionalAI - Full-Stack Platform

AI-powered platform for generating Sanskrit/Hindi mantras with text-to-speech, creating devotional lyric videos, and managing user subscriptions.

## 🏗️ Architecture

This is a monorepo containing:

- **Backend**: FastAPI with PostgreSQL, Redis, Celery
- **Frontend**: Next.js 14 with TypeScript (existing implementation)
- **Shared**: Common types and utilities

## 📁 Project Structure

```
devotional-ai/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── core/     # Configuration
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   └── workers/  # Celery tasks
│   └── requirements.txt
├── frontend/         # Next.js frontend (existing)
└── shared/           # Shared types/utils
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run database migrations:
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

6. Start services:
```bash
# Terminal 1: FastAPI server
uvicorn app.main:app --reload --port 8000

# Terminal 2: Celery worker
celery -A app.workers.celery_app worker --loglevel=info
```

### Frontend Setup

The frontend is already set up. See the main project README for details.

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **Redis** - Caching and task queue
- **Celery** - Async task processing
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **JWT** - Authentication
- **boto3** - S3/R2 storage
- **Transformers** - AI models

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Shadcn/ui** - UI components
- **TanStack Query** - Data fetching
- **Zustand** - State management

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Generations
- `POST /api/v1/generations/` - Create new generation
- `GET /api/v1/generations/` - List user's generations
- `GET /api/v1/generations/{id}` - Get generation details

## 🔐 Environment Variables

See `backend/.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `R2_*` - Cloudflare R2 storage credentials
- `STRIPE_*` / `RAZORPAY_*` - Payment gateway credentials

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 License

MIT

