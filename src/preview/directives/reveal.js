/**
 * 文件用途：预览页滚动入场动画指令（v-reveal）
 * 作用：为任意元素提供「滚入视口时淡入上浮」的入场动画；
 *       用法 <div v-reveal> 或 <div v-reveal="0.15">（0.15 为延迟秒数，用于子项错峰 stagger）。
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 原因：ScrollTrigger 是 GSAP 的插件，需显式注册后才能用 scrollTrigger 配置。
gsap.registerPlugin(ScrollTrigger)

// 作用：读取用户「减少动态效果」偏好。
// 原因：无障碍要求——用户开启系统减少动效时，元素应直接可见、不播放位移动画。
const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const reveal = {
  /**
   * 作用：元素挂载后配置入场动画。
   * 参数：binding.value 为延迟秒数（默认 0），用于子项错峰入场。
   */
  mounted(el, binding) {
    // 原因：减少动效用户直接跳过动画，保持元素默认可见，避免内容「卡在透明」。
    if (prefersReducedMotion) return

    const delay = typeof binding.value === 'number' ? binding.value : 0

    // 作用：先把元素设为透明并下移，作为动画起点。
    gsap.set(el, { opacity: 0, y: 28 })

    // 作用：滚动到元素进入视口 85% 位置时，淡入并上浮归位，且只播放一次。
    // 原因：once:true 保证动画不因来回滚动重复触发，性能与体验更稳。
    // 原因：把 tween 挂到元素上，卸载时可精确销毁「本元素」的动画与 ScrollTrigger。
    el._revealTween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    })
  },

  /**
   * 作用：元素卸载前销毁其 tween 与 ScrollTrigger，避免内存泄漏。
   * 原因：原实现每卸载一个元素都遍历全部 ScrollTrigger（O(n²)），且只销毁触发器、不销毁 tween 本身；
   *       改为直接销毁挂在元素上的实例，开销 O(1) 且清理完整。
   */
  unmounted(el) {
    const tween = el._revealTween
    if (!tween) return
    tween.scrollTrigger?.kill()
    tween.kill()
    el._revealTween = null
  },
}
