import { render, screen, act } from '@testing-library/react'

import { ParticipantsPanel } from './ParticipantsPanel'

import type { Participant } from './ParticipantsPanel'

const participants: Participant[] = [
  { id: '1', name: 'Анна', online: true },
  { id: '2', name: 'Пётр', online: false },
  { id: '3', name: 'Ирина', online: true },
]

describe('ParticipantsPanel', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  test('renders participants with their online state', () => {
    render(<ParticipantsPanel participants={participants} />)

    expect(screen.getByText('Анна')).toBeInTheDocument()
    expect(screen.getByText('Пётр')).toBeInTheDocument()
    expect(screen.getByText('Ирина')).toBeInTheDocument()
    expect(screen.getAllByText('онлайн')).toHaveLength(2)
    expect(screen.getByText('офлайн')).toBeInTheDocument()
  })

  test('shows the online counter', () => {
    render(<ParticipantsPanel participants={participants} />)

    expect(screen.getByText('Онлайн: 2 из 3')).toBeInTheDocument()
  })

  test('renders an empty list without errors', () => {
    render(<ParticipantsPanel participants={[]} />)

    expect(screen.getByText('Онлайн: 0 из 0')).toBeInTheDocument()
  })

  test('shows a pending state when there is no sync timestamp', () => {
    render(<ParticipantsPanel participants={participants} />)

    expect(screen.getByText('Ожидание')).toBeInTheDocument()
    expect(screen.getByText('нет данных')).toBeInTheDocument()
  })

  test('shows a synced state with the relative update time', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-21T12:00:00Z'))

    render(<ParticipantsPanel participants={participants} lastUpdatedAt={Date.now() - 120000} />)

    expect(screen.getByText('Синхронизировано')).toBeInTheDocument()
    expect(screen.getByText('2 мин. назад')).toBeInTheDocument()
  })

  test('refreshes the update indicator over time', () => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2026-11-21T12:00:00Z'))

    render(<ParticipantsPanel participants={participants} lastUpdatedAt={Date.now()} />)

    expect(screen.getByText('только что')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(30000)
    })

    expect(screen.getByText('30 сек. назад')).toBeInTheDocument()
  })
})
