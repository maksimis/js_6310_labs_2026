import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
  it('renders quiz title', () => {
    render(<App />)

    expect(screen.getByText('Викторина')).toBeInTheDocument()
  })

  it('allows answering a question and moving to the next', async () => {
    render(<App />)

    const correctOption = screen.getByText('Париж')

    await userEvent.click(correctOption)

    expect(screen.getByText('Правильно!')).toBeInTheDocument()

    const nextButton = screen.getByRole('button', { name: /Следующий вопрос/i })

    await userEvent.click(nextButton)

    expect(screen.getByText('Сколько будет 7 × 8?')).toBeInTheDocument()
  })

  it('allows skipping a question', async () => {
    render(<App />)

    const skipButton = screen.getByRole('button', { name: /Пропустить/i })

    await userEvent.click(skipButton)

    expect(screen.getByText('Сколько будет 7 × 8?')).toBeInTheDocument()
  })

  it('returns to skipped question after finishing all others', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: /Пропустить/i }))

    await userEvent.click(screen.getByText('56'))
    await userEvent.click(screen.getByRole('button', { name: /Следующий вопрос/i }))

    await userEvent.click(screen.getByText('Азот'))

    const nextButton = screen.getByRole('button', { name: /Следующий вопрос/i })

    await userEvent.click(nextButton)

    expect(screen.getByText('Столица Франции?')).toBeInTheDocument()
  })

  it('finishes game and shows scoreboard', async () => {
    render(<App />)

    await userEvent.click(screen.getByText('Париж'))
    await userEvent.click(screen.getByRole('button', { name: /Следующий вопрос/i }))

    await userEvent.click(screen.getByText('56'))
    await userEvent.click(screen.getByRole('button', { name: /Следующий вопрос/i }))

    await userEvent.click(screen.getByText('Азот'))
    await userEvent.click(screen.getByRole('button', { name: /Завершить/i }))

    expect(screen.getByText(/Ваш результат:/)).toBeInTheDocument()

    expect(screen.getByText('Таблица рекордов')).toBeInTheDocument()

    expect(screen.getByText('Вы')).toBeInTheDocument()
  })
})