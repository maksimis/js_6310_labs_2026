import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('показывает календарь и пустой список покупок', () => {
    render(<App />)
    expect(screen.getByText('Календарь блюд')).toBeInTheDocument()
    expect(screen.getByText('Список покупок')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('выбранное блюдо попадает в список покупок', () => {
    render(<App />)
    const selects = screen.getAllByRole('combobox')

    fireEvent.change(selects[0], { target: { value: '1' } })
    expect(screen.getByText(/яйца, 3 шт/)).toBeInTheDocument()
  })
})