import React from 'react'

import styles from './HabitCard.module.css'

export interface HabitCardProps {
  name: string
  currentStreak: number
  bestStreak: number
  isCompletedToday?: boolean
  onMarkComplete?: () => void
  className?: string
}

export const HabitCard: React.FC<HabitCardProps> = ({
  name,
  currentStreak,
  bestStreak,
  isCompletedToday = false,
  onMarkComplete,
  className = '',
}) => {
  const handleClick = (): void => {
    if (!isCompletedToday && onMarkComplete) {
      onMarkComplete()
    }
  }

  return (
    <article className={`${styles.card} ${className}`} data-testid="habit-card">
      <div className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        <span
          className={`${styles.status} ${isCompletedToday ? styles.statusDone : styles.statusWait}`}
        >
          {isCompletedToday ? 'Сегодня готово' : 'Ждёт отметки'}
        </span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Текущая серия</span>
          <span className={styles.statValue} data-testid="current-streak">
            {currentStreak}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Лучшая серия</span>
          <span className={styles.statValue} data-testid="best-streak">
            {bestStreak}
          </span>
        </div>
      </div>

      <button
        type="button"
        className={`${styles.button} ${isCompletedToday ? styles.buttonCompleted : styles.buttonPrimary}`}
        onClick={handleClick}
        disabled={isCompletedToday}
        aria-label={isCompletedToday ? 'Уже выполнено сегодня' : 'Отметить выполненным'}
        data-testid="mark-button"
      >
        {isCompletedToday ? 'Выполнено ✓' : 'Отметить выполненным'}
      </button>
    </article>
  )
}
