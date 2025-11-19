from transformers import AutoTokenizer, ParlerTTSForConditionalGeneration
import torch
import soundfile as sf
from datetime import datetime
from pathlib import Path
from ...core.config import settings


class TTSService:
    def __init__(self):
        self.model_name = "ai4bharat/indic-parler-tts"
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    def load_model(self):
        if self.model is None:
            print(f"Loading TTS model on {self.device}...")
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = ParlerTTSForConditionalGeneration.from_pretrained(
                self.model_name,
                cache_dir=settings.MODEL_CACHE_DIR
            ).to(self.device)
            print("TTS model loaded successfully")
    
    def generate_speech(
        self,
        text: str,
        language: str = "sanskrit",
        voice_style: str = "devotional",
        voice_preset: str = "Aryan",
        output_path: str = None
    ) -> str:
        self.load_model()
        
        style_descriptions = {
            "devotional": "in a devotional, calm, and reverent tone",
            "meditative": "in a meditative, slow, and peaceful tone",
            "energetic": "in an energetic, clear, and powerful tone"
        }
        
        description = f"{voice_preset} speaks {style_descriptions.get(voice_style, 'clearly')} with clear pronunciation in {language}"
        
        input_ids = self.tokenizer(description, return_tensors="pt").input_ids.to(self.device)
        prompt_input_ids = self.tokenizer(text, return_tensors="pt").input_ids.to(self.device)
        
        generation = self.model.generate(input_ids=input_ids, prompt_input_ids=prompt_input_ids)
        audio_arr = generation.cpu().numpy().squeeze()
        
        if output_path is None:
            output_path = f"output_{datetime.now().timestamp()}.wav"
        
        sample_rate = 24000
        sf.write(output_path, audio_arr, sample_rate)
        
        return output_path
    
    def get_available_voices(self, language: str = "sanskrit"):
        voices = {
            "sanskrit": [
                {"id": "aryan", "name": "Aryan", "gender": "male", "age": "adult"},
                {"id": "priya", "name": "Priya", "gender": "female", "age": "adult"},
                {"id": "guru", "name": "Guru", "gender": "male", "age": "elder"},
            ],
            "hindi": [
                {"id": "raj", "name": "Raj", "gender": "male", "age": "adult"},
                {"id": "ananya", "name": "Ananya", "gender": "female", "age": "adult"},
            ]
        }
        return voices.get(language, [])


tts_service = TTSService()

