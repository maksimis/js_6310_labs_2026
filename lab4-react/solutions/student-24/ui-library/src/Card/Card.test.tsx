import { render, screen } from '@testing-library/react'

import { Card } from './Card'

describe('Card', () => {
  test('renders title and content', () => {
    render(<Card title="Заголовок">Содержимое карточки</Card>)

    expect(screen.getByText('Заголовок')).toBeInTheDocument()
    expect(screen.getByText('Содержимое карточки')).toBeInTheDocument()
  })

  test('renders without a title', () => {
    const { container } = render(<Card>Только содержимое</Card>)

    expect(container.querySelector('.card__title')).not.toBeInTheDocument()
  })

  test('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Текст</Card>)

    expect(container.firstChild).toHaveClass('card', 'custom-card')
  })
})
