import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    core: 'src/core/index.ts',
    server: 'src/server.ts',
  },
  format: ['esm', 'cjs'],
  platform: 'neutral',
  target: 'es2022',
  dts: true,
  clean: true,
  sourcemap: true,
  publint: true,
  unused: false,
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/server'],
})
