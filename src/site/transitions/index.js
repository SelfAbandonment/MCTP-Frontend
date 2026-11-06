/**
 * 文件用途：按页面挑选专属转场，并接到路由守卫上（src/router/index.js）
 *
 * 规则（pickTransition）——进入或离开下面这些页面时，用它们的专属转场（进入优先，其次看离开的页面）：
 *   登录 /login、注册 /register      → binary    0 和 1 组成的字从点击处向外铺满屏幕，再从中心退散
 *   积分 /points                     → shutter   黄铜卷帘门拉下又卷起
 *   功能页 /home/f/modpack           → crate     巨大的上锁箱子从左边拖到中间挡住屏幕，加载完再拖走
 *   功能页 /home/f/blueprints        → blueprint 一张蓝图从点击处展开铺满屏幕，再淡出
 *   功能页 /home/f/mods              → blackhole 页面被吸进点击处的黑洞，屏幕震颤，冲击波揭开
 *   功能页 /home/f/gallery           → melt      画面融化流下去
 *   功能页 /home/f/banlist           → portal    搭起地狱门，走进传送门
 *   功能页 /home/f/history           → iris      老照片光圈收拢 + 倒转的时钟
 * 其他所有跳转：返回 null，路由守卫照旧调用 coverScreen()，也就是 PageTransition.vue 里的短转场（kind: 'page'）；
 *   首次进入时的品牌转场（kind: 'brand'）也不受影响。
 * 系统开启"减少动态效果"时：一律返回 null（用短转场）。
 *
 * 流程：路由守卫里先 coverWith()（盖住屏幕）→ 放行路由切换 → afterEach 里 revealPending() 等新页面渲染出来再揭开。
 * 点击位置：全局记录最近一次按下鼠标 / 手指的位置，1.5 秒内的点击作为扩散的起点，否则用屏幕中心
 *          （例如浏览器前进后退、代码里 router.push）。
 * 转场期间 whenTransitionDone() 也会等专属转场揭开（见 usePageTransition.js 的 setEffectRunning）。
 * 每个转场文件导出一个工厂函数，返回 { cover(), reveal() } 两个异步方法；画面都画在临时的覆盖层（.route-fx）上，
 *   结束后移除，不改页面本身的 DOM（黑洞、融化会临时给 <main> 加 transform / filter，页面卸载时随之消失）。
 */
import { nextTick } from 'vue'
import { setEffectRunning } from '../composables/usePageTransition'
import { binaryEffect } from './binary'
import { crateEffect } from './crate'
import { blueprintEffect } from './blueprint'
import { blackholeEffect } from './blackhole'
import { meltEffect } from './melt'
import { portalEffect } from './portal'
import { shutterEffect } from './shutter'
import { irisEffect } from './iris'
import { ease, layer, loop, wait } from './util'

// —— 页面 → 专属转场 ——
const BY_PATH = {
  '/login': 'binary',
  '/register': 'binary',
  '/points': 'shutter',
}
// 功能页 /home/f/:key 按 key 挑
const BY_FEATURE = {
  modpack: 'crate',
  blueprints: 'blueprint',
  mods: 'blackhole',
  gallery: 'melt',
  banlist: 'portal',
  history: 'iris',
}

function specialOf(route) {
  if (!route?.path) return null
  if (BY_PATH[route.path]) return BY_PATH[route.path]
  const m = route.path.match(/^\/home\/f\/([^/]+)/)
  return m ? BY_FEATURE[m[1]] || null : null
}

const EFFECTS = {
  binary: binaryEffect,
  crate: crateEffect,
  blueprint: blueprintEffect,
  blackhole: blackholeEffect,
  melt: meltEffect,
  portal: portalEffect,
  shutter: shutterEffect,
  iris: irisEffect,
  fade: fadeEffect,
}

/** 最普通的转场：0.22 秒黑场盖上，0.28 秒揭开 */
function fadeEffect() {
  let el = null
  return {
    async cover() {
      el = layer()
      el.style.background = '#0b0b0d'
      await loop(220, (p) => (el.style.opacity = String(ease.inQuad(p))))
    },
    async reveal() {
      await loop(280, (p) => (el.style.opacity = String(1 - ease.outQuad(p))))
      el.remove()
    },
  }
}

/**
 * 作用：决定这次跳转用哪个专属转场
 * 返回：转场名（见 EFFECTS），或 null（用 PageTransition.vue 的短转场）
 */
export function pickTransition(to, from) {
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) return null
  return specialOf(to) || specialOf(from)
}

// —— 记录最近一次点击的位置 ——
let lastPointer = null
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', (e) => (lastPointer = { x: e.clientX, y: e.clientY, t: performance.now() }), true)
}
function clickOrigin() {
  if (lastPointer && performance.now() - lastPointer.t < 1500) return { x: lastPointer.x, y: lastPointer.y }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

// —— 正在进行的转场 ——
let pending = null // { fx, done: Promise 的 resolve }

/** 作用：播放转场的"盖上"部分；返回的 Promise 在屏幕完全盖住时 resolve（路由守卫等它） */
export async function coverWith(kind, ctx = {}) {
  // 上一个转场还没揭开（连点两次之类）：先把它的覆盖层收掉，避免叠两层
  if (pending) {
    document.querySelectorAll('.route-fx').forEach((n) => n.remove())
    pending.resolve()
    pending = null
  }
  const fx = (EFFECTS[kind] || fadeEffect)({ origin: clickOrigin(), ...ctx })
  let resolve
  const done = new Promise((r) => (resolve = r))
  pending = { fx, resolve }
  setEffectRunning(done) // 页面里"等转场揭开再播入场动画"的逻辑（whenTransitionDone）也会等它
  try {
    await fx.cover()
  } catch (e) {
    console.error('[transition] cover failed', e)
  }
}

/** 作用：路由切换完成后调用——等新页面渲染出来，再播放"揭开"部分 */
export async function revealPending() {
  const p = pending
  if (!p) return
  await nextTick()
  await wait(60) // 等新页面画出来（不用 requestAnimationFrame：后台标签页里它会暂停）
  try {
    await p.fx.reveal()
  } catch (e) {
    console.error('[transition] reveal failed', e)
  }
  document.querySelectorAll('.route-fx').forEach((n) => n.remove())
  if (pending === p) pending = null
  p.resolve()
}
