<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { prefersReducedMotion } from '@/animations/motion'

const props = defineProps({
  src: { type: String, required: true },
  poster: { type: String, default: '' },
  paused: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
  preload: { type: String, default: 'metadata' },
  label: { type: String, default: '' },
})

const emit = defineEmits(['loaded'])

const host = ref(null)
const video = ref(null)
let observer = null
let visible = false

function play() {
  if (!video.value || props.paused || prefersReducedMotion()) return
  const promise = video.value.play()
  if (promise && typeof promise.catch === 'function') promise.catch(() => {})
}

function pause() {
  video.value?.pause()
}

function handleLoaded() {
  emit('loaded')
}

function handleIntersect([entry]) {
  visible = entry.isIntersecting
  if (visible) play()
  else pause()
}

onMounted(() => {
  observer = new IntersectionObserver(handleIntersect, { rootMargin: '260px 0px' })
  if (host.value) observer.observe(host.value)
  if (props.eager) play()
})

watch(
  () => props.paused,
  (paused) => {
    if (paused) pause()
    else if (visible) play()
  },
)

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="host"
    class="film-video"
    role="img"
    :aria-label="label || undefined"
  >
    <video
      ref="video"
      :src="src"
      :poster="poster || undefined"
      muted
      loop
      playsinline
      :preload="preload"
      @loadeddata="handleLoaded"
    />
  </div>
</template>

<style scoped>
.film-video {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0b0b0b;
}

.film-video video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
