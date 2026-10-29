import { useState } from 'react'

import { WordCard } from './WordCard'
import { WordTable } from './WordTable'

import type { Word } from './WordTable'
import './App.css'

function App() {
  const [words] = useState<Word[]>([
    { id: 1, word: 'apple', translation: 'яблоко', context: 'I ate an apple.', contextTranslation: 'Я съел яблоко.' },
    { id: 2, word: 'dog', translation: 'собака', context: 'The dog is barking.', contextTranslation: 'Собака лает.' },
    { id: 3, word: 'house', translation: 'дом', context: 'This is my house.', contextTranslation: 'Это мой дом.' }
  ])

  const [currentWord] = useState<Word>(words[0])

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#c71585', fontSize: '2.5rem' }}>
        WordTrainer 🌸
      </h1>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Левая колонка - Карточка для изучения */}
        <div style={{ flex: '1 1 300px' }}>
          <WordCard word={currentWord} />
        </div>

        {/* Правая колонка - Таблица карточек */}
        <div style={{ flex: '1.5 1 400px' }}>
          <WordTable words={words} />
          <p style={{ marginTop: '15px', fontSize: '0.9em', color: '#666', fontStyle: 'italic' }}>
            * Нажмите на строку в таблице, чтобы увидеть контекст.
          </p>
        </div>
        
      </div>
    </div>
  )
}

export default App