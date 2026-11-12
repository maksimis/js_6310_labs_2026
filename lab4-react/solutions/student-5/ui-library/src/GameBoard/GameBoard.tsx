import React from 'react'

import styles from './GameBoard.module.css'

export interface GameBoardProps {
  board: ('X' | 'O' | '')[]
  winningLine: number[] | null
  onCellClick: (index: number) => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  winningLine,
  onCellClick,
}) => {
  const handleCellClick = (index: number) => {
    if (board[index] !== '') return
    onCellClick(index)
  }

  return (
    <div className={styles.board}>
      {board.map((cell, index) => {
        const isWinningCell = winningLine?.includes(index)
        const cellClassName = `${styles.cell} ${isWinningCell ? styles.winner : ''}`

        return (
          <button 
            key={index} 
            className={cellClassName}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}