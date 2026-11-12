import { describe, expect, jest, test } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StepSequencer } from './StepSequencer'

import type { StepSequencerProps } from './StepSequencer'
import type { Track } from './types'

const kick: Track = { id: 'kick', name: 'Kick', soundId: null, steps: [true, false], muted: false, solo: false, volume: 80 }

function props(tracks: Track[] = [kick]): StepSequencerProps {
  return {
    tracks, selectedTrackId: null, stepCount: 2,
    onSelectTrack: jest.fn(), onToggleStep: jest.fn(), onToggleMute: jest.fn(), onToggleSolo: jest.fn(), onVolumeChange: jest.fn()
  }
}

describe('StepSequencer', () => {
  test('показывает дорожки, состояния шагов и вызывает отдельные обработчики', () => {
    const handlers = props()

    render(<StepSequencer {...handlers} selectedTrackId="kick" playingStep={1} />)
    expect(screen.getByRole('button', { name: 'Kick: шаг 1' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Kick: шаг 2' })).toHaveClass('playing')
    fireEvent.click(screen.getByRole('button', { name: /Выберите сэмпл/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Kick: шаг 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Kick: mute' }))
    fireEvent.click(screen.getByRole('button', { name: 'Kick: solo' }))
    fireEvent.change(screen.getByRole('slider', { name: 'Kick: громкость' }), { target: { value: '35' } })
    expect(handlers.onVolumeChange).toHaveBeenCalledWith('kick', 35)
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(handlers.onSelectTrack).toHaveBeenCalledWith('kick')
    expect(handlers.onToggleStep).toHaveBeenCalledWith('kick', 1)
    expect(handlers.onToggleMute).toHaveBeenCalledWith('kick')
    expect(handlers.onToggleSolo).toHaveBeenCalledWith('kick')
    // Компонент не меняет переданные данные напрямую.
    expect(kick.steps).toEqual([true, false])
  })

  test('показывает пустое состояние и 16 шагов по умолчанию', () => {
    render(<StepSequencer {...props([])} stepCount={undefined} />)
    expect(screen.getByText('Дорожек пока нет. Добавьте канал.')).toBeInTheDocument()
    expect(screen.getByText('16')).toBeInTheDocument()
  })

  test('mute и solo влияют на отображение, mute имеет приоритет', () => {
    const tracks = [
      { ...kick, soundId: 'sample', solo: true },
      { ...kick, id: 'snare', name: 'Snare', muted: false },
      { ...kick, id: 'hat', name: 'Hat', muted: true, solo: true }
    ]

    render(<StepSequencer {...props(tracks)} />)
    expect(screen.getByRole('button', { name: 'Kick: solo' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Kick: шаг 1' }).closest('.sequence-track')).not.toHaveClass('silenced')
    expect(screen.getByRole('button', { name: 'Snare: шаг 1' }).closest('.sequence-track')).toHaveClass('silenced')
    expect(screen.getByRole('button', { name: 'Hat: mute' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Hat: шаг 1' }).closest('.sequence-track')).toHaveClass('silenced')
    expect(screen.getByText('Нажмите, чтобы заменить звук ←')).toBeInTheDocument()
  })

  test('новые props обновляют выбранный канал и активность шага', () => {
    const handlers = props()
    const { rerender } = render(<StepSequencer {...handlers} />)

    expect(screen.getByRole('button', { name: /Выберите сэмпл/ })).toHaveAttribute('aria-pressed', 'false')
    rerender(<StepSequencer {...handlers} selectedTrackId="kick" tracks={[{ ...kick, steps: [false, true] }]} />)
    expect(screen.getByRole('button', { name: 'Kick: шаг 2' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Выберите сэмпл/ })).toHaveAttribute('aria-pressed', 'true')
  })

  test('шаг доступен с клавиатуры', async () => {
    const user = userEvent.setup()
    const handlers = props()

    render(<StepSequencer {...handlers} />)
    screen.getByRole('button', { name: 'Kick: шаг 1' }).focus()
    await user.keyboard('[Space]')
    expect(handlers.onToggleStep).toHaveBeenCalledWith('kick', 0)
  })
})
