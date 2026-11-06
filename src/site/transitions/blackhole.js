/**
 * 文件用途：自研模组转场——"黑洞"
 * 盖上：以鼠标点击的位置为中心出现一个黑洞，整个页面边旋转边缩小、被吸进这个点里；
 *       黑洞外面有一圈发光的吸积盘、碎屑粒子螺旋着往里掉；整个画面越来越剧烈地震颤；
 *       最后黑洞把整个屏幕吞掉（变成一片带星点的黑）。
 * 切换：全黑时进入自研模组页面；
 * 揭开：一道冲击波从屏幕中心扩散出去，黑色随之退去，露出新页面，震颤逐渐平息。
 * 实现：页面本身（<main>）用 CSS transform 以点击点为原点缩放 + 旋转；
 *       黑洞、吸积盘、粒子画在覆盖层 canvas 上；震颤是给整个站点外壳加随机位移。
 */
import { canvasLayer, currentMain, ease, farCorner, loop, seg } from './util'

function shakeShell(amount) {
  const shell = document.querySelector('.site-shell')
  if (!shell) return
  if (amount <= 0.2) {
    shell.style.transform = ''
    return
  }
  const dx = (Math.random() - 0.5) * 2 * amount
  const dy = (Math.random() - 0.5) * 2 * amount
  shell.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`
}

export function blackholeEffect({ origin }) {
  let fx = null
  let stars = []
  const parts = []

  function drawHole(r, glow, t) {
    const { ctx, w, h } = fx
    ctx.clearRect(0, 0, w, h)
    const { x, y } = origin
    // 吸积盘：外圈橙紫色的光晕（半径 r 的 1.2~2.2 倍）
    if (glow > 0) {
      const g = ctx.createRadialGradient(x, y, r * 0.9, x, y, r * 2.4 + 40)
      g.addColorStop(0, `rgba(255, 190, 90, ${0.85 * glow})`)
      g.addColorStop(0.25, `rgba(220, 90, 255, ${0.45 * glow})`)
      g.addColorStop(1, 'rgba(40, 0, 80, 0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r * 2.4 + 40, 0, Math.PI * 2)
      ctx.fill()
    }
    // 粒子：从外面螺旋着往里掉
    for (const pt of parts) {
      pt.a += pt.spin * (1 + 120 / Math.max(20, pt.d))
      pt.d *= pt.fall
      if (pt.d < r * 0.8) {
        pt.d = 200 + Math.random() * Math.max(w, h) * 0.6
        pt.a = Math.random() * Math.PI * 2
      }
      ctx.fillStyle = pt.c
      ctx.fillRect(x + Math.cos(pt.a) * pt.d, y + Math.sin(pt.a) * pt.d, pt.s, pt.s)
    }
    // 黑洞本体 + 一圈亮边（光子环）
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = `rgba(255, 230, 180, ${0.9 * glow})`
    ctx.lineWidth = 2 + Math.sin(t / 60) * 1
    ctx.stroke()
    // 黑洞里面隐约有星点（盖满以后就是一片星空的黑）
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.clip()
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${s.a})`
      ctx.fillRect(s.x, s.y, s.s, s.s)
    }
    ctx.restore()
  }

  return {
    async cover() {
      fx = canvasLayer()
      const { w, h } = fx
      stars = Array.from({ length: 160 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: Math.random() < 0.15 ? 2 : 1, a: 0.3 + Math.random() * 0.6 }))
      for (let i = 0; i < 140; i++) {
        parts.push({
          a: Math.random() * Math.PI * 2,
          d: 120 + Math.random() * Math.max(w, h) * 0.6,
          spin: 0.02 + Math.random() * 0.03,
          fall: 0.965 + Math.random() * 0.02,
          s: Math.random() < 0.3 ? 3 : 2,
          c: ['#ffd27a', '#ff9de2', '#bfa8ff', '#ffffff'][i % 4],
        })
      }
      const main = currentMain()
      if (main) {
        const rect = main.getBoundingClientRect()
        main.style.transformOrigin = `${origin.x - rect.left}px ${origin.y - rect.top}px`
        main.style.willChange = 'transform, filter, opacity'
      }
      const max = farCorner(origin.x, origin.y, w, h) + 20
      await loop(1500, (p, t) => {
        // 页面被吸进去：前 75% 完成缩小与旋转
        const k = ease.inCubic(seg(p, 0, 0.75))
        if (main) {
          main.style.transform = `scale(${(1 - k * 0.985).toFixed(4)}) rotate(${(k * 40).toFixed(2)}deg)`
          main.style.filter = `blur(${(k * 4).toFixed(1)}px) brightness(${(1 - k * 0.5).toFixed(2)})`
          main.style.opacity = String(1 - seg(p, 0.6, 0.78))
        }
        // 黑洞：先慢慢长到 40 像素，最后 30% 急速吞掉整个屏幕
        const r = 6 + 34 * ease.outCubic(seg(p, 0, 0.5)) + max * ease.inCubic(seg(p, 0.7, 1))
        drawHole(r, 1 - seg(p, 0.85, 1), t)
        shakeShell(2 + 14 * ease.inQuad(p))
      })
      drawHole(max, 0, 0)
      shakeShell(0)
    },
    async reveal() {
      const { ctx, w, h } = fx
      const cx = w / 2
      const cy = h / 2
      const max = Math.hypot(w, h) / 2 + 60
      // 冲击波从屏幕中心扩散，波后的黑色退去，露出星图；震颤逐渐平息
      await loop(1000, (p) => {
        const r = max * ease.outCubic(p)
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = `rgba(200, 170, 255, ${0.8 * (1 - p)})`
        ctx.lineWidth = 10 * (1 - p) + 2
        ctx.stroke()
        shakeShell(10 * (1 - p))
      })
      shakeShell(0)
      fx.el.remove()
    },
  }
}
