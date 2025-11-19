from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from pydantic import BaseModel
from datetime import datetime

from ....core.database import get_db
from ....core.security import decode_token
from ....models.generation import Generation, GenerationType, GenerationStatus
from ....models.user import User
from ....workers.tasks import generate_tts_audio


router = APIRouter()


class GenerationCreate(BaseModel):
    input_text: str
    language: str = "sanskrit"
    voice_style: str = "devotional"
    selected_voice: str = "Aryan"
    generation_type: str = "tts_mantra"
    template_id: Optional[str] = None


class GenerationResponse(BaseModel):
    id: int
    user_id: int
    generation_type: str
    status: str
    input_text: str
    language: str
    voice_style: str
    selected_voice: str
    audio_url: Optional[str] = None
    video_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.post("/", response_model=GenerationResponse, status_code=status.HTTP_201_CREATED)
def create_generation(
    generation_data: GenerationCreate,
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db: Session = Depends(get_db)
) -> Any:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    user = get_current_user(token, db)
    
    # Check generation limit
    if user.generations_count >= user.generations_limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Generation limit reached. Please upgrade your plan."
        )
    
    new_generation = Generation(
        user_id=user.id,
        generation_type=GenerationType(generation_data.generation_type),
        input_text=generation_data.input_text,
        language=generation_data.language,
        voice_style=generation_data.voice_style,
        selected_voice=generation_data.selected_voice,
        template_id=generation_data.template_id,
        status=GenerationStatus.PENDING
    )
    
    db.add(new_generation)
    user.generations_count += 1
    db.commit()
    db.refresh(new_generation)
    
    # Trigger async task
    generate_tts_audio.delay(new_generation.id)
    
    return new_generation


@router.get("/", response_model=List[GenerationResponse])
def list_generations(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
) -> Any:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    user = get_current_user(token, db)
    
    generations = db.query(Generation).filter(
        Generation.user_id == user.id
    ).offset(skip).limit(limit).all()
    
    return generations


@router.get("/{generation_id}", response_model=GenerationResponse)
def get_generation(
    generation_id: int,
    authorization: Optional[str] = Header(None, alias="Authorization"),
    db: Session = Depends(get_db)
) -> Any:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header required"
        )
    
    token = authorization.split(" ")[1]
    user = get_current_user(token, db)
    
    generation = db.query(Generation).filter(
        Generation.id == generation_id,
        Generation.user_id == user.id
    ).first()
    
    if not generation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Generation not found"
        )
    
    return generation

