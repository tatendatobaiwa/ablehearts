import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh for better development experience
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic'
    })
  ],
  base: '/', // Set base for GitHub Pages
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Alias '@' for the 'src' folder
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Advanced chunking strategy for optimal loading
        manualChunks: {
          // Vendor chunk for stable dependencies
          vendor: ['react', 'react-dom'],
          // Router chunk for navigation
          router: ['react-router-dom'],
          // Utils chunk for utilities
          utils: ['axios', 'firebase'],
          // UI chunk for UI components
          ui: ['lucide-react', 'react-icons']
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 500, // Stricter chunk size limit
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2 // Multiple passes for better compression
      },
      mangle: {
        safari10: true // Fix Safari 10 issues
      }
    },
    // Enable source maps for better debugging in production
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Enable asset inlining for small files
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react-helmet-async',
      'prop-types'
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: ['firebase']
  },
  // Performance optimizations
  server: {
    // Enable HTTP/2 for development
    https: false,
    // Optimize HMR
    hmr: {
      overlay: false
    }
  },
  // CSS optimizations
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
});
