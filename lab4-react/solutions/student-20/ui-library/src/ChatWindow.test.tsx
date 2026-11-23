import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ChatWindow } from './ChatWindow'

test('отправляет очищенный вопрос по Enter и очищает черновик', async () => {
  const onSend = jest.fn()
  const user = userEvent.setup()

  render(<ChatWindow messages={[]} onSend={onSend} />)
  expect(screen.getByText('Задайте первый вопрос')).toBeInTheDocument()
  await user.type(screen.getByRole('textbox', { name: 'Сообщение' }), '  Что такое props?  {Enter}')
  expect(onSend).toHaveBeenCalledWith('Что такое props?')
  expect(onSend).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('textbox')).toHaveValue('')
})

test('пробельный ввод не отправляется кнопкой или Enter', async () => {
  const onSend = jest.fn()
  const user = userEvent.setup()

  render(<ChatWindow messages={[]} onSend={onSend} />)
  await user.type(screen.getByRole('textbox'), '   {Enter}')
  expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled()
  expect(onSend).not.toHaveBeenCalled()
})

test('сообщения сохраняют роли, а во время набора отправка заблокирована', async () => {
  const onSend = jest.fn()
  const user = userEvent.setup()
  const messages = [
    { id: '1', role: 'user' as const, text: 'Вопрос' },
    { id: '2', role: 'assistant' as const, text: 'Ответ' },
  ]
  const { rerender } = render(<ChatWindow messages={messages} onSend={onSend} />)

  expect(screen.getByText('Вы')).toBeInTheDocument()
  expect(screen.getByText('Ассистент')).toBeInTheDocument()
  expect(screen.getByRole('log')).toHaveTextContent('Вопрос')
  expect(screen.getByRole('log')).toHaveTextContent('Ответ')
  await user.type(screen.getByRole('textbox'), 'Следующий вопрос')
  rerender(<ChatWindow messages={messages} onSend={onSend} isTyping />)
  expect(screen.getByRole('status')).toHaveTextContent('Ассистент печатает…')
  expect(screen.getByRole('textbox')).toBeDisabled()
  await user.click(screen.getByRole('button', { name: 'Отправить' }))
  expect(onSend).not.toHaveBeenCalled()
  rerender(<ChatWindow messages={messages} onSend={onSend} />)
  await user.click(screen.getByRole('button', { name: 'Отправить' }))
  expect(onSend).toHaveBeenCalledWith('Следующий вопрос')
})
