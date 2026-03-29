import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import type { PlayerResponse } from '../types/trend'

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } }
    tiktokEmbed?: { process: () => void }
  }
}

interface PlayerState {
  data: PlayerResponse | null
  embedHtml: string
  isLoading: boolean
  error: string
  embedError: string
}

function detectPlatform(url: string): 'instagram' | 'youtube' | 'unknown' {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('instagram.com') || lowerUrl.includes('instagr.am')) return 'instagram'
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) return 'youtube'
  return 'unknown'
}

function isPlaybackRestrictedEmbed(html: string, videoUrl: string): boolean {
  const lower = html.toLowerCase()
  const platform = detectPlatform(videoUrl)
  const isInstagramUrl = platform === 'instagram'

  if (lower.includes('watch on instagram')) return true
  if (lower.includes('view more on instagram')) return true

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const iframeEl = doc.querySelector('iframe[src]') as HTMLIFrameElement | null
  const iframeSrc = iframeEl?.getAttribute('src')?.toLowerCase() ?? ''

  const hasUsableIframe = Boolean(iframeEl)
  const looksInstagramEmbed =
    isInstagramUrl ||
    lower.includes('instagram') ||
    Boolean(doc.querySelector('blockquote.instagram-media'))

  // iframe content is cross-origin and cannot be inspected. For Instagram embeds,
  // if Iframely wraps them in an iframe card, treat it as potentially restricted
  // so users see a clear instruction to open in app/site when playback is gated.
  if (isInstagramUrl && iframeSrc.includes('iframe.ly')) return true

  return looksInstagramEmbed && !hasUsableIframe
}

export function PlayerPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()

  const [state, setState] = useState<PlayerState>({
    data: null,
    embedHtml: '',
    isLoading: true,
    error: '',
    embedError: ''
  })

  const platform = state.data ? (state.data.trend.platform ?? detectPlatform(state.data.trend.videoUrl)) : 'unknown'
  const fallbackLabel = platform === 'youtube' ? 'Open on YouTube' : 'Open on Instagram'

  useEffect(() => {
    let cancelled = false

    // Clear everything when slug changes to avoid flickering
    setState({
      data: null,
      embedHtml: '',
      isLoading: true,
      error: '',
      embedError: ''
    })

    async function load() {
      try {
        const result = await api.getPlayer(slug)
        if (cancelled) return

        setState((s) => ({ ...s, data: result, isLoading: false }))

        try {
          const embed = await api.resolveEmbed(result.trend.videoUrl)
          if (cancelled) return
          const restricted = isPlaybackRestrictedEmbed(embed.html, result.trend.videoUrl)
          const currentPlatform = result.trend.platform ?? detectPlatform(result.trend.videoUrl)
          setState((s) => ({
            ...s,
            embedHtml: embed.html,
            embedError:
              restricted && currentPlatform !== 'youtube'
                ? 'Playback restricted by Instagram, open in app/site.'
                : '',
          }))
        } catch {
          if (cancelled) return
          setState((s) => ({ ...s, embedError: 'Video unavailable' }))
        }
      } catch (err) {
        if (cancelled) return
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : 'Trend not found',
          isLoading: false,
        }))
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [slug])

  // Manage dynamic script injection and processing
  useEffect(() => {
    if (!state.embedHtml) return

    const scriptsToCleanup: HTMLScriptElement[] = []
    const parser = new DOMParser()
    const doc = parser.parseFromString(state.embedHtml, 'text/html')
    const scripts = Array.from(doc.querySelectorAll('script'))

    scripts.forEach((scriptEl) => {
      const newScript = document.createElement('script')
      if (scriptEl.src) {
        newScript.src = scriptEl.src
        newScript.async = true
      } else {
        newScript.innerHTML = scriptEl.innerHTML
      }
      document.body.appendChild(newScript)
      scriptsToCleanup.push(newScript)
    })

    const timer = setTimeout(() => {
      if (window.instgrm?.Embeds?.process) window.instgrm.Embeds.process()
      if (window.tiktokEmbed?.process) window.tiktokEmbed.process()
    }, 100)

    return () => {
      clearTimeout(timer)
      scriptsToCleanup.forEach((script) => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      })
    }
  }, [state.embedHtml])

  if (state.isLoading) return <p className="page-loading">Loading player...</p>
  if (state.error || !state.data) return <p className="page-error">{state.error || 'Trend not found'}</p>

  return (
    <main className="page player-page">
      <div className="player-shell">
        <button
          className="player-nav"
          onClick={() => state.data!.navigation.previousSlug && navigate(`/play/${state.data!.navigation.previousSlug}`)}
          disabled={!state.data!.navigation.previousSlug}
        >
          Up
        </button>

        <div className="player-stage">
          <h1>{state.data.trend.title}</h1>
          
          {state.embedHtml && (
            <div className="player-embed" dangerouslySetInnerHTML={{ __html: state.embedHtml }} />
          )}
          
          {state.embedError && (
            <p className="embed-notice">{state.embedError}</p>
          )}

          <a className="fallback-link" href={state.data.trend.videoUrl} target="_blank" rel="noreferrer">
            {fallbackLabel}
          </a>
        </div>

        <button
          className="player-nav"
          onClick={() => state.data!.navigation.nextSlug && navigate(`/play/${state.data!.navigation.nextSlug}`)}
          disabled={!state.data!.navigation.nextSlug}
        >
          Down
        </button>
      </div>
    </main>
  )
}
