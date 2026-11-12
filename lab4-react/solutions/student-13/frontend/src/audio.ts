import { canSound, DEFAULT_SOUNDS, STEP_COUNT, validateFile } from './model'

import type { Track } from '@student-13/music-ui'

// Таймер пополняет очередь, а точный старт назначает AudioContext.
export class AudioEngine {
  private context: AudioContext | null = null
  private buffers = new Map<string, AudioBuffer>()
  private sources = new Set<AudioBufferSourceNode>()
  private timer: ReturnType<typeof setInterval> | null = null
  private visualTimers = new Set<ReturnType<typeof setTimeout>>()
  private tracks: readonly Track[] = []
  private bpm = 120
  private nextTime = 0
  private nextStep = 0

  private async ready(): Promise<AudioContext> {
    if (!this.context) {
      this.context = new AudioContext()
    }

    if (this.context.state === 'suspended') {
      await this.context.resume()
    }

    return this.context
  }

  async load(file: File, id: string): Promise<void> {
    validateFile(file)

    const context = await this.ready()
    const buffer = await context.decodeAudioData(await file.arrayBuffer())

    if (buffer.duration > 30) {
      throw new Error(`${file.name}: сэмпл должен быть не длиннее 30 секунд`)
    }

    this.buffers.set(id, buffer)
  }

  update(tracks: readonly Track[], bpm: number): void {
    this.tracks = tracks
    this.bpm = bpm
  }

  private async ensureSound(id: string): Promise<void> {
    const sound = DEFAULT_SOUNDS.find((item) => item.id === id)

    if (this.buffers.has(id) || !sound) {
      return
    }

    const context = await this.ready()
    const response = await fetch(sound.url)

    if (!response.ok) {
      throw new Error('Не удалось загрузить встроенный звук')
    }

    this.buffers.set(id, await context.decodeAudioData(await response.arrayBuffer()))
  }

  private trigger(id: string, time: number, volume = 80): void {
    const buffer = this.buffers.get(id)

    if (!this.context || !buffer) {
      return
    }

    const source = this.context.createBufferSource()
    const gain = this.context.createGain()

    source.buffer = buffer
    gain.gain.value = volume / 100 * 0.5
    source.connect(gain)
    gain.connect(this.context.destination)
    this.sources.add(source)

    source.onended = (): void => {
      this.sources.delete(source)
      source.disconnect()
      gain.disconnect()
    }
    source.start(time)
  }

  async preview(id: string): Promise<void> {
    const context = await this.ready()

    await this.ensureSound(id)

    this.trigger(id, context.currentTime)
  }

  async start(onStep: (step: number) => void): Promise<void> {
    const context = await this.ready()

    for (const track of this.tracks) {
      if (track.soundId) {
        await this.ensureSound(track.soundId)
      }
    }

    this.stop()
    this.nextStep = 0
    this.nextTime = context.currentTime + 0.05

    const tick = (): void => {
      if (this.nextTime < context.currentTime) {
        this.nextTime = context.currentTime + 0.05
      }

      while (this.nextTime < context.currentTime + 0.1) {
        const step = this.nextStep
        const time = this.nextTime

        for (const track of this.tracks) {
          if (track.steps[step] && track.soundId && canSound(track, this.tracks)) {
            this.trigger(track.soundId, time, track.volume)
          }
        }

        const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
          this.visualTimers.delete(timer)
          onStep(step)
        }, Math.max(0, (time - context.currentTime) * 1000))

        this.visualTimers.add(timer)
        this.nextTime += 60 / this.bpm / 4
        this.nextStep = (step + 1) % STEP_COUNT
      }
    }

    tick()
    this.timer = setInterval(tick, 25)
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }

    this.visualTimers.forEach(clearTimeout)
    this.visualTimers.clear()

    for (const source of this.sources) {
      source.stop()
    }

    this.sources.clear()
  }

  dispose(): void {
    this.stop()
    this.buffers.clear()

    if (this.context) {
      void this.context.close()
      this.context = null
    }
  }
}
