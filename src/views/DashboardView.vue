<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mctp-api.onrender.com'
const auth = useAuthStore()

const health = ref(null)
const healthLoading = ref(true)
const healthError = ref(null)
const lastChecked = ref(null)

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
  <div>
    <section class="hero">
      <h1 class="hero-title">
        欢迎回来，<span class="gradient">{{ auth.user?.username || '...' }}</span>
      </h1>
      <p class="text-muted">这是你的 MCTP 控制台</p>
    </section>

    <div class="cards">
      <!-- 用户信息 -->
      <div class="card">
        <div class="card-header"><span class="card-title">账户信息</span></div>
        <div class="card-body">
          <div class="info-row"><span class="info-label">用户名</span><span>{{ auth.user?.username }}</span></div>
          <div class="info-row"><span class="info-label">邮箱</span><span>{{ auth.user?.email }}</span></div>
          <div class="info-row"><span class="info-label">注册时间</span>
            <span>{{ auth.user?.date_joined ? new Date(auth.user.date_joined).toLocaleDateString() : '-' }}</span>
          </div>
        </div>
      </div>

      <!-- 服务状态 -->
      <div class="card">
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
.hero { margin-bottom: 2rem; }
.hero-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.4rem; }
.gradient { background: linear-gradient(135deg, #58a6ff, #bc8cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem; }
.card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
.card-header { padding: 1rem 1.25rem; border-bottom: 1px solid #21262d; display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; font-size: 0.95rem; }
.card-body { padding: 1.25rem; }
.refresh-time { font-size: 0.75rem; color: #8b949e; }
.info-row { display: flex; justify-content: space-between; font-size: 0.88rem; padding: 6px 0; border-bottom: 1px solid #21262d; }
.info-row:last-child { border-bottom: none; }
.info-label { color: #8b949e; }
.status-row { display: flex; align-items: center; gap: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot-ok { background: #3fb950; box-shadow: 0 0 8px #3fb950; }
.dot-error { background: #f85149; }
.dot-loading { background: #e3b341; animation: pulse 1.2s infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
.status-ok { color: #3fb950; font-weight: 600; }
.status-error { color: #f85149; }
</style>
