export interface AnswerOption {
  id: string
  text: string
}

export interface Question {
  id: string
  text: string
  options: AnswerOption[]
  correctOptionId: string
}

export type GameMode = 'classic' | 'blitz' | 'survival'

export interface ScoreRecord {
  id: string
  player: string
  score: number
  mode: GameMode
}