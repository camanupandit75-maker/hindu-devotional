export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: {
    plan: 'free' | 'creator' | 'pro'
    status: 'active' | 'expired' | 'cancelled'
    expiresAt?: string
  }
  usage: {
    generationsUsed: number
    generationsLimit: number
    totalCreations: number
  }
}

export interface Generation {
  id: string
  mantra: string
  language: string
  voiceStyle: string
  voice: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  audioUrl?: string
  videoUrl?: string
  templateId?: string
  duration?: number
}

export interface Template {
  id: string
  name: string
  category: 'temple' | 'nature' | 'abstract' | 'festive'
  thumbnail: string
  preview: string
  premium: boolean
  description: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  features: string[]
  popular?: boolean
}

export const mockUser: User = {
  id: '1',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  avatar: '/avatars/user1.jpg',
  subscription: {
    plan: 'creator',
    status: 'active',
    expiresAt: '2024-12-31',
  },
  usage: {
    generationsUsed: 45,
    generationsLimit: 100,
    totalCreations: 23,
  },
}

export const mockGenerations: Generation[] = [
  {
    id: '1',
    mantra: 'ॐ नमो भगवते वासुदेवाय',
    language: 'Sanskrit',
    voiceStyle: 'Devotional',
    voice: 'Krishna Voice',
    status: 'completed',
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:32:00Z',
    audioUrl: '/audio/gen1.mp3',
    videoUrl: '/video/gen1.mp4',
    templateId: 't1',
    duration: 120,
  },
  {
    id: '2',
    mantra: 'हरे कृष्ण हरे कृष्ण',
    language: 'Hindi',
    voiceStyle: 'Meditative',
    voice: 'Shiva Voice',
    status: 'processing',
    createdAt: '2024-01-16T14:20:00Z',
    duration: 90,
  },
  {
    id: '3',
    mantra: 'ॐ शान्ति शान्ति शान्ति',
    language: 'Sanskrit',
    voiceStyle: 'Energetic',
    voice: 'Ganesha Voice',
    status: 'completed',
    createdAt: '2024-01-17T09:15:00Z',
    completedAt: '2024-01-17T09:17:00Z',
    audioUrl: '/audio/gen3.mp3',
    templateId: 't2',
    duration: 60,
  },
  {
    id: '4',
    mantra: 'ॐ नमः शिवाय',
    language: 'Sanskrit',
    voiceStyle: 'Devotional',
    voice: 'Shiva Voice',
    status: 'pending',
    createdAt: '2024-01-18T11:00:00Z',
  },
  {
    id: '5',
    mantra: 'राम राम राम',
    language: 'Hindi',
    voiceStyle: 'Meditative',
    voice: 'Rama Voice',
    status: 'failed',
    createdAt: '2024-01-19T16:45:00Z',
  },
]

export const mockTemplates: Template[] = [
  {
    id: 't1',
    name: 'Golden Temple',
    category: 'temple',
    thumbnail: '/templates/temple1.jpg',
    preview: '/templates/temple1-preview.jpg',
    premium: false,
    description: 'Beautiful golden temple backdrop with traditional architecture',
  },
  {
    id: 't2',
    name: 'Lotus Pond',
    category: 'nature',
    thumbnail: '/templates/nature1.jpg',
    preview: '/templates/nature1-preview.jpg',
    premium: false,
    description: 'Serene lotus pond with floating flowers',
  },
  {
    id: 't3',
    name: 'Om Symbol',
    category: 'abstract',
    thumbnail: '/templates/abstract1.jpg',
    preview: '/templates/abstract1-preview.jpg',
    premium: true,
    description: 'Elegant Om symbol with gradient background',
  },
  {
    id: 't4',
    name: 'Diwali Celebration',
    category: 'festive',
    thumbnail: '/templates/festive1.jpg',
    preview: '/templates/festive1-preview.jpg',
    premium: true,
    description: 'Vibrant Diwali lights and decorations',
  },
  {
    id: 't5',
    name: 'Mountain Temple',
    category: 'temple',
    thumbnail: '/templates/temple2.jpg',
    preview: '/templates/temple2-preview.jpg',
    premium: false,
    description: 'Ancient temple on mountain peak',
  },
  {
    id: 't6',
    name: 'Sunset Ganges',
    category: 'nature',
    thumbnail: '/templates/nature2.jpg',
    preview: '/templates/nature2-preview.jpg',
    premium: true,
    description: 'Peaceful Ganges river at sunset',
  },
  {
    id: 't7',
    name: 'Mandala Pattern',
    category: 'abstract',
    thumbnail: '/templates/abstract2.jpg',
    preview: '/templates/abstract2-preview.jpg',
    premium: false,
    description: 'Intricate mandala design',
  },
  {
    id: 't8',
    name: 'Holi Festival',
    category: 'festive',
    thumbnail: '/templates/festive2.jpg',
    preview: '/templates/festive2-preview.jpg',
    premium: true,
    description: 'Colorful Holi celebration',
  },
]

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    features: [
      '5 generations per month',
      'Basic voice styles',
      'Standard templates',
      'Watermarked videos',
      'Community support',
    ],
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19,
    yearlyPrice: 190,
    popular: true,
    features: [
      '100 generations per month',
      'All voice styles',
      'Premium templates',
      'No watermarks',
      'HD video quality',
      'Priority support',
      'Commercial license',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    yearlyPrice: 490,
    features: [
      'Unlimited generations',
      'All voice styles',
      'All templates',
      'No watermarks',
      '4K video quality',
      '24/7 priority support',
      'Commercial license',
      'API access',
      'Custom branding',
    ],
  },
]

export const languages = [
  { value: 'sanskrit', label: 'Sanskrit', devanagari: true },
  { value: 'hindi', label: 'Hindi', devanagari: true },
  { value: 'tamil', label: 'Tamil', devanagari: false },
  { value: 'telugu', label: 'Telugu', devanagari: false },
]

export const voiceStyles = [
  { value: 'devotional', label: 'Devotional', description: 'Warm and reverent' },
  { value: 'meditative', label: 'Meditative', description: 'Calm and peaceful' },
  { value: 'energetic', label: 'Energetic', description: 'Vibrant and uplifting' },
]

export const voices = [
  { value: 'krishna', label: 'Krishna Voice', style: 'devotional' },
  { value: 'shiva', label: 'Shiva Voice', style: 'devotional' },
  { value: 'rama', label: 'Rama Voice', style: 'meditative' },
  { value: 'ganesha', label: 'Ganesha Voice', style: 'energetic' },
  { value: 'lakshmi', label: 'Lakshmi Voice', style: 'devotional' },
  { value: 'saraswati', label: 'Saraswati Voice', style: 'meditative' },
]

