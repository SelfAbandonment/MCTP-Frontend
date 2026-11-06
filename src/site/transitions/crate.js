/**
 * 文件用途：整合包页转场——"巨大的未解锁整合包"
 * 盖上：一个比屏幕还大的、上了锁的整合包箱子从屏幕左边被一根锁链拽进来，拖到正中间停住（冲过头一点再回弹、震一下），
 *       箱子挡住整个视线；
 * 切换：箱子挡着的时候加载整合包页面；
 * 揭开：页面准备好后，箱子继续被拖向右边、移出屏幕，露出整合包页面。
 * 箱子外观和传送带上"未解锁"的箱子一致（木框 + 交叉锁链 + 黄铜挂锁 + 问号），只是放大了很多倍，用 CSS 画。
 */
import { ease, layer, loop } from './util'

function buildCrate(size) {
  const crate = document.createElement('div')
  const s = size
  const u = s / 168 // 以传送带上 168 像素的箱子为基准等比放大
  Object.assign(crate.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${s}px`,
    height: `${s}px`,
    marginLeft: `${-s / 2}px`,
    marginTop: `${-s / 2}px`,
    background: [
      `linear-gradient(90deg, rgba(0,0,0,0.14) 50%, transparent 50%) 0 0 / ${12 * u}px 100%`,
      'linear-gradient(180deg, #7c5a36, #5a3d20)',
    ].join(','),
    boxShadow: [
      `0 0 0 ${3 * u}px #140d07`,
      `inset 0 0 0 ${8 * u}px #6a4421`,
      `inset 0 0 0 ${11 * u}px #140d07`,
      `inset ${14 * u}px ${14 * u}px 0 rgba(255,255,255,0.06)`,
    ].join(','),
    willChange: 'transform',
  })
  // 交叉锁链（横 + 竖）
  const chain = (vertical) => {
    const c = document.createElement('i')
    const bar = `${10 * u}px`
    Object.assign(c.style, {
      position: 'absolute',
      background: `repeating-linear-gradient(${vertical ? 180 : 90}deg, #9da1ab 0 ${6 * u}px, #4b4e57 ${6 * u}px ${9 * u}px, #c8ccd4 ${9 * u}px ${12 * u}px, #4b4e57 ${12 * u}px ${15 * u}px)`,
      boxShadow: `0 0 0 ${2 * u}px #140d07`,
      ...(vertical
        ? { top: '0', bottom: '0', left: `calc(50% - ${5 * u}px)`, width: bar }
        : { left: '0', right: '0', top: `calc(50% - ${5 * u}px)`, height: bar }),
    })
    return c
  }
  // 大问号
  const q = document.createElement('b')
  q.textContent = '?'
  Object.assign(q.style, {
    position: 'absolute',
    left: '0',
    right: '0',
    top: '18%',
    textAlign: 'center',
    fontFamily: "'Site Pixel', Consolas, monospace",
    fontSize: `${92 * u}px`,
    lineHeight: '1',
    color: 'rgba(255, 220, 140, 0.18)',
  })
  // 黄铜挂锁
  const lock = document.createElement('i')
  Object.assign(lock.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${46 * u}px`,
    height: `${32 * u}px`,
    transform: `translate(-50%, ${-4 * u}px)`,
    background: 'linear-gradient(180deg, #ffe08a, #e8b24a 50%, #8d5418)',
    boxShadow: `0 0 0 ${3 * u}px #140d07, inset ${2 * u}px ${2 * u}px 0 #fff0a8`,
  })
  const shackle = document.createElement('i')
  Object.assign(shackle.style, {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${28 * u}px`,
    height: `${26 * u}px`,
    transform: `translate(-50%, ${-26 * u}px)`,
    border: `${6 * u}px solid #c6c9d1`,
    borderBottom: '0',
    boxShadow: `0 0 0 ${2 * u}px #140d07`,
  })
  crate.append(q, chain(false), chain(true), shackle, lock)
  return crate
}

export function crateEffect() {
  let el = null
  let crate = null
  let rope = null
  let size = 0
  const place = (x, rot) => {
    crate.style.transform = `translateX(${x}px) rotate(${rot}deg)`
    // 拖箱子的锁链：从箱子右边缘一直拉到屏幕外右侧
    rope.style.left = `calc(50% + ${x + size / 2 - 4}px)`
  }
  return {
    async cover() {
      el = layer()
      const w = window.innerWidth
      const h = window.innerHeight
      size = Math.ceil(Math.max(w, h) * 1.12) // 比屏幕最长边还大一点，正中停住时能挡住整个画面
      crate = buildCrate(size)
      rope = document.createElement('i')
      Object.assign(rope.style, {
        position: 'absolute',
        top: 'calc(50% - 7px)',
        right: '-20px',
        height: '14px',
        background: 'repeating-linear-gradient(90deg, #9da1ab 0 10px, #4b4e57 10px 14px, #c8ccd4 14px 20px, #4b4e57 20px 24px)',
        boxShadow: '0 0 0 2px #140d07',
      })
      el.append(rope, crate)
      const start = -(w / 2 + size / 2 + 60)
      // 被拽进来：冲过头一点再回弹，同时稍微倾斜（惯性）
      await loop(950, (p) => {
        const k = ease.outBack(p, 1.15)
        place(start * (1 - k), (1 - p) * -6 + Math.sin(p * Math.PI) * 3)
      })
      // 落定的一下震动
      await loop(160, (p) => place(Math.sin(p * Math.PI * 4) * 8 * (1 - p), 0))
    },
    async reveal() {
      const w = window.innerWidth
      const end = w / 2 + size / 2 + 60
      await loop(800, (p) => place(end * ease.inCubic(p), ease.inQuad(p) * 4))
      el.remove()
    },
  }
}
