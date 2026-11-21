import { fireEvent, render, screen, within } from '@testing-library/react'

import { ExpensesTable } from './ExpensesTable'

import type { Expense } from './ExpensesTable'

const expenses: Expense[] = [
  { id: '1', date: '2026-10-05', category: 'Еда', amount: 1200, comment: 'Покупки' },
  { id: '2', date: '2026-10-12', category: 'Транспорт', amount: 450, comment: 'Метро' },
  { id: '3', date: '2026-09-30', category: 'Еда', amount: 800, comment: '' },
]

describe('ExpensesTable', () => {
  test('renders expense fields and period total', () => {
    render(<ExpensesTable expenses={expenses} startDate="2026-10-01" endDate="2026-10-31" />)
    expect(screen.getByText('Покупки')).toBeInTheDocument()
    expect(screen.getByText('1 650 ₽')).toBeInTheDocument()
    expect(screen.queryByText('800 ₽')).not.toBeInTheDocument()
  })

  test('filters by category', () => {
    render(<ExpensesTable expenses={expenses} />)
    fireEvent.change(screen.getByLabelText('Категория'), { target: { value: 'Транспорт' } })
    expect(screen.getByText('Метро')).toBeInTheDocument()
    expect(screen.queryByText('Покупки')).not.toBeInTheDocument()
    expect(screen.getAllByText('450 ₽')).toHaveLength(2)
  })

  test('sorts by amount and date', () => {
    render(<ExpensesTable expenses={expenses} />)
    const rows = screen.getAllByRole('row')

    fireEvent.click(screen.getByRole('button', { name: /Сумма/ }))
    expect(within(screen.getAllByRole('row')[1]).getByText('450 ₽')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Дата/ }))
    expect(within(screen.getAllByRole('row')[1]).getByText('30.09.2026')).toBeInTheDocument()
    expect(rows.length).toBeGreaterThan(0)
  })

  test('shows an empty state for a period without expenses', () => {
    render(<ExpensesTable expenses={[]} />)
    expect(screen.getByText('Расходов за этот период нет')).toBeInTheDocument()
    expect(screen.getByText('0 ₽')).toBeInTheDocument()
  })
})
