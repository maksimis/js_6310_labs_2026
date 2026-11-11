import { fireEvent, render, screen } from '@testing-library/react'

import { Voting } from './Voting'

import type { VotingProps } from './Voting'

const props: VotingProps = {
  title: 'Что добавить?',
  selectedId: null,
  onVote: jest.fn(),
  options: [
    { id: 'a', label: 'Тема', votes: 3 },
    { id: 'b', label: 'Профиль', votes: 1 },
  ],
}

describe('Voting', () => {
  test('показывает количества, проценты и итог', () => {
    render(<Voting {...props} />)

    expect(screen.getByRole('heading', { name: props.title }))
      .toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('Голосов: 3')).toBeInTheDocument()
    expect(screen.getByText('Голосов: 1')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('Ваш выбор впереди')).toBeInTheDocument()
  })

  test('передаёт идентификатор выбранного варианта', () => {
    const onVote = jest.fn()

    render(<Voting {...props} onVote={onVote} />)
    fireEvent.click(screen.getByRole('button', { name: /Профиль/ }))

    expect(onVote).toHaveBeenCalledWith('b')
    expect(onVote).toHaveBeenCalledTimes(1)
  })

  test('показывает выбор и блокирует голосование', () => {
    const onVote = jest.fn()

    render(
      <Voting
        {...props}
        selectedId="a"
        disabled
        onVote={onVote}
      />,
    )

    const button = screen.getByRole('button', { name: /Тема/ })

    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Профиль/ }))
      .toHaveAttribute('aria-pressed', 'false')
    expect(button).toBeDisabled()

    fireEvent.click(button)

    expect(onVote).not.toHaveBeenCalled()
    expect(screen.getByText('Ваш голос учтён ✓')).toBeInTheDocument()
  })

  test('при нуле голосов показывает нулевые проценты', () => {
    render(
      <Voting
        {...props}
        options={props.options.map((option) => ({
          ...option,
          votes: 0,
        }))}
      />,
    )

    expect(screen.getAllByText('0%')).toHaveLength(2)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('обрабатывает отрицательные и нечисловые значения', () => {
    render(
      <Voting
        {...props}
        options={[
          { id: 'a', label: 'A', votes: -4 },
          { id: 'b', label: 'B', votes: NaN },
        ]}
      />,
    )

    expect(screen.getAllByText('Голосов: 0')).toHaveLength(2)
    expect(screen.getAllByText('0%')).toHaveLength(2)
  })

  test('обрабатывает отсутствие вариантов', () => {
    render(<Voting {...props} options={[]} />)

    expect(screen.getByRole('status'))
      .toHaveTextContent('Варианты пока не добавлены.')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})