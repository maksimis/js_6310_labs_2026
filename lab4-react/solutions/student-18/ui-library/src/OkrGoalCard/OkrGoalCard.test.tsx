import { fireEvent, render, screen } from '@testing-library/react'

import { OkrGoalCard } from '../index'

describe('OkrGoalCard', () => {
  test('renders goal title, deadline and not_started status when progress is 0', () => {
    render(<OkrGoalCard title="Выучить React" progress={0} deadline="31.12.2026" />)

    expect(screen.getByText('Выучить React')).toBeInTheDocument()
    expect(screen.getByText('до 31.12.2026')).toBeInTheDocument()
    expect(screen.getByText('Не начато')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()

    const squares = screen.getAllByTestId('progress-square')

    expect(squares).toHaveLength(10)
    expect(squares.filter((sq) => sq.getAttribute('data-filled') === 'true')).toHaveLength(0)
  })

  test('renders in_progress status and correct number of filled squares', () => {
    render(<OkrGoalCard title="Разработать UI" progress={45} />)

    expect(screen.getByText('В работе')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()

    const squares = screen.getAllByTestId('progress-square')
    const filled = squares.filter((sq) => sq.getAttribute('data-filled') === 'true')

    expect(filled).toHaveLength(4)
  })

  test('renders urgent status and toggles status via callback', () => {
    const handleToggle = jest.fn()

    render(
      <OkrGoalCard
        title="Сдать лабораторную"
        progress={30}
        status="urgent"
        onToggleUrgent={handleToggle}
      >
        <div>Вложенный контент</div>
      </OkrGoalCard>
    )

    expect(screen.getByText('Срочное')).toBeInTheDocument()
    expect(screen.getByText('Вложенный контент')).toBeInTheDocument()

    const toggleBtn = screen.getByText('Обычный статус')

    fireEvent.click(toggleBtn)
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  test('renders Make Urgent button when status is not urgent and not completed', () => {
    const handleToggle = jest.fn()

    render(
      <OkrGoalCard
        title="Обычная цель"
        progress={20}
        onToggleUrgent={handleToggle}
      />
    )

    const toggleBtn = screen.getByText('Сделать срочным')

    fireEvent.click(toggleBtn)
    expect(handleToggle).toHaveBeenCalledTimes(1)
  })

  test('renders completed status when progress reaches 100 and hides urgent toggle', () => {
    const handleToggle = jest.fn()

    render(
      <OkrGoalCard
        title="Готовая цель"
        progress={120}
        status="urgent"
        onToggleUrgent={handleToggle}
      />
    )

    expect(screen.getByText('Выполнено')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    const squares = screen.getAllByTestId('progress-square')
    const filled = squares.filter((sq) => sq.getAttribute('data-filled') === 'true')

    expect(filled).toHaveLength(10)
  })
})
