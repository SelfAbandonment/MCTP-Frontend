<script setup>
import { computed, ref } from 'vue'
import { useMotionContext } from '@/animations/motion'

const props = defineProps({
  title: { type: String, required: true },
  as: { type: String, default: 'h2' },
  align: { type: String, default: 'left' },
  stagger: { type: Number, default: 0.045 },
  duration: { type: Number, default: 0.9 },
})

const root = ref(null)
const lines = computed(() =>
  props.title
    .split(/<br\s*\/?>/i)
    .map((line) => Array.from(line).filter((char) => char.trim().length > 0)),
)
const plain = computed(() => props.title.replace(/<br\s*\/?>/gi, ' '))

useMotionContext(root, ({ gsap, reduced }) => {
  if (!root.value) return
  const chars = root.value.querySelectorAll('.animated-char')

  if (reduced) {
    gsap.set(chars, { opacity: 1, yPercent: 0, rotationX: 0, rotationY: 0 })
    return
  }

  gsap.fromTo(
    chars,
    { opacity: 0, yPercent: 80, rotationX: -55, rotationY: 16, transformPerspective: 900 },
    {
      opacity: 1,
      yPercent: 0,
      rotationX: 0,
      rotationY: 0,
      duration: props.duration,
      ease: 'power3.out',
      stagger: props.stagger,
      scrollTrigger: {
        trigger: root.value,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    },
  )
})
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="animated-title"
    :class="`animated-title--${align}`"
    :aria-label="plain"
  >
    <span
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
      class="animated-title__line"
      aria-hidden="true"
    >
      <span
        v-for="(char, charIndex) in line"
        :key="`${lineIndex}-${charIndex}`"
        class="animated-title__mask"
      ><span class="animated-char">{{ char }}</span></span>
    </span>
  </component>
</template>

<style scoped>
.animated-title {
  display: flex;
  flex-direction: column;
  gap: 0.02em;
  margin: 0;
  font-family: var(--font-display);
  line-height: 0.94;
}

.animated-title__line {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.02em;
}

.animated-title__mask {
  display: inline-block;
  overflow: hidden;
}

.animated-char {
  display: inline-block;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.animated-title--center { align-items: center; text-align: center; }
.animated-title--center .animated-title__line { justify-content: center; }
.animated-title--right { align-items: flex-end; text-align: right; }
.animated-title--right .animated-title__line { justify-content: flex-end; }
</style>
