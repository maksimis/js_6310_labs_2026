import { render, screen } from '@testing-library/react'

import { Snake, type Direction } from './Snake'

describe('Snake', () => {
  const segments = [
    { x: 2, y: 2 },
    { x: 1, y: 2 },
    { x: 0, y: 2 },
  ]

  test('renders all segments', () => {
    render(<Snake segments={segments} direction="right" />)
    const allSegments = screen.getAllByTestId(/snake-(head|segment)/)

    expect(allSegments.length).toBe(segments.length)
  })

  test('applies default color', () => {
    render(<Snake segments={segments} direction="right" />)
    const head = screen.getByTestId('snake-head')

    expect(head.style.backgroundColor).toBe('rgb(76, 175, 80)')
  })

  test('applies correct color', () => {
    render(<Snake segments={segments} direction="right" color="#ff0000" />)
    const head = screen.getByTestId('snake-head')

    expect(head.style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('applies default cell size', () => {
    render(<Snake segments={segments} direction="right" />)
    const head = screen.getByTestId('snake-head')

    expect(head.style.width).toBe('30px')
    expect(head.style.height).toBe('30px')
  })

  test('applies custom cell size', () => {
    render(<Snake segments={segments} direction="right" cellSize={50} />)
    const head = screen.getByTestId('snake-head')

    expect(head.style.width).toBe('50px')
    expect(head.style.height).toBe('50px')
  })

  test.each<Direction>(['up', 'down', 'left', 'right'])(
    'renders head with direction %s',
    (direction) => {
      render(<Snake segments={segments} direction={direction} />)
      const head = screen.getByTestId('snake-head')

      expect(head).toHaveAttribute('data-direction', direction)
    },
  )

  test.each<[Direction, string]>([
    ['up', 'rotate(0deg)'],
    ['right', 'rotate(90deg)'],
    ['down', 'rotate(180deg)'],
    ['left', 'rotate(270deg)'],
  ])('rotates eyes for direction %s', (direction, expected) => {
    render(<Snake segments={segments} direction={direction} />)
    const eyes = screen.getByTestId('snake-eyes')

    expect(eyes.style.transform).toBe(expected)
  })

  test('renders nothing when segments are empty', () => {
    render(<Snake segments={[]} direction="right" />)

    expect(screen.queryByTestId('snake-head')).toBeNull()
    expect(screen.queryByTestId('snake-segment')).toBeNull()
    expect(screen.queryByTestId('snake-eyes')).toBeNull()
  })
})