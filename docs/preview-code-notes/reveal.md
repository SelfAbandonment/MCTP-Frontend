# reveal.js（v-reveal 指令）说明

## 文件路径
`src/preview/directives/reveal.js`

## 文件用途
预览页滚动入场动画指令：为任意元素提供「滚入视口时淡入上浮」的入场动画，供 `src/preview/` 下多个组件复用。用法：`<div v-reveal>` 或 `<div v-reveal="0.15">`（0.15 为延迟秒数，用于子项错峰 stagger）。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `import { ScrollTrigger } from 'gsap/ScrollTrigger'` + `gsap.registerPlugin(ScrollTrigger)` | ScrollTrigger 是 GSAP 插件，需显式注册后才能使用 `scrollTrigger` 配置。 |
| `prefersReducedMotion` | 读取系统「减少动态效果」偏好；开启时跳过动画，元素保持默认可见，满足无障碍要求。 |
| `mounted(el, binding)` | 元素挂载后 `gsap.set` 设为透明并下移，再用 `gsap.to` 在滚入视口时淡入上浮归位。 |
| `binding.value` | 作为延迟秒数（默认 0），组件里用 `v-reveal="i * 0.08"` 实现子项错峰入场。 |
| `scrollTrigger: { trigger: el, start: 'top 85%', once: true }` | 元素顶部进入视口 85% 处触发；`once: true` 保证只播放一次，来回滚动不重复触发。 |
| `unmounted(el)` | 卸载时遍历并 kill 该元素绑定的 ScrollTrigger，避免内存泄漏。 |

## 注册位置
- 注册：各组件内局部注册 `import { reveal as vReveal } from '@/preview/directives/reveal'`（不再改 `src/main.js`）。
- 清理：`mounted` 时把 tween 存到 `el._revealTween`，`unmounted` 时直接销毁该 tween 及其 ScrollTrigger（原先遍历全部 ScrollTrigger，O(n²) 且未销毁 tween 本身）。

## TODO 备注清单
- 无
