import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

describe('App', () => {
  test('renders header', () => {
    render(<App />)
    expect(screen.getByText(/Snake Field Demo/i)).toBeInTheDocument()
  })

  test('renders field size control', () => {
    render(<App />)
    expect(screen.getByText(/Размер поля:/i)).toBeInTheDocument()
  })

  test('renders initial snakes list', () => {
    render(<App />)
    expect(screen.getByText(/snake-1/i)).toBeInTheDocument()
    expect(screen.getByText(/snake-2/i)).toBeInTheDocument()
  })

  test('adds a new snake on button click', async () => {
    const user = userEvent.setup()

    render(<App />)

    const list = screen.getByRole('list')

    expect(within(list).getAllByRole('listitem')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: /Добавить змею/i }))

    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
  })

  test('clears snakes on button click', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: /Очистить/i }))

    expect(screen.queryByText(/snake-1/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/snake-2/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Змеи на поле \(0\)/i)).toBeInTheDocument()
  })

  test('updates field size label on input change', async () => {
    const user = userEvent.setup()

    render(<App />)

    const input = screen.getByRole('spinbutton')

    await user.clear(input)
    await user.type(input, '15')

    expect(screen.getByText(/Игровое поле 15x15/i)).toBeInTheDocument()
  })
})