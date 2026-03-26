const TOKEN_KEY = 'viralsafari_token'
const ACCESS_EXPIRES_AT_KEY = 'viralsafari_access_expires_at'
const REFRESH_EXPIRES_AT_KEY = 'viralsafari_refresh_expires_at'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function setTokenMeta(accessTokenExpiresAt: string, refreshTokenExpiresAt: string): void {
  localStorage.setItem(ACCESS_EXPIRES_AT_KEY, accessTokenExpiresAt)
  localStorage.setItem(REFRESH_EXPIRES_AT_KEY, refreshTokenExpiresAt)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ACCESS_EXPIRES_AT_KEY)
  localStorage.removeItem(REFRESH_EXPIRES_AT_KEY)
}
