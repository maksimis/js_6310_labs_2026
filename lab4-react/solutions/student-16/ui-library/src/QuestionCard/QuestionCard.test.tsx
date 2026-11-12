import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import QuestionCard from './QuestionCard'

import type { Question } from '../types'

const mockQuestion: Question = {
  id: 'q1',
  text: 'Столица Франции?',
  options: [
    { id: 'a', text: 'Париж' },
    { id: 'b', text: 'Лондон' },
    { id: 'c', text: 'Берлин' }
  ],
  correctOptionId: 'a'
}

describe('QuestionCard', () => {
  it('renders question text and all options', () => {
    render(<QuestionCard question={mockQuestion} />)

    expect(screen.getByText('Столица Франции?')).toBeInTheDocument()
    expect(screen.getByText('Париж')).toBeInTheDocument()
    expect(screen.getByText('Лондон')).toBeInTheDocument()
    expect(screen.getByText('Берлин')).toBeInTheDocument()
  })

  it('shows correct feedback when correct option chosen', async () => {
    const onAnswer = jest.fn()

    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} />)

    await userEvent.click(screen.getByTestId('option-a'))
    expect(screen.getByTestId('result-message')).toHaveTextContent('Правильно!')
    expect(onAnswer).toHaveBeenCalledWith('a', true)
  })

  it('shows wrong feedback when wrong option chosen', async () => {
    const onAnswer = jest.fn()

    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} />)

    await userEvent.click(screen.getByTestId('option-b'))
    expect(screen.getByTestId('result-message')).toHaveTextContent('Неправильно')
    expect(onAnswer).toHaveBeenCalledWith('b', false)
  })

  it('disables options after answering and ignores further clicks', async () => {
    const onAnswer = jest.fn()

    render(<QuestionCard question={mockQuestion} onAnswer={onAnswer} />)

    await userEvent.click(screen.getByTestId('option-b'))
    expect(screen.getByTestId('option-a')).toBeDisabled()
    await userEvent.click(screen.getByTestId('option-a'))
    expect(onAnswer).toHaveBeenCalledTimes(1)
  })

  it('marks correct option with correct class and selected wrong with wrong class', async () => {
    render(<QuestionCard question={mockQuestion} />)

    await userEvent.click(screen.getByTestId('option-b'))
    expect(screen.getByTestId('option-a')).toHaveClass('option--correct')
    expect(screen.getByTestId('option-b')).toHaveClass('option--wrong')
    expect(screen.getByTestId('option-c')).toHaveClass('option--disabled')
  })
})