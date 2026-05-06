<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 错误码 -> 中文友好提示
const ERR_MAP = {
  ms_oauth_not_configured: '后端尚未配置 Microsoft OAuth，请联系管理员。',
  ms_app_registration_invalid: 'Azure 应用注册不符合 Minecraft 登录要求，请检查应用类型与账号类型配置。',
  mc_already_bound: '该 Minecraft 账号已绑定到其他用户，无法重复绑定。',
  ms_network_error: '无法连接 Microsoft/Xbox 服务（网络或 DNS 问题），请稍后重试。',
  ms_token_failed: 'Microsoft 令牌交换失败，请重试。',
  xbl_failed: 'Xbox Live 验证失败，请重试。',
  xsts_no_xbox_account: '该微软账号没有 Xbox 档案，请先到 https://xbox.com 创建免费 Xbox 账户后重试。',
  xsts_country_blocked: '该微软账号所在国家/地区不支持 Xbox Live。',
  xsts_minor_account: '未成年账号需要先被加入家庭组才能登录。',
  xsts_adult_verification: '该账号需要完成成年人验证。',
  xsts_failed: 'Xbox 账号校验失败。',
  mc_login_failed: 'Minecraft 登录失败，请重试。',
  mc_not_owned: '该微软账号未拥有 Minecraft 正版，请先购买后再登录。',
  mc_profile_failed: '获取 Minecraft 档案失败。',
  invalid_state: '登录状态校验失败（state 不匹配），请重新发起登录。',
  missing_code: '回调缺失 code 参数。',
  server_error: '服务器内部错误，请稍后重试。',
  access_denied: '你取消了授权。',
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const status = ref('processing') // processing | success | error
const message = ref('')

onMounted(async () => {
  const q = route.query
  if (q.error) {
    status.value = 'error'
    message.value = ERR_MAP[q.error] || q.error_description || '登录失败'
    return
  }
  const access = q.access
  const refresh = q.refresh
  if (!access || !refresh) {
    status.value = 'error'
    message.value = '回调参数缺失'
    return
  }
  try {
    await auth.consumeMicrosoftCallback({ access, refresh })
    status.value = 'success'
    message.value = `欢迎回来，${q.mc_username || ''}`
    // 清掉 URL 上的敏感参数后跳转
    setTimeout(() => router.replace('/dashboard'), 600)
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
      <p class="cb-eyebrow">OAuth Callback</p>
      <h2 class="cb-title">微软登录</h2>
      <p v-if="status === 'processing'" class="text-muted">处理中…</p>
      <p v-else-if="status === 'success'" class="cb-success">{{ message }}</p>
      <template v-else>
        <p class="text-error">{{ message }}</p>
        <button class="btn-primary" type="button" @click="backToLogin">返回登录</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cb-wrap {
  display: flex;
  justify-content: center;
  padding-top: clamp(1.6rem, 8vw, 4.3rem);
  animation: rise-in 0.45s ease;
}

.cb-card {
  width: 100%;
  max-width: 460px;
  text-align: center;
}

.cb-eyebrow {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  margin-bottom: 0.2rem;
}

.cb-title {
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: 0.9rem;
}

.cb-success {
  color: #b8f6d9;
}

.text-error {
  color: #ffb3b3;
  margin-bottom: 1rem;
}
</style>
