<script setup>
import { onMounted, ref } from 'vue'
import { communityApi } from '@/api/community'
import { usePagedResource } from '@/composables/usePagedResource'
import { formatDate } from '@/utils/errors'
import { ANNOUNCEMENT_CATEGORIES, announcementCategory, announcementQuery } from '@/utils/announcements'
import PaginationControls from '@/components/PaginationControls.vue'

defineProps({
  compact: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
})

const CATEGORY_FILTERS = [{ key: '', label: '全部' }, ...ANNOUNCEMENT_CATEGORIES]

const search = ref('')
const category = ref('')
const { items, page, count, hasNext, hasPrevious, loading, error, load, retry } = usePagedResource(communityApi.announcements)

function loadAnnouncements(nextPage = 1) {
  return load(nextPage, announcementQuery({ search: search.value, category: category.value }))
}

function applySearch() {
  loadAnnouncements(1)
}

function selectCategory(key) {
  if (category.value === key) return
  category.value = key
  loadAnnouncements(1)
}

function clearSearch() {
  if (!search.value) return
  search.value = ''
  loadAnnouncements(1)
}

function entryNumber(index) {
  return String(index + 1).padStart(2, '0')
}

onMounted(() => load())
</script>

<template>
  <div
    class="announcement-feed"
    :aria-busy="loading"
  >
    <form
      v-if="searchable"
      class="feed-search"
      role="search"
      @submit.prevent="applySearch"
    >
      <input
        v-model="search"
        class="form-input"
        type="search"
        maxlength="80"
        aria-label="搜索公告"
        placeholder="按标题、摘要或正文搜索"
      >
      <button
        class="btn-primary"
        type="submit"
        :disabled="loading"
      >
        搜索
      </button>
      <button
        v-if="search"
        class="text-button"
        type="button"
        :disabled="loading"
        @click="clearSearch"
      >
        清除
      </button>
    </form>
    <div
      v-if="searchable"
      class="feed-filters"
      role="group"
      aria-label="按分类筛选公告"
    >
      <button
        v-for="option in CATEGORY_FILTERS"
        :key="option.key || 'all'"
        class="feed-chip"
        type="button"
        :aria-pressed="category === option.key"
        :disabled="loading"
        @click="selectCategory(option.key)"
      >
        {{ option.label }}
      </button>
    </div>
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
    <template v-else-if="!items.length">
      <p class="feed-message">
        {{ search ? '没有找到匹配的公告。' : '这里暂时安静，新的社区消息会出现在这里。' }}
      </p>
    </template>
    <template v-else>
      <details
        v-for="(item, index) in compact ? items.slice(0, 3) : items"
        :key="item.id"
        class="announcement-entry"
      >
        <summary>
          <span class="announcement-index">{{ entryNumber(index) }}</span>
          <span class="announcement-copy">
            <span class="announcement-tags">
              <span class="tag">{{ announcementCategory(item).label }}</span>
              <span
                v-if="item.is_pinned"
                class="tag tag-pin"
              >置顶</span>
              <time :datetime="item.published_at">{{ formatDate(item.published_at) }}</time>
            </span>
            <strong>{{ item.title }}</strong>
            <span
              v-if="item.summary"
              class="announcement-excerpt"
            >{{ item.summary }}</span>
          </span>
          <span
            class="entry-plus"
            aria-hidden="true"
          >+</span>
        </summary>
        <div class="announcement-detail">
          <div class="prose announcement-body">
            {{ item.body }}
          </div>
          <RouterLink
            class="announcement-permalink"
            :to="`/announcements/${item.id}`"
          >
            单独打开这一页 ↗
          </RouterLink>
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
.feed-search {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}

.feed-search .form-input { flex: 1; min-width: 0; }

.feed-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0 0 18px;
  border-bottom: 1px solid var(--line);
}
.feed-chip {
  min-height: 34px;
  padding: 6px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  font-size: 11px;
  color: var(--text-soft);
  transition: border-color 160ms, color 160ms, background 160ms;
}
.feed-chip:hover:not(:disabled) { border-color: var(--brand); color: var(--text-main); }
.feed-chip[aria-pressed='true'] { border-color: var(--brand); background: #8ce06a14; color: var(--brand); }

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
.announcement-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.announcement-tags time {
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
.announcement-excerpt { display: block; margin-top: 10px; font-size: 12px; color: var(--text-soft); overflow-wrap: anywhere; }
.entry-plus {
  font-size: 26px;
  font-weight: 300;
  line-height: 1;
  color: var(--text-soft);
  transition: transform 240ms, color 240ms;
}
.announcement-entry summary:hover .entry-plus { color: var(--brand); }
details[open] .entry-plus { transform: rotate(45deg); }
.announcement-detail { padding: 0 30px 26px 48px; }
.announcement-body { color: var(--text-soft); }
.announcement-permalink {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--brand);
}
.announcement-permalink:hover { text-decoration: underline; }
summary:focus-visible { outline: 2px solid var(--brand); outline-offset: -2px; }
@media (max-width: 700px) {
  .feed-search { flex-wrap: wrap; }
  .feed-search .form-input { flex-basis: 100%; }
  .announcement-entry summary { gap: 14px; padding: 20px 8px; }
  .announcement-detail { padding: 0 12px 24px; }
  .entry-plus { font-size: 22px; }
}
</style>
