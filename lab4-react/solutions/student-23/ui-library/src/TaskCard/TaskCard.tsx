import React, { useState } from 'react'
import './TaskCard.css'

export interface TaskCardProps {
  condition: string
  correctAnswer: string | number
  options?: string[]
  onCheck: (isCorrect: boolean, answer: string) => void
}

export const TaskCard: React.FC<TaskCardProps> = ({
  condition,
  correctAnswer,
  options,
  onCheck
}) => {
  const [answer, setAnswer] = useState('')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    
    // Логика для тестов (варианты ответов)
    if (options && selectedOption !== null) {
      const correctLetter = String.fromCharCode(65 + Number(correctAnswer))
      const correctIndex = String(Number(correctAnswer) + 1)
      const answerLetter = String.fromCharCode(65 + selectedOption)
      const answerIndex = String(selectedOption + 1)
      
      const isCorrect = answerLetter === correctLetter || answerIndex === correctIndex
      onCheck(isCorrect, options[selectedOption])
      return
    }

    // Логика для текстового поля (ТЕПЕРЬ ОНА ПРАВИЛЬНАЯ!)
    if (answer.trim() === '') return
    
    const isCorrect =
      answer.trim().toLowerCase() === String(correctAnswer).toLowerCase()
    
    onCheck(isCorrect, answer) 
  }

  return (
    <div className="task-card">
      <h2 className="task-card__title">Задание</h2>
      <p className="task-card__condition">{condition}</p>
      
      <form className="task-card__form" onSubmit={handleSubmit}>
        {options ? (
          <div className="task-card__options">
            {options.map((opt, index) => (
              <label key={opt} className="task-card__option-label">
                <input
                  type="radio"
                  name="task-option"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                />
                {String.fromCharCode(65 + index)}. {opt}
              </label>
            ))}
          </div>
        ) : (
          <>
            <label className="task-card__label" htmlFor="answer-input">
              Ваш ответ:
            </label>
            <input
              id="answer-input"
              className="task-card__input"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Введите ответ..."
              aria-label="Поле ввода ответа"
            />
          </>
        )}

        <button
          className="task-card__button"
          type="submit"
          disabled={options ? selectedOption === null : answer.trim() === ''}
        >
          Проверить
        </button>
      </form>
    </div>
  )
}