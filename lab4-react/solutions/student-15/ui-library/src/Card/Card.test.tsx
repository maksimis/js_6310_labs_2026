import { render, screen } from '@testing-library/react'

import { Card } from './Card'

describe('Card', () => {
  test('renders title and children', () => {
    render(
      <Card title="Заголовок">
        <p>Содержимое</p>
      </Card>,
    )

    expect(screen.getByText('Заголовок')).toBeInTheDocument()
    expect(screen.getByText('Содержимое')).toBeInTheDocument()
  })

  test('renders without a title', () => {
    render(<Card>Только содержимое</Card>)

    expect(screen.getByText('Только содержимое')).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
