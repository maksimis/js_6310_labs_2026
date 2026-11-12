import styles from './TaskCard.module.css'

import type { Priority, Task } from '../types'

export interface TaskCardProps {
  task: Task
  onMove: (direction: 'left' | 'right') => void
}

const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
}

export const TaskCard = ({ task, onMove }: TaskCardProps) => {
  return (
    <article
      className={styles.card}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('text/plain', task.id)
      }}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <span className={styles.priority} data-priority={task.priority}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </header>

      {task.tags.length > 0 && (
        <div className={styles.tags}>
          {task.tags.map((tag) => (
            <span className={styles.tag} key={tag.id}>
              <span
                className={styles.tagDot}
                style={{ backgroundColor: tag.color }}
                aria-hidden="true"
              />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <footer className={styles.footer}>
        <span className={styles.assignee}>
          {task.assignee?.displayName ?? 'Не назначен'}
        </span>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            onClick={() => onMove('left')}
            aria-label="Переместить в предыдущую колонку"
            title="Переместить влево"
          >
            ←
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => onMove('right')}
            aria-label="Переместить в следующую колонку"
            title="Переместить вправо"
          >
            →
          </button>
        </div>
      </footer>
    </article>
  )
}
