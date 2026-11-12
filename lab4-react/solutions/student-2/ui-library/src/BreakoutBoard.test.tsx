import { render, screen } from '@testing-library/react'

import { BreakoutBoard } from './BreakoutBoard'
import { Brick } from './types'

describe('BreakoutBoard', (): void => {
  const sampleBricks: Brick[] = [
    {
      id: 'b1',
      x: 10,
      y: 10,
      width: 60,
      height: 20,
      color: '#22c55e',
      durability: 1
    },
    {
      id: 'b2',
      x: 80,
      y: 10,
      width: 60,
      height: 20,
      color: '#eab308',
      durability: 3,
      type: 'armored'
    },
    {
      id: 'b3',
      x: 150,
      y: 10,
      width: 60,
      height: 20,
      color: '#a855f7',
      durability: 1,
      type: 'bonus'
    },
    {
      id: 'b4',
      x: 220,
      y: 10,
      width: 60,
      height: 20,
      color: '#64748b',
      durability: 0,
      type: 'indestructible'
    },
    {
      id: 'b5-destroyed',
      x: 290,
      y: 10,
      width: 60,
      height: 20,
      color: '#ef4444',
      durability: 0,
      type: 'normal'
    }
  ]

  it('renders board with correct viewBox, bricks of different types, paddle and ball', (): void => {
    render(
      <BreakoutBoard
        width={800}
        height={500}
        bricks={sampleBricks}
        paddle={{ x: 350, y: 460, width: 100, height: 14 }}
        ball={{ x: 400, y: 440, radius: 8 }}
      />
    )

    const svg: HTMLElement = screen.getByTestId('breakout-board-svg')

    expect(svg).toHaveAttribute('viewBox', '0 0 800 500')

    expect(screen.getByTestId('brick-b1')).toHaveTextContent('1')
    expect(screen.getByTestId('brick-b2')).toHaveTextContent('3')
    expect(screen.getByTestId('brick-b3')).toHaveTextContent('★1')
    expect(screen.getByTestId('brick-b4')).toHaveTextContent('∞')
    expect(screen.queryByTestId('brick-b5-destroyed')).not.toBeInTheDocument()

    expect(screen.getByTestId('breakout-paddle')).toHaveAttribute('fill', '#38bdf8')
    expect(screen.getByTestId('breakout-ball')).toHaveAttribute('fill', '#f43f5e')
  })

  it('applies custom paddle and ball colors and custom className', (): void => {
    render(
      <BreakoutBoard
        width={600}
        height={400}
        bricks={[]}
        paddle={{ x: 250, y: 370, width: 80, height: 12, color: '#10b981' }}
        ball={{ x: 290, y: 350, radius: 6, color: '#f59e0b' }}
        className="custom-board"
      />
    )

    expect(screen.getByTestId('breakout-board-container')).toHaveClass('custom-board')
    expect(screen.getByTestId('breakout-paddle')).toHaveAttribute('fill', '#10b981')
    expect(screen.getByTestId('breakout-ball')).toHaveAttribute('fill', '#f59e0b')
  })
})