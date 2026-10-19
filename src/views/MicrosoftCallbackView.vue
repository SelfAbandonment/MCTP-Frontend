<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 错误码 -> 中文友好提示
const ERR_MAP = {
  ms_oauth_not_configured: '后端尚未配置微软登录，请联系管理员。',
  ms_app_registration_invalid: '应用注册不符合我的世界登录要求，请检查应用类型与账号类型配置。',
  mc_already_bound: '该我的世界账号已绑定到其他用户，无法重复绑定。',
  ms_network_error: '无法连接微软或游戏验证服务（网络问题），请稍后重试。',
  ms_token_failed: '微软登录凭证交换失败，请重试。',
  xbl_failed: '游戏账号验证失败，请重试。',
  xsts_no_xbox_account: '该微软账号没有游戏档案，请先创建免费档案后重试。',
  xsts_country_blocked: '该微软账号所在国家或地区不受支持。',
  xsts_minor_account: '未成年账号需要先被加入家庭组才能登录。',
  xsts_adult_verification: '该账号需要完成成年人验证。',
  xsts_failed: '游戏账号校验失败。',
  mc_login_failed: '我的世界登录失败，请重试。',
  mc_not_owned: '该微软账号未拥有我的世界，请先购买后再登录。',
  mc_profile_failed: '获取我的世界档案失败。',
  invalid_state: '登录状态校验失败，请重新发起登录。',
  missing_code: '回调参数缺失。',
  server_error: '服务器内部错误，请稍后重试。',
  access_denied: '你取消了授权。',
}

// 后端可能返回英文错误描述；只在含中文时直接展示，避免页面出现英文。
const hasChinese = (value) => typeof value === 'string' && /[\u4e00-\u9fa5]/.test(value)

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const status = ref('processing') // processing | success | error
const message = ref('')

onMounted(async () => {
  const q = route.query
  // Remove credentials from browser history before making any network request.
  await router.replace({ path: route.path })
  if (q.error) {
    status.value = 'error'
    message.value = ERR_MAP[q.error] || (hasChinese(q.error_description) ? q.error_description : '登录失败，请返回登录页重试。')
    return
  }
  const access = q.access
  const refresh = q.refresh
  if (typeof access !== 'string' || typeof refresh !== 'string' || !access || !refresh) {
    status.value = 'error'
    message.value = '回调参数缺失'
    return
  }
  try {
    await auth.consumeMicrosoftCallback({ access, refresh })
    status.value = 'success'
    message.value = `欢迎回来，${q.mc_username || ''}`
    await router.replace('/dashboard')
  } catch (e) {
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
