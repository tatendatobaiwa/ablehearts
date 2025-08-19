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
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/analytics', 'firebase/firestore'],
          'vendor-ui': ['lucide-react', 'react-icons', 'styled-components'],
          'vendor-utils': ['axios', 'jspdf', 'emailjs-com'],
          
          // App chunks
          'components-core': [
            './src/components/Header/Header.jsx',
            './src/components/Footer/Footer.jsx',
            './src/components/ErrorBoundary/ErrorBoundary.jsx'
          ],
          'components-forms': [
            './src/components/DonationForm.jsx',
            './src/components/NewsLetterSignup.jsx',
            './src/components/CookieConsent.jsx'
          ],
          'utils': [
            './src/utils/analytics.js',
            './src/utils/performance.js',
            './src/utils/security.js'
          ]
        }
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
