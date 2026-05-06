<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

/* ---- cursor ---- */
const cursorX = ref(-300)
const cursorY = ref(-300)
const follX = ref(-300)
const follY = ref(-300)
let _rawX = -300
let _rawY = -300
let _fX = -300
let _fY = -300
let raf = null

function onMouseMove(e) {
  _rawX = e.clientX
  _rawY = e.clientY
  cursorX.value = _rawX
  cursorY.value = _rawY
}

function tick() {
  _fX += (_rawX - _fX) * 0.1
  _fY += (_rawY - _fY) * 0.1
  follX.value = _fX
  follY.value = _fY
  raf = requestAnimationFrame(tick)
}

/* ---- block parallax ---- */
const blockRef = ref(null)
const sceneRef = ref(null)

function onSceneMove(e) {
  if (!blockRef.value || !sceneRef.value) return
  const r = sceneRef.value.getBoundingClientRect()
  const dx = ((e.clientX - r.left) / r.width - 0.5) * 2
  const dy = ((e.clientY - r.top) / r.height - 0.5) * 2
  blockRef.value.style.setProperty('--ry', `${dx * 20}deg`)
  blockRef.value.style.setProperty('--rx', `${dy * -15}deg`)
}

function onSceneLeave() {
  if (!blockRef.value) return
  blockRef.value.style.setProperty('--ry', '28deg')
  blockRef.value.style.setProperty('--rx', '-22deg')
}

/* ---- scroll reveals ---- */
let io = null
function setupReveal() {
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          io.unobserve(e.target)
        }
      }),
    { threshold: 0.12 },
  )
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  tick()
  document.body.classList.add('nc')
  nextTick(setupReveal)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(raf)
  io?.disconnect()
  document.body.classList.remove('nc')
})
</script>

