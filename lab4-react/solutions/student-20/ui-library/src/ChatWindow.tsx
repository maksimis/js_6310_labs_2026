import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactElement } from 'react'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

export interface ChatWindowProps {
  messages: readonly ChatMessage[]
  onSend: (text: string) => void
  isTyping?: boolean
}

export function ChatWindow({ messages, onSend, isTyping = false }: ChatWindowProps): ReactElement {
  const [draft, setDraft] = useState<string>('')
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const log = logRef.current

    if (log) {
      log.scrollTop = log.scrollHeight
    }
  }, [messages, isTyping])

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    const text = draft.trim()

    if (!text || isTyping) {
      return
    }

    onSend(text)
    setDraft('')
  }

  return (
    <section className="chat-window" aria-label="Окно чата">
      <header className="chat-top">
        <h2 className="chat-heading">Диалог с заметками</h2>
        <span className="chat-status">Локальное демо</span>
      </header>
      <div className="chat-log" ref={logRef} role="log" aria-label="Сообщения" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat-empty">
            <strong>Задайте первый вопрос</strong>
            <p>Ответ появится здесь вместе с найденными источниками.</p>
          </div>
        )}
        {messages.map((message: ChatMessage) => (
          <article className={`chat-message chat-message--${message.role}`} key={message.id}>
            <span className="chat-author">{message.role === 'user' ? 'Вы' : 'Ассистент'}</span>
            <p className="chat-text">{message.text}</p>
          </article>
        ))}
        {isTyping && (
          <div className="chat-typing" role="status">
            <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
            Ассистент печатает…
          </div>
        )}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <label className="chat-label">
          <span className="chat-input-label">Сообщение</span>
          <input
            className="chat-input"
            placeholder="Например: чем state отличается от props?"
            value={draft}
            maxLength={1000}
            disabled={isTyping}
            onChange={(event): void => setDraft(event.target.value)}
          />
        </label>
        <button className="chat-send" type="submit" disabled={isTyping || !draft.trim()}>Отправить</button>
      </form>
    </section>
  )
}
