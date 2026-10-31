/**
 * 文件用途：预览页账号区状态 store（Pinia）
 * 作用：骨架阶段用本地模拟数据演示「登录前 / 登录后」两种账号区状态，
 *       不接入现有 auth store 与后端接口，避免预览页影响现有框架。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
// 原因：头像为占位素材，随代码打包，避免写死字符串路径导致构建期路径失效。
import avatarPlaceholder from '@/preview/assets/placeholders/avatar.svg'

// TODO-ASSET: 玩家头像真实素材待补，当前使用占位 SVG。
const DEMO_USER = {
  name: 'SteelSmith',
  avatar: avatarPlaceholder,
}

export const usePreviewAuthStore = defineStore('preview-auth', () => {
  // 作用：user 为 null 表示未登录；非 null 表示已登录。
  const user = ref(null)

  // 作用：模拟登录——点击「登录」后立即切到已登录状态，用于骨架演示。
  // TODO-BACKEND: 待对接真实登录接口（可复用现有 src/api/auth.js 或 /auth 接口）。
  function login() {
    user.value = { ...DEMO_USER }
  }

  // 作用：模拟退出登录，回到未登录状态。
  // TODO-BACKEND: 待对接真实登出接口。
  function logout() {
    user.value = null
  }

  return { user, login, logout }
})
