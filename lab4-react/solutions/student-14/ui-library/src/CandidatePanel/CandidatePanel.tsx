import React from 'react'

import styles from './CandidatePanel.module.css'

export type InputMode = 'value' | 'note'

export interface CandidatePanelProps {
  mode: InputMode
  onModeChange: (mode: InputMode) => void
  onNumberSelect: (num: number) => void
  onErase: () => void
}

export const CandidatePanel: React.FC<CandidatePanelProps> = ({
  mode,
  onModeChange,
  onNumberSelect,
  onErase,
}) => {
  return (
    <div className={styles.panel}>
      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeBtn} ${mode === 'value' ? styles.active : ''}`}
          onClick={() => onModeChange('value')}
        >
          Значение
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'note' ? styles.active : ''}`}
          onClick={() => onModeChange('note')}
        >
          Заметка
        </button>
      </div>

      <div className={styles.numpad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className={styles.numBtn}
            onClick={() => onNumberSelect(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <button className={styles.eraseBtn} onClick={onErase}>
        Стереть
      </button>
    </div>
  )
}