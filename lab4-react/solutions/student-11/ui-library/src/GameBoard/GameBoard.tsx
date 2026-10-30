import React from 'react'

import styles from './GameBoard.module.css'
import { Tile } from '../Tile/Tile'

export type Grid = number[][]

export interface GameBoardProps {
  grid: Grid
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid }) => {
  return (
    <div className={styles.board}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => (
            <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
          ))}
        </div>
      ))}
    </div>
  )
}