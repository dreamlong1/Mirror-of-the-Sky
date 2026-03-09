import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Mirror-of-the-Sky/',
  plugins: [react()],
})
