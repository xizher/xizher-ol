import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  root: '__tests__',
  server: {
    port: 8080
  },
  plugins: [
    vue(),
  ]
})
