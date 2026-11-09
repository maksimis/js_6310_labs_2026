import { fireEvent, render, screen } from '@testing-library/react'

import { NumberPanel } from './NumberPanel'

describe('NumberPanel', () => {
  it('renders all buttons', () => {
    render(<NumberPanel onNumberSelect={() => {}} usedCounts={{}} />)

    for (let i = 1; i <= 9; i++) {
      expect(screen.getByTestId(`btn-${i}`)).toBeInTheDocument()
    }

    expect(screen.getByTestId('btn-clear')).toBeInTheDocument()
  })

  it('disables button when used 9 times', () => {
    render(<NumberPanel onNumberSelect={() => {}} usedCounts={{ 5: 9 }} />)

    expect(screen.getByTestId('btn-5')).toBeDisabled()
  })

  it('calls callback with correct number', () => {
    const onSelect = jest.fn()

    render(<NumberPanel onNumberSelect={onSelect} usedCounts={{}} />)
    fireEvent.click(screen.getByTestId('btn-3'))

    expect(onSelect).toHaveBeenCalledWith(3)
  })

  it('does not call callback when disabled', () => {
    const onSelect = jest.fn()

    render(<NumberPanel onNumberSelect={onSelect} usedCounts={{ 3: 9 }} />)
    fireEvent.click(screen.getByTestId('btn-3'))

    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls callback with null on clear', () => {
    const onSelect = jest.fn()

    render(<NumberPanel onNumberSelect={onSelect} usedCounts={{}} />)
    fireEvent.click(screen.getByTestId('btn-clear'))

    expect(onSelect).toHaveBeenCalledWith(null)
  })
})