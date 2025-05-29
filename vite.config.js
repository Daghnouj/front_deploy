import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
  extensions: ['.js', '.jsx', '.json','.tsx']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://deploy-back-3.onrender.com',
        changeOrigin: true,
        secure: false
            }
    }
  }
});
