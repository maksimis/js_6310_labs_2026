import type { JSX } from 'react'

export interface VotingOption {
    id: string
    label: string
    votes: number
}

export interface VotingProps {
    title: string
    options: readonly VotingOption[]
    selectedId: string | null
    onVote: (id: string) => void
    disabled?: boolean
}

const validVotes = (votes: number): number => (
  Number.isFinite(votes) ? Math.max(0, votes) : 0
)

export function Voting({
  title,
  options,
  selectedId,
  onVote,
  disabled = false,
}: VotingProps): JSX.Element {
  const total = options.reduce(
    (sum, option) => sum + validVotes(option.votes),
    0,
  )

  return (
    <section className="voting-card" aria-label={title}>
      <div className="voting-eyebrow">
        <span className="live-dot" />
                ВОПРОС СООБЩЕСТВУ
      </div>

      <h2>{title}</h2>

      <p className="voting-description">
                Выберите один вариант — каждый голос важен.
      </p>

      {options.length === 0 ? (
        <p role="status">Варианты пока не добавлены.</p>
      ) : (
        <div className="voting-options">
          {options.map((option) => {
            const votes = validVotes(option.votes)
            const percent = total === 0
              ? 0
              : Math.round(votes / total * 100)
            const selected = selectedId === option.id

            return (
              <button
                type="button"
                className="voting-option"
                key={option.id}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => onVote(option.id)}
              >
                <span className="voting-option-top">
                  <span className="voting-option-label">
                    <span className="vote-radio" aria-hidden="true">
                      {selected ? '✓' : ''}
                    </span>
                    {option.label}
                  </span>

                  <strong>{percent}%</strong>
                </span>

                <span className="vote-track" aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </span>

                <span className="vote-count">
                  Голосов: {votes}
                </span>
              </button>
            )
          })}
        </div>
      )}

      <footer className="voting-footer" aria-live="polite">
        <span>
          Всего голосов: <strong>{total}</strong>
        </span>

        <span>
          {selectedId === null
            ? 'Ваш выбор впереди'
            : 'Ваш голос учтён ✓'}
        </span>
      </footer>
    </section>
  )
}