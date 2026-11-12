import React, { useState } from 'react'

import { TaskCard, ResultPanel } from '@my-app/ui-library'

import type { SolutionStats } from '@my-app/ui-library'

import './App.css'

interface Task {
  id: string
  topicKey: string
  topicName: string
  type: 'test' | 'theory'
  question: string
  explanation: string
  options?: string[]
  correctAnswer?: string | number
  keywordGroups?: string[][]
}

const TOPICS = {
  js: {
    name: 'Основы JS',
    theory: [
      {
        question: 'Что такое замыкание в JavaScript?',
        keywordGroups: [['функция', 'функцию'], ['область видимости', 'окружение', 'лексическое'], ['переменная', 'переменную', 'переменные']],
        explanation: 'Замыкание — это функция, которая запоминает своё лексическое окружение.'
      }
    ],
    test: [
      {
        question: 'Какой оператор используется для строгого сравнения?',
        options: ['==', '===', '=', '!='],
        correctAnswer: 1,
        explanation: 'Оператор === сравнивает без приведения типов.'
      }
    ]
  },
  node: {
    name: 'Node.js',
    theory: [
      {
        question: 'Что такое event loop?',
        keywordGroups: [['очередь', 'queue', 'очереди'], ['события', 'событие', 'callback', 'колбэк', 'колбэков'], ['асинхронность', 'асинхронный', 'асинхронные']],
        explanation: 'Event loop обрабатывает асинхронные операции через очередь колбэков.'
      }
    ],
    test: [
      {
        question: 'Какой модуль используется для работы с файлами?',
        options: ['fs', 'http', 'path', 'os'],
        correctAnswer: 0,
        explanation: 'Модуль fs предоставляет API файловой системы.'
      }
    ]
  },
  db: {
    name: 'Базы данных',
    theory: [
      {
        question: 'Что такое нормализация?',
        keywordGroups: [['таблицы', 'таблица', 'таблиц'], ['избыточность', 'дублирование', 'аномалии', 'аномалий'], ['связи', 'связь', 'отношения']],
        explanation: 'Нормализация уменьшает избыточность и аномалии обновления.'
      }
    ],
    test: [
      {
        question: 'Какой язык используется для запросов в реляционных БД?',
        options: ['SQL', 'JavaScript', 'Python', 'HTML'],
        correctAnswer: 0,
        explanation: 'SQL — стандартный язык структурированных запросов.'
      }
    ]
  }
}

type TopicKey = keyof typeof TOPICS

const App: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')
  const [stats, setStats] = useState<SolutionStats>({ totalAttempts: 0, correctAttempts: 0 })

  const handleGenerate = (topicKey: TopicKey): void => {
    const topic = TOPICS[topicKey]
    const type = Math.random() > 0.5 ? 'test' : 'theory'
    const pool = topic[type]
    const baseTask = pool[Math.floor(Math.random() * pool.length)]
    
    setCurrentTask({
      id: Date.now().toString(),
      topicKey,
      topicName: topic.name,
      type,
      ...baseTask
    } as Task)
    setIsCorrect(null)
    setComment('Введите ответ и нажмите «Проверить».')
  }

  const handleCheck = (passedIsCorrect: boolean, answer: string): void => {
    if (!currentTask) return

    let finalIsCorrect = passedIsCorrect
    let finalComment = ''

    if (currentTask.type === 'test') {
      finalComment = finalIsCorrect ? `Верно! ${currentTask.explanation}` : `Неверно. ${currentTask.explanation}`
    } else {
      const text = answer.toLowerCase().trim()

      if (text.length < 15) {
        finalIsCorrect = false
        finalComment = `Ответ слишком короткий. ${currentTask.explanation}`
      } else {
        const groups = currentTask.keywordGroups || []
        const matchedGroups = groups.filter((group: string[]) => group.some((kw) => text.includes(kw.toLowerCase())))
        const ratio = groups.length > 0 ? matchedGroups.length / groups.length : 0
        
        if (ratio >= 0.5) {
          finalIsCorrect = true
          finalComment = `Верно! ${currentTask.explanation}`
        } else {
          finalIsCorrect = false
          finalComment = `Ответ неполный. Нужно упомянуть: ${groups.map((g: string[]) => g[0]).join(', ')}. ${currentTask.explanation}`
        }
      }
    }

    setIsCorrect(finalIsCorrect)
    setComment(finalComment)
    setStats((prev) => ({
      totalAttempts: prev.totalAttempts + 1,
      correctAttempts: prev.correctAttempts + (finalIsCorrect ? 1 : 0)
    }))
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>EduGenBot</h1>
        <p>Интеллектуальная платформа для генерации заданий</p>
      </header>

      <div className="app__layout">
        <aside className="app__sidebar">
          <h2 className="app__sidebar-title">Выберите тему:</h2>
          <button className="app__topic-btn" onClick={() => handleGenerate('js')}>
            <span className="app__topic-icon">JS</span> Основы JavaScript
          </button>
          <button className="app__topic-btn" onClick={() => handleGenerate('node')}>
            <span className="app__topic-icon">N</span> Node.js
          </button>
          <button className="app__topic-btn" onClick={() => handleGenerate('db')}>
            <span className="app__topic-icon">DB</span> Базы данных
          </button>
        </aside>

        <main className="app__main">
          {currentTask ? (
            <>
              <div className="app__task-header">
                <h3>Тема: {currentTask.topicName}</h3>
                <span className="app__task-type">{currentTask.type === 'test' ? 'Тест' : 'Теория'}</span>
              </div>
              
              {isCorrect === null ? (
                <TaskCard
                  key={currentTask.id} 
                  condition={currentTask.question}
                  correctAnswer={currentTask.correctAnswer || ''}
                  options={currentTask.options}
                  onCheck={handleCheck}
                />
              ) : (
                <div className="app__placeholder">
                  <h3>✅ Задание проверено!</h3>
                  <p>Выберите следующую тему в левом меню, чтобы продолжить.</p>
                </div>
              )}

              <div style={{ marginTop: '2rem' }}>
                <ResultPanel isCorrect={isCorrect} explanation={comment} stats={stats} />
              </div>
            </>
          ) : (
            <div className="app__placeholder">
              <h2>Добро пожаловать в EduGenBot!</h2>
              <p>Выберите тему в левом меню, чтобы сгенерировать задание.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App