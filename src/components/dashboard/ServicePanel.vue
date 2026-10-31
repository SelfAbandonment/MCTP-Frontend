<script setup>
import { useAuthStore } from '@/stores/auth'
import { useServiceHealth } from '@/composables/useServiceHealth'
import { formatDate } from '@/utils/errors'

const auth = useAuthStore()
const { health, loading, error, lastChecked, online, check } = useServiceHealth()
</script>

<template>
  <section
    class="panel service-panel"
    aria-labelledby="service-title"
  >
    <div class="panel-heading">
      <h2 id="service-title">
        社区服务
      </h2>
      <button
        class="text-button"
        :disabled="loading"
        @click="check"
      >
        刷新 ↻
      </button>
    </div>
    <p
      v-if="error"
      class="alert alert-error"
      role="alert"
    >
      {{ error }}
    </p>
    <p class="service-status">
      <span
        class="service-dot"
        :class="{ online: online && !error }"
        aria-hidden="true"
      />
      {{ loading ? '正在检查…' : error ? '暂时无法连接' : online ? '服务连接正常' : '服务状态异常' }}
    </p>
    <p class="security-note">
      这是网站服务状态，并非游戏服务器在线状态。
    </p>
    <dl class="detail-list">
      <div><dt>最近检查</dt><dd>{{ formatDate(lastChecked) }}</dd></div>
      <div><dt>服务版本</dt><dd>{{ health?.version || '—' }}</dd></div>
    </dl>
    <div class="service-links">
      <a
        href="https://docs.qq.com/space/DTXNidGZ1S2FncG9v"
        target="_blank"
        rel="noopener noreferrer"
      >入服指北 ↗</a>
      <RouterLink to="/announcements">
        社区公告 ↗
      </RouterLink>
      <RouterLink
        v-if="auth.isStaff"
        to="/manage"
      >
        进入管理区 ↗
      </RouterLink>
    </div>
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

.service-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 30px 0 15px;
  font-family: var(--font-display);
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.service-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--danger);
  box-shadow: 0 0 0 4px #ff7a661f;
}

.service-dot.online {
  background: var(--brand);
  box-shadow: 0 0 0 4px #8ce06a1f, 0 0 18px #8ce06a66;
}

.service-links { display: flex; flex-direction: column; margin-top: 30px; font-size: 13px; }
.service-links a { padding: 14px 0; border-bottom: 1px solid var(--line); transition: color 200ms; }
.service-links a:hover { color: var(--brand); }
</style>
