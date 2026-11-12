import { useMemo, useState } from 'react'

import type { GameMode, ScoreRecord } from '../types'

import './Scoreboard.css'

interface ScoreboardProps {
  records: ScoreRecord[]
}

const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Классика',
  blitz: 'Блиц',
  survival: 'Выживание'
}

const ALL_MODES = 'all' as const

type FilterValue = GameMode | typeof ALL_MODES

const Scoreboard = ({ records }: ScoreboardProps): React.ReactElement => {
  const [filter, setFilter] = useState<FilterValue>(ALL_MODES)

  const filtered = useMemo<ScoreRecord[]>(() => {
    const base = filter === ALL_MODES
      ? records
      : records.filter((r) => r.mode === filter)

    return [...base].sort((a, b) => b.score - a.score)
  }, [records, filter])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilter(event.target.value as FilterValue)
  }

  return (
    <div className="scoreboard" data-testid="scoreboard">
      <div className="scoreboard__header">
        <h2 className="scoreboard__title">Таблица рекордов</h2>
        <label className="scoreboard__filter">
          Режим:
          <select
            value={filter}
            onChange={handleChange}
            data-testid="mode-filter"
            aria-label="Фильтр по режиму"
          >
            <option value={ALL_MODES}>Все</option>
            <option value="classic">{MODE_LABELS.classic}</option>
            <option value="blitz">{MODE_LABELS.blitz}</option>
            <option value="survival">{MODE_LABELS.survival}</option>
          </select>
        </label>
      </div>
      {filtered.length === 0 ? (
        <p className="scoreboard__empty" data-testid="empty-state">
          Нет записей
        </p>
      ) : (
        <table className="scoreboard__table">
          <thead>
            <tr>
              <th>#</th>
              <th>Игрок</th>
              <th>Счёт</th>
              <th>Режим</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record, index) => (
              <tr key={record.id} data-testid={`row-${record.id}`}>
                <td>{index + 1}</td>
                <td>{record.player}</td>
                <td>{record.score}</td>
                <td>{MODE_LABELS[record.mode]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Scoreboard