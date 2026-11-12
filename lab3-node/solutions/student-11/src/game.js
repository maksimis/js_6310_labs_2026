export class Game2048 {
  constructor() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.history = [];
  }

  startNewGame() {
    this.grid = Array(4).fill().map(() => Array(4).fill(0));
    this.history = [];
    this.addRandomTile();
    this.addRandomTile();
    return this.gridToString();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  saveState() {
    const gridCopy = this.grid.map(row => [...row]);
    this.history.push(gridCopy);
    if (this.history.length > 10) this.history.shift();
  }

  undo() {
    if (this.history.length === 0) {
      return null;
    }
    this.grid = this.history.pop();
    return this.gridToString();
  }

  move(direction) {
    this.saveState();

    let moved = false;
    const dir = direction.toLowerCase();

    if (dir === 'влево' || dir === 'left') moved = this.moveLeft();
    else if (dir === 'вправо' || dir === 'right') moved = this.moveRight();
    else if (dir === 'вверх' || dir === 'up') moved = this.moveUp();
    else if (dir === 'вниз' || dir === 'down') moved = this.moveDown();
    else {
      this.history.pop();
      return '❌ Неверное направление! Используй: вверх, вниз, влево, вправо.';
    }

    if (moved) {
      this.addRandomTile();
      return this.gridToString();
    } else {
      this.history.pop();
      return '️ Так ходить нельзя! Плитки не двигаются.';
    }
  }

  // проверка победы (достигнута плитка 2048)
  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] >= 2048) {
          return true;
        }
      }
    }
    return false;
  }

  // есть ли ещё возможные ходы
  hasAvailableMoves() {
    // 1. Есть ли пустые клетки?
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) return true;
      }
    }

    // 2. есть ли соседние одинаковые плитки
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.grid[r][c];
        // проверяем правого соседа
        if (c + 1 < 4 && this.grid[r][c + 1] === current) return true;
        // проверяем нижнего соседа
        if (r + 1 < 4 && this.grid[r + 1][c] === current) return true;
      }
    }

    return false;
  }

  slideAndMerge(line) {
    const filtered = line.filter(val => val !== 0);
    const merged = [];
    let skip = false;

    for (let i = 0; i < filtered.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        skip = true;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }
    return merged;
  }

  moveLeft() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      const oldRow = [...this.grid[r]];
      this.grid[r] = this.slideAndMerge(this.grid[r]);
      if (oldRow.join(',') !== this.grid[r].join(',')) moved = true;
    }
    return moved;
  }

  moveRight() {
    let moved = false;
    for (let r = 0; r < 4; r++) {
      const oldRow = [...this.grid[r]];
      const reversed = [...this.grid[r]].reverse();
      const merged = this.slideAndMerge(reversed);
      this.grid[r] = merged.reverse();
      if (oldRow.join(',') !== this.grid[r].join(',')) moved = true;
    }
    return moved;
  }

  moveUp() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      const col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
      const oldCol = [...col];
      const merged = this.slideAndMerge(col);
      for (let r = 0; r < 4; r++) {
        this.grid[r][c] = merged[r];
      }
      if (oldCol.join(',') !== merged.join(',')) moved = true;
    }
    return moved;
  }

  moveDown() {
    let moved = false;
    for (let c = 0; c < 4; c++) {
      const col = [this.grid[0][c], this.grid[1][c], this.grid[2][c], this.grid[3][c]];
      const oldCol = [...col];
      const reversed = col.reverse();
      const merged = this.slideAndMerge(reversed).reverse();
      for (let r = 0; r < 4; r++) {
        this.grid[r][c] = merged[r];
      }
      if (oldCol.join(',') !== merged.join(',')) moved = true;
    }
    return moved;
  }

  gridToString() {
    return this.grid.map(row =>
      row.map(cell => cell === 0 ? '⬜' : cell.toString().padEnd(4)).join('')
    ).join('\n');
  }
}