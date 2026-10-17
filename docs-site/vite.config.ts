import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => ({
  root,
  plugins: [react()],
  base: mode === 'development' ? '/docs/' : '/react-avatar-kit/docs/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: { port: 5174 },
  preview: { host: '127.0.0.1', port: 4174, strictPort: true },
}))
