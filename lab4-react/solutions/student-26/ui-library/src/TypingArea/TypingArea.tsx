import type { KeyboardEvent } from 'react'

import styles from './TypingArea.module.css'

export interface TypingAreaProps {
    sampleText: string
    typedText: string
    onTextChange: (text: string) => void
    disabled?: boolean
}

export const TypingArea = ({
  sampleText,
  typedText,
  onTextChange,
  disabled = false,
}: TypingAreaProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const sampleChars = Array.from(sampleText)
  const typedChars = Array.from(typedText)

  return (
    <div className={styles.typingArea}>
      <div className={styles.sampleText} aria-label="Текст-образец">
        {sampleChars.map((char, index) => {
          const typedChar = typedChars[index]
          let className = styles.pending

          if (typedChar !== undefined) {
            className = typedChar === char ? styles.correct : styles.incorrect
          }

          return (
            <span
              className={className}
              key={`${index}-${char}`}
              data-testid={`char-${index}`}
            >
              {char === ' ' ? '\u00a0' : char}
            </span>
          )
        })}

        <span
          className={styles.cursor}
          data-testid="typing-cursor"
          aria-label="Текущая позиция"
          style={{
            display: 'none',
          }}
        />
      </div>

      <label className={styles.inputLabel} htmlFor="typing-input">
                Введите текст здесь
      </label>

      <textarea
        id="typing-input"
        className={styles.input}
        value={typedText}
        onChange={event => onTextChange(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Начните печатать..."
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}