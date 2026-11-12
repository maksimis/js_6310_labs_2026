export { default as QuestionCard } from './QuestionCard/QuestionCard'
export { default as Scoreboard } from './Scoreboard/Scoreboard'

export * from './types'

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