import { describe, test, expect } from '@jest/globals';
import {
  FIELD_WIDTH,
  FIELD_HEIGHT,
  createEmptyField,
  canPlace,
  dropTetramino,
  renderFieldText,
  formatFieldMessage,
} from '../src/tetris/field.js';
import { getTetramino } from '../src/tetris/tetramino.js';

describe('field', () => {
  test('creates empty field with standard dimensions 10x20', () => {
    const field = createEmptyField();
    expect(field.length).toBe(FIELD_HEIGHT);
    expect(field[0].length).toBe(FIELD_WIDTH);
    expect(field.every((row) => row.every((cell) => cell === 0))).toBe(true);
  });

  test('creates custom sized empty field', () => {
    const field = createEmptyField(4, 5);
    expect(field.length).toBe(5);
    expect(field[0].length).toBe(4);
  });

  describe('canPlace', () => {
    test('returns true for placement inside empty bounds', () => {
      const field = createEmptyField();
      const piece = getTetramino('O');
      expect(canPlace(field, piece.matrix, 0, 0)).toBe(true);
    });

    test('returns false when placing outside field boundaries', () => {
      const field = createEmptyField();
      const piece = getTetramino('I');
      expect(canPlace(field, piece.matrix, -1, 0)).toBe(false);
      expect(canPlace(field, piece.matrix, 0, -1)).toBe(false);
      expect(canPlace(field, piece.matrix, FIELD_HEIGHT, 0)).toBe(false);
      expect(canPlace(field, piece.matrix, 0, FIELD_WIDTH - piece.width + 1)).toBe(false);
    });

    test('returns false when overlapping existing blocks', () => {
      const field = createEmptyField();
      field[10][2] = 1;
      const piece = getTetramino('O');
      expect(canPlace(field, piece.matrix, 10, 2)).toBe(false);
    });
  });

  describe('dropTetramino', () => {
    test('returns error when tetramino is missing', () => {
      const field = createEmptyField();
      const result = dropTetramino(field, null, 0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Сначала получите фигуру');
    });

    test('returns error for invalid column type or NaN', () => {
      const field = createEmptyField();
      const piece = getTetramino('O');
      expect(dropTetramino(field, piece, 'abc').success).toBe(false);
      expect(dropTetramino(field, piece, NaN).success).toBe(false);
    });

    test('returns error when column is out of bounds', () => {
      const field = createEmptyField();
      const piece = getTetramino('I');
      expect(dropTetramino(field, piece, -1).success).toBe(false);
      expect(dropTetramino(field, piece, FIELD_WIDTH - piece.width + 1).success).toBe(false);
    });

    test('drops piece to the bottom of an empty field', () => {
      const field = createEmptyField();
      const piece = getTetramino('I');
      const result = dropTetramino(field, piece, 0);
      expect(result.success).toBe(true);
      expect(result.placedRow).toBe(FIELD_HEIGHT);
      expect(result.linesCleared).toBe(0);
      expect(result.newField[FIELD_HEIGHT - 1].slice(0, 4)).toEqual([1, 1, 1, 1]);
    });

    test('drops piece on top of already placed piece', () => {
      const field = createEmptyField();
      const piece = getTetramino('O');
      const firstDrop = dropTetramino(field, piece, 0);
      const secondDrop = dropTetramino(firstDrop.newField, piece, 0);

      expect(secondDrop.success).toBe(true);
      expect(secondDrop.placedRow).toBe(FIELD_HEIGHT - piece.height * 2 + 1);
    });

    test('detects game over when top row cannot accommodate piece', () => {
      const field = createEmptyField();
      field[0][0] = 1;
      const piece = getTetramino('O');
      const result = dropTetramino(field, piece, 0);
      expect(result.success).toBe(false);
      expect(result.gameOver).toBe(true);
      expect(result.error).toContain('Поле переполнено');
    });

    test('clears completed single line and adds score', () => {
      const field = createEmptyField();
      // Заполняем нижнюю строку, кроме первых 4 клеток
      for (let c = 4; c < FIELD_WIDTH; c++) {
        field[FIELD_HEIGHT - 1][c] = 1;
      }
      const piece = getTetramino('I'); // ширина 4
      const result = dropTetramino(field, piece, 0);

      expect(result.success).toBe(true);
      expect(result.linesCleared).toBe(1);
      expect(result.addedScore).toBe(100);
      // Нижняя строка должна очиститься и стать пустой
      expect(result.newField[FIELD_HEIGHT - 1].every((cell) => cell === 0)).toBe(true);
    });

    test('clears multiple completed lines and awards bonus points', () => {
      const field = createEmptyField();
      // Заполняем две нижние строки, кроме первых 2 клеток
      for (let r = FIELD_HEIGHT - 2; r < FIELD_HEIGHT; r++) {
        for (let c = 2; c < FIELD_WIDTH; c++) {
          field[r][c] = 1;
        }
      }
      const piece = getTetramino('O'); // 2x2
      const result = dropTetramino(field, piece, 0);

      expect(result.success).toBe(true);
      expect(result.linesCleared).toBe(2);
      expect(result.addedScore).toBe(300);
    });
  });

  describe('renderFieldText and formatFieldMessage', () => {
    test('renders board with border and numbers', () => {
      const field = createEmptyField();
      const text = renderFieldText(field);
      expect(text).toContain('+---------------------+');
      expect(text).toContain('| . . . . . . . . . . |');
      expect(text).toContain('1 2 3 4 5 6 7 8 9 0');
    });

    test('handles empty or invalid field gracefully', () => {
      expect(renderFieldText([])).toBe('');
      expect(renderFieldText(null)).toBe('');
    });

    test('formats message for inactive and active game', () => {
      const field = createEmptyField();
      const defaultMsg = formatFieldMessage(field);
      expect(defaultMsg).toContain('Партия не начата');

      const inactiveMsg = formatFieldMessage(field, { activeGame: false });
      expect(inactiveMsg).toContain('Партия не начата');

      const activeMsg = formatFieldMessage(field, { score: 450, lines: 3, activeGame: true });
      expect(activeMsg).toContain('Активная партия');
      expect(activeMsg).toContain('Счёт: 450');
      expect(activeMsg).toContain('Очищено линий: 3');
    });
  });
});
