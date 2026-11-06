/**
 * 文件用途：封神榜转场——"地狱门"
 * 盖上：画面变暗，屏幕中央一块一块地搭起黑曜石门框（4 × 5，像玩家在放方块），
 *       门框点燃，里面出现紫色的、不停翻涌的传送门；然后镜头"走进"传送门——门越来越大，紫色铺满整个屏幕；
 * 切换：全紫时进入封神榜（下界背景）；
 * 揭开：紫色像传送时的反胃效果一样摇晃着淡出，露出下界。
 * 实现：门框和传送门画在同一块 canvas 上；传送门的紫色是逐帧变化的像素噪声。
 * 修复（测试反馈"右上角的黑曜石一直在抖，门框不像一个整体"）：
 *   以前"刚放下的那块"会随机缩放一下表示放置，但判断条件是"最后放的那一块"，
 *   门框搭完后最后一块（右上角）一直被当成"刚放下"，每帧随机缩放，就一直在抖。
 *   现在每块方块有自己的放置时间，放下时按缓动从 0.7 倍弹到 1 倍，弹完就固定不动；
 *   门框搭完以后不再给每块单独描边，而是整体描一圈外框和内框，并在门框四周加一圈紫色光，看起来是一整座门。
 */
import { canvasLayer, ease, loop, seg } from './util'

// 门框：外框 4 宽 × 5 高，内部 2 × 3 是传送门
const FRAME = []
for (let y = 0; y < 5; y++) for (let x = 0; x < 4; x++) if (x === 0 || x === 3 || y === 0 || y === 4) FRAME.push({ x, y })
// 搭建顺序：从底部开始往上放
FRAME.sort((a, b) => b.y - a.y || a.x - b.x)

export function portalEffect() {
  let fx = null

  function obsidian(ctx, x, y, s, edge = true) {
    ctx.fillStyle = '#140d1f'
    ctx.fillRect(x, y, s, s)
    ctx.fillStyle = '#2a1c40'
    const u = s / 8
    // 黑曜石表面的紫色斑点（固定图案）
    for (const [a, b] of [[1, 1], [5, 2], [2, 5], [6, 6], [3, 3]]) ctx.fillRect(x + a * u, y + b * u, u, u)
    if (!edge) return
    ctx.strokeStyle = '#05030a'
    ctx.lineWidth = 2
    ctx.strokeRect(x + 1, y + 1, s - 2, s - 2)
  }

  function portalFill(ctx, x, y, w, h, t, alpha) {
    const cell = Math.max(6, Math.round(w / 16))
    for (let py = 0; py < h; py += cell) {
      for (let px = 0; px < w; px += cell) {
        const v = Math.sin(px * 0.05 + t * 0.004) + Math.cos(py * 0.04 - t * 0.003) + Math.sin((px + py) * 0.03 + t * 0.006)
        const k = (v + 3) / 6
        ctx.fillStyle = `rgba(${Math.round(90 + 110 * k)}, ${Math.round(20 + 40 * k)}, ${Math.round(160 + 90 * k)}, ${alpha})`
        ctx.fillRect(x + px, y + py, cell + 1, cell + 1)
      }
    }
  }

  return {
    async cover() {
      fx = canvasLayer()
      const { ctx, w, h } = fx
      const block = Math.round(Math.min(w / 8, h / 8))
      const fw = block * 4
      const fh = block * 5
      const ox = (w - fw) / 2
      const oy = (h - fh) / 2
      await loop(2000, (p, t) => {
        ctx.clearRect(0, 0, w, h)
        // 背景变暗
        ctx.fillStyle = `rgba(10, 2, 6, ${0.75 * seg(p, 0, 0.15)})`
        ctx.fillRect(0, 0, w, h)
        // 镜头走进门：最后 35% 整体放大
        const zoom = 1 + ease.inCubic(seg(p, 0.65, 1)) * 9
        ctx.save()
        ctx.translate(w / 2, h / 2)
        ctx.scale(zoom, zoom)
        ctx.translate(-w / 2, -h / 2)
        // 门框一块一块放上去（0.05 ~ 0.45）：每块有自己的放置时间，放下时从 0.7 倍弹到 1 倍，之后固定不动
        const step = 0.4 / FRAME.length
        const built = p >= 0.45
        FRAME.forEach((b, i) => {
          const k = seg(p, 0.05 + i * step, 0.05 + (i + 1.6) * step)
          if (k <= 0) return
          const s = block * (0.7 + 0.3 * ease.outBack(k))
          // 搭完以后不再单独描边，下面整体描框
          obsidian(ctx, ox + b.x * block + (block - s) / 2, oy + b.y * block + (block - s) / 2, s, !built)
        })
        if (built) {
          // 整座门：外框 + 内框各描一圈，四周一圈紫色光
          ctx.save()
          ctx.shadowColor = `rgba(170, 80, 255, ${0.7 * seg(p, 0.45, 0.6)})`
          ctx.shadowBlur = block * 0.6
          ctx.strokeStyle = '#05030a'
          ctx.lineWidth = 3
          ctx.strokeRect(ox + 1.5, oy + 1.5, fw - 3, fh - 3)
          ctx.restore()
          ctx.strokeStyle = '#05030a'
          ctx.lineWidth = 3
          ctx.strokeRect(ox + block - 1.5, oy + block - 1.5, block * 2 + 3, block * 3 + 3)
        }
        // 点燃后出现传送门（0.45 ~ 0.6 淡入）
        const fire = seg(p, 0.45, 0.6)
        if (fire > 0) portalFill(ctx, ox + block, oy + block, block * 2, block * 3, t, fire)
        ctx.restore()
        // 最后整个屏幕被紫色吞没
        const flood = seg(p, 0.88, 1)
        if (flood > 0) portalFill(ctx, 0, 0, w, h, t, flood)
      })
      portalFill(ctx, 0, 0, w, h, 0, 1)
    },
    async reveal() {
      const { ctx, w, h, c } = fx
      await loop(1100, (p, t) => {
        ctx.clearRect(0, 0, w, h)
        portalFill(ctx, 0, 0, w, h, t, 1 - ease.inOutQuad(p))
        // 反胃式摇晃：画面左右扭动、逐渐平息
        c.style.transform = `skewX(${(Math.sin(t / 90) * 6 * (1 - p)).toFixed(2)}deg) scale(${1 + 0.04 * (1 - p)})`
      })
      fx.el.remove()
    },
  }
}
