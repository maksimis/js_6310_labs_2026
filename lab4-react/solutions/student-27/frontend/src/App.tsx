import { useState } from 'react'
import type { JSX } from 'react'

import { ReviewCard, Voting } from '@my-app/ui-library'

import type { Reaction, VotingOption } from '@my-app/ui-library'

interface Review {
  id: number
  author: string
  text: string
  date: string
  rating: number
  helpful: number
  unhelpful: number
}

const reviews: Review[] = [
  {
    id: 1,
    author: 'Анна Смирнова',
    text: 'Удобное приложение. Всё понятно и просто.',
    date: '2026-10-27',
    rating: 5,
    helpful: 24,
    unhelpful: 1,
  },
  {
    id: 2,
    author: 'Михаил Волков',
    text: 'Приложение понравилось, но хотелось бы добавить тёмную тему.',
    date: '2026-10-26',
    rating: 4,
    helpful: 18,
    unhelpful: 2,
  },
  {
    id: 3,
    author: 'Елена Ким',
    text: 'Голосование работает, результаты сразу обновляются.',
    date: '2026-10-25',
    rating: 5,
    helpful: 12,
    unhelpful: 0,
  },
]

const initialOptions: VotingOption[] = [
  { id: 'dark', label: 'Тёмная тема', votes: 48 },
  { id: 'notifications', label: 'Умные уведомления', votes: 32 },
  { id: 'profile', label: 'Настройка профиля', votes: 20 },
]

function App(): JSX.Element {
  const [reactions, setReactions] = useState<Record<number, Reaction | null>>({})
  const [options, setOptions] = useState<VotingOption[]>(initialOptions)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleReaction = (reviewId: number, reaction: Reaction): void => {
    setReactions((current) => ({
      ...current,
      [reviewId]: current[reviewId] === reaction ? null : reaction,
    }))
  }

  const handleVote = (optionId: string): void => {
    if (selectedId !== null) return

    setOptions((current) => current.map((option) => (
      option.id === optionId
        ? { ...option, votes: option.votes + 1 }
        : option
    )))
    setSelectedId(optionId)
  }

  return (
    <main className="app">
      <h1>Отзывы и голосование</h1>
      <p>Пример использования компонентов библиотеки.</p>

      <section className="reviews">
        <h2>Отзывы пользователей</h2>

        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            author={review.author}
            text={review.text}
            date={review.date}
            rating={review.rating}
            helpfulCount={
              review.helpful
                      + (reactions[review.id] === 'helpful' ? 1 : 0)
            }
            unhelpfulCount={
              review.unhelpful
                      + (reactions[review.id] === 'unhelpful' ? 1 : 0)
            }
            reaction={reactions[review.id] ?? null}
            onReaction={(reaction) => handleReaction(review.id, reaction)}
          />
        ))}
      </section>

      <Voting
        title="Что добавить следующим?"
        options={options}
        selectedId={selectedId}
        onVote={handleVote}
        disabled={selectedId !== null}
      />

      <p className="note">
          Можно выбрать одну реакцию на отзыв и один вариант голосования.
          При обновлении страницы изменения сбрасываются.
      </p>
    </main>
  )
}

export default App