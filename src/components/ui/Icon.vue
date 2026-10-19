<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 1.8 },
})

const icons = {
  'arrow-up-right': { paths: ['M7 17 17 7', 'M9 7h8v8'] },
  'arrow-down': { paths: ['M12 4v15', 'M6 13l6 6 6-6'] },
  'arrow-right': { paths: ['M4 12h15', 'M13 6l6 6-6 6'] },
  'chevron-right': { paths: ['M9 5l7 7-7 7'] },
  'chevron-down': { paths: ['M5 9l7 7 7-7'] },
  external: { paths: ['M14 4h6v6', 'M20 4l-9 9', 'M18 14v5H5V6h5'] },
  menu: { paths: ['M4 7h16', 'M4 12h16', 'M4 17h16'] },
  close: { paths: ['M6 6l12 12', 'M18 6L6 18'] },
  play: { paths: ['M8 5v14l11-7z'], filled: true },
  pause: { paths: ['M7 5h3.2v14H7z', 'M13.8 5H17v14h-3.2z'], filled: true },
  plus: { paths: ['M12 5v14', 'M5 12h14'] },
}

const def = computed(() => icons[props.name] || icons['arrow-right'])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="def.filled ? 'currentColor' : 'none'"
    :stroke="def.filled ? 'none' : 'currentColor'"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    aria-hidden="true"
  >
    <path
      v-for="(d, index) in def.paths"
      :key="index"
      :d="d"
    />
  </svg>
</template>
