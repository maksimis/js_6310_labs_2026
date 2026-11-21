import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import '@my-app/ui-library/style.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
