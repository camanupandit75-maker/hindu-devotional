# DevotionalAI Backend

FastAPI backend for the DevotionalAI platform - AI-powered Sanskrit/Hindi mantra generation with TTS and lyric video creation.

## Features

- 🔐 JWT-based authentication
- 🎙️ AI-powered Text-to-Speech (TTS) using Indic Parler TTS
- 🎬 Lyric video generation with MoviePy
- ☁️ Cloudflare R2 storage integration
- 💳 Payment integration (Stripe & Razorpay)
- ⚡ Async task processing with Celery
- 📊 PostgreSQL database with SQLAlchemy

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Cloudflare R2 account (or S3-compatible storage)

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Running the Application

1. Start FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

2. Start Celery worker (in separate terminal):
```bash
celery -A app.workers.celery_app worker --loglevel=info
```

3. Start Celery beat (optional, for scheduled tasks):
```bash
celery -A app.workers.celery_app beat --loglevel=info
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Generations
- `POST /api/v1/generations/` - Create new generation
- `GET /api/v1/generations/` - List user's generations
- `GET /api/v1/generations/{id}` - Get generation details

## Project Structure

```
backend/
├── app/
│   ├── api/           # API routes
│   ├── core/          # Core configuration
│   ├── models/        # Database models
│   ├── services/      # Business logic services
│   └── workers/       # Celery tasks
├── tests/             # Test files
└── requirements.txt   # Python dependencies
```

## Environment Variables

See `.env.example` for all required environment variables.

## Development

Run tests:
```bash
pytest
```

Format code:
```bash
black .
isort .
```

## License

MIT

