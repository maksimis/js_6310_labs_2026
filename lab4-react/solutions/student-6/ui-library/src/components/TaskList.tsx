import type { Task } from '../types'
import './components.css'

export interface TaskListProps {
  tasks: Task[]
  onTaskCompleteChange: (taskId: string, completed: boolean) => void
}

const repeatLabels = {
  none: '',
  daily: 'Каждый день',
  weekdays: 'По будням',
  weekly: 'Раз в неделю',
} as const

function taskMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

export function TaskList({ tasks, onTaskCompleteChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="task-list task-list--empty" aria-label="Список задач">
        <span className="empty-icon" aria-hidden="true">☀</span>
        <h2>Пока нет задач</h2>
        <p>Добавьте первую задачу с помощью формы выше.</p>
      </section>
    )
  }

  const sortedTasks = [...tasks].sort((a, b) => taskMinutes(a.time) - taskMinutes(b.time))
  const groups = sortedTasks.reduce<Record<string, Task[]>>((result, task) => {
    const hour = task.time.slice(0, 2)

    result[hour] = [...(result[hour] ?? []), task]

    return result
  }, {})

  return (
    <section className="task-list" aria-label="Список задач">
      {Object.entries(groups)
        .sort(([firstHour], [secondHour]) => Number(firstHour) - Number(secondHour))
        .map(([hour, hourTasks]) => (
          <section className="time-group" key={hour} aria-label={`Задачи на ${hour}:00`}>
            <div className="time-group__heading">
              <span className="time-dot" aria-hidden="true" />
              <h3>{hour}:00</h3>
              <span className="time-group__line" />
            </div>
            <div className="time-group__tasks">
              {hourTasks.map((task) => (
                <article className={`task-card${task.completed ? ' task-card--completed' : ''}`} key={task.id}>
                  <label className="task-card__check">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(event) => onTaskCompleteChange(task.id, event.currentTarget.checked)}
                      aria-label={`Отметить задачу «${task.title}» как выполненную`}
                    />
                    <span className="custom-check" aria-hidden="true">✓</span>
                  </label>
                  <div className="task-card__body">
                    <div className="task-card__title-row">
                      <span className="task-card__title">{task.title}</span>
                      {task.repeat !== 'none' && (
                        <span className="repeat-badge" title={`Повтор: ${repeatLabels[task.repeat]}`}>
                          <span aria-hidden="true">↻</span> {repeatLabels[task.repeat]}
                        </span>
                      )}
                    </div>
                  </div>
                  <time className="task-card__time" dateTime={task.time}>{task.time}</time>
                </article>
              ))}
            </div>
          </section>
        ))}
    </section>
  )
}
