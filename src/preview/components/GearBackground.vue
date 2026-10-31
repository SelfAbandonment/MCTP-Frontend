<script setup>
/**
 * 文件用途：预览页机械工业动态背景组件
 * 作用：在预览页内容底层铺一层「慢速旋转齿轮 + 蓝色图纸网格 + 上浮火星粒子」的固定背景，
 *       强化机械动力（Create）的工业纵深氛围；纯 CSS 动画实现，不占用 JS 主线程。
 */

// 作用：齿轮布点配置表（每项一个齿轮：尺寸/位置/转速/转向/透明度）。
// 原因：把齿轮参数集中成数据，便于服主后续调整背景密度与节奏，无需改模板与样式。
// TODO-ASSET: 齿轮为内联 SVG 占位，如需真实齿轮素材可替换为图片/更精细的 SVG。
const gears = [
  { size: 460, top: '6%', left: '-7%', dur: 140, reverse: false, opacity: 0.09 },
  { size: 320, top: '56%', left: '74%', dur: 100, reverse: true, opacity: 0.08 },
  { size: 240, top: '10%', left: '68%', dur: 70, reverse: false, opacity: 0.07 },
  { size: 190, top: '76%', left: '10%', dur: 55, reverse: true, opacity: 0.07 },
  { size: 150, top: '30%', left: '40%', dur: 90, reverse: true, opacity: 0.05 },
]

// 作用：生成漂浮火星粒子数据（24 颗，位置/延迟/时长/尺寸各异）。
// 原因：用确定性公式生成而非随机数，保证每次渲染视觉一致、避免水合差异。
const particles = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 41 + 13) % 100}%`,
  delay: `${(i % 12) * 1.7}s`,
  dur: `${9 + (i % 5) * 4}s`,
  size: `${2 + (i % 3)}px`,
}))

// 作用：齿轮齿数量（每个齿轮固定 10 齿，用于 v-for 生成轮齿矩形）。
// 原因：10 齿对应每齿 36°，便于用 rotate 均布轮齿。
const TEETH = 10
</script>

<template>
  <!-- 作用：固定全屏背景层；pointer-events:none 保证不拦截鼠标，z-index 0 位于内容之下。 -->
  <div
    class="preview-bg"
    aria-hidden="true"
  >
    <!-- 作用：图纸网格——用两条线性渐变交叉成细线网格，模拟工程蓝图。 -->
    <div class="preview-bg__grid" />

    <!-- 作用：齿轮层——遍历配置渲染多个齿轮。 -->
    <div
      v-for="g in gears"
      :key="g.left + g.top"
      class="preview-bg__gear"
      :style="{
        width: g.size + 'px',
        height: g.size + 'px',
        top: g.top,
        left: g.left,
        opacity: g.opacity,
      }"
    >
      <!-- 作用：单个齿轮 SVG，动画由外层 .preview-bg__gear--spin 驱动旋转。 -->
      <svg
        viewBox="0 0 200 200"
        :class="{ 'is-reverse': g.reverse }"
        :style="{ animationDuration: g.dur + 's' }"
      >
        <!-- 作用：轮齿——10 个矩形绕圆心均布，构成齿轮外齿。 -->
        <g
          v-for="n in TEETH"
          :key="n"
          :transform="`rotate(${(n - 1) * (360 / TEETH)} 100 100)`"
        >
          <rect
            x="91"
            y="4"
            width="18"
            height="30"
            rx="3"
            fill="currentColor"
          />
        </g>
        <!-- 作用：齿轮主体外圈。 -->
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          stroke="currentColor"
          stroke-width="16"
        />
        <!-- 作用：齿轮内圈镂空（虚线描边，形成辐条感）。 -->
        <circle
          cx="100"
          cy="100"
          r="44"
          fill="none"
          stroke="currentColor"
          stroke-width="20"
          stroke-dasharray="24 16"
        />
        <!-- 作用：齿轮轴心孔。 -->
        <circle
          cx="100"
          cy="100"
          r="14"
          fill="currentColor"
        />
      </svg>
    </div>

    <!-- 作用：火星粒子层——遍历渲染上浮粒子。 -->
    <div class="preview-bg__particles">
      <span
        v-for="p in particles"
        :key="p.id"
        class="preview-bg__particle"
        :style="{
          left: p.left,
          width: p.size,
          height: p.size,
          animationDelay: p.delay,
          animationDuration: p.dur,
        }"
      />
    </div>

    <!-- 作用：底部渐隐遮罩，让背景在内容区边缘自然收淡，避免喧宾夺主。 -->
    <div class="preview-bg__fade" />
  </div>
</template>

<style scoped>
/* 作用：背景层固定铺满视口，置于内容之下、不接收鼠标事件。 */
.preview-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  color: var(--preview-accent);
}

/* 作用：蓝图网格——交叉细线，颜色取强调色并压到很低透明度。 */
.preview-bg__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--preview-line-strong) 1px, transparent 1px),
    linear-gradient(90deg, var(--preview-line-strong) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
}

/* 作用：齿轮定位容器（绝对定位，尺寸/位置由内联 style 决定）。 */
.preview-bg__gear {
  position: absolute;
}

/* 作用：齿轮 SVG 旋转动画——正转或反转由 .is-reverse 控制。
   原因：齿轮互相啮合感靠「相邻齿轮反向 + 不同转速」营造。 */
.preview-bg__gear svg {
  width: 100%;
  height: 100%;
  animation-name: preview-bg-spin;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.preview-bg__gear svg.is-reverse {
  animation-direction: reverse;
}

/* 作用：粒子容器。 */
.preview-bg__particles {
  position: absolute;
  inset: 0;
}

/* 作用：单颗火星粒子——从底部上浮、边升边淡出。 */
.preview-bg__particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: var(--preview-accent);
  opacity: 0;
  animation-name: preview-bg-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* 作用：底部渐隐遮罩，让背景随内容向下自然收淡。 */
.preview-bg__fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 40%;
  background: linear-gradient(to bottom, transparent, var(--preview-bg));
}

@keyframes preview-bg-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes preview-bg-rise {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-110vh);
    opacity: 0;
  }
}
</style>
