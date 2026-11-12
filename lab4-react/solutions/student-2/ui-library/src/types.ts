export type BrickType = 'normal' | 'armored' | 'bonus' | 'indestructible'

export interface Brick {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  durability: number
  type?: BrickType
}

export interface PaddlePosition {
  x: number
  y: number
  width: number
  height: number
  color?: string
}

export interface BallPosition {
  x: number
  y: number
  radius: number
  color?: string
}

export interface BreakoutBoardProps {
  width: number
  height: number
  bricks: Brick[]
  paddle: PaddlePosition
  ball: BallPosition
  className?: string
}

export interface GameStatusPanelProps {
  score: number
  lives: number
  level: number
  className?: string
}