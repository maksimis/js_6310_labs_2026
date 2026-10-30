import { fireEvent, render, screen, within } from '@testing-library/react'

import App from './App'

describe('Демонстрация компонентов', () => {
  test('показывает отзывы и голосование', () => {
    render(<App />)

    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByRole('heading', {
      name: 'Что добавить следующим?',
    })).toBeInTheDocument()
  })

  test('ставит, снимает и переключает реакцию независимо для каждого отзыва', () => {
    render(<App />)

    const anna = within(screen.getByRole('article', {
      name: 'Отзыв: Анна Смирнова',
    }))
    const mikhail = within(screen.getByRole('article', {
      name: 'Отзыв: Михаил Волков',
    }))

    fireEvent.click(anna.getByRole('button', { name: /Полезно 24/ }))

    expect(anna.getByRole('button', { name: /Полезно 25/ }))
      .toHaveAttribute('aria-pressed', 'true')
    expect(mikhail.getByRole('button', { name: /Полезно 18/ }))
      .toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(anna.getByRole('button', { name: /Полезно 25/ }))

    expect(anna.getByRole('button', { name: /Полезно 24/ }))
      .toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(anna.getByRole('button', { name: /Полезно 24/ }))
    fireEvent.click(anna.getByRole('button', { name: 'Нет 1' }))

    expect(anna.getByRole('button', { name: /Полезно 24/ }))
      .toHaveAttribute('aria-pressed', 'false')
    expect(anna.getByRole('button', { name: 'Нет 2' }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  test('учитывает голос один раз и пересчитывает результаты', () => {
    render(<App />)

    const poll = within(screen.getByRole('region', {
      name: 'Что добавить следующим?',
    }))

    fireEvent.click(poll.getByRole('button', { name: /Тёмная тема/ }))

    expect(poll.getByText('Голосов: 49')).toBeInTheDocument()
    expect(poll.getByText('49%')).toBeInTheDocument()
    expect(poll.getByText('101')).toBeInTheDocument()
    expect(poll.getByText('Ваш голос учтён ✓')).toBeInTheDocument()

    fireEvent.click(poll.getByRole('button', {
      name: /Настройка профиля/,
    }))

    expect(poll.getByText('Голосов: 20')).toBeInTheDocument()
    expect(poll.getByText('101')).toBeInTheDocument()
    expect(poll.getAllByRole('button').every(
      (button) => button.hasAttribute('disabled'),
    )).toBe(true)
  })
})