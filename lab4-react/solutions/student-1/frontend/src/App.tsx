import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { CategorySummary, ExpensesTable } from '@my-app/ui-library'

import type { Expense } from '@my-app/ui-library'

import './App.css'
import './Forms.css'
import '@my-app/ui-library/style.css'

type Profile = { name: string; monthlyBudget: number }
type ExpenseDraft = Omit<Expense, 'id'>
type Period = 'week' | 'month' | 'all'

const expenseKey = 'student-1-lab4-expenses'
const profileKey = 'student-1-lab4-profile'
const categories = ['Продукты', 'Транспорт', 'Кафе', 'Подписки', 'Дом', 'Здоровье', 'Другое', 'Разное']
const defaultProfile: Profile = { name: 'Александр', monthlyBudget: 30000 }

function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function daysAgo(days: number): string {
  const date = new Date()

  date.setDate(date.getDate() - days)

  return localDate(date)
}

const initialExpenses: Expense[] = [
  { id: 'e1', date: daysAgo(1), category: 'Продукты', amount: 2450, comment: 'Закупка на неделю' },
  { id: 'e2', date: daysAgo(2), category: 'Транспорт', amount: 680, comment: 'Проездной' },
  { id: 'e3', date: daysAgo(4), category: 'Кафе', amount: 1250, comment: 'Обед с друзьями' },
  { id: 'e4', date: daysAgo(7), category: 'Продукты', amount: 1830, comment: 'Магазин у дома' },
  { id: 'e5', date: daysAgo(10), category: 'Подписки', amount: 499, comment: 'Музыка' },
  { id: 'e6', date: daysAgo(13), category: 'Транспорт', amount: 320, comment: 'Такси' },
  { id: 'e7', date: daysAgo(17), category: 'Дом', amount: 3200, comment: 'Лампочки и мелочи' },
]

