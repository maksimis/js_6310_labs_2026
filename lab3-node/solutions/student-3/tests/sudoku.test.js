import {
  createEmptyBoard,
  cloneBoard,
  isValidPlacement,
  normalizeDifficulty,
  generateSudoku,
  formatBoard,
  parseUserBoard,
  checkSolution,
  parseCellCoordinates
} from '../src/utils/index.js';

describe('Sudoku Utils Tests', () => {
  test('createEmptyBoard и cloneBoard работают корректно', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board[0]).toHaveLength(9);

    const copy = cloneBoard(board);
    copy[0][0] = 9;
    expect(board[0][0]).toBe(0);
  });

  test('isValidPlacement проверяет строку, столбец и квадрат 3x3', () => {
    const board = createEmptyBoard();
    board[0][0] = 5;

    expect(isValidPlacement(board, 0, 4, 5)).toBe(false);
    expect(isValidPlacement(board, 4, 0, 5)).toBe(false);
    expect(isValidPlacement(board, 1, 1, 5)).toBe(false);
    expect(isValidPlacement(board, 4, 4, 5)).toBe(true);
  });

  test('normalizeDifficulty распознает все варианты ввода сложности', () => {
    expect(normalizeDifficulty('лёгкая')).toBe('easy');
    expect(normalizeDifficulty('1')).toBe('easy');
    expect(normalizeDifficulty('Средняя')).toBe('medium');
    expect(normalizeDifficulty('2')).toBe('medium');
    expect(normalizeDifficulty('hard')).toBe('hard');
    expect(normalizeDifficulty('3')).toBe('hard');
    expect(normalizeDifficulty('invalid')).toBeNull();
    expect(normalizeDifficulty(null)).toBeNull();
  });

  test('generateSudoku генерирует поле с нужным числом пустых клеток', () => {
    const easyGame = generateSudoku('easy');
    const emptyCount = easyGame.puzzle.flat().filter((v) => v === 0).length;
    expect(emptyCount).toBe(30);
    expect(easyGame.difficultyName).toBe('Лёгкая');

    const fallbackGame = generateSudoku('unknown');
    expect(fallbackGame.difficultyName).toBe('Средняя');
  });

  test('formatBoard возвращает текстовое представление сетки', () => {
    const board = createEmptyBoard();
    const formatted = formatBoard(board);
    expect(formatted).toContain('+-------+-------+-------+');
    expect(formatted).toContain('| . . . | . . . | . . . |');
  });

  test('parseUserBoard валидирует и разбирает входную строку', () => {
    expect(parseUserBoard(null).isValid).toBe(false);
    expect(parseUserBoard('12345').isValid).toBe(false);

    const validStr = '1'.repeat(80) + '.';
    const parsed = parseUserBoard(validStr);
    expect(parsed.isValid).toBe(true);
    expect(parsed.board[0][0]).toBe(1);
    expect(parsed.board[8][8]).toBe(0);
  });

  test('checkSolution находит ошибки, пустые клетки и формирует подсказку', () => {
    const { solution } = generateSudoku('easy');
    const perfectCheck = checkSolution(cloneBoard(solution), solution);
    expect(perfectCheck.isSolved).toBe(true);
    expect(perfectCheck.errors).toHaveLength(0);

    const withEmpty = cloneBoard(solution);
    withEmpty[2][3] = 0;
    const emptyCheck = checkSolution(withEmpty, solution);
    expect(emptyCheck.isSolved).toBe(false);
    expect(emptyCheck.emptyCount).toBe(1);
    expect(emptyCheck.suggestedHint).toEqual({
      row: 3,
      col: 4,
      value: solution[2][3]
    });

    const withError = cloneBoard(solution);
    withError[0][0] = withError[0][0] === 9 ? 1 : 9;
    const errorCheck = checkSolution(withError, solution);
    expect(errorCheck.isSolved).toBe(false);
    expect(errorCheck.errors).toHaveLength(1);
    expect(errorCheck.suggestedHint.row).toBe(1);
    expect(errorCheck.suggestedHint.col).toBe(1);
  });

  test('parseCellCoordinates валидирует координаты ячейки', () => {
    expect(parseCellCoordinates('').isValid).toBe(false);
    expect(parseCellCoordinates('1').isValid).toBe(false);
    expect(parseCellCoordinates('0 5').isValid).toBe(false);
    expect(parseCellCoordinates('10 2').isValid).toBe(false);

    const valid = parseCellCoordinates('4 7');
    expect(valid).toEqual({ isValid: true, row: 4, col: 7 });
  });
});