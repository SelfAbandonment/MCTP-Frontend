<script setup>
import { computed, ref } from 'vue'
import { media } from '@/assets/media'
import GearScene from '@/components/home/GearScene.vue'

const joinGuide = 'https://docs.qq.com/space/DTXNidGZ1S2FncG9v'

const places = computed(() => media.features.map((item, index) => ({
  ...item,
  num: `0${index + 1}`,
  note: [
    '从出生点往北走，最先看到的是连成片的山谷草地。',
    '每周六晚最热闹的地方，招牌会一直亮到凌晨。',
    '云层之上的一小块地，只有一座桥连着。',
    '这里的人不太说话，但总会有人给你留一盏灯。',
    '入夜之后，整座岛只剩下红石和萤石的光。',
  ][index],
})))

const voices = [
  { quote: '第一天来的时候，有人在出生点等我，先给了我一把石镐。', name: '阿柴', meta: '第 3 年 · 建筑' },
  { quote: '这里的红石线路比我上班写的代码还复杂，但真的能跑起来。', name: '白露', meta: '第 2 年 · 红石' },
  { quote: '把整座浮岛搬上云里花了三个月，落成那晚大家都在。', name: 'Kite', meta: '第 5 年 · 生存' },
]

const specs = [
  { term: '模式', value: '生存 / 创造' },
  { term: '平台', value: 'Java 版' },
  { term: '语言', value: '中文 · English' },
  { term: '入服', value: '需正版账号' },
]

const activePlace = ref(0)
</script>

