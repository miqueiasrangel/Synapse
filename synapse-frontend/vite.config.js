import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === "production" ? "/synapse_ti/" : "/",
    server: {
      hmr: true
    },
    build: {
      outDir: "synapse_ti",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    }
  }
})
