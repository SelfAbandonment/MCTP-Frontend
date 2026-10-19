<script setup>
import { computed, ref } from 'vue'
import { media } from '@/assets/media'

// 场景图按可用性依次回退：关于图 → 入口图 → 纯 CSS 渐变底。
// 素材由美术管线产出，缺失时页面不能出现破图。
const scenePool = [media.about, media.entrance].filter(Boolean)
const sceneIndex = ref(0)
const sceneBroken = ref(scenePool.length === 0)
const sceneSrc = computed(() => scenePool[sceneIndex.value] || '')

function handleSceneError() {
  if (sceneIndex.value < scenePool.length - 1) sceneIndex.value += 1
  else sceneBroken.value = true
}
</script>

<template>
  <div class="auth-layout">
    <aside class="auth-art">
      <img
        v-if="!sceneBroken"
        class="auth-art__scene"
        :src="sceneSrc"
        alt=""
        aria-hidden="true"
        @error="handleSceneError"
      >
      <div
        class="auth-art__veil"
        aria-hidden="true"
      />
      <div
        class="auth-art__grid"
        aria-hidden="true"
      />
      <span
        class="auth-art__word"
        aria-hidden="true"
      >MCTP</span>

      <p class="eyebrow auth-art__kicker">
        一方世界 · 为你而留
      </p>

      <div class="auth-art__copy">
        <p class="auth-art__overline">
          <span>欢迎来到方块世界</span>
          <span aria-hidden="true">01 / 世界</span>
        </p>
        <h1 class="auth-art__title">
          <span>你的下一段故事，</span>
          <span>从这里开始。</span>
        </h1>
        <p class="auth-art__note">
          一个由玩家一起生活的方块世界。
        </p>
      </div>

      <div class="auth-art__foot">
        <span>MCTP / 一起生活，一起创造</span>
        <span class="auth-art__coords">坐标 0 · 0</span>
      </div>
    </aside>
    <div class="auth-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 1.06fr 1fr;
  min-height: 640px;
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  background: var(--panel);
  box-shadow: 0 40px 120px #00000080;
}

.auth-art {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(24px, 4vw, 56px);
  min-height: 560px;
  padding: clamp(26px, 3.4vw, 52px);
  overflow: hidden;
  background:
    radial-gradient(ellipse at 18% 108%, #1c301666 0%, transparent 62%),
    linear-gradient(160deg, #0d140c 0%, #080c07 55%, #050805 100%);
}

.auth-art__scene {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: saturate(0.9) contrast(1.06) brightness(0.74);
  transform: scale(1.03);
}

.auth-art__veil {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(185deg, #06080680 0%, transparent 34%, transparent 52%, #060806e6 100%),
    linear-gradient(90deg, #060806e0 0%, #06080659 56%, #060806cc 100%),
    radial-gradient(circle at 22% 88%, #8ce06a2b 0%, transparent 54%);
}

.auth-art__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(#f2efe20a 1px, transparent 1px),
    linear-gradient(90deg, #f2efe20a 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 72%);
}

.auth-art__word {
  position: absolute;
  right: -0.04em;
  bottom: 0.04em;
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(150px, 23vw, 330px);
  line-height: 0.72;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe21f;
  pointer-events: none;
  user-select: none;
}

.auth-art__kicker {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--brand);
}

.auth-art__copy {
  position: relative;
  z-index: 1;
}

.auth-art__overline {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
  font-family: var(--font-pixel);
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.auth-art__overline span:last-child {
  color: var(--brand);
}

.auth-art__title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.6vw, 62px);
  font-weight: 400;
  line-height: 1.04;
  letter-spacing: -0.015em;
  text-shadow: 0 24px 70px #000000d9;
}

.auth-art__title span {
  display: block;
  white-space: nowrap;
}

.auth-art__note {
  max-width: 34ch;
  margin-top: 22px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--text-soft);
}

.auth-art__foot {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-family: var(--font-pixel);
  font-size: 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}

.auth-art__coords {
  color: #6e7568;
  white-space: nowrap;
}

.auth-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: clamp(26px, 3.6vw, 56px);
  background:
    radial-gradient(ellipse at 100% 0%, #16210f4d 0%, transparent 58%),
    linear-gradient(180deg, #0d120c 0%, #0a0e09 100%);
}

:slotted(h2) {
  margin-bottom: 8px;
  font-family: var(--font-display);
  font-size: clamp(30px, 2.7vw, 40px);
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: 0;
}

:slotted(.auth-description) {
  margin-bottom: 30px;
}

@media (max-width: 900px) {
  .auth-layout {
    grid-template-columns: 1fr;
    min-height: 0;
    border-radius: 14px;
  }

  .auth-art {
    min-height: 0;
    gap: 22px;
    padding: 26px 22px 24px;
  }

  .auth-art__title {
    font-size: clamp(30px, 8.4vw, 50px);
  }

  .auth-art__note {
    display: none;
  }

  .auth-art__word {
    font-size: clamp(130px, 34vw, 220px);
    opacity: 0.7;
  }

  .auth-art__scene {
    opacity: 0.42;
  }

  .auth-art__coords {
    display: none;
  }

  .auth-content {
    padding: 28px 22px 36px;
  }
}

@media (max-width: 420px) {
  .auth-art__overline span:last-child {
    display: none;
  }

  .auth-art__foot {
    padding-top: 14px;
  }

  .auth-content {
    padding: 26px 18px 32px;
  }
}
</style>
