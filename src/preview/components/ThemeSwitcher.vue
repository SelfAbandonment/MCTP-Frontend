<script setup>
/**
 * 文件用途：预览页主题切换组件（顶部右侧）
 * 作用：渲染「黑夜 / 白天 / 护眼」三个切换按钮，点击后切换主题并高亮当前项。
 */
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/preview/stores/themeStore'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

// 作用：遍历主题表生成按钮列表。
// 原因：主题表集中在 themeStore.THEMES 中定义（普通对象，无需响应式解包），
//       组件只负责渲染与触发，便于后续扩展新主题。
const themeList = Object.values(themeStore.THEMES)
</script>

<template>
  <!-- 作用：主题切换按钮组。 -->
  <div
    class="preview-theme-switch"
    role="group"
    aria-label="主题切换"
  >
    <button
      v-for="item in themeList"
      :key="item.key"
      class="preview-theme-switch__btn"
      :class="{ 'preview-theme-switch__btn--active': theme === item.key }"
      type="button"
      :aria-pressed="theme === item.key"
      @click="themeStore.setTheme(item.key)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style scoped>
/* 作用：按钮组横向排列，圆角容器。 */
.preview-theme-switch {
  display: inline-flex;
  border: 1px solid var(--preview-line-strong);
  border-radius: 10px;
  overflow: hidden;
}

/* 作用：单个主题按钮——透明底、描边分隔。 */
.preview-theme-switch__btn {
  padding: 8px 14px;
  border: none;
  border-right: 1px solid var(--preview-line);
  background: transparent;
  color: var(--preview-text-soft);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

/* 作用：去掉最后一个按钮的右侧分隔线。 */
.preview-theme-switch__btn:last-child {
  border-right: none;
}

/* 作用：当前主题高亮——铜黄底加深色文字。 */
.preview-theme-switch__btn--active {
  background: var(--preview-accent);
  color: #2b2118;
}
</style>
