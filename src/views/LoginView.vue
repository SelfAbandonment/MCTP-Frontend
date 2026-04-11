<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(form.value.username, form.value.password)
    const redirect = router.currentRoute.value.query.redirect || '/dashboard'
    router.push(redirect)
  } catch (e) {
    const body = e.response?.data
    const status = e.response?.status
    if (status === 401) {
      error.value = '用户名或密码错误'
    } else if (e.code === 'ECONNABORTED') {
      error.value = '请求超时，服务器可能正在启动，请稍后重试'
    } else if (!e.response) {
      error.value = '网络错误，请检查网络连接'
    } else {
      error.value = body?.message || '登录失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2 class="auth-title">登录</h2>
      <p class="text-muted text-center" style="margin-bottom:1.5rem">登录你的 MCTP 账户</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="form.username" class="form-input" type="text" placeholder="请输入用户名" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="form.password" class="form-input" type="password" placeholder="请输入密码" required autocomplete="current-password" />
        </div>
        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="text-center text-muted" style="margin-top:1.25rem">
        还没有账号？
        <RouterLink to="/register" class="link">立即注册</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding-top: 3rem; }
.auth-card { width: 100%; max-width: 420px; }
.auth-title { font-size: 1.4rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
</style>
