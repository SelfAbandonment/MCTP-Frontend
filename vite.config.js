import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  // 相对 base：同一份 dist 既能部署到 /MCTP-Frontend/，也能部署到 /MCTP-Frontend/preview/pr-N/
  base: './',
  server: {
    watch: {
      // The agent file tool writes through temp files; Windows watchers can
      // otherwise crash Vite with EBUSY. Polling is stable here.
      usePolling: true,
      interval: 260,
      ignored: ['**/node_modules/**', '**/.git/**', '**/*.tmp', '**/*.tmpdir/**'],
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
