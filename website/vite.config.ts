import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const devHost = process.env.VITE_DEV_HOST || '0.0.0.0'
const devPort = Number(process.env.VITE_DEV_PORT || '4173')
const allowedHosts = (process.env.VITE_ALLOWED_HOSTS || 'query.manat.su')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

export default defineConfig({
  plugins: [react()],
  server: {
    host: devHost,
    port: devPort,
    allowedHosts,
  },
})
