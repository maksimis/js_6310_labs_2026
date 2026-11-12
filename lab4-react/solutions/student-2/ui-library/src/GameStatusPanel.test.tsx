import { render, screen } from '@testing-library/react'

import { GameStatusPanel } from './GameStatusPanel'

describe('GameStatusPanel', (): void => {
  it('renders score, level and positive lives with heart icons', (): void => {
    render(<GameStatusPanel score={1250} lives={3} level={2} className="custom-panel" />)

    expect(screen.getByTestId('game-status-panel')).toBeInTheDocument()
    expect(screen.getByTestId('status-score')).toHaveTextContent('Счёт: 1250')
    expect(screen.getByTestId('status-level')).toHaveTextContent('Уровень: 2')
    expect(screen.getByTestId('status-lives')).toHaveTextContent('Жизни: 3❤️❤️❤️')
  })

  it('handles zero or negative lives without rendering hearts', (): void => {
    render(<GameStatusPanel score={0} lives={-1} level={1} />)

    expect(screen.getByTestId('status-lives')).toHaveTextContent('Жизни: 0')
    expect(screen.getByTestId('status-lives')).not.toHaveTextContent('❤️')
  })
})