import { render, screen } from '@testing-library/react'

import { Card } from '../index'

describe('Card', () => {
  test('renders card with title and children', () => {
    render(
      <Card title="Заголовок карточки" className="custom-class">
        <span>Содержимое карточки</span>
      </Card>
    )

    expect(screen.getByText('Заголовок карточки')).toBeInTheDocument()
    expect(screen.getByText('Содержимое карточки')).toBeInTheDocument()
  })

  test('renders card without title', () => {
    render(
      <Card>
        <span>Без заголовка</span>
      </Card>
    )

    expect(screen.getByText('Без заголовка')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
