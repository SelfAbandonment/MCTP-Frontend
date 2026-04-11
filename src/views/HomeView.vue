<script setup>
</script>

<template>
  <div>
    <section class="hero">
      <h1 class="hero-title">MCTP <span class="gradient">Platform</span></h1>
      <p class="text-muted" style="margin-bottom:2rem">基于 Django 6.0 + Vue 3 构建的现代化 API 平台</p>
      <div class="cta-row">
        <RouterLink to="/register" class="nav-btn">免费注册</RouterLink>
        <RouterLink to="/login" class="nav-btn-outline">已有账号，登录</RouterLink>
      </div>
    </section>

    <div class="feature-grid">
      <div class="feature-card">
        <span class="feat-icon">🔐</span>
        <h3>JWT 认证</h3>
        <p>基于 SimpleJWT 的安全认证，支持 token 自动刷新</p>
      </div>
      <div class="feature-card">
        <span class="feat-icon">📖</span>
        <h3>自动文档</h3>
        <p>drf-spectacular 生成 Swagger / ReDoc，实时可调试</p>
      </div>
      <div class="feature-card">
        <span class="feat-icon">⚡</span>
        <h3>高性能</h3>
        <p>Gunicorn + WhiteNoise，部署于 Render.com</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero { text-align: center; padding: 4rem 0 3rem; }
.hero-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
.gradient { background: linear-gradient(135deg, #58a6ff, #bc8cff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.cta-row { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.nav-btn { padding: 10px 24px; border-radius: 6px; font-size: 0.95rem; font-weight: 600; background: #238636; color: #fff; transition: background 0.2s; }
.nav-btn:hover { background: #2ea043; }
.nav-btn-outline { padding: 10px 24px; border-radius: 6px; font-size: 0.95rem; background: transparent; border: 1px solid #30363d; color: #e6edf3; transition: background 0.2s; }
.nav-btn-outline:hover { background: #21262d; }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; margin-top: 1rem; }
.feature-card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; padding: 1.75rem; text-align: center; }
.feat-icon { font-size: 2rem; display: block; margin-bottom: 0.75rem; }
.feature-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.feature-card p { font-size: 0.85rem; color: #8b949e; line-height: 1.6; }
</style>
