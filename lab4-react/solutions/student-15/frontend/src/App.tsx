import { useState } from 'react'

import { Button, Card, ParticipantsPanel, ShoppingList } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import type { Participant, ShoppingItem } from '@my-app/ui-library'

import './App.css'

const initialItems: ShoppingItem[] = [
  { id: '1', name: 'Молоко', category: 'Молочные продукты', checked: false },
  { id: '2', name: 'Сыр', category: 'Молочные продукты', checked: true },
  { id: '3', name: 'Хлеб', category: 'Выпечка', checked: false },
  { id: '4', name: 'Яблоки', category: 'Фрукты и овощи', checked: false },
  { id: '5', name: 'Помидоры', category: 'Фрукты и овощи', checked: true },
  { id: '6', name: 'Стиральный порошок', category: 'Бытовые товары', checked: false },
]

const initialParticipants: Participant[] = [
  { id: '1', name: 'Анна', online: true },
  { id: '2', name: 'Пётр', online: false },
  { id: '3', name: 'Ирина', online: true },
  { id: '4', name: 'Олег', online: false },
]

function App() {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems)
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(() => Date.now())

  const checkedCount = items.filter((item) => item.checked).length
  const onlineCount = participants.filter((participant) => participant.online).length

  const handleSync = (): void => {
    setLastUpdatedAt(Date.now())
  }

  const handleToggleParticipant = (id: string): void => {
    setParticipants((prev) => prev.map((participant) => (
      participant.id === id ? { ...participant, online: !participant.online } : participant
    )))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Совместный список покупок</h1>
        <p>Демонстрация компонентов ShoppingList и ParticipantsPanel</p>
      </header>

      <main className="app-main">
        <section className="section">
          <ShoppingList items={items} onChange={setItems} />
        </section>

        <section className="section">
          <div className="panel-grid">
            <ParticipantsPanel participants={participants} lastUpdatedAt={lastUpdatedAt} />

            <Card title="Управление синхронизацией">
              <div className="controls">
                <Button variant="primary" onClick={handleSync}>
                  Обновить синхронизацию
                </Button>
                {participants.map((participant) => (
                  <Button
                    key={participant.id}
                    size="small"
                    variant={participant.online ? 'secondary' : 'primary'}
                    onClick={() => handleToggleParticipant(participant.id)}
                  >
                    {participant.online ? `Скрыть ${participant.name}` : `Показать ${participant.name}`}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="section">
          <h2>Сводка</h2>
          <div className="summary">
            <Card title="Покупки">
              <p className="summary-value">
                {checkedCount} / {items.length}
              </p>
              <p className="summary-hint">позиций куплено</p>
            </Card>

            <Card title="Участники">
              <p className="summary-value">
                {onlineCount} / {participants.length}
              </p>
              <p className="summary-hint">участников онлайн</p>
            </Card>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <Card>
          <div className="footer-content">
            <p>UI Library v1.0.0 — демонстрационное приложение</p>
            <p>React + TypeScript + Vite + Jest</p>
          </div>
        </Card>
      </footer>
    </div>
  )
}

export default App
