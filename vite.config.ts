import { defineConfig } from "vite";

export default defineConfig({
  base: "/sudoku/",
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
