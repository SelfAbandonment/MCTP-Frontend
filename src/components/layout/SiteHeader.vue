<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Icon from '@/components/ui/Icon.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const scrolled = ref(false)
const hidden = ref(false)
const menuOpen = ref(false)
const lastY = ref(0)
let ticking = false

const isHome = computed(() => route.path === '/')
const playerTarget = computed(() => (auth.isLoggedIn ? '/dashboard' : '/login'))
const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'

const navLinks = computed(() => [
  { label: '首页', to: '/' },
  { label: '公告', to: '/announcements' },
  { label: '入服', href: joinGuide, external: true },
  { label: '玩家中心', to: playerTarget.value },
])

function updateScrollState() {
  const y = window.scrollY || 0
  scrolled.value = y > 28
  if (!menuOpen.value) {
    if (y > 320 && y > lastY.value + 8) hidden.value = true
    else if (y < lastY.value - 8 || y < 120) hidden.value = false
  }
  lastY.value = y
  ticking = false
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScrollState)
}

function onKeydown(event) {
  if (event.key === 'Escape') menuOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}

function logout() {
  auth.logout()
  closeMenu()
  router.push('/login')
}

watch(menuOpen, (open) => {
  document.body.classList.toggle('menu-open', open)
  if (open) hidden.value = false
})

watch(
  () => route.fullPath,
  () => closeMenu(),
)

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('menu-open')
})
</script>

<template>
  <header
    class="site-header"
    :class="{
      'is-transparent': isHome && !scrolled,
      'is-scrolled': scrolled,
      'is-hidden': hidden,
      'is-open': menuOpen,
    }"
  >
    <div class="site-header__inner">
      <RouterLink
        class="brand"
        to="/"
        aria-label="MCTP"
        @click="closeMenu"
      >
        <span
          class="brand__cube"
          aria-hidden="true"
        />
        <span class="brand__name display">MCTP</span>
      </RouterLink>

      <nav
        class="site-nav"
        aria-label="主导航"
      >
        <template
          v-for="link in navLinks"
          :key="link.label"
        >
          <RouterLink
            v-if="link.to"
            :to="link.to"
            class="site-nav__link"
          >
            {{ link.label }}
          </RouterLink>
          <a
            v-else
            :href="link.href"
            class="site-nav__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </template>
        <button
          v-if="auth.isLoggedIn"
          class="site-nav__link site-nav__logout"
          type="button"
          @click="logout"
        >
          退出
        </button>
      </nav>

      <div class="site-actions">
        <RouterLink
          class="cine-btn cine-btn--lime cine-btn--header"
          :to="playerTarget"
        >
          <span>{{ auth.isLoggedIn ? '进入世界' : '登录' }}</span>
          <Icon
            name="arrow-up-right"
            :size="14"
            class="cine-btn__icon"
          />
        </RouterLink>
        <button
          class="menu-toggle"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
          @click="menuOpen = !menuOpen"
        >
          <Icon
            :name="menuOpen ? 'close' : 'menu'"
            :size="18"
          />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="mobile-menu"
      >
        <nav
          class="mobile-menu__nav"
          aria-label="移动端导航"
        >
          <RouterLink
            v-for="link in navLinks"
            :key="`m-${link.label}`"
            v-bind="link.to ? { to: link.to } : { href: link.href, target: '_blank', rel: 'noopener noreferrer' }"
            class="mobile-menu__link display"
            @click="link.to ? closeMenu() : null"
          >
            <span>{{ link.label }}</span>
            <Icon
              name="arrow-up-right"
              :size="16"
            />
          </RouterLink>
          <button
            v-if="auth.isLoggedIn"
            class="mobile-menu__link mobile-menu__logout display"
            type="button"
            @click="logout"
          >
            <span>退出</span>
            <Icon
              name="arrow-up-right"
              :size="16"
            />
          </button>
        </nav>
        <div class="mobile-menu__foot">
          <span>一起生活，一起创造</span>
          <span
            class="brand__cube"
            aria-hidden="true"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 90;
  padding: 18px clamp(16px, 4vw, 48px) 0;
  transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1), padding 320ms;
  pointer-events: none;
}

.site-header__inner {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: min(1560px, 100%);
  margin-inline: auto;
  padding: 9px 14px 9px 16px;
  border: 1px solid transparent;
  border-radius: 999px;
  transition: background 360ms, border-color 360ms, backdrop-filter 360ms, box-shadow 360ms;
}

.site-header.is-scrolled .site-header__inner,
.site-header.is-open .site-header__inner {
  background: #050505b8;
  border-color: #f2efe21f;
  backdrop-filter: blur(18px) saturate(1.2);
  box-shadow: 0 18px 60px #00000080;
}

.site-header.is-transparent .site-header__inner { background: transparent; }
.site-header.is-hidden { transform: translateY(calc(-100% - 24px)); }

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand__cube {
  width: 22px;
  height: 25px;
  display: inline-block;
  background: linear-gradient(150deg, #9be378 0 45%, #62be46 46% 72%, #b07e52 73%);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  filter: drop-shadow(0 0 14px #8ce06a66);
}

.brand__name {
  font-size: 26px;
  line-height: 1;
  letter-spacing: 0.02em;
}


.site-nav {
  display: flex;
  align-items: center;
  gap: 6px;
}

.site-nav__link {
  position: relative;
  padding: 10px 14px;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: #f2efe2cc;
  transition: color 220ms;
}

.site-nav__link::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 5px;
  height: 1px;
  background: var(--brand);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.site-nav__link:hover { color: var(--brand); }
.site-nav__link:hover::after { transform: scaleX(1); transform-origin: left; }

.site-nav__logout {
  background: none;
  border: 0;
  color: rgba(242, 239, 226, 0.5);
}

.site-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cine-btn--header {
  min-height: 40px;
  padding: 0 20px;
  font-size: 12px;
  letter-spacing: 0.16em;
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid #f2efe226;
  border-radius: 999px;
  background: #ffffff0a;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.menu-toggle { color: var(--text-main); }

.mobile-menu {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: -1;
  padding: 108px clamp(20px, 7vw, 48px) 32px;
  background: radial-gradient(ellipse at 80% 0%, #14210f 0%, #050505 62%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border: 0;
  border-bottom: 1px solid #f2efe214;
  background: none;
  font-size: clamp(38px, 11vw, 68px);
  line-height: 1;
  color: var(--text-main);
  text-align: left;
}

.mobile-menu__link span:last-child {
  font-size: 16px;
  color: var(--brand);
}

.mobile-menu__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
  font-size: 11px;
  letter-spacing: 0.32em;
  color: rgba(242, 239, 226, 0.5);
}

.menu-enter-active,
.menu-leave-active { transition: opacity 340ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1); }
.menu-enter-from,
.menu-leave-to { opacity: 0; transform: translateY(-12px); }

@media (max-width: 980px) {
  .site-nav { display: none; }
  .menu-toggle { display: inline-flex; }
}

@media (max-width: 560px) {
  .brand__sub { display: none; }
  .site-header { padding: 12px 12px 0; }
  .site-header__inner { padding: 8px 10px 8px 14px; }
  .cine-btn--header { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .site-header,
  .site-header__inner,
  .site-nav__link::after { transition: none; }
}
</style>
