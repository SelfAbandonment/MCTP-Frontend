<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { errorMessage, localRedirect } from '@/utils/errors'

const props = defineProps({ mode: { type: String, required: true } })
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const error = ref('')
const loading = ref(false)
const title = computed(() => ({
  session: '暂时无法读取你的资料',
  forbidden: '这里是社区管理区',
  missing: '这条小路还没有通往哪里',
})[props.mode])
const code = computed(() => ({
  session: '503',
  forbidden: '403',
  missing: '404',
})[props.mode])
const kicker = computed(() => ({
  session: '连接暂停',
  forbidden: '403 / 管理入口',
  missing: '404 / 此处无路',
})[props.mode])

async function retry() {
  loading.value = true
  error.value = ''
  try {
    await auth.ensureSession()
    await router.replace(localRedirect(route.query.redirect))
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="route-status">
    <span
      class="route-status__num"
      aria-hidden="true"
    >{{ code }}</span>
    <p class="eyebrow">
      {{ kicker }}
    </p>
    <h1>{{ title }}</h1>
    <p class="text-muted">
      {{ mode === 'forbidden' ? '需要管理员权限。你仍可以回到玩家中心。' : mode === 'session' ? '登录凭据已保留，请检查连接后重试。' : '回到首页，换个方向继续探索。' }}
    </p>
    <p
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </p>
    <div class="actions">
      <button
        v-if="mode === 'session'"
        class="btn-primary"
        :disabled="loading"
        @click="retry"
      >
        {{ loading ? '连接中…' : '重试' }}
      </button>
      <RouterLink
        to="/"
        class="btn-secondary"
      >
        返回首页
      </RouterLink>
      <RouterLink
        v-if="mode === 'forbidden'"
        to="/dashboard"
        class="btn-primary"
      >
        玩家中心
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.route-status {
  position: relative;
  isolation: isolate;
  max-width: 760px;
  padding: clamp(50px, 9vw, 120px) 0;
}

/* 全视口的环境光晕：固定在视口上，渐变在屏幕边缘已经淡出，
   不会在内容盒边界留下半透明矩形硬边，也不会造成横向滚动。 */
.route-status::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background:
    radial-gradient(circle at 72% 28%, #1c301640 0%, transparent 58%),
    radial-gradient(circle at 8% 88%, #8ce06a12 0%, transparent 44%);
}

.route-status__num {
  position: absolute;
  top: 0;
  right: -0.06em;
  z-index: -1;
  font-family: var(--font-display);
  font-size: clamp(170px, 28vw, 360px);
  line-height: 0.8;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe217;
  pointer-events: none;
  user-select: none;
}

.route-status h1 {
  margin-bottom: 20px;
  font-family: var(--font-display);
  font-size: clamp(38px, 5.6vw, 78px);
  font-weight: 400;
  line-height: 1.02;
  letter-spacing: -0.01em;
}

.route-status .eyebrow { margin-bottom: 18px; }

.route-status > p:not(.eyebrow):not(.alert) {
  max-width: 46ch;
  margin-bottom: 26px;
  font-size: 14px;
  line-height: 1.9;
}

.route-status .actions { margin-top: 8px; }

@media (max-width: 700px) {
  .route-status__num {
    top: 0;
    font-size: clamp(130px, 40vw, 220px);
    opacity: 0.85;
  }

  .route-status h1 { font-size: clamp(32px, 9.4vw, 48px); }
}
</style>
