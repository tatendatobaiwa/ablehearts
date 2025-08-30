import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  server: {
    port: 3010
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)), // Fix for ES modules
    },
  },
  build: {
    sourcemap: true, // Enable source maps for better debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/analytics', 'firebase/firestore']
        }
      }
    }
  },
  define: {
    // Fix for some libraries that expect process.env
    'process.env': {}
  }
});
