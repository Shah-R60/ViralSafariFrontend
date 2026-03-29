import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { TrendCard } from '../components/TrendCard'
import { api } from '../services/api'
import type { HomeResponse } from '../types/trend'

export function HomePage() {
  const [data, setData] = useState<HomeResponse | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    api.getHome().then(setData).catch((err: Error) => setError(err.message))
  }, [])

  if (error) {
    return <p className="page-error">{error}</p>
  }

  if (!data) {
    return <p className="page-loading">Loading trends...</p>
  }

  const latestPool = data.rails.latest
  const heroTrend = data.hero ?? latestPool[0] ?? data.rails.throwback[0] ?? null
  const latest = latestPool.slice(0, 5)

  return (
    <main className="page home-page">
      {heroTrend && (
        <section
          className="hero hero--featured"
          style={{ '--hero-image': `url(${heroTrend.thumbnailImage})` } as CSSProperties}
        >
          <div className="hero__content">
            {/* <p className="hero__kicker">SERIES</p> */}
            <h1>{heroTrend.title}</h1>
            <p className="hero__rankline">Top 10 | Trending this week</p>
            <p className="hero__description">
              Scroll back to the post that dominated feeds on {new Date(heroTrend.trendDate).toLocaleDateString()} and relive the original moment.
            </p>
            <div className="hero__actions">
              <Link className="hero__button hero__button--primary" to={`/play/${heroTrend.slug}`}>Play</Link>
              <Link className="hero__button hero__button--ghost" to="/safari">More info</Link>
            </div>
          </div>
        </section>
      )}

      {!heroTrend && (
        <section className="hero hero--empty">
          <div className="hero__content">
            <p className="hero__kicker">No content yet</p>
            <h1>Latest trend will appear here</h1>
            <p className="hero__description">
              There are no approved trends available right now. Approve a submitted trend from admin moderation and refresh this page.
            </p>
          </div>
        </section>
      )}

      <section className="rail">
        <h2>Trending Now</h2>
        {latest.length > 0 ? (
          <div className="rail__grid rail__grid--shorts">
            {latest.map((trend) => (
              <TrendCard key={trend._id} trend={trend} />
            ))}
          </div>
        ) : (
          <p className="page-loading">No approved trends found yet.</p>
        )}
      </section>
    </main>
  )
}
