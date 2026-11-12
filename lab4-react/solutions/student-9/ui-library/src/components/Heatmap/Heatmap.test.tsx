import { render, screen } from '@testing-library/react'

import { Heatmap } from './Heatmap'

import type { HeatmapDay } from './Heatmap'

describe('Heatmap', () => {
  const sampleData: HeatmapDay[] = [
    { date: '2026-10-01', completed: true },
    { date: '2026-10-02', completed: false },
    { date: '2026-10-03', completed: true },
    { date: '2026-10-04', completed: true },
    { date: '2026-10-05', completed: false },
  ]

  test('renders heatmap container', () => {
    render(<Heatmap data={sampleData} />)
    expect(screen.getByTestId('heatmap')).toBeInTheDocument()
  })

  test('renders cells for provided dates', () => {
    render(<Heatmap data={sampleData} startDate="2026-10-01" endDate="2026-10-05" />)
    expect(screen.getByTestId('heatmap-cell-2026-10-01')).toBeInTheDocument()
    expect(screen.getByTestId('heatmap-cell-2026-10-02')).toBeInTheDocument()
    expect(screen.getByTestId('heatmap-cell-2026-10-03')).toBeInTheDocument()
  })

  test('marks completed days with data-completed=true', () => {
    render(<Heatmap data={sampleData} startDate="2026-10-01" endDate="2026-10-05" />)
    expect(screen.getByTestId('heatmap-cell-2026-10-01')).toHaveAttribute(
      'data-completed',
      'true'
    )
    expect(screen.getByTestId('heatmap-cell-2026-10-02')).toHaveAttribute(
      'data-completed',
      'false'
    )
  })

  test('renders empty state without crashing', () => {
    render(<Heatmap data={[]} />)
    expect(screen.getByTestId('heatmap')).toBeInTheDocument()
  })

  test('uses startDate and endDate when provided', () => {
    render(
      <Heatmap
        data={sampleData}
        startDate="2026-10-01"
        endDate="2026-10-03"
      />
    )
    expect(screen.getByTestId('heatmap-cell-2026-10-01')).toBeInTheDocument()
    expect(screen.getByTestId('heatmap-cell-2026-10-03')).toBeInTheDocument()
    expect(screen.queryByTestId('heatmap-cell-2026-10-05')).not.toBeInTheDocument()
  })

  test('applies custom className', () => {
    render(<Heatmap data={sampleData} className="my-heatmap" />)
    expect(screen.getByTestId('heatmap')).toHaveClass('my-heatmap')
  })

  test('has accessible grid role', () => {
    render(<Heatmap data={sampleData} />)
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  test('renders legend', () => {
    render(<Heatmap data={sampleData} />)
    expect(screen.getByText('Меньше')).toBeInTheDocument()
    expect(screen.getByText('Больше')).toBeInTheDocument()
  })
})
