import React from 'react'

import styles from './GameControls.module.css'
import { Button } from '../Button/Button'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface GameControlsProps {
  difficulty: Difficulty
  onDifficultyChange: (diff: Difficulty) => void
  onNewGame: () => void
  onSurrender: () => void
  currentTurn: 'X' | 'O'
  gameOver: boolean
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onSurrender,
  currentTurn,
  gameOver,
}) => {
  return (
    <div className={styles.controls}>
      
      {/* 1. Выбор сложности */}
      <div className={styles.section}>
        <select 
          value={difficulty} 
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          disabled={gameOver}
        >
          <option value="easy">Легкая</option>
          <option value="medium">Средняя</option>
          <option value="hard">Сложная</option>
        </select>
      </div>

      {/* 2. Индикатор хода */}
      <div className={styles.status}>
        {gameOver ? 'Игра окончена' : `Сейчас ходят: ${currentTurn}`}
      </div>

      {/* 3. Кнопки действий */}
      <div className={styles.actions}>
        <Button onClick={onNewGame} variant="primary">
          Новая игра
        </Button>
        <Button onClick={onSurrender} variant="secondary" disabled={gameOver}>
          Сдаться
        </Button>
      </div>
      
    </div>
  )
}