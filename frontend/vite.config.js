import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/ethers")) return "ethers";
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "vendor";
        },
      },
    },
  },
})
