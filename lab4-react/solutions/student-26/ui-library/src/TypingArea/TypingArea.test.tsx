import { fireEvent, render, screen } from '@testing-library/react'

import { TypingArea } from './TypingArea'
import styles from './TypingArea.module.css'

describe('TypingArea', () => {
  test('renders the sample text and input field', () => {
    render(
      <TypingArea
        sampleText="Hello"
        typedText=""
        onTextChange={jest.fn()}
      />,
    )

    expect(screen.getByLabelText('Текст-образец')).toHaveTextContent('Hello')
    expect(screen.getByLabelText('Введите текст здесь')).toBeInTheDocument()
  })

  test('highlights correct, incorrect and pending characters', () => {
    render(
      <TypingArea
        sampleText="cat"
        typedText="cX"
        onTextChange={jest.fn()}
      />,
    )

    expect(screen.getByTestId('char-0')).toHaveClass(styles.correct)
    expect(screen.getByTestId('char-1')).toHaveClass(styles.incorrect)
    expect(screen.getByTestId('char-2')).toHaveClass(styles.pending)
  })

  test('renders spaces in the sample text', () => {
    render(
      <TypingArea
        sampleText="a b"
        typedText=""
        onTextChange={jest.fn()}
      />,
    )

    expect(screen.getByTestId('char-1').textContent).toBe('\u00a0')
  })

  test('shows the current typing position', () => {
    render(
      <TypingArea
        sampleText="Hello"
        typedText="He"
        onTextChange={jest.fn()}
      />,
    )

    expect(screen.getByTestId('typing-cursor')).toBeInTheDocument()
    expect(screen.getByLabelText('Текущая позиция')).toBeInTheDocument()
  })

  test('calls onTextChange when the user types', () => {
    const onTextChange = jest.fn()

    render(
      <TypingArea
        sampleText="Hello"
        typedText=""
        onTextChange={onTextChange}
      />,
    )

    fireEvent.change(screen.getByLabelText('Введите текст здесь'), {
      target: { value: 'H' },
    })

    expect(onTextChange).toHaveBeenCalledWith('H')
  })

  test('prevents entering a new line', () => {
    render(
      <TypingArea
        sampleText="Hello"
        typedText=""
        onTextChange={jest.fn()}
      />,
    )

    const input = screen.getByLabelText('Введите текст здесь')
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true,
    })

    input.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  test('disables the input when disabled is true', () => {
    render(
      <TypingArea
        sampleText="Hello"
        typedText=""
        onTextChange={jest.fn()}
        disabled
      />,
    )

    expect(screen.getByLabelText('Введите текст здесь')).toBeDisabled()
  })

  test('supports an empty sample text', () => {
    render(
      <TypingArea
        sampleText=""
        typedText=""
        onTextChange={jest.fn()}
      />,
    )

    expect(screen.getByLabelText('Текст-образец')).toBeInTheDocument()
    expect(screen.getByTestId('typing-cursor')).toBeInTheDocument()
    expect(screen.queryByTestId('char-0')).not.toBeInTheDocument()
  })
})