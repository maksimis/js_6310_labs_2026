import { describe, expect, jest, test } from '@jest/globals'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { TaskList } from '../src/components/TaskList'

import type { Task } from '../src/types'

const sampleTasks: Task[] = [
  { id: 'late', title: 'Позвонить врачу', time: '14:30', repeat: 'weekly', completed: false },
  { id: 'early', title: 'Зарядка', time: '07:15', repeat: 'daily', completed: true },
  { id: 'middle', title: 'Обед', time: '12:00', repeat: 'none', completed: false },
  { id: 'same-hour', title: 'Проверить почту', time: '07:45', repeat: 'none', completed: false },
]

describe('TaskList', () => {
  test('показывает задачи и время в хронологическом порядке, не изменяя входной массив', () => {
    const original = [...sampleTasks]
    const { container } = render(<TaskList tasks={sampleTasks} onTaskCompleteChange={jest.fn()} />)

    expect(screen.getByText('Зарядка')).toBeInTheDocument()
    expect(screen.getByText('07:15')).toBeInTheDocument()
    const titles = Array.from(container.querySelectorAll('.task-card__title')).map((node) => node.textContent)

    expect(titles).toEqual(['Зарядка', 'Проверить почту', 'Обед', 'Позвонить врачу'])
    expect(sampleTasks).toEqual(original)
  })

  test('группирует задачи по часам в хронологическом порядке', () => {
    render(<TaskList tasks={sampleTasks} onTaskCompleteChange={jest.fn()} />)
    const groups = screen.getAllByRole('region').filter((node) => node.classList.contains('time-group'))

    expect(groups.map((group) => group.getAttribute('aria-label'))).toEqual([
      'Задачи на 07:00', 'Задачи на 12:00', 'Задачи на 14:00',
    ])
    expect(within(groups[0]).getByText('Зарядка')).toBeInTheDocument()
    expect(within(groups[0]).getByText('Проверить почту')).toBeInTheDocument()
  })

  test('отображает подпись повтора и визуальное состояние выполненной задачи', () => {
    const { container } = render(<TaskList tasks={sampleTasks} onTaskCompleteChange={jest.fn()} />)

    expect(screen.getByText('Каждый день')).toBeInTheDocument()
    expect(screen.getByText('Раз в неделю')).toBeInTheDocument()
    expect(container.querySelector('.task-card--completed .task-card__title')).toHaveTextContent('Зарядка')
  })

  test('передаёт идентификатор и новое значение при переключении чекбокса', () => {
    const onTaskCompleteChange = jest.fn()

    render(<TaskList tasks={sampleTasks} onTaskCompleteChange={onTaskCompleteChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Отметить задачу «Позвонить врачу» как выполненную' }))
    expect(onTaskCompleteChange).toHaveBeenCalledWith('late', true)
  })

  test('показывает понятное пустое состояние', () => {
    render(<TaskList tasks={[]} onTaskCompleteChange={jest.fn()} />)
    expect(screen.getByText('Пока нет задач')).toBeInTheDocument()
    expect(screen.getByText('Добавьте первую задачу с помощью формы выше.')).toBeInTheDocument()
  })
})
