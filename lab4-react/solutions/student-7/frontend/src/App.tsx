import { useState, useEffect } from 'react'

import { SignalPanel, ProgressIndicator } from '@my-app/ui-library'

import type { SignalColor } from '@my-app/ui-library'
import './App.css'

const COLORS: SignalColor[] = ['red', 'green', 'blue', 'yellow']

export default function App() {
  const [sequence, setSequence] = useState<SignalColor[]>([])
  const [userSequence, setUserSequence] = useState<SignalColor[]>([])
  const [isShowing, setIsShowing] = useState(false)
  const [activeColor, setActiveColor] = useState<SignalColor | null>(null)
  const [level, setLevel] = useState(1)
  const [record, setRecord] = useState(0)
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'gameover'>('idle')

  // Генерация случайного цвета
  const getRandomColor = (): SignalColor => {
    return COLORS[Math.floor(Math.random() * COLORS.length)]
  }

  // Воспроизведение последовательности с подсветкой
  useEffect(() => {
    if (isShowing && sequence.length > 0) {
      let i = 0
      const interval = setInterval(() => {
        setActiveColor(sequence[i])
        
        // Убираем подсветку через 300мс
        setTimeout(() => setActiveColor(null), 300)
        
        i++

        if (i >= sequence.length) {
          clearInterval(interval)
          setTimeout(() => setIsShowing(false), 400) // Ждем, пока погаснет последний цвет
        }
      }, 600) // Пауза между цветами

      return () => clearInterval(interval)
    }
  }, [isShowing, sequence])

  // Старт игры
  const startGame = () => {
    const newSequence = [getRandomColor()]

    setSequence(newSequence)
    setUserSequence([])
    setLevel(1)
    setGameStatus('playing')
    setIsShowing(true)
  }

  // Клик по цветной кнопке
  const handleColorClick = (color: SignalColor) => {
    if (isShowing || gameStatus !== 'playing') return // Блокировка во время показа

    const newUserSeq = [...userSequence, color]
    
    // Проверяем текущий шаг
    const currentStepIndex = newUserSeq.length - 1

    if (color !== sequence[currentStepIndex]) {
      // Ошибка
      setGameStatus('gameover')
      setRecord(Math.max(record, sequence.length - 1))

      return
    }

    setUserSequence(newUserSeq)

    // Если пользователь прошел всю последовательность
    if (newUserSeq.length === sequence.length) {
      setTimeout(() => {
        setLevel(prev => prev + 1)
        const nextSequence = [...sequence, getRandomColor()]

        setSequence(nextSequence)
        setUserSequence([])
        setIsShowing(true)
      }, 1000)
    }
  }

  return (
    <div className="game-container">
      <h1>Simon Says</h1>
      
      <ProgressIndicator 
        level={level} 
        sequenceLength={sequence.length} 
        record={record} 
      />

      <div className="status-text">
        {gameStatus === 'idle' && 'Нажми "Начать игру", чтобы играть'}
        {gameStatus === 'playing' && (isShowing ? 'Смотри и запоминай!' : 'Твой ход!')}
        {gameStatus === 'gameover' && 'Игра окончена! Нажми "Начать игру", чтобы попробовать снова'}
      </div>

      <SignalPanel
        activeColor={activeColor}
        disabled={isShowing || gameStatus !== 'playing'}
        onColorClick={handleColorClick}
      />

      {(gameStatus === 'idle' || gameStatus === 'gameover') && (
        <button className="start-btn" onClick={startGame}>
          {gameStatus === 'idle' ? 'Начать игру' : 'Играть снова'}
        </button>
      )}
    </div>
  )
}