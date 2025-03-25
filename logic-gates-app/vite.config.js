import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL || 'http://localhost:8080'),
  },
  server: {
    port: 3000
  }
});
