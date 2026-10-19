<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: true },
  label: { type: String, default: '正在进入世界' },
  fallback: { type: Number, default: 3200 },
})

const emit = defineEmits(['done'])

const visible = ref(props.active)
const leaving = ref(false)
let failsafe = 0
let leaveTimer = 0

function dismiss() {
  if (!visible.value || leaving.value) return
  leaving.value = true
  window.clearTimeout(failsafe)
  leaveTimer = window.setTimeout(() => {
    visible.value = false
    emit('done')
  }, 720)
}

watch(
  () => props.active,
  (active) => {
    if (active) {
      visible.value = true
      leaving.value = false
      failsafe = window.setTimeout(dismiss, props.fallback)
    } else {
      dismiss()
    }
  },
)

onMounted(() => {
  if (!props.active) {
    visible.value = false
    return
  }
  failsafe = window.setTimeout(dismiss, props.fallback)
})

onBeforeUnmount(() => {
  window.clearTimeout(failsafe)
  window.clearTimeout(leaveTimer)
})
</script>

<template>
  <Transition name="film-loader">
    <div
      v-if="visible"
      class="film-loader"
      :class="{ 'is-leaving': leaving }"
      role="status"
      aria-live="polite"
    >
      <div class="film-loader__brand">
        MCTP
      </div>
      <div
        class="three-body"
        aria-hidden="true"
      >
        <div class="three-body__dot" />
        <div class="three-body__dot" />
        <div class="three-body__dot" />
      </div>
      <p class="film-loader__label">
        {{ label }}
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.film-loader {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 26px;
  background: #050505;
  transition: opacity 680ms ease;
}

.film-loader.is-leaving { opacity: 0; }

.film-loader__brand {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 0.24em;
  color: #f2efe2;
}

.film-loader__label {
  font-size: 12px;
  letter-spacing: 0.4em;
  color: rgba(242, 239, 226, 0.5);
}

/* Three-body loader, adapted from the uiverse.io snippet used by the reference site */
.three-body {
  --uib-size: 36px;
  --uib-speed: 0.8s;
  --uib-color: #8ce06a;
  position: relative;
  display: inline-block;
  height: var(--uib-size);
  width: var(--uib-size);
  animation: three-body-spin calc(var(--uib-speed) * 2.5) infinite linear;
}

.three-body__dot {
  position: absolute;
  height: 100%;
  width: 30%;
}

.three-body__dot::after {
  content: '';
  position: absolute;
  height: 0%;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--uib-color);
  border-radius: 50%;
}

.three-body__dot:nth-child(1) { bottom: 5%; left: 0; transform: rotate(60deg); transform-origin: 50% 85%; }
.three-body__dot:nth-child(1)::after { bottom: 0; left: 0; animation: three-body-wobble1 var(--uib-speed) infinite ease-in-out; animation-delay: calc(var(--uib-speed) * -0.3); }
.three-body__dot:nth-child(2) { bottom: 5%; right: 0; transform: rotate(-60deg); transform-origin: 50% 85%; }
.three-body__dot:nth-child(2)::after { bottom: 0; left: 0; animation: three-body-wobble1 var(--uib-speed) infinite calc(var(--uib-speed) * -0.15) ease-in-out; }
.three-body__dot:nth-child(3) { bottom: -5%; left: 0; transform: translateX(116.666%); }
.three-body__dot:nth-child(3)::after { top: 0; left: 0; animation: three-body-wobble2 var(--uib-speed) infinite ease-in-out; }

.film-loader-enter-active,
.film-loader-leave-active { transition: opacity 680ms ease; }
.film-loader-enter-from,
.film-loader-leave-to { opacity: 0; }

@keyframes three-body-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes three-body-wobble1 {
  0%, 100% { transform: translateY(0%) scale(1); opacity: 1; }
  50% { transform: translateY(-66%) scale(0.65); opacity: 0.8; }
}

@keyframes three-body-wobble2 {
  0%, 100% { transform: translateY(0%) scale(1); opacity: 1; }
  50% { transform: translateY(66%) scale(0.65); opacity: 0.8; }
}

@media (prefers-reduced-motion: reduce) {
  .three-body,
  .three-body__dot::after { animation: none; }
}
</style>
