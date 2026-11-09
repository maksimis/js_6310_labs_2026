import { useCallback, useMemo, useState } from 'react'

import { type CellData, NumberPanel, SudokuGrid } from '@my-app/ui-library'
import '@my-app/ui-library/index.css'

import './App.css'

const createEmptyGrid = (): CellData[][] => {
  return Array(9).fill(null).map(() => {
    return Array(9).fill(null).map(() => {
      return { state: 'empty', value: null }
    })
  })
}

export const App = () => {
  const [grid, setGrid] = useState<CellData[][]>(createEmptyGrid())
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)

  const usedCounts = useMemo(() => {
    const counts: Record<number, number> = {}

    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.value !== null) {
          counts[cell.value] = (counts[cell.value] || 0) + 1
        }
      })
    })

    return counts
  }, [grid])

  const handleCellClick = useCallback((r: number, c: number) => {
    setSelectedCell([r, c])
  }, [])

  const handleNumberSelect = useCallback((num: number | null) => {
    if (!selectedCell) {
      return
    }

    const [r, c] = selectedCell

    if (grid[r][c].state === 'initial') {
      return
    }

    const newGrid = [...grid]

    newGrid[r] = [...newGrid[r]]
    newGrid[r][c] = {
      ...newGrid[r][c],
      state: num === null ? 'empty' : 'user',
      value: num
    }

    setGrid(newGrid)
  }, [selectedCell, grid])

  return (
    <div className="container">
      <h1>Судоку</h1>
      <div className="gameArea">
        <SudokuGrid
          grid={grid}
          onCellClick={handleCellClick}
          selectedCell={selectedCell}
        />
        <NumberPanel
          onNumberSelect={handleNumberSelect}
          usedCounts={usedCounts}
        />
      </div>
    </div>
  )
}