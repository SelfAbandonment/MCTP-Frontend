<script setup>
/**
 * 文件用途：预览页顶部导航组件
 * 作用：固定在页面顶部的导航条——左侧品牌 LOGO、中间锚点导航、右侧账号区 + 主题切换；
 *       滚动后顶栏加深并加阴影/辉光，提供更清晰的分层。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AccountArea from '@/preview/components/AccountArea.vue'
import ThemeSwitcher from '@/preview/components/ThemeSwitcher.vue'

// 作用：锚点导航项（对应各区块的 id）。
// 原因：主界面为单页长滚动，用锚点定位比多路由更轻量，也符合官网预览的浏览习惯。
const navItems = [
  { id: 'announcements', label: '公告' },
  { id: 'features', label: '玩法' },
  { id: 'downloads', label: '下载' },
  { id: 'events', label: '活动' },
  { id: 'guestbook', label: '留言' },
]

// 作用：是否已滚动（用于给顶栏加阴影/加深）。
const scrolled = ref(false)

// 作用：滚动监听——超过阈值后置 scrolled=true。
function onScroll() {
  scrolled.value = window.scrollY > 8
}

// 作用：平滑滚动到指定区块。
// 原因：站点使用 hash 路由，直接写 <a href="#id"> 会改变路由 hash 导致路由误判，
//       因此改用 scrollIntoView 手动定位，避免与 vue-router 冲突。
function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  // 原因：减少动效用户用瞬移而非平滑滚动，符合无障碍偏好。
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  el.scrollIntoView({ behavior, block: 'start' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <!-- 作用：固定顶栏；滚动后追加 is-scrolled 加深背景并加阴影。 -->
  <header
    class="preview-header"
    :class="{ 'is-scrolled': scrolled }"
  >
    <div class="preview-header__inner">
      <!-- 作用：品牌区——旋转齿轮图标 + 站点名，点击回到顶部。 -->
      <button
        class="preview-header__brand"
        type="button"
        aria-label="返回顶部"
        @click="scrollToId('preview-top')"
      >
        <svg
          class="preview-header__gear"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g
            v-for="n in 10"
            :key="n"
            :transform="`rotate(${(n - 1) * 36} 100 100)`"
          >
            <rect
              x="91"
              y="4"
              width="18"
              height="30"
              rx="3"
              fill="currentColor"
            />
          </g>
          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="currentColor"
            stroke-width="16"
          />
          <circle
            cx="100"
            cy="100"
            r="42"
            fill="none"
            stroke="currentColor"
            stroke-width="20"
            stroke-dasharray="22 14"
          />
          <circle
            cx="100"
            cy="100"
            r="15"
            fill="currentColor"
          />
        </svg>
        <span class="preview-header__name">MCREATOPIA</span>
      </button>

      <!-- 作用：锚点导航（中间），窄屏隐藏避免拥挤。 -->
      <nav
        class="preview-header__nav"
        aria-label="页面导航"
      >
        <button
          v-for="item in navItems"
          :key="item.id"
          class="preview-header__navlink"
          type="button"
          @click="scrollToId(item.id)"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- 作用：右侧操作区——账号区 + 主题切换。 -->
      <div class="preview-header__right">
        <AccountArea />
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 作用：顶栏固定置顶，半透明深褐底，带底部分隔线；挂载时淡入衔接 intro 退场。 */
.preview-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--preview-bg) 86%, transparent);
  border-bottom: 1px solid var(--preview-line);
  backdrop-filter: blur(8px);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  animation: preview-header-fade 0.6s ease-out both;
}

/* 作用：滚动后顶栏更实、底部加铜黄辉光分隔，强化层级。 */
.preview-header.is-scrolled {
  background: color-mix(in srgb, var(--preview-bg) 96%, transparent);
  border-bottom-color: var(--preview-line-strong);
  box-shadow: 0 8px 24px var(--preview-shadow), 0 1px 0 0 var(--preview-accent-deep);
}

/* 作用：顶栏内部容器，与主内容同宽居中。 */
.preview-header__inner {
  width: min(1100px, 100% - 48px);
  margin: 0 auto;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 作用：品牌按钮——去默认样式，横向排列。 */
.preview-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  padding: 0;
  color: var(--preview-accent);
  cursor: pointer;
}

/* 作用：品牌齿轮图标——缓慢旋转，呼应机械动力主题。 */
.preview-header__gear {
  width: 26px;
  height: 26px;
  animation: preview-header-spin 14s linear infinite;
}

/* 作用：站点名。 */
.preview-header__name {
  font-size: 17px;
  letter-spacing: 0.04em;
  color: var(--preview-text);
  white-space: nowrap;
}

/* 作用：锚点导航——居中占满剩余空间。 */
.preview-header__nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 6px;
}

/* 作用：单个导航项——透明按钮，悬停/聚焦铜黄。 */
.preview-header__navlink {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: none;
  color: var(--preview-text-soft);
  font-family: inherit;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.preview-header__navlink:hover {
  color: var(--preview-accent);
  background: var(--preview-bg-hover);
}

/* 作用：右侧操作区——横向排列并垂直居中。 */
.preview-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 作用：窄屏隐藏锚点导航，避免与品牌/账号区拥挤。 */
@media (max-width: 860px) {
  .preview-header__nav {
    display: none;
  }
  .preview-header__name {
    font-size: 15px;
  }
}

@keyframes preview-header-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
