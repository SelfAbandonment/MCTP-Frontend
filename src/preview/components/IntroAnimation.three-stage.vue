<script setup>
/**
 * 文件用途：预览页开场动画组件（参考 chronothreads.webflow.io 三段式开场改造）。
 * 作用：三段式开场——①加载遮罩（自动播放：极细进度条 + 终端日志 + 点击提示）→
 *       ②点击触发（遮罩淡出、齿轮淡入、主标题逐字拆字上滑、眉题/副文案/CTA 依次渐显，约 0.8s）
 *       → ③稳定首屏（底部居中大标题 + 左下副文案 + 右下 CTA + 底部压暗渐变）。
 *       动画结束或用户点击后，向父组件发出 finish 事件进入主界面。
 * 回退方式：本文件由 IntroAnimation.original.vue 改造而来，如需回退旧版（双齿轮对转自动播放），
 *       将 IntroAnimation.original.vue 复制覆盖本文件即可。
 * 配色：全部沿用预览页主题变量（--preview-bg/--preview-accent/--preview-text 等），不引入参考站黑蓝配色。
 * 字体：沿用现有像素字体栈（--preview-font），不引入付费字体；终端日志用 monospace。
 * 拆字：手写逐字 span 包裹实现，不引入 Splitting；动画使用项目已有 GSAP。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['finish'])

// 作用：阶段状态：'loading' 加载遮罩 / 'started' 点击后入场 + 稳定首屏 / 'done' 已结束。
// 原因：区分遮罩期与入场期，避免加载动画与入场动画互相干扰。
const stage = ref('loading')

// 作用：防重入标记：finish 只触发一次，避免动画 onComplete 与手动点击重复发出事件。
const done = ref(false)

// 作用：加载进度百分比（0 → 100），随极细进度条同步更新。
const percent = ref(0)

// 作用：终端日志已输出的行数组，加载阶段逐行追加。
const logs = ref([])

// 作用：是否加载完成（日志输出完毕且进度 100%），完成后显示「点击任意位置开始」。
const ready = ref(false)

// 作用：加载阶段终端日志文案（monospace + '>' 前缀，营造系统引导感）。
// TODO-CONTENT: 文案可随服主实际资源预加载流程调整。
const LOG_LINES = [
  '> Pre-fetching assets...',
  '> Loading archive...',
  '> Calibrating gears...',
  '> Ready.',
]

// 作用：主标题字符序列，逐字包裹实现拆字上滑入场。
// 原因：参考站用 Splitting 拆字，工程内不引入新依赖，改为手写逐字 span。
const TITLE = 'MCTP · 机械动力'
const titleChars = TITLE.split('')

// 作用：主视觉齿轮齿数量，用于 v-for 生成轮齿矩形。
const TEETH = 10

// 作用：读取「减少动态效果」偏好。
// 原因：无障碍要求——用户开启系统减少动效时，跳过冗长开场，短暂停留后直接进入主界面。
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let loadTl = null // 加载进度条时间线
let entryTl = null // 点击后入场时间线
let logTimer = null // 终端日志逐行输出定时器
let exitTimer = null // 稳定首屏展示后自动进入主界面的定时器

// 作用：结束开场并通知父组件切换主界面。
// 原因：done 防重入，避免重复触发 finish。
function finish() {
  if (done.value) return
  done.value = true
  emit('finish')
}

// 作用：点击根层的事件入口。
// 原因：加载中点击 = 跳过加载立即入场；入场后/稳定首屏点击 = 立即进入主界面。
function onClick() {
  if (stage.value === 'loading') {
    startScene()
  } else if (stage.value === 'started' && !done.value) {
    finish()
  }
}

// 作用：开始终端日志逐行输出（加载阶段自动播放，每行 0.5s）。
function runLog() {
  let i = 0
  logTimer = window.setInterval(() => {
    if (i < LOG_LINES.length) {
      logs.value.push(LOG_LINES[i])
      i += 1
    } else {
      window.clearInterval(logTimer)
      logTimer = null
      ready.value = true
    }
  }, 500)
}

// 作用：点击触发后的入场动画（约 0.8s）：
//       遮罩淡出 → 齿轮淡入 → 眉题渐显 → 标题拆字上滑 → 副文案/CTA 依次渐显。
// 原因：参考站「点击后 0.8s 完成品牌入场」的节奏，用 GSAP 时间线串联保证顺序。
function startScene() {
  if (stage.value !== 'loading') return
  stage.value = 'started'

  // 原因：入场开始即停止加载动画与日志输出，避免与入场动画竞争。
  loadTl?.kill()
  if (logTimer) window.clearInterval(logTimer)

  entryTl = gsap.timeline({
    onComplete() {
      // 作用：稳定首屏短暂展示后自动进入主界面。
      // 原因：保留原组件「动画结束进入主界面」的契约；稳定首屏期间点击可提前进入。
      exitTimer = window.setTimeout(finish, 900)
    },
  })

  entryTl
    .to('.preview-intro__overlay', { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0)
    // 作用：主视觉双齿轮淡入（轻微缩放），代替参考站的 3D 角色主视觉。
    .fromTo(
      '.preview-intro__gear',
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
      0.12,
    )
    .fromTo(
      '.preview-intro__eyebrow',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.25,
    )
    // 作用：主标题逐字拆字上滑（每字在 overflow:hidden 遮罩内自下而上滑入，带轻微交错）。
    .fromTo(
      '.preview-intro__title-char',
      { yPercent: 120 },
      { yPercent: 0, duration: 0.55, ease: 'power3.out', stagger: 0.045 },
      0.28,
    )
    .fromTo(
      '.preview-intro__sub',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.52,
    )
    .fromTo(
      '.preview-intro__cta',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.64,
    )
}

onMounted(() => {
  // 原因：减少动效用户直接跳过开场，避免不必要的等待。
  if (prefersReducedMotion) {
    window.setTimeout(finish, 600)
    return
  }

  // 作用：加载进度条 0 → 100%（0.25vw 级极细条），并同步更新百分比数字。
  // 原因：进度条与百分比需严格同步，故在 onUpdate 里读取动画进度换算为 0-100。
  loadTl = gsap.fromTo(
    '.preview-intro__panel-bar',
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 2,
      ease: 'power1.inOut',
      onUpdate() {
        percent.value = Math.round(this.progress() * 100)
        if (this.progress() >= 1) ready.value = true
      },
    },
  )

  // 作用：终端日志逐行输出（自动播放）。
  runLog()
})

onBeforeUnmount(() => {
  // 原因：组件销毁前终止所有动画与定时器，避免离开页面后继续执行造成内存泄漏。
  loadTl?.kill()
  entryTl?.kill()
  if (logTimer) window.clearInterval(logTimer)
  if (exitTimer) window.clearTimeout(exitTimer)
})
</script>

<template>
  <!-- 作用：开场根层；点击任意处触发（加载期跳过、入场期/稳定首屏立即进入，onClick 内按阶段分流）。 -->
  <div
    class="preview-intro"
    :class="'is-' + stage"
    @click="onClick"
  >
    <!-- ========== 阶段1：加载遮罩（自动播放） ========== -->
    <div
      class="preview-intro__overlay"
      :class="{ 'is-hidden': stage !== 'loading' }"
    >
      <!-- 作用：极淡网格层，模拟参考站遮罩网格；配色用主题线色变量。 -->
      <div
        class="preview-intro__grid"
        aria-hidden="true"
      />

      <!-- 作用：居中加载面板：Logo + 极细进度条 + 百分比 + 终端日志。 -->
      <div
        class="preview-intro__panel"
        aria-hidden="true"
      >
        <div class="preview-intro__panel-logo">
          MCTP
        </div>
        <div class="preview-intro__panel-track">
          <div class="preview-intro__panel-bar" />
        </div>
        <span class="preview-intro__panel-percent">{{ percent }}%</span>
        <div class="preview-intro__panel-log">
          <p
            v-for="(line, i) in logs"
            :key="i"
          >
            {{ line }}
          </p>
        </div>
        <!-- TODO-AUDIO: 音频开关（Off/On）占位，待接入开场音效后实现显式开关。 -->
      </div>

      <!-- 作用：面板下方「点击任意位置开始」提示，加载完成后闪烁。 -->
      <span
        class="preview-intro__panel-start"
        :class="{ 'is-ready': ready }"
      >点击任意位置开始</span>
    </div>

    <!-- ========== 阶段2/3：主场景（点击触发后入场，最终稳定首屏） ========== -->
    <div class="preview-intro__scene">
      <!-- 作用：主视觉——双齿轮（沿用原占位齿轮造型，作为 MCTP 版「主视觉」代替参考站 3D 角色）。 -->
      <div
        class="preview-intro__gears"
        aria-hidden="true"
      >
        <svg
          class="preview-intro__gear preview-intro__gear--a"
          viewBox="0 0 200 200"
        >
          <g
            v-for="n in TEETH"
            :key="n"
            :transform="`rotate(${(n - 1) * (360 / TEETH)} 100 100)`"
          >
            <rect
              x="90"
              y="2"
              width="20"
              height="32"
              rx="4"
              fill="currentColor"
            />
          </g>
          <circle
            cx="100"
            cy="100"
            r="72"
            fill="none"
            stroke="currentColor"
            stroke-width="18"
          />
          <circle
            cx="100"
            cy="100"
            r="42"
            fill="none"
            stroke="currentColor"
            stroke-width="20"
            stroke-dasharray="22 14"
          />
          <circle
            cx="100"
            cy="100"
            r="16"
            fill="currentColor"
          />
        </svg>
        <svg
          class="preview-intro__gear preview-intro__gear--b"
          viewBox="0 0 200 200"
        >
          <g
            v-for="n in TEETH"
            :key="n"
            :transform="`rotate(${(n - 1) * (360 / TEETH)} 100 100)`"
          >
            <rect
              x="92"
              y="2"
              width="16"
              height="30"
              rx="4"
              fill="currentColor"
            />
          </g>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="currentColor"
            stroke-width="16"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            fill="none"
            stroke="currentColor"
            stroke-width="18"
            stroke-dasharray="20 12"
          />
          <circle
            cx="100"
            cy="100"
            r="14"
            fill="currentColor"
          />
        </svg>
      </div>

      <!-- 作用：眉题——位于主标题上方，入场时先于标题渐显。 -->
      <p class="preview-intro__eyebrow">
        MCTP · MECHANICAL POWER
      </p>

      <!-- 作用：主标题——逐字拆字上滑入场（overflow 遮罩 + 逐字 span + GSAP）。
           原因：参考站 CHRONO 拆字入场方式，避免整块淡入的平庸感。 -->
      <h1 class="preview-intro__title">
        <span class="preview-intro__title-mask">
          <span
            v-for="(ch, i) in titleChars"
            :key="i"
            class="preview-intro__title-char"
          >{{ ch }}</span>
        </span>
      </h1>

      <!-- 作用：左下副文案——稳定首屏布局的左下角窄栏。 -->
      <!-- TODO-CONTENT: 副文案待服主定制。 -->
      <p class="preview-intro__sub">
        机械动力 · 服务器官网预览
      </p>

      <!-- 作用：右下 SCROLL DOWN CTA——稳定首屏布局的右下角。 -->
      <span class="preview-intro__cta">SCROLL DOWN ↓</span>
    </div>

    <!-- 作用：底部压暗渐变——保证底部标题/副文案在背景上可读（主题色变量实现）。 -->
    <div
      class="preview-intro__vignette"
      aria-hidden="true"
    />

    <!-- 作用：右上角版本号浮标（延续旧版信息位）。 -->
    <!-- TODO-CONTENT: 版本号与「Preview」标记待服主确认后调整。 -->
    <span class="preview-intro__version">v0.5.4 · PREVIEW</span>
  </div>
</template>

<style scoped>
/* 作用：开场根层——固定全屏覆盖，主题底色，整层可点击。 */
.preview-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--preview-bg);
  color: var(--preview-accent);
  cursor: pointer;
  overflow: hidden;
}

