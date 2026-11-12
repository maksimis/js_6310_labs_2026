import React from 'react'

import { BreakoutBoardProps, Brick } from './types'

const getBrickTypeLabel = (brick: Brick): string => {
  if (brick.type === 'indestructible') {
    return '∞'
  }

  if (brick.type === 'bonus') {
    return `★${brick.durability}`
  }

  return `${brick.durability}`
}

const getBrickStroke = (brick: Brick): string => {
  if (brick.type === 'indestructible') {
    return '#94a3b8'
  }

  if (brick.type === 'armored' || brick.durability > 1) {
    return '#f8fafc'
  }

  if (brick.type === 'bonus') {
    return '#fde047'
  }

  return 'transparent'
}

export const BreakoutBoard: React.FC<BreakoutBoardProps> = ({
  width,
  height,
  bricks,
  paddle,
  ball,
  className = ''
}: BreakoutBoardProps): React.ReactElement => {
  const activeBricks: Brick[] = bricks.filter(
    (brick: Brick): boolean => brick.durability > 0 || brick.type === 'indestructible'
  )

  return (
    <div
      data-testid="breakout-board-container"
      className={className}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        aspectRatio: `${width} / ${height}`,
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '2px solid #334155',
        boxSizing: 'border-box'
      }}
    >
      <svg
        data-testid="breakout-board-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      >
        {activeBricks.map((brick: Brick): React.ReactElement => (
          <g key={brick.id} data-testid={`brick-${brick.id}`}>
            <rect
              x={brick.x}
              y={brick.y}
              width={brick.width}
              height={brick.height}
              fill={brick.color}
              stroke={getBrickStroke(brick)}
              strokeWidth={brick.durability > 1 || brick.type ? 2 : 0}
              rx={4}
            />
            <text
              x={brick.x + brick.width / 2}
              y={brick.y + brick.height / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#0f172a"
              fontSize={Math.min(12, brick.height * 0.6)}
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {getBrickTypeLabel(brick)}
            </text>
          </g>
        ))}

        <rect
          data-testid="breakout-paddle"
          x={paddle.x}
          y={paddle.y}
          width={paddle.width}
          height={paddle.height}
          fill={paddle.color ?? '#38bdf8'}
          rx={paddle.height / 2}
        />

        <circle
          data-testid="breakout-ball"
          cx={ball.x}
          cy={ball.y}
          r={ball.radius}
          fill={ball.color ?? '#f43f5e'}
        />
      </svg>
    </div>
  )
}