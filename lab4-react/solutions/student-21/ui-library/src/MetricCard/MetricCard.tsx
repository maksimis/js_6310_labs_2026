import React from 'react'
import './MetricCard.css'

export interface MetricCardProps {
  title: string
  value: number
  change: number
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change
}) => {
  const changeClass = change > 0
    ? 'metriccard__change--positive'
    : change < 0
      ? 'metriccard__change--negative'
      : 'metriccard__change--neutral'

  const arrow = change > 0 ? '\u2191' : change < 0 ? '\u2193' : ''

  return (
    <div className="metriccard">
      <h3 className="metriccard__title">{title}</h3>
      <div className="metriccard__value">{value}</div>
      <div className={`metriccard__change ${changeClass}`}>
        {arrow} {Math.abs(change)}%
      </div>
    </div>
  )
}