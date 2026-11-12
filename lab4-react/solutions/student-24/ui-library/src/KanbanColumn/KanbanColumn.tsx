import { useState, type DragEvent } from 'react'

import styles from './KanbanColumn.module.css'
import { TaskCard } from '../TaskCard/TaskCard'

import type { Column } from '../types'

export interface KanbanColumnProps {
  column: Column
  onDropTask: (taskId: string) => void
  onMoveTask: (taskId: string, direction: 'left' | 'right') => void
}

export const KanbanColumn = ({
  column,
  onDropTask,
  onMoveTask,
}: KanbanColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const classNames = isDragOver
    ? `${styles.column} ${styles.over}`
    : styles.column

  const handleDragOver = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLElement>): void => {
    const nextTarget = event.relatedTarget

    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLElement>): void => {
    event.preventDefault()
    setIsDragOver(false)

    const taskId = event.dataTransfer.getData('text/plain')

    if (taskId) {
      onDropTask(taskId)
    }
  }

  return (
    <section
      className={classNames}
      aria-label={`Колонка ${column.title}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className={styles.header}>
        <h2 className={styles.title}>{column.title}</h2>
        <span className={styles.counter}>{column.tasks.length}</span>
      </header>

      <div className={styles.list}>
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={(direction) => onMoveTask(task.id, direction)}
          />
        ))}

        {column.tasks.length === 0 && (
          <p className={styles.empty}>
            {isDragOver ? 'Отпустите карточку' : 'Перетащите задачу сюда'}
          </p>
        )}
      </div>
    </section>
  )
}
