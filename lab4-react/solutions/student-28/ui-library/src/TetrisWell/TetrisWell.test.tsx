import { render, screen, within } from '@testing-library/react'

import { TetrisWell } from './TetrisWell'

const SAMPLE_GRID: number[][] = [
  [0, 1, 0],
  [2, 2, 99],
]

describe('TetrisWell', () => {
  test('renders default 20x10 grid and column numbers 1..9, 0', () => {
    render(<TetrisWell grid={[]} />)

    expect(
      screen.getByRole('heading', { name: 'Стакан тетриса (10x20)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Занято клеток: 0')).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(200)

    const colBar = screen.getByLabelText('Номера столбцов')

    expect(within(colBar).getByLabelText('Столбец 1')).toHaveTextContent('1')
    expect(within(colBar).getByLabelText('Столбец 9')).toHaveTextContent('9')
    expect(within(colBar).getByLabelText('Столбец 10')).toHaveTextContent('0')
  })

  test('renders custom dimensions and applies colors from numbers', () => {
    render(
      <TetrisWell
        grid={SAMPLE_GRID}
        rows={2}
        cols={3}
        title="Игровое поле"
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Игровое поле (3x2)' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Занято клеток: 4')).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(6)

    expect(screen.getByRole('gridcell', { name: 'Ячейка 0,1' })).toHaveStyle({
      backgroundColor: '#00bcd4',
    })
    expect(screen.getByRole('gridcell', { name: 'Ячейка 1,0' })).toHaveStyle({
      backgroundColor: '#f1c40f',
    })
    expect(screen.getByRole('gridcell', { name: 'Ячейка 1,2' })).toHaveStyle({
      backgroundColor: '#7f8c8d',
    })
  })

  test('applies custom colorMap', () => {
    render(
      <TetrisWell
        grid={[[1]]}
        rows={1}
        cols={1}
        colorMap={{ 1: '#123456' }}
      />,
    )

    expect(screen.getByRole('gridcell', { name: 'Ячейка 0,0' })).toHaveStyle({
      backgroundColor: '#123456',
    })
  })
})