import '@testing-library/jest-dom'

import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

describe('App integration test', (): void => {
  it('renders GameStatusPanel and BreakoutBoard and updates state on interaction', (): void => {
    render(<App />)

    expect(screen.getByText('Демонстрация UI-компонентов «Брейкаут»')).toBeInTheDocument()
    expect(screen.getByTestId('game-status-panel')).toBeInTheDocument()
    expect(screen.getByTestId('breakout-board-svg')).toBeInTheDocument()

    // 1. Тестируем кнопки игрового процесса
    const hitButton: HTMLElement = screen.getByText('Ударить по кирпичу (+50 очков)')

    fireEvent.click(hitButton)
    expect(screen.getByTestId('status-score')).toHaveTextContent('Счёт: 200')

    const nextLevelButton: HTMLElement = screen.getByText('Следующий уровень')

    fireEvent.click(nextLevelButton)
    expect(screen.getByTestId('status-level')).toHaveTextContent('Уровень: 2')

    const loseLifeButton: HTMLElement = screen.getByText('Потерять жизнь')

    fireEvent.click(loseLifeButton)
    expect(screen.getByTestId('status-lives')).toHaveTextContent('Жизни: 2')

    // 2. Тестируем ползунки (Range inputs)
    const paddleInput: HTMLElement = screen.getByLabelText(/Позиция платформы:/i)

    fireEvent.change(paddleInput, { target: { value: '100' } })

    const scaleInput: HTMLElement = screen.getByLabelText(/Ширина контейнера:/i)

    fireEvent.change(scaleInput, { target: { value: '400' } })

    // 3. Тестируем кнопку "Сброс"
    const resetButton: HTMLElement = screen.getByText('Сброс')

    fireEvent.click(resetButton)
    expect(screen.getByTestId('status-score')).toHaveTextContent('Счёт: 0')
    expect(screen.getByTestId('status-level')).toHaveTextContent('Уровень: 1')
    expect(screen.getByTestId('status-lives')).toHaveTextContent('Жизни: 3')
  })
})