<template>
  <div class="page">
    <!-- ① 胶片颗粒感覆盖层 -->
    <div class="grain" aria-hidden="true" />

    <!-- ② 自定义光标 -->
    <div
      class="c-dot"
      aria-hidden="true"
      :style="{ transform: `translate(${cursorX - 4}px, ${cursorY - 4}px)` }"
    />
    <div
      class="c-ring"
      aria-hidden="true"
      :style="{ transform: `translate(${follX - 18}px, ${follY - 18}px)` }"
    />

    <!-- ③ 首屏 HERO -->
    <section class="s-hero">
      <div class="hero-ambient" />
      <div class="hero-l">
        <p class="lbl" data-reveal style="--d:0ms">MINECRAFT CONTROL PLANE · MCTP · 2026</p>
        <h1 class="hero-h">
          <span class="hw" data-reveal style="--d:60ms">进入</span>
          <span class="hw c-orange" data-reveal style="--d:130ms">方块</span>
          <span class="hw" data-reveal style="--d:200ms">世界</span>
        </h1>
        <p class="hero-p" data-reveal style="--d:280ms">
          统一 Microsoft OAuth 与 JWT 的 Minecraft 身份控制台。<br />一个入口，贯穿所有世界。
        </p>
        <div class="hero-btns" data-reveal style="--d:360ms">
          <RouterLink to="/register" class="b-fill">创建角色</RouterLink>
          <RouterLink to="/login" class="b-outline">进入传送门</RouterLink>
        </div>
      </div>

      <div class="hero-r" ref="sceneRef" @mousemove="onSceneMove" @mouseleave="onSceneLeave">
        <div class="blk-glow" />
        <div class="blk-orbit">
          <span class="orb" />
        </div>
        <div class="blk-perspective">
          <div class="blk-float-wrap">
            <div class="mc-block" ref="blockRef">
              <div class="face f-top" />
              <div class="face f-front" />
              <div class="face f-right" />
              <div class="face f-back" />
              <div class="face f-left" />
              <div class="face f-bot" />
            </div>
          </div>
        </div>
        <p class="blk-badge">AUTH · ONLINE</p>
      </div>

      <div class="scroll-cue" aria-hidden="true">
        <span>SCROLL</span>
        <div class="sc-line" />
      </div>
    </section>

    <!-- ④ IDENTITY 全屏文字揭示 -->
    <section class="s-identity">
      <p class="lbl" data-reveal>01 · WHO YOU ARE</p>
      <p class="big-word" data-reveal style="--d:0ms">账号</p>
      <p class="big-word c-orange" data-reveal style="--d:80ms">就是</p>
      <p class="big-word" data-reveal style="--d:160ms">你的护照</p>
      <p class="s-p" data-reveal style="--d:240ms">
        从注册到签发，从委托到绑定，MCTP 将身份认证的复杂性<br />收折成一行 API 调用。
      </p>
    </section>

    <!-- ⑤ BIOMES 三群系卡片 -->
    <section class="s-biomes">
      <div class="s-head">
        <p class="lbl" data-reveal>02 · THE BIOMES</p>
        <h2 class="s-h2" data-reveal>探索三个群系</h2>
      </div>
      <div class="biomes-grid">
        <article class="biome" data-reveal style="--d:0ms">
          <div class="biome-vis b-ow" />
          <p class="biome-name">Overworld</p>
          <p class="biome-desc">基础注册、JWT 签发。安全平稳的起点，就像出生点。</p>
        </article>
        <article class="biome" data-reveal style="--d:110ms">
          <div class="biome-vis b-ne" />
          <p class="biome-name">Nether</p>
          <p class="biome-desc">Microsoft OAuth 绑定、高风险链路防护。危险但必经之地。</p>
        </article>
        <article class="biome" data-reveal style="--d:220ms">
          <div class="biome-vis b-end" />
          <p class="biome-name">The End</p>
          <p class="biome-desc">控制台终态，权限、状态与接口能力汇聚于此。</p>
        </article>
      </div>
    </section>

    <!-- ⑥ CRAFTING 合成台配方 -->
    <section class="s-craft">
      <p class="lbl" data-reveal>03 · THE RECIPE</p>
      <h2 class="s-h2" data-reveal>合成你的<br /><span class="c-orange">身份令牌</span></h2>
      <div class="recipe-wrap" data-reveal style="--d:80ms">
        <div class="craft-grid">
          <div class="cslot s-ms"><span>MS</span></div>
          <div class="cslot" />
          <div class="cslot s-jwt"><span>JWT</span></div>
          <div class="cslot" />
          <div class="cslot s-mc"><span class="blk-mini" /></div>
          <div class="cslot" />
          <div class="cslot s-api"><span>API</span></div>
          <div class="cslot" />
          <div class="cslot s-shield"><span>🔒</span></div>
        </div>
        <div class="r-arrow">→</div>
        <div class="r-out">
          <div class="r-blk" />
          <p>MCTP<br />TOKEN</p>
        </div>
      </div>
      <p class="s-p" data-reveal style="--d:200ms">
        Microsoft OAuth · JWT · API-FIRST Django · 三料合一。
      </p>
    </section>

    <!-- ⑦ 跑马灯 footer strip -->
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee">
        <span v-for="n in 4" :key="n">
          MINECRAFT <em>·</em> OVERWORLD <em>·</em> NETHER <em>·</em> THE END
          <em>·</em> OAUTH <em>·</em> JWT <em>·</em> MCTP <em>·</em> IDENTITY <em>·</em>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==============================
   PAGE BASE
============================== */
.page {
  background: #090806;
  color: #ede6dc;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: var(--font-display);
}

/* ==============================
   GRAIN OVERLAY
============================== */
.grain {
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 140px 140px;
  animation: grain-shift 0.4s steps(1) infinite;
}

@keyframes grain-shift {
  0% {
    background-position: 0px 0px;
  }
  20% {
    background-position: -75px -60px;
  }
  40% {
    background-position: 45px -80px;
  }
  60% {
    background-position: -90px 45px;
  }
  80% {
    background-position: 70px 70px;
  }
  100% {
    background-position: -34px -80px;
  }
}

