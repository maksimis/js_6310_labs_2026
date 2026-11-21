import type { JSX } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  isActive?: boolean
}

export function Button({ children, isActive, className, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      className={`${styles.button} ${isActive ? styles.active : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
}