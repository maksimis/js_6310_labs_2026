import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  const defaultProps = {
    condition: 'Сколько будет 2 + 2?',
    correctAnswer: '4',
    onCheck: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('отображает условие задания', () => {
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByText('Сколько будет 2 + 2?')).toBeInTheDocument()
  })

  it('кнопка проверки отключена при пустом вводе', () => {
    render(<TaskCard {...defaultProps} />)
    expect(screen.getByRole('button', { name: /проверить/i })).toBeDisabled()
  })

  it('вызывает onCheck с true при правильном текстовом ответе', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    await user.type(screen.getByLabelText(/поле ввода ответа/i), '4')
    await user.click(screen.getByRole('button', { name: /проверить/i }))
    // Теперь ожидаем true!
    expect(defaultProps.onCheck).toHaveBeenCalledWith(true, '4')
  })

  it('вызывает onCheck с false при неправильном текстовом ответе', async () => {
    const user = userEvent.setup()
    render(<TaskCard {...defaultProps} />)
    await user.type(screen.getByLabelText(/поле ввода ответа/i), '5')
    await user.click(screen.getByRole('button', { name: /проверить/i }))
    expect(defaultProps.onCheck).toHaveBeenCalledWith(false, '5')
  })

  it('не вызывает onCheck при отправке пустой формы', () => {
    render(<TaskCard {...defaultProps} />)
    const form = screen.getByRole('button', { name: /проверить/i }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }
    expect(defaultProps.onCheck).not.toHaveBeenCalled()
  })

  it('вызывает onCheck при выборе варианта (тест)', async () => {
    const user = userEvent.setup()
    render(
      <TaskCard
        condition="Выберите правильный ответ"
        correctAnswer={1}
        options={['А', 'Б', 'В']}
        onCheck={defaultProps.onCheck}
      />
    )
    await user.click(screen.getByLabelText(/Б/i))
    await user.click(screen.getByRole('button', { name: /проверить/i }))
    expect(defaultProps.onCheck).toHaveBeenCalledWith(true, 'Б')
  })
})