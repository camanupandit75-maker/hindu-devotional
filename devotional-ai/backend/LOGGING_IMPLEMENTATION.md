# Comprehensive Error Logging Implementation

## Overview

Comprehensive error logging has been added to the generate API route and all related services. This document outlines what was implemented.

## Files Modified

1. **`app/api/v1/endpoints/generations.py`** - API endpoint logging
2. **`app/workers/tasks.py`** - Celery task logging
3. **`app/services/ai/tts_service.py`** - TTS service logging
4. **`app/main.py`** - Logging configuration

## Logging Features

### 1. API Endpoint (`generations.py`)

**Incoming Request Logging:**
- ✅ Logs complete request payload
- ✅ Logs input text length
- ✅ Logs all generation parameters

**Step-by-Step Tracing:**
- Step 1: Authorization validation
- Step 2: User authentication
- Step 3: Generation limit check
- Step 4: Database record creation
- Step 5: Celery task triggering

**Error Handling:**
- ✅ Wraps entire function in try-catch
- ✅ Logs full error details with traceback
- ✅ Returns detailed error messages to frontend
- ✅ Handles HTTP exceptions separately

**Example Log Output:**
```
================================================================================
GENERATION REQUEST RECEIVED
================================================================================
📥 Incoming Request Payload: {'input_text': '...', 'language': 'sanskrit', ...}
📏 Input text length: 25 characters
🔐 Step 1: Validating authorization header
✅ Authorization header present
👤 Step 2: Authenticating user
✅ User authenticated: ID=1, Email=user@example.com
📊 Step 3: Checking generation limits
   Current generations: 5/50
✅ Generation limit check passed
💾 Step 4: Creating generation record in database
✅ Generation record created: ID=123
🚀 Step 5: Triggering Celery task for TTS generation
✅ Celery task triggered: Task ID=abc-123, Generation ID=123
================================================================================
✅ GENERATION REQUEST SUCCESSFUL - Generation ID: 123
================================================================================
```

### 2. Celery Task (`tasks.py`)

**Step-by-Step Tracing:**
- Step 1: Fetch generation record
- Step 2: Update status to PROCESSING
- Step 3: Create temporary file
- Step 4: Call TTS service (with detailed parameters)
- Step 5: Upload to storage (R2)
- Step 6: Update generation record
- Step 7: Clean up temporary file

**TTS Service Call Logging:**
- ✅ Logs all TTS parameters before call
- ✅ Logs TTS service response
- ✅ Logs file size and verification
- ✅ Wraps TTS call in try-catch with full error details

**Error Handling:**
- ✅ Catches exceptions at each step
- ✅ Logs full traceback for debugging
- ✅ Updates generation status to FAILED
- ✅ Stores error message in database
- ✅ Cleans up resources on failure

**Example Log Output:**
```
================================================================================
🎵 TTS GENERATION TASK STARTED - Generation ID: 123
================================================================================
📋 Step 1: Fetching generation record (ID: 123)
✅ Generation found:
   - User ID: 1
   - Input Text: ॐ नमो भगवते वासुदेवाय
   - Language: sanskrit
   - Voice Style: devotional
   - Selected Voice: Aryan
   - Current Status: pending
🔄 Step 2: Updating status to PROCESSING
✅ Status updated to PROCESSING
⏱️  Start time: 2024-01-15 10:30:00
📁 Step 3: Creating temporary file for audio output
✅ Temporary file created: /tmp/tmp_xyz.wav
🎤 Step 4: Calling TTS service to generate speech
   TTS Parameters:
   - Text: ॐ नमो भगवते वासुदेवाय
   - Language: sanskrit
   - Voice Style: devotional
   - Voice Preset: Aryan
   - Output Path: /tmp/tmp_xyz.wav
✅ TTS generation successful: /tmp/tmp_xyz.wav
   Audio file size: 245760 bytes
☁️  Step 5: Uploading audio file to storage (R2)
   Object Key: audio/1/123.wav
✅ File uploaded successfully: https://...
💾 Step 6: Updating generation record with results
✅ Generation record updated:
   - Audio URL: https://...
   - Status: COMPLETED
   - Processing Time: 5.23 seconds
   - File Size: 245760 bytes
🧹 Step 7: Cleaning up temporary file
✅ Temporary file deleted
================================================================================
✅ TTS GENERATION TASK COMPLETED SUCCESSFULLY
   Generation ID: 123
   Total Time: 5.23 seconds
================================================================================
```

