import { render, screen, fireEvent } from '@testing-library/react'

import { GameControls } from './GameControls'

describe('GameControls', () => {
  const defaultProps = {
    difficulty: 'medium' as const,
    onDifficultyChange: jest.fn(),
    onNewGame: jest.fn(),
    onSurrender: jest.fn(),
    currentTurn: 'X' as const,
    gameOver: false,
  }

  test('рендерит элементы управления', () => {
    render(<GameControls {...defaultProps} />)
    
    expect(screen.getByText(/Сейчас ходят: X/i)).toBeInTheDocument()

    expect(screen.getByText('Новая игра')).toBeInTheDocument()
    expect(screen.getByText('Сдаться')).toBeInTheDocument()
  })

  test('вызывает onNewGame при клике на кнопку "Новая игра"', () => {
    render(<GameControls {...defaultProps} />)
    
    const newGameButton = screen.getByText('Новая игра')

    fireEvent.click(newGameButton)

    expect(defaultProps.onNewGame).toHaveBeenCalledTimes(1)
  })

  test('вызывает onSurrender при клике на кнопку "Сдаться"', () => {
    render(<GameControls {...defaultProps} />)
    
    const surrenderButton = screen.getByText('Сдаться')

    fireEvent.click(surrenderButton)

    expect(defaultProps.onSurrender).toHaveBeenCalledTimes(1)
  })

  test('показывает "Игра окончена" если gameOver = true', () => {
    render(<GameControls {...defaultProps} gameOver={true} />)
    
    expect(screen.getByText('Игра окончена')).toBeInTheDocument()
  })

  test('вызывает onDifficultyChange при изменении сложности', () => {
    render(<GameControls {...defaultProps} />)
    
    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: 'hard' } })

    expect(defaultProps.onDifficultyChange).toHaveBeenCalledWith('hard')
  })
})