/* ==============================
   CUSTOM CURSOR
============================== */
:global(body.nc),
:global(body.nc *) {
  cursor: none !important;
}

.c-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff8a3d;
  pointer-events: none;
  z-index: 950;
  mix-blend-mode: difference;
}

.c-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 138, 61, 0.5);
  pointer-events: none;
  z-index: 950;
}

/* ==============================
   SHARED
============================== */
.lbl {
  font-family: var(--font-mono);
  font-size: 0.67rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6a6058;
  margin-bottom: 1.4rem;
}

.c-orange {
  color: #ff8a3d;
}

.s-p {
  font-size: 1rem;
  color: #8a7f72;
  max-width: 48ch;
  line-height: 1.75;
  margin-top: 2rem;
}

.s-h2 {
  font-size: clamp(2.2rem, 5vw, 4.2rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.06;
}

/* ==============================
   REVEAL ANIMATION
============================== */
[data-reveal] {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.72s ease,
    transform 0.72s ease;
  transition-delay: var(--d, 0ms);
}

[data-reveal].revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ==============================
   HERO  (全屏)
============================== */
.s-hero {
  position: relative;
  height: 100vh;
  min-height: 640px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: center;
  padding: 0 6vw;
  overflow: hidden;
}

.hero-ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 55% 60% at 20% 50%, rgba(255, 138, 61, 0.13), transparent),
    radial-gradient(ellipse 40% 50% at 80% 50%, rgba(159, 106, 255, 0.07), transparent);
  pointer-events: none;
}

/* Hero left text */
.hero-h {
  font-size: clamp(3.6rem, 9.5vw, 8.4rem);
  font-weight: 700;
  line-height: 0.93;
  letter-spacing: -0.03em;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.4rem;
}

.hw {
  display: block;
}

.hero-p {
  font-size: clamp(0.88rem, 1.3vw, 1.05rem);
  color: #8a7f72;
  max-width: 40ch;
  line-height: 1.8;
  margin-bottom: 2.2rem;
}

.hero-btns {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.b-fill {
  background: #ff8a3d;
  color: #0d0a06;
  border: none;
  border-radius: 100px;
  padding: 13px 30px;
  font-weight: 700;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  font-family: var(--font-display);
  transition:
    filter 0.2s,
    transform 0.2s;
}

.b-fill:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
}

.b-outline {
  background: transparent;
  color: #ede6dc;
  border: 1px solid rgba(237, 230, 220, 0.25);
  border-radius: 100px;
  padding: 13px 30px;
  font-size: 0.88rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  font-family: var(--font-display);
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.b-outline:hover {
  border-color: rgba(237, 230, 220, 0.55);
  transform: translateY(-2px);
}

/* Hero right: 3D scene */
.hero-r {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blk-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 138, 61, 0.2), transparent 66%);
  pointer-events: none;
}

.blk-orbit {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px solid rgba(255, 138, 61, 0.22);
  animation: spin 18s linear infinite;
}

.orb {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff8a3d;
  box-shadow: 0 0 18px rgba(255, 138, 61, 0.95);
}

