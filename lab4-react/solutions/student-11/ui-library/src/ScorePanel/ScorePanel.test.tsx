import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ScorePanel } from './ScorePanel'

describe('ScorePanel', () => {
  const mockOnNewGame = jest.fn()
  const mockOnUndo = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders score and high score correctly', () => {
    render(
      <ScorePanel
        score={150}
        highScore={1000}
        onNewGame={mockOnNewGame}
        onUndo={mockOnUndo}
      />
    )

    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
  })

  test('calls onUndo when undo button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ScorePanel
        score={0}
        highScore={0}
        onNewGame={mockOnNewGame}
        onUndo={mockOnUndo}
      />
    )

    const undoButton = screen.getByRole('button', { name: /отменить ход/i })

    await user.click(undoButton)

    expect(mockOnUndo).toHaveBeenCalledTimes(1)
  })

  test('calls onNewGame when new game button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <ScorePanel
        score={0}
        highScore={0}
        onNewGame={mockOnNewGame}
        onUndo={mockOnUndo}
      />
    )

    const newGameButton = screen.getByRole('button', { name: /новая игра/i })

    await user.click(newGameButton)

    expect(mockOnNewGame).toHaveBeenCalledTimes(1)
  })
})