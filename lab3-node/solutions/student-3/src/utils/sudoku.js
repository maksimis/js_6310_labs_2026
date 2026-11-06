export const DIFFICULTY_LEVELS = {
  easy: { name: 'Лёгкая', emptyCells: 30 },
  medium: { name: 'Средняя', emptyCells: 42 },
  hard: { name: 'Сложная', emptyCells: 52 }
};

export const createEmptyBoard = () => (
  Array.from({ length: 9 }, () => Array(9).fill(0))
);

export const cloneBoard = (board) => board.map((row) => [...row]);

export const isValidPlacement = (board, row, col, num) => {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (board[startRow + r][startCol + c] === num) {
        return false;
      }
    }
  }

  return true;
};

export const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const fillBoard = (board) => {
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

export const normalizeDifficulty = (input) => {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const clean = input.trim().toLowerCase();
  const map = {
    '1': 'easy',
    'easy': 'easy',
    'легкая': 'easy',
    'лёгкая': 'easy',
    '2': 'medium',
    'medium': 'medium',
    'средняя': 'medium',
    '3': 'hard',
    'hard': 'hard',
    'сложная': 'hard'
  };

  return map[clean] || null;
};

export const generateSudoku = (difficultyKey = 'medium') => {
  const level = DIFFICULTY_LEVELS[difficultyKey] || DIFFICULTY_LEVELS.medium;
  const solution = createEmptyBoard();
  fillBoard(solution);

  const puzzle = cloneBoard(solution);
  const positions = shuffle(Array.from({ length: 81 }, (_, idx) => idx));

  for (let i = 0; i < level.emptyCells; i += 1) {
    const pos = positions[i];
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    puzzle[row][col] = 0;
  }

  return {
    puzzle,
    solution,
    difficulty: difficultyKey,
    difficultyName: level.name
  };
};

export const formatBoard = (board) => {
  const horizontalBorder = '+-------+-------+-------+';
  const lines = [horizontalBorder];

  for (let r = 0; r < 9; r += 1) {
    const rowPart1 = board[r].slice(0, 3).map((v) => (v === 0 ? '.' : v)).join(' ');
    const rowPart2 = board[r].slice(3, 6).map((v) => (v === 0 ? '.' : v)).join(' ');
    const rowPart3 = board[r].slice(6, 9).map((v) => (v === 0 ? '.' : v)).join(' ');
    lines.push(`| ${rowPart1} | ${rowPart2} | ${rowPart3} |`);

    if ((r + 1) % 3 === 0) {
      lines.push(horizontalBorder);
    }
  }

  return lines.join('\n');
};

export const parseUserBoard = (rawInput) => {
  if (!rawInput || typeof rawInput !== 'string') {
    return { isValid: false, error: 'Поле должно быть передано в виде текста.' };
  }

  const normalized = rawInput
      .replace(/\./g, '0')
      .replace(/[^0-9]/g, '');

  if (normalized.length !== 81) {
    return {
      isValid: false,
      error: `Некорректная длина поля: получено ${normalized.length} значащих символов из 81 требуемых.`
    };
  }

  const board = createEmptyBoard();
  for (let i = 0; i < 81; i += 1) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    board[row][col] = Number(normalized[i]);
  }

  return { isValid: true, board };
};

export const checkSolution = (userBoard, solutionBoard) => {
  const errors = [];
  let emptyCount = 0;

  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      const val = userBoard[r][c];
      const expected = solutionBoard[r][c];

      if (val === 0) {
        emptyCount += 1;
      } else if (val !== expected) {
        errors.push({
          row: r + 1,
          col: c + 1,
          actual: val,
          expected
        });
      }
    }
  }

  let suggestedHint = null;
  if (errors.length > 0) {
    suggestedHint = {
      row: errors[0].row,
      col: errors[0].col,
      value: errors[0].expected
    };
  } else if (emptyCount > 0) {
    for (let r = 0; r < 9 && !suggestedHint; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        if (userBoard[r][c] === 0) {
          suggestedHint = {
            row: r + 1,
            col: c + 1,
            value: solutionBoard[r][c]
          };
          break;
        }
      }
    }
  }

  return {
    isSolved: errors.length === 0 && emptyCount === 0,
    errors,
    emptyCount,
    suggestedHint
  };
};

export const parseCellCoordinates = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return { isValid: false, error: 'Введите координаты в формате: строка столбец (например, 3 5).' };
  }

  const parts = rawText.trim().split(/[\s,;:-]+/).filter(Boolean);
  if (parts.length !== 2) {
    return { isValid: false, error: 'Необходимо указать ровно два числа от 1 до 9 через пробел (строка и столбец).' };
  }

  const row = Number(parts[0]);
  const col = Number(parts[1]);

  if (!Number.isInteger(row) || !Number.isInteger(col) || row < 1 || row > 9 || col < 1 || col > 9) {
    return { isValid: false, error: 'Координаты строки и столбца должны быть целыми числами от 1 до 9.' };
  }

  return { isValid: true, row, col };
};