import {defineConfig} from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('gsap'))   return 'vendor-gsap'
          if (id.includes('lenis'))  return 'vendor-lenis'
          if (id.includes('preact')) return 'vendor-preact'
        },
      },
    },
  },
})
