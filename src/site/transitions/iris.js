/**
 * 文件用途：历史记录点转场——"老电影光圈 + 倒转的时钟"
 * 盖上：画面先褪成旧照片的棕褐色，四周的黑色像老电影的光圈一样向中间收拢；
 *       光圈收到最小时，中间只剩一个小小的时钟，指针飞快地往回转（"回到过去"）；
 * 切换：全黑时进入历史记录点；
 * 揭开：光圈从中间重新张开，露出历史记录点页面，时钟淡出。
 */
import { canvasLayer, ease, loop, seg } from './util'

export function irisEffect() {
  let fx = null
  let hands = 0

  function draw(radius, sepia, clockAlpha) {
    const { ctx, w, h } = fx
    const cx = w / 2
    const cy = h / 2
    ctx.clearRect(0, 0, w, h)
    // 旧照片色调：一层半透明的棕褐色
    if (sepia > 0) {
      ctx.fillStyle = `rgba(112, 80, 40, ${0.45 * sepia})`
      ctx.fillRect(0, 0, w, h)
    }
    // 光圈：整屏涂黑，中间留一个圆（用奇偶填充规则挖洞，洞里的旧照片色调保留），边上一圈柔和的暗边
    const r0 = Math.max(0, radius)
    ctx.fillStyle = '#0b0805'
    ctx.beginPath()
    ctx.rect(0, 0, w, h)
    ctx.arc(cx, cy, r0, 0, Math.PI * 2)
    ctx.fill('evenodd')
    if (r0 > 2) {
      const g = ctx.createRadialGradient(cx, cy, r0 * 0.7, cx, cy, r0)
      g.addColorStop(0, 'rgba(11,8,5,0)')
      g.addColorStop(1, 'rgba(11,8,5,0.85)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(cx, cy, r0, 0, Math.PI * 2)
      ctx.fill()
    }
    // 时钟：表盘 + 12 个刻度 + 两根往回转的指针
    if (clockAlpha > 0) {
      const r = 46
      ctx.save()
      ctx.globalAlpha = clockAlpha
      ctx.translate(cx, cy)
      ctx.fillStyle = '#f2e5c3'
      ctx.strokeStyle = '#e8b24a'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.fillStyle = '#3b2a17'
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        ctx.fillRect(Math.cos(a) * (r - 10) - 2, Math.sin(a) * (r - 10) - 2, 4, 4)
      }
      ctx.strokeStyle = '#3b2a17'
      ctx.lineCap = 'square'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(-hands * 12 - Math.PI / 2) * (r - 12), Math.sin(-hands * 12 - Math.PI / 2) * (r - 12))
      ctx.stroke()
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(Math.cos(-hands - Math.PI / 2) * (r - 22), Math.sin(-hands - Math.PI / 2) * (r - 22))
      ctx.stroke()
      ctx.restore()
    }
  }

  return {
    async cover() {
      fx = canvasLayer()
      const max = Math.hypot(fx.w, fx.h) / 2 + 40
      await loop(1100, (p, t) => {
        hands = t / 200
        draw(max * (1 - ease.inOutCubic(seg(p, 0.15, 0.85))), seg(p, 0, 0.3), seg(p, 0.6, 0.85))
      })
    },
    async reveal() {
      const max = Math.hypot(fx.w, fx.h) / 2 + 40
      await loop(1000, (p, t) => {
        hands = 5.5 + t / 200
        draw(max * ease.inOutCubic(p), 1 - p, 1 - seg(p, 0, 0.4))
      })
      fx.el.remove()
    },
  }
}
