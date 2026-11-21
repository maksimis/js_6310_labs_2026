import { useState } from 'react'
import type { JSX } from 'react'
import { Card } from '../Card/Card'
import type { Book, ReadingStatus } from '../types'
import styles from './BookCard.module.css'

export interface BookCardProps {
  book: Book
  onRatingChange?: (bookId: string, rating: number) => void
  onStatusChange?: (bookId: string, status: ReadingStatus) => void
}

const STATUS_LABELS: Record<ReadingStatus, string> = {
  read: 'Прочитано',
  reading: 'Читаю',
  want: 'Хочу прочитать',
}

export function BookCard({
  book,
  onRatingChange,
  onStatusChange,
}: BookCardProps): JSX.Element {
  const [hovered, setHovered] = useState<number>(0)

  const handleStarClick = (value: number): void => {
    if (onRatingChange) {
      const newRating = book.rating === value ? 0 : value
      onRatingChange(book.id, newRating)
    }
  }

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void => {
    if (onStatusChange) {
      onStatusChange(book.id, event.target.value as ReadingStatus)
    }
  }

  return (
    <Card>
      <article data-testid={`book-card-${book.id}`}>
        <img
          className={styles.cover}
          src={book.cover}
          alt={`Обложка ${book.title}`}
        />
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>

        <select
          className={styles.statusSelect}
          value={book.status}
          onChange={handleStatusChange}
          aria-label="Статус чтения"
          data-testid={`status-select-${book.id}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div
          className={styles.rating}
          role="radiogroup"
          aria-label="Рейтинг книги"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = (hovered || book.rating) >= star
            return (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${active ? styles.starActive : ''}`}
                aria-label={`Поставить ${star} из 5`}
                aria-checked={book.rating === star}
                role="radio"
                onMouseEnter={() => setHovered(star)}
                onClick={() => handleStarClick(star)}
                data-testid={`star-${book.id}-${star}`}
              >
                ★
              </button>
            )
          })}
        </div>
      </article>
    </Card>
  )
}