import { useState, type FormEvent } from 'react'
import { api } from '../services/api'

export function SubmitPage() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const result = await api.submitTrend(formData)
      setMessage(result.message)
      form.reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submit failed'
      setError(message === 'Unauthorized' ? 'Session expired. Please login again.' : message)
    }
  }

  return (
    <main className="page submit-page">
      <section className="submit-card">
        <h1>Submit a Trend</h1>
        <p>Your trend will go live after admin approval.</p>

        <form onSubmit={onSubmit} className="submit-form">
          <label>
            Link
            <input name="link" type="url" required placeholder="https://www.instagram.com/reel/..." />
          </label>

          <label>
            Title
            <input name="title" type="text" required maxLength={120} placeholder="The Wes Anderson Trend" />
          </label>

          <label>
            Date
            <input name="date" type="date" required />
          </label>

          <label>
            Upload Image
            <input name="image" type="file" accept="image/*" required />
          </label>

          <button type="submit">Submit</button>
        </form>

        {message && <p className="ok-msg">{message}</p>}
        {error && <p className="err-msg">{error}</p>}
      </section>
    </main>
  )
}
