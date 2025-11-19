from .celery_app import celery_app
from ..services.ai.tts_service import tts_service
from ..services.video.lyric_video_service import lyric_video_service
from ..services.storage.r2_service import r2_storage
from ..models.generation import Generation, GenerationStatus
from ..core.database import SessionLocal
from datetime import datetime
import tempfile
import os


@celery_app.task(bind=True, name="generate_tts_audio")
def generate_tts_audio(self, generation_id: int):
    db = SessionLocal()
    
    try:
        generation = db.query(Generation).filter(Generation.id == generation_id).first()
        if not generation:
            return {"error": "Generation not found"}
        
        generation.status = GenerationStatus.PROCESSING
        db.commit()
        
        start_time = datetime.now()
        
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            output_path = tmp_file.name
        
        audio_path = tts_service.generate_speech(
            text=generation.input_text,
            language=generation.language,
            voice_style=generation.voice_style,
            voice_preset=generation.selected_voice or "Aryan",
            output_path=output_path
        )
        
        object_key = f"audio/{generation.user_id}/{generation.id}.wav"
        audio_url = r2_storage.upload_file(audio_path, object_key, "audio/wav")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        generation.audio_url = audio_url
        generation.status = GenerationStatus.COMPLETED
        generation.completed_at = datetime.now()
        generation.processing_time_seconds = int(processing_time)
        generation.file_size_bytes = os.path.getsize(audio_path)
        
        db.commit()
        
        os.unlink(audio_path)
        
        return {
            "generation_id": generation_id,
            "audio_url": audio_url,
            "status": "completed"
        }
        
    except Exception as e:
        generation.status = GenerationStatus.FAILED
        generation.error_message = str(e)
        db.commit()
        raise e
        
    finally:
        db.close()

