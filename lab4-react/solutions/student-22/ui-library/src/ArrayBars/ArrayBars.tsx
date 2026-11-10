import React from 'react'

import styles from './ArrayBars.module.css'

export interface ArrayBarsProps {
  values: number[]
  comparing?: number[]
  sorted?: number[]
  height?: number
}

// Панель визуализации массива: каждый элемент — столбец,
// высота столбца пропорциональна значению
export const ArrayBars: React.FC<ArrayBarsProps> = ({
  values,
  comparing = [],
  sorted = [],
  height = 240,
}) => {
  if (values.length === 0) {
    return <div className={styles.empty}>Массив пуст</div>
  }

  const max = Math.max(...values)

  const getBarClass = (index: number): string => {
    if (comparing.includes(index)) {
      return `${styles.bar} ${styles.comparing}`
    }

    if (sorted.includes(index)) {
      return `${styles.bar} ${styles.sorted}`
    }

    return styles.bar
  }

  return (
    <div className={styles.panel} style={{ height }}>
      {values.map((value, index) => (
        <div
          key={index}
          className={getBarClass(index)}
          style={{ height: `${max > 0 ? (value / max) * 100 : 0}%` }}
          data-testid="bar"
        >
          <span className={styles.label}>{value}</span>
        </div>
      ))}
    </div>
  )
}
