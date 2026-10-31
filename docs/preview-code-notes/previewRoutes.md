---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_f74bb8ffd4a811f1a0da525400393706
    ReservedCode1: VL2yCNJIr5euDsH5eHRFKnaVNgByd/wr7Co4EzSqbJup0xh71JdbMeJzKMjHh3uUNQT4fzdMYFYXEzOZIFflxQSpYYPCi4+2XWYhKf9wtFmxuZ6w7IHxMsAPs/gk2o0OPyfBVlpx5A/NDds7aWJ24pkQL3xzOqG4RxGnR8wy5Lc5ROkt6DnhsKr2Ej8=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_f74bb8ffd4a811f1a0da525400393706
    ReservedCode2: VL2yCNJIr5euDsH5eHRFKnaVNgByd/wr7Co4EzSqbJup0xh71JdbMeJzKMjHh3uUNQT4fzdMYFYXEzOZIFflxQSpYYPCi4+2XWYhKf9wtFmxuZ6w7IHxMsAPs/gk2o0OPyfBVlpx5A/NDds7aWJ24pkQL3xzOqG4RxGnR8wy5Lc5ROkt6DnhsKr2Ej8=
---

# previewRoutes.js 说明

## 文件路径
`src/preview/router/previewRoutes.js`

## 文件用途
预览页自身的路由定义，被主路由表 `src/router/index.js` 展开合并。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `{ path: '/preview', name: 'preview', component: () => import('@/preview/PreviewApp.vue') }` | 追加 `/preview` 路由，**路由懒加载**：只有进入 `/preview` 才下载预览页代码。原先静态 import 会把预览页组件、GSAP ScrollTrigger、主题 CSS、Google Fonts 请求打进主站入口包（主站 JS 209 kB → 现 121 kB，CSS 47 kB → 18 kB）。 |
| `meta: { chrome: false, title: '机械动力官网预览 · MCTP' }` | `chrome: false` 让现有 `App.vue` 不渲染全局 Header/Footer，预览页独立全屏展示；title 用于浏览器标签标题。 |

## TODO 备注清单
- 无（骨架阶段为单页，二级页面路由待后续功能填充时扩展）。
