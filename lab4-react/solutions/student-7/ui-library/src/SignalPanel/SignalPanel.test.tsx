import { render, screen, fireEvent } from '@testing-library/react'

import { SignalPanel } from './SignalPanel'

describe('SignalPanel', () => {
  it('отрисовывает 4 кнопки', () => {
    render(
      <SignalPanel activeColor={null} disabled={false} onColorClick={jest.fn()} />
    )
    const buttons = screen.getAllByRole('button')

    expect(buttons).toHaveLength(4)
  })

  it('вызывает колбэк при клике на кнопку', () => {
    const handleClick = jest.fn()

    render(
      <SignalPanel activeColor={null} disabled={false} onColorClick={handleClick} />
    )
    
    // Находим кнопку по aria-label (например, "Цвет red")
    const redButton = screen.getByRole('button', { name: /Цвет red/i })

    fireEvent.click(redButton)

    expect(handleClick).toHaveBeenCalledWith('red')
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('блокирует кнопки, если передан disabled = true', () => {
    render(
      <SignalPanel activeColor={null} disabled={true} onColorClick={jest.fn()} />
    )
    const buttons = screen.getAllByRole('button')
    
    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })
})