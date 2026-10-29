import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('отображает заголовок WordTrainer', () => {
    render(<App />)
    const heading = screen.getByText(/WordTrainer/i)

    expect(heading).toBeInTheDocument()
  })

  it('отображает карточку для изучения', () => {
    render(<App />)
    const cardHeading = screen.getByText(/Карточка для изучения/i)

    expect(cardHeading).toBeInTheDocument()
  })

  it('отображает таблицу карточек', () => {
    render(<App />)
    const tableHeading = screen.getByText(/Таблица карточек/i)

    expect(tableHeading).toBeInTheDocument()
  })
})