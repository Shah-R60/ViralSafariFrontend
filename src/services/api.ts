import { clearToken, getToken } from './auth'
import type { HomeResponse, PlayerResponse, SafariResponse } from '../types/trend'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  user: {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
  }
}

async function request<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })
  const payload = await response.json().catch(() => ({}))

  if (response.status === 401 && !retried && path !== '/auth/refresh') {
    const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })

    if (refreshed.ok) {
      const refreshedPayload = (await refreshed.json()) as AuthResponse
      localStorage.setItem('viralsafari_token', refreshedPayload.accessToken)
      localStorage.setItem('viralsafari_access_expires_at', refreshedPayload.accessTokenExpiresAt)
      localStorage.setItem('viralsafari_refresh_expires_at', refreshedPayload.refreshTokenExpiresAt)
      return request<T>(path, options, true)
    }

    clearToken()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearToken()
      throw new Error('Unauthorized')
    }
    throw new Error(payload.message ?? 'Request failed')
  }

  return payload as T
}

export const api = {
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  loginWithGoogle: (idToken: string) =>
    request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),

  getHome: () => request<HomeResponse>('/trends/home'),

  getSafari: () => request<SafariResponse>('/trends/safari'),

  getPlayer: (slug: string) => request<PlayerResponse>(`/trends/${slug}`),

  resolveEmbed: (url: string) =>
    request<{ html: string }>(`/embeds/resolve?url=${encodeURIComponent(url)}`),

  submitTrend: (formData: FormData) =>
    request<{ message: string; trend: { slug: string } }>('/trends/submit', {
      method: 'POST',
      body: formData,
    }),
}
