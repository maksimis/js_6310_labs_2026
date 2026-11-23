import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'

afterEach((): void => {
  jest.useRealTimers()
})

test('вопрос проходит путь от отправки до ответа и найденных источников', async () => {
  jest.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  render(<App />)
  await user.type(screen.getByRole('textbox', { name: 'Сообщение' }), 'Чем state отличается от props?')
  await user.click(screen.getByRole('button', { name: 'Отправить' }))
  expect(screen.getByRole('log')).toHaveTextContent('Чем state отличается от props?')
  expect(screen.getByRole('status')).toHaveTextContent('Ассистент печатает…')
  expect(screen.getByRole('textbox')).toBeDisabled()
  act((): void => jest.advanceTimersByTime(700))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  expect(screen.getByRole('textbox')).toBeEnabled()
  expect(screen.getByRole('log')).toHaveTextContent('В отличие от props')
  const sources = screen.getByRole('complementary', { name: 'Панель источников' })

  expect(within(sources).getAllByRole('link')).toHaveLength(2)
  expect(within(sources).getByRole('link', { name: 'Открыть источник: State: память компонента' })).toHaveAttribute('href', '#document-state')
})

test('неизвестный вопрос не получает выдуманных источников, очистка сбрасывает диалог', async () => {
  jest.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })

  render(<App />)
  await user.type(screen.getByRole('textbox'), 'Как приготовить борщ?{Enter}')
  act((): void => jest.advanceTimersByTime(700))
  expect(screen.getByRole('log')).toHaveTextContent('В локальных заметках нет ответа')
  expect(screen.getByLabelText('Найдено источников: 0')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Очистить диалог' }))
  expect(screen.getByRole('log')).not.toHaveTextContent('Как приготовить борщ?')
  expect(screen.getByRole('log')).toHaveTextContent('Привет!')
})

test('готовый вопрос работает, а при уходе со страницы таймер отменяется', async () => {
  jest.useFakeTimers()
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
  const { unmount } = render(<App />)

  await user.click(screen.getByRole('button', { name: 'Зачем очищать таймер в useEffect?' }))
  expect(screen.getByRole('button', { name: 'Очистить диалог' })).toBeDisabled()
  act((): void => jest.advanceTimersByTime(700))
  expect(screen.getByRole('log')).toHaveTextContent('Возвращённая функция очистки')
  expect(screen.getByLabelText('Найдено источников: 1')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Чем state отличается от props?' }))
  unmount()
  expect(jest.getTimerCount()).toBe(0)
})
