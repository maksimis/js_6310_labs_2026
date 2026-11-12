import React, { useEffect, useState } from 'react'

import {
  Button,
  Card,
  KeyResultList,
  OkrGoalCard,
  calculateGoalProgress,
  calculateOverallProgress,
  getFilledSquaresCount,
  isPositiveNumber,
  isValidDate,
  isValidId,
  isValidTitle,
} from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'

import type { Goal } from '@my-app/ui-library'

const STORAGE_KEY = 'okr_goals_storage'
const SQUARES_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const loadStoredGoals = (): Goal[] => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    if (Array.isArray(parsed)) {
      return parsed as Goal[]
    }

    return []
  } catch {
    return []
  }
}

function App() {
  const [goals, setGoals] = useState<Goal[]>(loadStoredGoals)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')
  const [goalError, setGoalError] = useState('')

  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [krTitle, setKrTitle] = useState('')
  const [krTarget, setKrTarget] = useState('')
  const [krError, setKrError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }, [goals])

  const overallProgress = calculateOverallProgress(goals)
  const overallSquares = getFilledSquaresCount(overallProgress)
  const activeSelectedGoalId = selectedGoalId || (goals.length > 0 ? String(goals[0].id) : '')
  const sortedGoals = [...goals].sort((a, b) => {
    const aDone = calculateGoalProgress(a) >= 100 ? 1 : 0
    const bDone = calculateGoalProgress(b) >= 100 ? 1 : 0

    return aDone - bDone
  })

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValidTitle(goalTitle)) {
      setGoalError('Название цели не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')

      return
    }

    if (!isValidDate(goalDeadline)) {
      setGoalError('Неверный формат даты или указана прошедшая дата! Введите дату в формате ДД.ММ.ГГГГ (например, 31.12.2026).')

      return
    }

    const newGoal: Goal = {
      id: goals.length + 1,
      title: goalTitle.trim(),
      deadline: goalDeadline.trim(),
      keyResults: [],
    }

    setGoals((prev) => [...prev, newGoal])

    if (!selectedGoalId) {
      setSelectedGoalId(String(newGoal.id))
    }

    setGoalTitle('')
    setGoalDeadline('')
    setGoalError('')
  }

  const handleAddKeyResult = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (goals.length === 0) {
      setKrError('У вас пока нет целей. Сначала создайте цель.')

      return
    }

    const numericGoalId = Number(activeSelectedGoalId)
    const targetGoal = goals.find((g) => g.id === numericGoalId)

    if (!isValidId(activeSelectedGoalId) || !targetGoal) {
      setKrError('Цель с таким номером не найдена.')

      return
    }

    if (!isValidTitle(krTitle)) {
      setKrError('Описание не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')

      return
    }

    if (!isPositiveNumber(krTarget)) {
      setKrError('Целевое значение должно быть числом больше 0.')

      return
    }

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== numericGoalId) {
          return goal
        }

        const newKr = {
          id: goal.keyResults.length + 1,
          title: krTitle.trim(),
          target: Number(krTarget),
          current: 0,
        }

        return {
          ...goal,
          keyResults: [...goal.keyResults, newKr],
        }
      })
    )

    setKrTitle('')
    setKrTarget('')
    setKrError('')
  }

  const handleProgressChange = (goalId: number, krId: number, actualValue: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        return {
          ...goal,
          keyResults: goal.keyResults.map((kr) => {
            if (kr.id !== krId) {
              return kr
            }

            return {
              ...kr,
              current: actualValue,
            }
          }),
        }
      })
    )
  }

  const handleToggleUrgent = (goalId: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        const nextStatus = goal.status === 'urgent' ? undefined : 'urgent'

        return {
          ...goal,
          status: nextStatus,
        }
      })
    )
  }

  return (
    <div className="app">
      <header className="appHeader">
        <div className="headerTop">
          <div>
            <h1 className="appTitle">Отслеживание целей OKR</h1>
            <p className="appSubtitle">Управление целями и ключевыми результатами</p>
          </div>
        </div>

        <div className="overallBox">
          <div className="overallHeader">
            <span className="overallLabel">Общий прогресс по всем целям</span>
            <span className="overallValue">{overallProgress}%</span>
          </div>
          <div className="overallSquares">
            {SQUARES_INDICES.map((index) => {
              const isFilled = index < overallSquares

              return (
                <span
                  key={index}
                  className={`overallSquare ${isFilled ? 'overallSquareFilled' : ''}`}
                />
              )
            })}
          </div>
        </div>
      </header>

      <main className="dashboardLayout">
        <aside className="formsColumn">
          <Card title="Добавить новую цель">
            <form onSubmit={handleAddGoal} className="form">
              <div className="fieldGroup">
                <label htmlFor="goal-title" className="label">
                  Название цели
                </label>
                <input
                  id="goal-title"
                  type="text"
                  className="input"
                  placeholder="Например: Выучить английский"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
              </div>

              <div className="fieldGroup">
                <label htmlFor="goal-deadline" className="label">
                  Срок выполнения (ДД.ММ.ГГГГ)
                </label>
                <input
                  id="goal-deadline"
                  type="text"
                  className="input"
                  placeholder="31.12.2026"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                />
              </div>

              {goalError && <div className="errorText">{goalError}</div>}

              <Button type="submit" variant="primary" size="medium">
                Создать цель
              </Button>
            </form>
          </Card>

          <Card title="Привязать ключевой результат">
            <form onSubmit={handleAddKeyResult} className="form">
              <div className="fieldGroup">
                <label htmlFor="kr-goal-select" className="label">
                  Выберите цель
                </label>
                <select
                  id="kr-goal-select"
                  className="select"
                  value={activeSelectedGoalId}
                  disabled={goals.length === 0}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                >
                  {goals.length === 0 ? (
                    <option value="">Нет доступных целей</option>
                  ) : (
                    goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.id}. {g.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="fieldGroup">
                <label htmlFor="kr-title" className="label">
                  Краткое описание ключевого результата
                </label>
                <input
                  id="kr-title"
                  type="text"
                  className="input"
                  placeholder="Например: Изучить Past Simple"
                  value={krTitle}
                  onChange={(e) => setKrTitle(e.target.value)}
                />
              </div>

              <div className="fieldGroup">
                <label htmlFor="kr-target" className="label">
                  Целевое значение (больше 0)
                </label>
                <input
                  id="kr-target"
                  type="number"
                  className="input"
                  placeholder="5"
                  value={krTarget}
                  onChange={(e) => setKrTarget(e.target.value)}
                />
              </div>

              {krError && <div className="errorText">{krError}</div>}

              <Button type="submit" variant="secondary" size="medium">
                Добавить ключевой результат
              </Button>
            </form>
          </Card>
        </aside>

        <section className="goalsColumn">
          <h2 className="sectionTitle">Ваши цели ({goals.length})</h2>
          {goals.length === 0 ? (
            <div className="emptyGoals">
              У вас пока нет добавленных целей. Создайте первую цель через форму слева.
            </div>
          ) : (
            sortedGoals.map((goal) => {
              const goalProg = calculateGoalProgress(goal)

              return (
                <OkrGoalCard
                  key={goal.id}
                  title={`${goal.id}. ${goal.title}`}
                  deadline={goal.deadline}
                  progress={goalProg}
                  status={goal.status}
                  onToggleUrgent={() => handleToggleUrgent(goal.id)}
                >
                  <KeyResultList
                    keyResults={goal.keyResults}
                    onProgressChange={(krId, val) => handleProgressChange(goal.id, krId, val)}
                  />
                </OkrGoalCard>
              )
            })
          )}
        </section>
      </main>
    </div>
  )
}

export default App
