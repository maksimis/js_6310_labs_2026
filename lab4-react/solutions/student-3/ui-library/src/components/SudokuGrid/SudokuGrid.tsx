import styles from './SudokuGrid.module.css'

export type CellState = 'conflict' | 'empty' | 'initial' | 'user'

export interface CellData {
  state: CellState
  value: number | null
}

export interface SudokuGridProps {
  grid: CellData[][]
  onCellClick: (row: number, col: number) => void
  selectedCell: [number, number] | null
}

export const SudokuGrid = ({ grid, onCellClick, selectedCell }: SudokuGridProps) => {
  return (
    <div className={styles.grid}>
      {grid.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          const isSelected = selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex
          const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8
          const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8
          const classNames = [
            styles.cell,
            styles[cell.state],
            isSelected ? styles.selected : '',
            isRightBorder ? styles.borderRight : '',
            isBottomBorder ? styles.borderBottom : ''
          ].filter(Boolean).join(' ')

          return (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={classNames}
              data-testid={`cell-${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {cell.value !== null ? cell.value : ''}
            </div>
          )
        })
      })}
    </div>
  )
}