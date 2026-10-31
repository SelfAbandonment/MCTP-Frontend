<script setup>
/**
 * 文件用途：预览页开场动画组件
 * 作用：进入 /preview 后播放约 2.6 秒「双齿轮啮合对转 + 标题浮现 + 进度百分比计数」工业风动画，
 *       动画结束或点击「跳过」后向父组件发出 finish 事件进入主界面。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const emit = defineEmits(['finish'])

const done = ref(false)
// 作用：进度百分比显示值（0 → 100），随进度条填充同步更新。
const percent = ref(0)
let tl = null

// 作用：齿轮齿数量，用于 v-for 生成轮齿矩形。
const TEETH = 10

// 作用：读取「减少动态效果」偏好。
// 原因：无障碍要求——用户开启系统减少动效时，跳过冗长动画，短暂停留后直接进入主界面。
const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 作用：结束动画并通知父组件切换主界面。
// 原因：用 done 标记防重入，避免动画 onComplete 与手动跳过重复触发。
function finish() {
  if (done.value) return
  done.value = true
  emit('finish')
}

onMounted(() => {
  // 原因：减少动效用户直接跳过动画，避免不必要的等待。
  if (prefersReducedMotion) {
    window.setTimeout(finish, 600)
    return
  }

  // 作用：用 GSAP 时间线串联「双齿轮对转 → 标题浮现 → 进度填充」关键帧，
  //       营造机械动力「齿轮上紧→启动」的工业感，总时长约 2.6 秒，结束自动进入主界面。
  tl = gsap.timeline({ onComplete: finish })

  // 作用：两个齿轮相反方向旋转，模拟啮合传动；齿轮 B 反向、转得略快增强传动感。
  tl.fromTo(
    '.preview-intro__gear--a',
    { rotation: 0, transformOrigin: '50% 50%' },
    { rotation: 360, duration: 2.6, ease: 'power1.inOut' },
    0,
  )
    .fromTo(
      '.preview-intro__gear--b',
      { rotation: 0, transformOrigin: '50% 50%' },
      { rotation: -360, duration: 1.9, ease: 'power1.inOut' },
      0,
    )
    .fromTo(
      '.preview-intro__title',
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      0.4,
    )
    // 作用：进度条从 0 填充到 100%，并同步更新百分比数字。
    .fromTo(
      '.preview-intro__bar',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'power2.inOut',
        // 原因：进度条与百分比需严格同步，故在 onUpdate 里读取动画进度换算为 0-100。
        onUpdate() {
          percent.value = Math.round(this.progress() * 100)
        },
      },
      0.7,
    )
})

onBeforeUnmount(() => {
  // 原因：组件销毁前终止动画，避免在已离开页面时继续执行造成内存泄漏。
  tl?.kill()
})
</script>

<template>
  <!-- 作用：开场覆盖层；点击任意处即可跳过动画（finish 内部有防重入）。 -->
  <div
    class="preview-intro"
    @click="finish"
  >
    <!-- 作用：双齿轮容器，承载两个啮合齿轮的旋转动画。 -->
    <div
      class="preview-intro__gears"
      aria-hidden="true"
    >
      <!-- 作用：主动轮（较大，正向旋转）。 -->
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
      <!-- 作用：从动轮（较小，反向旋转）。 -->
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

    <!-- 作用：开场主标题（附扫描/辉光效果由 CSS 提供）。 -->
    <h1 class="preview-intro__title">
      MCTP · 机械动力
    </h1>

    <!-- 作用：加载进度条，动画期间从 0 填充到 100%。 -->
    <div
      class="preview-intro__track"
      aria-hidden="true"
    >
      <div class="preview-intro__bar" />
    </div>

    <!-- 作用：进度百分比数字，随进度条同步增长。 -->
    <span class="preview-intro__percent">{{ percent }}%</span>

    <!-- 作用：跳过提示——点击任意处即可进入主界面。
         原因：骨架验收时也需要能快速查看主界面，故不强制等待动画结束。 -->
    <span class="preview-intro__hint">点击任意处跳过</span>

    <!-- 作用：右下角版本号浮标，贴合工业风/推进版本感知；文案待服主确认。 -->
    <!-- TODO-CONTENT: 版本号与「Preview」标记待服主确认后调整。 -->
    <span class="preview-intro__version">v0.5.4 · PREVIEW</span>
  </div>
</template>

<style scoped>
/* 作用：开场动画全屏覆盖层；整层可点击跳过。 */
.preview-intro {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: var(--preview-bg);
  color: var(--preview-accent);
  cursor: pointer;
}

/* 作用：双齿轮容器——横向排列，两个齿轮轻微重叠形成啮合视觉。 */
.preview-intro__gears {
  position: relative;
  display: flex;
  align-items: center;
  width: 220px;
  height: 150px;
  justify-content: center;
}

/* 作用：齿轮 A（主动轮）——较大，居中偏左。 */
.preview-intro__gear--a {
  width: 150px;
  height: 150px;
}

/* 作用：齿轮 B（从动轮）——较小，向右偏移并与 A 边缘重叠。 */
.preview-intro__gear--b {
  width: 110px;
  height: 110px;
  margin-left: -26px;
  margin-top: 40px;
}

/* 作用：开场标题字体与强调色，附扫描线 + 辉光动画。 */
.preview-intro__title {
  position: relative;
  margin: 0;
  font-size: clamp(28px, 5vw, 48px);
  letter-spacing: 0.08em;
  color: var(--preview-accent);
  text-shadow: 0 0 18px color-mix(in srgb, var(--preview-accent) 55%, transparent);
}

/* 作用：标题扫描线——一条高亮带沿标题自上而下扫过，营造工业扫描屏感。 */
.preview-intro__title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 34%;
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--preview-text) 22%, transparent), transparent);
  animation: preview-intro-scan 2.2s linear infinite;
  pointer-events: none;
}

/* 作用：进度条轨道。 */
.preview-intro__track {
  width: min(320px, 70vw);
  height: 6px;
  border-radius: 3px;
  background: var(--preview-bg-panel);
  overflow: hidden;
  border: 1px solid var(--preview-line-strong);
}

/* 作用：进度条填充，由 GSAP 控制 scaleX。 */
.preview-intro__bar {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: var(--preview-accent);
  transform-origin: left center;
  box-shadow: 0 0 12px var(--preview-accent);
}

/* 作用：进度百分比数字——像素感、铜黄。 */
.preview-intro__percent {
  font-size: 16px;
  letter-spacing: 0.1em;
  color: var(--preview-text-soft);
  font-variant-numeric: tabular-nums;
}

/* 作用：跳过提示——弱化小字，传达「点击任意处」操作。 */
.preview-intro__hint {
  margin-top: 8px;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: var(--preview-text-soft);
  animation: preview-intro-fade 1.6s ease-in-out infinite;
}

/* 作用：右下角版本号浮标——工业风定位角标。 */
.preview-intro__version {
  position: absolute;
  right: 20px;
  bottom: 18px;
  padding: 3px 10px;
  border: 1px solid var(--preview-line-strong);
  border-radius: 6px;
  font-size: 12px;
  letter-spacing: 0.12em;
  color: var(--preview-text-soft);
  background: color-mix(in srgb, var(--preview-bg-panel) 70%, transparent);
}

@keyframes preview-intro-fade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes preview-intro-scan {
  0% {
    transform: translateY(-120%);
  }
  100% {
    transform: translateY(320%);
  }
}
</style>
