import { useState } from 'react'

import { TaskForm, TaskList } from '@my-app/ui-library'

import type { NewTaskData, Task } from '@my-app/ui-library'

const initialTasks: Task[] = [
  { id: 'task-1', title: 'Утренняя зарядка', time: '07:30', repeat: 'daily', completed: true },
  { id: 'task-2', title: 'Подготовить план на день', time: '08:15', repeat: 'weekdays', completed: false },
  { id: 'task-3', title: 'Изучить TypeScript', time: '10:00', repeat: 'none', completed: false },
  { id: 'task-4', title: 'Обеденный перерыв', time: '13:00', repeat: 'daily', completed: false },
  { id: 'task-5', title: 'Позвонить другу', time: '18:30', repeat: 'weekly', completed: false },
]

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  function addTask(data: NewTaskData) {
    const newTask: Task = {
      ...data,
      id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      completed: false,
    }

    setTasks((current) => [...current, newTask])
  }

  function changeTaskCompletion(taskId: string, completed: boolean) {
    setTasks((current) => current.map((task) => (
      task.id === taskId ? { ...task, completed } : task
    )))
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <div>
          <p className="eyebrow">ВАШ ЛИЧНЫЙ ПЛАНИРОВЩИК</p>
          <h1>План на день</h1>
          <p className="page-subtitle">Небольшие шаги складываются в большие результаты.</p>
        </div>
        <div className="date-pill"><span aria-hidden="true">◷</span> Сегодня</div>
      </header>

      <section className="summary-strip" aria-label="Сводка задач">
        <div className="summary-icon" aria-hidden="true">☷</div>
        <div className="summary-copy">
          <strong>Ваш день под контролем</strong>
          <span>{tasks.length === 0 ? 'Начните с первой задачи' : `${completedCount} из ${tasks.length} задач выполнено`}</span>
        </div>
        <div className="progress-track" aria-label="Прогресс выполнения">
          <span style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} />
        </div>
      </section>

      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">НЕ УПУСТИТЕ ВАЖНОЕ</p>
            <h2>Новая задача</h2>
          </div>
          <span className="heading-symbol" aria-hidden="true">＋</span>
        </div>
        <TaskForm onSubmit={addTask} />
      </section>

      <section className="tasks-section">
        <div className="section-heading tasks-heading">
          <div>
            <p className="eyebrow">ШАГ ЗА ШАГОМ</p>
            <h2>Расписание <span className="count-badge">{tasks.length}</span></h2>
          </div>
          <p className="section-note">Отмечайте выполненное — это тоже результат.</p>
        </div>
        <TaskList tasks={tasks} onTaskCompleteChange={changeTaskCompletion} />
      </section>

      <footer className="page-footer">Составлено с заботой о вашем времени <span aria-hidden="true">✦</span></footer>
    </main>
  )
}
