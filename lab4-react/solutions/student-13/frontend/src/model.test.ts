import { describe, expect, test } from '@jest/globals'

import { canSound, createTrack, initialTracks, validateFile } from './model'

describe('Модель приложения', () => {
  test('дорожки создаются с независимыми массивами шагов', () => {
    const tracks = initialTracks()

    tracks[0].steps[0] = true
    expect(tracks).toHaveLength(3)
    expect(tracks[1].steps.every((step) => !step)).toBe(true)
    expect(createTrack('id', 'Channel').soundId).toBeNull()
  })

  test('mute имеет приоритет над solo, несколько solo могут звучать вместе', () => {
    const track = createTrack('1', 'Kick')
    const solo = { ...track, id: '2', solo: true }

    expect(canSound(track, [track])).toBe(true)
    expect(canSound(track, [track, solo])).toBe(false)
    expect(canSound(solo, [track, solo])).toBe(true)
    expect(canSound({ ...solo, muted: true }, [solo])).toBe(false)
  })

  test('проверяет расширение, пустые и слишком большие файлы', () => {
    expect(() => validateFile(new File(['test'], 'KICK.WAV'))).not.toThrow()
    expect(() => validateFile(new File([], 'empty.wav'))).toThrow('непустой')
    expect(() => validateFile(new File(['test'], 'notes.txt'))).toThrow('WAV')

    const large = new File(['x'], 'large.wav')

    Object.defineProperty(large, 'size', { value: 21 * 1024 * 1024 })
    expect(() => validateFile(large)).toThrow('20 МБ')
  })
})
