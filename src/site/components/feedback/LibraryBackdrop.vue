<script setup>
/**
 * 文件用途：反馈页背景——《我的世界》风格的像素图书馆
 * 画面：
 *   - 整面墙是一格一格的书架方块：每格 16×16 个像素点，上、中、下三条木板隔层，
 *     中间两排是颜色、高矮各不相同的书脊（红 / 蓝 / 绿 / 棕 / 紫 / 青），书脊上有一列亮色高光；
 *     一共生成 4 种不同的书架格子轮流拼接，避免一眼看出重复；
 *   - 地面是橡木地板（木板条纹 + 错开的接缝）；
 *   - 两盏挂灯的暖色光晕 + 四周压暗（暗角），让中间的书本更突出；
 *   - 几颗淡紫色的"附魔符文"小方块从下往上慢慢飘（像附魔台旁边飘的字符）。
 * 说明：所有纹理都是本站按像素规则用代码生成的近似风格，不是游戏原版贴图。
 * 实现：纹理在浏览器里用 canvas 画一次，转成图片当 CSS 背景平铺（image-rendering: pixelated 保持像素锐利）；
 *       系统开启"减少动态效果"时符文不飘动。
 */

// 简单的可复现随机数（同一个种子每次画出来一样）
function rng(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

const PLANK = ['#a07c48', '#8e6c3c', '#7a5a30', '#b38c55']
const BOOKS = [
  ['#8e2b2b', '#b5413a'], // 红
  ['#2d4a8a', '#4569b5'], // 蓝
  ['#2f6b3a', '#4a8f52'], // 绿
  ['#6b4a2a', '#8e6a40'], // 棕
  ['#5a3a7a', '#7d58a3'], // 紫
  ['#2a6b6b', '#3f9090'], // 青
]

/** 作用：画 4 格不同的书架方块（横向拼成 64×16 的贴图） */
function bookshelfTiles() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 16
  const ctx = c.getContext('2d')
  const r = rng(20231105)
  const px = (x, y, col) => {
    ctx.fillStyle = col
    ctx.fillRect(x, y, 1, 1)
  }
  for (let t = 0; t < 4; t++) {
    const X = t * 16
    // 木框：上 2 行、中 2 行、下 2 行木板，左右各 1 列
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const plankRow = y <= 1 || y === 7 || y === 8 || y >= 14
        if (plankRow || x === 0 || x === 15) px(X + x, y, PLANK[Math.floor(r() * 3)])
      }
    }
    // 木板之间的暗缝
    for (let x = 0; x < 16; x++) {
      px(X + x, 1, '#6a4c28')
      px(X + x, 8, '#6a4c28')
      px(X + x, 15, '#5a3e20')
    }
    // 两排书：第 2~6 行、第 9~13 行
    for (const [top, bottom] of [[2, 6], [9, 13]]) {
      let x = 1
      while (x < 15) {
        const w = Math.min(15 - x, r() < 0.35 ? 1 : 2)
        const [dark, light] = BOOKS[Math.floor(r() * BOOKS.length)]
        const gap = r() < 0.18 ? 1 + Math.floor(r() * 2) : 0 // 有的书矮一点，上面露出书架里的暗处
        for (let y = top; y <= bottom; y++) {
          for (let k = 0; k < w; k++) px(X + x + k, y, y < top + gap ? '#24160c' : k === 0 && w > 1 ? light : dark)
        }
        // 书脊上的一道装订线
        if (bottom - top - gap > 2) for (let k = 0; k < w; k++) px(X + x + k, bottom - 1, '#d8c070')
        x += w
      }
    }
  }
  return c.toDataURL()
}

/** 作用：画一块橡木地板（16×16，四条木板，接缝错开） */
function floorTile() {
  const c = document.createElement('canvas')
  c.width = c.height = 16
  const ctx = c.getContext('2d')
  const r = rng(777)
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const row = Math.floor(y / 4)
      const seam = y % 4 === 3 || (x + row * 5) % 16 === 0
      ctx.fillStyle = seam ? '#5c4122' : PLANK[Math.floor(r() * PLANK.length)]
      ctx.fillRect(x, y, 1, 1)
    }
  }
  return c.toDataURL()
}

const shelfUrl = `url(${bookshelfTiles()})`
const floorUrl = `url(${floorTile()})`

// 飘浮的附魔符文：位置、大小、速度用固定的随机数
const r = rng(42)
const runes = Array.from({ length: 18 }, () => ({
  left: `${Math.round(r() * 100)}%`,
  size: `${4 + Math.round(r() * 2) * 2}px`,
  delay: `${(-r() * 14).toFixed(1)}s`,
  dur: `${(10 + r() * 8).toFixed(1)}s`,
}))
</script>

<template>
  <div
    class="library"
    aria-hidden="true"
  >
    <div
      class="shelves"
      :style="{ backgroundImage: shelfUrl }"
    />
    <div
      class="floor"
      :style="{ backgroundImage: floorUrl }"
    />
    <div class="light" />
    <i
      v-for="(g, i) in runes"
      :key="i"
      class="rune"
      :style="{ left: g.left, width: g.size, height: g.size, animationDelay: g.delay, animationDuration: g.dur }"
    />
  </div>
</template>

<style scoped>
.library {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: #1a120a;
  pointer-events: none;
}
/* 书架墙：64×16 的贴图放大 4 倍 → 每个书架方块 64 像素 */
.shelves {
  position: absolute;
  inset: 0 0 12% 0;
  background-size: 256px 64px;
  background-repeat: repeat;
  image-rendering: pixelated;
  background-position: 0 0;
}
.floor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 12%;
  min-height: 64px;
  background-size: 64px 64px;
  image-rendering: pixelated;
  box-shadow: inset 0 6px 0 rgba(0, 0, 0, 0.45);
}
/* 灯光：两盏挂灯的暖光 + 四周暗角 */
.light {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 200, 110, 0.28), transparent 28%),
    radial-gradient(circle at 82% 22%, rgba(255, 200, 110, 0.28), transparent 28%),
    radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, rgba(10, 5, 0, 0.78) 100%),
    linear-gradient(180deg, rgba(10, 5, 0, 0.35), rgba(10, 5, 0, 0.15) 50%, rgba(10, 5, 0, 0.45));
}
/* 附魔符文：淡紫色像素小方块往上飘 */
.rune {
  position: absolute;
  bottom: 10%;
  background: #c9b0ff;
  box-shadow: 0 0 6px rgba(190, 150, 255, 0.9);
  opacity: 0;
  animation: rise 12s linear infinite;
}
@keyframes rise {
  0% { transform: translate(0, 0); opacity: 0; }
  15% { opacity: 0.85; }
  70% { opacity: 0.6; }
  100% { transform: translate(24px, -70vh); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .rune { animation: none; opacity: 0.4; }
}
</style>
