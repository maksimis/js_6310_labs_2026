import React from 'react'
import './ResultPanel.css'

export interface SolutionStats {
  totalAttempts: number
  correctAttempts: number
  averageTime?: number
}

export interface ResultPanelProps {
  isCorrect: boolean | null
  explanation: string
  stats: SolutionStats
  className?: string
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  isCorrect,
  explanation,
  stats,
  className = ''
}) => {
  const getStatusText = (): string => {
    if (isCorrect === null) {
      return 'Ожидание проверки'
    }

    return isCorrect ? 'Верно ✅' : 'Неверно ❌'
  }

  const getStatusClass = (): string => {
    if (isCorrect === null) {
      return 'result-panel__status--pending'
    }

    return isCorrect
      ? 'result-panel__status--correct'
      : 'result-panel__status--incorrect'
  }

  const successPercent =
    stats.totalAttempts > 0
      ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100)
      : 0

  return (
    <div className={`result-panel ${className}`}>
      <h2 className="result-panel__title">Результат проверки</h2>
      <div className={`result-panel__status ${getStatusClass()}`}>
        {getStatusText()}
      </div>
      <p className="result-panel__explanation">{explanation}</p>
      <div className="result-panel__stats">
        <h3 className="result-panel__stats-title">Статистика решений</h3>
        <ul className="result-panel__stats-list">
          <li>Всего попыток: {stats.totalAttempts}</li>
          <li>Правильных ответов: {stats.correctAttempts}</li>
          <li>Процент успеха: {successPercent}%</li>
          {stats.averageTime !== undefined && (
            <li>Среднее время: {stats.averageTime.toFixed(1)} сек.</li>
          )}
        </ul>
      </div>
    </div>
  )
}