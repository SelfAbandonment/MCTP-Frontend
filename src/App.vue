<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://mctp-api.onrender.com'

const health = ref(null)
const loading = ref(true)
const lastChecked = ref(null)
const error = ref(null)

async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/health/`)
    const data = await res.json()
    health.value = data
    error.value = null
  } catch (e) {
    error.value = e.message
    health.value = null
  } finally {
    loading.value = false
    lastChecked.value = new Date().toLocaleTimeString()
  }
}

let timer = null
onMounted(() => {
  checkHealth()
  timer = setInterval(checkHealth, 30000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="app">
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">MCTP</span>
          <span class="logo-sub">API</span>
        </div>
        <nav class="nav">
          <a :href="`${API_BASE}/api/docs/`" target="_blank" class="nav-btn">
            Swagger UI ↗
          </a>
          <a :href="`${API_BASE}/api/redoc/`" target="_blank" class="nav-btn nav-btn-outline">
            ReDoc ↗
          </a>
        </nav>
      </div>
    </header>

    <main class="main">
      <section class="hero">
        <h1 class="hero-title">MCTP API <span class="gradient">Dashboard</span></h1>
        <p class="hero-desc">基于 Django 6.0 + DRF 构建的后端 API 服务，提供 JWT 认证、Swagger 文档、健康检查等能力。</p>
      </section>

      <section class="cards">
        <!-- Health Status Card -->
        <div class="card card-health">
          <div class="card-header">
            <span class="card-title">服务状态</span>
            <span class="refresh-time" v-if="lastChecked">上次检查 {{ lastChecked }}</span>
          </div>
          <div class="card-body">
            <div v-if="loading" class="status-row">
              <span class="dot dot-loading"></span>
              <span class="status-text">检查中...</span>
            </div>
            <div v-else-if="error" class="status-row">
              <span class="dot dot-error"></span>
              <span class="status-text status-error">连接失败</span>
              <span class="status-hint">{{ error }}</span>
            </div>
            <div v-else class="status-row">
              <span class="dot dot-ok"></span>
              <span class="status-text status-ok">{{ health?.data?.status || 'healthy' }}</span>
            </div>
            <div class="meta" v-if="health">
              <div class="meta-item">
                <span class="meta-label">版本</span>
                <span class="meta-val">{{ health?.data?.version || '1.0.0' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">响应码</span>
                <span class="meta-val">{{ health?.code }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">消息</span>
                <span class="meta-val">{{ health?.message }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- API Endpoints Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">API 端点</span>
          </div>
          <div class="card-body">
            <ul class="endpoint-list">
              <li class="endpoint-item">
                <span class="method get">GET</span>
                <span class="path">/api/v1/health/</span>
                <span class="desc">服务健康检查（公开）</span>
              </li>
              <li class="endpoint-item">
                <span class="method get">GET</span>
                <span class="path">/api/v1/health/detail/</span>
                <span class="desc">详细健康检查（需鉴权）</span>
              </li>
              <li class="endpoint-item">
                <span class="method post">POST</span>
                <span class="path">/api/v1/auth/token/</span>
                <span class="desc">获取 JWT Token</span>
              </li>
              <li class="endpoint-item">
                <span class="method post">POST</span>
                <span class="path">/api/v1/auth/token/refresh/</span>
                <span class="desc">刷新 JWT Token</span>
              </li>
              <li class="endpoint-item">
                <span class="method get">GET</span>
                <span class="path">/api/docs/</span>
                <span class="desc">Swagger 交互文档</span>
              </li>
              <li class="endpoint-item">
                <span class="method get">GET</span>
                <span class="path">/api/redoc/</span>
                <span class="desc">ReDoc 文档</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tech Stack Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">技术栈</span>
          </div>
          <div class="card-body">
            <div class="tags">
              <span class="tag">Django 6.0</span>
              <span class="tag">Django REST Framework</span>
              <span class="tag">JWT Auth</span>
              <span class="tag">drf-spectacular</span>
              <span class="tag">SQLite / PostgreSQL</span>
              <span class="tag">CORS Headers</span>
              <span class="tag">Gunicorn</span>
              <span class="tag">WhiteNoise</span>
            </div>
          </div>
        </div>

        <!-- Links Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">快速链接</span>
          </div>
          <div class="card-body links-body">
            <a :href="`${API_BASE}/api/docs/`" target="_blank" class="link-item">
              <span class="link-icon">📖</span>
              <div>
                <div class="link-title">Swagger UI</div>
                <div class="link-desc">交互式 API 文档与调试</div>
              </div>
            </a>
            <a :href="`${API_BASE}/api/redoc/`" target="_blank" class="link-item">
              <span class="link-icon">📚</span>
              <div>
                <div class="link-title">ReDoc</div>
                <div class="link-desc">精美的 API 参考文档</div>
              </div>
            </a>
            <a href="https://github.com/SelfAbandonment/MCTP-API" target="_blank" class="link-item">
              <span class="link-icon">🐙</span>
              <div>
                <div class="link-title">GitHub 后端仓库</div>
                <div class="link-desc">SelfAbandonment/MCTP-API</div>
              </div>
            </a>
            <a href="https://github.com/SelfAbandonment/MCTP-Frontend" target="_blank" class="link-item">
              <span class="link-icon">🎨</span>
              <div>
                <div class="link-title">GitHub 前端仓库</div>
                <div class="link-desc">SelfAbandonment/MCTP-Frontend</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>MCTP API · Built with Django 6.0 + Vue 3 · <a href="https://github.com/SelfAbandonment/MCTP-API" target="_blank">GitHub</a></p>
    </footer>
  </div>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0d1117; color: #e6edf3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

.app { min-height: 100vh; display: flex; flex-direction: column; }

/* Header */
.header { border-bottom: 1px solid #21262d; padding: 0 2rem; }
.header-inner { max-width: 1100px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.logo { display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 1.2rem; }
.logo-icon { font-size: 1.4rem; }
.logo-text { color: #58a6ff; }
.logo-sub { color: #8b949e; font-weight: 400; font-size: 0.9rem; }
.nav { display: flex; gap: 12px; }
.nav-btn { padding: 6px 16px; border-radius: 6px; font-size: 0.85rem; text-decoration: none; font-weight: 500; background: #238636; color: #fff; transition: background 0.2s; }
.nav-btn:hover { background: #2ea043; }
.nav-btn-outline { background: transparent; border: 1px solid #30363d; color: #e6edf3; }
.nav-btn-outline:hover { background: #21262d; }

/* Main */
.main { flex: 1; max-width: 1100px; margin: 0 auto; padding: 2.5rem 2rem; width: 100%; }

.hero { margin-bottom: 2rem; }
.hero-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
.gradient { background: linear-gradient(135deg, #58a6ff, #bc8cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { color: #8b949e; font-size: 1rem; max-width: 600px; line-height: 1.6; }

/* Cards */
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem; }
.card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
.card-health { border-color: #30363d; }
.card-header { padding: 1rem 1.25rem; border-bottom: 1px solid #21262d; display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; font-size: 0.95rem; }
.refresh-time { font-size: 0.75rem; color: #8b949e; }
.card-body { padding: 1.25rem; }

/* Health */
.status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
.dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.dot-ok { background: #3fb950; box-shadow: 0 0 8px #3fb950; }
.dot-error { background: #f85149; box-shadow: 0 0 8px #f85149; }
.dot-loading { background: #e3b341; animation: pulse 1.2s infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
.status-text { font-weight: 600; font-size: 1rem; }
.status-ok { color: #3fb950; }
.status-error { color: #f85149; }
.status-hint { font-size: 0.8rem; color: #8b949e; }
.meta { display: flex; flex-direction: column; gap: 8px; }
.meta-item { display: flex; justify-content: space-between; font-size: 0.85rem; }
.meta-label { color: #8b949e; }
.meta-val { color: #e6edf3; font-family: monospace; }

/* Endpoints */
.endpoint-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.endpoint-item { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.method { font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; font-family: monospace; flex-shrink: 0; }
.get { background: #1f4a1f; color: #3fb950; }
.post { background: #1a3a5c; color: #58a6ff; }
.path { font-family: monospace; font-size: 0.82rem; color: #e6edf3; }
.desc { font-size: 0.78rem; color: #8b949e; }

/* Tags */
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag { background: #21262d; border: 1px solid #30363d; border-radius: 20px; padding: 4px 12px; font-size: 0.8rem; color: #c9d1d9; }

/* Links */
.links-body { display: flex; flex-direction: column; gap: 10px; }
.link-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; text-decoration: none; color: inherit; transition: background 0.15s; border: 1px solid transparent; }
.link-item:hover { background: #21262d; border-color: #30363d; }
.link-icon { font-size: 1.4rem; flex-shrink: 0; }
.link-title { font-weight: 500; font-size: 0.9rem; }
.link-desc { font-size: 0.78rem; color: #8b949e; margin-top: 2px; }

/* Footer */
.footer { text-align: center; padding: 1.5rem; border-top: 1px solid #21262d; color: #8b949e; font-size: 0.82rem; }
.footer a { color: #58a6ff; text-decoration: none; }
</style>
