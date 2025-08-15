import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '', // Set base path for GitHub Pages deployment
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias '@' for the 'src' folder
    },
  },
});
