import { fireEvent, render, screen, within } from '@testing-library/react'

import App from './App'

describe('Expense dashboard', () => {
  beforeEach(() => localStorage.clear())

  test('shows the dashboard, expense table, and category summary', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /Добрый день, Александр/ })).toBeInTheDocument()
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Расходы по категориям')).toBeInTheDocument()
  })

  test('changes the selected period', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Всё время' }))
    expect(screen.getByRole('button', { name: 'Всё время' })).toHaveClass('period-tabs__active')
  })

  test('adds, edits, deletes, and keeps expenses after remounting', () => {
    const view = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Добавить расход/ }))
    fireEvent.change(screen.getByLabelText('Сумма, ₽'), { target: { value: '750' } })
    fireEvent.change(screen.getByLabelText('Комментарий'), { target: { value: 'Новый расход' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить расход' }))
    expect(screen.getByText('Новый расход')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Изменить расход: Новый расход' }))
    fireEvent.change(screen.getByLabelText('Сумма, ₽'), { target: { value: '900' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить расход' }))
    expect(screen.getByText('900 ₽')).toBeInTheDocument()

    view.unmount()
    render(<App />)
    expect(screen.getByText('Новый расход')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Удалить расход: Новый расход' }))
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Удалить' }))
    expect(screen.queryByText('Новый расход')).not.toBeInTheDocument()
  })

  test('changes and saves profile settings', () => {
    const view = render(<App />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Настроить профиль' })[0])
    fireEvent.change(screen.getByLabelText('Имя'), { target: { value: 'Мария' } })
    fireEvent.change(screen.getByLabelText('Бюджет на месяц, ₽'), { target: { value: '50000' } })
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить профиль' }))
    expect(screen.getByRole('heading', { name: /Добрый день, Мария/ })).toBeInTheDocument()
    expect(screen.getByText('50 000 ₽')).toBeInTheDocument()

    view.unmount()
    render(<App />)
    expect(screen.getByRole('heading', { name: /Добрый день, Мария/ })).toBeInTheDocument()
  })
})
