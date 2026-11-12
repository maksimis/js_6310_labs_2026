import { useMemo, useState } from 'react'

import { HabitCard, Heatmap } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'

import type { HeatmapDay } from '@my-app/ui-library'

function generateDemoData(): HeatmapDay[] {
  const result: HeatmapDay[] = []
  const today = new Date()

  for (let i = 111; i >= 0; i--) {
    const d = new Date(today)

    d.setDate(d.getDate() - i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${day}`
    const completed = (i * 7 + 3) % 5 !== 0

    result.push({ date: dateStr, completed })
  }

  return result
}

function App() {
  const [currentStreak, setCurrentStreak] = useState(4)
  const [bestStreak, setBestStreak] = useState(11)
  const [isCompletedToday, setIsCompletedToday] = useState(false)
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>(generateDemoData)

  const todayStr = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${y}-${m}-${day}`
  }, [])

  const handleMarkComplete = (): void => {
    if (isCompletedToday) return

    setIsCompletedToday(true)
    const newCurrent = currentStreak + 1

    setCurrentStreak(newCurrent)

    if (newCurrent > bestStreak) {
      setBestStreak(newCurrent)
    }

    setHeatmapData((prev) => {
      const exists = prev.find((item) => item.date === todayStr)

      if (exists) {
        return prev.map((item) =>
          item.date === todayStr ? { ...item, completed: true } : item
        )
      }

      return [...prev, { date: todayStr, completed: true }]
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <p className="header-hint">Демонстрация компонентов UI-библиотеки</p>
        </div>
      </header>

      <main className="app-main">
        <div className="hero">
          <div>
            <h1>Трекер привычек</h1>
            <p>Отметьте день или выберите карточку, чтобы увидеть её дни.</p>
          </div>
          <span className="count-pill">Привычек: 2</span>
        </div>

        <section className="section">
          <div className="cards-grid">
            <HabitCard
              name="Утренняя зарядка"
              currentStreak={currentStreak}
              bestStreak={bestStreak}
              isCompletedToday={isCompletedToday}
              onMarkComplete={handleMarkComplete}
            />
            <HabitCard
              name="Чтение книг"
              currentStreak={12}
              bestStreak={21}
              isCompletedToday
            />
          </div>
        </section>

        <section className="section">
          <div className="heatmap-panel">
            <div>
              <p className="section-label">Тепловая карта отметок</p>
              <h2 className="heatmap-title">Утренняя зарядка</h2>
            </div>
            <div className="heatmap-body">
              <Heatmap data={heatmapData} />
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        UI Library v1.0.0 — Демонстрационное приложение
      </footer>
    </div>
  )
}

export default App
