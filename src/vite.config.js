import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Ensure Vite builds to the correct directory
  },
});
