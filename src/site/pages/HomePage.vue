<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import AccountHero from '../components/home/AccountHero.vue'
import FeatureGrid from '../components/home/FeatureGrid.vue'
import PlayerAccountPanels from '@/components/dashboard/PlayerAccountPanels.vue'
import PixelText from '../components/PixelText.vue'
import { booted } from '../siteState'
import { whenTransitionDone } from '../composables/usePageTransition'

const featureRef = ref(null)
let observer
let stopWatching
let disposed = false

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const element = featureRef.value
  gsap.set(element, { y: 40, autoAlpha: 0 })
  const start = async () => {
    await whenTransitionDone()
    if (disposed || observer) return
    observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      gsap.to(element, {
        y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      })
    }, { threshold: 0.1 })
    observer.observe(element)
  }
  if (booted.value) start()
  else stopWatching = watch(booted, value => value && start())
})

onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
  stopWatching?.()
  gsap.killTweensOf(featureRef.value)
})
</script>

<template>
  <main class="site-page home-page">
    <header class="home-heading">
      <h1>
        <PixelText
          text="个人中心"
          :px="3"
        />
      </h1>
      <RouterLink
        to="/announcements"
        class="mc-btn is-ghost"
      >社区公告</RouterLink>
    </header>
    <AccountHero />

    <section
      id="features"
      ref="featureRef"
      class="block"
    >
      <h2 class="block-title">
        <PixelText
          text="社区功能"
          :px="3"
        />
      </h2>
      <FeatureGrid />
    </section>

    <section
      id="account"
      class="block"
    >
      <h2 class="block-title">
        <PixelText
          text="账号与服务"
          :px="3"
        />
      </h2>
      <div class="business-page">
        <PlayerAccountPanels />
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-page { display: flex; flex-direction: column; align-items: center; }
.home-heading {
  width: min(var(--site-width), 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}
.home-heading h1 { color: var(--brass-hi); }
.block { width: min(var(--site-width), 100%); margin-top: 40px; }
.block-title { margin-bottom: 24px; }
</style>
