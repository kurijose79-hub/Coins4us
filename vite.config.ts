import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.DEPLOY_BASE ?? '/Coins4us/') : '/',
  plugins: [react(), tailwindcss()],
}))
