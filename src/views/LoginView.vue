<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/AuthLayout.vue'
import { errorMessage, localRedirect } from '@/utils/errors'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const msLoading = ref(false)
const error = ref('')

async function handleMicrosoft() {
  error.value = ''
  msLoading.value = true
  try {
    await auth.microsoftLogin()
  } catch (e) {
    error.value = errorMessage(e, '无法发起微软登录')
    msLoading.value = false
  }
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.username, form.value.password)
    await router.push(localRedirect(route.query.redirect))
  } catch (e) {
    error.value = e.response?.status === 401 ? '用户名或密码错误' : errorMessage(e, '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <p class="eyebrow">
      回到世界
    </p>
    <h2>欢迎回来。</h2>
    <p class="auth-description">
      登录，回到你的世界。
    </p>
    <p
      v-if="route.query.passwordChanged === '1'"
      class="alert alert-success"
      role="status"
    >
      密码已更新，请使用新密码登录。
    </p>
    <div
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </div>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label
          class="form-label"
          for="login-username"
        >用户名</label>
        <input
          id="login-username"
          v-model="form.username"
          class="form-input"
          required
          autocomplete="username"
          maxlength="150"
        >
      </div>
      <div class="form-group">
        <label
          class="form-label"
          for="login-password"
        >密码</label>
        <input
          id="login-password"
          v-model="form.password"
          class="form-input"
          type="password"
          required
          autocomplete="current-password"
        >
      </div>
      <button
        class="btn-primary full-width"
        type="submit"
        :disabled="loading || msLoading"
      >
        {{ loading ? '登录中…' : '登录 ↗' }}
      </button>
    </form>
    <div class="auth-divider">
      或
    </div>
    <button
      class="btn-secondary full-width"
      :disabled="msLoading || loading"
      @click="handleMicrosoft"
    >
      <span
        class="microsoft-mark"
        aria-hidden="true"
      >⊞</span>
      {{ msLoading ? '跳转中…' : '使用微软账号登录' }}
    </button>
    <p class="auth-switch">
      初次来到这里？
      <RouterLink
        to="/register"
        class="link"
      >
        创建账号
      </RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped>
.auth-description { color: var(--text-soft); font-size: 13px; }
.full-width { width: 100%; }
.auth-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 20px 0;
  font-family: var(--font-pixel);
  font-size: 8px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-soft);
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}
.auth-switch { margin-top: 26px; font-size: 12px; text-align: center; color: var(--text-soft); }
.microsoft-mark { font-size: 20px; line-height: 1; color: var(--text-soft); }
@media (max-width: 900px) {
  .auth-switch { margin-top: 22px; }
}
</style>
