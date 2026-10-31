# GearBackground.vue 说明

## 文件路径
`src/preview/components/GearBackground.vue`

## 文件用途
预览页机械工业动态背景组件：在内容底层铺一层「慢速旋转齿轮 + 蓝色图纸网格 + 上浮火星粒子」的固定背景，强化机械动力（Create）的工业纵深氛围。纯 CSS 动画实现，不占用 JS 主线程。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `gears` 配置数组 | 每个齿轮一项（尺寸/位置/转速/转向/透明度），把背景参数集中成数据，便于服主后续调整密度与节奏。 |
| `particles` 数组 | 用确定性公式生成 24 颗火星粒子的位置/延迟/时长/尺寸，保证每次渲染视觉一致（不用随机数避免抖动）。 |
| `TEETH = 10` | 齿轮齿数量；`v-for="n in TEETH"` 生成 10 个矩形轮齿并绕圆心均布，构成齿轮外齿。 |
| `.preview-bg` | 固定全屏背景层：`pointer-events: none` 不拦截鼠标、`z-index: 0` 位于内容之下。 |
| `.preview-bg__grid` | 蓝图网格：两条线性渐变交叉成 48px 细线网格，模拟工程蓝图。 |
| `.preview-bg__gear svg` + `@keyframes preview-bg-spin` | 齿轮 SVG 无限旋转；`.is-reverse` 反转方向，用「相邻齿轮反向 + 不同转速」营造啮合感。 |
| `.preview-bg__particle` + `@keyframes preview-bg-rise` | 火星粒子从底部上浮并边升边淡出。 |
| `.preview-bg__fade` | 底部渐隐遮罩，让背景在内容区边缘自然收淡，避免喧宾夺主。 |

## TODO 备注清单
- TODO-ASSET: 齿轮为内联 SVG 占位（10 齿圆角矩形 + 描边外圈 + 虚线内圈 + 轴心孔），如需真实齿轮素材可替换为图片/更精细的 SVG。
