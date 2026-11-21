import { useMemo, useState } from 'react'

import './ExpensesTable.css'
import './ExpenseActions.css'

export interface Expense {
  id: string
  date: string
  category: string
  amount: number
  comment: string
}

export interface ExpensesTableProps {
  expenses: Expense[]
  startDate?: string
  endDate?: string
  currency?: string
  onEdit?: (expense: Expense) => void
  onDelete?: (expense: Expense) => void
}

type SortField = 'date' | 'amount'
type SortDirection = 'asc' | 'desc'

export const ExpensesTable = ({ expenses, startDate, endDate, currency = '₽', onEdit, onDelete }: ExpensesTableProps) => {
  const [category, setCategory] = useState('all')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const categories = useMemo(() => [...new Set(expenses.map((expense) => expense.category))].sort(), [expenses])
  const visibleExpenses = useMemo(() => expenses
    .filter((expense) => category === 'all' || expense.category === category)
    .filter((expense) => !startDate || expense.date >= startDate)
    .filter((expense) => !endDate || expense.date <= endDate)
    .sort((left, right) => {
      const comparison = sortField === 'amount'
        ? left.amount - right.amount
        : left.date.localeCompare(right.date)

      return sortDirection === 'asc' ? comparison : -comparison
    }), [category, endDate, expenses, sortDirection, sortField, startDate])
  const total = visibleExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const toggleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')

      return
    }
    setSortField(field)
    setSortDirection('asc')
  }

  return (
    <section className="expenses-table" aria-label="Таблица расходов">
      <div className="expenses-table__toolbar">
        <label htmlFor="expense-category">Категория</label>
        <select id="expense-category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">Все категории</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <span className="expenses-table__period">
          Период: {startDate || 'начало'} — {endDate || 'сегодня'}
        </span>
      </div>
      <div className="expenses-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col"><button type="button" onClick={() => toggleSort('date')}>Дата{sortField === 'date' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}</button></th>
              <th scope="col">Категория</th>
              <th scope="col"><button type="button" onClick={() => toggleSort('amount')}>Сумма{sortField === 'amount' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ''}</button></th>
              <th scope="col">Комментарий</th>
              {(onEdit || onDelete) && <th scope="col">Действия</th>}
            </tr>
          </thead>
          <tbody>
            {visibleExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(`${expense.date}T00:00:00`).toLocaleDateString('ru-RU')}</td>
                <td><span className="expenses-table__category">{expense.category}</span></td>
                <td className="expenses-table__amount">{expense.amount.toLocaleString('ru-RU')} {currency}</td>
                <td>{expense.comment || '—'}</td>
                {(onEdit || onDelete) && (
                  <td className="expenses-table__actions">
                    {onEdit && <button type="button" onClick={() => onEdit(expense)} aria-label={`Изменить расход: ${expense.comment || expense.category}`}>Изменить</button>}
                    {onDelete && <button type="button" onClick={() => onDelete(expense)} aria-label={`Удалить расход: ${expense.comment || expense.category}`}>Удалить</button>}
                  </td>
                )}
              </tr>
            ))}
            {visibleExpenses.length === 0 && <tr><td colSpan={onEdit || onDelete ? 5 : 4} className="expenses-table__empty">Расходов за этот период нет</td></tr>}
          </tbody>
          <tfoot>
            <tr><th scope="row" colSpan={2}>Итого</th><td className="expenses-table__amount">{total.toLocaleString('ru-RU')} {currency}</td><td>{visibleExpenses.length} операций</td>{(onEdit || onDelete) && <td />}</tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