/* ===== 阶段1：加载遮罩 ===== */
/* 作用：遮罩层覆盖整个视口；入场时整体淡出（GSAP 控制 opacity，is-hidden 关闭点击穿透）。 */
.preview-intro__overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  background: var(--preview-bg);
}

.preview-intro__overlay.is-hidden {
  pointer-events: none;
}

/* 作用：极淡网格层——两条线性渐变交叉成细线网格，模拟工程蓝图/参考站网格遮罩。 */
.preview-intro__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--preview-line-strong) 1px, transparent 1px),
    linear-gradient(90deg, var(--preview-line-strong) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.14;
}

/* 作用：居中加载面板。 */
.preview-intro__panel {
  position: relative;
  width: min(400px, 78vw);
  padding: 28px 30px 24px;
  border: 1px solid var(--preview-line-strong);
  border-radius: 10px;
  background: color-mix(in srgb, var(--preview-bg-panel) 88%, transparent);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 作用：面板顶部 Logo/标题。 */
.preview-intro__panel-logo {
  font-family: var(--preview-font);
  font-size: 26px;
  letter-spacing: 0.28em;
  color: var(--preview-accent);
  text-shadow: 0 0 16px color-mix(in srgb, var(--preview-accent) 55%, transparent);
}

/* 作用：极细进度条轨道（0.25vw 级，min 1px 兜底）。 */
.preview-intro__panel-track {
  height: max(1px, 0.25vw);
  border-radius: 2px;
  background: color-mix(in srgb, var(--preview-text) 18%, transparent);
  overflow: hidden;
}

/* 作用：进度条激活条，由 GSAP 控制 scaleX 0 → 1。 */
.preview-intro__panel-bar {
  width: 100%;
  height: 100%;
  background: var(--preview-accent);
  transform-origin: left center;
  box-shadow: 0 0 10px var(--preview-accent);
}

/* 作用：加载百分比数字——等宽数字，像素感。 */
.preview-intro__panel-percent {
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--preview-text-soft);
  font-variant-numeric: tabular-nums;
}

