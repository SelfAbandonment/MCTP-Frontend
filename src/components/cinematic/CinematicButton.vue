<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'

const props = defineProps({
  title: { type: String, required: true },
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  variant: { type: String, default: 'lime' },
  icon: { type: String, default: 'arrow-up-right' },
  external: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
})

const tag = computed(() => (props.to ? RouterLink : 'a'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  return {
    href: props.href || '#',
    ...(props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="cine-btn"
    :class="[`cine-btn--${variant}`, { 'cine-btn--small': small }]"
  >
    <span>{{ title }}</span>
    <Icon
      v-if="icon && icon !== 'none'"
      :name="icon"
      :size="15"
      class="cine-btn__icon"
    />
  </component>
</template>

<style scoped>
.cine-btn--small {
  min-height: 40px;
  padding: 0 18px;
  font-size: 10px;
}
</style>
