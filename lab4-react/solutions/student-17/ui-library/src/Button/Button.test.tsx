import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    render(<Button isActive={true}>Active</Button>)
    const button = screen.getByText('Active')
    expect(button.className).toContain('active')
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    render(<Button onClick={handleClick}>Click</Button>)
    await user.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})