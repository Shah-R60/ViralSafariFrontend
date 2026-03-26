export interface Trend {
  _id: string
  title: string
  slug: string
  videoUrl: string
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
