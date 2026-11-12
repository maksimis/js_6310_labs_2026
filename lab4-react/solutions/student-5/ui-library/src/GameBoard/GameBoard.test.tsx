import { render, screen, fireEvent } from '@testing-library/react'

import { GameBoard } from './GameBoard'

describe('GameBoard', () => {
  const emptyBoard: ('X' | 'O' | '')[] = Array(9).fill('')

  test('9 кнопок', () => {
    render(
      <GameBoard board={emptyBoard} winningLine={null} onCellClick={() => {}} />
    )
    const buttons = screen.getAllByRole('button')

    expect(buttons).toHaveLength(9)
  })

  test('вызывает onCellClick с правильным индексом при клике на пустую клетку', () => {
    const handleCellClick = jest.fn()

    render(
      <GameBoard board={emptyBoard} winningLine={null} onCellClick={handleCellClick} />
    )
    const buttons = screen.getAllByRole('button')

    fireEvent.click(buttons[4])

    expect(handleCellClick).toHaveBeenCalledTimes(1)
    expect(handleCellClick).toHaveBeenCalledWith(4)
  })

  test('НЕ вызывает onCellClick при клике на занятую клетку', () => {
    const handleCellClick = jest.fn()
    const boardWithX = [...emptyBoard]

    boardWithX[0] = 'X'

    render(
      <GameBoard board={boardWithX} winningLine={null} onCellClick={handleCellClick} />
    )
    const buttons = screen.getAllByRole('button')

    fireEvent.click(buttons[0])

    expect(handleCellClick).not.toHaveBeenCalled()
  })

  test('подсвечивает выигрышные клетки', () => {
    const winningLine = [0, 1, 2]
    const { container } = render(
      <GameBoard board={emptyBoard} winningLine={winningLine} onCellClick={() => {}} />
    )
    const buttons = container.querySelectorAll('button')
    
    expect(buttons[0].className).toContain('winner')
  })
})