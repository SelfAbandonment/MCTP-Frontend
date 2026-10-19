<script setup>
import { ref } from 'vue'
import { prefersReducedMotion } from '@/animations/motion'

const props = defineProps({
  max: { type: Number, default: 6 },
  scale: { type: Number, default: 0.97 },
})

const root = ref(null)

function handleMove(event) {
  if (!root.value || prefersReducedMotion()) return
  const rect = root.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  root.value.style.transform = `perspective(900px) rotateX(${(-y * props.max).toFixed(2)}deg) rotateY(${(x * props.max).toFixed(2)}deg) scale3d(${props.scale}, ${props.scale}, ${props.scale})`
}

function handleLeave() {
  if (!root.value) return
  root.value.style.transform = ''
}
</script>

<template>
  <div
    ref="root"
    class="film-tilt"
    @pointermove="handleMove"
    @pointerleave="handleLeave"
    @pointercancel="handleLeave"
  >
    <slot />
  </div>
</template>

<style scoped>
.film-tilt {
  transform-style: preserve-3d;
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .film-tilt { transition: none; }
}
</style>
