import {
  SIZE,
  BLOCK,
  LETTERS,
  inBounds,
  blockOf,
} from '../utils/sudokuHelpers.js';

/**
 * Уровни сложности: сколько пустых клеток оставляем.
 * 81 - empty = количество изначально заполненных.
 */
const DIFFICULTY = {
  easy: 40,
  medium: 32,
  hard: 26,
};

export class Sudoku {
  constructor() {
    /** Полное корректное решение 9x9 */
    this.solution = [];
    /** Текущее поле игрока: 0 — пусто */
    this.grid = [];
    /** Маска изначально заданных клеток (true — трогать нельзя) */
    this.fixed = [];
    this.difficulty = null;
    this.emptyCells = 0;
  }

  /**
   * Генерирует новую партию.
   * @param {'easy'|'medium'|'hard'} difficulty
   */
  generate(difficulty = 'easy') {
    const level = DIFFICULTY[difficulty] !== undefined ? difficulty : 'easy';
    this.difficulty = level;

    this.solution = this.#buildFullSolution();
    this.grid = this.solution.map((row) => [...row]);
    this.fixed = this.grid.map((row) => row.map(() => true));

    const toRemove = DIFFICULTY[level];
    this.#removeCells(toRemove);

    this.emptyCells = toRemove;
    return this;
  }

  /** Количество пустых клеток на текущем поле */
  countEmpty() {
    let count = 0;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.grid[r][c] === 0) count++;
      }
    }
    return count;
  }

  /**
   * Ставит значение в клетку.
   * @returns {{ ok: boolean, reason?: string }}
   */
  setCell(row, col, value) {
    if (!inBounds(row, col)) {
      return { ok: false, reason: 'Координата вне поля' };
    }
    if (!Number.isInteger(value) || value < 1 || value > SIZE) {
      return { ok: false, reason: 'Значение должно быть от 1 до 9' };
    }
    if (this.fixed[row][col]) {
      return { ok: false, reason: 'Эту клетку менять нельзя' };
    }
    if (this.grid[row][col] === value) {
      return { ok: false, reason: 'Клетка уже содержит это значение' };
    }

    // Проверка конфликта с учётом того, что мы перезаписываем клетку
    const prev = this.grid[row][col];
    this.grid[row][col] = 0;

    if (this.#hasConflict(row, col, value)) {
      this.grid[row][col] = prev;
      return { ok: false, reason: 'Конфликт со строкой, столбцом или блоком' };
    }

    this.grid[row][col] = value;
    return { ok: true };
  }

  /** Все ли клетки заполнены */
  isComplete() {
    return this.countEmpty() === 0;
  }

  /**
   * Полная проверка текущего поля.
   * @returns {{ solved: boolean, errors: Array<{row,col,value,expected}> }}
   */
  checkSolution() {
    const errors = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = this.grid[r][c];
        if (val === 0 || val !== this.solution[r][c]) {
          errors.push({ row: r, col: c, value: val, expected: this.solution[r][c] });
        }
      }
    }
    return { solved: errors.length === 0, errors };
  }

  /**
 * Текстовое представление поля.
 * Пустые клетки — "_", блоки 3x3 разделены "|", столбец номеров — "‖".
 */
  getGridString() {
    const EMPTY = '_';
    const pad = ' ';

    const colLabels = LETTERS.split('').map((ch) => `${pad}${ch}${pad}`).join(' ');

    const header =
    '    ‖ ' +
    colLabels.slice(0, 11) + ' │ ' +
    colLabels.slice(12, 23) + ' │ ' +
    colLabels.slice(24);

    const topDivider = '══‖═════╪══════╪═════';
    const blockDivider = '──‖─────┼──────┼─────';

    const lines = [header, topDivider];

    for (let r = 0; r < SIZE; r++) {
      const cells = [];
      for (let c = 0; c < SIZE; c++) {
        const v = this.grid[r][c];
        cells.push(v === 0 ? EMPTY : String(v));
      }

      const left = cells.slice(0, 3).map((v) => `${pad}${v}${pad}`).join(' ');
      const mid = cells.slice(3, 6).map((v) => `${pad}${v}${pad}`).join(' ');
      const right = cells.slice(6, 9).map((v) => `${pad}${v}${pad}`).join(' ');

      lines.push(`${r + 1}   ‖ ${left} │ ${mid} │ ${right}`);

      if ((r + 1) % 3 === 0 && r !== SIZE - 1) {
        lines.push(blockDivider);
      }
    }

    return lines.join('\n');
  }

  // ---------------------------------------------------------------------------
  // Приватные методы
  // ---------------------------------------------------------------------------

  /** Собирает полное корректное поле */
  #buildFullSolution() {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    this.#fillGrid(grid);
    return grid;
  }

  /** Рекурсивное заполнение с бэктрекингом */
  #fillGrid(grid) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] !== 0) continue;

        const numbers = this.#shuffledNumbers();
        for (const n of numbers) {
          if (!this.#conflictsIn(grid, r, c, n)) {
            grid[r][c] = n;
            if (this.#fillGrid(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
    return true;
  }

  /** Проверка конфликта в произвольной сетке */
  #conflictsIn(grid, row, col, value) {
    for (let i = 0; i < SIZE; i++) {
      if (i !== col && grid[row][i] === value) return true;
      if (i !== row && grid[i][col] === value) return true;
    }

    const { blockRow, blockCol } = blockOf(row, col);
    const startRow = blockRow * BLOCK;
    const startCol = blockCol * BLOCK;

    for (let r = startRow; r < startRow + BLOCK; r++) {
      for (let c = startCol; c < startCol + BLOCK; c++) {
        if ((r !== row || c !== col) && grid[r][c] === value) return true;
      }
    }
    return false;
  }

  /** Конфликт на текущем поле */
  #hasConflict(row, col, value) {
    return this.#conflictsIn(this.grid, row, col, value);
  }

  /** Убирает заданное количество клеток (оставляет fixed=false) */
  #removeCells(count) {
    const positions = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        positions.push({ r, c });
      }
    }
    this.#shuffle(positions);

    const toRemove = Math.min(count, positions.length);
    for (let i = 0; i < toRemove; i++) {
      const { r, c } = positions[i];
      this.grid[r][c] = 0;
      this.fixed[r][c] = false;
    }
  }

  #shuffledNumbers() {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.#shuffle(arr);
    return arr;
  }

  #shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}