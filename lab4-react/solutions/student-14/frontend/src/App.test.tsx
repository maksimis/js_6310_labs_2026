import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

describe('App Integration', () => {
  test('does not allow editing initial cells', () => {
    const { container } = render(<App />)
    
    const cells = container.querySelectorAll('[class*="cell"]')
    
    // Кликаем по ячейке (0,0), где стоит 5 и isInitial: true
    fireEvent.click(cells[0])
    
    // Пытаемся ввести 9
    fireEvent.click(screen.getByText('9'))
    
    // В ячейке (0,0) должна остаться 5, а 9 не должна появиться в сетке (только на кнопке)
    const grid = container.querySelector('[class*="grid"]')

    expect(grid?.textContent).toContain('5')
    
    const nines = screen.getAllByText('9')

    expect(nines.length).toBe(1) // Только на кнопке панели
  })

  test('allows adding and removing notes', () => {
    const { container } = render(<App />)
    
    const cells = container.querySelectorAll('[class*="cell"]')
    const testCell = cells[2] // Выбираем третью ячейку
    
    // Кликаем по ней
    fireEvent.click(testCell)
    
    // Переключаем режим на "Заметка"
    fireEvent.click(screen.getByText('Заметка'))
    
    // Добавляем заметку 1
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    
    // Проверяем, что в этой ячейке появился span с текстом 1
    expect(testCell.querySelector('[class*="note"]')?.textContent).toContain('1')
    
    // Добавляем заметку 2
    fireEvent.click(screen.getByRole('button', { name: '2' }))
    
    // Проверяем, что в ячейке теперь и 1, и 2
    const notesAfterAdd = testCell.querySelectorAll('[class*="note"]')
    const notesText = Array.from(notesAfterAdd).map(n => n.textContent).join('')

    expect(notesText).toContain('12')
    
    // Удаляем заметку 1 (повторный клик по кнопке)
    fireEvent.click(screen.getByRole('button', { name: '1' }))
    
    // Проверяем, что в ячейке осталась только 2
    const notesAfterRemove = testCell.querySelectorAll('[class*="note"]')
    const notesTextAfter = Array.from(notesAfterRemove).map(n => n.textContent).join('')

    expect(notesTextAfter).not.toContain('1')
    expect(notesTextAfter).toContain('2')
  })

  test('does not allow notes in cells with values', () => {
    const { container } = render(<App />)
    
    const cells = container.querySelectorAll('[class*="cell"]')
    
    // Выбираем пустую ячейку и ставим туда значение 3
    fireEvent.click(cells[1])
    fireEvent.click(screen.getByText('3'))
    
    // Переключаем режим на "Заметку"
    fireEvent.click(screen.getByText('Заметка'))
    
    // Пытаемся добавить заметку 4
    fireEvent.click(screen.getByText('4'))
    
    // В сетке должна быть 3, но не должно быть заметки 4
    const grid = container.querySelector('[class*="grid"]')

    expect(grid?.textContent).toContain('3')
    
    // На панели кнопка 4 есть, но в сетке её нет
    expect(grid?.textContent).not.toContain('4')
  })

  test('renders sudoku grid and candidate panel', () => {
    const { container } = render(<App />)
    
    // Проверяем заголовок
    expect(screen.getByText('Sudoku App')).toBeInTheDocument()
    
    // Проверяем, что панель кандидатов отрендерилась
    expect(screen.getByText('Значение')).toBeInTheDocument()
    expect(screen.getByText('Заметка')).toBeInTheDocument()
    
    // Проверяем, что сетка отрендерилась (ищем цифру 5 конкретно в сетке, а не на кнопке)
    // Используем querySelector внутри контейнера сетки
    const grid = container.querySelector('[class*="grid"]')

    expect(grid).toBeInTheDocument()
    expect(grid?.textContent).toContain('5')
  })

  test('allows selecting a cell and entering a value', () => {
    const { container } = render(<App />)
    
    const cells = container.querySelectorAll('[class*="cell"]')
    
    // Кликаем по пустой ячейке
    fireEvent.click(cells[1])
    
    // Выбираем цифру 7 на панели
    fireEvent.click(screen.getByText('7'))
    
    // Проверяем, что 7 появилась на поле (всего на странице теперь две семерки: на кнопке и в ячейке)
    const sevens = screen.getAllByText('7')

    expect(sevens.length).toBe(2) 
  })

  test('allows erasing a value', () => {
    const { container } = render(<App />)
    
    const cells = container.querySelectorAll('[class*="cell"]')
    
    // Ставим 7 в ячейку
    fireEvent.click(cells[1])
    fireEvent.click(screen.getByText('7'))
    
    // Стираем
    fireEvent.click(screen.getByText('Стереть'))
    
    // Проверяем, что 7 осталась только на кнопке (одна штука)
    const sevens = screen.getAllByText('7')

    expect(sevens.length).toBe(1)
  })
})