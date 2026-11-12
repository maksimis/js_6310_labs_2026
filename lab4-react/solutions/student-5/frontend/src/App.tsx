import React, { useState } from 'react'

import { GameBoard, GameControls } from '@my-app/ui-library'

import { getBotMove, checkWinner } from './bot'

import type { Difficulty } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'
import './App.css'

export const App: React.FC = () => {
  const [board, setBoard] = useState<('X' | 'O' | '')[]>(Array(9).fill(''))
  const [isXNext, setIsXNext] = useState(true)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [gameOver, setGameOver] = useState(false)

  const { winner, line } = checkWinner(board)
  const isDraw = !winner && board.every(cell => cell !== '')

  const handleCellClick = (index: number) => {
    if (gameOver || winner || board[index] !== '') return

    // 1. Ход игрока
    const newBoard = [...board]

    newBoard[index] = 'X' // Игрок всегда X
    setBoard(newBoard)
    setIsXNext(false)
    
    // 2. Проверяем, не закончилась ли игра после хода игрока
    const { winner: pWinner } = checkWinner(newBoard)

    if (pWinner) return

    // 3. Ход бота (с задержкой 0.5 сек для реалистичности)
    setTimeout(() => {
      const botMoveIndex = getBotMove(newBoard, difficulty)

      if (botMoveIndex !== -1) {
        const boardWithBot = [...newBoard]

        boardWithBot[botMoveIndex] = 'O'
        setBoard(boardWithBot)
        setIsXNext(true)
      }
    }, 500)
  }

  const handleNewGame = () => {
    setBoard(Array(9).fill(''))
    setIsXNext(true)
    setGameOver(false)
  }

  const handleSurrender = () => {
    setGameOver(true)
  }

  return (
    <div className="app-container">
      <h1>Крестики-нолики</h1>
      
      <GameBoard 
        board={board} 
        winningLine={line} 
        onCellClick={handleCellClick} 
      />

      <GameControls
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onNewGame={handleNewGame}
        onSurrender={handleSurrender}
        currentTurn={isXNext ? 'X' : 'O'}
        gameOver={gameOver || !!winner || isDraw}
      />

      {winner && <h2>Победил: {winner}!</h2>}
      {isDraw && <h2>Ничья!</h2>}
    </div>
  )
}

export default App