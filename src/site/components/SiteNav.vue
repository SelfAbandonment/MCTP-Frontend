<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PixelText from './PixelText.vue'
import LanguagePicker from './LanguagePicker.vue'
import logoUrl from '../assets/logo-placeholder.svg'
import { locale, t } from '../i18n'

defineProps({ show: { type: Boolean, default: false } })
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const menuRef = ref(null)
const menuLabel = computed(() => auth.user?.minecraft?.username || auth.user?.username || '账号与设置')
const links = computed(() => [
  { to: '/', key: 'nav.index' },
  ...(auth.isLoggedIn && auth.user ? [{ to: '/home', key: 'nav.home' }] : []),
  { to: '/announcements', key: 'nav.announcements' },
  ...(auth.isLoggedIn && auth.user ? [{ to: '/home#features', key: 'nav.features' }] : []),
  { to: '/feedback', key: 'nav.feedback' },
])
function active(link) {
  if (link.key === 'nav.index') return route.name === 'index'
  if (link.key === 'nav.features') return route.hash === '#features' || route.name === 'feature'
  if (link.key === 'nav.home') return route.name === 'home' && !route.hash
  return route.path === link.to || route.path.startsWith(`${link.to}/`)
}
function closeMenu(restoreFocus = false) {
  if (!menuRef.value?.open) return
  menuRef.value.open = false
  if (restoreFocus) menuRef.value.querySelector('summary').focus()
}
function onOutside(event) {
  if (!menuRef.value?.contains(event.target)) closeMenu()
}
async function signOut() {
  closeMenu()
  if (route.meta.requiresAuth) await router.replace('/')
  auth.logout()
}
watch(() => route.fullPath, () => closeMenu())
onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <header
    class="site-nav"
    :class="{ 'is-hidden': !show }"
    data-fp-ignore
    @keydown.esc.stop.prevent="closeMenu(true)"
  >
    <RouterLink
      to="/"
      class="nav-brand"
      aria-label="MCREATOPIA · 官网介绍"
    >
      <img
        :src="logoUrl"
        alt=""
        width="32"
        height="32"
      >
      <PixelText
        class="nav-wordmark"
        text="MCREATOPIA"
        :px="3"
      />
    </RouterLink>
    <nav
      class="nav-links"
      aria-label="主导航"
    >
      <RouterLink
        v-for="link in links"
        :key="link.key"
        :to="link.to"
        class="nav-link"
        :class="{ 'is-active': active(link) }"
        :aria-current="active(link) ? 'page' : undefined"
        :lang="locale"
      >
        {{ t(link.key) }}
      </RouterLink>
    </nav>
    <details
      ref="menuRef"
      class="account-menu"
    >
      <summary class="account-trigger">
        <span>{{ menuLabel }}</span><span aria-hidden="true">▾</span>
      </summary>
      <div class="account-popover">
        <template v-if="auth.isLoggedIn">
          <RouterLink to="/home">个人中心</RouterLink>
          <RouterLink to="/home#account">账号设置</RouterLink>
          <RouterLink to="/points">我的积分</RouterLink>
          <RouterLink
            v-if="auth.isStaff"
            to="/manage/announcements"
          >社区管理</RouterLink>
          <button
            type="button"
            @click="signOut"
          >
            退出登录
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login">登录</RouterLink>
          <RouterLink to="/register">创建账号</RouterLink>
        </template>
        <RouterLink to="/">官网介绍</RouterLink>
        <LanguagePicker />
      </div>
    </details>
  </header>
</template>

<style scoped>
.site-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  min-height: var(--site-header-height);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  padding: 12px max(24px, calc((100vw - var(--site-width)) / 2));
  background: transparent;
  pointer-events: none;
  color: #fff;
  font-family: var(--font-ui);
}
.site-nav > * { pointer-events: auto; }
.is-hidden { visibility: hidden; }
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  min-width: 44px;
  justify-self: start;
}
.nav-brand img { image-rendering: pixelated; }
.nav-brand, .nav-link, .account-trigger { filter: drop-shadow(0 2px 2px #000); }
.nav-links { display: flex; align-items: center; gap: 8px; }
.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 8px 16px;
  color: #ddd;
  font-size: 17px;
  border-bottom: 3px solid transparent;
}
.nav-link:hover { color: var(--brass-hi); background: #ffffff08; }
.nav-link.is-active { color: var(--brass-hi); border-color: var(--brass); }
.account-menu { justify-self: end; position: relative; min-width: 0; }
.account-trigger {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  max-width: 200px;
  padding: 8px 12px;
  cursor: pointer;
  background: transparent;
}
.account-trigger::-webkit-details-marker { display: none; }
.account-trigger span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.account-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  display: grid;
  width: 224px;
  padding: 12px;
  background: var(--casing-lo);
  border: 2px solid var(--casing-hi);
  box-shadow: 4px 6px 0 #0008;
}
.account-popover :is(a, button) {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 10px;
  background: none;
  border: 0;
  font: inherit;
  color: #fff;
  cursor: pointer;
  text-align: left;
}
.account-popover :is(a, button):hover { background: var(--casing); }
@media (max-width: 1100px) {
  .nav-wordmark { display: none; }
}
@media (max-width: 800px) {
  .site-nav {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: 'brand account' 'links links';
    gap: 4px 12px;
    padding: 8px 16px;
  }
  .nav-brand { grid-area: brand; }
  .account-menu { grid-area: account; }
  .nav-links { grid-area: links; justify-content: center; gap: 4px; }
  .nav-link { padding: 6px 8px; font-size: 16px; }
  .account-trigger { max-width: 180px; }
}
</style>
