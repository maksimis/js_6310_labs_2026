// Игровое поле Тетриса стандартного размера: 10 клеток в ширину, 20 клеток в высоту.
export const FIELD_WIDTH = 10;
export const FIELD_HEIGHT = 20;

// Таблица начисления очков за очистку линий
export const LINE_SCORES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

// Создание пустого поля заданного размера
export function createEmptyField(width = FIELD_WIDTH, height = FIELD_HEIGHT) {
  const field = [];
  for (let r = 0; r < height; r++) {
    field.push(new Array(width).fill(0));
  }
  return field;
}

// Проверка, можно ли разместить матрицу фигуры в координатах (startRow, startCol)
export function canPlace(field, matrix, startRow, startCol) {
  const height = field.length;
  const width = field[0].length;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;

        if (targetRow < 0 || targetRow >= height || targetCol < 0 || targetCol >= width) {
          return false;
        }
        if (field[targetRow][targetCol] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

// Пошаговый сброс тетрамино в выбранный столбец (0-based)
export function dropTetramino(field, tetramino, colIndex) {
  if (!tetramino || !tetramino.matrix) {
    return { success: false, error: 'Сначала получите фигуру командой /next_tetramino.' };
  }

  const width = field[0].length;
  const height = field.length;

  if (typeof colIndex !== 'number' || Number.isNaN(colIndex)) {
    return { success: false, error: 'Укажите номер столбца от 1 до 10.' };
  }

  if (colIndex < 0 || colIndex + tetramino.width > width) {
    return {
      success: false,
      error: `Фигура шириной ${tetramino.width} не помещается в столбец ${colIndex + 1}. Доступные столбцы: от 1 до ${width - tetramino.width + 1}.`,
    };
  }

  // Проверяем, помещается ли фигура в самой верхней строке
  if (!canPlace(field, tetramino.matrix, 0, colIndex)) {
    return {
      success: false,
      gameOver: true,
      error: 'Поле переполнено! Фигуру невозможно разместить. Игра окончена.',
    };
  }

  // Опускаем фигуру как можно ниже
  let targetRow = 0;
  while (targetRow + 1 + tetramino.height <= height && canPlace(field, tetramino.matrix, targetRow + 1, colIndex)) {
    targetRow++;
  }

  // Создаём копию поля и переносим блоки фигуры
  const newField = field.map((row) => [...row]);
  for (let r = 0; r < tetramino.matrix.length; r++) {
    for (let c = 0; c < tetramino.matrix[r].length; c++) {
      if (tetramino.matrix[r][c] !== 0) {
        newField[targetRow + r][colIndex + c] = 1;
      }
    }
  }

  // Очистка заполненных линий
  const survivingRows = newField.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = height - survivingRows.length;

  // Добавляем новые пустые строки сверху взамен сгоревших
  while (survivingRows.length < height) {
    survivingRows.unshift(new Array(width).fill(0));
  }

  const addedScore = LINE_SCORES[linesCleared] || 0;

  return {
    success: true,
    gameOver: false,
    newField: survivingRows,
    linesCleared,
    addedScore,
    placedRow: targetRow + 1,
    placedCol: colIndex + 1,
  };
}

// Отрисовка поля в текстовом виде (моноширинный блок)
export function renderFieldText(field) {
  if (!Array.isArray(field) || field.length === 0) {
    return '';
  }
  const width = field[0].length;
  const topBorder = `+${'-'.repeat(width * 2 + 1)}+`;
  const bottomBorder = topBorder;

  const rows = field.map((row) => {
    const line = row.map((cell) => (cell ? '■' : '.')).join(' ');
    return `| ${line} |`;
  });

  const colNumbers = Array.from({ length: width }, (_, i) => ((i + 1) % 10)).join(' ');
  const footerNumbers = `  ${colNumbers}  `;

  return [topBorder, ...rows, bottomBorder, footerNumbers].join('\n');
}

// Форматирование поля с информацией об активной партии
export function formatFieldMessage(field, { score = 0, lines = 0, activeGame = false } = {}) {
  const renderedField = renderFieldText(field);
  const statusLine = activeGame ? '🎮 Активная партия' : '⏸️ Партия не начата (пустое поле)';

  return [
    `Статус: ${statusLine}`,
    `Счёт: ${score} | Очищено линий: ${lines}`,
    '```',
    renderedField,
    '```',
  ].join('\n');
}
