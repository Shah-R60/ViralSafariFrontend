import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { api } from '../services/api'
import { setToken, setTokenMeta } from '../services/auth'
import { firebaseAuth, googleProvider } from '../services/firebase'

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onGoogleLogin() {
    setError('')
    setLoading(true)

    try {
      const credential = await signInWithPopup(firebaseAuth, googleProvider)
      const idToken = await credential.user.getIdToken()
      const result = await api.loginWithGoogle(idToken)
      setToken(result.accessToken)
      setTokenMeta(result.accessTokenExpiresAt, result.refreshTokenExpiresAt)
      navigate('/submit')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page login-page-google">
      <section className="login-showcase">
        <div className="login-showcase__badge">Instagram vibes</div>
        <h1>See everyday moments from your close friends.</h1>
        <p>Login with Google to submit old trends to ViralSafari.</p>
      </section>

      <section className="login-panel">
        <h2>Sign in to ViralSafari</h2>
        <button type="button" onClick={onGoogleLogin} disabled={loading} className="google-login-btn">
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        {error && <p className="err-msg">{error}</p>}
      </section>
    </main>
  )
}
