import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import type { PlayerResponse } from '../types/trend'

export function PlayerPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()

  const [data, setData] = useState<PlayerResponse | null>(null)
  const [embedHtml, setEmbedHtml] = useState('')
  const [error, setError] = useState('')
  const [loadedSlug, setLoadedSlug] = useState('')

  useEffect(() => {
    let cancelled = false

    api
      .getPlayer(slug)
      .then(async (result) => {
        if (cancelled) return
        setData(result)
        setError('')
        setLoadedSlug(slug)
        try {
          const embed = await api.resolveEmbed(result.trend.videoUrl)
          if (cancelled) return
          setEmbedHtml(embed.html)
        } catch {
          if (cancelled) return
          setEmbedHtml('')
        }
      })
      .catch((err: Error) => {
        if (cancelled) return
        setData(null)
        setEmbedHtml('')
        setError(err.message)
        setLoadedSlug(slug)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const isLoading = useMemo(() => loadedSlug !== slug, [loadedSlug, slug])

  if (isLoading) return <p className="page-loading">Loading player...</p>
  if (error || !data) return <p className="page-error">{error || 'Trend not found'}</p>

  return (
    <main className="page player-page">
      <div className="player-shell">
        <button
          className="player-nav"
          onClick={() => data.navigation.previousSlug && navigate(`/play/${data.navigation.previousSlug}`)}
          disabled={!data.navigation.previousSlug}
        >
          Up
        </button>

        <div className="player-stage">
          <h1>{data.trend.title}</h1>
          {embedHtml ? (
            <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
          ) : (
            <a className="fallback-link" href={data.trend.videoUrl} target="_blank" rel="noreferrer">
              Open on Instagram
            </a>
          )}
        </div>

        <button
          className="player-nav"
          onClick={() => data.navigation.nextSlug && navigate(`/play/${data.navigation.nextSlug}`)}
          disabled={!data.navigation.nextSlug}
        >
          Down
        </button>
      </div>
    </main>
  )
}
