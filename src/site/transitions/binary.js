/**
 * 文件用途：登录页转场——"0 和 1 吞噬屏幕"
 * 盖上：从鼠标点击的位置开始，一圈由 0 和 1 组成的字符往外扩张，把原来的页面一格一格"吃掉"；
 *       扩张的前沿参差不齐（每一格有随机的提前量），前沿上的字更亮，像正在被改写的数据。
 * 揭开：登录 / 注册页就在屏幕正中——从屏幕中心开出一个洞，0 和 1 向四周退散、闪烁着消失，露出登录页。
 * 画法：整屏按 16 像素一格切成网格，每格一个随机的 0 或 1，每帧有一部分格子会随机翻转。
 */
import { canvasLayer, ease, farCorner, loop } from './util'

const CELL = 16

function makeGrid(w, h) {
  const cols = Math.ceil(w / CELL) + 1
  const rows = Math.ceil(h / CELL) + 1
  const cells = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: c * CELL, y: r * CELL, bit: Math.random() < 0.5 ? '0' : '1', jitter: Math.random() })
    }
  }
  return cells
}

export function binaryEffect({ origin }) {
  let fx = null
  let cells = null

  function draw(threshold, centerHole) {
    const { ctx, w, h } = fx
    ctx.clearRect(0, 0, w, h)
    ctx.font = `bold ${CELL - 2}px Consolas, "Courier New", monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const cell of cells) {
      const cx = cell.x + CELL / 2
      const cy = cell.y + CELL / 2
      // 每帧约 6% 的格子翻转一次
      if (Math.random() < 0.06) cell.bit = cell.bit === '0' ? '1' : '0'
      let a
      if (centerHole == null) {
        // 盖上：离点击点的距离 < 当前半径（加上每格随机提前量）就被"吃掉"
        const d = Math.hypot(cx - origin.x, cy - origin.y) - cell.jitter * 60
        if (d > threshold) continue
        a = threshold - d // 离前沿多远
      } else {
        // 揭开：离屏幕中心的距离 > 洞的半径才保留
        const d = Math.hypot(cx - fx.w / 2, cy - fx.h / 2) + cell.jitter * 60
        if (d < centerHole) continue
        a = d - centerHole
      }
      // 黑底
      ctx.fillStyle = '#05080a'
      ctx.fillRect(cell.x, cell.y, CELL, CELL)
      // 前沿 40 像素内：亮白绿；里面：暗绿，偶尔闪一下
      const edge = a < 40
      ctx.fillStyle = edge ? '#e6fff0' : Math.random() < 0.03 ? '#b8ffcf' : cell.jitter > 0.5 ? '#2fd36a' : '#1d8f46'
      ctx.fillText(cell.bit, cx, cy + 1)
    }
  }

  return {
    async cover() {
      fx = canvasLayer()
      cells = makeGrid(fx.w, fx.h)
      const max = farCorner(origin.x, origin.y, fx.w, fx.h) + 80
      await loop(900, (p) => draw(ease.inQuad(p) * max, null))
      // 盖满后补画一整屏，保证没有漏网的格子
      draw(Infinity, null)
    },
    async reveal() {
      const max = Math.hypot(fx.w, fx.h) / 2 + 80
      await loop(950, (p) => draw(Infinity, ease.outCubic(p) * max))
      fx.el.remove()
    },
  }
}
