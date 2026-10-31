<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { media } from '@/assets/media'
import AccountPanel from '@/components/dashboard/AccountPanel.vue'
import MinecraftPanel from '@/components/dashboard/MinecraftPanel.vue'
import SecurityPanel from '@/components/dashboard/SecurityPanel.vue'
import ServicePanel from '@/components/dashboard/ServicePanel.vue'
import CommunityPulsePanel from '@/components/dashboard/CommunityPulsePanel.vue'
import PointsPanel from '@/components/dashboard/PointsPanel.vue'

const auth = useAuthStore()
// 场景图回退链：关于图 → 入口图 → 纯 CSS 渐变底，避免素材缺失时出现破图。
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
  <section class="player-welcome">
    <img
      v-if="!sceneBroken"
      class="player-welcome__scene"
      :src="sceneSrc"
      alt=""
      aria-hidden="true"
      @error="handleSceneError"
    >
    <div
      class="player-welcome__veil"
      aria-hidden="true"
    />
    <div
      class="player-welcome__grid"
      aria-hidden="true"
    />
    <span
      class="player-welcome__word"
      aria-hidden="true"
    >玩家</span>
    <div class="player-welcome__copy">
      <p class="eyebrow">
        属于你的角落
      </p>
      <h1>你好，{{ auth.user?.username }}。</h1>
      <p class="player-welcome__sub">
        下一段故事，从你开始。
      </p>
      <RouterLink
        to="/announcements"
        class="welcome-link"
      >
        <span>看看社区的新鲜事</span>
        <span
          class="welcome-link__icon"
          aria-hidden="true"
        >↗</span>
      </RouterLink>
    </div>
  </section>

  <div class="player-grid">
    <CommunityPulsePanel />
    <PointsPanel />
    <AccountPanel />
    <MinecraftPanel />
    <SecurityPanel />
    <ServicePanel />
  </div>
</template>

<style scoped>
.player-welcome {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-end;
  min-height: clamp(300px, 36vw, 400px);
  margin-bottom: 26px;
  padding: clamp(26px, 4vw, 52px);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    radial-gradient(ellipse at 84% 12%, #1c30164d 0%, transparent 60%),
    linear-gradient(150deg, #0d140c 0%, #060806 100%);
  box-shadow: 0 30px 90px #00000059;
}

.player-welcome__scene {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
  filter: saturate(0.88) contrast(1.05) brightness(0.72);
  transform: scale(1.03);
}

.player-welcome__veil {
  position: absolute;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    linear-gradient(92deg, #060806f2 0%, #060806a6 46%, #0608062e 100%),
    linear-gradient(180deg, transparent 42%, #060806d9 100%),
    radial-gradient(circle at 18% 100%, #8ce06a26 0%, transparent 52%);
}

.player-welcome__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image:
    linear-gradient(#f2efe208 1px, transparent 1px),
    linear-gradient(90deg, #f2efe208 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(180deg, #000 0%, transparent 78%);
}

.player-welcome__word {
  position: absolute;
  right: -0.03em;
  top: -0.08em;
  z-index: 0;
  font-family: var(--font-display);
  font-size: clamp(110px, 15vw, 210px);
  line-height: 0.9;
  letter-spacing: 0.02em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe220;
  pointer-events: none;
  user-select: none;
}

.player-welcome__copy {
  position: relative;
  z-index: 1;
  max-width: min(62ch, 72%);
  overflow-wrap: anywhere;
}

.player-welcome h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 4.4vw, 62px);
  font-weight: 400;
  line-height: 1.04;
}

.player-welcome__sub {
  margin: 14px 0 24px;
  font-size: 13px;
  color: var(--text-soft);
}

.welcome-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: #ffffff08;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-main);
  transition: color 200ms, border-color 200ms, background 200ms, transform 200ms;
}

.welcome-link:hover {
  border-color: var(--brand);
  background: #8ce06a14;
  color: var(--brand);
  transform: translateY(-1px);
}

.welcome-link__icon {
  font-family: var(--font-pixel);
  font-size: 10px;
  color: var(--brand);
}

.player-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; align-items: start; }

@media (max-width: 900px) {
  .player-welcome__copy { max-width: 100%; }
  .player-welcome__word { font-size: clamp(96px, 22vw, 150px); opacity: 0.8; }
}

@media (max-width: 700px) {
  .player-welcome { min-height: 280px; padding: 24px; }
  .player-welcome h1 { font-size: clamp(30px, 9vw, 44px); }
  .player-welcome__scene { opacity: 0.42; }
  .player-grid { grid-template-columns: 1fr; gap: 22px; }
}
</style>
