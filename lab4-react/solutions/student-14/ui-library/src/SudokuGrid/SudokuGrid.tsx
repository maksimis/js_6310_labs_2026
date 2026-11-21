import React from 'react'

import styles from './SudokuGrid.module.css'

export type CellValue = number | null
export type Notes = number[]

export interface CellData {
  value: CellValue
  notes: Notes
  isInitial?: boolean
}

export interface SudokuGridProps {
  grid: CellData[][]
  onCellClick?: (row: number, col: number) => void
  selectedCell?: { row: number, col: number } | null
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({
  grid,
  onCellClick,
  selectedCell,
}) => {
  return (
    <div className={styles.grid}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => {
            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
            const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8
            const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={[
                  styles.cell,
                  cell.isInitial ? styles.initial : '',
                  isSelected ? styles.selected : '',
                  isRightBorder ? styles.rightBorder : '',
                  isBottomBorder ? styles.bottomBorder : '',
                ].join(' ')}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
              >
                {cell.value ? (
                  <span className={styles.value}>{cell.value}</span>
                ) : (
                  <div className={styles.notes}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <span key={num} className={styles.note}>
                        {cell.notes.includes(num) ? num : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}