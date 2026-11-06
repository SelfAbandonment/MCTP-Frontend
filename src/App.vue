<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SiteShell from '@/site/SiteShell.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (!loggedIn && route.meta.requiresAuth) {
      router.replace({ path: '/login', query: { redirect: route.fullPath } })
    }
  },
  { flush: 'sync' },
)

</script>

<template>
  <SiteShell />
</template>
