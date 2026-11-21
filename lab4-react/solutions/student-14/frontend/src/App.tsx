import { useState } from 'react'

import '@my-app/ui-library/style.css'
import { SudokuGrid, CandidatePanel } from '@my-app/ui-library'

import type { CellData, InputMode } from '@my-app/ui-library'
import './App.css'

const initialGrid: CellData[][] = Array(9).fill(null).map((_, row) => 
  Array(9).fill(null).map((_, col) => ({
    value: (row === 0 && col === 0) ? 5 : null,
    notes: (row === 0 && col === 1) ? [1, 2] : [],
    isInitial: row === 0 && col === 0,
  }))
)

function App() {
  const [grid, setGrid] = useState<CellData[][]>(initialGrid)
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null)
  const [mode, setMode] = useState<InputMode>('value')

  const handleCellClick = (row: number, col: number) => {
    if (grid[row][col].isInitial) {
      return
    }

    setSelectedCell({ row, col })
  }

  const handleNumberSelect = (num: number) => {
    if (!selectedCell) {
      return
    }

    const { row, col } = selectedCell
    const newGrid = grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })))
    const cell = newGrid[row][col]

    if (mode === 'value') {
      cell.value = num
      cell.notes = []
    } else {
      if (cell.value) {
        return
      }

      if (cell.notes.includes(num)) {
        cell.notes = cell.notes.filter(n => n !== num)
      } else {
        cell.notes.push(num)
      }
    }

    setGrid(newGrid)
  }

  const handleErase = () => {
    if (!selectedCell) {
      return
    }

    const { row, col } = selectedCell
    const newGrid = grid.map(r => r.map(c => ({ ...c, notes: [...c.notes] })))
    
    newGrid[row][col].value = null
    newGrid[row][col].notes = []
    
    setGrid(newGrid)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sudoku App</h1>
        <p>Демонстрация компонентов сетки и панели кандидатов</p>
      </header>

      <main className="app-main">
        <div className="game-container">
          <SudokuGrid
            grid={grid}
            selectedCell={selectedCell}
            onCellClick={handleCellClick}
          />
          <CandidatePanel
            mode={mode}
            onModeChange={setMode}
            onNumberSelect={handleNumberSelect}
            onErase={handleErase}
          />
        </div>
      </main>
    </div>
  )
}

export default App