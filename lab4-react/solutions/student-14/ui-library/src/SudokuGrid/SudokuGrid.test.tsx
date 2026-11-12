import { render, screen, fireEvent } from '@testing-library/react'

import { SudokuGrid } from './SudokuGrid'

import type { CellData } from './SudokuGrid'

const createEmptyGrid = (): CellData[][] => {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: null, notes: [], isInitial: false }))
  )
}

describe('SudokuGrid', () => {
  test('renders empty cells', () => {
    const grid = createEmptyGrid()

    const { container } = render(<SudokuGrid grid={grid} />)
    
    // Проверяем, что отрендерилось 81 ячейка (9x9)
    // Ищем по классу, так как CSS модули в тестах возвращают хешированные имена
    const cells = container.querySelectorAll('[class*="cell"]')

    expect(cells.length).toBe(81)
  })

  test('renders values and notes correctly', () => {
    const grid = createEmptyGrid()
    
    grid[0][0] = { value: 5, notes: [], isInitial: true }
    grid[0][1] = { value: null, notes: [1, 2], isInitial: false }

    render(<SudokuGrid grid={grid} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('calls onCellClick with correct coordinates', () => {
    const handleCellClick = jest.fn()
    const grid = createEmptyGrid()

    const { container } = render(
      <SudokuGrid grid={grid} onCellClick={handleCellClick} />
    )
    
    const cells = container.querySelectorAll('[class*="cell"]')

    // Кликаем по первой ячейке (0,0)
    fireEvent.click(cells[0])
    
    expect(handleCellClick).toHaveBeenCalledWith(0, 0)

    // Кликаем по десятой ячейке (ряд 1, колонка 0)
    fireEvent.click(cells[9])
    expect(handleCellClick).toHaveBeenCalledWith(1, 0)
  })

  test('applies selected class', () => {
    const grid = createEmptyGrid()
    const { container } = render(
      <SudokuGrid grid={grid} selectedCell={{ row: 0, col: 0 }} />
    )
    
    const cells = container.querySelectorAll('[class*="cell"]')

    expect(cells[0].className).toMatch(/selected/)
  })
})