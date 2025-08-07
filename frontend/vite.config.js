import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          helmet: ['react-helmet-async']
        }
      }
    },
    // Ensure all public files are copied to build directory
    copyPublicDir: true
  },
  server: {
    port: 3000,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  },
  preview: {
    port: 3000,
    host: true,
    historyApiFallback: {
      index: '/index.html'
    }
  }
})
