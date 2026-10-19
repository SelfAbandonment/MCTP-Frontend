<script setup>
import { onMounted } from 'vue'
import { communityApi } from '@/api/community'
import { usePagedResource } from '@/composables/usePagedResource'
import { formatDate } from '@/utils/errors'
import PaginationControls from '@/components/PaginationControls.vue'

defineProps({ compact: { type: Boolean, default: false } })
const { items, page, count, hasNext, hasPrevious, loading, error, load, retry } = usePagedResource(communityApi.announcements)
onMounted(() => load())
</script>

<template>
  <div
    class="announcement-feed"
    :aria-busy="loading"
  >
    <p
      v-if="loading"
      class="feed-message"
      role="status"
    >
      正在读取社区消息…
    </p>
    <div
      v-else-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
      <button
        class="text-button"
        @click="retry"
      >
        重试
      </button>
    </div>
    <p
      v-else-if="!items.length"
      class="feed-message"
    >
      这里暂时安静，新的社区消息会出现在这里。
    </p>
    <template v-else>
      <details
        v-for="(item, index) in compact ? items.slice(0, 3) : items"
        :key="item.id"
        class="announcement-entry"
      >
        <summary>
          <span class="announcement-index">0{{ index + 1 }}</span>
          <span class="announcement-copy">
            <time :datetime="item.published_at">{{ formatDate(item.published_at) }}</time>
            <strong>{{ item.title }}</strong>
            <span v-if="item.summary">{{ item.summary }}</span>
          </span>
          <span
            class="entry-plus"
            aria-hidden="true"
          >+</span>
        </summary>
        <div class="prose announcement-body">
          {{ item.body }}
        </div>
      </details>
      <PaginationControls
        v-if="!compact"
        :page="page"
        :count="count"
        :has-next="hasNext"
        :has-previous="hasPrevious"
        :loading="loading"
        @change="load"
      />
    </template>
  </div>
</template>

<style scoped>
.feed-message { padding: 28px 0; font-size: 12px; color: var(--text-soft); }
.announcement-entry { border-bottom: 1px solid var(--line); }
.announcement-entry summary {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 25px 12px;
  cursor: pointer;
  list-style: none;
  transition: background 200ms;
}
.announcement-entry summary:hover { background: #ffffff08; }
.announcement-entry summary::-webkit-details-marker { display: none; }
.announcement-index {
  align-self: start;
  padding-top: 4px;
  font-family: var(--font-pixel);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--brand);
}
.announcement-copy { flex: 1; min-width: 0; }
.announcement-copy time {
  display: block;
  margin-bottom: 8px;
  font-family: var(--font-pixel);
  font-size: 9px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.announcement-copy strong {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(20px, 2.1vw, 28px);
  font-weight: 400;
  line-height: 1.16;
  overflow-wrap: anywhere;
}
.announcement-copy > span { display: block; margin-top: 10px; font-size: 12px; color: var(--text-soft); overflow-wrap: anywhere; }
.entry-plus {
  font-size: 26px;
  font-weight: 300;
  line-height: 1;
  color: var(--text-soft);
  transition: transform 240ms, color 240ms;
}
.announcement-entry summary:hover .entry-plus { color: var(--brand); }
details[open] .entry-plus { transform: rotate(45deg); }
.announcement-body { padding: 0 30px 30px 48px; color: var(--text-soft); }
summary:focus-visible { outline: 2px solid var(--brand); outline-offset: -2px; }
@media (max-width: 700px) {
  .announcement-entry summary { gap: 14px; padding: 20px 8px; }
  .announcement-body { padding: 0 12px 24px; }
  .entry-plus { font-size: 22px; }
}
</style>
