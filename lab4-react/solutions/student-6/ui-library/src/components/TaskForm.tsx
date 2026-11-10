import { useState, type FormEvent } from 'react'

import type { NewTaskData, RepeatMode } from '../types'
import './components.css'

export interface TaskFormProps {
  onSubmit: (task: NewTaskData) => void
}

const repeatOptions: { value: RepeatMode; label: string }[] = [
  { value: 'none', label: 'Без повтора' },
  { value: 'daily', label: 'Каждый день' },
  { value: 'weekdays', label: 'По будням' },
  { value: 'weekly', label: 'Раз в неделю' },
]

function isValidTime(value: string): boolean {
  return /^(?:(?:[01]\d|2[0-3]):[0-5]\d|24:00)$/.test(value)
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [repeat, setRepeat] = useState<RepeatMode>('none')
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: { title?: string; time?: string } = {}

    if (!title.trim()) {
      nextErrors.title = 'Введите название задачи.'
    }

    if (!time) {
      nextErrors.time = 'Укажите время выполнения.'
    } else if (!isValidTime(time)) {
      nextErrors.time = 'Введите время в формате 00:00–24:00.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit({ title: title.trim(), time, repeat })

    setTitle('')
    setTime('')
    setRepeat('none')
    setErrors({})
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__field task-form__field--title">
        <label htmlFor="task-title">Название задачи</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          placeholder="Например, прочитать главу книги"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          required
        />
        {errors.title && (
          <p className="field-error" id="task-title-error" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label htmlFor="task-time">Время</label>
        <input
          id="task-time"
          type="text"
          value={time}
          onChange={(event) => setTime(event.currentTarget.value)}
          placeholder="Например, 18:30"
          inputMode="text"
          maxLength={5}
          autoComplete="off"
          aria-invalid={Boolean(errors.time)}
          aria-describedby={errors.time ? 'task-time-error' : undefined}
          required
        />
        {errors.time && (
          <p className="field-error" id="task-time-error" role="alert">
            {errors.time}
          </p>
        )}
      </div>

      <div className="task-form__field">
        <label htmlFor="task-repeat">Повтор</label>
        <select
          id="task-repeat"
          value={repeat}
          onChange={(event) => setRepeat(event.currentTarget.value as RepeatMode)}
        >
          {repeatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button className="button button--primary task-form__submit" type="submit">
        <span aria-hidden="true">＋</span> Добавить задачу
      </button>
    </form>
  )
}
