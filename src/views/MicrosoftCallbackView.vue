<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// allauth error codes -> friendly Chinese messages.
const ERR_MAP = {
  access_denied: '你取消了微软授权。',
  cancelled: '你取消了微软授权。',
  permission_denied: '登录失败：该微软账号需要拥有 Minecraft 并完成账号校验。',
  signup_closed: '当前未开放注册，请联系管理员。',
  invalid_state: '登录状态校验失败，请重新发起登录。',
  unknown: '登录失败，请稍后重试。',
  server_error: '服务器内部错误，请稍后重试。',
  ms_oauth_not_configured: '后端尚未配置微软登录，请联系管理员。',
  ms_app_registration_invalid: '微软应用注册配置不符合 Minecraft 登录要求。',
  mc_already_bound: '该 Minecraft 账号已绑定到其他用户。',
  ms_network_error: '无法连接微软或 Xbox 服务，请稍后重试。',
  ms_token_failed: '微软登录凭证交换失败，请重试。',
  xbl_failed: 'Xbox Live 账号验证失败，请重试。',
  xsts_no_xbox_account: '该微软账号没有 Xbox 档案，请先创建免费档案。',
  xsts_country_blocked: '该微软账号所在地区不受支持。',
  xsts_minor_account: '未成年账号需要先加入家庭组。',
  xsts_adult_verification: '该账号需要完成成年人验证。',
  xsts_failed: 'Xbox 账号校验失败。',
  mc_login_failed: 'Minecraft 登录失败，请重试。',
  mc_not_owned: '该微软账号未拥有 Minecraft，请先购买后再登录。',
  mc_profile_failed: '获取 Minecraft 档案失败。',
}

const hasChinese = (value) => typeof value === 'string' && /[\u4e00-\u9fa5]/.test(value)

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const status = ref('processing') // processing | success | error
const message = ref('')

onMounted(async () => {
  const q = route.query
  // allauth appends ?error=... before the hash fragment, so also read the
  // top-level search params. Clean the address bar before any network request.
  const search = new URLSearchParams(window.location.search)
  const error = q.error || search.get('error')
  const errorDescription = q.error_description || search.get('error_description')
  window.history.replaceState(null, '', `${window.location.pathname}#${route.path}`)

  if (error) {
    status.value = 'error'
    message.value = ERR_MAP[error] || (hasChinese(errorDescription) ? errorDescription : '登录失败，请返回登录页重试。')
    return
  }

  try {
    await auth.consumeMicrosoftCallback()
    status.value = 'success'
    message.value = '欢迎回来，正在进入你的世界…'
    await router.replace('/dashboard')
  } catch {
    status.value = 'error'
    message.value = '登录态写入失败，请重新登录'
  }
})

function backToLogin() {
  router.replace('/login')
}
</script>

<template>
  <div class="cb-wrap">
    <div class="card cb-card">
      <p class="cb-eyebrow">
        微软登录回调
      </p>
      <h1 class="cb-title">
        微软登录
      </h1>
      <p
        v-if="status === 'processing'"
        class="text-muted"
      >
        处理中…
      </p>
      <p
        v-else-if="status === 'success'"
        class="cb-success"
        role="status"
      >
        {{ message }}
      </p>
      <template v-else>
        <p class="text-error">
          {{ message }}
        </p>
        <button
          class="btn-primary"
          type="button"
          @click="backToLogin"
        >
          返回登录
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cb-wrap {
  display: flex;
  justify-content: center;
  padding-top: clamp(1.6rem, 8vw, 4.3rem);
  animation: rise-in 0.45s ease both;
}

.cb-card {
  width: 100%;
  max-width: 480px;
  padding: clamp(32px, 4vw, 52px);
  border-radius: 18px;
  text-align: center;
  background:
    radial-gradient(ellipse at 50% 0%, #16210f5c 0%, transparent 58%),
    linear-gradient(160deg, var(--panel-raised) 0%, var(--panel) 100%);
  box-shadow: 0 30px 100px #00000073;
}

.cb-eyebrow {
  margin-bottom: 0.4rem;
  font-family: var(--font-pixel);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand);
}

.cb-title {
  margin-bottom: 1.1rem;
  font-family: var(--font-display);
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 400;
  line-height: 1.05;
}

.cb-success {
  color: var(--brand);
}

.text-error {
  margin-bottom: 1.2rem;
  color: var(--danger);
}

.text-muted {
  color: var(--text-soft);
}

.cb-card .btn-primary {
  min-width: 160px;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cb-wrap { animation: none; }
}
</style>
