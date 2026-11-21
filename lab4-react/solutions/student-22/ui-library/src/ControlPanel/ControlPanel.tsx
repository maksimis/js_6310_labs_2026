import React from 'react'

import styles from './ControlPanel.module.css'

export interface AlgorithmOption {
  value: string
  label: string
}

export interface ControlPanelProps {
  algorithms: AlgorithmOption[]
  algorithm: string
  onAlgorithmChange: (value: string) => void
  isPlaying: boolean
  isFinished?: boolean
  onStep: () => void
  onPlayPause: () => void
  onReset: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  minSpeed?: number
  maxSpeed?: number
}

// Панель управления: выбор алгоритма, кнопки «Шаг», «Пауза/Продолжить», «Сброс»
// и ползунок скорости. Сама ничего не сортирует — только сообщает о действиях пользователя
export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithms,
  algorithm,
  onAlgorithmChange,
  isPlaying,
  isFinished = false,
  onStep,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
  minSpeed = 1,
  maxSpeed = 10,
}) => {
  return (
    <div className={styles.panel}>
      <label className={styles.field}>
        Алгоритм
        <select
          className={styles.select}
          value={algorithm}
          onChange={(event) => onAlgorithmChange(event.target.value)}
        >
          {algorithms.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className={styles.button}
        type="button"
        onClick={onStep}
        disabled={isPlaying || isFinished}
      >
        Шаг
      </button>

      <button
        className={styles.button}
        type="button"
        onClick={onPlayPause}
        disabled={isFinished}
      >
        {isPlaying ? 'Пауза' : 'Продолжить'}
      </button>

      <button className={styles.button} type="button" onClick={onReset}>
        Сброс
      </button>

      <label className={styles.field}>
        Скорость: {speed}
        <input
          type="range"
          min={minSpeed}
          max={maxSpeed}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        />
      </label>
    </div>
  )
}
