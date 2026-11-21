import styles from './NumberPanel.module.css'

export interface NumberPanelProps {
  onNumberSelect: (num: number | null) => void
  usedCounts: Record<number, number>
}

export const NumberPanel = ({ onNumberSelect, usedCounts }: NumberPanelProps) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className={styles.panel}>
      {numbers.map((num) => {
        const isExhausted = (usedCounts[num] || 0) >= 9

        return (
          <button
            key={`btn-${num}`}
            className={`${styles.button} ${isExhausted ? styles.disabled : ''}`}
            data-testid={`btn-${num}`}
            disabled={isExhausted}
            onClick={() => !isExhausted && onNumberSelect(num)}
          >
            {num}
          </button>
        )
      })}
      <button
        className={styles.button}
        data-testid="btn-clear"
        onClick={() => onNumberSelect(null)}
      >
        Очистить
      </button>
    </div>
  )
}