import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { todayTheme } from './src/data/dailyThemeFallback'

export default defineConfig({
  base: '/arch-pull/',
  plugins: [
    react(),
    {
      name: 'api-mock',
      configureServer(server) {
        server.middlewares.use('/api/theme', (_req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(todayTheme))
        })
      },
    },
  ],
})
