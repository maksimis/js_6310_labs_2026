export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

export interface GridCoord {
  row: number
  col: number
}

export interface Tetromino {
  id: string
  name: string
  type: TetrominoType
  coords: GridCoord[]
  defaultColor: string
  colorCode: number
  gridSize?: number
}

export type ColorPalette = Record<number, string>