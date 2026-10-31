import { render, screen } from '@testing-library/react'

import { NextTetromino } from './NextTetromino'

import type { Tetromino } from '../types'

const SAMPLE_TETROMINO: Tetromino = {
  id: 'tetromino-t',
  name: 'T-фигура',
  type: 'T',
  defaultColor: '#9b59b6',
  colorCode: 3,
  coords: [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
  ],
}

describe('NextTetromino', () => {
  test('renders title, figure name, defaultColor, coords and 4x4 grid', () => {
    render(<NextTetromino tetromino={SAMPLE_TETROMINO} />)

    expect(
      screen.getByRole('heading', { name: 'Следующее тетрамино' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Фигура: T-фигура (T)')).toBeInTheDocument()
    expect(screen.getByText('Цвет по умолчанию: #9b59b6')).toBeInTheDocument()
    expect(
      screen.getByText('Координаты: (1,0), (1,1), (1,2), (2,1)'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(16)
  })

  test('colors filled cells using defaultColor', () => {
    render(<NextTetromino tetromino={SAMPLE_TETROMINO} />)

    const filledCell = screen.getByRole('gridcell', { name: 'Ячейка 1,1' })
    const emptyCell = screen.getByRole('gridcell', { name: 'Ячейка 0,0' })

    expect(filledCell).toHaveAttribute('data-filled', 'true')
    expect(filledCell).toHaveStyle({ backgroundColor: '#9b59b6' })
    expect(emptyCell).toHaveAttribute('data-filled', 'false')
  })

  test('supports custom title, customColor and gridSize', () => {
    render(
      <NextTetromino
        tetromino={{ ...SAMPLE_TETROMINO, gridSize: 3 }}
        title="Следующая"
        customColor="#e74c3c"
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Следующая' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(9)
    expect(screen.getByRole('gridcell', { name: 'Ячейка 1,1' })).toHaveStyle({
      backgroundColor: '#e74c3c',
    })
  })
})