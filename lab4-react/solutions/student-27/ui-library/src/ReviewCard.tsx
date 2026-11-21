import type { JSX } from 'react'

export type Reaction = 'helpful' | 'unhelpful'

export interface ReviewCardProps {
    author: string
    text: string
    date: string
    rating: number
    helpfulCount: number
    unhelpfulCount: number
    reaction: Reaction | null
    onReaction: (reaction: Reaction) => void
}

export function ReviewCard({
  author,
  text,
  date,
  rating,
  helpfulCount,
  unhelpfulCount,
  reaction,
  onReaction,
}: ReviewCardProps): JSX.Element {
  const safeRating = Number.isFinite(rating)
    ? Math.min(5, Math.max(0, Math.round(rating)))
    : 0

  const parsedDate = new Date(date)
  const dateLabel = Number.isNaN(parsedDate.getTime())
    ? 'Дата не указана'
    : new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(parsedDate)

  return (
    <article className="review-card" aria-label={`Отзыв: ${author}`}>
      <header className="review-header">
        <span className="review-avatar" aria-hidden="true">
          {author.slice(0, 1).toUpperCase()}
        </span>

        <div className="review-person">
          <h3>{author}</h3>
          <time dateTime={date}>{dateLabel}</time>
        </div>

        <span
          className="review-rating"
          role="img"
          aria-label={`Рейтинг: ${safeRating} из 5`}
        >
          <span aria-hidden="true">
            {'★'.repeat(safeRating)}
            <span className="empty-stars">
              {'★'.repeat(5 - safeRating)}
            </span>
          </span>
        </span>
      </header>

      <p className="review-text">{text}</p>

      <footer className="review-footer">
        <span>Был ли отзыв полезен?</span>

        <div className="review-reactions">
          <button
            type="button"
            aria-pressed={reaction === 'helpful'}
            onClick={() => onReaction('helpful')}
          >
            <span aria-hidden="true">↗</span>
                        Полезно
            <span>{helpfulCount}</span>
          </button>

          <button
            type="button"
            aria-pressed={reaction === 'unhelpful'}
            onClick={() => onReaction('unhelpful')}
          >
                        Нет
            <span>{unhelpfulCount}</span>
          </button>
        </div>
      </footer>
    </article>
  )
}