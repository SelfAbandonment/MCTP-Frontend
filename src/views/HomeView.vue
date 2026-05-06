<script setup>
</script>

<template>
  <div class="home-wrap">
    <section class="hero">
      <p class="hero-eyebrow">Infrastructure · Auth · Minecraft</p>
      <h1 class="hero-title">MCTP <span class="gradient">Control Surface</span></h1>
      <p class="hero-sub">基于 Django 6.0 + Vue 3 构建的 API 控制台，聚焦身份、监控与流程协作。</p>
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
.home-wrap {
  animation: rise-in 0.5s ease;
}

.hero {
  text-align: center;
  padding: 4.6rem 0 3.3rem;
}

.hero-eyebrow {
  color: var(--accent);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.74rem;
  margin-bottom: 0.7rem;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 4.3rem);
  line-height: 1;
  margin-bottom: 1.15rem;
}

.gradient {
  background: linear-gradient(120deg, #94f0c3, #f4a261);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-sub {
  max-width: 660px;
  margin: 0 auto 2rem;
  color: var(--text-soft);
  font-size: 1.02rem;
}

.cta-row {
  display: flex;
  gap: 0.9rem;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.feature-card {
  border: 1px solid var(--line);
  background: linear-gradient(160deg, rgba(26, 34, 32, 0.9), rgba(19, 25, 24, 0.72));
  border-radius: 14px;
  padding: 1.3rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  border-color: rgba(101, 214, 162, 0.42);
}

.feat-icon {
  font-size: 1.6rem;
  display: block;
  margin-bottom: 0.7rem;
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.feature-card p {
  color: var(--text-soft);
  font-size: 0.86rem;
}
</style>