/* 作用：终端日志容器——monospace 等宽，逐行输出。 */
.preview-intro__panel-log {
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  color: var(--preview-text-soft);
  min-height: 6.4em;
}

.preview-intro__panel-log p {
  margin: 0;
}

/* 作用：「点击任意位置开始」提示——默认隐藏，加载完成后闪烁。 */
.preview-intro__panel-start {
  font-size: 14px;
  letter-spacing: 0.18em;
  color: var(--preview-accent);
  opacity: 0;
  visibility: hidden;
  animation: preview-intro-blink 1s ease-in-out infinite;
}

.preview-intro__panel-start.is-ready {
  opacity: 1;
  visibility: visible;
}

/* ===== 阶段2/3：主场景 ===== */
/* 作用：主场景容器——铺满视口，底部对齐；入场元素初始透明/下移，由 GSAP 控制。 */
.preview-intro__scene {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 9vh;
}

/* 作用：主视觉齿轮容器——居中偏上，入场淡入。 */
.preview-intro__gears {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 160px;
}

/* 作用：齿轮初始透明（入场由 GSAP 淡入）。 */
.preview-intro__gear {
  opacity: 0;
}

.preview-intro__gear--a {
  width: 150px;
  height: 150px;
}

.preview-intro__gear--b {
  width: 110px;
  height: 110px;
  margin-left: -26px;
  margin-top: 40px;
}

