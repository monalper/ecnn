import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
<<<<<<< HEAD
  server: {
    port: 5174,
    host: true
  }
=======
>>>>>>> f3eb23d59c213da59111a603fb32a1b88604e8cb
})
