import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    strictPort: true,
  },

  preview: {
    port: 5173,
    strictPort: true,
  },

  build: {
    // Increase chunk size warning threshold (MUI is legitimately large)
    chunkSizeWarningLimit: 800,

    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cached independently, rarely changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // MUI split into two: core components and icons (icons are large)
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-mui-icons': ['@mui/icons-material'],

          // Socket.io — changes rarely
          'vendor-socket': ['socket.io-client'],
        },
      },
    },
  },
});
