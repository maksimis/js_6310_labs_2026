import { render, screen, fireEvent } from '@testing-library/react'

import { Button } from './Button'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    
    expect(screen.getByText('Click me')).toBeDisabled()
  })

  test('applies correct variant class', () => {
    const { container } = render(<Button variant="secondary">Click me</Button>)
    
    expect(container.firstChild).toHaveClass('btn--secondary')
  })

  test('applies correct size class', () => {
    const { container } = render(<Button size="large">Click me</Button>)
    
    expect(container.firstChild).toHaveClass('btn--large')
  })
})