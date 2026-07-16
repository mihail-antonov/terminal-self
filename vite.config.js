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
        manualChunks: {
          'vendor-gsap':   ['gsap'],
          'vendor-lenis':  ['lenis'],
          'vendor-preact': ['preact', 'preact/hooks'],
        },
      },
    },
  },
})
