import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://sm.ms/api/v2/',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
        // secure: false
        // Headers: {
        //   'Referer': 'https://smms.app'
        // }
      }
    }
  }
})
