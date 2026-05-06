<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '')
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <header class="header" :class="{ scrolled, 'on-home': isHome }">
      <div class="header-inner">
        <RouterLink to="/" class="logo">
          <span class="logo-icon" aria-hidden="true"></span>
          <span class="logo-text">MCTP</span>
        </RouterLink>

        <nav class="nav" v-if="isHome">
          <a href="#biomes" class="nav-mono">WORLD</a>
          <a href="#craft" class="nav-mono">IDENTITY</a>
          <a href="#craft" class="nav-mono">DOCS</a>
        </nav>

        <div class="nav-right">
          <template v-if="auth.isLoggedIn">
            <RouterLink to="/dashboard" class="nav-mono">DASHBOARD</RouterLink>
            <span class="nav-sep">·</span>
            <span class="nav-user">{{ auth.user?.username }}</span>
            <button class="nav-exit" @click="handleLogout">EXIT</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-mono">ENTER</RouterLink>
            <RouterLink to="/register" class="nav-cta">JOIN BETA</RouterLink>
          </template>
        </div>
      </div>
    </header>
    <main class="main" :class="{ 'main-home': isHome }">
      <RouterView />
    </main>
    <footer v-if="!isHome" class="footer">
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

/* ==============================
   HEADER — Oryzo-style floating
============================== */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  transition: background 0.4s ease, backdrop-filter 0.4s ease;
}

/* When NOT on home: always show subtle bg for legibility */
.header:not(.on-home) {
  background: rgba(9, 8, 6, 0.82);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 138, 61, 0.1);
}

/* On home: transparent → subtle glassmorphism after scroll */
.header.on-home {
  background: transparent;
  backdrop-filter: none;
}

.header.on-home.scrolled {
  background: rgba(9, 8, 6, 0.55);
  backdrop-filter: blur(20px);
}

.header-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 3vw;
  height: 68px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
}

/* ---- Logo ---- */
.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}

.logo-icon {
  width: 28px;
  height: 28px;
  border-radius: 5px;
  background:
    repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0 8px, transparent 8px 9px),
    repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 8px, transparent 8px 9px),
    linear-gradient(180deg, #6ab94f 0 45%, #7d5535 45% 100%);
  border: 1px solid rgba(255, 196, 146, 0.3);
}

.logo-text {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #ede6dc;
}

/* ---- Centre nav (home only) ---- */
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.4rem;
}

/* ---- Right side ---- */
.nav-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  justify-content: flex-end;
}

/* Shared mono text link */
.nav-mono {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(237, 230, 220, 0.45);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-mono:hover,
.nav-mono.router-link-active {
  color: #ede6dc;
}

.nav-sep {
  color: rgba(237, 230, 220, 0.2);
  font-size: 0.7rem;
}

.nav-user {
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  color: rgba(237, 230, 220, 0.38);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* CTA pill - "JOIN BETA" style like Oryzo's single CTA */
.nav-cta {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #090806;
  background: #ff8a3d;
  border: none;
  border-radius: 100px;
  padding: 8px 18px;
  text-decoration: none;
  transition: filter 0.2s, transform 0.18s;
  cursor: pointer;
}

.nav-cta:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
}

.nav-exit {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(237, 230, 220, 0.38);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.nav-exit:hover {
  color: #ff8a3d;
}

/* ==============================
   MAIN
============================== */
.main {
  flex: 1;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 5.8rem 1.4rem 2rem;
  animation: rise-in 0.5s ease;
}

/* On home page: full-width, no padding, no max-width */
.main-home {
  max-width: none;
  padding: 0;
  animation: none;
}

/* ==============================
   FOOTER
============================== */
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

/* ==============================
   RESPONSIVE
============================== */
@media (max-width: 700px) {
  .header-inner {
    padding: 0 1.1rem;
    grid-template-columns: auto 1fr;
  }

  .nav {
    display: none;
  }

  .nav-user {
    display: none;
  }

  .main {
    padding: 5rem 0.95rem 1.5rem;
  }
}
</style>

