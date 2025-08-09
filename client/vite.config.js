import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from "path"
import tailwindcss from '@tailwindcss/vite'

// Load env based on current mode
let env;
if (process.env.NODE_ENV === "development") {
  env = loadEnv("development", process.cwd())
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ...(process.env.NODE_ENV === "development" && {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          secure: false
        }
      },
      host: true, // or '0.0.0.0'
      port: 5173,
    }
  })
});
