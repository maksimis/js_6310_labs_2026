import { fireEvent, render, screen } from '@testing-library/react'

import { TaskCard } from './TaskCard'

import type { Task } from '../types'

const TASK: Task = {
  id: 'task-1',
  title: 'Разработать карточку задачи',
  priority: 'high',
  tags: [
    { id: 'tag-1', name: 'frontend', color: '#6750a4' },
    { id: 'tag-2', name: 'react', color: '#386a20' },
  ],
  assignee: {
    id: 'user-1',
    displayName: 'Анна Петрова',
  },
}

describe('TaskCard', () => {
  test('renders title, priority, tags and assignee', () => {
    render(<TaskCard task={TASK} onMove={jest.fn()} />)

    expect(screen.getByText('Разработать карточку задачи')).toBeInTheDocument()
    expect(screen.getByText('Высокий')).toBeInTheDocument()
    expect(screen.getByText('frontend')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('Анна Петрова')).toBeInTheDocument()
  })

  test('renders all priority labels', () => {
    const priorities = [
      ['low', 'Низкий'],
      ['medium', 'Средний'],
      ['high', 'Высокий'],
      ['critical', 'Критический'],
    ] as const

    priorities.forEach(([priority, label]) => {
      const { unmount } = render(
        <TaskCard task={{ ...TASK, priority }} onMove={jest.fn()} />,
      )

      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })

  test('renders placeholder when assignee is missing', () => {
    render(
      <TaskCard
        task={{ ...TASK, assignee: undefined }}
        onMove={jest.fn()}
      />,
    )

    expect(screen.getByText('Не назначен')).toBeInTheDocument()
  })

  test('does not render tags block when there are no tags', () => {
    const { container } = render(
      <TaskCard task={{ ...TASK, tags: [] }} onMove={jest.fn()} />,
    )

    expect(container.querySelector('.tags')).not.toBeInTheDocument()
  })

  test('puts task id into dataTransfer on drag start', () => {
    const dataTransfer = {
      setData: jest.fn(),
    }

    render(<TaskCard task={TASK} onMove={jest.fn()} />)

    fireEvent.dragStart(screen.getByRole('article'), { dataTransfer })

    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', 'task-1')
  })

  test('is draggable', () => {
    render(<TaskCard task={TASK} onMove={jest.fn()} />)

    expect(screen.getByRole('article')).toHaveAttribute('draggable', 'true')
  })

  test('calls onMove when arrow buttons are clicked', () => {
    const onMove = jest.fn()

    render(<TaskCard task={TASK} onMove={onMove} />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Переместить в предыдущую колонку' }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: 'Переместить в следующую колонку' }),
    )

    expect(onMove).toHaveBeenNthCalledWith(1, 'left')
    expect(onMove).toHaveBeenNthCalledWith(2, 'right')
  })
})
