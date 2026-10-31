<script setup>
import { onMounted, ref } from 'vue'
import { pointsApi } from '@/api/points'
import { errorMessage } from '@/utils/errors'

const data = ref(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await pointsApi.me()
    data.value = res.data.data
  } catch (e) {
    error.value = errorMessage(e, '暂时无法读取积分')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section
    class="panel points-panel"
    aria-labelledby="points-panel-title"
  >
    <div class="panel-heading">
      <h2 id="points-panel-title">
        我的积分
      </h2>
      <RouterLink
        to="/points"
        class="text-button"
      >
        积分明细 ↗
      </RouterLink>
    </div>
    <p
      v-if="error"
      class="alert alert-error"
    >
      {{ error }}
    </p>
    <template v-else-if="data">
      <p class="points-panel__value">
        {{ data.account.balance }}
      </p>
      <p class="points-panel__meta">
        累计获得 {{ data.account.total_granted }} 分 · 社区第 {{ data.rank }} 名
      </p>
    </template>
    <p
      v-else
      class="text-muted"
    >
      {{ loading ? '读取中…' : '还没有积分记录' }}
    </p>
  </section>
</template>

<style scoped>
.points-panel__value {
  font-family: var(--font-display);
  font-size: clamp(56px, 7vw, 84px);
  line-height: 0.95;
  color: var(--brand);
}

.points-panel__meta {
  margin-top: 10px;
  color: var(--text-soft);
  font-size: 13px;
}
</style>
