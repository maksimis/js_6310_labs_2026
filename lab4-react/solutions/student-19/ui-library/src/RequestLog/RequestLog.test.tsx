import { render, screen } from '@testing-library/react'

import { formatRequestTime } from './formatRequestTime'
import { RequestLog, type LLMRequest } from './RequestLog'

const rotationRules = [
  'При ошибке переключаться на следующую доступную модель.',
  'Пропускать недоступных провайдеров.',
]

const requests: LLMRequest[] = [
  {
    id: 'request-1',
    provider: 'OpenRouter',
    model: 'Llama 3.3 70B',
    status: 'success',
    createdAt: '2026-10-27T09:05:07.000Z',
    tokens: 412,
  },
  {
    id: 'request-2',
    provider: 'Groq',
    model: 'Mixtral 8x7B',
    status: 'error',
    createdAt: '2026-10-27T09:10:00.000Z',
    tokens: 0,
  },
  {
    id: 'request-3',
    provider: 'OpenRouter',
    model: 'DeepSeek R1',
    status: 'pending',
    createdAt: '2026-10-27T09:12:30.000Z',
    tokens: 128,
  },
]

describe('RequestLog', () => {
  test('renders rotation rules', () => {
    render(<RequestLog requests={requests} rotationRules={rotationRules} />)

    expect(screen.getByText('Правила ротации')).toBeInTheDocument()
    rotationRules.forEach(rule => {
      expect(screen.getByText(rule)).toBeInTheDocument()
    })
  })

  test('shows an empty state when there are no requests', () => {
    render(<RequestLog requests={[]} rotationRules={rotationRules} />)

    expect(screen.getByText('Пусто')).toBeInTheDocument()
    expect(screen.queryByText('OpenRouter')).not.toBeInTheDocument()
  })

  test('shows a message when rotation rules are not set', () => {
    render(<RequestLog requests={[]} rotationRules={[]} />)

    expect(screen.getByText('Правила не заданы')).toBeInTheDocument()
  })

  test('renders provider, model, status, time and tokens', () => {
    render(<RequestLog requests={requests} rotationRules={rotationRules} />)

    expect(screen.getByText('Llama 3.3 70B')).toBeInTheDocument()
    expect(screen.getByText('27.10.2026 09:05:07')).toBeInTheDocument()
    expect(screen.getByText('412')).toBeInTheDocument()
  })

  test('renders every request status', () => {
    render(<RequestLog requests={requests} rotationRules={rotationRules} />)

    expect(screen.getByText('Успех')).toBeInTheDocument()
    expect(screen.getByText('Ошибка')).toBeInTheDocument()
    expect(screen.getByText('В ожидании')).toBeInTheDocument()
  })

  test('formats time in UTC', () => {
    expect(formatRequestTime('2026-01-02T03:04:05.000Z')).toBe('02.01.2026 03:04:05')
  })

  test('shows a dash for an invalid date', () => {
    expect(formatRequestTime('not-a-date')).toBe('—')
  })
})
