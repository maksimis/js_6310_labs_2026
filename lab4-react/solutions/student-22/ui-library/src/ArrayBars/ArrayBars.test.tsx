import { render, screen } from '@testing-library/react'

import { ArrayBars } from './ArrayBars'

describe('ArrayBars', () => {
  test('renders a bar for every value', () => {
    render(<ArrayBars values={[3, 1, 2]} />)

    const bars = screen.getAllByTestId('bar')

    expect(bars).toHaveLength(3)
    expect(bars[0]).toHaveTextContent('3')
  })

  test('bar height depends on value', () => {
    render(<ArrayBars values={[4, 2]} />)

    const bars = screen.getAllByTestId('bar')

    expect(bars[0]).toHaveStyle({ height: '100%' })
    expect(bars[1]).toHaveStyle({ height: '50%' })
  })

  test('highlights compared and sorted bars', () => {
    render(<ArrayBars values={[1, 2, 3]} comparing={[0]} sorted={[0, 2]} />)

    const bars = screen.getAllByTestId('bar')

    expect(bars[0]).toHaveClass('comparing')
    expect(bars[0]).not.toHaveClass('sorted')
    expect(bars[1]).not.toHaveClass('comparing')
    expect(bars[1]).not.toHaveClass('sorted')
    expect(bars[2]).toHaveClass('sorted')
  })

  test('handles array of zeros', () => {
    render(<ArrayBars values={[0, 0]} />)

    expect(screen.getAllByTestId('bar')[0]).toHaveStyle({ height: '0%' })
  })

  test('shows message for empty array', () => {
    render(<ArrayBars values={[]} />)

    expect(screen.getByText('Массив пуст')).toBeInTheDocument()
  })
})
