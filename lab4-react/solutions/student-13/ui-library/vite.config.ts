import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [react(), dts({ exclude: ['src/**/*.test.tsx', 'src/setupTests.ts'] })],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'index'
    },
    rollupOptions: { external: ['react', 'react-dom', 'react/jsx-runtime'] }
  }
})
