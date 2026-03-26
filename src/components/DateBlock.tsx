import { TrendCard } from './TrendCard'
import type { Trend } from '../types/trend'

interface DateBlockProps {
  date: string
  items: Trend[]
}

export function DateBlock({ date, items }: DateBlockProps) {
  const heading = new Date(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section className="date-block">
      <h2>{heading}</h2>
      <div className="date-block__list">
        {items.map((trend) => (
          <TrendCard key={trend._id} trend={trend} />
        ))}
      </div>
    </section>
  )
}
