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
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(14px);
  background: rgba(10, 13, 12, 0.72);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 1.4rem;
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.logo-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand), var(--accent));
  color: #0b1f17;
  font-size: 0.95rem;
}

.logo-text {
  font-family: var(--font-mono);
  color: #d9f7ea;
}

.nav {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-link {
  color: var(--text-soft);
  font-size: 0.88rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-main);
}

.nav-user {
  color: var(--text-soft);
  font-size: 0.82rem;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-btn,
.nav-btn-outline {
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 8px 16px;
  cursor: pointer;
}

.nav-btn {
  background: linear-gradient(130deg, var(--brand), var(--brand-deep));
  color: #072016;
  border: 0;
}

.nav-btn:hover {
  filter: brightness(1.05);
}

.nav-btn-outline {
  background: rgba(15, 19, 18, 0.45);
  border: 1px solid var(--line-strong);
  color: var(--text-main);
}

.nav-btn-outline:hover {
  border-color: var(--brand);
}

.main {
  flex: 1;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 2.6rem 1.4rem 2rem;
  animation: rise-in 0.5s ease;
}

.footer {
  border-top: 1px solid var(--line);
  text-align: center;
  padding: 1.2rem;
  color: var(--text-soft);
  font-size: 0.8rem;
  letter-spacing: 0.02em;
}

.footer a {
  color: var(--brand);
}

@media (max-width: 700px) {
  .header-inner {
    padding: 0 0.95rem;
  }

  .nav {
    gap: 8px;
  }

  .nav-user {
    display: none;
  }

  .main {
    padding: 1.3rem 0.95rem 1.5rem;
  }
}
</style>
