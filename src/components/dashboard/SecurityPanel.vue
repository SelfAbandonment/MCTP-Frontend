<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { errorMessage, fieldErrors } from '@/utils/errors'

const auth = useAuthStore()
const router = useRouter()
const password = ref({ old_password: '', new_password: '', new_password_confirm: '' })
const busy = ref(false)
const error = ref('')
const errors = ref({})

const fields = [
  { key: 'old_password', label: '当前密码' },
  { key: 'new_password', label: '新密码' },
  { key: 'new_password_confirm', label: '确认新密码' },
]

async function changePassword() {
  error.value = ''
  errors.value = {}
  if (password.value.new_password !== password.value.new_password_confirm) {
    errors.value = { new_password_confirm: '两次新密码不一致' }
    return
  }
  busy.value = true
  try {
    await authApi.changePassword(password.value)
    auth.logout()
    await router.replace({ path: '/login', query: { passwordChanged: '1' } })
  } catch (e) {
    errors.value = fieldErrors(e)
    error.value = errorMessage(e, '修改密码失败')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section
    class="panel"
    aria-labelledby="password-title"
  >
    <div class="panel-heading">
      <h2 id="password-title">
        账号安全
      </h2>
    </div>
    <p class="security-note">
      修改密码后将退出当前登录，请使用新密码重新登录。
    </p>
    <p
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </p>
    <form @submit.prevent="changePassword">
      <div
        v-for="field in fields"
        :key="field.key"
        class="form-group"
      >
        <label
          :for="`security-${field.key}`"
          class="form-label"
        >{{ field.label }}</label>
        <input
          :id="`security-${field.key}`"
          v-model="password[field.key]"
          class="form-input"
          type="password"
          :autocomplete="field.key === 'old_password' ? 'current-password' : 'new-password'"
          :aria-invalid="!!errors[field.key]"
          required
        >
        <span
          v-if="errors[field.key]"
          class="form-error"
        >{{ errors[field.key] }}</span>
      </div>
      <button
        type="submit"
        class="btn-secondary"
        :disabled="busy"
      >
        {{ busy ? '更新中…' : '更新密码' }}
      </button>
    </form>
  </section>
</template>

<style scoped>
.panel-heading h2 {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 400;
  line-height: 1.15;
}

.security-note { margin-bottom: 24px; font-size: 12px; color: var(--text-soft); }
</style>
