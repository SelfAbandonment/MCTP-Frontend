<script setup>
/**
 * 文件用途：预览页账号区组件（左上角）
 * 作用：根据预览页模拟登录状态切换两种 UI——
 *       未登录：显示「登录 / 注册」按钮；已登录：显示头像占位 + 用户名 + 退出按钮。
 */
import { storeToRefs } from 'pinia'
import { usePreviewAuthStore } from '@/preview/stores/previewAuthStore'

const authStore = usePreviewAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <!-- 作用：账号区容器。 -->
  <div class="preview-account">
    <!-- 登录前状态：显示「登录 / 注册」入口。 -->
    <template v-if="!user">
      <button
        class="preview-btn preview-btn--ghost"
        type="button"
        @click="authStore.login()"
      >
        登录
      </button>
      <button
        class="preview-btn preview-btn--ghost"
        type="button"
        @click="authStore.login()"
      >
        注册
      </button>
    </template>

    <!-- 登录后状态：显示头像占位 + 用户名 + 退出。 -->
    <template v-else>
      <img
        class="preview-account__avatar"
        :src="user.avatar"
        alt="玩家头像占位"
      >
      <span class="preview-account__name">{{ user.name }}</span>
      <button
        class="preview-btn preview-btn--ghost"
        type="button"
        @click="authStore.logout()"
      >
        退出
      </button>
    </template>
  </div>
</template>

<style scoped>
/* 作用：账号区横向排列并垂直居中。 */
.preview-account {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 作用：手机宽度（≤520px）收窄登录/注册按钮，且不允许文字竖排换行。
   原因：原先按钮被挤压后「登录」会断成上下两行；配合顶栏在 375px 手机上不产生横向滚动。 */
@media (max-width: 520px) {
  .preview-account {
    gap: 6px;
  }
  .preview-account .preview-btn {
    padding: 6px 10px;
    font-size: 13px;
    white-space: nowrap;
  }
}

/* 作用：头像占位图尺寸与圆形裁切。 */
.preview-account__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--preview-accent);
  object-fit: cover;
}

/* 作用：用户名文字样式。 */
.preview-account__name {
  font-size: 15px;
  color: var(--preview-text);
}
</style>
