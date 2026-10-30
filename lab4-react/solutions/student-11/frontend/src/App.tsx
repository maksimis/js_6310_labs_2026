import { useState, useCallback, useEffect } from 'react'

import './App.css'
import '@my-app/ui-library/style.css'
import { GameBoard, ScorePanel } from '@my-app/ui-library'

import type { Grid } from '@my-app/ui-library'

interface HistoryEntry {
  grid: Grid
  scoreGained: number
}

const generateEmptyGrid = (): Grid => Array(4).fill(null).map(() => Array(4).fill(0))

const addRandomTile = (grid: Grid): Grid => {
  const newGrid: Grid = grid.map((row: number[]) => [...row])
  const emptyCells: [number, number][] = []
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newGrid[r][c] === 0) emptyCells.push([r, c])
    }
  }
  
  if (emptyCells.length > 0) {
    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)]

    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4
  }

  return newGrid
}

const rotateGrid = (grid: Grid, times: number): Grid => {
  let result: Grid = grid.map((row: number[]) => [...row])

  for (let t = 0; t < times; t++) {
    const rotated: Grid = Array(4).fill(null).map(() => Array(4).fill(0))

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        rotated[c][3 - r] = result[r][c]
      }
    }
    result = rotated
  }

  return result
}

const moveLeft = (grid: Grid): { newGrid: Grid; moved: boolean; scoreGained: number } => {
  const newGrid: Grid = grid.map((row: number[]) => [...row])
  let moved = false
  let scoreGained = 0
  
  for (let r = 0; r < 4; r++) {
    const row: number[] = newGrid[r].filter((val: number) => val !== 0)

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2
        scoreGained += row[i]
        row.splice(i + 1, 1)
      }
    }
    while (row.length < 4) row.push(0)
    if (newGrid[r].join(',') !== row.join(',')) moved = true
    newGrid[r] = row
  }

  return { newGrid, moved, scoreGained }
}

const moveInDirection = (grid: Grid, direction: string): { newGrid: Grid; moved: boolean; scoreGained: number } => {
  let rotated: Grid = grid
  let rotations = 0

  if (direction === 'up') rotations = 1
  else if (direction === 'right') rotations = 2
  else if (direction === 'down') rotations = 3
  
  if (rotations > 0) rotated = rotateGrid(grid, rotations)
  const result = moveLeft(rotated)

  if (rotations > 0) result.newGrid = rotateGrid(result.newGrid, 4 - rotations)

  return result
}

const hasAvailableMoves = (grid: Grid): boolean => {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true
    }
  }

  return false
}

function App() {
  const [grid, setGrid] = useState<Grid>(addRandomTile(generateEmptyGrid()))
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [gameOver, setGameOver] = useState<boolean>(false)

  const handleNewGame = useCallback(() => {
    setHistory([])
    setScore(0)
    setGameOver(false)
    setGrid(addRandomTile(generateEmptyGrid()))
  }, [])

  const handleUndo = useCallback(() => {
    if (history.length > 0 && !gameOver) {
      const lastEntry = history[history.length - 1]

      setHistory((prev) => prev.slice(0, -1))
      setGrid(lastEntry.grid)
      setScore((prev) => Math.max(0, prev - lastEntry.scoreGained))
    }
  }, [history, gameOver])

  const handleMove = useCallback((direction: string) => {
    if (gameOver) return
    const result = moveInDirection(grid, direction)

    if (result.moved) {
      setHistory((prev) => [...prev, { grid: grid.map((row) => [...row]), scoreGained: result.scoreGained }])
      const gridWithNewTile = addRandomTile(result.newGrid)

      setGrid(gridWithNewTile)
      setScore((prev) => prev + result.scoreGained)
      setHighScore((prev) => Math.max(prev, score + result.scoreGained))
      if (!hasAvailableMoves(gridWithNewTile)) setGameOver(true)
    }
  }, [grid, score, gameOver])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
      }
      if (e.key === 'ArrowLeft') handleMove('left')
      else if (e.key === 'ArrowRight') handleMove('right')
      else if (e.key === 'ArrowUp') handleMove('up')
      else if (e.key === 'ArrowDown') handleMove('down')
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleMove])

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="pastel-title">2048</h1>
        <p className="subtitle">🐱 ура, играем! 🐱</p>
      </header>

      <main className="app-main">
        <div className="left-panel">
          <ScorePanel score={score} highScore={highScore} onNewGame={handleNewGame} onUndo={handleUndo} />
        </div>
        
        <div className="game-area">
          <GameBoard grid={grid} />
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-message">
                <h2>Вы проиграли! 😿</h2>
                <p>Счёт: {score}</p>
                <button onClick={handleNewGame} className="new-game-btn">Новая игра</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App