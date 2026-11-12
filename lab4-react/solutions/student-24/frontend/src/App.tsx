import { useState, type FormEvent } from 'react'

import { KanbanColumn } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'
import kanbexLogo from './res/kanbexLogo.svg'

import type { Column, Priority, Tag, Task, User } from '@my-app/ui-library'

const USERS: User[] = [
  { id: 'user-anna', displayName: 'Димитрий Селиванкин' },
  { id: 'user-ivan', displayName: 'Максим Литвиновский' },
  { id: 'user-maria', displayName: 'Алексей Шуганин' },
]

const TAG_FRONTEND: Tag = { id: 'tag-frontend', name: 'frontend', color: '#7979ff' }
const TAG_BACKEND: Tag = { id: 'tag-backend', name: 'backend', color: '#00c30d' }
const TAG_DESIGN: Tag = { id: 'tag-design', name: 'design', color: '#ff8181' }
const TAG_REACT: Tag = { id: 'tag-react', name: 'react', color: '#4eff5a' }
const TAG_DB: Tag = { id: 'tag-db', name: 'database', color: '#a6a6ff' }
const TAG_AUTH: Tag = { id: 'tag-auth', name: 'auth', color: '#fe4b4b' }
const TAG_GIT: Tag = { id: 'tag-git', name: 'git', color: '#4b4a5a' }

const TAGS: Tag[] = [
  TAG_FRONTEND,
  TAG_BACKEND,
  TAG_DESIGN,
  TAG_REACT,
  TAG_DB,
  TAG_AUTH,
  TAG_GIT,
]

const INITIAL_COLUMNS: Column[] = [
  {
    id: 'backlog',
    title: 'TO DO',
    tasks: [
      {
        id: 'task-1',
        title: 'Спроектировать ER-диаграмму',
        priority: 'high',
        tags: [TAG_BACKEND, TAG_DB],
        assignee: USERS[0],
      },
      {
        id: 'task-2',
        title: 'Собрать макет доски',
        priority: 'medium',
        tags: [TAG_DESIGN],
        assignee: USERS[2],
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'В работе',
    tasks: [
      {
        id: 'task-3',
        title: 'Разработать карточку задачи',
        priority: 'high',
        tags: [TAG_FRONTEND, TAG_REACT],
        assignee: USERS[1],
      },
      {
        id: 'task-4',
        title: 'Настроить ASP.NET Core Identity',
        priority: 'critical',
        tags: [TAG_BACKEND, TAG_AUTH],
        assignee: USERS[0],
      },
    ],
  },
  {
    id: 'done',
    title: 'Готово',
    tasks: [
      {
        id: 'task-5',
        title: 'Создать репозиторий и ветки',
        priority: 'low',
        tags: [TAG_GIT],
        assignee: USERS[1],
      },
    ],
  },
]

const App = () => {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [assigneeId, setAssigneeId] = useState(USERS[0].id)
  const [targetColumnId, setTargetColumnId] = useState(INITIAL_COLUMNS[0].id)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

  const totalTasks = columns.reduce(
    (sum, column) => sum + column.tasks.length,
    0,
  )

  const moveTask = (taskId: string, toColumnId: string): void => {
    setColumns((current) => {
      const task = current
        .flatMap((column) => column.tasks)
        .find((item) => item.id === taskId)

      if (!task) {
        return current
      }

      return current.map((column) => {
        const tasksWithoutMoved = column.tasks.filter(
          (item) => item.id !== taskId,
        )

        if (column.id === toColumnId) {
          return { ...column, tasks: [...tasksWithoutMoved, task] }
        }

        return { ...column, tasks: tasksWithoutMoved }
      })
    })
  }

  const moveTaskByDirection = (
    taskId: string,
    direction: 'left' | 'right',
  ): void => {
    const fromIndex = columns.findIndex((column) =>
      column.tasks.some((task) => task.id === taskId)
    )

    if (fromIndex === -1) {
      return
    }

    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1

    if (toIndex < 0 || toIndex >= columns.length) {
      return
    }

    moveTask(taskId, columns[toIndex].id)
  }

  const toggleTag = (tagId: string): void => {
    setSelectedTagIds((current) => (
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    ))
  }

  const handleAddTask = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      return
    }

    const assignee = USERS.find((user) => user.id === assigneeId)
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: trimmedTitle,
      priority,
      tags: TAGS.filter((tag) => selectedTagIds.includes(tag.id)),
      assignee,
    }

    setColumns((current) => current.map((column) => (
      column.id === targetColumnId
        ? { ...column, tasks: [...column.tasks, newTask] }
        : column
    )))
    setTitle('')
    setSelectedTagIds([])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <h1 className="brand-title">
            <img className="brand-logo" src={kanbexLogo} alt="Kanbex" />
          </h1>
          <p className="brand-subtitle">Цифровой Kanban-симулятор</p>
        </div>
      </header>

      <main className="app-main">
        <section className="page-heading">
          <div>
            <h2 className="page-title">Доска проекта</h2>
            <p className="page-description">
              Перетащите карточку в другую колонку или используйте стрелки.
            </p>
          </div>

          <span className="task-total">Всего задач: {totalTasks}</span>
        </section>

        <section className="composer">
          <h3 className="composer-title">Добавить задачу</h3>

          <form className="add-form" onSubmit={handleAddTask}>
            <div className="field field-wide">
              <label htmlFor="task-title">Название</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Например, подготовить макет доски"
              />
            </div>

            <div className="field">
              <label htmlFor="task-priority">Приоритет</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as Priority)}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="critical">Критический</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="task-assignee">Исполнитель</label>
              <select
                id="task-assignee"
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
              >
                {USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="task-column">Колонка</label>
              <select
                id="task-column"
                value={targetColumnId}
                onChange={(event) => setTargetColumnId(event.target.value)}
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <fieldset className="field tag-field">
              <legend className="tag-legend">Теги</legend>
              <div className="tag-picker">
                {TAGS.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id)

                  return (
                    <label
                      key={tag.id}
                      className={`tag-option${isSelected ? ' tag-option--selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        name="tags"
                        value={tag.id}
                        checked={isSelected}
                        onChange={() => toggleTag(tag.id)}
                      />
                      <span
                        className="tag-dot"
                        style={{ backgroundColor: tag.color }}
                        aria-hidden="true"
                      />
                      {tag.name}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <button
              className="add-button"
              type="submit"
              disabled={!title.trim()}
            >
              Добавить
            </button>
          </form>
        </section>

        <div className="board">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onDropTask={(taskId) => moveTask(taskId, column.id)}
              onMoveTask={moveTaskByDirection}
            />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        Компоненты KanbanColumn и TaskCard · React + TypeScript
      </footer>
    </div>
  )
}

export default App
