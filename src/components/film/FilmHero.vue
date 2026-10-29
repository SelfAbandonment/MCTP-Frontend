<script setup>
import { ref } from 'vue'
import CinematicButton from '@/components/cinematic/CinematicButton.vue'
import Icon from '@/components/ui/Icon.vue'
import GearScene from '@/components/home/GearScene.vue'
import { scrollToId } from '@/animations/motion'

const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'

const root = ref(null)

function goAbout() {
  scrollToId('about')
}
</script>

<template>
  <section
    id="world"
    ref="root"
    class="hero"
  >
    <div class="hero__frame">
      <GearScene class="hero__scene" />
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
      <h1
        class="hero__title hero__title--top display display--xl"
        aria-label="MCREATOPIA 方块社区"
      >
        MCREATOPIA
      </h1>
      <p
        class="hero__title hero__title--bottom display display--xl"
        aria-hidden="true"
      >
        欢迎加入
      </p>
    </header>

    <div class="hero__intro">
      <div class="hero__actions">
        <CinematicButton
          title="加入世界"
          to="/register"
          variant="bone"
        />
        <CinematicButton
          title="入服指南"
          :href="joinGuide"
          variant="ghost"
          external
        />
      </div>
    </div>

    <div class="hero__bar">
      <p class="hero__caption">
        机械动力 · 大齿轮 16 齿 / 实时渲染
      </p>

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
  background:
    radial-gradient(120% 90% at 62% 34%, #1c2417 0%, #0b0f09 56%, #050705 100%);
}

.hero__scene {
  position: absolute;
  inset: 0;
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
  top: clamp(39px, 12vh, 70px);
  left: var(--page-pad);
}

.hero__title--bottom {
  right: var(--page-pad);
  bottom: clamp(60px, 17vh, 105px);
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

.hero__caption {
  margin: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 10px;
  letter-spacing: 0.24em;
  color: #c9c6ae88;
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
  .hero__caption { font-size: 9px; letter-spacing: 0.16em; }
}

@media (prefers-reduced-motion: reduce) {
  .hero__tool { transition: none; }
}
</style>