<template>
  <div class="mctp-page">
    <!-- 01 · HERO -->
    <section class="mctp-hero">
      <GearScene class="mctp-hero__scene" />

      <div class="mctp-hero__chrome">
        <p class="mctp-hero__kicker sub2">
          MCREATOPIA · 方块之间，自有天地
        </p>

        <h1 class="mctp-hero__mark display">
          MCTP
        </h1>

        <p class="mctp-hero__note body2">
          一个人可以住得很远，<br>
          也可以随时被叫去帮忙。<br>
          世界不催你，但总有人在。
        </p>

        <aside class="mctp-hero__card">
          <p class="sub1">
            由玩家共建的世界
          </p>
          <span class="o-dashline" />
          <p class="sub2 mctp-hero__card-foot">
            第 7 年 · 生存 / 创造 / 红石
          </p>
        </aside>


        <p class="mctp-hero__cue sub2">
          <span class="mctp-hero__dot" />
          SCROLL TO CONTINUE
        </p>
      </div>
    </section>

    <!-- 02 · INTRO -->
    <section
      id="intro"
      class="mctp-section"
    >
      <div class="o-container">
        <div class="o-grid mctp-grid">
          <p class="mctp-eyebrow sub2">
            01 — 世界 / THE WORLD
          </p>

          <h2 class="mctp-h2 display">
            世界不必很大，<br>
            但要每天都在变。
          </h2>

          <p class="mctp-copy body1">
            有人在山谷里修了一条不实用的铁路，有人把整座浮岛搬到了云上，
            也有人只是每天早上来给公共农场浇水。这里没有主线任务，
            只有玩家自己留下的痕迹。
          </p>

          <dl class="mctp-specs">
            <div
              v-for="item in specs"
              :key="item.term"
              class="mctp-specs__item"
            >
              <dt class="sub2">
                {{ item.term }}
              </dt>
              <dd class="body2">
                {{ item.value }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- 03 · PLACES -->
    <section
      id="places"
      class="mctp-section"
    >
      <div class="o-container">
        <div class="o-grid mctp-grid">
          <p class="mctp-eyebrow sub2">
            02 — 常去的地方 / PLACES
          </p>

          <h2 class="mctp-h2 display">
            五个常去的地方
          </h2>

          <ul class="mctp-places">
            <li
              v-for="(place, index) in places"
              :key="place.title"
              class="mctp-place"
              :class="{ 'is-active': activePlace === index }"
              @pointerenter="activePlace = index"
              @focusin="activePlace = index"
            >
              <span class="mctp-place__num sub2">{{ place.num }}</span>
              <span class="mctp-place__title display">{{ place.title }}</span>
              <span class="mctp-place__note body3">{{ place.note }}</span>
              <span class="mctp-place__media">
                <img
                  :src="place.poster"
                  :alt="`${place.title} 场景`"
                  loading="lazy"
                  decoding="async"
                >
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 04 · VOICES -->
    <section
      id="voices"
      class="mctp-section mctp-section--alt"
    >
      <div class="o-container">
        <div class="o-grid mctp-grid">
          <p class="mctp-eyebrow sub2">
            03 — 玩家说 / VOICES
          </p>

          <h2 class="mctp-h2 display">
            他们说这里像家
          </h2>

          <ul class="mctp-voices">
            <li
              v-for="item in voices"
              :key="item.name"
              class="mctp-voice"
            >
              <p class="mctp-voice__quote display">
                {{ item.quote }}
              </p>
              <p class="mctp-voice__meta sub2">
                {{ item.name }} · {{ item.meta }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 05 · JOIN -->
    <section
      id="join"
      class="mctp-section mctp-join"
    >
      <div class="o-container">
        <div class="o-grid mctp-grid">
          <p class="mctp-eyebrow sub2">
            04 — 加入 / JOIN
          </p>

          <h2 class="mctp-h2 mctp-h2--xl display">
            门一直开着，<br>
            进来看看。
          </h2>

          <div class="mctp-actions">
            <RouterLink
              class="btn"
              to="/register"
            >
              创建账号 ↗
            </RouterLink>
            <a
              class="btn btn--ghost"
              :href="joinGuide"
              target="_blank"
              rel="noopener noreferrer"
            >
              入服指南 ↗
            </a>
          </div>

          <p class="mctp-join__note sub2">
            需要正版 Minecraft · 白名单审核 · 通常在 24 小时内回复
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* 设计系统移植自 oryzo：16 列栅格、字号阶、DM Mono 小字、衬线大标题 */
@font-face {
  font-family: 'Literata';
  src: url('/fonts/Literata.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'DM Mono';
  src: url('/fonts/DM-Mono-400-Latin.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

.mctp-page {
  --mctp-black: #100904;
  --mctp-white: #ffedd7;
  --mctp-green: #445231;
  --mctp-green-light: #5d6c49;
  --mctp-orange: #dc5000;
  --mctp-grey: #6c5f51;

  --site-padding-x: 3.125vw;
  --grid-columns: 16;
  --grid-gap: calc(var(--site-padding-x) * 0.42);
  --pad-y: clamp(72px, 11vh, 150px);

  position: relative;
  width: 100%;
  background: var(--mctp-black);
  color: var(--mctp-white);
  font-family: 'Literata', 'Microsoft YaHei', serif;
}

.mctp-page .display {
  font-family: 'Literata', 'Microsoft YaHei', serif;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1;
}

.mctp-page .sub1,
.mctp-page .sub2 {
  font-family: 'DM Mono', ui-monospace, monospace;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1.3;
}

.mctp-page .sub1 { font-size: 13px; }
.mctp-page .sub2 { font-size: 10px; letter-spacing: 0.2em; }
.mctp-page .body1 { font-size: clamp(15px, 1.15vw, 18px); line-height: 1.72; }
.mctp-page .body2 { font-size: clamp(14px, 1vw, 16px); line-height: 1.66; }
.mctp-page .body3 { font-size: 12px; line-height: 1.7; color: #b9b09c; }

.mctp-page .o-container {
  width: 100%;
  padding: 0 var(--site-padding-x);
}

.mctp-page .o-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
  column-gap: var(--grid-gap);
}

.mctp-page .o-dashline {
  display: block;
  height: 1px;
  background: repeating-linear-gradient(90deg, #ffedd766 0 2px, transparent 0 7px);
}

/* hero */
.mctp-hero {
  position: relative;
  height: 100svh;
  min-height: 640px;
  overflow: hidden;
  background:
    radial-gradient(120% 90% at 64% 34%, #29301d 0%, #14170e 54%, #0a0c06 100%);
}

.mctp-hero__scene {
  position: absolute;
  inset: 0;
}

.mctp-hero__chrome {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 0 var(--site-padding-x);
  pointer-events: none;
}

.mctp-hero__chrome > * { pointer-events: auto; }

.mctp-hero__kicker {
  position: absolute;
  top: clamp(92px, 12vh, 126px);
  left: var(--site-padding-x);
  margin: 0;
  color: #d8cfbaa8;
}

.mctp-hero__mark {
  position: absolute;
  top: clamp(96px, 13vh, 150px);
  left: calc(var(--site-padding-x) - 0.02em);
  margin: 0;
  font-size: clamp(88px, 19vw, 300px);
  line-height: 0.8;
  color: var(--mctp-white);
  text-shadow: 0 40px 120px #00000066;
}

.mctp-hero__note {
  position: absolute;
  top: clamp(150px, 19vh, 220px);
  right: var(--site-padding-x);
  margin: 0;
  text-align: right;
  color: #e6dccb;
  text-shadow: 0 2px 24px #0a0c06, 0 0 40px #0a0c0699;
}

.mctp-hero__card {
  position: absolute;
  bottom: clamp(104px, 14vh, 148px);
  left: var(--site-padding-x);
  width: 272px;
  padding: 22px 22px 18px;
  border: 1px solid #ffedd729;
  background: #ffedd70d;
  backdrop-filter: blur(6px);
}

.mctp-hero__card .o-dashline { margin: 22px 0 12px; }

.mctp-hero__card-foot { color: #d8cfba99; }

.mctp-hero__side {
  position: absolute;
  top: 50%;
  right: 26px;
  margin: 0;
  transform: translateY(-50%) rotate(90deg);
  color: #d8cfba77;
  white-space: nowrap;
}

.mctp-hero__cue {
  position: absolute;
  left: 50%;
  bottom: clamp(32px, 5vh, 52px);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  transform: translateX(-50%);
  color: #d8cfba99;
  white-space: nowrap;
}

.mctp-hero__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mctp-orange);
  animation: mctp-pulse 2.4s ease-in-out infinite;
}

@keyframes mctp-pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* sections */
.mctp-section {
  position: relative;
  padding: var(--pad-y) 0;
  background: var(--mctp-black);
}

.mctp-section--alt { background: #0c0f08; }

.mctp-grid { row-gap: clamp(28px, 4vw, 56px); }

.mctp-eyebrow {
  grid-column: 1 / span 3;
  margin: 0;
  color: var(--mctp-green-light);
  align-self: start;
}

.mctp-h2 {
  grid-column: 4 / span 9;
  margin: 0;
  font-size: clamp(32px, 4.4vw, 72px);
  line-height: 1.22;
  color: var(--mctp-white);
}

.mctp-h2--xl { font-size: clamp(42px, 6.6vw, 104px); }

.mctp-copy {
  grid-column: 4 / span 7;
  margin: 0;
  color: #c9c0ac;
}

.mctp-specs {
  grid-column: 4 / span 13;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  margin: clamp(24px, 3vw, 40px) 0 0;
  border-top: 1px solid #ffedd71f;
  background: #ffedd71f;
}

.mctp-specs__item {
  padding: 18px 16px;
  background: var(--mctp-black);
}

.mctp-specs__item dt { margin-bottom: 10px; color: var(--mctp-grey); }
.mctp-specs__item dd { margin: 0; color: var(--mctp-white); }

/* places */
.mctp-places {
  grid-column: 4 / span 13;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #ffedd71f;
}

.mctp-place {
  position: relative;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) minmax(0, 0.9fr);
  align-items: baseline;
  gap: 18px;
  padding: clamp(18px, 2vw, 26px) 210px clamp(18px, 2vw, 26px) 6px;
  border-bottom: 1px solid #ffedd71f;
  color: #8d8269;
  transition: color 240ms, padding-left 260ms;
  overflow: hidden;
}

.mctp-place.is-active {
  color: var(--mctp-white);
  padding-left: 16px;
}

.mctp-place__num { color: inherit; opacity: 0.7; }

.mctp-place__title {
  font-size: clamp(24px, 2.6vw, 38px);
  line-height: 1.1;
}

.mctp-place__note {
  margin: 0;
  color: #a99f8b;
}

.mctp-place__media {
  position: absolute;
  right: 0;
  top: 50%;
  width: 180px;
  height: 108px;
  transform: translate(40px, -50%) scale(0.92);
  opacity: 0;
  pointer-events: none;
  transition: opacity 280ms, transform 320ms;
  overflow: hidden;
  border: 1px solid #ffedd733;
}

.mctp-place__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mctp-place.is-active .mctp-place__media {
  opacity: 1;
  transform: translate(0, -50%) scale(1);
}

/* voices */
.mctp-voices {
  grid-column: 4 / span 13;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #ffedd71a;
}

.mctp-voice {
  padding: clamp(22px, 2.4vw, 34px);
  background: #0c0f08;
}

.mctp-voice__quote {
  margin: 0 0 26px;
  font-size: clamp(17px, 1.5vw, 22px);
  line-height: 1.6;
  color: #e8dfcd;
}

.mctp-voice__meta {
  margin: 0;
  color: var(--mctp-grey);
}

/* join */
.mctp-join {
  background:
    radial-gradient(90% 120% at 16% 12%, #1c2414 0%, transparent 60%),
    var(--mctp-black);
}

.mctp-actions {
  grid-column: 4 / span 9;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: clamp(26px, 3.4vw, 44px);
}

.mctp-page .btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 15px 26px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--mctp-white);
  color: #140d05;
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 220ms, color 220ms, transform 220ms;
}

.mctp-page .btn:hover {
  background: var(--mctp-orange);
  color: var(--mctp-white);
  transform: translateY(-2px);
}

.mctp-page .btn--ghost {
  background: transparent;
  border-color: #ffedd73d;
  color: var(--mctp-white);
}

.mctp-page .btn--ghost:hover {
  border-color: var(--mctp-green-light);
  background: #44523133;
  color: var(--mctp-white);
}

.mctp-join__note {
  grid-column: 4 / span 9;
  margin: clamp(26px, 3vw, 40px) 0 0;
  color: #7d735f;
}

@media (max-width: 900px) {
  .mctp-page {
    --grid-columns: 4;
    --site-padding-x: 20px;
  }

  .mctp-eyebrow,
  .mctp-h2,
  .mctp-copy,
  .mctp-specs,
  .mctp-places,
  .mctp-voices,
  .mctp-actions,
  .mctp-join__note {
    grid-column: 1 / -1;
  }

  .mctp-specs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mctp-voices { grid-template-columns: 1fr; }
  .mctp-hero { height: auto; min-height: 0; padding: 116px 0 48px; }
  .mctp-hero__chrome { height: auto; }
  .mctp-hero__scene { display: none; }
  .mctp-hero__kicker,
  .mctp-hero__mark,
  .mctp-hero__note,
  .mctp-hero__card,
  .mctp-hero__cue { position: static; }
  .mctp-hero__mark { font-size: clamp(72px, 24vw, 140px); margin: 10px 0 18px; }
  .mctp-hero__note { display: none; }
  .mctp-hero__side { display: none; }
  .mctp-hero__card { width: 100%; margin-top: 22px; }
  .mctp-hero__cue { margin-top: 24px; transform: none; }
  .mctp-place { grid-template-columns: 32px minmax(0, 1fr); }
  .mctp-place__note { display: none; }
  .mctp-place__media { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .mctp-hero__dot { animation: none; }
  .mctp-page .btn { transition: none; }
}
</style>
