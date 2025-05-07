import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bridgex.api.abdullahabaza.me',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'wss://bridgex.api.abdullahabaza.me',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
})
