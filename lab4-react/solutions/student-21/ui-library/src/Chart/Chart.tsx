import React from 'react'
import './Chart.css'

export interface ChartData {
  label: string
  value: number
}

export interface ChartProps {
  data: ChartData[]
  title: string
  step?: number
}

export const Chart: React.FC<ChartProps> = ({
  data,
  title,
  step = 200
}) => {
  const width = 700
  const height = 300
  const paddingLeft = 55
  const paddingRight = 20
  const paddingTop = 35
  const paddingBottom = 40

  if (data.length === 0) {
    return <div className="chart">Нет данных для отображения</div>
  }

  const values = data.map(item => item.value)
  const maxValue = Math.max(...values, 0)
  const safeStep = step > 0 ? step : 200
  const maxScale = Math.max(safeStep, Math.ceil(maxValue / safeStep) * safeStep)

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const points = data.map((item, index) => {
    const x = data.length === 1
      ? paddingLeft + chartWidth / 2
      : paddingLeft + index * chartWidth / (data.length - 1)

    const y = paddingTop + chartHeight - (item.value / maxScale) * chartHeight

    return { x, y, ...item }
  })

  const linePoints = points
    .map(point => `${point.x},${point.y}`)
    .join(' ')

  const scaleValues = Array.from(
    { length: maxScale / safeStep + 1 },
    (_, index) => index * safeStep
  )

  return (
    <div className="chart">
      <h3 className="chart__title">{title}</h3>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="chart__svg"
        role="img"
        aria-label={`Линейный график: ${title}`}
      >
        {scaleValues.map(value => {
          const y = paddingTop + chartHeight - (value / maxScale) * chartHeight

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className="chart__grid"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="chart__axis-label"
              >
                {value}
              </text>
            </g>
          )
        })}

        <polyline
          points={linePoints}
          className="chart__line"
        />

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              className="chart__point"
            />
            <text
              x={point.x}
              y={height - 12}
              textAnchor="middle"
              className="chart__label"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}