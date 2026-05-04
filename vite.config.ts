import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/pinoy-recipe-finder/',
  plugins: [react()],
})
