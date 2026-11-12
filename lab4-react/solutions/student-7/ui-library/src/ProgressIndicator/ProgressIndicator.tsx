import React from 'react'

import styles from './ProgressIndicator.module.css'

export interface ProgressIndicatorProps {
  level: number;
  sequenceLength: number;
  record: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  level,
  sequenceLength,
  record,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.stat}>
        <span className={styles.label}>Уровень:</span>
        <span className={styles.value}>{level}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Длина:</span>
        <span className={styles.value}>{sequenceLength}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Рекорд:</span>
        <span className={styles.value}>{record}</span>
      </div>
    </div>
  )
}