import {
  createBoard,
  displayBoard,
  positionToIndex,
  isValidMove,
  makeMove,
  checkWinner,
  isDraw,
  indexToPosition,
  easyDifficulty,
  mediumDifficulty,
  hardDifficulty,
} from '../src/utils/game.js';

import { describe, test, expect, jest } from '@jest/globals';

test('показывает расставленные символы', () => {
  const board = createBoard();
  board[0] = 'X';
  board[4] = 'O';
  const output = displayBoard(board);
  expect(output).toContain('X');
  expect(output).toContain('O');
  expect((output.match(/\*/g) || []).length).toBe(7);
});

describe('positionToIndex', () => {
  test.each([
    ['a1', 0],
    ['b2', 4],
    ['c3', 8],
  ])('преобразует %s в %i', (pos, expected) => {
    expect(positionToIndex(pos)).toBe(expected);
  });
});

describe('isValidMove', () => {
  test('true для пустой клетки с корректной позицией', () => {
    const board = createBoard();
    expect(isValidMove(board, 'a1')).toBe(true);
    expect(isValidMove(board, 'c3')).toBe(true);
  });

  test('false для занятой клетки', () => {
    const board = createBoard();
    board[0] = 'X';
    expect(isValidMove(board, 'a1')).toBe(false);
  });

  test('false для позиций вне диапазона', () => {
    const board = createBoard();
    expect(isValidMove(board, 'z9')).toBe(false);
    expect(isValidMove(board, 'a0')).toBe(false);
  });
});

describe('makeMove', () => {
  test('ставит символ и возвращает true', () => {
    const board = createBoard();
    expect(makeMove(board, 'b2', 'X')).toBe(true);
    expect(board[4]).toBe('X');
  });
});

describe('checkWinner', () => {
  test('возвращает null на пустом поле', () => {
    expect(checkWinner(createBoard())).toBeNull();
  });

  describe('indexToPosition', () => {
    test.each([
      [0, 'a1'],
      [4, 'b2'],
      [8, 'c3'],
    ])('преобразует индекс %i в %s', (idx, pos) => {
      expect(indexToPosition(idx)).toBe(pos);
    });
  });

  test('определяет победу O', () => {
    const board = ['O', 'O', 'O', '', '', '', '', '', ''];
    expect(checkWinner(board)).toBe('O');
  });

  test('возвращает null, если победителя нет', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isDraw', () => {
  test('false, когда есть хотя бы одна пустая клетка', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', ''];
    expect(isDraw(board)).toBe(false);
  });

  test('true, когда поле заполнено', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(isDraw(board)).toBe(true);
  });
});

describe('indexToPosition', () => {
  test.each([
    [0, 'a1'],
    [1, 'b1'],
    [2, 'c1'],
    [3, 'a2'],
    [4, 'b2'],
    [5, 'c2'],
    [6, 'a3'],
    [7, 'b3'],
    [8, 'c3'],
  ])('преобразует индекс %i в %s', (idx, pos) => {
    expect(indexToPosition(idx)).toBe(pos);
  });
});

describe('easyDifficulty', () => {
  test('возвращает корректную позицию на неполном поле', () => {
    const board = createBoard();
    const move = easyDifficulty(board);
    expect(move).not.toBeNull();
    expect(isValidMove(board, move)).toBe(true);
  });

  test('возвращает null на заполненном поле', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(easyDifficulty(board)).toBeNull();
  });

  test('выбирает только из пустых клеток (замоканный random)', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', ''];
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(easyDifficulty(board)).toBe('c3');
    Math.random.mockRestore();
  });
});

describe('mediumDifficulty', () => {
  test('выигрывает, когда O может завершить линию', () => {
    const board = ['O', 'O', '', '', 'X', '', '', '', 'X'];
    expect(mediumDifficulty(board)).toBe('c1');
  });

  test('блокирует, когда X может завершить линию', () => {
    const board = ['X', 'X', '', '', 'O', '', '', '', ''];
    expect(mediumDifficulty(board)).toBe('c1');
  });

  test('занимает центр, если он свободен и нет выигрыша/блока', () => {
    const board = ['X', '', '', '', '', '', '', '', ''];
    expect(mediumDifficulty(board)).toBe('b2');
  });

  test('падает обратно в easyDifficulty (замоканный random)', () => {
    const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', ''];
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(mediumDifficulty(board)).toBe('c3');
    Math.random.mockRestore();
  });
});

describe('hardDifficulty', () => {
  test('делает выигрышный ход, когда он есть', () => {
    const board = ['O', 'O', '', 'X', 'X', '', '', '', ''];
    expect(hardDifficulty(board)).toBe('c1');
  });

  test('блокирует выигрышный ход соперника', () => {
    const board = ['X', 'X', '', 'O', '', '', '', '', ''];
    expect(hardDifficulty(board)).toBe('c1');
  });

  test('возвращает корректный ход на пустом поле', () => {
    const board = createBoard();
    const move = hardDifficulty(board);
    expect(move).not.toBeNull();
    expect(isValidMove(board, move)).toBe(true);
  });

  test('не изменяет поле после раздумий', () => {
    const board = createBoard();
    hardDifficulty(board);
    expect(board.every((c) => c === '')).toBe(true);
  });
});