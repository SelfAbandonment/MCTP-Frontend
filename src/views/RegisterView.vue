<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ username: '', email: '', password: '', password_confirm: '' })
const loading = ref(false)
const errors = ref({})
const globalError = ref('')

function fieldError(key) {
  return errors.value[key]?.[0] || null
}

async function handleRegister() {
  errors.value = {}
  globalError.value = ''
  loading.value = true
  try {
    await auth.register(
      form.value.username,
      form.value.email,
      form.value.password,
      form.value.password_confirm,
    )
    router.push('/dashboard')
  } catch (e) {
    const body = e.response?.data
    const status = e.response?.status
    if (status === 400 && body?.data && typeof body.data === 'object') {
      // 后端校验错误，展示字段级别提示
      errors.value = body.data
    } else if (status === 400) {
      globalError.value = body?.message || '注册失败，请检查填写内容'
    } else if (e.code === 'ECONNABORTED') {
      globalError.value = '请求超时，服务器可能正在启动，请稍后重试'
    } else if (!e.response) {
      globalError.value = '网络错误，请检查网络连接'
    } else {
      // 注册成功但自动登录失败，引导去手动登录
      globalError.value = '注册成功！请前往登录页登录'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2 class="auth-title">注册</h2>
      <p class="text-muted text-center" style="margin-bottom:1.5rem">创建你的 MCTP 账户</p>

      <div v-if="globalError" class="alert alert-error">{{ globalError }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="form.username" :class="['form-input', errors.username && 'error']"
            type="text" placeholder="请输入用户名" required autocomplete="username" />
          <span v-if="errors.username" class="form-error">{{ errors.username[0] }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">邮箱</label>
          <input v-model="form.email" :class="['form-input', errors.email && 'error']"
            type="email" placeholder="请输入邮箱" required autocomplete="email" />
          <span v-if="errors.email" class="form-error">{{ errors.email[0] }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="form.password" :class="['form-input', errors.password && 'error']"
            type="password" placeholder="至少 8 位，包含字母和数字" required autocomplete="new-password" />
          <span v-if="errors.password" class="form-error">{{ errors.password[0] }}</span>
        </div>
        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input v-model="form.password_confirm" class="form-input"
            type="password" placeholder="再次输入密码" required autocomplete="new-password" />
        </div>
        <button class="btn-primary" type="submit" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="text-center text-muted" style="margin-top:1.25rem">
        已有账号？
        <RouterLink to="/login" class="link">立即登录</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap { display: flex; justify-content: center; padding-top: 3rem; }
.auth-card { width: 100%; max-width: 420px; }
.auth-title { font-size: 1.4rem; font-weight: 700; text-align: center; margin-bottom: 0.5rem; }
</style>
