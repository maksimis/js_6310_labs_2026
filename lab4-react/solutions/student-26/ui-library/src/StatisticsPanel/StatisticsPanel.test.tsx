import { render, screen } from '@testing-library/react'

import { StatisticsPanel } from './StatisticsPanel'

describe('StatisticsPanel', () => {
  test('renders all statistics', () => {
    render(
      <StatisticsPanel
        speed={120}
        errors={3}
        accuracy={97.5}
        time={65}
      />,
    )

    expect(screen.getByText('Скорость')).toBeInTheDocument()
    expect(screen.getByText('120 зн./мин')).toBeInTheDocument()
    expect(screen.getByText('Ошибки')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('Точность')).toBeInTheDocument()
    expect(screen.getByText('97.5%')).toBeInTheDocument()
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  test('formats time below one minute', () => {
    render(
      <StatisticsPanel
        speed={0}
        errors={0}
        accuracy={100}
        time={9}
      />,
    )

    expect(screen.getByText('00:09')).toBeInTheDocument()
  })

  test('formats time above one hour', () => {
    render(
      <StatisticsPanel
        speed={80}
        errors={2}
        accuracy={98}
        time={3600}
      />,
    )

    expect(screen.getByText('60:00')).toBeInTheDocument()
  })

  test('formats accuracy to one decimal place', () => {
    render(
      <StatisticsPanel
        speed={50}
        errors={1}
        accuracy={99.99}
        time={30}
      />,
    )

    expect(screen.getByText('100.0%')).toBeInTheDocument()
  })

  test('renders zero values', () => {
    render(
      <StatisticsPanel
        speed={0}
        errors={0}
        accuracy={0}
        time={0}
      />,
    )

    expect(screen.getByText('0 зн./мин')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })
})