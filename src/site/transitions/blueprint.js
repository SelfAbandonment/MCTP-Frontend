/**
 * 文件用途：蓝图站转场——"一张蓝图从点击处展开铺满画面"
 * 盖上：鼠标点击的位置先出现一张折成小方块的蓝图，先横向展开（左右两折打开），再纵向展开（上下两折打开），
 *       展开时折痕处有明暗，最后铺满整个画面；
 * 切换：蓝图盖住时进入蓝图站；
 * 揭开：蓝图覆盖层淡出，露出页面。
 *       以后做蓝图站页面时，可以把同一张蓝图（BLUEPRINT_BACKGROUND）当页面背景，淡出时就看不出接缝。
 * 蓝图纸面：深蓝底 + 细网格（24 像素）+ 粗网格（120 像素）+ 一圈白色边框，参考《机械动力》蓝图物品的配色。
 */
import { ease, layer, loop, seg } from './util'

/** 蓝图纸面（蓝图站背景也用这一份，保证和转场完全一致） */
export const BLUEPRINT_BACKGROUND = [
  'linear-gradient(rgba(190,220,255,0.22) 2px, transparent 2px) 0 0 / 120px 120px',
  'linear-gradient(90deg, rgba(190,220,255,0.22) 2px, transparent 2px) 0 0 / 120px 120px',
  'linear-gradient(rgba(190,220,255,0.1) 1px, transparent 1px) 0 0 / 24px 24px',
  'linear-gradient(90deg, rgba(190,220,255,0.1) 1px, transparent 1px) 0 0 / 24px 24px',
  'radial-gradient(ellipse at 50% 40%, #2b63b8, #17407f 70%, #10305f)',
].join(',')

export function blueprintEffect({ origin }) {
  let el = null
  let sheet = null
  let fold = null
  return {
    async cover() {
      el = layer()
      const w = window.innerWidth
      const h = window.innerHeight
      sheet = document.createElement('div')
      Object.assign(sheet.style, {
        position: 'absolute',
        background: BLUEPRINT_BACKGROUND,
        backgroundAttachment: 'fixed', // 网格对齐屏幕，展开过程中网格不跟着移动，和页面背景对得上
        boxShadow: '0 0 0 3px #e8f1ff, 0 0 0 6px #0b1d3a, 0 20px 50px rgba(0,0,0,0.5)',
      })
      // 折痕：展开时中间一道明暗（像纸张刚打开还没压平）
      fold = document.createElement('i')
      Object.assign(fold.style, { position: 'absolute', inset: '0', pointerEvents: 'none' })
      sheet.append(fold)
      el.append(sheet)
      const S = 56 // 折起来时的小方块边长
      await loop(1050, (p) => {
        // 0~0.12：小方块弹出来；0.12~0.55：横向展开；0.5~1：纵向展开
        const pop = ease.outBack(seg(p, 0, 0.12), 2)
        const ph = ease.inOutCubic(seg(p, 0.12, 0.55))
        const pv = ease.inOutCubic(seg(p, 0.5, 1))
        const ww = S * pop + (w + 12 - S) * ph
        const hh = S * pop + (h + 12 - S) * pv
        // 展开时从点击点向整个屏幕过渡：左上角从"以点击点为中心"移到 (-6, -6)
        const cx = origin.x + (w / 2 - origin.x) * ph
        const cy = origin.y + (h / 2 - origin.y) * pv
        Object.assign(sheet.style, { left: `${cx - ww / 2}px`, top: `${cy - hh / 2}px`, width: `${ww}px`, height: `${hh}px` })
        const crease = (1 - ph) * 0.5 + (ph >= 1 ? (1 - pv) * 0.4 : 0)
        fold.style.background = ph < 1
          ? `linear-gradient(90deg, transparent 30%, rgba(0,0,0,${crease}) 50%, transparent 70%)`
          : `linear-gradient(180deg, transparent 30%, rgba(0,0,0,${crease}) 50%, transparent 70%)`
      })
      Object.assign(sheet.style, { left: '-6px', top: '-6px', width: `${w + 12}px`, height: `${h + 12}px`, boxShadow: 'none' })
      fold.remove()
    },
    async reveal() {
      // 页面背景就是同一张蓝图：覆盖层淡出即可，页面内容由页面自己渐入
      await loop(450, (p) => (el.style.opacity = String(1 - ease.inOutQuad(p))))
      el.remove()
    },
  }
}
