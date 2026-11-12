import type { JSX } from 'react'
import styles from './Card.module.css'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {children}
    </div>
  )
}