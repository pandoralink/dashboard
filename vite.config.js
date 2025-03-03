import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/dashboard/',  // 添加基础路径配置
  plugins: [react()],
  server: {
    open: true,
    port: 3000
  },
  build: {
    outDir: 'docs'  // 设置打包输出目录为 docs
  },
  esbuild: {
    loader: 'jsx'
  }
});