<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '@/components/ui/Icon.vue'

const year = computed(() => new Date().getFullYear())
const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'
const repo = 'https://github.com/SelfAbandonment/MCTP-Frontend'
const words = ['玩家社区', '生存服务器', '入服指引', '更新记录', '加入我们']
</script>

<template>
  <footer class="site-footer">
    <div
      class="site-footer__marquee"
      aria-hidden="true"
    >
      <div class="site-footer__marquee-track">
        <span
          v-for="(word, index) in [...words, ...words]"
          :key="`${word}-${index}`"
        >{{ word }} <em>✦</em> </span>
      </div>
    </div>

    <div class="site-footer__main">
      <div class="site-footer__brand">
        <RouterLink
          class="site-footer__logo"
          to="/"
        >
          <span
            class="site-footer__cube"
            aria-hidden="true"
          />
          <span class="display">MCTP</span>
        </RouterLink>
        <p>一个由玩家一起生活的方块世界。<br>慢一点，久一点，把想象建成日常。</p>
        <span class="site-footer__note">非官方游戏网站 · 与游戏版权方无关联</span>
      </div>

      <nav
        class="site-footer__nav"
        aria-label="页脚导航"
      >
        <div>
          <h2>社区</h2>
          <RouterLink to="/">
            首页
          </RouterLink>
          <RouterLink to="/announcements">
            公告
          </RouterLink>
          <a
            :href="joinGuide"
            target="_blank"
            rel="noopener noreferrer"
          >入服指引 <Icon
            name="arrow-up-right"
            :size="12"
          /></a>
        </div>
        <div>
          <h2>玩家</h2>
          <RouterLink to="/login">
            登录
          </RouterLink>
          <RouterLink to="/register">
            注册
          </RouterLink>
          <RouterLink to="/dashboard">
            玩家中心
          </RouterLink>
        </div>
        <div>
          <h2>项目</h2>
          <a
            :href="repo"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub ↗</a>
          <RouterLink to="/announcements">
            更新记录
          </RouterLink>
        </div>
      </nav>
    </div>

    <div
      class="site-footer__wordmark display"
      aria-hidden="true"
    >
      MCREATOPIA
    </div>

    <div class="site-footer__bottom">
      <span>© {{ year }} MCTP MC社区</span>
      <span>一起生活，一起创造</span>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  overflow: hidden;
  background: #050505;
  border-top: 1px solid #f2efe214;
}

.site-footer__marquee {
  overflow: hidden;
  background: var(--brand);
  color: #061006;
}

.site-footer__marquee-track {
  display: flex;
  width: max-content;
  animation: footer-marquee 36s linear infinite;
}

.site-footer__marquee span {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.22em 0.4em;
  font-family: var(--font-display);
  font-size: clamp(28px, 3.6vw, 58px);
  line-height: 1.15;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.site-footer__marquee em {
  font-style: normal;
  font-size: 0.34em;
  opacity: 0.55;
}

.site-footer__main {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: clamp(40px, 7vw, 120px);
  padding: clamp(56px, 8vw, 110px) clamp(20px, 6vw, 100px) clamp(30px, 4vw, 56px);
  border-bottom: 1px solid #f2efe214;
}

.site-footer__logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1;
  letter-spacing: 0.06em;
}

.site-footer__cube {
  width: 26px;
  height: 30px;
  display: inline-block;
  background: linear-gradient(150deg, #9be378 0 45%, #62be46 46% 72%, #b07e52 73%);
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
}

.site-footer__brand p {
  margin-top: 22px;
  max-width: 34ch;
  font-size: 13px;
  line-height: 1.9;
  color: rgba(242, 239, 226, 0.56);
}

.site-footer__note {
  display: inline-block;
  margin-top: 22px;
  font-size: 10px;
  letter-spacing: 0.18em;
  color: rgba(242, 239, 226, 0.34);
}

.site-footer__nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.site-footer__nav h2 {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  color: var(--brand);
  margin-bottom: 18px;
}

.site-footer__nav a {
  display: block;
  padding: 7px 0;
  font-size: 13px;
  color: rgba(242, 239, 226, 0.55);
  transition: color 200ms;
}

.site-footer__nav a:hover { color: #f2efe2; }

.site-footer__wordmark {
  padding: clamp(18px, 2vw, 30px) clamp(20px, 6vw, 100px) 0;
  font-size: clamp(72px, 18vw, 320px);
  line-height: 0.82;
  letter-spacing: 0.04em;
  color: transparent;
  -webkit-text-stroke: 1px #f2efe21c;
  white-space: nowrap;
  user-select: none;
  transform: translateY(0.08em);
}

.site-footer__bottom {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px clamp(20px, 6vw, 100px) 26px;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(242, 239, 226, 0.32);
}

@keyframes footer-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

@media (max-width: 900px) {
  .site-footer__main { grid-template-columns: 1fr; gap: 48px; }
  .site-footer__nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .site-footer__nav { grid-template-columns: 1fr 1fr; gap: 22px; }
  .site-footer__bottom { flex-direction: column; gap: 8px; }
  .site-footer__marquee-track { animation-duration: 24s; }
}

@media (prefers-reduced-motion: reduce) {
  .site-footer__marquee-track { animation: none; }
}
</style>
