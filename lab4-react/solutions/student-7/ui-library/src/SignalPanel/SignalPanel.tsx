import React from 'react'

import styles from './SignalPanel.module.css'

export type SignalColor = 'red' | 'green' | 'blue' | 'yellow';

export interface SignalPanelProps {
  activeColor: SignalColor | null;
  disabled: boolean;
  onColorClick: (color: SignalColor) => void;
}

export const SignalPanel: React.FC<SignalPanelProps> = ({
  activeColor,
  disabled,
  onColorClick,
}) => {
  const colors: SignalColor[] = ['red', 'green', 'blue', 'yellow']

  return (
    <div className={styles.panel}>
      {colors.map((color) => {
        const isActive = activeColor === color
        const className = [
          styles.button,
          styles[color],
          isActive ? styles.active : '',
        ].join(' ')

        return (
          <button
            key={color}
            type="button"
            className={className}
            disabled={disabled}
            onClick={() => onColorClick(color)}
            aria-label={`Цвет ${color}`}
          />
        )
      })}
    </div>
  )
}