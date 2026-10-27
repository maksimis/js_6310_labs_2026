import { useState } from 'react'
import QuestionCard from './components/QuestionCard/QuestionCard'
import Scoreboard from './components/Scoreboard/Scoreboard'
import { questions, initialScoreRecords } from './data/mockData'
import type { ScoreRecord, GameMode } from './types'
import './App.css'

const App = (): JSX.Element => {
  // Массив ответов на каждый вопрос. null означает, что вопрос пропущен.
  const [answers, setAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  )

  const [index, setIndex] = useState<number>(0)
  const [finished, setFinished] = useState<boolean>(false)

  const [records, setRecords] = useState<ScoreRecord[]>(initialScoreRecords)
  const [mode] = useState<GameMode>('classic')

  const currentQuestion = questions[index]

  // Считаем текущий счет
  const score = answers.reduce((acc, answerId, qIndex) => {
    if (answerId === questions[qIndex].correctOptionId) {
      return acc + 10
    }
    return acc
  }, 0)

  // Обработка ответа
  const handleAnswer = (optionId: string): void => {
    const newAnswers = [...answers]
    newAnswers[index] = optionId
    setAnswers(newAnswers)
  }

  // Поиск следующего неотвеченного вопроса
  const getNextUnansweredIndex = (currentAnswers: (string | null)[]): number => {
    // 1. Ищем после текущего
    for (let i = index + 1; i < questions.length; i++) {
      if (currentAnswers[i] === null) return i
    }
    // 2. Ищем до текущего (возвращаемся назад)
    for (let i = 0; i < questions.length; i++) {
      if (currentAnswers[i] === null) return i
    }
    // 3. Если ничего не нашли — возвращаем -1
    return -1
  }

  // Переход к следующему неотвеченному вопросу
  const handleNext = (): void => {
    const nextIndex = getNextUnansweredIndex(answers)

    if (nextIndex !== -1) {
      setIndex(nextIndex)
    } else {
      finishGame()
    }
  }

  // Пропуск вопроса
  const handleSkip = (): void => {
    const nextIndex = getNextUnansweredIndex(answers)
    if (nextIndex !== -1) {
      setIndex(nextIndex)
    }
  }

  // Завершение игры
  const finishGame = (): void => {
    setFinished(true)

    const newRecord: ScoreRecord = {
      id: Date.now().toString(),
      player: 'Вы',
      score: score,
      mode: mode
    }

    setRecords((prev) => [...prev, newRecord])
  }

  // Начать заново
  const restart = (): void => {
    setIndex(0)
    setAnswers(new Array(questions.length).fill(null))
    setFinished(false)
  }

  // Проверяем, дан ли ответ на текущий вопрос
  const isCurrentAnswered = answers[index] !== null

  // Проверяем, остались ли еще неотвеченные вопросы (кроме текущего, если на него только что ответили)
  const isLastQuestion = getNextUnansweredIndex(answers) === -1

  return (
    <main className="app">
      <h1 className="app__title">Викторина</h1>

      <section className="app__section">
        {finished ? (
          <div className="app__summary">
            <p>Ваш результат: {score} очков</p>
            <button type="button" className="app__next" onClick={restart}>Играть заново</button>
          </div>
        ) : (
          <>
            <p className="app__progress">
              Вопрос {index + 1} / {questions.length} · Текущий счёт: {score}
            </p>

            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={handleAnswer}
            />

            <div className="app__controls">
              {/* Кнопка "Следующий вопрос" / "Завершить" */}
              <button
                type="button"
                className="app__next"
                onClick={handleNext}
                disabled={!isCurrentAnswered}
              >
                {isLastQuestion ? 'Завершить' : 'Следующий вопрос'}
              </button>

              {/* Кнопка "Пропустить" */}
              {!isCurrentAnswered && (
                <button
                  type="button"
                  className="app__skip"
                  onClick={handleSkip}
                >
                  Пропустить
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {finished && (
        <section className="app__section">
          <Scoreboard records={records} />
        </section>
      )}
    </main>
  )
}

export default App