import React from 'react'

import styles from './Tile.module.css'

export interface TileProps {
  value: number
}

export const Tile: React.FC<TileProps> = ({ value }) => {
  const className = [
    styles.tile,
    value > 0 ? styles[`tile--${value}`] : styles['tile--empty']
  ].join(' ')

  return (
    <div className={className}>
      {value > 0 ? value : ''}
    </div>
  )
}