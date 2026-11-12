import type { Sound, Track } from '@student-13/music-ui'

export const STEP_COUNT = 16
export const MAX_TRACKS = 8
export const MAX_SOUNDS = 32
export const MAX_FILE_BYTES = 20 * 1024 * 1024

export const DEFAULT_SOUNDS: (Sound & { url: string })[] = [
  { id: 'builtin-kick', name: 'Kick', url: '/sounds/kick.wav' },
  { id: 'builtin-snare', name: 'Snare', url: '/sounds/snare.wav' },
  { id: 'builtin-hat', name: 'Hi-hat', url: '/sounds/hat.wav' }
]

export function createTrack(id: string, name: string): Track {
  return { id, name, soundId: null, steps: Array<boolean>(STEP_COUNT).fill(false), muted: false, solo: false, volume: 80 }
}

export function initialTracks(): Track[] {
  return DEFAULT_SOUNDS.map((sound, index) => ({ ...createTrack(`track-${index + 1}`, sound.name), soundId: sound.id }))
}

export function canSound(track: Track, tracks: readonly Track[]): boolean {
  return !track.muted && (!tracks.some((item) => item.solo) || track.solo)
}

export function validateFile(file: File): void {
  if (file.size === 0 || file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name}: нужен непустой файл размером до 20 МБ`)
  }

  if (!/\.(wav|mp3|ogg|flac|m4a|aac)$/i.test(file.name)) {
    throw new Error(`${file.name}: выберите WAV, MP3, OGG, FLAC, M4A или AAC`)
  }
}
