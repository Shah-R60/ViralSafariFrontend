import { Link } from 'react-router-dom'
import type { Trend } from '../types/trend'

interface TrendCardProps {
  trend: Trend
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Link className="trend-card" to={`/play/${trend.slug}`}>
      <img src={trend.thumbnailImage} alt={trend.title} loading="lazy" />
      <div className="trend-card__meta">
        <h3>{trend.title}</h3>
        <p>{new Date(trend.trendDate).toLocaleDateString()}</p>
      </div>
    </Link>
  )
}
