import { useState } from 'react'

import type { Question } from '../types'

import './QuestionCard.css'

interface QuestionCardProps {
  question: Question
  onAnswer?: (optionId: string, isCorrect: boolean) => void
}

type AnswerState = 'idle' | 'correct' | 'wrong'

const QuestionCard = ({ question, onAnswer }: QuestionCardProps): React.ReactElement => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [state, setState] = useState<AnswerState>('idle')

  const handleSelect = (optionId: string): void => {
    if (state !== 'idle') return

    const isCorrect = optionId === question.correctOptionId

    setSelectedId(optionId)
    setState(isCorrect ? 'correct' : 'wrong')
    onAnswer?.(optionId, isCorrect)
  }

  const getOptionClass = (optionId: string): string => {
    if (state === 'idle') return 'option'

    if (optionId === question.correctOptionId) return 'option option--correct'

    if (optionId === selectedId) return 'option option--wrong'

    return 'option option--disabled'
  }

  return (
    <div className="question-card" data-testid="question-card">
      <h2 className="question-card__title">{question.text}</h2>
      <ul className="question-card__options">
        {question.options.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className={getOptionClass(option.id)}
              onClick={() => handleSelect(option.id)}
              disabled={state !== 'idle'}
              data-testid={`option-${option.id}`}
            >
              {option.text}
            </button>
          </li>
        ))}
      </ul>
      {state !== 'idle' && (
        <p
          className={
            state === 'correct'
              ? 'question-card__result question-card__result--correct'
              : 'question-card__result question-card__result--wrong'
          }
          data-testid="result-message"
        >
          {state === 'correct' ? 'Правильно!' : 'Неправильно'}
        </p>
      )}
    </div>
  )
}

export default QuestionCard