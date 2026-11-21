import { fireEvent, render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders empty OKR dashboard initially', () => {
    render(<App />)

    expect(screen.getByText('Отслеживание целей OKR')).toBeInTheDocument()
    expect(
      screen.getByText('У вас пока нет добавленных целей. Создайте первую цель через форму слева.')
    ).toBeInTheDocument()
  })

  test('validates and adds goals, key results, updates progress and toggles urgent status', () => {
    render(<App />)

    const addKrBtn = screen.getByText('Добавить ключевой результат')

    fireEvent.click(addKrBtn)
    expect(screen.getByText('У вас пока нет целей. Сначала создайте цель.')).toBeInTheDocument()

    const createBtn = screen.getByText('Создать цель')

    fireEvent.click(createBtn)
    expect(
      screen.getByText('Название цели не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')
    ).toBeInTheDocument()

    const titleInput = screen.getByLabelText('Название цели')
    const deadlineInput = screen.getByLabelText('Срок выполнения (ДД.ММ.ГГГГ)')

    fireEvent.change(titleInput, { target: { value: 'Первая цель' } })
    fireEvent.change(deadlineInput, { target: { value: 'неверная дата' } })
    fireEvent.click(createBtn)

    expect(
      screen.getByText('Неверный формат даты или указана прошедшая дата! Введите дату в формате ДД.ММ.ГГГГ (например, 31.12.2026).')
    ).toBeInTheDocument()

    fireEvent.change(deadlineInput, { target: { value: '31.12.2028' } })
    fireEvent.click(createBtn)

    expect(screen.getByRole('heading', { name: '1. Первая цель' })).toBeInTheDocument()

    fireEvent.click(addKrBtn)
    expect(
      screen.getByText('Описание не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')
    ).toBeInTheDocument()

    const krTitleInput = screen.getByLabelText('Краткое описание ключевого результата')
    const krTargetInput = screen.getByLabelText('Целевое значение (больше 0)')

    fireEvent.change(krTitleInput, { target: { value: 'Сделать презентацию' } })
    fireEvent.change(krTargetInput, { target: { value: '0' } })
    fireEvent.click(addKrBtn)

    expect(screen.getByText('Целевое значение должно быть числом больше 0.')).toBeInTheDocument()

    fireEvent.change(krTargetInput, { target: { value: '5' } })
    fireEvent.click(addKrBtn)

    expect(screen.getByText('1. Сделать презентацию')).toBeInTheDocument()

    const slider = screen.getByLabelText('Ползунок прогресса для Сделать презентацию')

    fireEvent.change(slider, { target: { value: '3' } })
    expect(screen.getByText('выполнено 3 из 5 (60%)')).toBeInTheDocument()

    const toggleButton = screen.getByText('Сделать срочным')

    fireEvent.click(toggleButton)
    expect(screen.getByText('Срочное')).toBeInTheDocument()
  })

  test('loads persisted goals from localStorage and places completed goals below uncompleted ones', () => {
    localStorage.setItem(
      'okr_goals_storage',
      JSON.stringify([
        {
          id: 1,
          title: 'Завершенная цель',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR1', target: 5, current: 5 }],
        },
        {
          id: 2,
          title: 'Активная цель',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR2', target: 1000, current: 999 }],
        },
      ])
    )

    render(<App />)

    const headings = screen.getAllByRole('heading', { level: 3 })
    const goalHeadings = headings.filter((h) => /^\d+\./.test(h.textContent || ''))

    expect(goalHeadings[0]).toHaveTextContent('2. Активная цель')
    expect(goalHeadings[1]).toHaveTextContent('1. Завершенная цель')
    expect(screen.getByText('выполнено 999 из 1000 (99%)')).toBeInTheDocument()
  })
})
