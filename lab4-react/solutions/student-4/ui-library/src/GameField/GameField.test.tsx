import { render, screen } from '@testing-library/react'

import { GameField } from './GameField'

describe('GameField', () => {
  test('renders grid with correct size', () => {
    render(<GameField size={10} snakes={[]} />)
    const cells = screen.getAllByTestId('game-field-cell')

    expect(cells.length).toBe(100)
  })

  test('applies correct field dimensions', () => {
    render(<GameField size={10} snakes={[]} cellSize={30} />)
    const field = screen.getByTestId('game-field')

    expect(field.style.width).toBe('300px')
    expect(field.style.height).toBe('300px')
  })

  test('renders snakes', () => {
    const snakes = [
      {
        id: 'snake-1',
        segments: [
          { x: 1, y: 1 },
          { x: 0, y: 1 },
        ],
        direction: 'right' as const,
        color: '#4caf50',
      },
    ]

    render(<GameField size={10} snakes={snakes} />)
    const heads = screen.getAllByTestId('snake-head')
    const segments = screen.getAllByTestId('snake-segment')

    expect(heads.length).toBe(1)
    expect(segments.length).toBe(1)
  })

  test('renders multiple snakes', () => {
    const snakes = [
      {
        id: 'snake-1',
        segments: [{ x: 1, y: 1 }],
        direction: 'right' as const,
      },
      {
        id: 'snake-2',
        segments: [{ x: 5, y: 5 }],
        direction: 'left' as const,
      },
    ]

    render(<GameField size={10} snakes={snakes} />)
    const heads = screen.getAllByTestId('snake-head')

    expect(heads.length).toBe(2)
  })

  test('renders zero segments when snakes list is empty', () => {
    render(<GameField size={5} snakes={[]} />)
    expect(screen.queryByTestId('snake-head')).toBeNull()
    expect(screen.queryByTestId('snake-segment')).toBeNull()
  })
})