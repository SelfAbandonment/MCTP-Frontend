<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const contentEl = ref(null)
const isHome = computed(() => route.path === '/')
const showChrome = computed(() => route.meta.chrome !== false)

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (!loggedIn && route.meta.requiresAuth) {
      router.replace({ path: '/login', query: { redirect: route.fullPath } })
    }
  },
  { flush: 'sync' },
)

function focusMain() {
  contentEl.value?.focus({ preventScroll: true })
}

onMounted(() => {
  if (!import.meta.env.DEV) return
  const params = new URLSearchParams(window.location.search)
  const scroll = Number(params.get('scroll'))
  if (Number.isFinite(scroll) && scroll > 0) {
    window.setTimeout(() => {
      window.scrollTo({ top: scroll, behavior: 'instant' })
    }, 1100)
  }
})
</script>

<template>
  <div
    class="app"
    :class="{ 'app-home': isHome }"
  >
    <a
      class="skip-link"
      href="#main-content"
      @click.prevent="focusMain"
    >跳至内容</a>
    <SiteHeader v-if="showChrome" />
    <main
      id="main-content"
      ref="contentEl"
      tabindex="-1"
      :class="isHome ? 'main-home' : 'site-main'"
    >
      <RouterView />
    </main>
    <SiteFooter v-if="showChrome" />
  </div>
</template>
