/**
 * 文件用途：积分站转场——"兑换柜台的卷帘门"
 * 盖上：一扇黄铜卷帘门从屏幕顶端哗啦一下拉下来，落地时弹一下；门中间挂着"积分站"招牌和一枚旋转的金币；
 * 切换：门关着的时候进入积分站；
 * 揭开：卷帘门一节一节往上卷起，露出积分站的柜台。
 * 外观：每一节门板是横向的黄铜条（上亮下暗 + 深色描边），本站原创绘制。
 */
import { ease, layer, loop } from './util'

export function shutterEffect() {
  let el = null
  let door = null
  let sign = null
  return {
    async cover() {
      el = layer()
      door = document.createElement('div')
      Object.assign(door.style, {
        position: 'absolute',
        left: '0',
        right: '0',
        top: '0',
        height: '100%',
        background: 'repeating-linear-gradient(180deg, #ffd27a 0 3px, #e8b24a 3px 20px, #a8742a 20px 30px, #3b2208 30px 34px)',
        boxShadow: 'inset 0 -12px 0 #2a1a08, 0 10px 30px rgba(0,0,0,0.6)',
        transform: 'translateY(-100%)',
        willChange: 'transform',
      })
      sign = document.createElement('div')
      sign.innerHTML = '<b style="display:inline-block;width:46px;height:46px;margin-right:16px;vertical-align:middle;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff3c4,#ffc93c 45%,#a8742a);box-shadow:0 0 0 3px #2a1a08;animation:mctp-coin 0.6s linear infinite"></b>积分站'
      Object.assign(sign.style, {
        position: 'absolute',
        left: '50%',
        bottom: '30%',
        transform: 'translateX(-50%)',
        padding: '14px 30px',
        fontFamily: "'Site Pixel', SimSun, serif",
        fontSize: 'clamp(28px, 5vw, 48px)',
        color: '#fff3c4',
        background: '#2a1a08',
        boxShadow: '0 0 0 4px #e8b24a, 0 0 0 7px #2a1a08',
        whiteSpace: 'nowrap',
      })
      const style = document.createElement('style')
      style.textContent = '@keyframes mctp-coin{0%{transform:scaleX(1)}50%{transform:scaleX(0.1)}100%{transform:scaleX(1)}}'
      door.append(sign, style)
      el.append(door)
      // 拉下来：重力加速，落地弹两下
      await loop(700, (p) => {
        const y = p < 0.7 ? ease.inQuad(p / 0.7) : 1 - Math.abs(Math.sin(((p - 0.7) / 0.3) * Math.PI * 2)) * 0.04 * (1 - p)
        door.style.transform = `translateY(${(-100 + y * 100).toFixed(2)}%)`
      })
      door.style.transform = 'translateY(0)'
    },
    async reveal() {
      // 卷上去：先慢后快，招牌跟着门一起走
      await loop(850, (p) => (door.style.transform = `translateY(${(-ease.inCubic(p) * 102).toFixed(2)}%)`))
      el.remove()
    },
  }
}
