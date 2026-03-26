import { useEffect, useState } from 'react'
import { DateBlock } from '../components/DateBlock'
import { api } from '../services/api'
import type { SafariResponse } from '../types/trend'

export function SafariPage() {
  const [data, setData] = useState<SafariResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getSafari().then(setData).catch((err: Error) => setError(err.message))
  }, [])

  if (error) return <p className="page-error">{error}</p>
  if (!data) return <p className="page-loading">Loading archive...</p>

  return (
    <main className="page safari-page">
      <header className="safari-header">
        <h1>Safari Archive</h1>
        <p>Every date block is a snapshot of what Instagram loved that day.</p>
      </header>

      {data.days.map((day) => (
        <DateBlock key={day.date} date={day.date} items={day.items} />
      ))}
    </main>
  )
}
