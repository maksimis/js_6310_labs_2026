import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookCard } from './BookCard'
import type { Book } from '../types'

const book: Book = {
  id: 'b1',
  title: 'Тестовая книга',
  author: 'Тестовый автор',
  cover: 'cover.png',
  status: 'reading',
  rating: 2,
}

describe('BookCard', () => {
  it('renders cover, title, author and status select', () => {
    render(<BookCard book={book} />)
    expect(screen.getByAltText('Обложка Тестовая книга')).toHaveAttribute('src', 'cover.png')
    expect(screen.getByText('Тестовая книга')).toBeInTheDocument()
    expect(screen.getByText('Тестовый автор')).toBeInTheDocument()
    
    const select = screen.getByTestId('status-select-b1') as HTMLSelectElement
    expect(select.value).toBe('reading')
  })

  it('calls onRatingChange when star clicked', async () => {
    const onRatingChange = jest.fn()
    const user = userEvent.setup()
    render(<BookCard book={book} onRatingChange={onRatingChange} />)
    await user.click(screen.getByTestId('star-b1-5'))
    expect(onRatingChange).toHaveBeenCalledWith('b1', 5)
  })

  it('does not throw when star clicked without callback', async () => {
    const user = userEvent.setup()
    render(<BookCard book={book} />)
    await user.click(screen.getByTestId('star-b1-4'))
    expect(screen.getByTestId('book-card-b1')).toBeInTheDocument()
  })

  it('calls onStatusChange when select changes', async () => {
    const onStatusChange = jest.fn()
    const user = userEvent.setup()
    render(<BookCard book={book} onStatusChange={onStatusChange} />)
    
    const select = screen.getByTestId('status-select-b1')
    await user.selectOptions(select, 'read')
    
    expect(onStatusChange).toHaveBeenCalledWith('b1', 'read')
  })

  it('does not throw when status changes without callback', async () => {
    const user = userEvent.setup()
    render(<BookCard book={book} />) // Без onStatusChange
    
    const select = screen.getByTestId('status-select-b1')
    await user.selectOptions(select, 'want')
    
    expect(select).toBeInTheDocument()
  })

  it('marks stars as active based on rating and hover', async () => {
    const user = userEvent.setup()
    render(<BookCard book={book} />)
    expect(screen.getByTestId('star-b1-2')).toHaveClass('starActive')
    expect(screen.getByTestId('star-b1-3')).not.toHaveClass('starActive')
    
    await user.hover(screen.getByTestId('star-b1-4'))
    expect(screen.getByTestId('star-b1-4')).toHaveClass('starActive')
    
    await user.unhover(screen.getByTestId('star-b1-4'))
    await user.hover(screen.getByRole('radiogroup'))
    await user.unhover(screen.getByRole('radiogroup'))
    expect(screen.getByTestId('star-b1-3')).not.toHaveClass('starActive')
  })

  it('exposes accessible radio attributes', () => {
    render(<BookCard book={book} />)
    const radio = screen.getByLabelText('Поставить 2 из 5')
    expect(radio).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByLabelText('Поставить 5 из 5')).toHaveAttribute('aria-checked', 'false')
  })
})