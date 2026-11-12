import { render, screen, fireEvent } from '@testing-library/react'

import { HabitCard } from './HabitCard'

describe('HabitCard', () => {
  const defaultProps = {
    name: 'Чтение',
    currentStreak: 5,
    bestStreak: 12,
  }

  test('renders habit name', () => {
    render(<HabitCard {...defaultProps} />)
    expect(screen.getByText('Чтение')).toBeInTheDocument()
  })

  test('renders current streak', () => {
    render(<HabitCard {...defaultProps} />)
    expect(screen.getByTestId('current-streak')).toHaveTextContent('5')
  })

  test('renders best streak', () => {
    render(<HabitCard {...defaultProps} />)
    expect(screen.getByTestId('best-streak')).toHaveTextContent('12')
  })

  test('renders mark button with default text', () => {
    render(<HabitCard {...defaultProps} />)
    expect(screen.getByTestId('mark-button')).toHaveTextContent('Отметить выполненным')
  })

  test('renders completed state when isCompletedToday is true', () => {
    render(<HabitCard {...defaultProps} isCompletedToday />)

    const button = screen.getByTestId('mark-button')

    expect(button).toHaveTextContent('Выполнено ✓')
    expect(button).toBeDisabled()
  })

  test('calls onMarkComplete when button clicked and not completed', () => {
    const handleMark = jest.fn()

    render(<HabitCard {...defaultProps} onMarkComplete={handleMark} />)
    fireEvent.click(screen.getByTestId('mark-button'))
    expect(handleMark).toHaveBeenCalledTimes(1)
  })

  test('does not call onMarkComplete when already completed', () => {
    const handleMark = jest.fn()

    render(
      <HabitCard
        {...defaultProps}
        isCompletedToday
        onMarkComplete={handleMark}
      />
    )
    fireEvent.click(screen.getByTestId('mark-button'))
    expect(handleMark).not.toHaveBeenCalled()
  })

  test('applies custom className', () => {
    render(<HabitCard {...defaultProps} className="custom-card" />)
    expect(screen.getByTestId('habit-card')).toHaveClass('custom-card')
  })

  test('renders zero streaks correctly', () => {
    render(
      <HabitCard name="Новая привычка" currentStreak={0} bestStreak={0} />
    )
    expect(screen.getByTestId('current-streak')).toHaveTextContent('0')
    expect(screen.getByTestId('best-streak')).toHaveTextContent('0')
  })
})
