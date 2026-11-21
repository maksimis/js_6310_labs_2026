import { render, screen } from '@testing-library/react'

import { GameBoard } from './GameBoard'

describe('GameBoard', () => {
  const mockGrid = [
    [0, 2, 0, 4],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2048]
  ]

  test('renders 4x4 grid correctly', () => {
    render(<GameBoard grid={mockGrid} />)
    
    const tiles = screen.getAllByText(/^(2|4|2048)$/)

    expect(tiles).toHaveLength(3)
  })

  test('renders empty tiles for 0 values', () => {
    const emptyGrid = Array(4).fill(Array(4).fill(0))

    render(<GameBoard grid={emptyGrid} />)
    
    const emptyTiles = document.querySelectorAll('.tile--empty')

    expect(emptyTiles).toHaveLength(16)
  })
})