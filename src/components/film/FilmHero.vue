<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import CinematicButton from '@/components/cinematic/CinematicButton.vue'
import Icon from '@/components/ui/Icon.vue'
import FilmLoader from './FilmLoader.vue'
import FilmVideo from './FilmVideo.vue'
import { media } from '@/assets/media'
import { scrollToId, useMotionContext } from '@/animations/motion'

const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'

const root = ref(null)
const frame = ref(null)

const currentIndex = ref(0)
const paused = ref(false)
const loading = ref(true)
const readyOnce = ref(false)

const shots = media.hero
const current = computed(() => shots[currentIndex.value])

let preloader = null

function warmNextShot() {
  const next = shots[(currentIndex.value + 1) % shots.length]
  if (!next) return
  if (preloader) {
    preloader.remove()
    preloader = null
  }
  const video = document.createElement('video')
  video.src = next.video
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.setAttribute('aria-hidden', 'true')
  video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;'
  document.body.appendChild(video)
  preloader = video
}

watch(currentIndex, () => {
  nextTick(warmNextShot)
})

onBeforeUnmount(() => {
  preloader?.remove()
  preloader = null
})

function selectShot(index) {
  currentIndex.value = index
}

function togglePause() {
  paused.value = !paused.value
}

function handleLoaded() {
  if (readyOnce.value) return
  readyOnce.value = true
  window.setTimeout(() => {
    loading.value = false
  }, 520)
  nextTick(warmNextShot)
}

function goAbout() {
  scrollToId('about')
}

useMotionContext(root, ({ gsap, reduced }) => {
  if (reduced || !frame.value) return
  const frameEl = frame.value

  gsap.set(frameEl, {
    clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
    borderRadius: '0% 0% 40% 10%',
  })

  gsap.from(frameEl, {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    borderRadius: '0% 0% 0% 0%',
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: frameEl,
      start: 'center center',
      end: 'bottom center',
      scrub: true,
    },
  })
})
</script>

<template>
  <section
    id="world"
    ref="root"
    class="hero"
  >
    <div
      ref="frame"
      class="hero__frame"
    >
      <Transition name="hero-shot">
        <FilmVideo
          :key="currentIndex"
          class="hero__shot"
          :src="current.video"
          :poster="current.poster"
          :paused="paused"
          eager
          preload="auto"
          :label="`世界画面：${current.name}`"
          @loaded="handleLoaded"
        />
      </Transition>

      <div
        class="hero__veil"
        aria-hidden="true"
      />
    </div>

    <div
      class="hero__grain"
      aria-hidden="true"
    />

    <header class="hero__type">
      <h1 class="hero__title hero__title--top display display--xl">
        方块之间
      </h1>
      <p
        class="hero__title hero__title--bottom display display--xl"
        aria-hidden="true"
      >
        自有天地
      </p>
    </header>

    <div class="hero__intro">
      <p class="film-mark">
        一起生活，一起创造
      </p>
      <div class="hero__actions">
        <CinematicButton
          title="走进世界"
          to="/register"
          variant="bone"
        />
        <CinematicButton
          title="入服指北"
          :href="joinGuide"
          variant="ghost"
          external
        />
      </div>
    </div>

    <div class="hero__bar">
      <div
        class="hero__shots"
        role="group"
        aria-label="切换世界画面"
      >
        <button
          v-for="(shot, index) in shots"
          :key="shot.name"
          type="button"
          class="hero__shot-btn"
          :class="{ 'is-active': currentIndex === index }"
          :aria-pressed="currentIndex === index"
          @click="selectShot(index)"
        >
          <span class="hero__shot-num">0{{ index + 1 }}</span>
          <span>{{ shot.name }}</span>
        </button>
      </div>

      <div class="hero__tools">
        <button
          type="button"
          class="hero__tool hero__tool--icon"
          :aria-pressed="paused"
          :aria-label="paused ? '播放画面' : '暂停画面'"
          @click="togglePause"
        >
          <Icon
            :name="paused ? 'play' : 'pause'"
            :size="16"
          />
        </button>
        <span
          class="hero__sep"
          aria-hidden="true"
        />
        <button
          type="button"
          class="hero__tool hero__tool--icon"
          aria-label="向下浏览"
          @click="goAbout"
        >
          <Icon
            name="arrow-down"
            :size="16"
          />
        </button>
      </div>
    </div>

    <FilmLoader
      :active="loading"
      label="正在进入世界"
    />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100svh;
  min-height: 620px;
  overflow: hidden;
  background: #050505;
  color: var(--text-main);
}

