import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App (EduGenBot)', () => {
  it('отображает главный экран', () => {
    render(<App />)
    // Ищем именно H1
    expect(screen.getByRole('heading', { level: 1, name: /EduGenBot/i })).toBeInTheDocument()
    expect(screen.getByText(/Добро пожаловать/i)).toBeInTheDocument()
  })

  it('генерирует задание при клике на тему', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('button', { name: /Основы JavaScript/i }))
    
    expect(screen.getByText('Задание')).toBeInTheDocument()
    expect(screen.getByText('Результат проверки')).toBeInTheDocument()
  })
})