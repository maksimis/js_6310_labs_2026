// 7 классических тетрамино Тетриса: I, O, T, L, J, S, Z.
// Каждое тетрамино задаётся двумерной матрицей (1 — заполненный блок, 0 — пустота).

export const TETRAMINO_TYPES = {
  I: {
    type: 'I',
    name: 'I-образное (Прямое)',
    matrix: [
      [1, 1, 1, 1],
    ],
  },
  O: {
    type: 'O',
    name: 'O-образное (Квадрат)',
    matrix: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    type: 'T',
    name: 'T-образное',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  L: {
    type: 'L',
    name: 'L-образное',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  J: {
    type: 'J',
    name: 'J-образное',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  },
  S: {
    type: 'S',
    name: 'S-образное',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  Z: {
    type: 'Z',
    name: 'Z-образное',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
};

export const CLASSIC_PIECES = Object.keys(TETRAMINO_TYPES);

// Отрисовка матрицы тетрамино в текстовом виде
export function renderTetraminoMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0) {
    return '';
  }
  return matrix
      .map((row) => row.map((cell) => (cell ? '■' : '.')).join('  '))
      .join('\n');
}

// Получить фигуру по типу
export function getTetramino(type) {
  if (!type || typeof type !== 'string') {
    return null;
  }
  const upper = type.trim().toUpperCase();
  const piece = TETRAMINO_TYPES[upper];
  if (!piece) {
    return null;
  }
  return {
    type: piece.type,
    name: piece.name,
    matrix: piece.matrix.map((row) => [...row]),
    width: piece.matrix[0].length,
    height: piece.matrix.length,
  };
}

// Выдать случайное тетрамино из 7 доступных в классическом тетрисе
export function getRandomTetramino(randomFn = Math.random) {
  const index = Math.floor(randomFn() * CLASSIC_PIECES.length);
  const type = CLASSIC_PIECES[index] || CLASSIC_PIECES[0];
  return getTetramino(type);
}

// Форматирование тетрамино в текстовый блок для сообщения
export function formatTetramino(tetramino) {
  if (!tetramino || !tetramino.matrix) {
    return 'Тетрамино не задано.';
  }
  const textShape = renderTetraminoMatrix(tetramino.matrix);
  return [
    `Фигура: ${tetramino.name} [${tetramino.type}]`,
    `Размер: ${tetramino.width}x${tetramino.height}`,
    '```',
    textShape,
    '```',
  ].join('\n');
}
