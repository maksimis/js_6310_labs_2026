import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'ui-library': resolve(__dirname, '../ui-library/src/index.ts')
    }
  }
})