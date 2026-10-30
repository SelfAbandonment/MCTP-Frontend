<script setup>
import { onMounted, ref } from 'vue'
import { communityApi } from '@/api/community'
import { errorMessage, formatDate } from '@/utils/errors'

const overview = ref(null)
const loading = ref(false)
const error = ref('')

const stats = [
  { key: 'players.total', label: '玩家总数' },
  { key: 'players.active', label: '活跃玩家' },
  { key: 'players.minecraft_bound', label: '已绑定我的世界' },
  { key: 'announcements.published', label: '已发布公告' },
]

function value(path) {
  const result = path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), overview.value)
  return typeof result === 'number' ? result : '—'
}

async function load() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await communityApi.overview()
    overview.value = res.data.data
  } catch (e) {
    overview.value = null
    error.value = errorMessage(e, '暂时无法读取社区近况')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section
    class="panel pulse-panel"
    aria-labelledby="pulse-title"
  >
    <div class="panel-heading">
      <h2 id="pulse-title">
        社区近况
      </h2>
      <button
        class="text-button"
        :disabled="loading"
        @click="load"
      >
        {{ loading ? '读取中…' : '刷新 ↻' }}
      </button>
    </div>
    <p
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </p>
    <dl
      class="pulse-grid"
      :class="{ 'pulse-grid--loading': loading && !overview }"
    >
      <div
        v-for="item in stats"
        :key="item.key"
      >
        <dt>{{ item.label }}</dt>
        <dd>{{ value(item.key) }}</dd>
      </div>
    </dl>
    <p class="pulse-note">
      <template v-if="overview">
        最近一次公告发布于 {{ formatDate(overview.announcements.latest_published_at) }}
      </template>
      <template v-else-if="loading">
        正在读取社区数据…
      </template>
      <template v-else>
        社区数据暂时不可用。
      </template>
    </p>
  </section>
</template>

<style scoped>
.pulse-panel { grid-column: 1 / -1; }

.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 400;
  line-height: 1.15;
}

.pulse-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.pulse-grid div {
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #ffffff05;
}

.pulse-grid dt {
  margin-bottom: 10px;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--text-soft);
}

.pulse-grid dd {
  font-family: var(--font-display);
  font-size: clamp(28px, 3vw, 40px);
  line-height: 1;
  color: var(--brand);
}

.pulse-grid--loading dd { color: var(--text-soft); }

.pulse-note {
  margin-top: 18px;
  font-size: 12px;
  color: var(--text-soft);
}

@media (max-width: 900px) {
  .pulse-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
