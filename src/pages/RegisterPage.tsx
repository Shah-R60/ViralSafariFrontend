import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { setToken, setTokenMeta } from '../services/auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const password = String(data.get('password') ?? '')

    try {
      const result = await api.register(name, email, password)
      setToken(result.accessToken)
      setTokenMeta(result.accessTokenExpiresAt, result.refreshTokenExpiresAt)
      navigate('/submit')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <main className="page auth-page">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Register</h1>
        <label>
          Name
          <input name="name" type="text" required />
        </label>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={6} required />
        </label>
        <button type="submit">Create account</button>
        {error && <p className="err-msg">{error}</p>}
        <p>
          Already a member? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  )
}
