import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('отрисовывает заголовок и стартовое состояние', () => {
    render(<App />)
    
    expect(screen.getByText(/Simon Says/i)).toBeInTheDocument()
    expect(screen.getByText(/Нажми "Начать игру"/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Начать игру/i })).toBeInTheDocument()
  })

  it('начинает игру при нажатии на кнопку "Начать игру"', () => {
    render(<App />)
    
    // Находим кнопку старта и кликаем
    const startBtn = screen.getByRole('button', { name: /Начать игру/i })

    fireEvent.click(startBtn)

    // Проверяем, что статус изменился (включается режим показа)
    expect(screen.queryByText(/Нажми "Начать игру"/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Смотри и запоминай!/i)).toBeInTheDocument()
  })

  it('отрисовывает индикатор прогресса и панель сигналов', () => {
    render(<App />)
    
    // Проверяем, что индикатор отрисовал Уровень 1
    expect(screen.getByText('1')).toBeInTheDocument()
    
    // Проверяем, что SignalPanel отрисовала 4 кнопки для игры
    // (в тесте у нас кнопка "Начать игру" + 4 цветные кнопки = 5 кнопок всего)
    const buttons = screen.getAllByRole('button')

    expect(buttons.length).toBe(5)
  })
})