import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Path relatif supaya satu hasil build bisa jalan di mana saja:
  // GitHub Pages (https://user.github.io/nama-repo/), Vercel, atau domain sendiri.
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