/* MC Block */
.blk-perspective {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.blk-float-wrap {
  transform-style: preserve-3d;
  animation: blk-float 5s ease-in-out infinite;
}

.mc-block {
  --sz: 164px;
  --rx: -22deg;
  --ry: 28deg;
  width: var(--sz);
  height: var(--sz);
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 0.2s ease-out;
}

.face {
  position: absolute;
  width: var(--sz);
  height: var(--sz);
  image-rendering: pixelated;
  backface-visibility: visible;
}

.f-front {
  transform: translateZ(calc(var(--sz) / 2));
}
.f-back {
  transform: rotateY(180deg) translateZ(calc(var(--sz) / 2));
}
.f-right {
  transform: rotateY(90deg) translateZ(calc(var(--sz) / 2));
}
.f-left {
  transform: rotateY(-90deg) translateZ(calc(var(--sz) / 2));
}
.f-top {
  transform: rotateX(90deg) translateZ(calc(var(--sz) / 2));
}
.f-bot {
  transform: rotateX(-90deg) translateZ(calc(var(--sz) / 2));
}

/* Grass block face textures (CSS approximation) */
.f-top {
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(0, 0, 0, 0.07) 8px 9px),
    repeating-linear-gradient(90deg, transparent 0 8px, rgba(0, 0, 0, 0.07) 8px 9px),
    #6ab94f;
}

.f-front,
.f-left {
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(0, 0, 0, 0.06) 8px 9px),
    repeating-linear-gradient(90deg, transparent 0 8px, rgba(0, 0, 0, 0.06) 8px 9px),
    linear-gradient(180deg, #6ab94f 0 14%, #7d5535 14% 100%);
  background-blend-mode: normal, normal, normal;
}

.f-right,
.f-back {
  background:
    repeating-linear-gradient(0deg, transparent 0 8px, rgba(0, 0, 0, 0.1) 8px 9px),
    repeating-linear-gradient(90deg, transparent 0 8px, rgba(0, 0, 0, 0.1) 8px 9px),
    linear-gradient(180deg, #4a9430 0 14%, #5c3d24 14% 100%);
}

.f-bot {
  background: #7d5535;
}

.blk-badge {
  position: absolute;
  bottom: 16%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  color: rgba(255, 196, 140, 0.7);
  white-space: nowrap;
}

/* Scroll cue */
.scroll-cue {
  position: absolute;
  bottom: 2.6rem;
  left: 6vw;
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.22em;
  color: #4a4440;
}

.sc-line {
  width: 44px;
  height: 1px;
  background: currentColor;
  animation: sc-pulse 1.6s ease-in-out infinite;
  transform-origin: left;
}

/* ==============================
   IDENTITY  (텍스트 전체화면)
============================== */
.s-identity {
  min-height: 88vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vh 6vw;
}

.big-word {
  font-size: clamp(3.2rem, 9vw, 8rem);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.03em;
  margin-bottom: 0.12em;
}

/* ==============================
   BIOMES
============================== */
.s-biomes {
  padding: 8vh 6vw;
}

.s-head {
  margin-bottom: 3.2rem;
}

.biomes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
}

.biome {
  padding: 1.5rem;
  border: 1px solid rgba(255, 138, 61, 0.15);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.022);
  transition:
    border-color 0.26s,
    transform 0.22s;
}

.biome:hover {
  border-color: rgba(255, 138, 61, 0.44);
  transform: translateY(-5px);
}

.biome-vis {
  width: 100%;
  height: 110px;
  border-radius: 12px;
  margin-bottom: 1.1rem;
}

