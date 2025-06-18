import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: false,
    historyApiFallback: true,
    fs: {
      strict: false,
    },
  },
  base: '/homo/cfr-painel/',
  plugins: [react(), ],
  build: {
    outDir: 'cfr-painel',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
