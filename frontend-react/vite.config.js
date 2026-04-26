import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/search': 'http://127.0.0.1:5000',
      '/career-path': 'http://127.0.0.1:5000',
      '/log_audit': 'http://127.0.0.1:5000',
      '/get_audit_logs': 'http://127.0.0.1:5000',
      '/get_embeddings': 'http://127.0.0.1:5000',
      '/update_embeddings': 'http://127.0.0.1:5000',
      '/update-json': 'http://127.0.0.1:5000',
      '/auth': 'http://127.0.0.1:5000',
    }
  }
})
