import { act, fireEvent, render, screen, within } from '@testing-library/react'

import { KanbanColumn } from './KanbanColumn'

import type { Column, Task } from '../types'

const TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Спроектировать ER-диаграмму',
    priority: 'high',
    tags: [{ id: 'tag-1', name: 'backend', color: '#00696d' }],
    assignee: { id: 'user-1', displayName: 'Анна Петрова' },
  },
  {
    id: 'task-2',
    title: 'Собрать макет доски',
    priority: 'medium',
    tags: [],
    assignee: { id: 'user-2', displayName: 'Мария Козлова' },
  },
]

const COLUMN: Column = {
  id: 'backlog',
  title: 'Бэклог',
  tasks: TASKS,
}

const EMPTY_COLUMN: Column = {
  ...COLUMN,
  tasks: [],
}

const renderColumn = (column: Column = COLUMN) => {
  const onDropTask = jest.fn()
  const onMoveTask = jest.fn()
  const view = render(
    <KanbanColumn
      column={column}
      onDropTask={onDropTask}
      onMoveTask={onMoveTask}
    />,
  )

  return { ...view, onDropTask, onMoveTask }
}

const getColumn = (): HTMLElement =>
  screen.getByRole('region', { name: 'Колонка Бэклог' })

describe('KanbanColumn', () => {
  test('renders title, counter and task cards', () => {
    renderColumn()

    expect(screen.getByRole('heading', { name: 'Бэклог' })).toBeInTheDocument()
    expect(within(getColumn()).getByText('2')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByText('Спроектировать ER-диаграмму')).toBeInTheDocument()
    expect(screen.getByText('Собрать макет доски')).toBeInTheDocument()
  })

  test('shows empty state for a column without tasks', () => {
    renderColumn(EMPTY_COLUMN)

    expect(screen.getByText('Перетащите задачу сюда')).toBeInTheDocument()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
  })

  test('highlights column on drag over and updates empty state', () => {
    renderColumn(EMPTY_COLUMN)

    fireEvent.dragOver(getColumn())

    expect(getColumn()).toHaveClass('over')
    expect(screen.getByText('Отпустите карточку')).toBeInTheDocument()
  })

  test('removes highlight when drag leaves the column', () => {
    renderColumn()

    fireEvent.dragOver(getColumn())
    act(() => {
      getColumn().dispatchEvent(new MouseEvent('dragleave', {
        bubbles: true,
        relatedTarget: document.body,
      }))
    })

    expect(getColumn()).not.toHaveClass('over')
  })

  test('keeps highlight when pointer moves to a child card', () => {
    renderColumn()

    const card = screen.getAllByRole('article')[0]

    fireEvent.dragOver(getColumn())
    act(() => {
      getColumn().dispatchEvent(new MouseEvent('dragleave', {
        bubbles: true,
        relatedTarget: card,
      }))
    })

    expect(getColumn()).toHaveClass('over')
  })

  test('removes highlight when relatedTarget is missing', () => {
    renderColumn()

    fireEvent.dragOver(getColumn())
    fireEvent.dragLeave(getColumn())

    expect(getColumn()).not.toHaveClass('over')
  })

  test('calls onDropTask with task id from dataTransfer', () => {
    const { onDropTask } = renderColumn()
    const dataTransfer = {
      getData: jest.fn(() => 'task-1'),
    }

    fireEvent.drop(getColumn(), { dataTransfer })

    expect(dataTransfer.getData).toHaveBeenCalledWith('text/plain')
    expect(onDropTask).toHaveBeenCalledWith('task-1')
    expect(getColumn()).not.toHaveClass('over')
  })

  test('accepts a task into an empty column', () => {
    const { onDropTask } = renderColumn(EMPTY_COLUMN)

    fireEvent.drop(getColumn(), {
      dataTransfer: {
        getData: () => 'task-1',
      },
    })

    expect(onDropTask).toHaveBeenCalledWith('task-1')
  })

  test('does not call onDropTask when dropped data is empty', () => {
    const { onDropTask } = renderColumn()
    const dataTransfer = {
      getData: jest.fn(() => ''),
    }

    fireEvent.drop(getColumn(), { dataTransfer })

    expect(onDropTask).not.toHaveBeenCalled()
  })

  test('passes task id and direction to onMoveTask', () => {
    const { onMoveTask } = renderColumn()
    const [firstCard] = screen.getAllByRole('article')

    fireEvent.click(
      within(firstCard).getByRole('button', {
        name: 'Переместить в следующую колонку',
      }),
    )
    fireEvent.click(
      within(firstCard).getByRole('button', {
        name: 'Переместить в предыдущую колонку',
      }),
    )

    expect(onMoveTask).toHaveBeenNthCalledWith(1, 'task-1', 'right')
    expect(onMoveTask).toHaveBeenNthCalledWith(2, 'task-1', 'left')
  })
})
