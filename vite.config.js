import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  publicDir: '../public',
  base: '/',
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          helmet: ['react-helmet-async']
        },
        // Consistent asset naming for better caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // Ensure all public files are copied including _redirects
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
