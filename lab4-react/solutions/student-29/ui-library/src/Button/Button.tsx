import React from 'react'

import styles from './Button.module.css'

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  type?: 'submit' | 'button';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  type = 'button',
  onClick,
  children,
}) => {
  const className = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    disabled ? styles.disabled : '',
  ].join(' ')

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}