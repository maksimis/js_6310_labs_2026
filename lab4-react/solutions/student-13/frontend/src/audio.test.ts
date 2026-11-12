import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals'

import { AudioEngine } from './audio'
import { createTrack } from './model'

class FakeSource {
  buffer: AudioBuffer | null = null
  onended: (() => void) | null = null
  connect = jest.fn()
  disconnect = jest.fn()
  start = jest.fn()
  stop = jest.fn()
}

class FakeContext {
  currentTime = 0
  state: AudioContextState = 'suspended'
  destination = {} as AudioDestinationNode
  sources: FakeSource[] = []
  resume = jest.fn(async (): Promise<void> => { this.state = 'running' })
  close = jest.fn(async (): Promise<void> => { this.state = 'closed' })
  decodeAudioData = jest.fn<(data: ArrayBuffer) => Promise<AudioBuffer>>().mockResolvedValue({ duration: 0.1 } as AudioBuffer)
  createGain = jest.fn(() => ({ gain: { value: 1 }, connect: jest.fn(), disconnect: jest.fn() }))
  createBufferSource = (): AudioBufferSourceNode => {
    const source = new FakeSource()

    this.sources.push(source)

    return source as unknown as AudioBufferSourceNode
  }
}

let context: FakeContext

beforeEach(() => {
  jest.useFakeTimers()
  context = new FakeContext()
  Object.defineProperty(globalThis, 'AudioContext', { configurable: true, value: jest.fn(() => context) })
})

afterEach(() => {
  jest.useRealTimers()
  jest.restoreAllMocks()
})

function audioFile(): File {
  const file = new File(['audio'], 'kick.wav')

  Object.defineProperty(file, 'arrayBuffer', { value: async (): Promise<ArrayBuffer> => new ArrayBuffer(8) })

  return file
}

describe('Аудиодвижок', () => {
  test('загружает встроенный WAV по запросу, кэширует его и сообщает об ошибке HTTP', async () => {
    const fetchMock = jest.fn<typeof fetch>().mockResolvedValue({
      ok: true, arrayBuffer: async (): Promise<ArrayBuffer> => new ArrayBuffer(8)
    } as Response)

    Object.defineProperty(globalThis, 'fetch', { configurable: true, value: fetchMock })

    const engine = new AudioEngine()

    await engine.preview('builtin-kick')
    await engine.preview('builtin-kick')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/sounds/kick.wav')
    fetchMock.mockResolvedValueOnce({ ok: false } as Response)
    await expect(engine.preview('builtin-snare')).rejects.toThrow('встроенный звук')
    engine.dispose()
    Reflect.deleteProperty(globalThis, 'fetch')
  })

  test('громкость применяется к gain, а шестнадцатый шаг возвращается к первому', async () => {
    const engine = new AudioEngine()
    const track = { ...createTrack('1', 'Kick'), soundId: 'kick', steps: Array<boolean>(16).fill(true), volume: 25 }
    const onStep = jest.fn<(step: number) => void>()

    await engine.load(audioFile(), 'kick')
    engine.update([track], 120)
    await engine.start(onStep)
    const gainResult = context.createGain.mock.results[0]

    expect(gainResult.type).toBe('return')

    if (gainResult.type === 'return') {
      expect(gainResult.value.gain.value).toBe(0.125)
    }

    for (let index = 0; index < 85; index++) {
      context.currentTime += 0.025
      jest.advanceTimersByTime(25)
    }

    expect(onStep).toHaveBeenCalledWith(15)
    expect(onStep.mock.calls.filter(([step]) => step === 0).length).toBeGreaterThanOrEqual(2)
    engine.dispose()
  })
  test('декодирует реальный входной буфер, предпрослушивает и освобождает источник', async () => {
    const engine = new AudioEngine()

    await engine.load(audioFile(), 'kick')
    expect(context.decodeAudioData).toHaveBeenCalledWith(new ArrayBuffer(8))
    await engine.preview('missing')
    expect(context.sources).toHaveLength(0)
    await engine.preview('kick')
    expect(context.sources[0].start).toHaveBeenCalledWith(0)
    context.sources[0].onended?.()
    expect(context.sources[0].disconnect).toHaveBeenCalled()
    engine.dispose()
    expect(context.close).toHaveBeenCalled()
  })

  test('битый и слишком длинный файл отклоняются', async () => {
    const engine = new AudioEngine()

    await expect(engine.load(new File([], 'empty.wav'), 'empty')).rejects.toThrow()
    context.decodeAudioData.mockRejectedValueOnce(new Error('bad file'))
    await expect(engine.load(audioFile(), 'bad')).rejects.toThrow('bad file')
    context.decodeAudioData.mockResolvedValueOnce({ duration: 31 } as AudioBuffer)
    await expect(engine.load(audioFile(), 'long')).rejects.toThrow('30 секунд')
    engine.dispose()
  })

  test('планирует по аудиовремени, учитывает mute и solo, stop отменяет таймеры', async () => {
    const engine = new AudioEngine()
    const track = { ...createTrack('1', 'Kick'), soundId: 'kick', steps: Array<boolean>(8).fill(true) }
    const onStep = jest.fn<(step: number) => void>()

    await engine.load(audioFile(), 'kick')
    engine.update([track, { ...track, id: '2', muted: true }, { ...track, id: '3', soundId: null }], 120)
    await engine.start(onStep)
    expect(context.sources).toHaveLength(1)
    expect(context.sources[0].start).toHaveBeenCalledWith(0.05)
    jest.advanceTimersByTime(50)
    expect(onStep).toHaveBeenCalledWith(0)
    context.currentTime = 0.5
    jest.advanceTimersByTime(25)
    expect(context.sources[1].start).toHaveBeenCalledWith(0.55)
    engine.update([{ ...track, muted: true, solo: true }, track], 120)
    context.currentTime = 1
    jest.advanceTimersByTime(25)
    expect(context.sources).toHaveLength(2)
    context.currentTime = 10
    jest.advanceTimersByTime(25)
    engine.stop()
    expect(context.sources[0].stop).toHaveBeenCalled()

    const count = onStep.mock.calls.length

    jest.advanceTimersByTime(1000)
    expect(onStep).toHaveBeenCalledTimes(count)
    engine.dispose()
    new AudioEngine().dispose()
  })
})
