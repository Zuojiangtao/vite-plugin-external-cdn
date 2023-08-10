import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { importToCDN, autoComplete } from 'vite-plugin-external-cdn'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // CommonJs
    importToCDN({
      modules: [
        autoComplete('react'),
        autoComplete('react-dom'),
        // autoComplete('moment'),
        // autoComplete('antd')
      ],
    })
  ],
})
