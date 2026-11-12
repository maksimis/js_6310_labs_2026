export interface Sound {
  id: string
  name: string
}

export interface Track {
  id: string
  name: string
  soundId: string | null
  steps: boolean[]
  muted: boolean
  solo: boolean
  volume: number
}
