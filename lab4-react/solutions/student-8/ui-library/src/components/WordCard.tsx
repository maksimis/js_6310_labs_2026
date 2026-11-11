import { useState } from 'react'

import type { Word } from './WordTable'

interface WordCardProps {
  word: Word;
}

export function WordCard({ word }: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>Карточка для изучения</h2>
      <div 
        style={{
          border: '2px solid #ffb6c1',
          borderRadius: '12px',
          padding: '30px 20px',
          backgroundColor: isFlipped ? '#fff0f5' : '#fff',
          boxShadow: '0 4px 15px rgba(199, 21, 133, 0.1)',
          transition: 'all 0.3s ease',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {!isFlipped ? (
          <div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '28px', color: '#c71585' }}>{word.word}</h3>
            <p style={{ fontStyle: 'italic', color: '#666', fontSize: '18px' }}>"{word.context}"</p>
            <button 
              onClick={() => setIsFlipped(true)}
              style={{ 
                marginTop: '20px', 
                padding: '10px 25px', 
                cursor: 'pointer',
                backgroundColor: '#c71585',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px'
              }}
            >
              Показать перевод
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '28px', color: '#c71585' }}>{word.translation}</h3>
            <p style={{ color: '#444', fontSize: '18px' }}>"{word.contextTranslation}"</p>
            <button 
              onClick={() => setIsFlipped(false)}
              style={{ 
                marginTop: '20px', 
                padding: '10px 25px', 
                cursor: 'pointer',
                backgroundColor: '#fff',
                color: '#c71585',
                border: '2px solid #c71585',
                borderRadius: '20px',
                fontSize: '16px'
              }}
            >
              Скрыть перевод
            </button>
          </div>
        )}
      </div>
    </div>
  )
}