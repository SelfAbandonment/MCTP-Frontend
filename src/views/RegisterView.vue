<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/components/AuthLayout.vue'
import { errorMessage, fieldErrors } from '@/utils/errors'

const router = useRouter()
const auth = useAuthStore()
const form = ref({ username: '', email: '', password: '', password_confirm: '' })
const loading = ref(false)
const errors = ref({})
const globalError = ref('')
const registrationSucceeded = ref(false)
const fields = [
  { key: 'username', label: '用户名', type: 'text', autocomplete: 'username', max: 150 },
  { key: 'email', label: '邮箱', type: 'email', autocomplete: 'email', max: 254 },
  { key: 'password', label: '密码', type: 'password', autocomplete: 'new-password' },
  { key: 'password_confirm', label: '确认密码', type: 'password', autocomplete: 'new-password' },
]

async function handleRegister() {
  errors.value = {}
  globalError.value = ''
  if (form.value.password !== form.value.password_confirm) {
    errors.value.password_confirm = '两次密码不一致'
    return
  }
  loading.value = true
  try {
    await auth.register(form.value.username, form.value.email, form.value.password, form.value.password_confirm)
    await router.push('/dashboard')
  } catch (e) {
    registrationSucceeded.value = !!e.registrationSucceeded
    errors.value = fieldErrors(e)
    globalError.value = registrationSucceeded.value
      ? '账号已创建，但自动登录失败。请前往登录页。'
      : errorMessage(e, '注册失败，请检查填写内容')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <p class="eyebrow">
      新的故事
    </p>
    <h2>留个位置，给你。</h2>
    <p class="auth-description">
      创建账号，开始认识这个世界。
    </p>
    <div
      v-if="globalError"
      class="alert alert-error"
      role="alert"
    >
      {{ globalError }}
      <RouterLink
        v-if="registrationSucceeded"
        to="/login"
        class="link"
      >
        前往登录
      </RouterLink>
    </div>
    <form
      v-if="!registrationSucceeded"
      @submit.prevent="handleRegister"
    >
      <div
        v-for="field in fields"
        :key="field.key"
        class="form-group"
      >
        <label
          class="form-label"
          :for="`register-${field.key}`"
        >{{ field.label }}</label>
        <input
          :id="`register-${field.key}`"
          v-model="form[field.key]"
          :class="['form-input', { error: errors[field.key] }]"
          :type="field.type"
          :autocomplete="field.autocomplete"
          :maxlength="field.max"
          :aria-invalid="!!errors[field.key]"
          :aria-describedby="errors[field.key] ? `register-error-${field.key}` : undefined"
          required
        >
        <span
          v-if="errors[field.key]"
          :id="`register-error-${field.key}`"
          class="form-error"
        >{{ errors[field.key] }}</span>
      </div>
      <button
        class="btn-primary"
        type="submit"
        :disabled="loading"
      >
        {{ loading ? '创建中…' : '创建账号 ↗' }}
      </button>
    </form>
    <p class="auth-switch">
      已有账号？
      <RouterLink
        to="/login"
        class="link"
      >
        登录
      </RouterLink>
    </p>
  </AuthLayout>
</template>

<style scoped>
.auth-description { color: var(--text-soft); font-size: 13px; }
.btn-primary { width: 100%; margin-top: 4px; }
.auth-switch { margin-top: 24px; font-size: 12px; text-align: center; color: var(--text-soft); }
@media (max-width: 900px) {
  .auth-switch { margin-top: 20px; }
}
</style>
