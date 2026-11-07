<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { errorMessage, fieldErrors, formatDate } from '@/utils/errors'

const auth = useAuthStore()
const email = ref(auth.user?.email || '')
const busy = ref(false)
const message = ref('')
const error = ref('')

async function saveProfile() {
  busy.value = true
  error.value = ''
  message.value = ''
  try {
    await authApi.updateMe({ email: email.value })
    await auth.fetchMe()
    email.value = auth.user?.email || email.value
    message.value = '邮箱已更新'
  } catch (e) {
    error.value = fieldErrors(e).email || errorMessage(e, '保存资料失败')
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section
    class="panel account-panel"
    aria-labelledby="account-title"
  >
    <div class="panel-heading">
      <h2 id="account-title">
        你的账号
      </h2>
      <span class="badge">{{ auth.isStaff ? '社区管理者' : '社区玩家' }}</span>
    </div>
    <dl class="detail-list">
      <div><dt>用户名</dt><dd>{{ auth.user?.username }}</dd></div>
      <div><dt>加入时间</dt><dd>{{ formatDate(auth.user?.date_joined) }}</dd></div>
    </dl>
    <form
      class="account-form"
      @submit.prevent="saveProfile"
    >
      <div class="form-group">
        <label
          class="form-label"
          for="profile-email"
        >邮箱</label>
        <input
          id="profile-email"
          v-model="email"
          class="form-input"
          type="email"
          autocomplete="email"
          maxlength="254"
          required
        >
      </div>
      <p
        v-if="error"
        class="alert alert-error"
        role="alert"
      >
        {{ error }}
      </p>
      <p
        v-if="message"
        class="alert alert-success"
        role="status"
      >
        {{ message }}
      </p>
      <button
        class="btn-secondary"
        type="submit"
        :disabled="busy"
      >
        {{ busy ? '保存中…' : '保存邮箱' }}
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

.account-form { margin-top: 22px; }
</style>