function loadExpenses(): Expense[] {
  try {
    const saved = localStorage.getItem(expenseKey)

    if (!saved) return initialExpenses
    const parsed: unknown = JSON.parse(saved)

    if (Array.isArray(parsed) && parsed.every((item) => typeof item.id === 'string' && typeof item.date === 'string' && typeof item.category === 'string' && typeof item.amount === 'number' && Number.isFinite(item.amount) && typeof item.comment === 'string')) return parsed as Expense[]
  } catch { /* Invalid browser data falls back to examples. */ }

  return initialExpenses
}

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem(profileKey)

    if (saved) {
      const parsed: unknown = JSON.parse(saved)

      if (parsed && typeof parsed === 'object' && 'name' in parsed && 'monthlyBudget' in parsed && typeof parsed.name === 'string' && typeof parsed.monthlyBudget === 'number' && Number.isFinite(parsed.monthlyBudget)) return { name: parsed.name, monthlyBudget: parsed.monthlyBudget }
    }
  } catch { /* Invalid browser data falls back to defaults. */ }

  return defaultProfile
}

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(loadExpenses)
  const [profile, setProfile] = useState<Profile>(loadProfile)
  const [period, setPeriod] = useState<Period>('month')
  const [editing, setEditing] = useState<Expense | null>(null)
  const [expenseDraft, setExpenseDraft] = useState<ExpenseDraft | null>(null)
  const [profileDraft, setProfileDraft] = useState<Profile | null>(null)
  const [deleting, setDeleting] = useState<Expense | null>(null)

  useEffect(() => { localStorage.setItem(expenseKey, JSON.stringify(expenses)) }, [expenses])
  useEffect(() => { localStorage.setItem(profileKey, JSON.stringify(profile)) }, [profile])

  const now = new Date()
  const today = localDate(now)
  const month = today.slice(0, 7)
  const monthLabel = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(now)
  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(month))
  const periodStart = period === 'week' ? daysAgo(6) : period === 'month' ? `${month}-01` : undefined
  const periodEnd = period === 'all' ? undefined : today
  const periodExpenses = expenses.filter((expense) => (!periodStart || expense.date >= periodStart) && (!periodEnd || expense.date <= periodEnd))
  const periodTotal = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthTotal = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = Object.values(monthExpenses.reduce<Record<string, { category: string; amount: number }>>((totals, expense) => {
    const current = totals[expense.category] ?? { category: expense.category, amount: 0 }

    totals[expense.category] = { ...current, amount: current.amount + expense.amount }

    return totals
  }, {})).sort((left, right) => right.amount - left.amount)

  const openAdd = () => {
    setEditing(null)
    setExpenseDraft({ date: today, category: categories[0], amount: 0, comment: '' })
  }
  const openEdit = (expense: Expense) => {
    setEditing(expense)
    setExpenseDraft({ date: expense.date, category: expense.category, amount: expense.amount, comment: expense.comment })
  }
  const saveExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!expenseDraft || !expenseDraft.date || !expenseDraft.category || !Number.isFinite(expenseDraft.amount) || expenseDraft.amount <= 0) return
    if (editing) setExpenses((items) => items.map((item) => item.id === editing.id ? { ...expenseDraft, id: item.id } : item))
    else setExpenses((items) => [{ ...expenseDraft, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}` }, ...items])
    setExpenseDraft(null)
    setEditing(null)
  }
  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!profileDraft || !profileDraft.name.trim() || !Number.isFinite(profileDraft.monthlyBudget) || profileDraft.monthlyBudget < 0) return
    setProfile({ name: profileDraft.name.trim(), monthlyBudget: profileDraft.monthlyBudget })
    setProfileDraft(null)
  }
  const deleteExpense = () => {
    if (!deleting) return
    setExpenses((items) => items.filter((item) => item.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="#overview"><span className="brand__mark">₽</span><span>Кошелёк<small>личные финансы</small></span></a>
        <p className="sidebar__label">РАБОЧЕЕ ПРОСТРАНСТВО</p>
        <a className="sidebar__link sidebar__link--active" href="#overview"><span>▦</span> Обзор</a>
        <button className="sidebar__bottom" type="button" onClick={() => setProfileDraft({ ...profile })} aria-label="Настроить профиль"><span className="avatar">{profile.name[0]?.toUpperCase()}</span><span>{profile.name}<small>Настроить профиль</small></span><span className="sidebar__dots">···</span></button>
      </aside>
      <main className="main-content" id="overview">
        <header className="topbar"><span>Мои финансы <span className="breadcrumb">/ Обзор</span></span><button className="topbar__profile" type="button" onClick={() => setProfileDraft({ ...profile })}>⚙ Настроить профиль</button><span className="topbar__date">● &nbsp; {monthLabel}</span></header>
        <div className="page-heading"><div><p className="eyebrow">ВАШИ ЛИЧНЫЕ ФИНАНСЫ</p><h1>Добрый день, {profile.name} <span>✦</span></h1><p>Вот как выглядят ваши расходы за этот месяц.</p></div><button className="add-button" type="button" onClick={openAdd}>＋ Добавить расход</button></div>
        <section className="stat-grid" aria-label="Статистика расходов">
          <article className="stat-card"><div className="stat-card__top"><span>Расходы за период</span><span className="stat-icon stat-icon--blue">↘</span></div><strong>{periodTotal.toLocaleString('ru-RU')} ₽</strong><small className="stat-note">Выбранный период</small><span className="stat-chart stat-chart--blue">▁▂▁▄▃▅▄▆</span></article>
          <article className="stat-card"><div className="stat-card__top"><span>Операций</span><span className="stat-icon stat-icon--violet">⌁</span></div><strong>{monthExpenses.length}</strong><small className="stat-note">За текущий месяц</small><span className="stat-chart stat-chart--violet">▂▁▃▂▅▃▆▅</span></article>
          <article className="stat-card"><div className="stat-card__top"><span>Бюджет на месяц</span><span className="stat-icon stat-icon--green">◷</span></div><strong>{profile.monthlyBudget.toLocaleString('ru-RU')} ₽</strong><small className="stat-note">Осталось {(profile.monthlyBudget - monthTotal).toLocaleString('ru-RU')} ₽</small><span className="stat-chart stat-chart--green">▁▃▂▄▂▅▃▆</span></article>
        </section>
        <div className="content-grid">
          <section className="panel transactions" id="expenses"><div className="panel__heading"><div><h2>Последние расходы</h2><p>Ваши операции за выбранный период</p></div><div className="period-tabs" aria-label="Период расходов">{(['week', 'month', 'all'] as const).map((item) => <button className={period === item ? 'period-tabs__active' : ''} key={item} onClick={() => setPeriod(item)} type="button">{{ week: 'Неделя', month: 'Месяц', all: 'Всё время' }[item]}</button>)}</div></div><ExpensesTable expenses={expenses} startDate={periodStart} endDate={periodEnd} onEdit={openEdit} onDelete={setDeleting} /></section>
          <aside className="panel summary-panel"><CategorySummary items={categoryTotals} month={month} /></aside>
        </div>
        <footer className="footer">Кошелёк · личные финансы <span>Изменения сохраняются в этом браузере</span></footer>
      </main>

      {expenseDraft && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="expense-dialog-title"><div className="modal__heading"><h2 id="expense-dialog-title">{editing ? 'Изменить расход' : 'Добавить расход'}</h2><button className="modal__close" type="button" onClick={() => setExpenseDraft(null)} aria-label="Закрыть">×</button></div><form onSubmit={saveExpense} className="modal__form"><label>Дата<input type="date" required value={expenseDraft.date} onChange={(event) => setExpenseDraft({ ...expenseDraft, date: event.target.value })} /></label><label>Категория<select value={expenseDraft.category} onChange={(event) => setExpenseDraft({ ...expenseDraft, category: event.target.value })}>{[...new Set([...categories, ...expenses.map((item) => item.category)])].map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>Сумма, ₽<input type="number" min="0.01" step="0.01" required value={expenseDraft.amount || ''} onChange={(event) => setExpenseDraft({ ...expenseDraft, amount: Number(event.target.value) })} /></label><label>Комментарий<input type="text" maxLength={120} value={expenseDraft.comment} onChange={(event) => setExpenseDraft({ ...expenseDraft, comment: event.target.value })} placeholder="Например, продукты на неделю" /></label><div className="modal__actions"><button className="button-secondary" type="button" onClick={() => setExpenseDraft(null)}>Отмена</button><button className="add-button" type="submit">Сохранить расход</button></div></form></div></div>}
      {profileDraft && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title"><div className="modal__heading"><h2 id="profile-dialog-title">Настроить профиль</h2><button className="modal__close" type="button" onClick={() => setProfileDraft(null)} aria-label="Закрыть">×</button></div><form onSubmit={saveProfile} className="modal__form"><label>Имя<input type="text" required maxLength={40} value={profileDraft.name} onChange={(event) => setProfileDraft({ ...profileDraft, name: event.target.value })} /></label><label>Бюджет на месяц, ₽<input type="number" min="0" step="0.01" required value={profileDraft.monthlyBudget} onChange={(event) => setProfileDraft({ ...profileDraft, monthlyBudget: Number(event.target.value) })} /></label><p className="modal__hint">Настройки сохраняются только в этом браузере.</p><div className="modal__actions"><button className="button-secondary" type="button" onClick={() => setProfileDraft(null)}>Отмена</button><button className="add-button" type="submit">Сохранить профиль</button></div></form></div></div>}
      {deleting && <div className="modal-backdrop" role="presentation"><div className="modal modal--small" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title"><div className="modal__heading"><h2 id="delete-dialog-title">Удалить расход?</h2></div><p>«{deleting.comment || deleting.category}» — {deleting.amount.toLocaleString('ru-RU')} ₽. Это действие нельзя отменить.</p><div className="modal__actions"><button className="button-secondary" type="button" onClick={() => setDeleting(null)}>Отмена</button><button className="button-danger" type="button" onClick={deleteExpense}>Удалить</button></div></div></div>}
    </div>
  )
}

export default App
