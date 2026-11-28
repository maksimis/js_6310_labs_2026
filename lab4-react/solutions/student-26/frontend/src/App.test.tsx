import { fireEvent, render, screen } from '@testing-library/react'

import App from './App'

jest.mock('@typing-trainer/ui-library', () => ({
  TypingArea: ({
    sampleText,
    typedText,
    onTextChange,
    disabled,
  }: {
    sampleText: string
    typedText: string
    onTextChange: (text: string) => void
    disabled?: boolean
  }) => (
    <div>
      <p data-testid="sample-text">{sampleText}</p>
      <label htmlFor="test-typing-input">Введите текст здесь</label>
      <textarea
        id="test-typing-input"
        value={typedText}
        onChange={event => onTextChange(event.target.value)}
        disabled={disabled}
      />
    </div>
  ),
  StatisticsPanel: ({
    speed,
    errors,
    accuracy,
    time,
  }: {
    speed: number
    errors: number
    accuracy: number
    time: number
  }) => (
    <div>
      <span data-testid="speed">{speed}</span>
      <span data-testid="errors">{errors}</span>
      <span data-testid="accuracy">{accuracy}</span>
      <span data-testid="time">{time}</span>
    </div>
  ),
}), { virtual: true })

describe('App', () => {
  test('renders the trainer and initial statistics', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Печатайте быстрее' }),
    ).toBeInTheDocument()

    expect(screen.getByTestId('speed')).toHaveTextContent('0')
    expect(screen.getByTestId('errors')).toHaveTextContent('0')
    expect(screen.getByTestId('accuracy')).toHaveTextContent('100')
    expect(screen.getByTestId('time')).toHaveTextContent('0')
  })

  test('updates error count and accuracy when typing', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Введите текст здесь'), {
      target: { value: 'X' },
    })

    expect(screen.getByTestId('errors')).toHaveTextContent('1')
    expect(screen.getByTestId('accuracy')).toHaveTextContent('0')
  })

  test('completes the exercise when the sample text is entered', () => {
    render(<App />)

    const sampleText = screen.getByTestId('sample-text').textContent ?? ''

    fireEvent.change(screen.getByLabelText('Введите текст здесь'), {
      target: { value: sampleText },
    })

    expect(
      screen.getByRole('heading', { name: 'Упражнение завершено' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Повторить упражнение' }),
    ).toBeInTheDocument()
  })

  test('resets the exercise and statistics', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('Введите текст здесь'), {
      target: { value: 'X' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Начать заново' }))

    expect(screen.getByLabelText('Введите текст здесь')).toHaveValue('')
    expect(screen.getByTestId('errors')).toHaveTextContent('0')
    expect(screen.getByTestId('time')).toHaveTextContent('0')
  })
})