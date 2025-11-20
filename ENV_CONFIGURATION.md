# Environment Variables Configuration

## Current Status

### ❌ Missing Files
- `.env.local` (frontend) - **NOT FOUND**
- `devotional-ai/backend/.env` - **NOT FOUND** (only .env.example exists)

### ✅ Current Implementation

**Frontend:**
- Uses `NEXT_PUBLIC_API_URL` for API client
- No other environment variables needed on frontend

**Backend:**
- Uses Pydantic Settings to load from `.env` file
- **Current TTS Service**: Uses Indic Parler TTS from Hugging Face (NOT ElevenLabs)
- **No ELEVENLABS_API_KEY** is currently used or configured

## Required Environment Variables

### Frontend (`.env.local`)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Note:** `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

### Backend (`devotional-ai/backend/.env`)

**Required:**
```bash
# Database
DATABASE_URL=sqlite:///./devotional.db
# or PostgreSQL: postgresql://user:password@localhost:5432/devotional_ai

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Storage (Cloudflare R2) - Required for file uploads
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Payment (Optional - for future)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
```

**Optional:**
```bash
# AI Models (Hugging Face) - Optional, for private models
HF_TOKEN=your-huggingface-token

# Model Cache Directory
MODEL_CACHE_DIR=./models
```

## ❌ ELEVENLABS_API_KEY - Not Currently Used

**Important:** The current implementation uses **Indic Parler TTS from Hugging Face**, NOT ElevenLabs.

- ✅ **Current TTS**: `ai4bharat/indic-parler-tts` (Hugging Face)
- ❌ **ElevenLabs**: Not integrated

### If You Want to Add ElevenLabs Support

1. **Add to Backend Config** (`devotional-ai/backend/app/core/config.py`):
```python
# TTS Services
ELEVENLABS_API_KEY: Optional[str] = None
TTS_PROVIDER: str = "huggingface"  # or "elevenlabs"
```

2. **Update TTS Service** to support both providers

3. **Add to `.env`**:
```bash
ELEVENLABS_API_KEY=your-elevenlabs-api-key
TTS_PROVIDER=elevenlabs
```

## Environment Variable Loading

### Frontend
- ✅ **Correctly configured**: `lib/api-client.ts` uses `process.env.NEXT_PUBLIC_API_URL`
- ✅ **Next.js automatically loads** `.env.local` for client-side variables with `NEXT_PUBLIC_` prefix

### Backend
- ✅ **Correctly configured**: `app/core/config.py` uses Pydantic Settings
- ✅ **Automatically loads** from `devotional-ai/backend/.env`
- ✅ **All variables accessed via** `settings.VARIABLE_NAME`

## Verification Checklist

### Frontend
- [ ] `.env.local` exists in project root
- [ ] `NEXT_PUBLIC_API_URL` is set
- [ ] No other `NEXT_PUBLIC_*` variables needed

### Backend
- [ ] `.env` file exists in `devotional-ai/backend/`
- [ ] All required variables are set
- [ ] `HF_TOKEN` is set (optional, for private Hugging Face models)
- [ ] R2 storage credentials are configured
- [ ] Database URL is correct

## Current API Keys Status

| Service | Variable | Status | Required | Location |
|---------|----------|--------|----------|----------|
| API URL | `NEXT_PUBLIC_API_URL` | ❌ Missing | ✅ Yes | Frontend `.env.local` |
| Hugging Face | `HF_TOKEN` | ⚠️ Optional | ❌ No | Backend `.env` |
| ElevenLabs | `ELEVENLABS_API_KEY` | ❌ Not Used | ❌ No | N/A |
| Cloudflare R2 | `R2_*` | ❌ Missing | ✅ Yes | Backend `.env` |
| Database | `DATABASE_URL` | ❌ Missing | ✅ Yes | Backend `.env` |
| Redis | `REDIS_URL` | ❌ Missing | ✅ Yes | Backend `.env` |
| JWT | `SECRET_KEY` | ❌ Missing | ✅ Yes | Backend `.env` |

## Next Steps

1. **Create `.env.local`** in project root with `NEXT_PUBLIC_API_URL`
2. **Create `devotional-ai/backend/.env`** with all required backend variables
3. **Add ElevenLabs support** (if needed) by updating config and TTS service
4. **Verify** all variables are loaded correctly

