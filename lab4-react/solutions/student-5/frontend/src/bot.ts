export type Board = ('X' | 'O' | '')[]
export type Difficulty = 'easy' | 'medium' | 'hard'

export const checkWinner = (board: Board): { winner: 'X' | 'O' | null, line: number[] | null } => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  for (const line of lines) {
    const [a, b, c] = line

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as 'X' | 'O', line }
    }
  }

  return { winner: null, line: null }
}

export const isDraw = (board: Board): boolean => {
  return board.every(cell => cell !== '')
}

export const easyDifficulty = (board: Board): number => {
  const emptyIndexes = []

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') emptyIndexes.push(i)
  }
  if (emptyIndexes.length === 0) return -1

  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
}

const findWinningMove = (board: Board, symbol: 'X' | 'O'): number => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== '') continue
    board[i] = symbol
    const { winner } = checkWinner(board)

    board[i] = ''
    if (winner === symbol) return i
  }

  return -1
}

export const mediumDifficulty = (board: Board): number => {
  const winMove = findWinningMove(board, 'O')

  if (winMove !== -1) return winMove

  const blockMove = findWinningMove(board, 'X')

  if (blockMove !== -1) return blockMove

  if (board[4] === '') return 4

  return easyDifficulty(board)
}

const minimax = (board: Board, isMaximizing: boolean): number => {
  const { winner } = checkWinner(board)

  if (winner === 'O') return 10
  if (winner === 'X') return -10
  if (isDraw(board)) return 0

  if (isMaximizing) {
    let best = -Infinity

    for (let i = 0; i < board.length; i++) {
      if (board[i] !== '') continue
      board[i] = 'O'
      const score = minimax(board, false)

      board[i] = ''
      best = Math.max(best, score)
    }

    return best
  } else {
    let best = Infinity

    for (let i = 0; i < board.length; i++) {
      if (board[i] !== '') continue
      board[i] = 'X'
      const score = minimax(board, true)

      board[i] = ''
      best = Math.min(best, score)
    }

    return best
  }
}

export const hardDifficulty = (board: Board): number => {
  if (board[4] === '') return 4

  let bestScore = -Infinity
  let bestMove = -1

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== '') continue
    board[i] = 'O'
    const score = minimax(board, false)

    board[i] = ''

    if (score > bestScore) {
      bestScore = score
      bestMove = i
    }
  }

  return bestMove
}

export const getBotMove = (board: Board, difficulty: Difficulty): number => {
  if (difficulty === 'easy') return easyDifficulty(board)
  if (difficulty === 'medium') return mediumDifficulty(board)

  return hardDifficulty(board)
}