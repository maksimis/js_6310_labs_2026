import { useState, type JSX } from 'react'

import { Button, Card, NextTetromino, TetrisWell } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'

import type { Tetromino } from '@my-app/ui-library'

const TETROMINOES: Tetromino[] = [
  {
    id: 'tetromino-i',
    name: 'I-образное (Прямое)',
    type: 'I',
    defaultColor: '#00bcd4',
    colorCode: 1,
    coords: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ],
  },
  {
    id: 'tetromino-o',
    name: 'O-образное (Квадрат)',
    type: 'O',
    defaultColor: '#f1c40f',
    colorCode: 2,
    coords: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: 'tetromino-t',
    name: 'T-образное',
    type: 'T',
    defaultColor: '#9b59b6',
    colorCode: 3,
    coords: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: 'tetromino-s',
    name: 'S-образное',
    type: 'S',
    defaultColor: '#2ecc71',
    colorCode: 4,
    coords: [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ],
  },
  {
    id: 'tetromino-z',
    name: 'Z-образное',
    type: 'Z',
    defaultColor: '#e74c3c',
    colorCode: 5,
    coords: [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: 'tetromino-j',
    name: 'J-образное',
    type: 'J',
    defaultColor: '#3498db',
    colorCode: 6,
    coords: [
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
  {
    id: 'tetromino-l',
    name: 'L-образное',
    type: 'L',
    defaultColor: '#e67e22',
    colorCode: 7,
    coords: [
      { row: 1, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ],
  },
]

const createEmptyGrid = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0))

const createPresetGrid = (rows: number, cols: number): number[][] => {
  const grid = createEmptyGrid(rows, cols)
  const bottomRows: number[][] = [
    [0, 0, 3, 0, 0, 0, 4, 4, 0, 0],
    [0, 3, 3, 3, 0, 4, 4, 0, 7, 0],
    [6, 0, 2, 2, 5, 5, 0, 0, 7, 0],
    [6, 6, 2, 2, 0, 5, 5, 1, 7, 7],
    [1, 1, 1, 1, 0, 3, 3, 1, 2, 2],
  ]

  bottomRows.forEach((pattern, index) => {
    const targetRow = rows - bottomRows.length + index

    grid[targetRow] = Array.from(
      { length: cols },
      (_, colIdx) => pattern[colIdx % pattern.length],
    )
  })

  return grid
}

type WellSize = '10x20' | '8x12'

interface WellDimensions {
  rows: number
  cols: number
}

const WELL_SIZES: Record<WellSize, WellDimensions> = {
  '10x20': { rows: 20, cols: 10 },
  '8x12': { rows: 12, cols: 8 },
}

const NO_ROOM_MESSAGE = 'Нет места для фигуры в выбранном столбце'

const isWellSize = (value: string): value is WellSize => value in WELL_SIZES

const dropTetromino = (
  grid: number[][],
  tetromino: Tetromino,
  column: number,
  { rows, cols }: WellDimensions,
): number[][] | null => {
  const minRow = Math.min(...tetromino.coords.map((c) => c.row))
  const minCol = Math.min(...tetromino.coords.map((c) => c.col))
  const maxColOffset = Math.max(...tetromino.coords.map((c) => c.col - minCol))
  const startCol = Math.min(column - 1, cols - 1 - maxColOffset)
  const normalized = tetromino.coords.map((c) => ({
    row: c.row - minRow,
    col: c.col - minCol + startCol,
  }))
  const fitsAt = (offset: number): boolean =>
    normalized.every(
      ({ row, col }) => row + offset < rows && grid[row + offset]?.[col] === 0,
    )

  if (!fitsAt(0)) {
    return null
  }

  let dropOffset = 0

  while (fitsAt(dropOffset + 1)) {
    dropOffset += 1
  }

  const next = grid.map((r) => [...r])

  normalized.forEach(({ row, col }) => {
    next[row + dropOffset][col] = tetromino.colorCode
  })

  const survivingRows = next.filter((rowArr) => rowArr.some((cell) => cell === 0))

  return [...createEmptyGrid(rows - survivingRows.length, cols), ...survivingRows]
}

const App = (): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState<number>(2)
  const [customColor, setCustomColor] = useState<string>('')
  const [wellSize, setWellSize] = useState<WellSize>('10x20')
  const [dropColumn, setDropColumn] = useState<number>(4)
  const [dropMessage, setDropMessage] = useState<string>('')
  const [grid, setGrid] = useState<number[][]>(() =>
    createPresetGrid(WELL_SIZES['10x20'].rows, WELL_SIZES['10x20'].cols),
  )

  const { rows, cols } = WELL_SIZES[wellSize]
  const currentTetromino = TETROMINOES[selectedIndex]

  const handleNextPiece = (): void => {
    setSelectedIndex((prev) => (prev + 1) % TETROMINOES.length)
  }

  const handleSizeChange = (value: string): void => {
    if (!isWellSize(value)) {
      return
    }

    const next = WELL_SIZES[value]

    setWellSize(value)
    setDropColumn(1)
    setDropMessage('')
    setGrid(createPresetGrid(next.rows, next.cols))
  }

  const handleDropToColumn = (): void => {
    const next = dropTetromino(grid, currentTetromino, dropColumn, { rows, cols })

    if (next === null) {
      setDropMessage(NO_ROOM_MESSAGE)

      return
    }

    setDropMessage('')
    setGrid(next)
  }

  const handleResetGrid = (): void => {
    setDropMessage('')
    setGrid(createPresetGrid(rows, cols))
  }

  const handleClearGrid = (): void => {
    setDropMessage('')
    setGrid(createEmptyGrid(rows, cols))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Лабораторная работа №4 — Тетрис (вариант 28)</h1>
        <p>
          Демонстрация компонентов отображения следующего тетрамино и стакана с
          фигурами
        </p>
      </header>

      <main className="app-main">
        <Card title="1. Следующее тетрамино">
          <NextTetromino
            tetromino={currentTetromino}
            customColor={customColor || undefined}
          />

          <div className="controls">
            <label className="field">
              Выбрать фигуру:
              <select
                aria-label="Выбрать фигуру"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(Number(e.target.value))}
              >
                {TETROMINOES.map((item, idx) => (
                  <option key={item.id} value={idx}>
                    {item.type} — {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              Цвет фигуры:
              <select
                aria-label="Цвет фигуры"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
              >
                <option value="">По умолчанию ({currentTetromino.defaultColor})</option>
                <option value="#e91e63">Розовый (#e91e63)</option>
                <option value="#009688">Бирюзовый (#009688)</option>
              </select>
            </label>

            <div className="buttons-row">
              <Button size="small" onClick={handleNextPiece}>
                Следующая фигура
              </Button>
            </div>
          </div>
        </Card>

        <Card title="2. Стакан с фигурами">
          <TetrisWell grid={grid} rows={rows} cols={cols} />

          <div className="controls">
            <label className="field">
              Столбец для сброса (1–{cols}):
              <select
                aria-label="Столбец для сброса"
                value={dropColumn}
                onChange={(e) => setDropColumn(Number(e.target.value))}
              >
                {Array.from({ length: cols }, (_, idx) => {
                  const colNum = idx + 1

                  return (
                    <option key={colNum} value={colNum}>
                      Столбец {colNum}
                    </option>
                  )
                })}
              </select>
            </label>

            <label className="field">
              Размерность стакана:
              <select
                aria-label="Размерность стакана"
                value={wellSize}
                onChange={(e) => handleSizeChange(e.target.value)}
              >
                <option value="10x20">10 x 20 (стандартный)</option>
                <option value="8x12">8 x 12 (уменьшенный)</option>
              </select>
            </label>

            <div className="buttons-row">
              <Button size="small" onClick={handleDropToColumn}>
                Сбросить в столбец
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={handleResetGrid}
              >
                Сбросить пример
              </Button>
              <Button
                size="small"
                variant="secondary"
                onClick={handleClearGrid}
              >
                Очистить стакан
              </Button>
            </div>

            {dropMessage && (
              <p className="drop-message" role="alert">
                {dropMessage}
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default App