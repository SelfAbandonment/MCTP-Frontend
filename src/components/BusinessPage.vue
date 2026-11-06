<template>
  <main class="business-page site-page">
    <nav
      class="business-nav"
      aria-label="账号与社区功能"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
      >
        <PixelText
          :text="link.text"
          :px="2"
        />
      </RouterLink>
      <RouterLink
        v-if="auth.isStaff"
        to="/manage"
      ><PixelText
        text="管理区"
        :px="2"
      /></RouterLink>
    </nav>
    <RouterView />
  </main>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import PixelText from '@/site/components/PixelText.vue'

const auth = useAuthStore()
const links = [
  { to: '/home', text: '主页面' },
  { to: '/dashboard', text: '玩家中心' },
  { to: '/points', text: '积分' },
  { to: '/announcements', text: '公告' },
]
</script>

<style scoped>
.business-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--line);
}
.business-nav a {
  padding: 10px 14px;
  background: linear-gradient(180deg, var(--casing), var(--casing-lo));
  color: var(--brass-hi);
  box-shadow: 0 0 0 2px var(--outline), inset 2px 2px 0 var(--casing-hi), inset -2px -2px 0 #111;
}
.business-nav a.router-link-active {
  color: var(--ink);
  background: linear-gradient(180deg, var(--brass-hi), var(--brass));
  box-shadow: 0 0 0 2px var(--outline), inset 2px 2px 0 var(--brass-hi), inset -2px -2px 0 var(--brass-lo);
}
.business-page {
  padding-inline: max(5vw, calc((100vw - 1240px) / 2));
}
@media (max-width: 700px) {
  .business-nav { gap: 10px; }
  .business-nav a { padding: 10px; }
}
</style>
