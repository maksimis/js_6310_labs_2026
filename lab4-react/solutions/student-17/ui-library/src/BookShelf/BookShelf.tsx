import { useMemo, useState } from 'react'
import type { JSX } from 'react'
import type { Book, ReadingStatus } from '../types'
import { BookCard } from '../BookCard/BookCard'
import { Button } from '../Button/Button'
import styles from './BookShelf.module.css'

export interface BookShelfProps {
  books: Book[]
  onRatingChange?: (bookId: string, rating: number) => void
  onStatusChange?: (bookId: string, status: ReadingStatus) => void
}

type FilterValue = ReadingStatus | 'all'

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'read', label: 'Прочитано' },
  { value: 'reading', label: 'Читаю' },
  { value: 'want', label: 'Хочу прочитать' },
]

export function BookShelf({
  books,
  onRatingChange,
  onStatusChange,
}: BookShelfProps): JSX.Element {
  const [filter, setFilter] = useState<FilterValue>('all')
  const [query, setQuery] = useState<string>('')

  const visibleBooks = useMemo<Book[]>(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return books.filter((book) => {
      const matchesStatus = filter === 'all' || book.status === filter
      const matchesQuery =
        normalizedQuery.length === 0 ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery)
      return matchesStatus && matchesQuery
    })
  }, [books, filter, query])

  return (
    <section className={styles.shelf}>
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="search"
          placeholder="Поиск по названию или автору"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск книг"
        />
        <div className={styles.filters} role="tablist">
          {FILTERS.map((item) => (
            <Button
              key={item.value}
              role="tab"
              aria-selected={filter === item.value}
              isActive={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {visibleBooks.length === 0 ? (
        <p className={styles.empty} data-testid="empty-state">
          Книги не найдены
        </p>
      ) : (
        <div className={styles.grid} data-testid="book-grid">
          {visibleBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onRatingChange={onRatingChange}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </section>
  )
}