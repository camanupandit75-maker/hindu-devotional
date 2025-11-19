# Complete Testing Guide - User Flow

This guide walks you through testing the complete user flow from registration to generation.

## 🎯 Test Flow Overview

1. Register new user
2. Login (optional)
3. Create TTS generation
4. View generation in dashboard
5. View generation details

---

## Step-by-Step Testing

### Prerequisites

Before testing, ensure all services are running:
```bash
./check-services.sh
```

All services should show ✅ Running.

---

## Test 1: User Registration

### 1.1 Open Registration Page

1. Open browser: http://localhost:3000/auth/register
2. You should see the registration form with Om symbol

### 1.2 Fill Registration Form

**Enter the following:**
- **Full Name**: `Test User`
- **Email**: `test@devotionalai.com`
- **Password**: `TestPassword123!`
- **Confirm Password**: `TestPassword123!`

### 1.3 Submit Registration

1. Click "Create Account" button
2. Button should show "Creating account..." (loading state)
3. Wait for response

### 1.4 Verify Success

**Expected Results:**
- ✅ Success toast appears: "Account created! Welcome to DevotionalAI!"
- ✅ Redirects to `/dashboard`
- ✅ No errors in browser console

**Verify in Browser DevTools:**
1. Open DevTools (F12)
2. Go to **Application** → **Local Storage** → `http://localhost:3000`
3. Should see:
   - `access_token`: Long JWT token string
   - `refresh_token`: Long JWT token string

**Verify in Backend Logs:**
- Check backend terminal
- Should see: `POST /api/v1/auth/register 201 Created`
- Should see user creation in logs

**Verify in Database:**
```bash
psql -U devotional_user -d devotional_ai
SELECT id, email, full_name, subscription_tier, created_at FROM users ORDER BY created_at DESC LIMIT 1;
\q
```

Should show your new user record.

---

## Test 2: User Login (Optional)

### 2.1 Clear Session (if testing login separately)

**Option A - Use Incognito Window:**
- Open new incognito/private window

**Option B - Clear LocalStorage:**
- Open DevTools → Application → Local Storage
- Right-click → Clear
- Or manually delete `access_token` and `refresh_token`

### 2.2 Open Login Page

1. Go to: http://localhost:3000/auth/login
2. Should see login form

### 2.3 Enter Credentials

- **Email**: `test@devotionalai.com`
- **Password**: `TestPassword123!`

### 2.4 Submit Login

1. Click "Sign In"
2. Should show loading state

### 2.5 Verify Success

**Expected Results:**
- ✅ Success toast: "Welcome back!"
- ✅ Redirects to dashboard
- ✅ Tokens stored in localStorage

**Verify API Call:**
- Check Network tab in DevTools
- Should see: `POST /api/v1/auth/login 200 OK`
- Response should contain `access_token` and `refresh_token`

---

## Test 3: Create TTS Generation

### 3.1 Navigate to Generate Page

**Option A - From Dashboard:**
- Click "Generate Mantra" button

**Option B - Direct URL:**
- Go to: http://localhost:3000/generate

### 3.2 Complete Step 1 - Enter Mantra

1. In the textarea, enter:
   ```
   ॐ नमो भगवते वासुदेवाय
   ```
2. Character count should update
3. Click "Next" button
4. Should advance to Step 2

### 3.3 Complete Step 2 - Select Language

1. Click the language dropdown
2. Select: **Sanskrit**
3. Should show "Devanagari script supported"
4. Click "Next"
5. Should advance to Step 3

### 3.4 Complete Step 3 - Choose Voice Style

1. Three options should be visible:
   - Devotional
   - Meditative
   - Energetic
2. Click on **Devotional**
3. Should highlight with checkmark
4. Click "Next"
5. Should advance to Step 4

### 3.5 Complete Step 4 - Select Voice

1. Voice dropdown should show available voices
2. Select: **Aryan Voice** (or any available voice)
3. Preview panel should update
4. Click "Generate Mantra" button

### 3.6 Monitor Generation Process

**Expected Behavior:**

1. **Immediate Response:**
   - Button changes to "Generating..."
   - Progress bar appears
   - Progress starts at 0%

2. **Backend Processing:**
   - Check backend terminal
   - Should see: `POST /api/v1/generations/ 201 Created`
   - Response should include generation ID and status: "pending"