### 3. TTS Service (`tts_service.py`)

**Model Loading Logging:**
- ✅ Logs model name, device, cache directory
- ✅ Logs tokenizer loading
- ✅ Logs model loading
- ✅ Wraps in try-catch with full error details

**Speech Generation Logging:**
- ✅ Logs all input parameters
- ✅ Logs model loading step
- ✅ Logs style description preparation
- ✅ Logs tokenization (with shapes)
- ✅ Logs audio generation (with audio stats)
- ✅ Logs file saving
- ✅ Verifies file creation

**Error Handling:**
- ✅ Wraps entire generation in try-catch
- ✅ Logs full traceback for debugging
- ✅ Provides detailed error context

**Example Log Output:**
```
================================================================================
🎤 TTS SPEECH GENERATION STARTED
================================================================================
   Text: ॐ नमो भगवते वासुदेवाय
   Language: sanskrit
   Voice Style: devotional
   Voice Preset: Aryan
   Output Path: /tmp/tmp_xyz.wav
🤖 Step 1: Loading/checking TTS model
================================================================================
🤖 LOADING TTS MODEL
================================================================================
   Model: ai4bharat/indic-parler-tts
   Device: cpu
   Cache Dir: ./models
📥 Step 1: Loading tokenizer...
✅ Tokenizer loaded successfully
📥 Step 2: Loading model...
✅ Model loaded successfully on cpu
================================================================================
✅ Model ready
📝 Step 2: Preparing style description
   Description: Aryan speaks in a devotional, calm, and reverent tone with clear pronunciation in sanskrit
🔤 Step 3: Tokenizing inputs
✅ Tokenization successful
   Description tokens: torch.Size([1, 15])
   Text tokens: torch.Size([1, 8])
🎵 Step 4: Generating audio with TTS model
   Device: cpu
✅ Audio generation successful
   Audio shape: (48000,)
   Audio dtype: float32
   Audio min: -0.5, max: 0.5
💾 Step 5: Saving audio file
✅ Audio file saved successfully
   Path: /tmp/tmp_xyz.wav
   Sample Rate: 24000 Hz
   File Size: 245760 bytes
================================================================================
✅ TTS SPEECH GENERATION COMPLETED SUCCESSFULLY
   Output: /tmp/tmp_xyz.wav
================================================================================
```

## Error Logging Examples

### API Endpoint Error:
```
================================================================================
❌ GENERATION REQUEST FAILED
   Error Type: ValueError
   Error Message: Invalid input text
================================================================================
```

### Celery Task Error:
```
================================================================================
❌ TTS GENERATION TASK FAILED
   Generation ID: 123
   Error Type: FileNotFoundError
   Error Message: Generated audio file not found: /tmp/tmp_xyz.wav
   Full Traceback:
   [Full stack trace here]
================================================================================
```

### TTS Service Error:
```
================================================================================
❌ TTS MODEL GENERATION FAILED
   Error Type: RuntimeError
   Error Message: CUDA out of memory
   Full Traceback:
   [Full stack trace here]
================================================================================
```

## Frontend Error Messages

The backend now returns detailed error messages to the frontend:

1. **401 Unauthorized**: "Authorization header required"
2. **403 Forbidden**: "Generation limit reached. Please upgrade your plan."
3. **500 Internal Server Error**: 
   - "Failed to start generation task: [error details]"
   - "An error occurred while creating generation: [error details]"

## Logging Configuration

Logging is configured in `app/main.py`:
- **Level**: INFO
- **Format**: Timestamp, Logger Name, Level, Message
- **Output**: stdout (console)

## Benefits

1. **Debugging**: Full traceback and context for every error
2. **Monitoring**: Step-by-step progress tracking
3. **Performance**: Timing information for each step
4. **Troubleshooting**: Detailed parameter logging
5. **User Experience**: Meaningful error messages returned to frontend

## Next Steps

To view logs:
1. **Backend API**: Check console output when running `uvicorn`
2. **Celery Worker**: Check console output when running `celery worker`
3. **Production**: Configure log file output or use a logging service (e.g., CloudWatch, Datadog)

## Testing

To test the logging:
1. Make a generation request
2. Check backend console for detailed logs
3. Check Celery worker console for task logs
4. Intentionally cause errors to see error logging

