import React from 'react'

import {
  getFilledSquaresCount,
  getStatusLabel,
  resolveGoalStatus,
} from '../okrUtils'
import styles from './OkrGoalCard.module.css'

import type { OkrStatus } from '../okrUtils'

export interface OkrGoalCardProps {
  title: string
  progress: number
  status?: OkrStatus
  deadline?: string
  onToggleUrgent?: () => void
  children?: React.ReactNode
}

const SQUARES_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export const OkrGoalCard: React.FC<OkrGoalCardProps> = ({
  title,
  progress,
  status,
  deadline,
  onToggleUrgent,
  children,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)))
  const resolvedStatus = resolveGoalStatus(clampedProgress, status)
  const statusLabel = getStatusLabel(resolvedStatus)
  const filledSquares = getFilledSquaresCount(clampedProgress)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleBlock}>
          <h3 className={styles.title}>{title}</h3>
          {deadline && <span className={styles.deadline}>до {deadline}</span>}
        </div>
        <div className={styles.statusActions}>
          <span className={`${styles.statusBadge} ${styles[`status--${resolvedStatus}`]}`}>
            {statusLabel}
          </span>
          {onToggleUrgent && resolvedStatus !== 'completed' && (
            <button
              type="button"
              className={styles.urgentToggle}
              onClick={onToggleUrgent}
            >
              {resolvedStatus === 'urgent' ? 'Обычный статус' : 'Сделать срочным'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Прогресс цели</span>
          <span className={styles.progressValue}>{clampedProgress}%</span>
        </div>
        <div
          className={styles.squaresBar}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Прогресс цели ${title}`}
        >
          {SQUARES_INDICES.map((index) => {
            const isFilled = index < filledSquares

            return (
              <span
                key={index}
                data-testid="progress-square"
                data-filled={isFilled ? 'true' : 'false'}
                className={`${styles.square} ${isFilled ? styles.squareFilled : ''}`}
              />
            )
          })}
        </div>
      </div>

      {children && <div className={styles.content}>{children}</div>}
    </div>
  )
}
