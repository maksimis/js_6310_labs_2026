import { fireEvent, render, screen } from '@testing-library/react'

import { ReviewCard } from './ReviewCard'

import type { ReviewCardProps } from './ReviewCard'

const props: ReviewCardProps = {
  author: 'Анна',
  text: 'Полезный сервис',
  date: '2026-10-27',
  rating: 4,
  helpfulCount: 3,
  unhelpfulCount: 1,
  reaction: null,
  onReaction: jest.fn(),
}

describe('ReviewCard', () => {
  test('показывает автора, текст, дату и рейтинг', () => {
    render(<ReviewCard {...props} />)

    expect(screen.getByRole('heading', { name: 'Анна' }))
      .toBeInTheDocument()
    expect(screen.getByText('Полезный сервис'))
      .toBeInTheDocument()
    expect(screen.getByText('27 октября 2026 г.'))
      .toHaveAttribute('datetime', '2026-10-27')
    expect(screen.getByRole('img', { name: 'Рейтинг: 4 из 5' }))
      .toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Полезно 3/ }))
      .toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Нет 1' }))
      .toHaveAttribute('aria-pressed', 'false')
  })

  test('передаёт обе реакции через колбэк', () => {
    const onReaction = jest.fn()

    render(<ReviewCard {...props} onReaction={onReaction} />)
    fireEvent.click(screen.getByRole('button', { name: /Полезно 3/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Нет 1' }))

    expect(onReaction.mock.calls).toEqual([
      ['helpful'],
      ['unhelpful'],
    ])
  })

  test('отражает выбранную реакцию из props', () => {
    const { rerender } = render(
      <ReviewCard {...props} reaction="helpful" />,
    )

    expect(screen.getByRole('button', { name: /Полезно 3/ }))
      .toHaveAttribute('aria-pressed', 'true')

    rerender(<ReviewCard {...props} reaction="unhelpful" />)

    expect(screen.getByRole('button', { name: /Полезно 3/ }))
      .toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Нет 1' }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  test.each([
    [NaN, 0],
    [-2, 0],
    [9, 5],
    [3.6, 4],
  ])('нормализует рейтинг %s', (rating, expected) => {
    render(<ReviewCard {...props} rating={rating} />)

    expect(screen.getByRole('img', {
      name: `Рейтинг: ${expected} из 5`,
    })).toBeInTheDocument()
  })

  test('не падает при неверной дате', () => {
    render(<ReviewCard {...props} date="invalid" />)

    expect(screen.getByText('Дата не указана')).toBeInTheDocument()
  })
})