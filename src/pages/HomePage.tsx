import { useEffect, useState } from 'react'
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

  return (
    <main className="page home-page">
      {data.hero && (
        <section
          className="hero"
          style={{ backgroundImage: `linear-gradient(to right, #050506 22%, rgba(5,5,6,0.12)), url(${data.hero.thumbnailImage})` }}
        >
          <div className="hero__content">
            <p className="hero__kicker">ViralSafari Original</p>
            <h1>{data.hero.title}</h1>
            <p>Travel back to the trend that ruled Instagram on {new Date(data.hero.trendDate).toLocaleDateString()}.</p>
            <Link className="hero__button" to={`/play/${data.hero.slug}`}>Play Safari</Link>
          </div>
        </section>
      )}

      <section className="rail">
        <h2>Trending Now</h2>
        <div className="rail__grid">
          {data.rails.latest.map((trend) => (
            <TrendCard key={trend._id} trend={trend} />
          ))}
        </div>
      </section>

      <section className="rail">
        <h2>Throwback Picks</h2>
        <div className="rail__grid">
          {data.rails.throwback.map((trend) => (
            <TrendCard key={trend._id} trend={trend} />
          ))}
        </div>
      </section>
    </main>
  )
}
