import React, { useState } from 'react'

import {
  BreakoutBoard,
  GameStatusPanel,
  type Brick,
  type PaddlePosition,
  type BallPosition
} from '@my-app/ui-library'

import './App.css'

const INITIAL_BRICKS: Brick[] = [
  { id: '1', x: 40, y: 40, width: 95, height: 26, color: '#4ade80', durability: 1, type: 'normal' },
  { id: '2', x: 150, y: 40, width: 95, height: 26, color: '#38bdf8', durability: 2, type: 'armored' },
  { id: '3', x: 260, y: 40, width: 95, height: 26, color: '#facc15', durability: 1, type: 'bonus' },
  { id: '4', x: 370, y: 40, width: 95, height: 26, color: '#94a3b8', durability: 1, type: 'indestructible' },
  { id: '5', x: 480, y: 40, width: 95, height: 26, color: '#f87171', durability: 3, type: 'armored' },
  { id: '6', x: 95, y: 80, width: 95, height: 26, color: '#a78bfa', durability: 2, type: 'bonus' },
  { id: '7', x: 205, y: 80, width: 95, height: 26, color: '#4ade80', durability: 1, type: 'normal' },
  { id: '8', x: 315, y: 80, width: 95, height: 26, color: '#fb923c', durability: 2, type: 'armored' },
  { id: '9', x: 425, y: 80, width: 95, height: 26, color: '#4ade80', durability: 1, type: 'normal' }
]

export function App(): React.ReactElement {
  const [score, setScore] = useState<number>(150)
  const [lives, setLives] = useState<number>(3)
  const [level, setLevel] = useState<number>(1)
  const [containerWidth, setContainerWidth] = useState<number>(620)
  const [bricks, setBricks] = useState<Brick[]>(INITIAL_BRICKS)
  const [paddleX, setPaddleX] = useState<number>(250)
  const [ballPos, setBallPos] = useState<{ x: number; y: number }>({ x: 305, y: 310 })

  const boardWidth: number = 620
  const boardHeight: number = 380

  const paddle: PaddlePosition = {
    x: paddleX,
    y: 345,
    width: 110,
    height: 14,
    color: '#38bdf8'
  }

  const ball: BallPosition = {
    x: ballPos.x,
    y: ballPos.y,
    radius: 9,
    color: '#f43f5e'
  }

  const handleHitRandomBrick = (): void => {
    let hitDone: boolean = false
    const updated: Brick[] = bricks.map((brick: Brick): Brick => {
      if (!hitDone && brick.durability > 0 && brick.type !== 'indestructible') {
        hitDone = true

        return { ...brick, durability: brick.durability - 1 }
      }

      return brick
    })

    if (hitDone) {
      setBricks(updated)
      setScore((prev: number): number => prev + 50)
      setBallPos((prev: { x: number; y: number }): { x: number; y: number } => ({
        x: ((prev.x + 65) % 500) + 60,
        y: prev.y === 310 ? 130 : 310
      }))
    }
  }

  const handleReset = (): void => {
    setBricks(INITIAL_BRICKS)
    setScore(0)
    setLives(3)
    setLevel(1)
    setPaddleX(250)
    setBallPos({ x: 305, y: 310 })
  }

  return (
    <main className="app-wrapper">
      <h1>Демонстрация UI-компонентов «Брейкаут»</h1>

      <section className="controls-panel">
        <div className="control-group">
          <label htmlFor="paddle-range">Позиция платформы: {paddleX}px</label>
          <input
            id="paddle-range"
            type="range"
            min={0}
            max={boardWidth - paddle.width}
            value={paddleX}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setPaddleX(Number(e.target.value))
            }
          />
        </div>

        <div className="control-group">
          <label htmlFor="scale-range">Ширина контейнера: {containerWidth}px</label>
          <input
            id="scale-range"
            type="range"
            min={300}
            max={620}
            value={containerWidth}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setContainerWidth(Number(e.target.value))
            }
          />
        </div>

        <div className="buttons-row">
          <button type="button" onClick={handleHitRandomBrick}>
            Ударить по кирпичу (+50 очков)
          </button>
          <button
            type="button"
            onClick={(): void => setLevel((prev: number): number => prev + 1)}
          >
            Следующий уровень
          </button>
          <button
            type="button"
            onClick={(): void => setLives((prev: number): number => Math.max(0, prev - 1))}
          >
            Потерять жизнь
          </button>
          <button type="button" onClick={handleReset}>
            Сброс
          </button>
        </div>
      </section>

      <div
        data-testid="scalable-container"
        style={{ width: `${containerWidth}px`, maxWidth: '100%', margin: '0 auto' }}
      >
        <GameStatusPanel score={score} lives={lives} level={level} />
        <div style={{ marginTop: '12px' }}>
          <BreakoutBoard
            width={boardWidth}
            height={boardHeight}
            bricks={bricks}
            paddle={paddle}
            ball={ball}
          />
        </div>
      </div>
    </main>
  )
}

export default App