3. **Celery Task:**
   - Check Celery worker terminal
   - Should see: `[INFO] Task generate_tts_audio[xxx] received`
   - Should see processing logs
   - Status should change to "processing"

4. **Frontend Polling:**
   - Progress bar should update (10% → 50% → 100%)
   - Status should update in real-time
   - Check Network tab - should see polling requests every 2 seconds

5. **Completion:**
   - Progress reaches 100%
   - Success toast: "Generation complete! Your devotional content is ready."
   - Automatically redirects to `/generation/{id}`

### 3.7 Verify Generation in Database

```bash
psql -U devotional_user -d devotional_ai
SELECT 
    id, 
    user_id, 
    status, 
    input_text, 
    language, 
    voice_style, 
    selected_voice,
    audio_url,
    created_at,
    completed_at
FROM generations 
ORDER BY created_at DESC 
LIMIT 1;
\q
```

**Expected:**
- `status` should be "completed"
- `audio_url` should have a URL
- `completed_at` should have a timestamp

---

## Test 4: View Generations in Dashboard

### 4.1 Navigate to Dashboard

1. Go to: http://localhost:3000/dashboard
2. Should see dashboard with stats and recent generations

### 4.2 Verify Dashboard Content

**Expected Elements:**

1. **Welcome Header:**
   - "Welcome back, Test! 🙏"
   - Subtitle text

2. **Stats Cards (4 cards):**
   - Generations Used: Should show count
   - Total Creations: Should show count
   - Subscription: Should show plan
   - Recent Activity: Should show completed count

3. **Quick Actions:**
   - "Generate Mantra" button
   - "Browse Templates" button
   - "Upgrade Plan" button

4. **Recent Generations:**
   - Should list your generations
   - Each item should show:
     - Mantra text (Devanagari)
     - Status badge (Pending/Processing/Completed/Failed)
     - Language, voice style, voice
     - Time ago (e.g., "2 minutes ago")
     - Status icon

### 4.3 Verify API Call

**Check Network Tab:**
- Should see: `GET /api/v1/generations/?skip=0&limit=10 200 OK`
- Response should contain array of generation objects

### 4.4 Click on Generation

1. Click on any generation in the list
2. Should navigate to `/generation/{id}`
3. Should show generation details page

---

## Test 5: View Generation Details

### 5.1 Navigate to Details Page

**Option A - From Dashboard:**
- Click on a generation

**Option B - Direct URL:**
- Go to: http://localhost:3000/generation/1
- (Replace 1 with actual generation ID)

### 5.2 Verify Page Content

**Expected Elements:**

1. **Back Button:**
   - "← Back to Dashboard" at top

2. **Audio Preview Card:**
   - Title: "Audio Preview"
   - Status badge showing current status
   - If completed:
     - Play/Pause button
     - Progress bar
     - Time display
     - Download Audio button
     - Share button
   - If not completed:
     - Message: "Audio will be available once generation is complete"

3. **Video Preview Card (if video exists):**
   - Title: "Video Preview"
   - Video placeholder
   - Download Video button
   - Share button

4. **Generation Details Sidebar:**
   - Mantra text (in Devanagari)
   - Language
   - Voice Style
   - Voice
   - Template (if used)
   - Duration (if available)
   - Created timestamp
   - Completed timestamp (if completed)

5. **Actions Card:**
   - "Create New" button
   - "Browse Templates" button

### 5.3 Verify API Call

**Check Network Tab:**
- Should see: `GET /api/v1/generations/{id} 200 OK`
- Response should contain full generation object

### 5.4 Test Audio Player (if generation completed)

1. If status is "completed" and audio_url exists:
   - Click Play button
   - Should start playing audio
   - Progress bar should update
   - Time display should update

2. Click Pause:
   - Should pause audio
   - Progress should stop

3. Click Download:
   - Should download audio file

---

## 🔍 Debugging Tips

### Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - ✅ Success messages
   - ❌ Error messages (red)
   - ⚠️ Warning messages (yellow)

### Check Network Tab

1. Open DevTools → **Network** tab
2. Filter by "XHR" or "Fetch"
3. Check each API call:
   - **Status**: Should be 200 or 201
   - **Request**: Check headers, payload
   - **Response**: Check data returned

### Check Backend Logs

