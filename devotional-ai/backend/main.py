from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, Literal
import uuid
from datetime import datetime
import logging
from pathlib import Path

app = FastAPI(title="DevotionalAI API", version="1.0.0")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = Path("outputs")
OUTPUT_DIR.mkdir(exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

class GenerateRequest(BaseModel):
    mantra: str
    language: Literal["Hindi", "Sanskrit", "Tamil", "Telugu"]
    voice_style: Literal["Devotional", "Meditative", "Energetic", "Calm"]
    voice: str

class GenerateResponse(BaseModel):
    id: str
    status: str
    audio_url: Optional[str] = None
    error_message: Optional[str] = None
    created_at: str

generations_db = {}

class TTSService:
    def __init__(self):
        logger.info("🎤 TTS Service initialized (multi-language support)")
        
        # Language code mapping
        self.language_map = {
            'Hindi': 'hi',
            'Sanskrit': 'hi',  # Use Hindi for Sanskrit (closest available)
            'Tamil': 'ta',
            'Telugu': 'te'
        }
    
    def generate_audio(self, text: str, language: str, output_path: Path) -> Path:
        try:
            # Get language code
            lang_code = self.language_map.get(language, 'hi')
            
            logger.info(f"🎵 Generating speech: {text[:50]}... (Language: {language} -> {lang_code})")
            
            from gtts import gTTS
            
            # Generate speech with correct language
            tts = gTTS(text=text, lang=lang_code, slow=False)
            
            # Save as MP3
            mp3_path = output_path.with_suffix('.mp3')
            tts.save(str(mp3_path))
            
            logger.info(f"✅ Audio saved: {mp3_path.name}")
            return mp3_path
            
        except Exception as e:
            logger.error(f"❌ TTS generation failed: {e}")
            logger.exception(e)
            raise

tts_service = TTSService()

@app.get("/")
async def root():
    return {"status": "healthy", "service": "DevotionalAI"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "generations": len(generations_db)
    }

@app.post("/api/v1/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    try:
        logger.info(f"📥 Request: {request.mantra[:50]}... (Language: {request.language})")
        
        gen_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"mantra_{timestamp}_{gen_id[:8]}.mp3"
        output_path = OUTPUT_DIR / filename
        
        # Pass language to TTS service
        final_path = tts_service.generate_audio(
            text=request.mantra,
            language=request.language,
            output_path=output_path
        )
        
        audio_url = f"/outputs/{final_path.name}"
        
        generation = {
            "id": gen_id,
            "status": "completed",
            "audio_url": audio_url,
            "created_at": datetime.utcnow().isoformat()
        }
        generations_db[gen_id] = generation
        
        logger.info(f"✅ Completed: {gen_id}")
        return GenerateResponse(**generation)
        
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting DevotionalAI...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

