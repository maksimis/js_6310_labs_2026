import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

const getColumn = (title: string): HTMLElement =>
  screen.getByRole('region', { name: `Колонка ${title}` })

const getTaskCard = (title: string): HTMLElement => {
  const card = screen.getByText(title).closest('article')

  if (!(card instanceof HTMLElement)) {
    throw new Error(`Task card "${title}" not found`)
  }

  return card
}

describe('App', () => {
  test('renders board columns, tasks and total count', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Kanbex' })).toBeInTheDocument()
    expect(screen.getByText('Всего задач: 5')).toBeInTheDocument()
    expect(within(getColumn('TO DO')).getAllByRole('article')).toHaveLength(2)
    expect(within(getColumn('В работе')).getAllByRole('article')).toHaveLength(2)
    expect(within(getColumn('Готово')).getAllByRole('article')).toHaveLength(1)
  })

  test('adds a task with selected fields and clears the title', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Название'), '  Подготовить демо  ')
    await user.selectOptions(screen.getByLabelText('Приоритет'), 'high')
    await user.selectOptions(screen.getByLabelText('Исполнитель'), 'user-maria')
    await user.selectOptions(screen.getByLabelText('Колонка'), 'in-progress')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    const card = getTaskCard('Подготовить демо')

    expect(
      within(getColumn('В работе')).getByText('Подготовить демо'),
    ).toBeInTheDocument()
    expect(within(card).getByText('Высокий')).toBeInTheDocument()
    expect(within(card).getByText('Алексей Шуганин')).toBeInTheDocument()
    expect(screen.getByText('Всего задач: 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Название')).toHaveValue('')
  })

  test('adds selected tags from mock data and resets the picker', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(screen.getByLabelText('Название'), 'Задача с тегами')
    await user.click(screen.getByLabelText('frontend'))
    await user.click(screen.getByLabelText('react'))
    await user.click(screen.getByLabelText('database'))
    await user.click(screen.getByLabelText('database'))
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    const card = getTaskCard('Задача с тегами')

    expect(within(card).getByText('frontend')).toBeInTheDocument()
    expect(within(card).getByText('react')).toBeInTheDocument()
    expect(within(card).queryByText('database')).not.toBeInTheDocument()
    expect(screen.getByLabelText('frontend')).not.toBeChecked()
    expect(screen.getByLabelText('react')).not.toBeChecked()
    expect(screen.getByLabelText('database')).not.toBeChecked()
  })

  test('does not add a task with a blank title', () => {
    render(<App />)

    const titleInput = screen.getByLabelText('Название')
    const addButton = screen.getByRole('button', { name: 'Добавить' })
    const form = addButton.closest('form')

    fireEvent.change(titleInput, { target: { value: '   ' } })

    expect(addButton).toBeDisabled()
    expect(form).not.toBeNull()

    fireEvent.submit(form as HTMLFormElement)

    expect(screen.getByText('Всего задач: 5')).toBeInTheDocument()
  })

  test('moves a task to the next column with the arrow button', () => {
    render(<App />)

    fireEvent.click(
      within(getTaskCard('Спроектировать ER-диаграмму')).getByRole('button', {
        name: 'Переместить в следующую колонку',
      }),
    )

    expect(
      within(getColumn('В работе')).getByText('Спроектировать ER-диаграмму'),
    ).toBeInTheDocument()
    expect(
      within(getColumn('TO DO')).queryByText('Спроектировать ER-диаграмму'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Всего задач: 5')).toBeInTheDocument()
  })

  test('does not move tasks outside the board', () => {
    render(<App />)

    fireEvent.click(
      within(getTaskCard('Спроектировать ER-диаграмму')).getByRole('button', {
        name: 'Переместить в предыдущую колонку',
      }),
    )
    fireEvent.click(
      within(getTaskCard('Создать репозиторий и ветки')).getByRole('button', {
        name: 'Переместить в следующую колонку',
      }),
    )

    expect(
      within(getColumn('TO DO')).getByText('Спроектировать ER-диаграмму'),
    ).toBeInTheDocument()
    expect(
      within(getColumn('Готово')).getByText('Создать репозиторий и ветки'),
    ).toBeInTheDocument()
  })

  test('moves a task to the previous column with the arrow button', () => {
    render(<App />)

    fireEvent.click(
      within(getTaskCard('Создать репозиторий и ветки')).getByRole('button', {
        name: 'Переместить в предыдущую колонку',
      }),
    )

    expect(
      within(getColumn('В работе')).getByText('Создать репозиторий и ветки'),
    ).toBeInTheDocument()
    expect(
      within(getColumn('Готово')).queryByText('Создать репозиторий и ветки'),
    ).not.toBeInTheDocument()
  })

  test('moves a task between columns with drag and drop', () => {
    render(<App />)

    const data = new Map<string, string>()
    const dataTransfer = {
      setData: jest.fn((format: string, value: string) => {
        data.set(format, value)
      }),
      getData: jest.fn((format: string) => data.get(format) ?? ''),
    }
    const card = getTaskCard('Спроектировать ER-диаграмму')

    fireEvent.dragStart(card, { dataTransfer })
    fireEvent.drop(getColumn('Готово'), { dataTransfer })

    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'task-1')
    expect(
      within(getColumn('Готово')).getByText('Спроектировать ER-диаграмму'),
    ).toBeInTheDocument()
    expect(
      within(getColumn('TO DO')).queryByText('Спроектировать ER-диаграмму'),
    ).not.toBeInTheDocument()
  })

  test('ignores dropped task ids that are not on the board', () => {
    render(<App />)

    fireEvent.drop(getColumn('TO DO'), {
      dataTransfer: {
        getData: () => 'missing-task',
      },
    })

    expect(screen.getByText('Всего задач: 5')).toBeInTheDocument()
    expect(
      within(getColumn('TO DO')).getByText('Спроектировать ER-диаграмму'),
    ).toBeInTheDocument()
  })
})
