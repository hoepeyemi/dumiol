import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '5174-coredaoorg-dapptutorial-13oyiyh6gnl.ws-eu118.gitpod.io',
      // Add any other hosts you need to allow
      'localhost',
    ],
  },
}); 