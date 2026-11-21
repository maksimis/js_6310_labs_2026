import { render, screen, fireEvent } from '@testing-library/react'

import { CandidatePanel } from './CandidatePanel'

describe('CandidatePanel', () => {
  const mockOnModeChange = jest.fn()
  const mockOnNumberSelect = jest.fn()
  const mockOnErase = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly in note mode (covers ternary branches)', () => {
    render(
      <CandidatePanel
        mode="note"
        onModeChange={mockOnModeChange}
        onNumberSelect={mockOnNumberSelect}
        onErase={mockOnErase}
      />
    )

    // Проверяем, что кнопка "Заметка" имеет активный класс, 
    // а "Значение" - нет. Это заставит Jest выполнить обе ветки тернарника.
    expect(screen.getByText('Заметка')).toHaveClass('active')
    expect(screen.getByText('Значение')).not.toHaveClass('active')
  })

  test('renders all buttons', () => {
    render(
      <CandidatePanel
        mode="value"
        onModeChange={mockOnModeChange}
        onNumberSelect={mockOnNumberSelect}
        onErase={mockOnErase}
      />
    )

    expect(screen.getByText('Значение')).toBeInTheDocument()
    expect(screen.getByText('Заметка')).toBeInTheDocument()
    expect(screen.getByText('Стереть')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(12) // 3 + 9
  })

  test('calls onModeChange when toggling mode', () => {
    render(
      <CandidatePanel
        mode="value"
        onModeChange={mockOnModeChange}
        onNumberSelect={mockOnNumberSelect}
        onErase={mockOnErase}
      />
    )

    fireEvent.click(screen.getByText('Заметка'))
    expect(mockOnModeChange).toHaveBeenCalledWith('note')

    fireEvent.click(screen.getByText('Значение'))
    expect(mockOnModeChange).toHaveBeenCalledWith('value')
  })

  test('calls onNumberSelect when clicking a number', () => {
    render(
      <CandidatePanel
        mode="value"
        onModeChange={mockOnModeChange}
        onNumberSelect={mockOnNumberSelect}
        onErase={mockOnErase}
      />
    )

    fireEvent.click(screen.getByText('5'))
    expect(mockOnNumberSelect).toHaveBeenCalledWith(5)
  })

  test('calls onErase when clicking erase', () => {
    render(
      <CandidatePanel
        mode="value"
        onModeChange={mockOnModeChange}
        onNumberSelect={mockOnNumberSelect}
        onErase={mockOnErase}
      />
    )

    fireEvent.click(screen.getByText('Стереть'))
    expect(mockOnErase).toHaveBeenCalled()
  })
})