**Backend Terminal:**
- Look for HTTP requests
- Check for errors
- Verify database operations

**Example logs:**
```
INFO:     127.0.0.1:xxxxx - "POST /api/v1/auth/register HTTP/1.1" 201 Created
INFO:     127.0.0.1:xxxxx - "POST /api/v1/generations/ HTTP/1.1" 201 Created
```

### Check Celery Logs

**Celery Worker Terminal:**
- Look for task execution
- Check for errors
- Verify processing steps

**Example logs:**
```
[INFO] Task generate_tts_audio[abc123] received
[INFO] Task generate_tts_audio[abc123] succeeded in 5.2s
```

### Check Database

```bash
# Connect to database
psql -U devotional_user -d devotional_ai

# Check users
SELECT id, email, full_name, subscription_tier, generations_count FROM users;

# Check generations
SELECT id, user_id, status, input_text, audio_url, created_at, completed_at 
FROM generations 
ORDER BY created_at DESC 
LIMIT 5;

# Exit
\q
```

---

## ✅ Success Criteria

### Registration Test ✅
- [ ] User can register
- [ ] Tokens stored in localStorage
- [ ] User record created in database
- [ ] Redirects to dashboard

### Login Test ✅
- [ ] User can login
- [ ] Tokens stored in localStorage
- [ ] Redirects to dashboard

### Generation Test ✅
- [ ] Generation created successfully
- [ ] Status updates in real-time
- [ ] Celery task processes generation
- [ ] Audio file generated and uploaded
- [ ] Generation marked as completed
- [ ] Redirects to details page

### Dashboard Test ✅
- [ ] Generations fetched from API
- [ ] All generations displayed
- [ ] Status badges correct
- [ ] Clicking generation navigates to details

### Details Test ✅
- [ ] Generation details fetched from API
- [ ] All information displayed correctly
- [ ] Audio player works (if completed)
- [ ] Download buttons functional

---

## 🐛 Common Issues & Solutions

### Issue: "401 Unauthorized" when creating generation

**Solution:**
- Check localStorage has `access_token`
- Token might be expired (30 min default)
- Try logging in again

### Issue: Generation stuck in "processing"

**Solution:**
- Check Celery worker is running
- Check Celery logs for errors
- Check Redis is running
- Check backend logs for task errors

### Issue: "Connection refused" errors

**Solution:**
- Verify backend is running: `curl http://localhost:8000/health`
- Check `.env.local` has correct API URL
- Check CORS settings in backend

### Issue: No generations showing in dashboard

**Solution:**
- Check API call in Network tab
- Verify user is logged in (check localStorage)
- Check backend logs for errors
- Verify database has generation records

---

## 📊 Expected API Responses

### Register Response:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Login Response:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Create Generation Response:
```json
{
  "id": 1,
  "user_id": 1,
  "generation_type": "tts_mantra",
  "status": "pending",
  "input_text": "ॐ नमो भगवते वासुदेवाय",
  "language": "sanskrit",
  "voice_style": "devotional",
  "selected_voice": "Aryan",
  "audio_url": null,
  "video_url": null,
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": null
}
```

### Get Generation Response (after completion):
```json
{
  "id": 1,
  "user_id": 1,
  "generation_type": "tts_mantra",
  "status": "completed",
  "input_text": "ॐ नमो भगवते वासुदेवाय",
  "language": "sanskrit",
  "voice_style": "devotional",
  "selected_voice": "Aryan",
  "audio_url": "https://your-bucket.r2.cloudflarestorage.com/audio/1/1.wav",
  "video_url": null,
  "created_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:32:15Z"
}
```

---

## 🎉 Complete Test Checklist

Run through this complete checklist:

- [ ] All services running (PostgreSQL, Redis, Backend, Celery, Frontend)
- [ ] User registered successfully
- [ ] Tokens stored in localStorage
- [ ] User can login
- [ ] Generation created successfully
- [ ] Generation processed by Celery
- [ ] Generation completed with audio URL
- [ ] Dashboard shows generations
- [ ] Generation details page loads
- [ ] Audio player works (if audio available)
- [ ] No errors in browser console
- [ ] No errors in backend logs
- [ ] No errors in Celery logs

---

**Congratulations!** If all tests pass, your full-stack DevotionalAI platform is working correctly! 🎊

