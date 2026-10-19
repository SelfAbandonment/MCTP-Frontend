<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import FilmVideo from './FilmVideo.vue'

const props = defineProps({
  item: { type: Object, required: true },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  external: { type: Boolean, default: false },
  soon: { type: Boolean, default: false },
  big: { type: Boolean, default: false },
})

const root = ref(null)
const glow = ref({ x: 0, y: 0, active: false })

const ctaTag = computed(() => (props.to ? RouterLink : 'a'))
const ctaAttrs = computed(() => {
  if (props.to) return { to: props.to }
  return {
    href: props.href || '#',
    ...(props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
})
const glowStyle = computed(() => ({
  opacity: glow.value.active ? 1 : 0,
  background: `radial-gradient(150px circle at ${glow.value.x}px ${glow.value.y}px, #8ce06a88, #00000000)`,
}))

function handleMove(event) {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  glow.value = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true }
}

function handleLeave() {
  glow.value = { ...glow.value, active: false }
}
</script>

<template>
  <article
    ref="root"
    class="bento-card"
    :class="{ 'bento-card--big': big }"
    @pointermove="handleMove"
    @pointerenter="handleMove"
    @pointerleave="handleLeave"
  >
    <FilmVideo
      v-if="item.video"
      class="bento-card__video"
      :src="item.video"
      :poster="item.poster"
      preload="none"
      :label="item.title"
    />
    <img
      v-else
      class="bento-card__image"
      :src="item.image"
      :alt="item.title"
      loading="lazy"
      decoding="async"
    >
    <div
      class="bento-card__scrim"
      aria-hidden="true"
    />
    <div class="bento-card__body">
      <h3 class="bento-card__title display">
        {{ item.title }}
      </h3>
      <component
        :is="soon ? 'span' : ctaTag"
        v-bind="soon ? {} : ctaAttrs"
        class="bento-card__cta"
        :class="{ 'is-soon': soon }"
      >
        <span
          class="bento-card__glow"
          aria-hidden="true"
          :style="glowStyle"
        />
        <span>{{ soon ? '即将开放' : item.cta }}</span>
        <span aria-hidden="true">{{ soon ? '◌' : '↗' }}</span>
      </component>
    </div>
  </article>
</template>

<style scoped>
.bento-card {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 260px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid #f2efe21f;
  background: #0a0a0a;
  isolation: isolate;
}

.bento-card__video {
  position: absolute;
  inset: 0;
}

.bento-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.bento-card:hover .bento-card__image {
  transform: scale(1.055);
}

.bento-card__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, #05050522 0%, #05050500 34%, #050505d9 100%),
    linear-gradient(90deg, #050505a6 0%, #05050500 62%);
}

.bento-card__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  padding: clamp(20px, 2.2vw, 34px);
  gap: 20px;
}

.bento-card__title {
  margin: 0;
  font-size: clamp(42px, 4.6vw, 84px);
  color: #f7f4e9;
  line-height: 0.9;
}

.bento-card--big .bento-card__title { font-size: clamp(52px, 5.4vw, 104px); }

.bento-card__cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  overflow: hidden;
  padding: 9px 17px;
  border-radius: 999px;
  border: 1px solid #f2efe233;
  background: #050505a6;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #f7f4e9;
  transition: border-color 240ms, color 240ms;
}

.bento-card__cta:hover { border-color: var(--brand); color: var(--brand); }
.bento-card__cta.is-soon { color: #f2efe2aa; cursor: default; }

.bento-card__glow {
  pointer-events: none;
  position: absolute;
  inset: -1px;
  transition: opacity 300ms;
}

.bento-card__cta > span:not(.bento-card__glow) { position: relative; z-index: 1; }

@media (prefers-reduced-motion: reduce) {
  .bento-card__cta { transition: none; }
}
</style>
