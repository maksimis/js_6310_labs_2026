export function createBoard() {
  return ['', '', '', '', '', '', '', '', ''];
}

export function displayBoard(board) {
  const row0 = `   a   b   c`;
  const row1 = `1  ${board[0] || '*'} | ${board[1] || '*'} | ${board[2] || '*'}`;
  const row2 = `2  ${board[3] || '*'} | ${board[4] || '*'} | ${board[5] || '*'}`;
  const row3 = `3  ${board[6] || '*'} | ${board[7] || '*'} | ${board[8] || '*'}`;
    
  return `${row0}\n${row1}\n   -------------\n${row2}\n   -------------\n${row3}`;
}

export function positionToIndex(position) {
  const cols = { a: 0, b: 1, c: 2 };
  const col = cols[position[0]];
  const row = Number(position[1]) - 1;

  if (col === undefined || row < 0 || row > 2) {
    return -1;
  }

  return row * 3 + col;
}

export function isValidMove(board, position) {
  if (typeof position !== 'string' || position.length !== 2) {
    return false;
  }

  const index = positionToIndex(position);

  if (index === -1) {
    return false;
  }

  return board[index] === '';
}

export function makeMove(board, position, symbol) {
  const index = positionToIndex(position);

  if (index === -1) {
    return false;
  }

  board[index] = symbol;
  return true;
}

export function checkWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return board[a]
    }
  }

  return null;
}

export function isDraw(board) {
  return board.every(cell => cell !== '');
}

export function indexToPosition(index) {
  const cols = ['a', 'b', 'c'];
  const col = index % 3;
  const row = Math.floor(index / 3);
  return `${cols[col]}${row + 1}`;
}

export function easyDifficulty(board) {
  const emptyIndexes = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      emptyIndexes.push(i);
    }
  }

  if (emptyIndexes.length === 0) {
    return null;
  }

  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  return indexToPosition(randomIndex);
}

function findWinningMove(board, symbol) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== '') continue;

    const copy = [...board];
    copy[i] = symbol;
    const winner = checkWinner(copy);

    if (winner === symbol) {
      return indexToPosition(i);
    }
  }
  return null;
}

export function mediumDifficulty(board) {
  const winMove = findWinningMove(board, 'O');
  if (winMove) return winMove;

  const blockMove = findWinningMove(board, 'X');
  if (blockMove) return blockMove;

  if (board[4] === '') return 'b2';

  return easyDifficulty(board);
}

function minimax(board, isMaximizing) {
  const winner = checkWinner(board);
  if (winner === 'O') return 10;
  if (winner === 'X') return -10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== '') continue;

      const copy = [...board];
      copy[i] = 'O';
      const score = minimax(copy, false);
      best = Math.max(best, score);
    }
    return best;
  }

  let best = Infinity;
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== '') continue;

    const copy = [...board];
    copy[i] = 'X';
    const score = minimax(copy, true);
    best = Math.min(best, score);
  }
  return best;
}

export function hardDifficulty(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== '') continue;

    const copy = [...board];
    copy[i] = 'O';
    const score = minimax(copy, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return indexToPosition(bestMove);
}
