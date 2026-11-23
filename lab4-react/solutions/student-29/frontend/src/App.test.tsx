import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  test('renders gallery title', () => {
    render(<App />)

    expect(screen.getByText('Галерея изображений')).toBeInTheDocument()
  })

  test('renders image cards from initial data', () => {
    render(<App />)

    expect(screen.getByText('Закат на море')).toBeInTheDocument()
    expect(screen.getByText('Горный пейзаж')).toBeInTheDocument()
  })
})