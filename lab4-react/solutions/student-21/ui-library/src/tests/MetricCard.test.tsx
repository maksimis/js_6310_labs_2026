import { render, screen } from '@testing-library/react'

import { MetricCard } from '../MetricCard/MetricCard'

describe('MetricCard', () => {
  test('отображает название и значение метрики', () => {
    render(<MetricCard title="Посетители" value={1230} change={12} />)

    expect(screen.getByText('Посетители')).toBeInTheDocument()
    expect(screen.getByText('1230')).toBeInTheDocument()
  })

  test('показывает зелёный цвет при росте', () => {
    render(<MetricCard title="Цена" value={414} change={12.75} />)

    const change = screen.getByText(/12\.75%/)

    expect(change).toHaveClass('metriccard__change--positive')
    expect(change).toHaveTextContent('↑')
  })

  test('показывает красный цвет при падении', () => {
    render(<MetricCard title="Спрос" value={56} change={-16.5} />)

    const change = screen.getByText(/16\.5%/)

    expect(change).toHaveClass('metriccard__change--negative')
    expect(change).toHaveTextContent('↓')
  })

  test('показывает серый цвет при отсутствии изменений', () => {
    render(<MetricCard title="Посетители" value={1230} change={0} />)

    const change = screen.getByText('0%')

    expect(change).toHaveClass('metriccard__change--neutral')
    expect(change).not.toHaveTextContent('↑')
    expect(change).not.toHaveTextContent('↓')
  })
})