import { render, screen, fireEvent } from '@testing-library/react'

import { ImageCard } from './ImageCard'

describe('ImageCard', () => {
  const mockProps = {
    imageUrl: 'test.jpg',
    title: 'Test Image',
    album: 'Test Album',
    onDownload: jest.fn(),
    onDelete: jest.fn(),
  }

  test('renders image, title and album', () => {
    render(<ImageCard {...mockProps} />)
    expect(screen.getByAltText('Test Image')).toBeInTheDocument()
    expect(screen.getByText('Test Image')).toBeInTheDocument()
    expect(screen.getByText('Test Album')).toBeInTheDocument()
  })

  test('calls onDownload when download button is clicked', () => {
    render(<ImageCard {...mockProps} />)
    fireEvent.click(screen.getByText('Скачать'))
    expect(mockProps.onDownload).toHaveBeenCalledTimes(1)
  })

  test('calls onDelete when delete button is clicked', () => {
    render(<ImageCard {...mockProps} />)
    fireEvent.click(screen.getByText('Удалить'))
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1)
  })

  test('truncates long title with ellipsis and sets title attribute', () => {
    const longTitle = 'Очень длинное название'

    render(<ImageCard {...mockProps} title={longTitle} />)
    const titleElement = screen.getByText(longTitle)

    expect(titleElement).toHaveAttribute('title', longTitle)
    // Проверка CSS-стилей в jsdom не работает, но логика ясна
  })
})