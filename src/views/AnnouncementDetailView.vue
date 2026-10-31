<script setup>
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { communityApi } from '@/api/community'
import { isNotFound, errorMessage, formatDay } from '@/utils/errors'
import { announcementCategory } from '@/utils/announcements'

const route = useRoute()
const announcement = ref(null)
const loading = ref(false)
const error = ref('')
const missing = ref(false)
let generation = 0

async function load(id) {
  const version = ++generation
  loading.value = true
  error.value = ''
  missing.value = false
  announcement.value = null
  try {
    const res = await communityApi.announcement(id)
    if (version === generation) announcement.value = res.data.data
  } catch (e) {
    if (version !== generation) return
    missing.value = isNotFound(e)
    error.value = missing.value
      ? '这条公告不存在，或者还没有对外发布。'
      : errorMessage(e, '读取公告失败，请稍后重试')
  } finally {
    if (version === generation) loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) load(id)
  },
  { immediate: true },
)

onUnmounted(() => {
  generation++
})
</script>

<template>
  <section class="announcement-page">
    <span
      class="announcement-page__word"
      aria-hidden="true"
    >公告</span>
    <nav
      class="announcement-breadcrumb"
      aria-label="当前位置"
    >
      <RouterLink to="/announcements">
        社区公告
      </RouterLink>
      <span aria-hidden="true">/</span>
      <span>详情</span>
    </nav>

    <p
      v-if="loading"
      class="empty-state"
      role="status"
    >
      正在读取这条公告…
    </p>
    <div
      v-else-if="missing"
      class="announcement-missing"
    >
      <h1>这里没有这篇公告。</h1>
      <p class="text-muted">
        {{ error }}
      </p>
      <RouterLink
        class="btn-secondary"
        to="/announcements"
      >
        回到公告列表 ↗
      </RouterLink>
    </div>
    <div
      v-else-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
      <button
        class="text-button"
        @click="load(route.params.id)"
      >
        重试
      </button>
    </div>
    <article
      v-else-if="announcement"
      class="announcement-article"
    >
      <header class="announcement-head">
        <p class="eyebrow">
          {{ announcementCategory(announcement).label }}
          <span
            v-if="announcement.is_pinned"
            class="announcement-pin"
          >· 置顶</span>
        </p>
        <h1>{{ announcement.title }}</h1>
        <dl class="announcement-meta">
          <div>
            <dt>发布</dt>
            <dd>
              <time :datetime="announcement.published_at">{{ formatDay(announcement.published_at) }}</time>
            </dd>
          </div>
          <div>
            <dt>更新</dt>
            <dd>{{ formatDay(announcement.updated_at) }}</dd>
          </div>
        </dl>
        <p
          v-if="announcement.summary"
          class="announcement-summary"
        >
          {{ announcement.summary }}
        </p>
      </header>
      <div class="prose announcement-copy-block">
        {{ announcement.body }}
      </div>
      <RouterLink
        class="btn-secondary announcement-back"
        to="/announcements"
      >
        回到全部公告 ↗
      </RouterLink>
    </article>
  </section>
</template>

<style scoped>
.announcement-page {
  position: relative;
  isolation: isolate;
  max-width: 820px;
  margin: 0 auto;
}

.announcement-page__word {
  position: absolute;
  top: -0.22em;
  left: 0;
  z-index: -1;
  font-family: var(--font-display);
  font-size: clamp(96px, 14vw, 200px);
  line-height: 0.8;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe217;
  pointer-events: none;
  user-select: none;
}

.announcement-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 26px;
  padding-top: 40px;
  font-size: 12px;
  color: var(--text-soft);
}

.announcement-breadcrumb a { color: var(--brand); }
.announcement-breadcrumb a:hover { text-decoration: underline; }

.announcement-head {
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}

.announcement-head h1 {
  font-family: var(--font-display);
  font-size: clamp(34px, 4.6vw, 62px);
  font-weight: 400;
  line-height: 1.06;
  overflow-wrap: anywhere;
}

.announcement-pin { color: var(--accent); }

.announcement-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 22px;
  margin-top: 20px;
  font-family: var(--font-pixel);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--text-soft);
}

.announcement-meta div { display: flex; gap: 8px; }
.announcement-meta dt { color: var(--text-soft); }
.announcement-meta dd { color: var(--text-main); }

.announcement-summary {
  margin-top: 24px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-soft);
  overflow-wrap: anywhere;
}

.announcement-copy-block {
  margin: 32px 0 44px;
  color: var(--text-main);
}

.announcement-missing h1 {
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 14px;
}

.announcement-missing .text-muted {
  margin-bottom: 26px;
  color: var(--text-soft);
  font-size: 13px;
}

.announcement-back { display: inline-flex; }

@media (max-width: 700px) {
  .announcement-page__word {
    top: 0;
    font-size: clamp(84px, 26vw, 140px);
    opacity: 0.75;
  }

  .announcement-breadcrumb { padding-top: 24px; }
}
</style>
