import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  //Cambios forzar este puerto :D
  server:{
    port: 5175,
    strictPort: true,
  },
})
