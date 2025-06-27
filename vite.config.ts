import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pixi-sudoku/',
  build: {
    chunkSizeWarningLimit: 1000,
  }
}); 