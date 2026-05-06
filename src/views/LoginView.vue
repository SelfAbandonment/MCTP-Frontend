<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
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
    msLoading.value = false
    error.value = e.response?.data?.message || '无法发起微软登录'
  }
}

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
      <div class="auth-glow"></div>
      <h2 class="auth-title">欢迎回来</h2>
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

      <div class="divider"><span>或</span></div>

      <button class="btn-ms" type="button" :disabled="msLoading" @click="handleMicrosoft">
        <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden="true">
          <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
          <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
          <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
          <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
        </svg>
        <span>{{ msLoading ? '跳转中...' : '使用微软账号登录' }}</span>
      </button>

      <p class="text-center text-muted" style="margin-top:1.25rem">
        还没有账号？
        <RouterLink to="/register" class="link">立即注册</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap {
  display: flex;
  justify-content: center;
  padding-top: 2.4rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  position: relative;
  animation: rise-in 0.5s ease;
}

.auth-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  right: -40px;
  top: -40px;
  background: radial-gradient(circle, rgba(101, 214, 162, 0.4) 0%, transparent 70%);
  pointer-events: none;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  margin-bottom: 0.3rem;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-soft);
  margin: 1.25rem 0;
  font-size: 0.83rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.btn-ms {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.72rem 1rem;
  border: 1px solid var(--line-strong);
  background: rgba(13, 17, 16, 0.5);
  color: var(--text-main);
  font-weight: 600;
  border-radius: 11px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.btn-ms:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--brand);
}

.btn-ms:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
