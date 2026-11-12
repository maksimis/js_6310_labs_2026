import React from 'react'

import { GameStatusPanelProps } from './types'

export const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
  score,
  lives,
  level,
  className = ''
}: GameStatusPanelProps): React.ReactElement => {
  const safeLives: number = Math.max(0, lives)
  const hearts: string = '❤️'.repeat(safeLives)

  return (
    <div
      data-testid="game-status-panel"
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
        fontWeight: 600,
        gap: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      <div data-testid="status-score">
        <span>Счёт: </span>
        <span>{score}</span>
      </div>
      <div data-testid="status-level">
        <span>Уровень: </span>
        <span>{level}</span>
      </div>
      <div data-testid="status-lives">
        <span>Жизни: </span>
        <span>{safeLives}</span>
        {safeLives > 0 && <span style={{ marginLeft: '6px' }}>{hearts}</span>}
      </div>
    </div>
  )
}