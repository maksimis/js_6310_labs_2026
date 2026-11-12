import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import { App } from './App'
import './style.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Не найден корневой элемент приложения')
}

createRoot(root).render(<StrictMode><App /></StrictMode>)
