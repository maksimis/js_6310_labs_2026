import React from 'react'

import styles from './ScorePanel.module.css'
import { Button } from '../Button/Button'

export interface ScorePanelProps {
  score: number
  highScore: number
  onNewGame: () => void
  onUndo: () => void
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  highScore,
  onNewGame,
  onUndo
}) => {
  return (
    <div className={styles.panel}>
      <div className={styles.scores}>
        <div className={styles.scoreBox}>
          <span className={styles.label}>Счёт</span>
          <span className={styles.value}>{score}</span>
        </div>
        <div className={styles.scoreBox}>
          <span className={styles.label}>Рекорд</span>
          <span className={styles.value}>{highScore}</span>
        </div>
      </div>
      <div className={styles.controls}>
        <Button variant="secondary" onClick={onUndo}>
          Отменить ход
        </Button>
        <Button variant="primary" onClick={onNewGame}>
          Новая игра
        </Button>
      </div>
    </div>
  )
}