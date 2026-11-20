import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  test('renders the demo header and both component titles', () => {
    render(<App />)

    expect(screen.getByText('Совместный список покупок')).toBeInTheDocument()
    expect(screen.getByText('Список покупок')).toBeInTheDocument()
    expect(screen.getByText('Участники и синхронизация')).toBeInTheDocument()
  })

  test('shows the summary of shopping items and participants', () => {
    render(<App />)

    expect(screen.getByText('2 / 6')).toBeInTheDocument()
    expect(screen.getByText('2 / 4')).toBeInTheDocument()
  })
})
