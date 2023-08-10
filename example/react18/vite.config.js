import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PluginExternalCDN, autoComplete } from 'vite-plugin-external-cdn'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // CommonJs
    PluginExternalCDN({
      modules: [
        autoComplete('react'),
        autoComplete('react-dom'),
        // autoComplete('moment'),
        // autoComplete('antd')
      ],
    })
  ],
})
