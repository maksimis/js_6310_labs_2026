import { useEffect, useRef, useState, type ReactElement } from 'react'

import { ChatWindow, SourcesPanel } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import { answerQuestion, notes } from './knowledge'

import type { ChatMessage, SourceFragment } from '@my-app/ui-library'

const greeting: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Привет! Здесь собраны короткие заметки о React. Задайте вопрос — я найду подходящие фрагменты, а рядом покажу источники. Начнём со state, props или эффектов?',
}

export default function App(): ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting])
  const [sources, setSources] = useState<SourceFragment[]>([])
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const timerRef = useRef<number | null>(null)
  const nextId = useRef<number>(0)

  useEffect(() => (): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }
  }, [])

  function sendMessage(text: string): void {
    if (timerRef.current !== null || !text.trim()) {
      return
    }

    const question = text.trim()

    nextId.current += 1
    const id = nextId.current

    setMessages((previous: ChatMessage[]): ChatMessage[] => [...previous, { id: `user-${id}`, role: 'user', text: question }])
    setIsTyping(true)
    setSources([])
    timerRef.current = window.setTimeout((): void => {
      const answer = answerQuestion(question)

      setMessages((previous: ChatMessage[]): ChatMessage[] => [...previous, { id: `assistant-${id}`, role: 'assistant', text: answer.text }])
      setSources(answer.sources)
      setIsTyping(false)
      timerRef.current = null
    }, 700)
  }

  function resetChat(): void {
    setMessages([greeting])
    setSources([])
  }

  return (
    <div className="app-shell" id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Контекст — к началу"><span className="brand-mark" aria-hidden="true">К</span>контекст<span className="brand-dot">.</span></a>
        <span className="edition">Лабораторная 04 <span>/</span> React + TypeScript</span>
        <a className="library-link" href="#notebook">Открыть заметки <span aria-hidden="true">↙</span></a>
      </header>
      <main>
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">МАЛЕНЬКАЯ БАЗА ЗНАНИЙ / БОЛЬШЕ ЯСНОСТИ</p>
          <h1 id="page-title">У каждого ответа<br />есть <em>контекст.</em></h1>
          <p className="intro-text">Спрашивайте о React. Читайте ответ.<br />Возвращайтесь к источнику — и разбирайтесь глубже.</p>
          <div className="intro-note"><span aria-hidden="true">✳</span><p>Три заметки. Один диалог.<br /><strong>Всё работает локально.</strong></p></div>
        </section>
        <div className="workspace-label"><span>01 — РАБОЧИЙ СТОЛ</span><button type="button" onClick={resetChat} disabled={isTyping}>Очистить диалог <span aria-hidden="true">↺</span></button></div>
        <div className="workspace">
          <div className="chat-card"><ChatWindow messages={messages} onSend={sendMessage} isTyping={isTyping} /></div>
          <div className="sources-card"><SourcesPanel sources={sources} /></div>
        </div>
        <div className="suggestions" aria-label="Примеры вопросов">
          <span>Попробуйте:</span>
          {['Чем state отличается от props?', 'Зачем очищать таймер в useEffect?'].map((question: string) => (
            <button type="button" key={question} onClick={(): void => sendMessage(question)} disabled={isTyping}>{question} <span aria-hidden="true">↗</span></button>
          ))}
        </div>
        <section className="notebook" id="notebook" aria-labelledby="notebook-title">
          <div className="notebook-header"><div><p className="eyebrow">02 — ПЕРВОИСТОЧНИКИ</p><h2 id="notebook-title">На полях React</h2></div><p>Авторские учебные заметки.<br />Нажмите на источник в панели, чтобы перейти к тексту.</p></div>
          <div className="notes-grid">
            {notes.map((note, index: number) => (
              <article className="note" key={note.id} id={`document-${note.id}`} tabIndex={-1}>
                <span className="note-number">0{index + 1}</span>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
                <a href="#top">Вернуться к диалогу ↑</a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer"><span>Контекст / учебный проект №20</span><span>Локальный поиск по словам · без подключения к языковой модели</span></footer>
    </div>
  )
}
