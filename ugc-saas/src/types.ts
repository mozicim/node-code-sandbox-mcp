export interface Preset {
  mode: string
  description: string
  slug: string
  emoji: string
}

export interface Hook {
  id: string
  name: string
  type: 'stunt' | 'subtle'
  description: string
  thumbnail: string
  preview: string
}

export interface Setting {
  id: string
  name: string
  type: 'realistic' | 'unrealistic'
  description: string
  thumbnail: string
  preview: string
}

export interface Avatar {
  id: string
  name: string
  gender: 'male' | 'female' | 'nonbinary'
  style: string
  thumbnail: string
}

export type VideoStatus = 'queued' | 'generating' | 'completed' | 'failed'

export interface GeneratedVideo {
  id: string
  productName: string
  productUrl?: string
  preset: Preset
  hook: Hook
  setting: Setting
  avatarName: string
  status: VideoStatus
  thumbnailUrl?: string
  videoUrl?: string
  createdAt: string
  duration?: string
}

export interface User {
  name: string
  email: string
  plan: 'free' | 'starter' | 'pro' | 'business'
  creditsUsed: number
  creditsTotal: number
  avatar?: string
}

export type Page = 'landing' | 'dashboard' | 'create' | 'library' | 'pricing' | 'kapsam' | 'chain' | 'viral'

export interface PageProps {
  navigate: (page: Page) => void
  user: User | null
  videos: GeneratedVideo[]
  onLogin: () => void
  onLogout: () => void
  addVideo: (video: GeneratedVideo) => void
  updateVideo: (id: string, updates: Partial<GeneratedVideo>) => void
}

export interface PricingPlan {
  name: string
  price: number
  period: string
  description: string
  credits: number
  features: string[]
  cta: string
  highlighted: boolean
  badge?: string
}
