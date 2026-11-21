import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookShelf } from './BookShelf'
import type { Book } from '../types'

const books: Book[] = [
  { id: '1', title: 'Альфа', author: 'Автор А', cover: 'a.png', status: 'read', rating: 5 },
  { id: '2', title: 'Бета', author: 'Автор Б', cover: 'b.png', status: 'reading', rating: 3 },
  { id: '3', title: 'Гамма', author: 'Автор А', cover: 'c.png', status: 'want', rating: 0 },
]

describe('BookShelf', () => {
  it('renders all books by default', () => {
    render(<BookShelf books={books} />)
    expect(screen.getAllByTestId(/^book-card-/)).toHaveLength(3)
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    render(<BookShelf books={books} />)
    await user.click(screen.getByRole('tab', { name: 'Читаю' }))
    expect(screen.getAllByTestId(/^book-card-/)).toHaveLength(1)
    expect(screen.getByText('Бета')).toBeInTheDocument()
  })

  it('filters by search query (title / author)', async () => {
    const user = userEvent.setup()
    render(<BookShelf books={books} />)
    const search = screen.getByLabelText('Поиск книг')
    await user.type(search, 'автор а')
    expect(screen.getAllByTestId(/^book-card-/)).toHaveLength(2)
    await user.clear(search)
    await user.type(search, 'бета')
    expect(screen.getAllByTestId(/^book-card-/)).toHaveLength(1)
  })

  it('shows empty state when nothing matches', async () => {
    const user = userEvent.setup()
    render(<BookShelf books={books} />)
    await user.type(screen.getByLabelText('Поиск книг'), 'zzz')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('combines filter and search', async () => {
    const user = userEvent.setup()
    render(<BookShelf books={books} />)
    await user.click(screen.getByRole('tab', { name: 'Хочу прочитать' }))
    await user.type(screen.getByLabelText('Поиск книг'), 'гамма')
    expect(screen.getAllByTestId(/^book-card-/)).toHaveLength(1)
  })

  it('forwards rating change callback', async () => {
    const onRatingChange = jest.fn()
    const user = userEvent.setup()
    render(<BookShelf books={books} onRatingChange={onRatingChange} />)
    await user.click(screen.getByTestId('star-2-4'))
    expect(onRatingChange).toHaveBeenCalledWith('2', 4)
  })
})