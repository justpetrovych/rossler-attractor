import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use environment variable for base path, default to repo name for local dev
const base = process.env.VITE_BASE_PATH || '/rossler-attractor/'

export default defineConfig({
  plugins: [react()],
  base,
})
