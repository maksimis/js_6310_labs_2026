import type { JSX } from 'react'

import styles from './NextTetromino.module.css'

import type { Tetromino } from '../types'

export interface NextTetrominoProps {
  tetromino: Tetromino
  title?: string
  customColor?: string
}

export const NextTetromino = ({
  tetromino,
  title = 'Следующее тетрамино',
  customColor,
}: NextTetrominoProps): JSX.Element => {
  const gridSize = tetromino.gridSize ?? 4
  const color = customColor ?? tetromino.defaultColor
  const coordsList = tetromino.coords
    .map((coord) => `(${coord.row},${coord.col})`)
    .join(', ')

  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize)
    const col = index % gridSize
    const isFilled = tetromino.coords.some(
      (coord) => coord.row === row && coord.col === col,
    )

    return { row, col, isFilled }
  })

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>{title}</h3>

      <div
        className={styles.grid}
        role="grid"
        aria-label={`Превью ${tetromino.name}`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 24px)`,
        }}
      >
        {cells.map(({ row, col, isFilled }) => (
          <div
            key={`${row}-${col}`}
            role="gridcell"
            aria-label={`Ячейка ${row},${col}`}
            data-filled={isFilled ? 'true' : 'false'}
            className={
              isFilled ? `${styles.cell} ${styles.filled}` : styles.cell
            }
            style={isFilled ? { backgroundColor: color } : undefined}
          />
        ))}
      </div>

      <div className={styles.info}>
        <p>
          Фигура: {tetromino.name} ({tetromino.type})
        </p>
        <p>Цвет по умолчанию: {tetromino.defaultColor}</p>
        <p>Координаты: {coordsList}</p>
      </div>
    </div>
  )
}