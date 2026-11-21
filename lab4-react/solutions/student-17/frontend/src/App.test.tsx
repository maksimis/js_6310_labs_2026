import { render, screen } from '@testing-library/react'
import { App } from './App'

describe('App', () => {
  it('renders the main title and book shelf', () => {
    render(<App />)
   
    expect(screen.getByText(/Моя книжная полка/i)).toBeInTheDocument()

    expect(screen.getAllByTestId(/^book-card-/).length).toBeGreaterThan(0)
  })
})