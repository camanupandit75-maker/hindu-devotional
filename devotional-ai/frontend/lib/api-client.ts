const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiError {
  detail: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: 'An error occurred',
      }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: { email: string; password: string; full_name: string }) {
    return this.request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(email: string, password: string) {
    return this.request<{
      access_token: string;
      refresh_token: string;
      token_type: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Generation endpoints
  async createGeneration(data: {
    input_text: string;
    language: string;
    voice_style: string;
    selected_voice: string;
    generation_type?: string;
    template_id?: string;
  }) {
    return this.request<{
      id: number;
      user_id: number;
      generation_type: string;
      status: string;
      input_text: string;
      language: string;
      voice_style: string;
      selected_voice: string;
      audio_url: string | null;
      video_url: string | null;
      created_at: string;
      completed_at: string | null;
    }>('/generations/', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        generation_type: data.generation_type || 'tts_mantra',
      }),
    });
  }

  async getGenerations(skip = 0, limit = 20) {
    return this.request<Array<{
      id: number;
      user_id: number;
      generation_type: string;
      status: string;
      input_text: string;
      language: string;
      voice_style: string;
      selected_voice: string;
      audio_url: string | null;
      video_url: string | null;
      created_at: string;
      completed_at: string | null;
    }>>(`/generations/?skip=${skip}&limit=${limit}`, {
      method: 'GET',
    });
  }

  async getGeneration(id: number) {
    return this.request<{
      id: number;
      user_id: number;
      generation_type: string;
      status: string;
      input_text: string;
      language: string;
      voice_style: string;
      selected_voice: string;
      audio_url: string | null;
      video_url: string | null;
      created_at: string;
      completed_at: string | null;
    }>(`/generations/${id}`, {
      method: 'GET',
    });
  }

  // New simplified generate method for simplified backend
  async generate(req: {
    mantra: string;
    language: 'Hindi' | 'Sanskrit' | 'Tamil' | 'Telugu';
    voice_style: 'Devotional' | 'Meditative' | 'Energetic' | 'Calm';
    voice: string;
  }): Promise<{
    id: string;
    status: string;
    audio_url?: string;
    error_message?: string;
    created_at: string;
  }> {
    // Use simplified backend endpoint (no auth required)
    const simplifiedApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${simplifiedApiUrl}/api/v1/generate`, {
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
    const simplifiedApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return path.startsWith('http') ? path : `${simplifiedApiUrl}${path}`;
  }
}

export const apiClient = new ApiClient();

