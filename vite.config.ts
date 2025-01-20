import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base:'./',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@assets": path.resolve(__dirname, './src/assets'),
      "@components": path.resolve(__dirname, './src/components'),
      "@views": path.resolve(__dirname, './src/views'),
      "@utils": path.resolve(__dirname, './src/utils'),
    }
  },
  build: {
    sourcemap: false, // 禁用 Source Map
  },
  server: {
    // 服务器监听的端口
    port: 5173,
    // 配置主机名，默认是 'localhost'
    host: 'localhost',

    // 配置代理，常用于跨域请求
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 目标 API 服务器
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },

    // 启用跨域请求
    cors: true,

    // 配置服务器启动时是否打开浏览器
    open: true,
  },
})
