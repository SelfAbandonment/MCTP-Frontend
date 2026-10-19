<script setup>
defineProps({
  page: { type: Number, required: true },
  count: { type: Number, default: 0 },
  hasNext: { type: Boolean, default: false },
  hasPrevious: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})
defineEmits(['change'])
</script>

<template>
  <nav
    class="pagination"
    aria-label="分页"
  >
    <span>共 {{ count }} 条 · 第 {{ page }} 页</span>
    <div class="actions">
      <button
        class="btn-secondary"
        :disabled="loading || !hasPrevious"
        @click="$emit('change', page - 1)"
      >
        上一页
      </button>
      <button
        class="btn-secondary"
        :disabled="loading || !hasNext"
        @click="$emit('change', page + 1)"
      >
        下一页
      </button>
    </div>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-family: var(--font-pixel);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.pagination .btn-secondary { min-height: 40px; padding: 8px 14px; }
@media (max-width: 700px) {
  .pagination { font-size: 8px; }
  .pagination .btn-secondary { min-height: 38px; padding: 7px 12px; }
}
</style>
