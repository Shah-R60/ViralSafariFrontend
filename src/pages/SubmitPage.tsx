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
        <p>Accepted links: Instagram reels/posts, YouTube Shorts, youtu.be, and YouTube watch URLs.</p>

        <form onSubmit={onSubmit} className="submit-form">
          <label>
            Link
            <input
              name="link"
              type="url"
              required
              placeholder="https://www.instagram.com/reel/... or https://youtube.com/shorts/..."
            />
          </label>

          <label>
            Title
            <input name="title" type="text" required maxLength={120} placeholder="The Wes Anderson Trend" />
          </label>

          <label>
            Trend Type
            <select name="trendType" required defaultValue="">
              <option value="" disabled>Select trend type</option>
              <option value="dance">Dance</option>
              <option value="meme">Meme</option>
              <option value="aesthetic">Aesthetic</option>
              <option value="info">Info</option>
              <option value="lipsync">Lipsync</option>
              <option value="audio">Audio</option>
            </select>
          </label>

          <label>
            Reason To Watch
            <select name="reasonToWatch" required defaultValue="">
              <option value="" disabled>Select reason</option>
              <option value="audio-driven">Audio-driven</option>
              <option value="meme">Meme</option>
              <option value="visual-edit">Visual-edit</option>
              <option value="pov-dialogue">POV-dialogue</option>
              <option value="challenge">Challenge</option>
            </select>
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
