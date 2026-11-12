import { useState } from 'react'

import { GameField, type SnakeConfig } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'

const initialSnakes: SnakeConfig[] = [
  {
    id: 'snake-1',
    segments: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ],
    direction: 'right',
    color: '#4caf50',
  },
  {
    id: 'snake-2',
    segments: [
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
    direction: 'down',
    color: '#f44336',
  },
]

function App() {
  const [snakes, setSnakes] = useState<SnakeConfig[]>(initialSnakes)
  const [fieldSize, setFieldSize] = useState<number>(10)

  const handleAddSnake = () => {
    const newSnake: SnakeConfig = {
      id: `snake-${Date.now()}`,
      segments: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
      direction: 'right',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    }

    setSnakes([...snakes, newSnake])
  }

  const handleClear = () => {
    setSnakes([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐍 Snake Field Demo</h1>
        <p>Демонстрация компонентов GameField и Snake</p>
      </header>

      <main className="app-main">
        <section className="section">
          <h2>Настройки</h2>
          <div className="controls">
            <label>
              Размер поля:
              <input
                type="number"
                min={5}
                max={20}
                value={fieldSize}
                onChange={(e) => setFieldSize(Number(e.target.value))}
              />
            </label>
            <button onClick={handleAddSnake}>➕ Добавить змею</button>
            <button onClick={handleClear}>🗑️ Очистить</button>
          </div>
        </section>

        <section className="section">
          <h2>Игровое поле {fieldSize}x{fieldSize}</h2>
          <div className="field-container">
            <GameField size={fieldSize} snakes={snakes} />
          </div>
        </section>

        <section className="section">
          <h2>Змеи на поле ({snakes.length})</h2>
          <ul>
            {snakes.map((snake) => (
              <li key={snake.id}>
                {snake.id} — {snake.segments.length} сегментов, направление {snake.direction}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App