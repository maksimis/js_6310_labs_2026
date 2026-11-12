export type ReadingStatus = 'read' | 'reading' | 'want'

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: ReadingStatus
  rating: number
}