from moviepy.editor import (
    VideoFileClip, ImageClip, TextClip, CompositeVideoClip,
    AudioFileClip, ColorClip
)
from moviepy.video.fx import resize
from typing import List, Dict
from pathlib import Path


class LyricVideoService:
    
    def __init__(self):
        self.default_fps = 24
        self.default_resolution = (1920, 1080)
        
    def create_lyric_video(
        self,
        audio_path: str,
        lyrics: List[Dict],
        template_config: Dict,
        output_path: str
    ) -> str:
        audio = AudioFileClip(audio_path)
        duration = audio.duration
        
        background = self._create_background(
            template_config.get("background"),
            duration,
            self.default_resolution
        )
        
        text_clips = self._create_text_clips(
            lyrics,
            template_config.get("text_style", {}),
            self.default_resolution
        )
        
        video = CompositeVideoClip(
            [background] + text_clips,
            size=self.default_resolution
        )
        
        video = video.set_audio(audio)
        
        video.write_videofile(
            output_path,
            fps=self.default_fps,
            codec='libx264',
            audio_codec='aac',
            preset='medium'
        )
        
        return output_path
    
    def _create_background(self, bg_config: Dict, duration: float, resolution: tuple):
        if bg_config.get("type") == "image":
            img_clip = ImageClip(bg_config["url"])
            img_clip = resize(img_clip, height=resolution[1])
            img_clip = img_clip.set_duration(duration)
            return img_clip
        else:
            color = bg_config.get("color", "#1a1a2e")
            return ColorClip(size=resolution, color=self._hex_to_rgb(color)).set_duration(duration)
    
    def _create_text_clips(self, lyrics: List[Dict], text_style: Dict, resolution: tuple):
        text_clips = []
        
        for lyric in lyrics:
            txt_clip = TextClip(
                lyric["text"],
                fontsize=text_style.get("font_size", 60),
                color=text_style.get("color", "white"),
                font=text_style.get("font", "Noto-Sans-Devanagari"),
                size=(resolution[0] - 200, None),
                method='caption',
                align='center'
            )
            
            txt_clip = txt_clip.set_position(("center", "center"))
            txt_clip = txt_clip.set_start(lyric["start"])
            txt_clip = txt_clip.set_end(lyric["end"])
            txt_clip = txt_clip.crossfadein(0.3).crossfadeout(0.3)
            
            text_clips.append(txt_clip)
        
        return text_clips
    
    def _hex_to_rgb(self, hex_color: str) -> tuple:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


lyric_video_service = LyricVideoService()

