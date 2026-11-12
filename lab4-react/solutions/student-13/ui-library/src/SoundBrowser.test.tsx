import { describe, expect, jest, test } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'

import { SoundBrowser } from './SoundBrowser'

import type { SoundBrowserProps } from './SoundBrowser'

function props(): SoundBrowserProps {
  return {
    sounds: [{ id: 'kick', name: 'Kick.wav' }, { id: 'snare', name: 'Snare.wav' }],
    selectedSoundId: null, onSelect: jest.fn(), onPreview: jest.fn()
  }
}

describe('SoundBrowser', () => {
  test('выбор и проигрывание вызывают разные callbacks с правильным ID', () => {
    const handlers = props()

    render(<SoundBrowser {...handlers} selectedSoundId="kick" targetName="Drums" />)
    expect(screen.getByText(/Назначить на дорожку «Drums»/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kick.wav' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Snare.wav' })).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: 'Snare.wav' }))
    expect(handlers.onSelect).toHaveBeenCalledWith('snare')
    expect(handlers.onPreview).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Прослушать Kick.wav' }))
    expect(handlers.onPreview).toHaveBeenCalledWith('kick')
    expect(handlers.onSelect).toHaveBeenCalledTimes(1)
  })

  test('поиск не зависит от регистра и пробелов по краям', () => {
    render(<SoundBrowser {...props()} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  KICK  ' } })
    expect(screen.getByRole('button', { name: 'Kick.wav' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Snare.wav' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'unknown' } })
    expect(screen.getByText('Ничего не найдено. Измените запрос.')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
    expect(screen.getByRole('button', { name: 'Snare.wav' })).toBeInTheDocument()
  })

  test('пустой список предлагает загрузить файлы', () => {
    render(<SoundBrowser {...props()} sounds={[]} />)
    expect(screen.getByText('Загрузите свои аудиофайлы, чтобы начать.')).toBeInTheDocument()
    expect(screen.queryByText('Ничего не найдено. Измените запрос.')).not.toBeInTheDocument()
  })

  test('во время загрузки выбор и прослушивание заблокированы', () => {
    const handlers = props()

    render(<SoundBrowser {...handlers} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Kick.wav' }))
    fireEvent.click(screen.getByRole('button', { name: 'Прослушать Kick.wav' }))
    expect(screen.getByRole('button', { name: 'Kick.wav' })).toBeDisabled()
    expect(handlers.onSelect).not.toHaveBeenCalled()
    expect(handlers.onPreview).not.toHaveBeenCalled()
  })

  test('список и выделение обновляются через props', () => {
    const handlers = props()
    const { rerender } = render(<SoundBrowser {...handlers} />)

    rerender(<SoundBrowser {...handlers} sounds={[{ id: 'hat', name: 'Hat.wav' }]} selectedSoundId="hat" />)
    expect(screen.queryByRole('button', { name: 'Kick.wav' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hat.wav' })).toHaveAttribute('aria-pressed', 'true')
  })
})
