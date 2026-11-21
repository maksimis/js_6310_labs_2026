import { useState } from 'react'

export interface Word {
  id: number;
  word: string;
  translation: string;
  context: string;
  contextTranslation: string;
}

interface WordTableProps {
  words: Word[];
}

export function WordTable({ words }: WordTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const toggleRow = (id: number) => {
    setSelectedId(selectedId === id ? null : id)
  }

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>Таблица карточек</h2>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(199, 21, 133, 0.1)' /* Легкая розовая тень */
      }}>
        <thead>
          <tr style={{ backgroundColor: '#ffb6c1', color: '#fff' }}>
            <th style={{ padding: '15px' }}>Слово</th>
            <th style={{ padding: '15px' }}>Перевод</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr 
              key={word.id} 
              onClick={() => toggleRow(word.id)}
              style={{ 
                borderBottom: '1px solid #ffc0cb', 
                cursor: 'pointer',
                backgroundColor: selectedId === word.id ? '#fff5f7' : 'transparent'
              }}
            >
              <td style={{ padding: '15px', color: '#333' }}>
                <strong>{word.word}</strong>
                {/* Если строка выбрана, показываем подробности */}
                {selectedId === word.id && (
                  <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#555', fontWeight: 'normal' }}>
                    <em>Контекст:</em> {word.context}<br />
                    <em>Перевод:</em> {word.contextTranslation}
                  </div>
                )}
              </td>
              <td style={{ padding: '15px', color: '#333' }}>{word.translation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}