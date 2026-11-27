import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  test('отображает заголовок панели аналитики', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Панель аналитики' })
    ).toBeInTheDocument()
  })

  test('отображает все три карточки метрик', () => {
    render(<App />)

    expect(screen.getByText('Цена')).toBeInTheDocument()
    expect(screen.getByText('Спрос')).toBeInTheDocument()
    expect(screen.getAllByText('Посетители')).toHaveLength(2)
  })

  test('отображает график посетителей', () => {
    render(<App />)

    expect(
      screen.getByRole('img', { name: 'Линейный график: Посетители' })
    ).toBeInTheDocument()
  })
})