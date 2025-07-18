import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// vite.config.js
// export default {
//   server: {
//     proxy: {
//       '/register': 'http://localhost:5000',
//     },
//   },
// };