.hero__frame {
  position: absolute;
  inset: 0;
  z-index: 10;
  overflow: hidden;
  background: #0b0b0b;
  will-change: clip-path, border-radius;
}

.hero__shot {
  position: absolute;
  inset: 0;
}

.hero-shot-enter-active,
.hero-shot-leave-active {
  transition: opacity 900ms ease, transform 1100ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-shot-enter-from {
  opacity: 0;
  transform: scale(1.12);
}

.hero-shot-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.hero__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(180deg, #050505cc 0%, #05050500 26%, #05050500 66%, #050505d9 100%),
    radial-gradient(ellipse at 50% 46%, #05050500 44%, #050505a6 100%);
}

.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 12;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}

.hero__type {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.hero__title {
  position: absolute;
  margin: 0;
  color: #f7f4e9;
  text-shadow: 0 24px 80px #00000080;
  white-space: nowrap;
}

.hero__title--top {
  top: clamp(78px, 12vh, 140px);
  left: var(--page-pad);
}

.hero__title--bottom {
  right: var(--page-pad);
  bottom: clamp(120px, 17vh, 210px);
  text-align: right;
}

.hero__intro {
  position: absolute;
  bottom: clamp(116px, 15vh, 168px);
  left: var(--page-pad);
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 22px;
  max-width: 34rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero__bar {
  position: absolute;
  right: var(--page-pad);
  bottom: 26px;
  left: var(--page-pad);
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 18px;
  border-top: 1px solid #f2efe21f;
}

.hero__shots {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2.6vw, 34px);
}

.hero__shot-btn {
  display: inline-flex;
  align-items: baseline;
  gap: 9px;
  padding: 6px 0;
  border: 0;
  background: none;
  color: #f2efe266;
  font-family: var(--font-sans);
  font-size: 12px;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: color 260ms;
}

.hero__shot-btn:hover { color: #f2efe2cc; }
.hero__shot-btn.is-active { color: #f2efe2; }

.hero__shot-num { font-size: 9px; letter-spacing: 0.14em; opacity: 0.6; }

.hero__tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: none;
  color: #f2efe2aa;
  font-size: 11px;
  letter-spacing: 0.22em;
  cursor: pointer;
  transition: color 220ms;
}

.hero__tool--icon {
  width: 38px;
  height: 38px;
  border: 1px solid #f2efe226;
  border-radius: 999px;
}

.hero__tool--icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.hero__tool:hover { color: #8ce06a; }
.hero__tool--icon:hover { border-color: #8ce06a66; }
.hero__sep { width: 1px; height: 14px; background: #f2efe233; }

@media (max-width: 900px) {
  .hero__intro { bottom: clamp(120px, 16vh, 150px); }
  .hero__title--bottom { bottom: clamp(210px, 28vh, 260px); }
  .hero__title { font-size: clamp(56px, 17vw, 120px); }
}

@media (max-width: 640px) {
  .hero__title--top { top: 92px; }
  .hero__title--bottom { right: var(--page-pad); bottom: auto; top: 30vh; }
  .hero__intro { gap: 16px; bottom: 128px; }
  .hero__actions { width: 100%; }
  .hero__shots { gap: 12px; }
  .hero__shot-btn { font-size: 11px; gap: 4px; }
  .hero__shot-btn span:last-child { display: none; }
  .hero__tools { gap: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-shot-enter-active,
  .hero-shot-leave-active,
  .hero__tool { transition: none; }
}
</style>
