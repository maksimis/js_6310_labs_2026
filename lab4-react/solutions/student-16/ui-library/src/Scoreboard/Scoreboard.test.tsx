import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Scoreboard from './Scoreboard'

import type { ScoreRecord } from '../types'

const records: ScoreRecord[] = [
  { id: '1', player: 'Alice', score: 100, mode: 'classic' },
  { id: '2', player: 'Bob', score: 250, mode: 'blitz' },
  { id: '3', player: 'Carol', score: 180, mode: 'classic' },
  { id: '4', player: 'Dave', score: 300, mode: 'survival' }
]

describe('Scoreboard', () => {
  it('renders all records sorted by score desc', () => {
    render(<Scoreboard records={records} />)

    const rows = screen.getAllByRole('row').slice(1)

    expect(within(rows[0]).getByText('Dave')).toBeInTheDocument()
    expect(within(rows[1]).getByText('Bob')).toBeInTheDocument()
    expect(within(rows[2]).getByText('Carol')).toBeInTheDocument()
    expect(within(rows[3]).getByText('Alice')).toBeInTheDocument()
  })

  it('filters by mode', async () => {
    render(<Scoreboard records={records} />)

    await userEvent.selectOptions(screen.getByTestId('mode-filter'), 'classic')

    const rows = screen.getAllByRole('row').slice(1)

    expect(rows).toHaveLength(2)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('shows empty state when no records for filter', async () => {
    const onlyClassic: ScoreRecord[] = [
      { id: '1', player: 'Alice', score: 100, mode: 'classic' }
    ]

    render(<Scoreboard records={onlyClassic} />)

    await userEvent.selectOptions(screen.getByTestId('mode-filter'), 'blitz')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('returns to all modes filter', async () => {
    render(<Scoreboard records={records} />)

    await userEvent.selectOptions(screen.getByTestId('mode-filter'), 'classic')
    await userEvent.selectOptions(screen.getByTestId('mode-filter'), 'all')
    expect(screen.getAllByRole('row').slice(1)).toHaveLength(4)
  })
})