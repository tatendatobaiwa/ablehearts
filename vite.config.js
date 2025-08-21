import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // Set base for GitHub Pages
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias '@' for the 'src' folder
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Simplified chunking - let Vite handle it automatically for now
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit temporarily
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});
