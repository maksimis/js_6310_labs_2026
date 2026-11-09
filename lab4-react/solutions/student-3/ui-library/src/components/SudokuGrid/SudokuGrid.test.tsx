import { fireEvent, render, screen } from '@testing-library/react'

import { SudokuGrid } from './SudokuGrid'

describe('SudokuGrid', () => {
  const mockGrid = Array(9).fill(null).map(() => {
    return Array(9).fill({ state: 'empty', value: null })
  })

  it('renders without crashing', () => {
    render(<SudokuGrid grid={mockGrid} onCellClick={() => {}} selectedCell={null} />)

    expect(screen.getAllByTestId(/cell-/).length).toBe(81)
  })

  it('handles cell click', () => {
    const onClick = jest.fn()

    render(<SudokuGrid grid={mockGrid} onCellClick={onClick} selectedCell={null} />)
    fireEvent.click(screen.getByTestId('cell-0-0'))

    expect(onClick).toHaveBeenCalledWith(0, 0)
  })

  it('applies correct classes based on state', () => {
    const customGrid = [...mockGrid]

    customGrid[0] = [
      { state: 'initial', value: 1 },
      { state: 'user', value: 2 },
      { state: 'conflict', value: 3 },
      ...Array(6).fill({ state: 'empty', value: null })
    ]

    render(<SudokuGrid grid={customGrid} onCellClick={() => {}} selectedCell={[0, 1]} />)

    expect(screen.getByTestId('cell-0-0').className).toContain('initial')
    expect(screen.getByTestId('cell-0-1').className).toContain('user')
    expect(screen.getByTestId('cell-0-1').className).toContain('selected')
    expect(screen.getByTestId('cell-0-2').className).toContain('conflict')
  })
})