/* Overworld: sky → grass → dirt → stone */
.b-ow {
  background: linear-gradient(180deg, #2d69b0 0 38%, #6ab94f 38% 54%, #7d5535 54% 74%, #5e5c5a 74% 100%);
}

/* Nether: deep red, lava glow */
.b-ne {
  background:
    radial-gradient(ellipse 60% 50% at 30% 75%, rgba(255, 100, 0, 0.6), transparent),
    linear-gradient(180deg, #1a0a00 0 25%, #7a2a00 25% 60%, #8a3800 60% 100%);
}

/* The End: void purple */
.b-end {
  background:
    radial-gradient(ellipse 50% 55% at 55% 42%, rgba(140, 60, 255, 0.42), transparent),
    linear-gradient(160deg, #0b0615 0%, #110824 55%, #1a0f30 100%);
}

.biome-name {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.45rem;
}

.biome-desc {
  font-size: 0.87rem;
  color: #8a7f72;
  line-height: 1.68;
}

/* ==============================
   CRAFTING
============================== */
.s-craft {
  padding: 8vh 6vw 10vh;
  min-height: 76vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.recipe-wrap {
  display: flex;
  align-items: center;
  gap: 2.4rem;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.craft-grid {
  display: grid;
  grid-template-columns: repeat(3, 58px);
  gap: 6px;
  background: rgba(10, 8, 6, 0.85);
  border: 1px solid rgba(255, 138, 61, 0.22);
  border-radius: 14px;
  padding: 14px;
}

.cslot {
  width: 58px;
  height: 58px;
  border-radius: 8px;
  border: 1px solid rgba(255, 138, 61, 0.13);
  background: rgba(255, 255, 255, 0.022);
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.05em;
  color: #7a7068;
}

.s-ms {
  background: rgba(0, 120, 215, 0.18);
  border-color: rgba(0, 120, 215, 0.4);
  color: #60aaff;
}
.s-jwt {
  background: rgba(255, 138, 61, 0.14);
  border-color: rgba(255, 138, 61, 0.4);
  color: #ff8a3d;
}
.s-mc {
  background: rgba(106, 185, 79, 0.12);
  border-color: rgba(106, 185, 79, 0.38);
}
.s-api {
  background: rgba(140, 120, 255, 0.12);
  border-color: rgba(140, 120, 255, 0.32);
  color: #9080ff;
}
.s-shield {
  background: rgba(220, 220, 220, 0.05);
  border-color: rgba(220, 220, 220, 0.18);
}

.blk-mini {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  background: linear-gradient(145deg, #6ab94f 0 48%, #7d5535 48% 100%);
}

.r-arrow {
  font-size: 2.4rem;
  color: #ff8a3d;
  opacity: 0.85;
}

.r-out {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.r-blk {
  width: 68px;
  height: 68px;
  border-radius: 10px;
  border: 1px solid rgba(255, 138, 61, 0.5);
  background: radial-gradient(circle at 35% 35%, rgba(255, 210, 120, 0.28), transparent 55%),
    linear-gradient(145deg, #ff8a3d, #cc5a00);
  box-shadow: 0 0 32px rgba(255, 138, 61, 0.5);
  animation: blk-pulse 2.2s ease-in-out infinite;
}

.r-out p {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: #ff8a3d;
  text-align: center;
  line-height: 1.5;
}

/* ==============================
   MARQUEE
============================== */
.marquee-wrap {
  border-top: 1px solid rgba(255, 138, 61, 0.14);
  padding: 1.4rem 0;
  overflow: hidden;
  white-space: nowrap;
}

.marquee {
  display: inline-flex;
  animation: marquee 22s linear infinite;
}

.marquee span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4a4440;
  padding-right: 2.8rem;
}

.marquee em {
  font-style: normal;
  color: #ff8a3d;
  margin: 0 0.6em;
}

/* ==============================
   KEYFRAMES
============================== */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes blk-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-18px);
  }
}

@keyframes blk-pulse {
  0%,
  100% {
    box-shadow: 0 0 32px rgba(255, 138, 61, 0.5);
  }
  50% {
    box-shadow: 0 0 54px rgba(255, 138, 61, 0.82);
  }
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
  }
}

@keyframes sc-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scaleX(0.5);
  }
  50% {
    opacity: 1;
    transform: scaleX(1);
  }
}

/* ==============================
   RESPONSIVE
============================== */
@media (max-width: 980px) {
  .s-hero {
    grid-template-columns: 1fr;
    height: auto;
    padding: 110px 6vw 80px;
    gap: 3rem;
  }

  .hero-r {
    height: 300px;
  }

  .scroll-cue {
    display: none;
  }

  .biomes-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .big-word {
    font-size: clamp(2.6rem, 13vw, 5rem);
  }

  .recipe-wrap {
    flex-direction: column;
    align-items: flex-start;
  }

  .biome {
    border-radius: 14px;
  }
}
</style>
