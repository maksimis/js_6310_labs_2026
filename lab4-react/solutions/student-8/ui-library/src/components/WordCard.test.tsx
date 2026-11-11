import { render, screen, fireEvent } from '@testing-library/react'

import { WordCard } from './WordCard'

describe('WordCard', () => {
  const word = { id: 1, word: 'apple', translation: 'яблоко', context: 'I ate an apple', contextTranslation: 'Я съел яблоко' }

  test('переворачивает карточку', () => {
    render(<WordCard word={word} />)
    fireEvent.click(screen.getByText(/Показать перевод/i))
    expect(screen.getByText(/Скрыть перевод/i)).toBeInTheDocument()
  })

  test('скрывает перевод при повторном клике', () => {
    render(<WordCard word={word} />)
    
    // Показываем перевод
    fireEvent.click(screen.getByText(/Показать перевод/i))
    
    // Теперь скрываем его
    fireEvent.click(screen.getByText(/Скрыть перевод/i))
    
    // Проверяем, что снова появилась кнопка "Показать перевод"
    expect(screen.getByText(/Показать перевод/i)).toBeInTheDocument()
  })
})