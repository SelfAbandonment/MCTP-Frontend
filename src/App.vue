<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <RouterLink to="/" class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">MCTP</span>
        </RouterLink>
        <nav class="nav">
          <template v-if="auth.isLoggedIn">
            <RouterLink to="/dashboard" class="nav-link">Dashboard</RouterLink>
            <span class="nav-user">{{ auth.user?.username }}</span>
            <button class="nav-btn-outline" @click="handleLogout">退出</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-link">登录</RouterLink>
            <RouterLink to="/register" class="nav-btn">注册</RouterLink>
          </template>
        </nav>
      </div>
    </header>
    <main class="main">
      <RouterView />
    </main>
    <footer class="footer">
      MCTP · Django 6.0 + Vue 3 ·
      <a href="https://github.com/SelfAbandonment/MCTP-API" target="_blank">GitHub</a>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d1117; color: #e6edf3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
a { text-decoration: none; color: inherit; }
.app { min-height: 100vh; display: flex; flex-direction: column; }

.header { border-bottom: 1px solid #21262d; padding: 0 2rem; }
.header-inner { max-width: 1100px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.logo { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 1.15rem; }
.logo-icon { font-size: 1.3rem; }
.logo-text { color: #58a6ff; }

.nav { display: flex; align-items: center; gap: 16px; }
.nav-link { color: #8b949e; font-size: 0.9rem; transition: color 0.2s; }
.nav-link:hover, .nav-link.router-link-active { color: #e6edf3; }
.nav-user { font-size: 0.85rem; color: #8b949e; }
.nav-btn { padding: 6px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: 500; background: #238636; color: #fff; transition: background 0.2s; cursor: pointer; border: none; }
.nav-btn:hover { background: #2ea043; }
.nav-btn-outline { padding: 6px 16px; border-radius: 6px; font-size: 0.85rem; background: transparent; border: 1px solid #30363d; color: #e6edf3; cursor: pointer; transition: background 0.2s; }
.nav-btn-outline:hover { background: #21262d; }

.main { flex: 1; max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; width: 100%; }
.footer { text-align: center; padding: 1.5rem; border-top: 1px solid #21262d; color: #8b949e; font-size: 0.82rem; }
.footer a { color: #58a6ff; }

/* 通用卡片 */
.card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; padding: 2rem; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1.25rem; }
.form-label { font-size: 0.85rem; color: #8b949e; }
.form-input { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 10px 12px; color: #e6edf3; font-size: 0.95rem; transition: border-color 0.2s; }
.form-input:focus { outline: none; border-color: #58a6ff; }
.form-input.error { border-color: #f85149; }
.form-error { font-size: 0.8rem; color: #f85149; margin-top: 2px; }
.btn-primary { width: 100%; padding: 10px; border-radius: 6px; border: none; background: #238636; color: #fff; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #2ea043; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.alert { padding: 12px 16px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem; }
.alert-error { background: #2d1a1a; border: 1px solid #f85149; color: #f85149; }
.text-center { text-align: center; }
.text-muted { color: #8b949e; font-size: 0.85rem; }
.link { color: #58a6ff; cursor: pointer; }
.link:hover { text-decoration: underline; }
</style>
