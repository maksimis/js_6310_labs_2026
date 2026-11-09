import { render, screen } from '@testing-library/react'

import { Gallery } from './Gallery'

describe('Gallery', () => {
  const items = [
    { imageUrl: 'a.jpg', title: 'A', album: 'X', onDownload: jest.fn(), onDelete: jest.fn() },
    { imageUrl: 'b.jpg', title: 'B', album: 'Y', onDownload: jest.fn(), onDelete: jest.fn() },
  ]

  test('renders all items', () => {
    render(<Gallery items={items} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  test('renders empty gallery', () => {
    const { container } = render(<Gallery items={[]} />)

    expect(container.firstChild).toBeEmptyDOMElement()
  })
})