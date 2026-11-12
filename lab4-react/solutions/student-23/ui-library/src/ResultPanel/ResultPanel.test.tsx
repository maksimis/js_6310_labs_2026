import { render, screen } from '@testing-library/react'

import { ResultPanel } from './ResultPanel'

describe('ResultPanel', () => {
  const defaultStats = { totalAttempts: 5, correctAttempts: 3 }

  it('отображает статус ожидания', () => {
    render(
      <ResultPanel isCorrect={null} explanation="Тест" stats={defaultStats} />
    )
    expect(screen.getByText('Ожидание проверки')).toBeInTheDocument()
  })

  it('отображает верный статус', () => {
    render(
      <ResultPanel isCorrect={true} explanation="Тест" stats={defaultStats} />
    )
    expect(screen.getByText('Верно ✅')).toBeInTheDocument()
  })

  it('отображает неверный статус', () => {
    render(
      <ResultPanel isCorrect={false} explanation="Тест" stats={defaultStats} />
    )
    expect(screen.getByText('Неверно ❌')).toBeInTheDocument()
  })

  it('отображает статистику и процент', () => {
    render(
      <ResultPanel isCorrect={true} explanation="Тест" stats={defaultStats} />
    )
    expect(screen.getByText(/Всего попыток:/i)).toBeInTheDocument()
    expect(screen.getByText(/Процент успеха:/i)).toBeInTheDocument()
  })

  it('отображает среднее время, если оно передано', () => {
    render(
      <ResultPanel
        isCorrect={true}
        explanation="Тест"
        stats={{ ...defaultStats, averageTime: 12.5 }}
      />
    )
    expect(screen.getByText(/Среднее время: 12.5 сек/i)).toBeInTheDocument()
  })
})