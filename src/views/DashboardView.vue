<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://api.mcreatopla.top:21009'
const auth = useAuthStore()

const health = ref(null)
const healthLoading = ref(true)
const healthError = ref(null)
const lastChecked = ref(null)
const unbindLoading = ref(false)

async function unbindMs() {
  if (!confirm('确定解绑微软/Minecraft 账号？')) return
  unbindLoading.value = true
  try {
    await authApi.microsoftUnbind()
    await auth.fetchMe()
  } catch (e) {
    alert('解绑失败：' + (e.response?.data?.message || e.message))
  } finally {
    unbindLoading.value = false
  }
}

async function bindMs() {
  try { await auth.microsoftLogin() } catch (e) { alert('无法发起微软登录') }
}

async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/health/`)
    health.value = await res.json()
    healthError.value = null
  } catch (e) {
    healthError.value = e.message
    health.value = null
  } finally {
    healthLoading.value = false
    lastChecked.value = new Date().toLocaleTimeString()
  }
}

let timer = null
onMounted(() => { checkHealth(); timer = setInterval(checkHealth, 30000) })
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="dash-wrap">
    <section class="hero">
      <p class="hero-eyebrow">Workspace Overview</p>
      <h1 class="hero-title">
        欢迎回来，<span class="gradient">{{ auth.user?.username || '...' }}</span>
      </h1>
      <p class="text-muted">这是你的 MCTP 控制台</p>
    </section>

    <div class="cards">
      <!-- 用户信息 -->
      <div class="card dash-card">
        <div class="card-header"><span class="card-title">账户信息</span></div>
        <div class="card-body">
          <div class="info-row"><span class="info-label">用户名</span><span>{{ auth.user?.username }}</span></div>
          <div class="info-row"><span class="info-label">邮箱</span><span>{{ auth.user?.email }}</span></div>
          <div class="info-row"><span class="info-label">注册时间</span>
            <span>{{ auth.user?.date_joined ? new Date(auth.user.date_joined).toLocaleDateString() : '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Minecraft 绑定 -->
      <div class="card dash-card">
        <div class="card-header"><span class="card-title">Minecraft 账号</span></div>
        <div class="card-body">
          <template v-if="auth.user?.minecraft">
            <div class="info-row"><span class="info-label">玩家名</span><span class="chip">{{ auth.user.minecraft.username }}</span></div>
            <div class="info-row"><span class="info-label">UUID</span><span class="uuid-text">{{ auth.user.minecraft.uuid }}</span></div>
            <div class="info-row info-avatar" style="border:none">
              <img :src="`https://crafatar.com/avatars/${auth.user.minecraft.uuid}?size=48&overlay`" alt="head" width="48" height="48" class="avatar-head" />
              <button class="btn-link" :disabled="unbindLoading" @click="unbindMs">{{ unbindLoading ? '解绑中...' : '解绑' }}</button>
            </div>
          </template>
          <template v-else>
            <p class="text-muted" style="margin-bottom:1rem">尚未绑定微软/Minecraft 账号</p>
            <button class="btn-primary" type="button" @click="bindMs">绑定 Microsoft</button>
          </template>
        </div>
      </div>

      <!-- 服务状态 -->
      <div class="card dash-card">
        <div class="card-header">
          <span class="card-title">服务状态</span>
          <span class="refresh-time" v-if="lastChecked">{{ lastChecked }}</span>
        </div>
        <div class="card-body">
          <div v-if="healthLoading" class="status-row">
            <span class="dot dot-loading"></span><span>检查中...</span>
          </div>
          <div v-else-if="healthError" class="status-row">
            <span class="dot dot-error"></span><span class="status-error">连接失败</span>
          </div>
          <div v-else class="status-row">
            <span class="dot dot-ok"></span>
            <span class="status-ok">{{ health?.data?.status }}</span>
          </div>
          <div class="info-row" v-if="health" style="margin-top:1rem">
            <span class="info-label">版本</span><span>{{ health?.data?.version }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-wrap {
  animation: rise-in 0.45s ease;
}

.hero {
  margin-bottom: 1.8rem;
}

.hero-eyebrow {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  margin-bottom: 0.45rem;
}

.hero-title {
  font-size: clamp(1.45rem, 3.8vw, 2.3rem);
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.gradient {
  background: linear-gradient(120deg, #94f0c3, #f4a261);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.dash-card {
  overflow: hidden;
  padding: 0;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.dash-card:hover {
  transform: translateY(-3px);
  border-color: var(--line-strong);
}

.card-header {
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 21, 20, 0.5);
}

.card-title {
  font-weight: 700;
  font-size: 0.93rem;
  letter-spacing: 0.04em;
}

.card-body {
  padding: 1.2rem;
}

.refresh-time {
  font-size: 0.74rem;
  color: var(--text-soft);
  font-family: var(--font-mono);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  font-size: 0.88rem;
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--text-soft);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.chip {
  border: 1px solid rgba(101, 214, 162, 0.35);
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 0.8rem;
  color: #b4f3d4;
}

.uuid-text {
  font-family: var(--font-mono);
  font-size: 0.73rem;
  color: #c7ddd5;
}

.info-avatar {
  justify-content: space-between;
}

.avatar-head {
  border-radius: 8px;
  border: 1px solid var(--line);
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.28);
}

.status-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-ok {
  background: var(--brand);
  box-shadow: 0 0 12px rgba(101, 214, 162, 0.45);
}

.dot-error {
  background: var(--danger);
}

.dot-loading {
  background: var(--accent);
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.38; }
}

.status-ok {
  color: #b9f8da;
  font-weight: 600;
}

.status-error {
  color: #ffb3b3;
}

.btn-link {
  background: none;
  border: none;
  color: var(--accent);
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
}

.btn-link:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .info-row {
    font-size: 0.84rem;
  }
}
</style>
