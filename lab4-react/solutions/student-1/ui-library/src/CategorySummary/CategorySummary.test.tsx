import { render, screen } from '@testing-library/react'

import { CategorySummary } from './CategorySummary'

describe('CategorySummary', () => {
  test('renders amounts, shares and progress values', () => {
    render(<CategorySummary month="2026-10" items={[{ category: 'Еда', amount: 7500 }, { category: 'Транспорт', amount: 2500 }]} />)
    expect(screen.getByText('Расходы по категориям')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('10 000 ₽')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Доля категории Еда' })).toHaveAttribute('aria-valuenow', '75')
  })

  test('renders an empty state and zero total', () => {
    render(<CategorySummary month="2026-10" items={[]} />)
    expect(screen.getByText('За этот месяц расходов пока нет')).toBeInTheDocument()
    expect(screen.getByText('0 ₽')).toBeInTheDocument()
  })

  test('shows a zero share when categories have no expenses', () => {
    render(<CategorySummary month="2026-10" items={[{ category: 'Разное', amount: 0 }]} />)
    expect(screen.getByText('Разное')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Доля категории Разное' })).toHaveAttribute('aria-valuenow', '0')
  })
})
