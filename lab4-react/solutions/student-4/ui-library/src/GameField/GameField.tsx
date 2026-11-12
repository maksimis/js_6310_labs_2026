import React from 'react'

import styles from './GameField.module.css'
import { Snake, type Direction, type Segment } from '../Snake/Snake'

export interface SnakeConfig {
  id: string
  segments: Segment[]
  direction: Direction
  color?: string
}

export interface GameFieldProps {
  size: number
  snakes: SnakeConfig[]
  cellSize?: number
}

export const GameField: React.FC<GameFieldProps> = ({
  size,
  snakes,
  cellSize = 30,
}) => {
  const fieldWidth = size * cellSize
  const fieldHeight = size * cellSize

  return (
    <div
      className={styles.field}
      data-testid="game-field"
      style={{
        width: `${fieldWidth}px`,
        height: `${fieldHeight}px`,
      }}
    >
      {Array.from({ length: size }).map((_, row) =>
        Array.from({ length: size }).map((_, col) => (
          <div
            key={`cell-${row}-${col}`}
            className={styles.cell}
            data-testid="game-field-cell"
            style={{
              left: `${col * cellSize}px`,
              top: `${row * cellSize}px`,
              width: `${cellSize}px`,
              height: `${cellSize}px`,
            }}
          />
        )),
      )}
      {snakes.map((snake) => (
        <Snake
          key={snake.id}
          segments={snake.segments}
          direction={snake.direction}
          color={snake.color}
          cellSize={cellSize}
        />
      ))}
    </div>
  )
}