const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface GenerateRequest {
  mantra: string;
  language: 'Hindi' | 'Sanskrit' | 'Tamil' | 'Telugu';
  voice_style: 'Devotional' | 'Meditative' | 'Energetic' | 'Calm';
  voice: string;
}

export interface GenerateResponse {
  id: string;
  status: string;
  audio_url?: string;
  error_message?: string;
  created_at: string;
}

export class APIClient {
  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${API_URL}/api/v1/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Generation failed');
    }
    
    return response.json();
  }
  
  getAudioUrl(path: string): string {
    return path.startsWith('http') ? path : `${API_URL}${path}`;
  }
}

export const apiClient = new APIClient();

