import { act, fireEvent, render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  test('renders control panel and bars', () => {
    render(<App />)

    expect(screen.getByText('Шаг')).toBeInTheDocument()
    expect(screen.getAllByTestId('bar')).toHaveLength(9)
    expect(screen.getByText(/Шаг 0 из/)).toBeInTheDocument()
  })

  test('step button moves to next step', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Шаг'))
    expect(screen.getByText(/Шаг 1 из/)).toBeInTheDocument()
  })

  test('play runs steps automatically, reset returns to start', () => {
    jest.useFakeTimers()
    render(<App />)

    fireEvent.click(screen.getByText('Продолжить'))
    act(() => {
      jest.advanceTimersByTime(600)
    })
    expect(screen.getByText(/Шаг 1 из/)).toBeInTheDocument()

    fireEvent.click(screen.getByText('Пауза'))
    fireEvent.click(screen.getByText('Сброс'))
    expect(screen.getByText(/Шаг 0 из/)).toBeInTheDocument()
    jest.useRealTimers()
  })

  test('changing algorithm and speed', () => {
    render(<App />)

    fireEvent.click(screen.getByText('Шаг'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'selection' } })
    expect(screen.getByText(/Шаг 0 из/)).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } })
    expect(screen.getByText('Скорость: 10')).toBeInTheDocument()
  })

  test('shows message when sorting is finished', () => {
    jest.useFakeTimers()
    render(<App />)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } })
    fireEvent.click(screen.getByText('Продолжить'))

    for (let i = 0; i < 100; i++) {
      act(() => {
        jest.advanceTimersByTime(100)
      })
    }

    expect(screen.getByText(/массив отсортирован/)).toBeInTheDocument()
    expect(screen.getByText('Шаг')).toBeDisabled()
    jest.useRealTimers()
  })
})
