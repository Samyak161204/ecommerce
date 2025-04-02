import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env file
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: true,   // Allows external access
      port: 3000,   // Change port if needed
    },
    define: {
      'process.env': process.env,  // Ensure env variables are accessible
    }
  };
});
