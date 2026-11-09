import { render, screen } from '@testing-library/react'

import { Card } from './Card'

describe('Card', () => {
  test('renders title and content', () => {
    render(<Card title="Статистика">Очки: 1200</Card>)

    expect(screen.getByText('Статистика')).toBeInTheDocument()
    expect(screen.getByText('Очки: 1200')).toBeInTheDocument()
  })

  test('renders without title', () => {
    const { container } = render(<Card>Контент без заголовка</Card>)

    expect(container.querySelector('.card__title')).not.toBeInTheDocument()
    expect(screen.getByText('Контент без заголовка')).toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<Card className="custom-panel">Текст</Card>)

    expect(container.firstChild).toHaveClass('card', 'custom-panel')
  })
})