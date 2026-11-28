import { useEffect, useState } from 'react'

import { StatisticsPanel, TypingArea } from '@typing-trainer/ui-library'
import '@typing-trainer/ui-library/style.css'
import './App.css'

const sampleText = 'Программирование требует внимательности, терпения и постоянной практики. Чем больше вы тренируетесь, тем быстрее и точнее становится ваша печать.'

function App() {
  const [typedText, setTypedText] = useState('')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const isComplete = typedText.length >= sampleText.length
  const isStarted = typedText.length > 0

  const errors = Array.from(typedText).reduce(
    (total, char, index) =>
      total + (char !== Array.from(sampleText)[index] ? 1 : 0),
    0,
  )

  const accuracy = typedText.length === 0
    ? 100
    : Math.round(((typedText.length - errors) / typedText.length) * 1000) / 10

  const speed = elapsedSeconds === 0
    ? 0
    : Math.round((typedText.length / elapsedSeconds) * 60)

  useEffect(() => {
    if (!isStarted || isComplete) {
      return
    }

    const timerId = window.setInterval(() => {
      setElapsedSeconds(previous => previous + 1)
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isStarted, isComplete])

  const handleReset = () => {
    setTypedText('')
    setElapsedSeconds(0)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="eyebrow">ТРЕНАЖЁР МАШИНОПИСИ</span>
          <h1>Печатайте быстрее</h1>
          <p>
              Тренируйте скорость печати, следите за точностью
              и отслеживайте свой прогресс.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="trainer-section">
          <div className="section-heading">
            <div>
              <h2>Практика печати</h2>
              <p>Наберите текст, ориентируясь на образец.</p>
            </div>

            <button
              className="reset-button"
              onClick={handleReset}
              type="button"
            >
                Начать заново
            </button>
          </div>

          <div className="trainer-card">
            <TypingArea
              sampleText={sampleText}
              typedText={typedText}
              onTextChange={setTypedText}
              disabled={isComplete}
            />

            <p className="trainer-hint">
              {isComplete
                ? 'Упражнение завершено. Посмотрите результаты ниже.'
                : 'Ошибки выделяются красным, правильные символы — зелёным.'}
            </p>
          </div>
        </section>

        <section className="statistics-section">
          <div className="section-heading">
            <div>
              <h2>Ваша статистика</h2>
              <p>Показатели обновляются во время упражнения.</p>
            </div>
          </div>

          <StatisticsPanel
            speed={speed}
            errors={errors}
            accuracy={accuracy}
            time={elapsedSeconds}
          />
        </section>

        {isComplete && (
          <section className="result-card">
            <h2>Упражнение завершено</h2>
            <p>
                  Ваша скорость — {speed} знаков в минуту,
                  точность — {accuracy}%.
            </p>
            <button onClick={handleReset} type="button">
                  Повторить упражнение
            </button>
          </section>
        )}
      </main>

      <footer className="app-footer">
          React + TypeScript · UI Library
      </footer>
    </div>
  )
}

export default App
