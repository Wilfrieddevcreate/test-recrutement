import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// /api est relayé vers Laravel (en dev comme en preview) : pas de CORS ni de variable d'env côté navigateur.
// API_PROXY_TARGET permet de viser un autre hôte, par exemple le service `api` dans Docker.
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:8000'
const proxy = { '/api': { target: apiTarget, changeOrigin: true } }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy },
  preview: { port: 5173, proxy },
})
