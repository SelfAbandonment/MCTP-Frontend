/**
 * 文件用途：各种页面转场共用的小工具
 *  - layer()       建一个铺满屏幕的覆盖层（挂在 body 上，z-index 1200，转场期间挡住点击）；
 *  - canvasLayer() 覆盖层里放一块和屏幕一样大的 canvas（按设备像素比放大，画面清晰）；
 *  - loop(ms, fn)  逐帧回调 fn(进度 0~1, 已过毫秒)，播完 resolve。
 *    不用 GSAP 的原因：浏览器标签页在后台时 requestAnimationFrame 会暂停，转场会卡在半路挡住页面；
 *    这里每帧同时挂一个 50 毫秒的 setTimeout 兜底，rAF 停了也能按时间往前走，保证转场一定能结束。
 *  - 缓动函数 ease.*：输入 0~1，输出 0~1。
 */

export const ease = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - (1 - t) ** 3,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
  // 冲过头一点再回来（像被拽到位后晃一下）
  outBack: (t, s = 1.4) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2,
}

export const clamp01 = (v) => Math.max(0, Math.min(1, v))
/** 把总进度 p 中 [a, b] 这一段映射成 0~1（之前为 0，之后为 1） */
export const seg = (p, a, b) => clamp01((p - a) / (b - a))

export function layer(z = 1200) {
  const el = document.createElement('div')
  el.className = 'route-fx'
  Object.assign(el.style, { position: 'fixed', inset: '0', zIndex: String(z), pointerEvents: 'all', overflow: 'hidden' })
  document.body.appendChild(el)
  return el
}

export function canvasLayer(z) {
  const el = layer(z)
  const w = window.innerWidth
  const h = window.innerHeight
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const c = document.createElement('canvas')
  c.width = Math.round(w * dpr)
  c.height = Math.round(h * dpr)
  Object.assign(c.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' })
  el.append(c)
  const ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  return { el, c, ctx, w, h }
}

export function loop(ms, frame) {
  return new Promise((resolve) => {
    const t0 = performance.now()
    let done = false
    let raf = 0
    let fb = 0
    const step = () => {
      if (done) return
      cancelAnimationFrame(raf)
      clearTimeout(fb)
      const e = performance.now() - t0
      if (e >= ms) {
        done = true
        frame(1, ms)
        resolve()
        return
      }
      frame(e / ms, e)
      raf = requestAnimationFrame(step)
      fb = setTimeout(step, 50)
    }
    step()
  })
}

export const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/** 当前页面的主体（router-view 渲染出来的 <main>，在 #site-content 里面），有的转场要直接对它做变形 */
export const currentMain = () => document.querySelector('#site-content main, .site-shell > main')

/** 起点到屏幕四个角里最远的距离（圆形扩散要走这么远才能盖满屏幕） */
export function farCorner(x, y, w = window.innerWidth, h = window.innerHeight) {
  return Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y))
}
