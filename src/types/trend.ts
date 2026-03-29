export type TrendType = 'dance' | 'meme' | 'aesthetic' | 'info' | 'lipsync' | 'audio'
export type ReasonToWatch = 'audio-driven' | 'meme' | 'visual-edit' | 'pov-dialogue' | 'challenge'

export interface Trend {
  _id: string
  title: string
  slug: string
  videoUrl: string
  platform?: 'instagram' | 'youtube'
  trendType?: TrendType
  reasonToWatch?: ReasonToWatch
  thumbnailImage: string
  trendDate: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string 
}

export interface HomeResponse {
  hero: Trend | null
  rails: {
    latest: Trend[]
    throwback: Trend[]
  }
}

export interface SafariResponse {
  days: Array<{ date: string; items: Trend[] }>
}

export interface PlayerResponse {
  trend: Trend
  navigation: {
    nextSlug: string | null
    previousSlug: string | null
  }
}