/* 作用：眉题——主标题上方，入场先渐显。 */
.preview-intro__eyebrow {
  margin: 0 0 14px;
  font-size: 13px;
  letter-spacing: 0.32em;
  color: var(--preview-text-soft);
  opacity: 0;
}

/* 作用：主标题（底部居中，巨型像素字）。 */
.preview-intro__title {
  position: relative;
  margin: 0;
  font-family: var(--preview-font);
  font-size: clamp(34px, 7vw, 84px);
  letter-spacing: 0.08em;
  color: var(--preview-accent);
  text-shadow: 0 0 20px color-mix(in srgb, var(--preview-accent) 50%, transparent);
}

/* 作用：拆字遮罩——overflow hidden 裁剪逐字上滑过程。
   原因：参考站拆字入场核心：文字在遮罩内自下而上滑入。 */
.preview-intro__title-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

/* 作用：单个标题字符——inline-block 保持空格宽度；初始下移 120% 藏在遮罩外，由 GSAP 滑入。 */
.preview-intro__title-char {
  display: inline-block;
  white-space: pre;
  transform: translateY(120%);
}

/* 作用：左下副文案——窄栏、弱化，稳定首屏 L 形布局左下角。 */
.preview-intro__sub {
  position: absolute;
  left: 4vw;
  bottom: 7vh;
  max-width: 26vw;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  letter-spacing: 0.08em;
  color: var(--preview-text-soft);
  opacity: 0;
}

/* 作用：右下 SCROLL DOWN CTA——稳定首屏 L 形布局右下角。 */
.preview-intro__cta {
  position: absolute;
  right: 4vw;
  bottom: 7vh;
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--preview-accent);
  opacity: 0;
}

/* 作用：底部压暗渐变——transparent → 主题底色，保证底部文字可读。 */
.preview-intro__vignette {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 34%;
  background: linear-gradient(to top, var(--preview-bg), transparent);
  pointer-events: none;
}

/* 作用：右上角版本号浮标。 */
.preview-intro__version {
  position: absolute;
  right: 20px;
  top: 18px;
  z-index: 4;
  padding: 3px 10px;
  border: 1px solid var(--preview-line-strong);
  border-radius: 6px;
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--preview-text-soft);
  background: color-mix(in srgb, var(--preview-bg-panel) 70%, transparent);
}

/* 作用：加载完成提示闪烁。 */
@keyframes preview-intro-blink {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 1; }
}
</style>
